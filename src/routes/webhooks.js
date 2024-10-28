// src/routes/webhooks.js
import { chatwootService } from '../services/chatwootService.js';
import { gupshupService } from '../services/gupshupService.js';
import { messageParser } from '../utils/messageParser.js';

const shouldSendRatingRequest = (body) => {
  return (
    body.event === 'conversation_updated' &&
    body.status === 'resolved' &&
    body.messages?.[0]?.content?.includes('Por favor, classifique esta conversa')
  );
};

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
    throw new Error(`Unsupported attachment type: ${attachment.file_type}`);
  }

  await gupshupService.sendMessage(destination, {
    type: typeConfig.type,
    ...typeConfig.getPayload(attachment)
  });
};

const handleRatingRequest = async (body) => {
  const destination = body.meta.sender.phone_number;
  await gupshupService.sendMessage(destination, {
    type: 'text',
    text: body.messages[0].content
  });
};

export const webhookRoutes = async (fastify) => {
  // Adiciona schema validation para os endpoints
  const gupshupSchema = {
    schema: {
      body: {
        type: 'object',
        required: ['type', 'payload'],
        properties: {
          type: { type: 'string' },
          payload: {
            type: 'object',
            required: ['id', 'sender', 'type'],
            properties: {
              id: { type: 'string' },
              sender: {
                type: 'object',
                required: ['phone', 'name'],
                properties: {
                  phone: { type: 'string' },
                  name: { type: 'string' }
                }
              },
              type: { type: 'string' }
            }
          }
        }
      }
    }
  };

  const chatwootSchema = {
    schema: {
      body: {
        type: 'object',
        required: ['event'],
        properties: {
          event: { type: 'string', enum: ['message_created', 'conversation_updated'] }
        }
      }
    }
  };

  fastify.post('/webhook/gupshup', gupshupSchema, async (request, reply) => {
    const { body } = request;

    if (body.type !== 'message') {
      return reply.status(200).send();
    }

    try {
      const { id: messageId, sender, type, payload } = body.payload;
      const messageContent = messageParser.parseIncoming(type, payload);
      
      await chatwootService.sendToChatwoot(sender.phone, sender.name, messageContent, messageId);
      
      return reply.status(200).send({ status: 'success' });
    } catch (error) {
      request.log.error('Error processing Gupshup webhook:', error);
      return reply.status(200).send({ 
        status: 'error',
        message: 'Error processing message'
      });
    }
  });

  fastify.post('/webhook/chatwoot', chatwootSchema, async (request, reply) => {
    const { body } = request;

    try {
      if (body.event === 'message_created' && body.message_type === 'outgoing') {
        await handleOutgoingMessage(body);
      } else if (shouldSendRatingRequest(body)) {
        await handleRatingRequest(body);
      }

      return reply.status(200).send({ status: 'success' });
    } catch (error) {
      request.log.error('Error processing Chatwoot webhook:', error);
      return reply.status(200).send({ 
        status: 'error',
        message: 'Error processing message'
      });
    }
  });
};