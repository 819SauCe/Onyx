<p align="center">
  <a href="./readme.md">🇧🇷 Português</a> | 🇺🇸 English
</p>

# Jestex

Jestex is a **SaaS page builder**. The initial version (v1) will be open and public on GitHub, serving both as a functional product and as a technical experiment. The project focuses on **code simplicity**, hands-on learning, and idea validation. It exists to test my skills with **Golang**, study scalable architecture, and, if possible, generate revenue in the future.

### Stack and Technical Decisions

- **Golang + Gin** on the backend
- **React + TypeScript** on the frontend
- **PostgreSQL** for users
- **MongoDB** for website persistence
- **Redis** for caching and scalability
- **RabbitMQ** for notifications and asynchronous tasks
- Authentication via **OAuth2**
- Public APIs
- Everything **containerized with Docker**
- Infrastructure on **Azure**, with **CI/CD**
- **Automated tests in Python**, chosen for their simplicity and speed

---

## Overview

This repository brings together everything you need to start an e-commerce site:

- API for business rules
- Web interface
- Database structure

The idea is to allow any developer to clone the project, set up the environment, and start working without much initial configuration.

---

## Project structure

The project follows a **modular** architecture, divided into three main parts:

```
jesterx/
       ├─ backend/           # API and server logic
       ├─ frontend/          # User interface
       ├─ sql/               # Database scripts
       ├─ .env.example       # Example of environment variables
       ├─ docker-compose.yml
       ├─ LICENSE.md
```

---

## Backend

The backend concentrates all the application logic, such as:

- User authentication
- Products
- Orders
- Communication with the database

The API follows the REST standard, with the possibility of future adaptation if necessary.

---

## Frontend

The frontend is responsible for the store's interface, including:

- Product listing
- Shopping cart
- Login and registration
- Checkout
- Administrative area (under development)

It directly consumes the backend API.

---

## Database

The database scripts are located in the `sql/` folder, including:

- Table creation
- Relationships
- Initial data (when applicable)

---

## Environment Configuration

### Environment Variables

Copy the example file:

```bash
cp .env.example .env
```

Then adjust the variables according to your environment, such as database, ports, and access keys.

## Docker

The project has a `docker-compose.yml` file to facilitate local setup:

```
docker compose up -d
```

This will bring up the backend, frontend, Redis, RabbitMQ, and database.

## Features

- User registration and authentication
- Product CRUD (Create, Read, Delete)
- Shopping cart
- Order system
- Checkout
- Administrative panel
- Payment processing integrations (future)

## Local Development

For local development:

```
# Backend cd backend
# Install dependencies and run the server

# Frontend cd frontend
# Install dependencies and run the app
```

## Contribution

#### Feel free to contribute:

1. Fork the repository
2. Create a branch (feature/my-feature)
3. Commit your changes
4. Open a Pull Request

## License

This project is licensed under the terms of the file <a href="LICENSE.md">LICENSE.md</a>

## Author

Developed by ViitoJooj (819SauCe)
