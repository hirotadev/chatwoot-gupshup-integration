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

  async getTemplates(){
    const options = {
      method: 'GET',
      url: `https://api.gupshup.io/sm/api/v1/template/list/${this.srcName}`,
      headers: {
        apikey: this.apiKey
      }
    };

    try {
      return (await axios.request(options)).data;
    } catch (error) {
      console.error('Failed to list templates from Gupshup:', error);
      throw error;
    }
  }

  async sendTemplate(destination, templateId, params) {
    const encodedParams = new URLSearchParams();
    encodedParams.set('source', this.phone);
    encodedParams.set('destination', destination.replace('+', ''));
    encodedParams.set('template', JSON.stringify({ id: templateId, params }));

    const options = {
      method: 'POST',
      url: 'https://api.gupshup.io/wa/api/v1/template/msg',
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        apikey: this.apiKey
      },
      data: encodedParams,
    };

    try {
      return await axios.request(options);
    } catch (error) {
      console.error('Failed to send template message to Gupshup:', error);
      throw error;
    }
  }

  async getTemplateDetails(app_id, template_id){
    const options = {
      method: 'GET',
      url: `https://api.gupshup.io/wa/app/${app_id}/template/${template_id}`,
      headers: {
        apikey: this.apiKey
      }
    };

    try {
      return (await axios.request(options)).data.template;
    } catch (error) {
      console.error('Failed to get template details from Gupshup:', error);
      throw error;
    }
  }
}

export const gupshupService = new GupshupService();