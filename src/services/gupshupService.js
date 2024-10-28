// src/services/gupshupService.js
import axios from 'axios';
import { config } from '../config/environment.js';

class GupshupService {
  constructor() {
    this.apiKey = config.gupshup.apiKey;
    this.phone = config.gupshup.phone;
    this.srcName = config.gupshup.srcName;
  }

  async sendMessage(destination, messageData) {
    const encodedParams = new URLSearchParams();
    encodedParams.set('message', JSON.stringify(messageData));
    encodedParams.set('channel', 'whatsapp');
    encodedParams.set('source', this.phone);
    encodedParams.set('destination', destination.replace('+', ''));
    encodedParams.set('src.name', this.srcName);

    const options = {
      method: 'POST',
      url: 'https://api.gupshup.io/wa/api/v1/msg',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        apikey: this.apiKey
      },
      data: encodedParams,
    };

    try {
      await axios.request(options);
    } catch (error) {
      console.error('Failed to send message to Gupshup:', error);
      throw error;
    }
  }
}

export const gupshupService = new GupshupService();