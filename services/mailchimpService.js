const axios = require('axios');
require('dotenv').config();

const { LIST_ID, DATACENTER } = require('../config/mailchimp');
const API_KEY = `${process.env.MAILCHIMP_API_KEY}`;
const authHeader = `Basic ${Buffer.from(`anystring:${API_KEY}`).toString('base64')}`;

async function subscribeUser(data) {
  const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

  const response = await axios.post(url, data, {
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
}

async function getSubscribers() {
  const url = `https://${DATACENTER}.api.mailchimp.com/3.0/lists/${LIST_ID}/members`;

  const response = await axios.get(url, {
    headers: {
      Authorization: authHeader,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
}

module.exports = { subscribeUser, getSubscribers };
