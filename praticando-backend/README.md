# Praticando o backend do zero

Isto **não** é o backend do TCC — é o mesmo backend reescrito do zero, para
aprender. Vai ter código torto no começo: é assim mesmo.

- `praticando-backend/` — este exercício, escrito por você
- `backend/` — o backend que roda de verdade e vai ser apresentado

Separações para os dois não se atropelarem:

| | estudo | projeto |
|---|---|---|
| banco | `confeitaria_estudo` | `confeitaria_db` |
| porta | `3001` | `3000` |

Rotas de API chamadas de um só lugar, com uma pasta própria:
`praticando-backend/src/requisicoes.http`.
