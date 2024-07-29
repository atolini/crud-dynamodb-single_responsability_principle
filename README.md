# DynamoDB CRUD Operations

Este repositório fornece um conjunto de funções para realizar operações CRUD (Create, Read, Update, Delete) em uma tabela DynamoDB. Cada função é projetada seguindo o Princípio de Responsabilidade Única, garantindo que cada função tenha uma única responsabilidade e seja fácil de entender, manter e testar.

## Descrição

O repositório contém funções Lambda para interagir com o Amazon DynamoDB, implementando operações CRUD. As funções são divididas de forma modular para seguir o Princípio de Responsabilidade Única, facilitando a manutenção e a escalabilidade do código. Abaixo estão as principais funcionalidades e a estrutura do repositório:

- **Create**: Adiciona um novo item à tabela DynamoDB.
- **Read**: Recupera um item da tabela DynamoDB com base no ID.
- **Update**: Atualiza um item existente na tabela DynamoDB.
- **Delete**: Remove um item da tabela DynamoDB com base no ID.
