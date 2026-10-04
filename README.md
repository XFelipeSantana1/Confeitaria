# Doce & Carinho

Ecossistema digital para confeitaria artesanal: vitrine para o cliente,
painel para o gestor e API que controla estoque, cardápio e pedidos.

O problema que ele resolve está na [seção 2](#o-problema) — e o ponto mais
importante do sistema é o **furo de estoque**: dois pedidos simultâneos do
mesmo insumo escasso não podem ser aceitos.

## O problema

Microempreendedoras de confeitaria artesanal organizam pedidos no WhatsApp
pessoal, sem controle de estoque. Quando vendem o mesmo brigadeiro para duas
pessoas ao mesmo tempo, o estoque real (o armário) não bate com o que o
cliente vê.

O sistema centraliza o cardápio e o estoque, e trava a baixa de insumo dentro
de transação — é isso que impede a venda dupla.

## Como rodar

O projeto **não tem senha nenhuma no Git**. Os valores ficam em dois arquivos
que são ignorados pelo versionamento — um para o container do banco, outro
para a API:

```bash
# 1. configuração local (uma vez só)
cp .env.example .env                  # senha do banco
cp backend/.env.example backend/.env  # segredos da API

# 2. banco (MySQL 8 em container) — lê as senhas do .env da raiz
docker compose up -d

# 3. API
cd backend
npm install
npm run dev               # http://localhost:3000

# 3. vitrine (cliente) OU 4. painel (gestor) — um por vez, as duas usam a
# porta padrão do Vite (5173). Para os dois juntos, passe --port:
cd vitrine-cliente && npm install && npm run dev   # http://localhost:5173
cd painel-admin  && npm install && npm run dev -- --port 5174
```

Primeiro acesso: a base vazia libera o bootstrap — `POST /api/auth/registrar`
cria o primeiro usuário sem token. A senha precisa de 6 caracteres ou mais.

Dois guards de erro de propósito, para não virar surpresa:

- `docker compose up` **para** se faltar senha no `.env` da raiz, e diz qual
  variável falta. Um valor-padrão no `compose` seria senha publicada junto com
  o código.
- A API **não sobe** se o `JWT_SECRET` tiver menos de 32 caracteres ou ainda for
  o texto de exemplo. Melhor o processo não começar a dizer isso do que virar
  um 500 sem explicação no primeiro login.

## As três partes

| Projeto | Papel | Onde |
|---|---|---|
| `backend/` | API Express + MySQL, JWT, auditoria e upload de fotos | porta 3000 |
| `vitrine-cliente/` | Vitrine pública: cardápio, busca, sacola e pedido no WhatsApp | 5173 |
| `painel-admin/` | Painel do gestor: pedidos, insumos, produtos, categorias e histórico | 5173 (`--port 5174` para rodar junto) |

Detalhes de cada um nos READMEs próprios.

`praticando-backend/` é um exercício: o mesmo backend reescrito do zero para
aprender, em outro banco (`confeitaria_estudo`) e outra porta (`3001`). Ele
não é o backend do projeto — o que roda é `backend/`.

## O que o sistema garante

**Furo de estoque é impossível.** A baixa de insumo roda dentro da mesma
transação que cria o pedido, e trava a linha do insumo com `FOR UPDATE`. Dois
pedidos do mesmo brigadeiro não passam um pelo outro: o segundo recebe
"estoque insuficiente" e a transação inteira volta atrás.

**Cancelar devolve o que saiu — e só isso.** O estorno lê as movimentações de
saída do próprio pedido, não a ficha técnica atual. Se o gestor editar a
receita depois da venda, reconstituir pelo `JOIN` devolveria
quantidade errada e o insumo sumiria do estoque para sempre.

**O ciclo de vida do pedido é uma máquina de estados, e ela está no backend.**
`pendente → em preparo → pronto → entregue`, com `cancelado` disponível até
`pronto`. Entregue e cancelado não voltam. A tela esconde o botão de cancelar
em pedido entregue, mas quem recusa é a API — regra que existe só na tela é
regra que qualquer outra chamada burla.

**Toda escrita fica registrada.** Quem fez, quando, e o que era antes. O painel
edita por campo (`COALESCE`), então o corpo da requisição não é o estado
final: a auditoria lê a linha **antes** do `UPDATE` e guarda o antes/depois em
JSON, para o log mostrar o diff de verdade. Falha ao gravar o registro nunca
derruba a operação que o gestor acabou de fazer.

**A vitrine reflete o painel na hora.** As rotas públicas vão com
`Cache-Control: no-store`, e a vitrine recarrega quando a aba volta a ficar em
primeiro plano, com trava de 15 segundos e botão "Atualizar" com spinner.

## Escopo

Entrou: vitrine, painel, controle de estoque com transação, ficha técnica,
pedidos com ciclo de vida, auditoria e upload de foto de produto.

Ficou de fora de propósito: pagamento online (a loja combine fora), cadastro
de cliente pelo painel (o cliente entra pelo WhatsApp) e app nativo.

## Estrutura

```
.
├── backend/          API Express + MySQL (o que roda)
├── praticando-backend/  mesmo backend reescrito do zero, como estudo
├── vitrine-cliente/  vitrine pública (React + Vite)
├── painel-admin/     painel do gestor (React + Vite)
├── marca/            logo, símbolo e favicons da marca
├── docker-compose.yml
└── package.json      ESLint da raiz, compartilhado pelos três projetos
```

Fotos de produto ficam em `backend/uploads/` (fora do git) e são servidas por
`express.static`. O `docker-compose.yml` monta volume só do MySQL: **as fotos
não sobrevivem a um `docker compose down -v` nem a um recriar de container** —
o banco continua apontando para `/uploads/...` e a vitrine mostra o quadrado
cinza. Para produção seria preciso um volume nomeado para essa pasta.

## Convenções

Nomes, comentários e interface em português; tipagem explícita (sem `any`);
componentes de até ~150 linhas; `carregando` + `erro` + try/catch/finally em
toda chamada à API; regra de negócio no backend, não na tela.

Lint e tipos nos três projetos, a partir da raiz:

```bash
node ./node_modules/eslint/bin/eslint.js backend/src vitrine-cliente/src painel-admin/src
(cd backend && npx tsc --noEmit)
```