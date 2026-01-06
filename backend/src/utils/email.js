let nodemailer;
try {
  nodemailer = require('nodemailer');
} catch (e) {
  nodemailer = null;
}

const createTransport = () => {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!nodemailer) {
    console.warn('nodemailer not installed — email sending disabled (emails will be logged)');
    return null;
  }

  if (!host || !port || !user || !pass) {
    console.warn('SMTP configuration missing — emails will be logged instead of sent');
    return null;
  }

  return nodemailer.createTransport({
    host,
    port: Number(port),
    secure: Number(port) === 465,
    auth: { user, pass }
  });
};

const sendMail = async ({ to, subject, html, text, from }) => {
  const transporter = createTransport();
  if (!transporter) {
    console.log('--- EMAIL (logged, not sent) ---');
    console.log('to:', to);
    console.log('subject:', subject);
    console.log('from:', from || process.env.FROM_EMAIL);
    console.log('text:', text);
    console.log('html:', html);
    console.log('--- END EMAIL ---');
    return Promise.resolve({ logged: true });
  }

  const info = await transporter.sendMail({
    from: from || process.env.FROM_EMAIL,
    to,
    subject,
    text,
    html
  });
  return info;
};

module.exports = { sendMail };
