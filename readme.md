<p align="center">
  <a href="./README.pt_br.md">🇧🇷 Português</a> | 🇺🇸 English
</p>

# Jestex

Jestex é um **SaaS de e-commerce**.  
A versão inicial (v1) será aberta e pública no GitHub, servindo tanto como produto funcional quanto como experimento técnico.

O projeto tem como foco **simplicidade no código**, aprendizado prático e validação de ideias.  
Ele existe para testar minhas habilidades com **Golang**, estudar arquitetura escalável e, se possível, gerar receita no futuro.

### Stack e decisões técnicas

- **Golang + Gin** no backend
- **React + TypeScript** no frontend
- **PostgreSQL** para usuários
- **MongoDB** para persistência dos sites
- **Redis** para cache e escalabilidade
- **RabbitMQ** para notificações e tarefas assíncronas
- Autenticação via **OAuth2**
- APIs públicas
- Tudo **containerizado com Docker**
- Infraestrutura na **Azure**, com **CI/CD**
- **Testes automatizados em Python**, escolhidos pela simplicidade e rapidez

---

## Visão geral

Este repositório reúne tudo o que é necessário para iniciar um e-commerce:

- API para regras de negócio
- Interface web
- Estrutura de banco de dados

A ideia é permitir que qualquer desenvolvedor consiga clonar o projeto, subir o ambiente e começar a trabalhar sem muita configuração inicial.

---

## Estrutura do projeto

O projeto segue uma arquitetura **modular**, dividida em três partes principais:

```
jesterx/
       ├─ backend/ # API e lógica do servidor
       ├─ frontend/ # Interface do usuário
       ├─ sql/ # Scripts do banco de dados
       ├─ .env.example # Exemplo de variáveis de ambiente
       ├─ docker-compose.yml
       ├─ LICENSE.md
```

---

## Backend

O backend concentra toda a lógica da aplicação, como:

- Autenticação de usuários
- Produtos
- Pedidos
- Comunicação com o banco de dados

A API segue o padrão REST, com possibilidade de adaptação futura se necessário.

---

## Frontend

O frontend é responsável pela interface da loja, incluindo:

- Listagem de produtos
- Carrinho de compras
- Login e cadastro
- Checkout
- Área administrativa (em desenvolvimento)

Ele consome diretamente a API do backend.

---

## Banco de dados

Na pasta `sql/` ficam os scripts de banco, incluindo:

- Criação das tabelas
- Relacionamentos
- Dados iniciais (quando aplicável)

---

## Configuração do ambiente

### Variáveis de ambiente

Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

Depois ajuste as variáveis conforme seu ambiente, como banco de dados, portas e chaves de acesso.

## Docker

O projeto possui um _docker-compose.yml_ para facilitar o setup local:

```
docker compose up -d
```

Isso irá subir o backend, frontend, redis, rabbitMQ e banco de dados.

## Funcionalidades

- Cadastro e autenticação de usuários
- CRUD de produtos
- Carrinho de compras
- Sistema de pedidos
- Checkout
- Painel administrativo
- Integrações com meios de pagamento (futuro)

## Desenvolvimento local

Para desenvolvimento local:

```
# Backend
cd backend
# instalar dependências e rodar o servidor

# Frontend
cd frontend
# instalar dependências e rodar o app
```

## Contribuição

#### Sinta-se à vontade para contribuir:

1. Faça um fork
2. Crie uma branch (feature/minha-feature)
3. Commit suas alterações
4. Abra um Pull Request

## Licença

Este projeto está licenciado conforme o arquivo <a href="LICENSE.md">LICENSE.md</a>

## Autor

Desenvolvido por ViitoJooj (819SauCe)
