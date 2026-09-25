# Especificação — ConfeitoGest (TCC)

> Documento de escopo do TCC. Complementa o `README.md` (visão geral e como
> rodar) e o `CONTEXTO_PROJETO.md` (memória de trabalho do projeto).

## 1. Problema

Microempreendedoras de confeitaria artesanal organizam pedidos no WhatsApp
pessoal, sem controle de estoque. Quando vendem o mesmo brigadeiro para duas
pessoas ao mesmo tempo, o estoque real (o armário) não bate com o que o
cliente vê — o chamado **furo de estoque**. A proposta é um ecossistema
digital simples que controle isso na origem.

## 2. Objetivos

- Centralizar o cardápio em um link que o cliente acessa sem instalar nada.
- Registrar insumos, produtos e receitas (ficha técnica).
- Baixar o estoque automaticamente a cada venda, sem corrida entre pedidos.
- Dar ao gestor um painel para acompanhar pedidos e repor o que está acabando.
- Manter o pedido no WhatsApp, onde a cliente já está.

## 3. Escopo do MVP

**Incluído**

- Modelagem relacional (MySQL) com ficha técnica entre produtos e insumos.
- API REST (Express + TypeScript) com autenticação JWT.
- Vitrine pública com carrinho que monta o texto do pedido para o WhatsApp.
- Painel do gestor: dashboard, pedidos, insumos, produtos, categorias, perfil.
- Bot de WhatsApp **Nível 2** (menu fixo, sem IA conversacional) que cria
  pedidos pela API.

**Fora do MVP (decisões conscientes)**

| Item | Decisão | Por quê |
|---|---|---|
| Tempo real (WebSocket/Socket.io) | Descartado | Complexidade desproporcional ao benefício; a vitrine consulta ao carregar. |
| IA conversacional no bot | Descartado | Menu numerado é previsível, testável e barato; LLM vira evolução futura. |
| Checkout/pagamento online | Descartado | O pedido é confirmado no WhatsApp; pagamento fica fora do escopo. |
| Dashboard com gráficos (recharts) | Simplificado | Cards e listas resolvem; barras CSS simples no ranking. |
| Kanban de pedidos | Simplificado | Lista com abas por status atende o fluxo real. |

## 4. Regras de negócio principais

1. **Ficha técnica:** todo produto define, em insumos e quantidades, o que
   consome. É a base do controle de estoque.
2. **Baixa transacionada:** a venda debita insumos, grava movimentação,
   cria pedido e itens — tudo numa transação com `SELECT ... FOR UPDATE`,
   ou não acontece nada.
3. **Cancelamento estorna:** cancelar um pedido devolve os insumos e deixa
   registro da devolução; `cancelado` é estado final.
4. **Estoque só por movimentação:** a quantidade atual de um insumo muda por
   entrada, perda, ajuste ou venda — nunca por edição de cadastro.
5. **Perfil do usuário:** o gestor edita os próprios dados e troca a senha
   informando a atual.

## 5. Modelo de dados (resumo)

`usuarios`, `categorias`, `insumos`, `produtos`, `produto_insumo` (ficha
técnica, PK composta), `clientes`, `pedidos`, `itens_pedido`,
`movimentacoes_estoque`. O detalhe está em `backend/seed/schema.sql`.

## 6. Papéis do grupo

| Integrante | Área | Branch |
|---|---|---|
| Arthur | Banco de dados e modelagem | `feature/database-schema` |
| Felipe | API e integração | `feature/backend-servidor` |
| Ismael | Painel administrativo | `feature/frontend-painel` |

Fluxo: `feature/*` → `develop` → `main`.
