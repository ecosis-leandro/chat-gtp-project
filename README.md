# Projeto: abrir URL em frame e salvar em PDF

Este projeto usa **Electron** para permitir:

1. Abrir uma URL em um frame (`iframe`) na interface.
2. Salvar a página informada em **PDF** com um botão.

## Requisitos

- Node.js 18+

## Como executar

```bash
npm install
npm start
```

## Como usar

1. Digite a URL (ex: `https://example.com`).
2. Clique em **Abrir URL** para visualizar no frame.
3. Clique em **Salvar como PDF**.
4. Escolha o local do arquivo `.pdf`.

## Observações

- Algumas páginas podem bloquear exibição em `iframe` por políticas de segurança (`X-Frame-Options` / CSP).
- Mesmo nesses casos, a função de salvar PDF tenta carregar a URL em uma janela oculta para gerar o arquivo.
