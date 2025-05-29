const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/mailSubscriptionController');

router.get('/subscribers', subscriptionController.getSubscribers);
router.post('/request-subscribe', subscriptionController.requestSubscribe);
router.get('/confirm-subscription', subscriptionController.confirmSubscription);

module.exports = router;
