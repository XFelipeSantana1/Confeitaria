# Painel do Gestor 🍰

Área logada da confeitaria (React + TypeScript + Vite + Tailwind +
react-router-dom). Fala com o backend Express via JWT no header
`Authorization: Bearer`.

## Como rodar

```bash
cd painel-admin
npm install
npm run dev      # http://localhost:5173/painel
```

Backend no ar (`cd backend && npm run dev`) + MySQL (`docker compose up -d`
na raiz). Primeiro acesso: crie o admin via `POST /api/auth/registrar`
(base vazia libera o bootstrap) e entre com ele em `/entrar`.

## Rotas

- `/entrar` — login (pública)
- `/painel` — Resumo: métricas (pendentes, em preparo, a receber, estoque
  baixo) + mais vendidos + estoque baixo + últimos pedidos
- `/painel/pedidos` — lista com abas por status + drawer de detalhe
  (avançar status, cancelar com estorno, marcar pagamento)
- `/painel/insumos` — CRUD + registrar entrada/perda/ajuste de estoque
- `/painel/produtos` — CRUD + liga/desliga na vitrine + ficha técnica
- `/painel/categorias` — CRUD (remover deixa produtos sem categoria)
- `/painel/perfil` — dados (nome/email) e troca de senha

## Estrutura (`src/`)

- `types/` — `Usuario`, `Sessao`, `Pedido`, `ItemPedido`, `DetalhePedido`,
  `Insumo`, `ProdutoAdmin`, `ItemFicha`, `Categoria`, `ProdutoVendido`
- `lib/` — `api.ts` (fetch com token + `ErroApi`), `sessao.ts`,
  `formatarMoeda.ts`, `pedido.ts` (rótulos/tons/fluxo de status)
- `hooks/` — `useAutenticacao` (contexto), `useResumo`, `usePedidos`,
  `useInsumos`, `useProdutos`, `useCategorias`
- `components/` — `BarraLateral`, `EstruturaPainel`, `RotaProtegida`,
  `CabecalhoSecao`, `CartaoMetrica`, `ListaMaisVendidos`,
  `ListaBaixoEstoque`, `UltimosPedidos`, `TabelaInsumos`, `TabelaProdutos`,
  `DrawerPedido`, `ItensPedido`, `AcoesPedido`, `CabecalhoDrawer`,
  `EditorFicha`, `ModaisProduto`, `Modal{Insumo,Movimentacao,Produto,
  Confirmacao,Categoria}`, `ui/` (Botao, Cartao, Entrada)
- `pages/` — `Entrar`, `Resumo`, `Pedidos`, `Insumos`, `Produtos`,
  `Categorias`, `Perfil`

## Padrões

Nomes em português, tipagem explícita (sem `any`), componentes de até ~150
linhas, `carregando` + `erro` + try/catch/finally em toda chamada à API.
