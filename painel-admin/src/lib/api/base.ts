// Base compartilhada das chamadas à API. Fica num arquivo só porque é o
// único lugar que sabe: a URL base, o header de token e o formato do erro.

const BASE: string =
  (import.meta.env.VITE_API_URL as string | undefined) ||
  "http://localhost:3000/api";

/** Erro com status HTTP, para a tela decidir a mensagem (401 expira sessão). */
export class ErroApi extends Error {
  codigo: number;
  constructor(codigo: number, mensagem: string) {
    super(mensagem);
    this.codigo = codigo;
  }
}

/** GET/POST/PUT/PATCH autenticado: já joga o Bearer e traduz erro 4xx/5xx. */
export async function requisitar<T>(
  rota: string,
  token: string,
  opcoes?: RequestInit,
): Promise<T> {
  const resposta = await fetch(`${BASE}${rota}`, {
    ...opcoes,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(opcoes?.headers ?? {}),
    },
  });
  const corpo = (await resposta.json().catch(() => ({}))) as {
    erro?: string;
  };
  if (!resposta.ok) {
    throw new ErroApi(
      resposta.status,
      corpo.erro ?? `A API respondeu ${resposta.status}.`,
    );
  }
  return corpo as T;
}

export { BASE };
