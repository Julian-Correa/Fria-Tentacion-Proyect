# Project Memory

## Proyecto
- Nombre: Fria Tentacion
- Tipo: Aplicacion web responsive para pedidos de helado y tortas
- Despliegue objetivo: Netlify
- Alcance actual: Frontend only, sin backend, sin base de datos

## Stack
- React
- TypeScript estricto
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

## Arquitectura objetivo
- Arquitectura basada en features con capas compartidas en `src/`
- Datos de negocio editables en JSON fuera de los componentes
- Configuracion centralizada en `src/config/`
- Estado global del pedido en Zustand con persistencia en LocalStorage
- Validacion con Zod y formularios con React Hook Form

## Arquitectura implementada
- `src/features/order/`: constructor de potes, validaciones y resumen
- `src/features/catalog/`: catalogo de tortas
- `src/components/ui/`: primitives reutilizables
- `src/layouts/`: shell principal de la aplicacion
- `src/services/`: catalogo tipado y WhatsApp
- `src/store/`: store global persistido del pedido
- `src/hooks/`: hooks de pedido, tema, LocalStorage y WhatsApp
- `src/utils/`: utilidades puras y testeables

## Datos de catalogo actuales
- `src/data/sizes.json`: identificadores y etiquetas de tamanos
- `src/data/prices.json`: precios vigentes y limites de sabores por tamano

## Reglas de negocio confirmadas
- Un pedido puede incluir multiples productos
- Potes: `1/4 Kg`, `1/2 Kg`, `1 Kg`
- Limites de gustos por pote:
  - `1/4 Kg`: maximo 2 gustos
  - `1/2 Kg`: maximo 4 gustos
  - `1 Kg`: maximo 4 gustos
- Un gusto no puede repetirse dentro del mismo pote
- Toppings: maximo 3, con costo adicional
- Tortas cargadas desde JSON con nombre, descripcion, precio e imagen
- El resumen debe ser en vivo
- Metodo de confirmacion: WhatsApp al numero `5491173719562`
- El numero de pedido debe ser corto, unico por sesion y no persistido

## Reglas pendientes
- TODO: definir radio de entrega
- TODO: definir horario de entrega

## Estructura objetivo
- `public/images/`
- `src/features/`
- `docs/`
- `public/images/`
- `src/components/`
- `src/layouts/`
- `src/pages/`
- `src/hooks/`
- `src/store/`
- `src/services/`
- `src/types/`
- `src/utils/`
- `src/constants/`
- `src/config/`
- `src/data/`
- `src/assets/`
- `src/styles/`

## Estado actual
- Aplicacion inicializada con Vite, React, TypeScript y TailwindCSS
- Rutas implementadas: `/`, `/pedido`, `/exito`, `*`
- Datos de negocio cargados desde JSON en `src/data/`
- Catalogo actual de sabores actualizado a 52 opciones provistas por el negocio
- Precios actuales de potes actualizados desde `src/data/prices.json`
- README principal del proyecto creado en la raiz
- Repositorio git inicializado y publicado en GitHub sobre rama `main`
- Store del pedido persistido con Zustand + LocalStorage
- Integracion de WhatsApp implementada
- Pagina de exito implementada
- Pruebas criticas implementadas y pasando
- `build`, `lint` y `test` verificados

## Roadmap inmediato
1. Definir radio de entrega
2. Definir horario de entrega
3. Revisar alertas pendientes de `npm audit` relacionadas con dependencias upstream
4. Evaluar pruebas de interfaz para flujo completo del pedido
