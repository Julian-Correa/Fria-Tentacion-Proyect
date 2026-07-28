# Architecture

## Vision general
- Aplicacion SPA con React Router
- Renderizado client-side
- Estado global del pedido en Zustand
- Persistencia local del carrito con LocalStorage
- Validacion tipada con Zod
- UI mobile-first con TailwindCSS y soporte dark mode

## Modulos principales
- `pages/`: pantallas de Home, Pedido, Exito y 404
- `components/ui/`: UI reutilizable
- `features/order/`: potes, resumen y validaciones del pedido
- `features/catalog/`: tortas y catalogo visible
- `store/`: estado global, acciones y persistencia
- `services/`: servicios puros como construccion de mensajes de WhatsApp
- `data/`: archivos JSON editables del negocio
- `config/`: configuracion central de aplicacion
- `utils/`: utilidades puras

## Flujo de estado
1. La app carga configuracion y datos estaticos
2. El usuario arma el pedido
3. El store calcula resumen, subtotal y total
4. El formulario valida datos del cliente y entrega/retiro
5. Se genera un ID corto de pedido
6. Se arma el mensaje de WhatsApp
7. Se abre WhatsApp y luego se navega a Exito

## Persistencia
- Persistido: potes, tortas y datos del cliente
- No persistido: ultimo pedido confirmado
- Tema visual persistido por separado en LocalStorage

## Flujo de datos
- JSON -> adaptadores tipados -> fusion de `sizes.json` + `prices.json` -> UI y store
- Formularios -> schemas Zod -> store -> resumen
- Store -> utilidades de formato -> mensaje WhatsApp / vistas

## Criterios de calidad
- Componentes pequenos y reutilizables
- Sin `any`
- Sin datos de negocio hardcodeados en componentes
- Errores visibles para el usuario
- Documentacion actualizada por tarea
- Pruebas unitarias para logica critica
