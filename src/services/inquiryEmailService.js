const nodemailer = require('nodemailer');

function getMailConfig() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, INQUIRY_FROM_EMAIL, INQUIRY_TO_EMAIL } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !INQUIRY_FROM_EMAIL || !INQUIRY_TO_EMAIL) {
    return null;
  }
  return {
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === 'true',
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
    from: INQUIRY_FROM_EMAIL,
    to: INQUIRY_TO_EMAIL,
  };
}

exports.isConfigured = () => Boolean(getMailConfig());

exports.sendInquiry = async inquiry => {
  const config = getMailConfig();
  if (!config) return { configured: false, sent: false };
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
    disableFileAccess: true,
    disableUrlAccess: true,
  });
  try {
    await transporter.sendMail({
      from: config.from,
      to: config.to,
      replyTo: inquiry.email,
      subject: 'Nouvelle demande de produits Khatra',
      text: [
        `Nom : ${inquiry.name}`,
        `Entreprise : ${inquiry.company || '—'}`,
        `Email : ${inquiry.email}`,
        `Téléphone : ${inquiry.phone || '—'}`,
        '',
        inquiry.message,
      ].join('\n'),
    });
    return { configured: true, sent: true };
  } finally {
    transporter.close();
  }
};
