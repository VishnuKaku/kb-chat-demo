const express = require('express');
const axios = require('axios');
const winston = require('winston');
require('dotenv').config();

const app = express();
app.use(express.json());

// Configure logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  ]
});

// Configure API clients
const chatwootClient = axios.create({
  baseURL: process.env.CHATWOOT_API_URL || 'http://chatwoot:3000/api/v1',
  headers: {
    'api-access-token': process.env.CHATWOOT_API_KEY
  }
});

const outlineClient = axios.create({
  baseURL: process.env.OUTLINE_API_URL || 'http://outline:3001/api',
  headers: {
    'Authorization': `Bearer ${process.env.OUTLINE_API_KEY}`
  }
});

// Webhook endpoint for Chatwoot
app.post('/webhook', async (req, res) => {
  try {
    const { message_type, content, conversation: { id } } = req.body;
    
    // Only process incoming messages
    if (message_type !== 'incoming') {
      return res.sendStatus(200);
    }

    // Search Outline for relevant content
    const searchResponse = await outlineClient.get('/documents.search', {
      params: { query: content }
    });

    // Get the most relevant result
    const results = searchResponse.data && searchResponse.data.data;
    let answer = 'Sorry, I could not find an answer in the knowledge base.';
    if (results && results.length > 0) {
      answer = results[0].text || results[0].title || answer;
    }

    // Send the answer back to Chatwoot
    await chatwootClient.post(`/conversations/${id}/messages`, {
      content: answer,
      message_type: 'outgoing',
    });

    logger.info(`Answered /ask: ${content} => ${answer}`);
    res.sendStatus(200);
  } catch (error) {
    logger.error('Error handling webhook:', error.message);
    res.sendStatus(500);
  }
});

// Health check
app.get('/', (req, res) => res.send('Bot is running.'));

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  logger.info(`Bot listening on port ${PORT}`);
});
