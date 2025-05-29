const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'algorstack@gmail.com',
    pass: 'dxafnjaznddelqqx' // Use app password
  }
});

async function sendConfirmationEmail({ to, name, confirmUrl }) {
  const mailOptions = {
   from: 'algorstack@gmail.com',
    to,
    subject: 'Confirm your subscription',
    html: `<p>Hello ${name || ''},</p>
           <p>Please confirm your subscription by clicking the link below:</p>
           <a href="${confirmUrl}">Confirm Subscription</a>`
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendConfirmationEmail };
