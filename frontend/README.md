# React + Vite

## PostHog

Configure `VITE_POSTHOG_KEY` (e, opcionalmente, `VITE_POSTHOG_HOST`) conforme o arquivo `.env.example`. A chave é pública e própria para browser; não use uma chave de projeto secreta no frontend. Sem `VITE_POSTHOG_KEY`, analytics fica desativado sem afetar o app.

O catálogo de eventos privilegia os resultados dos fluxos: autenticação, visualização/criação/edição de receitas, interações, comentários e respostas, chatbot, favoritos/coleções, planos/checkout e configurações. Cada rota também gera `$pageview` na navegação SPA.

Por privacidade, não enviamos para o PostHog senhas, tokens, CPF, telefone, e-mail, URLs de pagamento, nomes de arquivos, textos de receitas, termos pesquisados ou mensagens/respostas do chatbot. Autocapture e gravação de sessão também ficam desativados. Pessoas são identificadas apenas por `user_<id>` e pelo papel da conta.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript and enable type-aware lint rules. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
