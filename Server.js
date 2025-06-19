const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv'); // ✅ Required for loading env files

const subscriptionRoutes = require('./routes/subscriptionRoutes');

const app = express();

// ✅ Load correct .env file based on NODE_ENV
const env = process.env.NODE_ENV || 'development';
dotenv.config({ path: `.env.${env}` });

app.use(cors());
app.use(bodyParser.json());

// Routes
app.use('/', subscriptionRoutes);

// ✅ Use PORT from env if available
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running in ${env} mode`);
  console.log(`Base URL: ${process.env.BASE_URL}`);
});
