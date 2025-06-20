const crypto = require('crypto');
const { sendConfirmationEmail } = require('../services/emailService');
const { subscribeUser, getSubscribers } = require('../services/mailchimpService');

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';
require('dotenv').config({ path: envFile });
const tokenStore = require('../utils/tokenStore');
const BASE_URL = `${process.env.BASE_URL}/v1`;

exports.getSubscribers = async (req, res) => {
  try {
    const data = await getSubscribers();
    res.status(200).json({ message: 'Fetched subscribers successfully', data });
  } catch (error) {
    res.status(error.response?.status || 500).json({
      message: 'Failed to fetch subscribers',
      error: error.response?.data || error.message
    });
  }
};

exports.requestSubscribe = async (req, res) => {
  const { email, name, subject, message } = req.body;

  if (!email) return res.status(400).json({ error: 'Email is required' });

  const token = crypto.randomBytes(20).toString('hex');
  tokenStore.addToken(token, { email, name, subject, message });

  const confirmUrl = `${BASE_URL}/confirm-subscription?token=${token}`;

  try {
    await sendConfirmationEmail({ to: email, name, confirmUrl });
    res.status(200).json({ message: 'Confirmation email sent' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send confirmation email', details: error.message });
  }
};

exports.confirmSubscription = async (req, res) => {
  const { token } = req.query;

  if (!token || !tokenStore.getTokenData(token)) {
    return res.status(400).send('Invalid or expired confirmation token');
  }

  const { email, name, subject, message } = tokenStore.getTokenData(token);
  tokenStore.deleteToken(token);

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
    await subscribeUser(data);
    res.send('✅ THANK YOU. Subscription confirmed!');
  } catch (error) {
    res.status(error.response?.status || 500).send('❌ Failed to subscribe: ' + (error.response?.data?.detail || error.message));
  }
};
