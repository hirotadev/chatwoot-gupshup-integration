// src/routes/webhooks.js
import { chatwootService } from '../services/chatwootService.js';
import { gupshupService } from '../services/gupshupService.js';
import { messageParser } from '../utils/messageParser.js';

const handleOutgoingMessage = async (body) => {
  const destination = body.conversation.meta.sender.phone_number;

  if (body.content && body.content_type === 'text') {
    await gupshupService.sendMessage(destination, {
      type: 'text',
      text: body.content
    });
  } else if (body.attachments?.[0]) {
    await handleAttachment(body.attachments[0], destination);
  }
};

const handleAttachment = async (attachment, destination) => {
  console.log('handleAttachment');
  console.log(attachment);
  console.log(destination);
  const attachmentTypes = {
    'image': {
      type: 'image',
      getPayload: (att) => ({
        originalUrl: att.data_url,
        previewUrl: att.thumb_url,
        caption: 'Imagem Recebida'
      })
    },
    'audio': {
      type: 'audio',
      getPayload: (att) => ({
        url: att.data_url
      })
    },
    'video': {
      type: 'file',
      getPayload: (att) => ({
        url: att.data_url,
        caption: 'Vídeo Recebido'
      })
    },
    'file': {
      type: 'file',
      getPayload: (att) => ({
        url: att.data_url,
        filename: 'Arquivo recebido'
      })
    }
  };

  const typeConfig = attachmentTypes[attachment.file_type];
  if (!typeConfig) {
    console.error(`Unsupported attachment type: ${attachment.file_type}`);
    console.error(attachment);
    console.error(destination);
    throw new Error(`Unsupported attachment type: ${attachment.file_type}`);
  }

  await gupshupService.sendMessage(destination, {
    type: typeConfig.type,
    ...typeConfig.getPayload(attachment)
  });
};

const handleRatingRequest = async (body) => {
  const destination = body.conversation.meta.sender.phone_number;
  await gupshupService.sendMessage(destination, {
    type: 'text',
    text: body.content
  });
};

export const webhookRoutes = async (fastify) => {
  fastify.post('/webhook/gupshup', async (request, reply) => {
    const { body } = request;
    console.log('Chamada no endpoint /webhook/gupshup');
    console.log(body.entry[0].changes[0].value?.contacts[0]);
    console.log(body.entry[0].changes[0].value?.messages[0]);
    if (!body.entry[0].changes[0].value?.contacts[0] && !body.entry[0].changes[0].value?.messages[0].type && !body.entry[0].changes[0].value?.messages[0]) {
      return reply.status(200).send();
    }

    try {
      const contact = body.entry[0].changes[0].value?.contacts[0];
      const type = body.entry[0].changes[0].value?.messages[0].type;
      const messageContent = messageParser.parseIncoming(type, body.entry[0].changes[0].value?.messages[0]);

      console.log(contact.profile.wa_id, contact.profile.name, messageContent);

      await chatwootService.sendToChatwoot(contact.profile.wa_id, contact.profile.name, messageContent);

      return reply.status(200).send();
    } catch (error) {
      request.log.error('Error processing Gupshup webhook:', error);
      return reply.status(200).send();
    }
  });

  fastify.post('/webhook/chatwoot', async (request, reply) => {
    const { body } = request;
    console.log('Chamada no endpoint /webhook/chatwoot');
    console.log(body.event, body.message_type, body.private, body.content_type);
    try {
      if (body.event === 'message_created' && body.message_type === 'outgoing' && body.private === false) {
        await handleOutgoingMessage(body);
      } else if (body.content_type === 'input_csat') {
        await handleRatingRequest(body);
      }

      return reply.status(200).send();
    } catch (error) {
      request.log.error('Error processing Chatwoot webhook:', error);
      return reply.status(200).send();
    }
  });

  fastify.get('/templates', async (request, reply) => {
    try {
      const templates = await gupshupService.getTemplates();
      reply.status(200).send(templates.templates);
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Erro ao listar templates.', details: error });
    }
  });

  fastify.post('/send-template', async (request, reply) => {
    const { destination, templateId, params = [], type, files = null } = request.body;
    if (!destination || !templateId || !type) {
      return reply.status(400).send({ error: 'Os campos destination, templateId e type são obrigatórios.' });
    }
    try {
      const responseSetSend = await chatwootService.updateContactAttributesForNotSendBotMenu(destination);
      const responseSendTemplate = await gupshupService.sendTemplate(destination, templateId, params, type, files);
      const responseSendToChatwootAfterTemplate = await chatwootService.sendToChatwootAfterTemplate(destination, templateId, params);
      return reply.send({
        responseSendTemplate: responseSendTemplate.data,
        responseSendToChatwootAfterTemplate: responseSendToChatwootAfterTemplate
      });
    } catch (error) {
      fastify.log.error(error);
      return reply.status(500).send({ error: 'Erro ao enviar o template.' });
    }
  });
};