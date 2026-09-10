# Analytics — Designer Sá

A camada `analytics.js` já está instrumentada e não envia nome, telefone, e-mail, endereço ou a mensagem do orçamento.

## Eventos

- `landing_view`: entrada na página com origem, mídia e campanha.
- `room_select`: ambiente selecionado na experiência visual.
- `quote_open`: abertura do orçamento.
- `quote_step_view`: avanço entre os quatro passos.
- `quote_abandon`: saída do funil antes da conclusão, com passo e ambiente.
- `quote_complete`: conclusão do funil antes de abrir o WhatsApp.
- `whatsapp_click`: clique ou envio para o WhatsApp.
- `instagram_click`: clique para o Instagram.

## Atribuição

São lidos `utm_source`, `utm_medium`, `utm_campaign`, `utm_content` e `utm_term`. Na ausência de UTM, a origem é inferida de Google, Instagram, Facebook, referral ou acesso direto. O primeiro toque é preservado no navegador e a sessão atual é mantida separadamente.

## Ativar GA4

Crie uma propriedade/fluxo Web no Google Analytics 4 e copie o Measurement ID no formato `G-XXXXXXXXXX`. Em cada página existe:

```html
<meta name="ga4-id" content="" />
```

Preencha o `content` com o Measurement ID. O `analytics.js` carrega o GA4 automaticamente e encaminha os eventos acima.

## Privacidade

Não adicionar nome, telefone, e-mail, mensagem livre ou endereço aos parâmetros de analytics. Esses dados pertencem ao atendimento, não à medição de comportamento.
