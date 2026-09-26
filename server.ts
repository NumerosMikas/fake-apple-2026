import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json());

  // Lazy initialization of Gemini client
  const getGeminiClient = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return null;
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // Health check API
  app.get("/api/health", (_req, res) => {
    res.json({
      status: "ok",
      hasGeminiKey: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // Chat API endpoint connected to Google AI Studio Gemini API
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

      // Build structured contents array
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

      // Add the current user message
      contents.push({
        role: 'user',
        parts: [{ text: message.trim() }]
      });

      const systemInstruction = `És um especialista da Apple Portugal para o lançamento de 2026.
Responde sempre de forma clara, natural, prestável e em Português de Portugal (PT-PT).

REGRA MANDATÓRIA:
NUNCA te apresentes como "Sou o assistente virtual..." ou frases semelhantes robóticas. Responde diretamente à dúvida do utilizador com tom profissional, elegante e conversacional.

Contexto oficial dos produtos e serviços Apple Portugal:
- Data de Lançamento: 18 de setembro de 2026 para iPhone 18 Pro, Apple Watch Series 12 e AirPods 5.
- iPhone Duo (Dobrável): Pré-reservas a partir de 16 de outubro às 13h; lançamento a 23 de outubro.
- Preços em Portugal:
  * iPhone 18 Pro: Desde 1.349 € (ou 24x 44,95 €/mês sem juros).
  * iPhone Duo: Desde 1.899 € (ou 24x 63,30 €/mês sem juros).
  * Apple Watch Series 12: Desde 459 € (ou 24x 15,30 €/mês sem juros).
  * MacBook Pro M5: Desde 2.049 € (ou 24x 68,30 €/mês sem juros).
  * AirPods 5 com Cancelamento Ativo de Ruído: Desde 199 €.
- Campanha de Educação (Universidade / Back to School): Cartão-oferta Apple de 80 € a 120 € na compra de Mac ou iPad elegível para estudantes e docentes.
- Apple Trade In: Retoma do equipamento antigo com desconto direto imediato de até 350 € a 420 €.
- Garantia: 3 anos de garantia legal integral em Portugal (Diretiva UE) e 14 dias para devolução gratuita com reembolso total.
- Pagamentos: MB WAY, Apple Pay, Cartões de crédito, e financiamento até 24 ou 36 meses sem juros (TAEG 0%).
- Demonstrações & Agendamento: O utilizador pode agendar uma sessão 1:1 de 30 minutos com o especialista Miguel D. Santos através do módulo Cal.com oficial (cal.com/miguelds/30min) sincronizado com Google Calendar na secção #agendamento da página.
- Apoio Telefónico Gratuito: 800 207 758.

Mantém as respostas concisas e bem formatadas para leitura rápida num widget de chat móvel/desktop.`;

      const modelsToTry = ["gemini-3.8-flash", "gemini-3.1-flash-lite", "gemini-flash-latest"];
      let response = null;
      const errors: string[] = [];

      for (const modelName of modelsToTry) {
        // Try up to 2 times for each model in case of transient 503 spike
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            response = await ai.models.generateContent({
              model: modelName,
              contents,
              config: {
                systemInstruction,
                temperature: 0.7,
              }
            });
            if (response && response.text) {
              break;
            }
          } catch (err: any) {
            const msg = err?.message || String(err);
            errors.push(`[${modelName} attempt ${attempt}]: ${msg}`);
            // If it's a 503 spike, wait a moment before retrying
            if (attempt < 2 && msg.includes("503")) {
              await new Promise(r => setTimeout(r, 600));
            }
          }
        }
        if (response && response.text) {
          break;
        }
      }

      if (!response || !response.text) {
        console.warn("Gemini API models experienced temporary high demand, serving domain response fallback. Errors:", errors);
        const fallbackReply = getDomainReply(message);
        return res.json({ reply: fallbackReply });
      }

      const reply = response.text;
      return res.json({ reply });
    } catch (err: any) {
      console.error("Gemini API chat error:", err);
      const fallbackReply = getDomainReply(req.body?.message || "");
      return res.json({ reply: fallbackReply });
    }
  });

  function getDomainReply(message: string): string {
    const lower = (message || "").toLowerCase();

    if (/preço|preco|quanto custa|valor|mensalidade|prestação|prestacao/i.test(lower)) {
      if (/mac|macbook/i.test(lower)) {
        return "O **MacBook Pro M5** está disponível desde **2.049 €** (ou 68,30 €/mês em 24 prestações sem juros TAEG 0%). Inclui até 22 horas de autonomia e o ecrã Liquid Retina XDR.";
      }
      if (/watch/i.test(lower)) {
        return "O **Apple Watch Series 12** está disponível a partir de **459 €** (ou 15,30 €/mês em 24x sem juros). O Apple Watch Ultra 4 está disponível para quem procura autonomia e expedições.";
      }
      if (/duo/i.test(lower)) {
        return "O inovador **iPhone Duo Dobrável** tem um preço de partida de **1.899 €** (ou 63,30 €/mês em 24x sem juros). As pré-reservas abrem a 16 de outubro às 13h.";
      }
      if (/airpod/i.test(lower)) {
        return "Os novos **AirPods 5** com Cancelamento Ativo de Ruído adaptativo e Som Espacial estão disponíveis desde **199 €**.";
      }
      return "Os preços oficiais de referência em Portugal para o alinhamento 2026 são:\n\n* **iPhone 18 Pro**: Desde 1.349 € (ou 24x 44,95 €/mês)\n* **iPhone Duo Dobrável**: Desde 1.899 € (ou 24x 63,30 €/mês)\n* **MacBook Pro M5**: Desde 2.049 € (ou 24x 68,30 €/mês)\n* **Apple Watch Series 12**: Desde 459 € (ou 24x 15,30 €/mês)\n* **AirPods 5**: Desde 199 €\n\nTodos os equipamentos beneficiam de financiamento a 24 meses sem juros com TAEG 0%.";
    }

    if (/agendar|agendamento|reunião|reuniao|marcar|demonstração|demonstracao|especialista|cal\.?com|meet/i.test(lower)) {
      return "Pode agendar uma sessão individual de 30 minutos com o especialista Miguel D. Santos através do widget oficial do **Cal.com** (cal.com/miguelds/30min), com sincronização direta no seu Google Calendar, na secção **Agendamento** da página.";
    }

    if (/trade in|retoma|troca|usado|antigo|desconto/i.test(lower)) {
      return "Com o programa **Apple Trade In**, pode entregar o seu smartphone ou equipamento atual e receber um crédito imediato até 350 € a 420 € deduzido diretamente na sua nova encomenda ou pré-reserva.";
    }

    if (/lançamento|lancamento|data|quando sai|quando chega|disponível|disponivel|setembro|outubro/i.test(lower)) {
      return "O **iPhone 18 Pro**, o **Apple Watch Series 12** e os **AirPods 5** chegam às lojas e entregas oficiais a **18 de setembro de 2026**. As pré-reservas do dobrável **iPhone Duo** abrem a **16 de outubro às 13h**, com disponibilidade física a 23 de outubro.";
    }

    if (/garantia|devolução|devolucao|prazo|3 anos/i.test(lower)) {
      return "Todos os equipamentos adquiridos beneficiam de **3 anos de garantia legal integral** segundo as diretivas europeias e legislação portuguesa, e dispõe de **14 dias** após a receção para devolução gratuita com reembolso total.";
    }

    if (/pagamento|mbway|mb way|apple pay|crédito|credito|financiamento/i.test(lower)) {
      return "Disponibilizamos MB WAY, Apple Pay, cartões de crédito Visa/Mastercard e soluções de financiamento até 24 ou 36 meses sem juros (TAEG 0%) através dos parceiros bancários em Portugal.";
    }

    if (/educação|educacao|estudante|professor|docente|universidade|escola/i.test(lower)) {
      return "Na Campanha de Educação para estudantes universitários e docentes qualificados, recebe um **cartão-oferta Apple de 80 € a 120 €** e desconto de educação direto na compra de um novo Mac ou iPad.";
    }

    return "Pode colocar qualquer questão sobre os lançamentos Apple 2026, reservas prioritárias do iPhone 18 Pro e iPhone Duo, preços, garantia de 3 anos ou agendamento de sessões com especialistas no Cal.com. Para assistência telefónica gratuita em Portugal, ligue 800 207 758.";
  }

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
