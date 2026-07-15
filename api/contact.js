const DEFAULT_TO_EMAIL = 'contato@upscrum.com.br';
const DEFAULT_FROM_EMAIL = 'Upscrum <onboarding@resend.dev>';

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing RESEND_API_KEY' });
  }

  const name = String(req.body?.name || '').trim();
  const email = String(req.body?.email || '').trim();
  const whatsapp = String(req.body?.whatsapp || '').trim();
  const message = String(req.body?.message || '').trim();

  if (!name || !email || !message || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Invalid contact data' });
  }

  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeWhatsapp = whatsapp ? escapeHtml(whatsapp) : 'Não informado';
  const safeMessage = escapeHtml(message).replace(/\n/g, '<br>');

  const resendResponse = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: process.env.CONTACT_FROM_EMAIL || DEFAULT_FROM_EMAIL,
      to: [process.env.CONTACT_TO_EMAIL || DEFAULT_TO_EMAIL],
      reply_to: email,
      subject: `Novo contato pelo site - ${name}`,
      html: `
        <h2>Novo contato pelo site</h2>
        <p><strong>Nome:</strong> ${safeName}</p>
        <p><strong>E-mail:</strong> ${safeEmail}</p>
        <p><strong>WhatsApp:</strong> ${safeWhatsapp}</p>
        <p><strong>Mensagem:</strong></p>
        <p>${safeMessage}</p>
      `,
      text: `Novo contato pelo site\n\nNome: ${name}\nE-mail: ${email}\nWhatsApp: ${whatsapp || 'Não informado'}\n\nMensagem:\n${message}`
    })
  });

  if (!resendResponse.ok) {
    return res.status(502).json({ error: 'Email provider error' });
  }

  return res.status(200).json({ ok: true });
}
