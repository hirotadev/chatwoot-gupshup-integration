# Chatwoot-Gupshup Integration Service

This service provides a bridge between Chatwoot and Gupshup, enabling seamless WhatsApp communication through Chatwoot's interface. It handles message synchronization, media transfers, and conversation management between both platforms.

## Features

- Bidirectional message sync between Chatwoot and Gupshup
- Support for various message types:
  - Text messages
  - Images with captions
  - Audio messages
  - Video messages
  - Document files
  - Contact cards
  - Location sharing
  - Button responses
  - List responses
- Automatic contact creation and management
- Conversation state management
- Support for customer satisfaction surveys

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- A Chatwoot instance with API access
- A Gupshup WhatsApp Business API account
- Environment variables configuration

## Installation

1. Clone the repository:
```bash
git clone https://github.com/hirotadev/chatwoot-gupshup-integration.git
cd chatwoot-gupshup-integration
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory with the following variables:
```env
# Server Configuration
PORT=3000

# Chatwoot Configuration
CHATWOOT_BASE_URL=https://your-chatwoot-instance.com
CHATWOOT_API_TOKEN=your_chatwoot_api_token
CHATWOOT_ACCOUNT_ID=1
INBOX_ID=your_chatwoot_inbox_id

# Gupshup Configuration
GUPSHUP_API_KEY=your_gupshup_api_key
GUPSHUP_PHONE=your_whatsapp_phone_number
GUPSHUP_SRC_NAME=your_source_name
```

4. Start the service:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Webhook Configuration

### Gupshup Webhook Setup

1. Log in to your Gupshup dashboard
2. Navigate to WhatsApp API > Configuration
3. Set the webhook URL to:
```
https://your-domain.com/webhook/gupshup
```

### Chatwoot Webhook Setup

1. Go to your Chatwoot installation
2. Navigate to Settings > Integrations > Webhooks
3. Add a new webhook with the URL:
```
https://your-domain.com/webhook/chatwoot
```
4. Enable the following events:
   - Message Created
   - Conversation Updated

## Architecture

The service is built using a modular architecture with the following components:

- `src/config`: Environment configuration
- `src/services`: Core business logic for Chatwoot and Gupshup integration
- `src/utils`: Utility functions for message parsing and phone number formatting
- `src/routes`: API endpoint definitions

## Development

### Project Structure
```
.
├── README.md
├── index.js
├── package.json
└── src
    ├── config
    │   └── environment.js
    ├── routes
    │   └── webhooks.js
    ├── services
    │   ├── chatwootService.js
    │   └── gupshupService.js
    └── utils
        ├── messageParser.js
        └── phoneUtils.js
```

### Running Tests
```bash
TODO
```

### Code Style

This project uses ESLint and Prettier for code formatting. Run the following commands:

```bash
TODO
```

## Error Handling

The service implements comprehensive error handling:

- All API endpoints return 200 status codes to acknowledge webhook receipt
- Errors are logged but don't interrupt service operation
- Failed message deliveries are logged for manual review
- Phone number validation ensures E.164 format compliance

## Production Deployment

### Using Docker

1. Build the Docker image:
```bash
docker build -t chatwoot-gupshup-integration .
```

2. Run the container:
```bash
docker run -d \
  --name chatwoot-gupshup \
  -p 3000:3000 \
  --env-file .env \
  chatwoot-gupshup-integration
```

### Using PM2

1. Install PM2:
```bash
npm install -g pm2
```

2. Start the service:
```bash
pm2 start npm --name "chatwoot-gupshup" -- start
```

### Nginx Configuration

If using Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Security Considerations

- All environment variables should be kept secure
- Use HTTPS for webhook endpoints
- Implement rate limiting in production
- Regular security audits recommended
- Keep dependencies updated

## Monitoring

The service includes basic logging through Fastify's logger. For production monitoring:

1. Use tools like:
   - PM2 for process management
   - Datadog or New Relic for application monitoring
   - ELK Stack for log management

2. Monitor key metrics:
   - Message delivery rates
   - API response times
   - Error rates
   - System resource usage

## Troubleshooting

Common issues and solutions:

1. Message not being delivered:
   - Check webhook configurations
   - Verify API credentials
   - Check phone number format

2. Connection errors:
   - Verify network connectivity
   - Check API endpoint availability
   - Validate environment variables

3. Media upload failures:
   - Check file size limits
   - Verify supported file types
   - Ensure proper URL formatting

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support:
1. Check the issues section for known problems
2. Create a new issue for unreported problems
3. Contact the maintainers for critical issues

## Acknowledgments

- Chatwoot team for their excellent platform
- Gupshup team for their WhatsApp Business API
- Contributors and community members

## Roadmap

Future planned features:

- [ ] Support for template messages
- [ ] Advanced message queueing
- [ ] Dashboard for monitoring
- [ ] Automated testing improvements
- [ ] Multi-language support