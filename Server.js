/*
// server.js
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const MAILCHIMP_API_KEY = '5c248bbafaa1e0a6fddf53093cf1b02a-us17'; // Keep this safe
const LIST_ID = '00dd5a8102';
const DATACENTER = MAILCHIMP_API_KEY.split('-')[1]; // e.g., 'us17'
const pendingConfirmations = {}; // { token: { email, name, subject, message } }

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'algorstack@gmail.com',
    pass: 'dxafnjaznddelqqx' // use App Password, not your actual Gmail password
  }
});

//get contacts
app.get('/subscribers', async (req, res) => {
  try {
    const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

    // ✅ Define the response variable properly
    const response = await axios.get(url, {
      headers: {
        Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
        'Content-Type': 'application/json'
      }
    });

    res.status(200).json({
      message: 'Fetched subscribers successfully',
      data: response.data
    });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: 'Failed to fetch subscribers',
      error: error.response?.data || error.message
    });
  }
});

app.post('/request-subscribe', async (req, res) => {
  const { email, name, subject, message } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  const token = crypto.randomBytes(20).toString('hex');
  pendingConfirmations[token] = { email, name, subject, message };

  const confirmUrl = `http://localhost:3000/confirm-subscription?token=${token}`;

  const mailOptions = {
    from: 'algorstack@gmail.com',
    to: email,
    subject: 'Confirm your subscription',
    html: `<p>Hello ${name || ''},</p>
           <p>Please confirm your subscription by clicking the link below:</p>
           <a href="${confirmUrl}">Confirm Subscription</a>`
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'Confirmation email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send confirmation email', details: error.message });
  }
});


//post contact
app.get('/confirm-subscription', async (req, res) => {
  const { token } = req.query;

  if (!token || !pendingConfirmations[token]) {
    return res.status(400).send('Invalid or expired confirmation token');
  }

  const { email, name, subject, message } = pendingConfirmations[token];
  delete pendingConfirmations[token]; // Clean up

  const data = {
    email_address: email,
    status: 'subscribed',
    merge_fields: {
      FNAME: name || '',
      LNAME: '',
      SUBJECT: subject || '',
      MESSAGE: message || ''
    }
  };

  try {
    const response = await axios.post(
      `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`,
      data,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`anystring:${MAILCHIMP_API_KEY}`).toString('base64')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    res.send('✅ THANK YOU. Subscription confirmed!');
  } catch (error) {
    res.status(error.response?.status || 500).send('❌ Failed to subscribe: ' + (error.response?.data?.detail || error.message));
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

*/

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const subscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/', subscriptionRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
