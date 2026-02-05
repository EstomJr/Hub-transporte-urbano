# Hub Transporte Urbano

Projeto de gestão de usuários e cartões de transporte urbano, composto por:

- **auth-service** (Spring Boot): autenticação e emissão de JWT.
- **user-service** (Spring Boot): gestão de usuários, cartões e dashboard administrativo.
- **card-manager-frontend** (Angular): interface web para login, cadastro e operações.
- **PostgreSQL**: persistência de dados.

---

## Tecnologias usadas

### Backend
- Java 17
- Spring Boot 3.5.x
- Spring Security
- Spring OAuth2 Resource Server
- Spring Data JPA
- Flyway
- PostgreSQL
- JWT (JJWT)
- MapStruct (user-service)

### Frontend
- Angular 21
- TypeScript
- RxJS

### DevOps
- Docker
- Docker Compose

---

## Arquitetura de autenticação e autorização

## 1) Autenticação (auth-service)

1. O cliente envia e-mail e senha para `POST /auth/login`.
2. O `AuthenticationManager` valida as credenciais.
3. O `auth-service` gera um JWT com claims:
   - `sub`: e-mail do usuário
   - `userId`: id do usuário
   - `roles`: role do usuário (`ADMIN` ou `USER`)
4. O token é retornado no formato:
   ```json
   { "token": "<jwt>" }
   ```

### Endpoints públicos no auth-service
- `POST /auth/login`
- `POST /auth/register`

Todos os outros endpoints exigem autenticação.

## 2) Autorização (user-service)

O `user-service` valida o JWT com a mesma chave secreta (`JWT_SECRET`) e aplica regras:

- `/admin/**` → exige role `ADMIN`
- `/users/**` → exige usuário autenticado
- Swagger (`/swagger-ui.html`, `/v3/api-docs/**`) é público

A claim `roles` do token é convertida para autoridade Spring com prefixo `ROLE_`.

> Exemplo: `roles=ADMIN` no JWT vira autoridade `ROLE_ADMIN`.

---

## Subindo tudo com Docker

## Pré-requisitos
- Docker
- Docker Compose

## Comando único
Na raiz do projeto:

```bash
docker compose up --build
```

Serviços disponíveis:

- Frontend: `http://localhost:4200`
- Auth API: `http://localhost:8080`
- User API: `http://localhost:8081`
- PostgreSQL: `localhost:5432`

## Variáveis relevantes
No `docker-compose.yml` já estão definidas:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`
- `JWT_SECRET`
- `JWT_EXPIRATION` (apenas auth-service)

---

## Endpoints da API de autenticação (auth-service)

Base URL: `http://localhost:8080`

## `POST /auth/register`
Cria novo usuário.

### Request
```json
{
  "name": "Maria Silva",
  "email": "maria@email.com",
  "password": "123456",
  "role": "USER"
}
```

- `role` é opcional (padrão `USER`).
- Valores aceitos: `USER`, `ADMIN`.

### Response
- `201 Created` sem corpo.

## `POST /auth/login`
Autentica e retorna JWT.

### Request
```json
{
  "email": "maria@email.com",
  "password": "123456"
}
```

### Response (200)
```json
{
  "token": "<jwt>"
}
```

## `GET /test`
Endpoint de teste do serviço.

### Response
- `200 OK`
- corpo: `Auth Service is running!`

---

## Endpoints da API de usuário (user-service)

Base URL: `http://localhost:8081`

> Todos endpoints abaixo exigem `Authorization: Bearer <token>`, exceto documentação Swagger.

## Área do usuário (`/users`)

### `POST /users/register`
Auto-cadastro de usuário no user-service.

Request:
```json
{
  "name": "João",
  "email": "joao@email.com",
  "password": "123456"
}
```

Response: `201 Created` com `UserResponseDTO`.

### `GET /users/{userId}`
Consulta perfil.

Response: `200 OK`
```json
{
  "id": 1,
  "name": "João",
  "email": "joao@email.com",
  "cards": []
}
```

### `PUT /users/{userId}`
Atualiza dados do usuário.

Request:
```json
{
  "name": "João da Silva",
  "email": "joao@email.com",
  "password": "nova-senha",
  "role": "USER"
}
```

Response: `200 OK` com usuário atualizado.

### `GET /users/{userId}/cards`
Lista cartões do usuário.

Response: `200 OK` com lista de `CardResponseDTO`.

### `POST /users/{userId}/cards`
Adiciona cartão ao usuário.

Request:
```json
{
  "numeroCartao": 123456,
  "nome": "VEM João",
  "status": true,
  "tipoCartao": "COMUM"
}
```

`tipoCartao` aceitos: `COMUM`, `ESTUDANTE`, `TRABALHADOR`.

Response: `201 Created` com `CardResponseDTO`.

### `DELETE /users/{userId}/cards/{cardId}`
Remove cartão do usuário.

Response: `204 No Content`.

### `PATCH /users/{userId}/cards/{cardId}/status?status=true`
Ativa/inativa cartão.

Response: `200 OK` com cartão atualizado.

---

## Área administrativa (`/admin`)

### `GET /admin/users`
Lista todos usuários.

### `GET /admin/dashboard`
Resumo do dashboard:
```json
{
  "totalUsers": 10,
  "totalCards": 20,
  "activeCards": 16,
  "inactiveCards": 4
}
```

### `POST /admin/users`
Cria usuário (ação administrativa).

### `PUT /admin/users/{userId}`
Atualiza usuário.

### `DELETE /admin/users/{userId}`
Remove usuário.

### `POST /admin/users/{userId}/cards`
Adiciona cartão para um usuário.

### `DELETE /admin/users/{userId}/cards/{cardId}`
Remove cartão de um usuário.

### `PATCH /admin/users/{userId}/cards/{cardId}/status?status=false`
Atualiza status do cartão.

### `GET /admin/cards`
Lista todos os cartões.

---

## Modelos principais

## UserResponseDTO
```json
{
  "id": 1,
  "name": "João",
  "email": "joao@email.com",
  "cards": [
    {
      "id": 99,
      "numeroCartao": 123456,
      "nome": "VEM João",
      "status": true,
      "tipoCartao": "COMUM",
      "userId": 1
    }
  ]
}
```

## CardResponseDTO
```json
{
  "id": 99,
  "numeroCartao": 123456,
  "nome": "VEM João",
  "status": true,
  "tipoCartao": "COMUM",
  "userId": 1
}
```

---

## Estrutura do projeto

```text
.
├── auth-service/
│   ├── Dockerfile
│   └── src/main/java/com/urbpe/auth_service
├── user-service/
│   ├── Dockerfile
│   └── src/main/java/com/urbpe/user_service
├── card-manager-frontend/
│   ├── Dockerfile
│   └── src/app
└── docker-compose.yml
```

---

## Execução local sem Docker (opcional)

1. Suba um PostgreSQL local (`sistema_urbanape`).
2. Rode `auth-service` (porta 8080).
3. Rode `user-service` (porta 8081).
4. Rode frontend Angular (`ng serve`, porta 4200).

---

## Observações

- O frontend está configurado para consumir:
  - `http://localhost:8080/auth`
  - `http://localhost:8081/users`
  - `http://localhost:8081/admin`
- Para produção, recomenda-se externalizar variáveis sensíveis (`JWT_SECRET`, senha DB) via secrets.
