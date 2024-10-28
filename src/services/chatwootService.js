// src/services/chatwootService.js
import axios from 'axios';
import { config } from '../config/environment.js';
import { phoneUtils } from '../utils/phoneUtils.js';

class ChatwootService {
  constructor() {
    this.baseUrl = config.chatwoot.baseUrl;
    this.apiToken = config.chatwoot.apiToken;
    this.inboxId = config.chatwoot.inboxId;
    this.accountId = config.chatwoot.accountId;
  }

  async findOrCreateContact(phone, name) {
    const contact = await this.searchContactByPhone(phone);
    if (contact) {
      return {
        id: contact.id,
        source_id: contact.contact_inboxes[0].source_id
      };
    }
    return this.createContact(phone, name);
  }

  async searchContactByPhone(phone) {
    try {
      const phoneNumber = phoneUtils.formatToBrazilianE164(phone);
      const response = await axios.get(
        `${this.baseUrl}/api/v1/accounts/${this.accountId}/contacts/search?q=${phoneNumber}`,
        this._getHeaders()
      );
      
      const contacts = response.data.payload || [];
      return contacts.find(contact => contact.phone_number === phoneNumber) || null;
    } catch (error) {
      console.error('Failed to search for contact:', error);
      throw error;
    }
  }

  async createContact(phone, name) {
    try {
      const phoneNumber = phoneUtils.formatToBrazilianE164(phone);
      const response = await axios.post(
        `${this.baseUrl}/api/v1/accounts/${this.accountId}/contacts`,
        {
          inbox_id: this.inboxId,
          name,
          phone_number: phoneNumber,
          additional_attributes: { source: 'GupShup' }
        },
        this._getHeaders()
      );
      
      return {
        id: response.data.payload.id,
        source_id: response.data.payload.contact.contact_inboxes[0].source_id
      };
    } catch (error) {
      console.error('Failed to create contact:', error);
      throw error;
    }
  }

  async createConversation(contactId, sourceId, initialMessage, messageId) {
    try {
      const conversationId = await this._getOrCreateConversationId(contactId, sourceId);
      
      return this._createIncomingMessage(conversationId, initialMessage, messageId);
    } catch (error) {
      console.error('Failed to create conversation:', error);
      throw error;
    }
  }

  async _getOrCreateConversationId(contactId, sourceId) {
    const conversations = await this._getExistingConversations(contactId);
    const openConversation = conversations.find(conv => conv.status === 'open');
    
    if (openConversation) {
      return openConversation.id;
    }
    
    return this._createNewConversation(contactId, sourceId);
  }

  async _getExistingConversations(contactId) {
    const response = await axios.get(
      `${this.baseUrl}/api/v1/accounts/${this.accountId}/contacts/${contactId}/conversations`,
      this._getHeaders()
    );
    return response.data.payload || [];
  }

  async _createNewConversation(contactId, sourceId) {
    const response = await axios.post(
      `${this.baseUrl}/api/v1/accounts/${this.accountId}/conversations`,
      {
        source_id: sourceId,
        inbox_id: this.inboxId,
        contact_id: contactId,
        status: 'open',
        message: { content: '' }
      },
      this._getHeaders()
    );
    return response.data.id;
  }

  async _createIncomingMessage(conversationId, content, messageId) {
    const response = await axios.post(
      `${this.baseUrl}/api/v1/accounts/${this.accountId}/conversations/${conversationId}/messages`,
      {
        content,
        message_type: "incoming",
        custom_attributes: { messageId }
      },
      this._getHeaders()
    );
    return response.data;
  }

  async sendToChatwoot(phone, name, content, messageId) {
    try{
        const contactId = await this.findOrCreateContact(phone, name);
        return await this.createConversation(contactId.id, contactId.source_id, content, messageId);
    }catch(error){
        throw error;
    }
  }

  _getHeaders() {
    return {
      headers: {
        'Content-Type': 'application/json',
        'api_access_token': this.apiToken
      }
    };
  }
}

export const chatwootService = new ChatwootService();