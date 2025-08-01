const express = require('express');
const bodyParser = require('body-parser');
const { USSDRegistrationSystem, USSDWebhookHandler } = require('./ussd-handler');

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const ussdSystem = new USSDRegistrationSystem();
const webhookHandler = new USSDWebhookHandler(ussdSystem);

// Africa's Talking USSD webhook endpoint
app.post('/ussd/africastalking', (req, res) => webhookHandler.handleAfricasTalkingWebhook(req, res));

// Generic USSD endpoint
app.post('/ussd/generic', (req, res) => webhookHandler.handleGenericWebhook(req, res));

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`USSD backend running on port ${PORT}`);
});
