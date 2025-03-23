# Wallet Pass Manager - SaaS Platform

A self-service SaaS platform for businesses to create and manage Apple/Google Wallet passes for their customers. Built with Next.js, FastAPI, and PostgreSQL.

## Features

- 👤 Customer management - import and manage your contacts
- 🎫 Pass template designer - create visually appealing wallet passes
- 📱 Multi-platform support - Apple Wallet and Google Wallet
- 📊 Campaign management - send passes in bulk to customers
- 📍 Geo-targeting - create location-based campaigns
- 🔄 Real-time updates - keep passes up to date
- 📈 Analytics - track redemption rates and engagement

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript, Tailwind CSS
- **Backend**: FastAPI, SQLAlchemy, Pydantic, Alembic
- **Database**: PostgreSQL
- **Authentication**: JWT
- **Containerization**: Docker, Docker Compose
- **Infrastructure**: Nginx

## Project Structure

```
wallet-pass-manager/
├── docker-compose.yml
├── .env.example
├── backend/
│   ├── app/
│   │   ├── main.py
│   │   ├── api/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   └── utils/
│   └── alembic/
├── frontend/
│   └── src/
│       ├── app/
│       ├── components/
│       └── lib/
└── nginx/
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Git

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/wallet-pass-manager.git
cd wallet-pass-manager
```

2. Copy the environment file and configure your settings:

```bash
cp .env.example .env
# Edit .env with your settings
```

3. Start the services with Docker Compose:

```bash
docker-compose up -d
```

4. Run database migrations:

```bash
docker-compose exec backend alembic upgrade head
```

5. Create a superuser:

```bash
docker-compose exec backend python -m app.utils.create_superuser
```

6. Access the application:

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api/v1
- API Docs: http://localhost:8000/docs

## Development

### Running in Development Mode

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Restart a specific service
docker-compose restart backend
```

### Database Migrations

```bash
# Generate a new migration
docker-compose exec backend alembic revision --autogenerate -m "description"

# Apply migrations
docker-compose exec backend alembic upgrade head

# Rollback migration
docker-compose exec backend alembic downgrade -1
```

## API Documentation

- API documentation is available at `http://localhost:8000/docs` when the application is running.
- OpenAPI schema is available at `http://localhost:8000/openapi.json`.

## Deployment

For production deployment, consider:

1. Setting up proper SSL with Let's Encrypt
2. Configuring a CI/CD pipeline
3. Using managed database services
4. Setting up monitoring and alerting
5. Implementing proper backup strategies