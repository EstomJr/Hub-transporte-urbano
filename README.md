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

### Autenticação

| Método | Endpoint        | Descrição |
|------|-----------------|-----------|
| POST | /auth/register  | Cadastro de usuário |
| POST | /auth/login     | Login e geração de token JWT |

---

### Usuário (USER)

| Método | Endpoint                     | Descrição |
|------|------------------------------|-----------|
| POST | /users/register              | Auto-cadastro de usuário |
| GET  | /users/{userId}              | Consultar perfil do usuário |
| PUT  | /users/{userId}              | Atualizar dados do usuário |

---

### Cartões do Usuário (USER)

| Método | Endpoint                                  | Descrição |
|------|--------------------------------------------|-----------|
| GET  | /users/{userId}/cards                      | Listar cartões do usuário |
| POST | /users/{userId}/cards                      | Adicionar cartão ao usuário |
| PATCH | /users/{userId}/cards/{cardId}/status     | Ativar/Inativar cartão |
| DELETE | /users/{userId}/cards/{cardId}           | Remover cartão do usuário |

---

### Administração (ADMIN)

| Método | Endpoint                                   | Descrição |
|------|---------------------------------------------|-----------|
| GET  | /admin/users                                | Listar todos os usuários |
| POST | /admin/users                                | Criar usuário |
| PUT  | /admin/users/{userId}                       | Atualizar usuário |
| DELETE | /admin/users/{userId}                     | Remover usuário |
| GET  | /admin/dashboard                            | Dashboard administrativo |
| GET  | /admin/cards                                | Listar todos os cartões |
| POST | /admin/users/{userId}/cards                 | Adicionar cartão a um usuário |
| PATCH | /admin/users/{userId}/cards/{cardId}/status | Atualizar status do cartão |
| DELETE | /admin/users/{userId}/cards/{cardId}      | Remover cartão de um usuário |


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

```
Contas para teste:

estomj@admin.com <ADMIN>
senha: 123456

estomj@user.com <USER>
123456
```
