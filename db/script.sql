CREATE DATABASE ex2backhp;
\c ex2backhp;

CREATE TABLE personagens (
  id SERIAL PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  idade INT NOT NULL,
  casa VARCHAR(100) NOT NULL,
  habilidade VARCHAR(100) NOT NULL,
  sangue VARCHAR(100) NOT NULL,
  patrono VARCHAR(100) NOT NULL
);

CREATE TABLE varinhas1 (
    id SERIAL PRIMARY KEY,
    material VARCHAR(100) NOT NULL,
    comprimento VARCHAR(100) NOT NULL,
    nucleo VARCHAR(100) NOT NULL,
    fab DATE NOT NULL
);

INSERT INTO personagens (nome, idade, casa, habilidade, sangue, patrono)
VALUES ('Harry Potter', 11, 'Grifinória', 'Parseltongue', 'Mestiço', 'Fênix');


INSERT INTO varinhas1 (material, comprimento, nucleo, fab) VALUES ('Madeira de Teixo', '30cm', 'Pena de Fênix', '1991-07-31');

