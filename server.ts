import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import crypto from "crypto";

import {
  getFirebaseConfig,
  initCatalogoIfNeeded,
  getCatalogo,
  savePedido,
  getPedido,
  updatePedido,
  listPedidos,
  saveProposta,
  getProposta,
  getPropostaByToken,
  updateProposta,
  saveCatalogoItem
} from "./src/server/db.ts";
import { interpretarPedidoComGemini } from "./src/server/gemini.ts";
import {
  calcularPropostaBackend,
  criarObjetoProposta,
  formatarEuros
} from "./src/server/calculator.ts";
import { enviarNotificacaoPropostaAoAluno } from "./src/server/resend.ts";
import { renderPropostaHtml, renderPropostaErroHtml } from "./src/server/proposalTemplate.ts";
import type { Pedido } from "./src/server/types.ts";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Initialize Firestore catalog if empty
  await initCatalogoIfNeeded();

  // Lazy initialization of Gemini client for existing chat
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  };

  // Base URL helper
  const getAppBaseUrl = (req: express.Request): string => {
    if (process.env.APP_BASE_URL && process.env.APP_BASE_URL.startsWith('http')) {
      return process.env.APP_BASE_URL.replace(/\/$/, '');
    }
    const host = req.get('host') || `localhost:${PORT}`;
    const protocol = req.protocol === 'https' || req.get('x-forwarded-proto') === 'https' ? 'https' : 'http';
    return `${protocol}://${host}`;
  };

  // -------------------------------------------------------------
  // HEALTH CHECK
  // -------------------------------------------------------------
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY),
      hasResendKey: Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY !== 're_123456789'),
      emailAluno: process.env.EMAIL_ALUNO || null,
      adminUidConfigured: Boolean(process.env.ADMIN_UID)
    });
  });

  // -------------------------------------------------------------
  // PUBLIC: SUBMIT PROPOSAL REQUEST (PEDIDO DE PROPOSTA)
  // -------------------------------------------------------------
  app.post("/api/pedidos", async (req, res) => {
    try {
      const { nome, email, pedido } = req.body;

      // 1. Validation
      if (!nome || typeof nome !== 'string' || !nome.trim()) {
        return res.status(400).json({ error: "O campo Nome é obrigatório." });
      }
      if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
        return res.status(400).json({ error: "Introduza um endereço de e-mail com formato válido." });
      }
      if (!pedido || typeof pedido !== 'string' || !pedido.trim()) {
        return res.status(400).json({ error: "O campo Pedido de Proposta é obrigatório." });
      }

      if (nome.trim().length > 150) {
        return res.status(400).json({ error: "O nome não pode exceder 150 carateres." });
      }
      if (email.trim().length > 150) {
        return res.status(400).json({ error: "O e-mail não pode exceder 150 carateres." });
      }
      if (pedido.trim().length > 5000) {
        return res.status(400).json({ error: "O texto do pedido não pode exceder 5000 carateres." });
      }

      const pedidoId = `ped_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
      const now = new Date().toISOString();

      const novoPedido: Pedido = {
        id: pedidoId,
        nome: nome.trim(),
        email: email.trim().toLowerCase(),
        textoPedido: pedido.trim(),
        dataCriacao: now,
        dataAtualizacao: now,
        estadoProcessamento: 'recebido',
        interpretacaoIA: null,
        informacaoEmFalta: [],
        motivoRevisao: null,
        propostaId: null,
        errosProcessamento: []
      };

      // 2. Real persistence in Firestore
      await savePedido(novoPedido);

      // Respond immediately to the client so UI gets instant confirmation
      res.status(201).json({
        success: true,
        pedidoId,
        mensagem: "O seu pedido foi recebido com sucesso."
      });

      // 3. Asynchronously trigger AI processing, proposal calculation, and notification
      processarPedidoAsync(novoPedido, getAppBaseUrl(req)).catch((err) => {
        console.error(`Erro no processamento assíncrono do pedido ${pedidoId}:`, err);
      });
    } catch (err: any) {
      console.error("Erro ao guardar pedido:", err);
      res.status(500).json({ error: "Ocorreu um erro interno ao registar o seu pedido. Por favor, tente novamente." });
    }
  });

  // Background processor for proposal requests
  async function processarPedidoAsync(pedido: Pedido, baseUrl: string) {
    try {
      await updatePedido(pedido.id, { estadoProcessamento: 'em_analise' });

      // Fetch active commercial catalog from Firestore
      const catalogoAtivo = await getCatalogo(true);

      // Interpret request with Gemini structured output (never send name/email to Gemini)
      const interpretacao = await interpretarPedidoComGemini(pedido.textoPedido, catalogoAtivo);

      await updatePedido(pedido.id, {
        interpretacaoIA: interpretacao,
        informacaoEmFalta: interpretacao.informacaoEmFalta || [],
        motivoRevisao: interpretacao.motivoRevisao || null
      });

      // Backend calculation using catalog prices
      const calculo = calcularPropostaBackend(interpretacao, catalogoAtivo);

      if (!calculo.podeGerarProposta) {
        // Needs manual human review
        await updatePedido(pedido.id, {
          estadoProcessamento: 'necessita_revisao',
          motivoRevisao: calculo.motivoInvalido || interpretacao.motivoRevisao || 'Necessita de validação'
        });
        console.log(`Pedido ${pedido.id} assinalado para Necessita de Revisão: ${calculo.motivoInvalido}`);
        return;
      }

      // Create proposal with unpredictable token and snapshot of catalog items
      const proposta = criarObjetoProposta(
        pedido.id,
        interpretacao.resumo,
        calculo,
        baseUrl
      );

      await saveProposta(proposta);

      await updatePedido(pedido.id, {
        estadoProcessamento: 'proposta_criada',
        propostaId: proposta.id
      });

      console.log(`Proposta ${proposta.numero} criada para o pedido ${pedido.id}. Token: ${proposta.token}`);

      // Internal student notification via Resend
      const notifResultado = await enviarNotificacaoPropostaAoAluno(proposta, pedido.id);
      await updateProposta(proposta.id, { notificacaoAluno: notifResultado });
    } catch (err: any) {
      console.error(`Falha no pipeline de processamento do pedido ${pedido.id}:`, err);
      await updatePedido(pedido.id, {
        estadoProcessamento: 'erro',
        errosProcessamento: [err?.message || String(err)]
      });
    }
  }

  // -------------------------------------------------------------
  // PUBLIC: VIEW PROPOSAL BY TOKEN (/proposta/:token)
  // -------------------------------------------------------------
  app.get("/proposta/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const proposta = await getPropostaByToken(token);
      if (!proposta) {
        return res.status(404).send(renderPropostaErroHtml("Esta proposta não existe ou o link de acesso expirou."));
      }

      // Check validity date
      const agora = new Date().getTime();
      const validade = new Date(proposta.dataValidade).getTime();
      if (agora > validade) {
        return res.status(410).send(renderPropostaErroHtml(`O período de validade desta proposta (${new Date(proposta.dataValidade).toLocaleDateString('pt-PT')}) expirou. Por favor, solicite uma nova proposta.`));
      }

      res.setHeader("Content-Type", "text/html; charset=utf-8");
      res.setHeader("X-Robots-Tag", "noindex, nofollow");
      res.send(renderPropostaHtml(proposta));
    } catch (err: any) {
      console.error("Erro ao carregar proposta por token:", err);
      res.status(500).send(renderPropostaErroHtml("Ocorreu um erro ao carregar os dados da proposta."));
    }
  });

  // Controlled JSON endpoint for proposal data (never exposes client email or raw notes)
  app.get("/api/propostas/:token", async (req, res) => {
    try {
      const { token } = req.params;
      const proposta = await getPropostaByToken(token);
      if (!proposta) {
        return res.status(404).json({ error: "Proposta não encontrada" });
      }

      res.json({
        numero: proposta.numero,
        dataCriacao: proposta.dataCriacao,
        dataValidade: proposta.dataValidade,
        resumoAmbito: proposta.resumoAmbito,
        itens: proposta.itens.map((i) => ({
          nome: i.nome,
          descricao: i.descricao,
          unidadeVenda: i.unidadeVenda,
          quantidade: i.quantidade,
          precoUnitarioCentimos: i.precoUnitarioCentimos,
          subtotalCentimos: i.subtotalCentimos,
          condicoes: i.condicoes
        })),
        totalCentimos: proposta.totalCentimos,
        totalFormatado: formatarEuros(proposta.totalCentimos),
        condicoes: proposta.condicoes,
        propostaDemonstracao: proposta.propostaDemonstracao
      });
    } catch (err: any) {
      console.error("Erro ao consultar proposta por token:", err);
      res.status(500).json({ error: err?.message || "Erro ao consultar proposta" });
    }
  });

  // -------------------------------------------------------------
  // ADMIN AUTHENTICATION & AUTHORIZATION MIDDLEWARE
  // -------------------------------------------------------------
  async function verificarAdminAuth(req: express.Request, res: express.Response, next: express.NextFunction) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "Não autenticado: token de autorização ausente." });
    }

    const idToken = authHeader.split(" ")[1];
    const config = getFirebaseConfig();
    if (!config?.apiKey) {
      return res.status(500).json({ error: "Configuração do Firebase indisponível no servidor." });
    }

    try {
      // Verify Firebase ID Token via Google Identity Toolkit
      const verifyUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=${config.apiKey}`;
      const resp = await fetch(verifyUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken })
      });

      if (!resp.ok) {
        return res.status(401).json({ error: "Token de autenticação inválido ou expirado." });
      }

      const data = await resp.json();
      const user = data.users?.[0];
      if (!user) {
        return res.status(401).json({ error: "Utilizador não encontrado no fornecedor de identidade." });
      }

      const uid = user.localId;
      const email = (user.email || "").toLowerCase();

      // Authorization check against ADMIN_UID or student email from environment variables
      const envAdminUid = process.env.ADMIN_UID?.trim();
      const studentEmail = process.env.EMAIL_ALUNO?.trim().toLowerCase();

      const isAuthorized =
        (envAdminUid && uid === envAdminUid) ||
        (studentEmail && email === studentEmail);

      if (!isAuthorized) {
        console.warn(`Tentativa de acesso não autorizado: UID=${uid}, Email=${email}`);
        return res.status(403).json({
          error: `Acesso negado: o utilizador (${email}, UID: ${uid}) não está autorizado como administrador. Configure a variável ADMIN_UID com '${uid}'.`
        });
      }

      // Attach admin info to request
      (req as any).adminUser = { uid, email };
      next();
    } catch (err: any) {
      console.error("Erro na verificação de admin auth:", err);
      return res.status(500).json({ error: "Erro interno na verificação de permissões administrativas." });
    }
  }

  // -------------------------------------------------------------
  // ADMIN API ENDPOINTS
  // -------------------------------------------------------------
  app.get("/api/admin/firebase-config", (_req, res) => {
    const config = getFirebaseConfig();
    if (!config) return res.status(404).json({ error: "Firebase config not found" });
    res.json({
      apiKey: config.apiKey,
      authDomain: config.authDomain,
      projectId: config.projectId,
      storageBucket: config.storageBucket,
      messagingSenderId: config.messagingSenderId,
      appId: config.appId
    });
  });

  // List all requests with proposal details
  app.get("/api/admin/pedidos", verificarAdminAuth, async (req, res) => {
    try {
      const filtro = (req.query.filtro as string) || "todos";
      const pedidos = await listPedidos(filtro);

      // Populate proposal details if existing
      const pedidosCompletos = await Promise.all(
        pedidos.map(async (p) => {
          let propostaDetails = null;
          if (p.propostaId) {
            propostaDetails = await getProposta(p.propostaId);
          }
          return {
            ...p,
            propostaDetails
          };
        })
      );

      res.json(pedidosCompletos);
    } catch (err: any) {
      console.error("Erro ao listar pedidos no admin:", err);
      res.status(500).json({ error: "Erro ao consultar lista de pedidos." });
    }
  });

  // Reprocess a request with Gemini
  app.post("/api/admin/pedidos/:id/reprocessar", verificarAdminAuth, async (req, res) => {
    try {
      const pedido = await getPedido(req.params.id);
      if (!pedido) return res.status(404).json({ error: "Pedido não encontrado." });

      // Run processor
      await processarPedidoAsync(pedido, getAppBaseUrl(req));
      const updated = await getPedido(req.params.id);
      res.json({ success: true, pedido: updated });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Erro ao reprocessar pedido." });
    }
  });

  // Manually approve a request in review and generate official proposal
  app.post("/api/admin/pedidos/:id/aprovar", verificarAdminAuth, async (req, res) => {
    try {
      const pedido = await getPedido(req.params.id);
      if (!pedido) return res.status(404).json({ error: "Pedido não encontrado." });

      const { itens } = req.body; // array of { catalogoId, quantidade }
      if (!Array.isArray(itens) || itens.length === 0) {
        return res.status(400).json({ error: "Selecione pelo menos um item do catálogo para aprovar a proposta." });
      }

      const catalogo = await getCatalogo(false);
      const catMap = new Map(catalogo.map((c) => [c.id, c]));

      let totalCentimos = 0;
      const itensSnapshot = [];

      for (const i of itens) {
        const catItem = catMap.get(i.catalogoId);
        if (!catItem) continue;
        const qtd = Math.max(1, parseInt(i.quantidade, 10) || 1);
        const subtotal = qtd * catItem.precoUnitarioCentimos;
        totalCentimos += subtotal;

        itensSnapshot.push({
          catalogoId: catItem.id,
          nome: catItem.nome,
          descricao: catItem.descricao,
          unidadeVenda: catItem.unidadeVenda,
          precoUnitarioCentimos: catItem.precoUnitarioCentimos,
          quantidade: qtd,
          subtotalCentimos: subtotal,
          condicoes: catItem.condicoes,
          evidencia: "Aprovado manualmente em revisão administrativa"
        });
      }

      if (itensSnapshot.length === 0) {
        return res.status(400).json({ error: "Nenhum item válido selecionado." });
      }

      const proposta = criarObjetoProposta(
        pedido.id,
        pedido.interpretacaoIA?.resumo || `Fornecimento aprovado para ${pedido.nome}`,
        {
          podeGerarProposta: true,
          itensSnapshot,
          totalCentimos
        },
        getAppBaseUrl(req)
      );

      await saveProposta(proposta);

      await updatePedido(pedido.id, {
        estadoProcessamento: 'proposta_criada',
        propostaId: proposta.id,
        motivoRevisao: null
      });

      // Internal student notification via Resend
      const notif = await enviarNotificacaoPropostaAoAluno(proposta, pedido.id);
      await updateProposta(proposta.id, { notificacaoAluno: notif });

      res.json({ success: true, proposta });
    } catch (err: any) {
      console.error("Erro ao aprovar proposta manualmente:", err);
      res.status(500).json({ error: "Erro ao gerar proposta aprovada." });
    }
  });

  // Resend notification to student
  app.post("/api/admin/propostas/:id/reenviar-notificacao", verificarAdminAuth, async (req, res) => {
    try {
      const proposta = await getProposta(req.params.id);
      if (!proposta) return res.status(404).json({ error: "Proposta não encontrada." });

      const notif = await enviarNotificacaoPropostaAoAluno(proposta, proposta.pedidoId);
      await updateProposta(proposta.id, { notificacaoAluno: notif });
      res.json({ success: true, notificacao: notif });
    } catch (err: any) {
      res.status(500).json({ error: err?.message || "Erro ao reenviar notificação." });
    }
  });

  // Catalog management: list all
  app.get("/api/admin/catalogo", verificarAdminAuth, async (_req, res) => {
    try {
      const catalogo = await getCatalogo(false);
      res.json(catalogo);
    } catch (err: any) {
      res.status(500).json({ error: "Erro ao carregar catálogo." });
    }
  });

  // Catalog management: create or update item
  app.put("/api/admin/catalogo/:id", verificarAdminAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { nome, descricao, unidadeVenda, precoUnitarioCentimos, moeda, ativo, condicoes } = req.body;

      if (!nome || typeof precoUnitarioCentimos !== 'number') {
        return res.status(400).json({ error: "Nome e preço unitário são obrigatórios." });
      }

      const item = {
        id,
        nome: String(nome).trim(),
        descricao: String(descricao || '').trim(),
        unidadeVenda: unidadeVenda || 'unidade',
        precoUnitarioCentimos: Math.round(precoUnitarioCentimos),
        moeda: moeda || 'EUR',
        ativo: Boolean(ativo),
        condicoes: String(condicoes || '').trim()
      };

      await saveCatalogoItem(item as any);
      res.json({ success: true, item });
    } catch (err: any) {
      res.status(500).json({ error: "Erro ao salvar item no catálogo." });
    }
  });

  // Serve Admin Page
  app.get("/admin", (_req, res) => {
    res.sendFile(path.join(process.cwd(), "public", "admin.html"));
  });

  // -------------------------------------------------------------
  // EXISTING CHAT ASSISTANT API (KEPT UNCHANGED)
  // -------------------------------------------------------------
  app.post("/api/chat", async (req, res) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: "Mensagem obrigatória" });
      }

      const ai = getGeminiClient();
      if (!ai) {
        return res.status(200).json({
          reply: "Não foi possível aceder à chave da API Google AI Studio (GEMINI_API_KEY). Por favor, verifique se a chave está configurada no painel de Segredos/Definições."
        });
      }

      const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

      if (Array.isArray(history)) {
        for (const item of history.slice(-8)) {
          if ((item.role === 'user' || item.role === 'model') && typeof item.text === 'string' && item.text.trim()) {
            contents.push({
              role: item.role,
              parts: [{ text: item.text.trim() }]
            });
          }
        }
      }

      contents.push({
        role: 'user',
        parts: [{ text: message.trim() }]
      });

      const systemInstruction = `És um especialista da Apple Portugal para o lançamento de 2026.
Responde sempre de forma clara, natural, prestável e em Português de Portugal (PT-PT).
NUNCA te apresentes como "Sou o assistente virtual...". Responde diretamente à dúvida do utilizador com tom profissional.
Contexto oficial:
- iPhone 18 Pro (1.349 €), iPhone Duo (1.899 €), Apple Watch Series 12 (459 €), MacBook Pro M5 (2.049 €), AirPods 5 (199 €).
- Lançamento a 18/09. iPhone Duo a 16/10.
- Nova secção de Pedido de Proposta disponível na página para cotações empresariais ou em lote processadas por IA.
- Garantia de 3 anos, 14 dias para devoluções.
- Apoio telefónico gratuito: 800 207 758.`;

      const modelsToTry = [process.env.GEMINI_MODEL || "gemini-3.1-flash-lite", "gemini-3.8-flash", "gemini-flash-latest"];
      let response = null;

      for (const modelName of modelsToTry) {
        try {
          response = await ai.models.generateContent({
            model: modelName,
            contents,
            config: {
              systemInstruction,
              temperature: 0.7
            }
          });
          if (response && response.text) break;
        } catch (err: any) {
          console.warn(`Chat model ${modelName} attempt failed:`, err?.message);
        }
      }

      if (!response || !response.text) {
        return res.json({ reply: "Pode efetuar o seu pedido de proposta comercial diretamente na secção 'Pedido de Proposta' ou agendar uma reunião com especialista no Cal.com." });
      }

      return res.json({ reply: response.text });
    } catch (err: any) {
      console.error("Gemini API chat error:", err);
      return res.json({ reply: "Pode contactar a equipa Apple Portugal através do número gratuito 800 207 758." });
    }
  });

  // -------------------------------------------------------------
  // VITE / STATIC MIDDLEWARES
  // -------------------------------------------------------------
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
