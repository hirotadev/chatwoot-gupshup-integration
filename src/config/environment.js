// src/config/environment.js
import dotenv from 'dotenv';

dotenv.config();

export const config = {
  chatwoot: {
    baseUrl: process.env.CHATWOOT_BASE_URL,
    apiToken: process.env.CHATWOOT_API_TOKEN,
    inboxId: process.env.INBOX_ID,
    accountId: process.env.CHATWOOT_ACCOUNT_ID || '1'
  },
  gupshup: {
    apiKey: process.env.GUPSHUP_API_KEY,
    phone: process.env.GUPSHUP_PHONE,
    srcName: process.env.GUPSHUP_SRC_NAME
  },
  server: {
    port: process.env.PORT || 3000
  }
};