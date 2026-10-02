import { Resend } from 'resend';
import type { NotificacaoAluno, Proposta } from './types.ts';
import { formatarEuros } from './calculator.ts';

export async function enviarNotificacaoPropostaAoAluno(
  proposta: Proposta,
  pedidoRefId: string
): Promise<NotificacaoAluno> {
  const apiKey = process.env.RESEND_API_KEY;
  const emailAluno = process.env.EMAIL_ALUNO;

  // 1. Check for missing configuration
  if (!apiKey || apiKey === 're_123456789' || !apiKey.trim()) {
    console.warn('Resend: RESEND_API_KEY não configurada no ambiente.');
    return {
      estado: 'nao_configurado',
      resendId: null,
      dataTentativa: new Date().toISOString(),
      erro: 'Falta configurar RESEND_API_KEY no painel de Segredos/Ambiente.'
    };
  }

  if (!emailAluno || !emailAluno.includes('@')) {
    console.warn('Resend: EMAIL_ALUNO não configurado no ambiente.');
    return {
      estado: 'nao_configurado',
      resendId: null,
      dataTentativa: new Date().toISOString(),
      erro: 'Falta configurar EMAIL_ALUNO com o email associado à sua conta Resend.'
    };
  }

  const resend = new Resend(apiKey);
  const dataTentativa = new Date().toISOString();
  const assunto = `Nova proposta gerada — Apple Portugal (${proposta.numero})`;
  const totalFormatado = formatarEuros(proposta.totalCentimos);

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="pt-PT">
    <head>
      <meta charset="utf-8">
      <title>${assunto}</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f5f5f7; color: #1d1d1f; margin: 0; padding: 24px; }
        .card { background-color: #ffffff; max-width: 580px; margin: 0 auto; border-radius: 16px; border: 1px solid #e5e5ea; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #1b030b 0%, #380614 100%); color: #ffffff; padding: 24px 32px; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 700; letter-spacing: -0.5px; }
        .header p { margin: 4px 0 0 0; color: #fda4af; font-size: 13px; }
        .body { padding: 32px; font-size: 14px; line-height: 1.6; }
        .info-box { background-color: #fbfbfd; border: 1px solid #e5e5ea; border-radius: 12px; padding: 16px; margin: 20px 0; }
        .info-row { display: flex; justify-content: space-between; margin-bottom: 8px; font-size: 13px; }
        .info-row:last-child { margin-bottom: 0; }
        .label { color: #86868b; }
        .value { font-weight: 600; color: #1d1d1f; }
        .btn-container { text-align: center; margin: 30px 0 20px 0; }
        .btn { display: inline-block; background-color: #000000; color: #ffffff !important; padding: 12px 28px; border-radius: 980px; text-decoration: none; font-weight: 600; font-size: 14px; }
        .link-text { word-break: break-all; color: #9d173b; font-size: 12px; }
        .footer { background-color: #f5f5f7; border-top: 1px solid #e5e5ea; padding: 16px 32px; font-size: 11px; color: #86868b; text-align: center; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1> Apple Portugal • Lançamento 2026</h1>
          <p>Notificação interna de proposta gerada por IA</p>
        </div>
        <div class="body">
          <p>Olá,</p>
          <p>Foi submetido um novo pedido na landing page e a proposta correspondente foi gerada automaticamente pelo backend através do catálogo de preços oficial.</p>
          
          <div class="info-box">
            <div class="info-row">
              <span class="label">N.º da Proposta:</span>
              <span class="value">${proposta.numero}</span>
            </div>
            <div class="info-row">
              <span class="label">Ref. Pedido:</span>
              <span class="value">${pedidoRefId}</span>
            </div>
            <div class="info-row">
              <span class="label">Itens Incluídos:</span>
              <span class="value">${proposta.itens.length} produto(s) / serviço(s)</span>
            </div>
            <div class="info-row">
              <span class="label">Total sem IVA:</span>
              <span class="value" style="color: #9d173b; font-size: 15px;">${totalFormatado}</span>
            </div>
          </div>

          <div class="btn-container">
            <a href="${proposta.linkProposta}" class="btn" target="_blank">Consultar Proposta &rarr;</a>
          </div>

          <p style="margin-top: 24px; font-size: 12px; color: #6e6e73;">
            Se o botão não funcionar, utilize a seguinte ligação direta:<br/>
            <a href="${proposta.linkProposta}" class="link-text">${proposta.linkProposta}</a>
          </p>
        </div>
        <div class="footer">
          Modo de aula: as notificações são enviadas exclusivamente para o email do aluno titular da conta Resend. Os clientes não recebem emails.
        </div>
      </div>
    </body>
    </html>
  `;

  const textContent = `
Nova proposta gerada — Apple Portugal

Foi gerada uma nova proposta com base no pedido ${pedidoRefId}:
N.º da Proposta: ${proposta.numero}
Total sem IVA: ${totalFormatado}
Itens: ${proposta.itens.length}

Pode consultar a proposta no link abaixo:
${proposta.linkProposta}

Nota: Modo de aula. Esta notificação é enviada exclusivamente para o email do aluno (${emailAluno}).
  `.trim();

  try {
    const { data, error } = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: [emailAluno.trim()],
      subject: assunto,
      html: htmlContent,
      text: textContent
    });

    if (error) {
      console.error('Erro na resposta do Resend:', error);
      let errorMsg = error.message || 'Erro no envio via Resend';
      if (errorMsg.toLowerCase().includes('only send testing emails to your own email address') || errorMsg.toLowerCase().includes('domain')) {
        errorMsg = `Resend: Em modo de teste (onboarding@resend.dev), o destinatário (${emailAluno}) tem de ser exatamente o mesmo email associado à sua conta Resend.`;
      }
      return {
        estado: 'falhou',
        resendId: null,
        dataTentativa,
        erro: errorMsg
      };
    }

    console.log(`Notificação enviada com sucesso ao aluno via Resend. ID: ${data?.id}`);
    return {
      estado: 'aceite_pelo_servico',
      resendId: data?.id || null,
      dataTentativa,
      erro: null
    };
  } catch (err: any) {
    console.error('Exceção ao chamar API Resend:', err);
    return {
      estado: 'falhou',
      resendId: null,
      dataTentativa,
      erro: err?.message || String(err)
    };
  }
}
