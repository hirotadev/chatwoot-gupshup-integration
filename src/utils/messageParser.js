// src/utils/messageParser.js
export const messageParser = {
    parseIncoming(type, payload) {
      const parsers = {
        text: this._parseText,
        image: this._parseImage,
        file: this._parseFile,
        audio: this._parseAudio,
        video: this._parseVideo,
        contact: this._parseContact,
        location: this._parseLocation,
        button_reply: this._parseButtonReply,
        list_reply: this._parseListReply,
        quick_reply: this._parseQuickReply,
        sticker: this._parseSticker
      };
  
      const parser = parsers[type];
      if (!parser) {
        console.error('Unsupported message type');
        console.error(type);
        console.error(payload)
        return 'Unsupported message type';
      }
  
      return parser(payload);
    },
  
    _parseText(payload) {
      return payload.text;
    },
  
    _parseImage(payload) {
      //Retornando como Arquivo para possibilitar o download na conversa do chatwoot e não somente a visualização
      //return `![Image](${payload.url})\n\n${payload.caption || ''}`;
      return `**Arquivo:** [${payload.caption || 'Download'}](${payload.url})`;
    },
  
    _parseFile(payload) {
      return `**Arquivo:** [${payload.filename || 'Download'}](${payload.url})`;
    },
  
    _parseAudio(payload) {
      return `**Audio:** [Ouça aqui](${payload.url})`;
    },
  
    _parseVideo(payload) {
      return `**Video:** [Assista aqui](${payload.url})\n\n${payload.caption || ''}`;
    },
  
    _parseContact(payload) {
      return `**Informações do contato compartilhado:**\n${payload.contacts.map(contact => 
        `- **Nome:** ${contact.name.formatted_name}\n` +
        `- **Telefone:** ${contact.phones[0].phone}\n` +
        (contact.org ? `- **Empresa:** ${contact.org.company}\n` : '')
      ).join('\n')}`;
    },
  
    _parseLocation(payload) {
      return `**Informações da localização recebida:**\n` +
        `- **Latitude:** ${payload.latitude}\n` +
        `- **Longitude:** ${payload.longitude}`;
    },
  
    _parseButtonReply(payload) {
      return `**Resposta do botão:** ${payload.title} (ID: ${payload.id})`;
    },
  
    _parseListReply(payload) {
      return `**Resposta da lista:** ${payload.title} (ID: ${payload.id})`;
    },

    _parseQuickReply(payload) {
      return `**Resposta dos botões:** ${payload.text}`;
    },

    _parseSticker(payload) {
      return `![Image](${payload.url})`;
    },
  };