const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/mailSubscriptionController');

router.get('/v1/subscribers', subscriptionController.getSubscribers);
router.post('/v1/request-subscribe', subscriptionController.requestSubscribe);
router.get('/v1/confirm-subscription', subscriptionController.confirmSubscription);

module.exports = router;
