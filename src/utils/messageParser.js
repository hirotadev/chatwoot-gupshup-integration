// src/utils/messageParser.js
export const messageParser = {
  parseIncoming(type, payload) {
    const parsers = {
      text: this._parseText,
      image: this._parseImage,
      document: this._parseFile,
      audio: this._parseAudio,
      video: this._parseVideo,
      contacts: this._parseContact,
      location: this._parseLocation,
      button_reply: this._parseButtonReply,
      list_reply: this._parseListReply,
      quick_reply: this._parseQuickReply,
      sticker: this._parseSticker,
      reaction: this._parseReaction,
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
    return payload.text.body;
  },

  _parseImage(payload) {
    //Retornando como Arquivo para possibilitar o download na conversa do chatwoot e não somente a visualização
    //return `![Image](${payload.url})\n\n${payload.caption || ''}`;
    return `**Arquivo:** [Download](${payload.image.url})`;
  },

  _parseFile(payload) {
    return `**Arquivo:** [${payload.document.filename || 'Download'}](${payload.document.url})`;
  },

  _parseAudio(payload) {
    return `**Audio:** [Ouça aqui](${payload.audio.url})`;
  },

  _parseVideo(payload) {
    return `**Video:** [Assista aqui](${payload.video.url})`;
  },

  _parseContact(payload) {
    console.log(payload.contacts);
    return `**Informações do contato compartilhado:**\n${payload.contacts.contacts.map(contact =>
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

  _parseReaction(payload) {
    return `**Reação:** ${payload.emoji}`
  }
};