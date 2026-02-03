CREATE TABLE users (
                       id BIGSERIAL PRIMARY KEY,
                       name VARCHAR(255) NOT NULL,
                       email VARCHAR(255) NOT NULL UNIQUE,
                       password VARCHAR(255) NOT NULL,
                       role VARCHAR(50) NOT NULL
);

CREATE TABLE cards (
                       id BIGSERIAL PRIMARY KEY,
                       numero_cartao VARCHAR(255) NOT NULL,
                       nome VARCHAR(255) NOT NULL,
                       status BOOLEAN NOT NULL,
                       tipo_cartao VARCHAR(50) NOT NULL,
                       user_id BIGINT REFERENCES users(id) ON DELETE CASCADE
);
