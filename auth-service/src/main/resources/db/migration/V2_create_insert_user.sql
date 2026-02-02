CREATE TABLE tb_users (
                          id SERIAL PRIMARY KEY,
                          name VARCHAR(255) NOT NULL,
                          email VARCHAR(255) NOT NULL UNIQUE,
                          password VARCHAR(255) NOT NULL,
                          role VARCHAR(20) NOT NULL
);

INSERT INTO tb_users (name, email, password, role) VALUES
                                                       ('Administrador', 'admin@email.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOpNa.hPAxF7p.tvPpmtbJDfyqWn3k7.6', 'ADMIN'),
                                                       ('Usuario Comum', 'user@email.com', '$2a$10$8.UnVuG9HHgffUDAlk8qfOpNa.hPAxF7p.tvPpmtbJDfyqWn3k7.6', 'USER');