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
- `src/pages/`: `OrderPage` con flujo progresivo de 8 pasos (multi-pote en paso 1, pasos 2-3 repetidos por pote), `SuccessPage` y `NotFoundPage`
- `src/features/order/`: validaciones, resumen y formulario de datos
- `src/features/catalog/`: catalogo de tortas
- `src/components/ui/`: primitives reutilizables
- `src/layouts/`: shell principal de la aplicacion sin navegacion interna
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

## Flujo de pedido (8 pasos progresivos)
1. Elegir tamanos de potes (multi-pote: se pueden agregar varios antes de continuar)
2. Seleccionar sabores (se repite por cada pote con indicador "Pote X de Y")
3. Agregar toppings opcionales (se repite por cada pote, max 3, con costo)
4. Sumar tortas opcionales
5. Elegir retiro o delivery
6. Completar datos del cliente (nombre, telefono, direccion segun delivery)
7. Revisar resumen y confirmar
8. Enviar por WhatsApp → redirige a pagina de exito

Las secciones completadas se colapsan en resumen compacto. El usuario puede reabrir cualquier paso para editar.

Los potes pendientes (pasos 1-3) se mantienen en estado local y se agregan al store solo cuando todos tienen sabores y toppings asignados.

## Estado actual
- Aplicacion inicializada con Vite, React, TypeScript y TailwindCSS
- Rutas implementadas: `/` → redirige a `/pedido`, `/pedido`, `/exito`, `*`
- Datos de negocio cargados desde JSON en `src/data/`
- Catalogo actual de sabores actualizado a 52 opciones provistas por el negocio
- Precios actuales de potes actualizados desde `src/data/prices.json`
- Toppings actualizados con precios reales (11 opciones)
- README principal del proyecto creado en la raiz
- Repositorio git inicializado y publicado en GitHub sobre rama `main`
- Store del pedido persistido con Zustand + LocalStorage
- Integracion de WhatsApp implementada
- Pagina de exito implementada
- Pruebas criticas implementadas y pasando
- `build`, `lint` y `test` verificados
- Flujo progresivo de 8 pasos con UI inspirada en PedidosYa
- Sin landing page: la app abre directamente en el flujo de pedido
- Sin navegacion interna en el header
- Paso 1 multi-pote: se agregan varios potes antes de pasar a sabores
- Pasos 2-3 repetidos por cada pote con UI de progreso (indicadores ① ② ③)
- CTA contextual por paso: "Guardar y siguiente" / "Continuar a toppings" / "Agregar al pedido"
- `npm audit` revisado: react-router-dom@7.18.1 (latest), ESLint 9.x (compatible)

## Roadmap inmediato
1. Probar flujo completo multi-pote en navegador
2. Evaluar edicion directa de potes desde el resumen (sin pasar por flujo completo)
3. Evaluar pruebas de interfaz para flujo completo del pedido
