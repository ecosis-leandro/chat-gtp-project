# Projeto: abrir URL em frame e salvar em PDF

Este projeto usa **Electron** para permitir:

1. Abrir uma URL em um frame (`iframe`) na interface.
2. Salvar a página informada em **PDF** com um botão.
3. Ativar opcionalmente um bypass para cabeçalhos `X-Frame-Options` e diretiva `frame-ancestors` da CSP.

## Requisitos

- Node.js 18+

## Como executar

```bash
npm install
npm start
```

## Como usar

1. Digite a URL (ex: `https://example.com`).
2. (Opcional) Ative **Bypass X-Frame-Options/CSP**.
3. Clique em **Abrir URL** para visualizar no frame.
4. Clique em **Salvar como PDF**.
5. Escolha o local do arquivo `.pdf`.

## Observações importantes

- O bypass remove cabeçalhos de proteção de frame nas respostas HTTP da sessão padrão do Electron.
- Esse recurso pode reduzir segurança e deve ser usado apenas em ambiente controlado/interno.
- Dependendo da implementação do site, ainda podem existir limitações adicionais para renderização no frame.
