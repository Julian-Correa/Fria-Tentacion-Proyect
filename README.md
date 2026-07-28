# Fria Tentacion

Aplicacion web responsive para pedidos de helado artesanal y tortas, con confirmacion final por WhatsApp.

## Estado del proyecto

- Frontend only
- Sin backend
- Sin base de datos
- Carrito persistido en LocalStorage
- Confirmacion por WhatsApp al numero `5491173719562`
- Despliegue objetivo: Netlify

## Stack

- React
- TypeScript
- Vite
- TailwindCSS
- React Router
- Zustand
- React Hook Form
- Zod
- Framer Motion
- Lucide React
- Vitest
- React Testing Library
- ESLint
- Prettier

## Scripts

```bash
npm install
npm run dev
npm run build
npm run test
npm run lint
```

## Flujo principal

1. El cliente arma uno o varios potes.
2. Elige sabores sin repetir dentro del mismo pote.
3. Puede agregar hasta 3 toppings por pote.
4. Puede sumar tortas al mismo pedido.
5. Completa datos de retiro o delivery.
6. La app valida el pedido.
7. Se genera un ID corto.
8. Se abre WhatsApp con el mensaje formateado.

## Reglas de negocio implementadas

- Tamanos disponibles:
  - `1/4 Kg`: hasta 2 sabores
  - `1/2 Kg`: hasta 4 sabores
  - `1 Kg`: hasta 4 sabores
- No se permiten sabores repetidos dentro del mismo pote.
- Maximo 3 toppings por pote.
- Resumen en vivo con subtotal y total.
- Numero de pedido efimero, no persistido.

## Datos editables del negocio

Todos los datos configurables estan fuera de los componentes.

- `src/data/business.json`
- `src/data/sizes.json`
- `src/data/prices.json`
- `src/data/flavors.json`
- `src/data/toppings.json`
- `src/data/cakes.json`

## Estructura

```text
docs/
public/images/
src/
  components/
  config/
  constants/
  data/
  features/
  hooks/
  layouts/
  pages/
  services/
  store/
  styles/
  test/
  types/
  utils/
```

## Rutas

- `/`
- `/pedido`
- `/exito`
- `*`

## Calidad y verificaciones

- `npm run build`
- `npm run test`
- `npm run lint`

## Documentacion interna

La carpeta `docs/` mantiene la memoria viva del proyecto:

- `ProjectMemory.md`
- `Todo.md`
- `Decisions.md`
- `Architecture.md`
- `Changelog.md`
- `FileIndex.md`
- `CodingStandards.md`
- `KnownIssues.md`
- `SessionLog.md`

## Pendientes de negocio

- Definir radio de entrega
- Definir horario de entrega

## Notas

- El propietario puede actualizar sabores, precios, tortas e imagenes sin tocar componentes.
- Las imagenes editables viven en `public/images/`.
- Netlify ya esta configurado con redirect SPA en `netlify.toml`.
