# Architecture

## Vision general
- Aplicacion SPA con React Router
- Renderizado client-side
- Estado global del pedido en Zustand
- Persistencia local del carrito con LocalStorage
- Validacion tipada con Zod
- UI mobile-first con TailwindCSS y soporte dark mode

## Modulos principales
- `pages/`: `OrderPage` con flujo progresivo, `SuccessPage` y `NotFoundPage` (sin `HomePage`)
- `components/ui/`: UI reutilizable
- `features/order/`: potes, resumen y validaciones del pedido
- `features/catalog/`: tortas y catalogo visible
- `store/`: estado global, acciones y persistencia
- `services/`: servicios puros como construccion de mensajes de WhatsApp
- `data/`: archivos JSON editables del negocio
- `config/`: configuracion central de aplicacion
- `utils/`: utilidades puras

## Flujo de pedido (8 pasos progresivos)
1. Elegir tamano del pote
2. Seleccionar sabores (validacion segun limite del tamano)
3. Agregar toppings opcionales (max 3, con costo adicional)
4. Sumar tortas opcionales
5. Elegir retiro o delivery
6. Completar datos del cliente (nombre, telefono, direccion si es delivery)
7. Revisar resumen completo
8. Enviar por WhatsApp → pagina de exito

Cada paso colapsa al completarse con resumen visible. El usuario puede reabrir pasos anteriores para editar.

## Flujo de estado
1. La app carga configuracion y datos estaticos
2. El usuario avanza paso a paso por el flujo progresivo
3. Los pasos 0-2 construyen un pote que se agrega al carrito
4. El store calcula resumen, subtotal y total en vivo
5. El formulario valida datos del cliente segun tipo de entrega
6. Se genera un ID corto de pedido
7. Se arma y abre el mensaje de WhatsApp
8. Se navega a la pagina de exito

## UI/UX
- Sin landing page: la app abre directamente en `/pedido`
- Sin navegacion interna en el header
- Mobile: barra flotante inferior con total + CTA contextual
- Desktop: layout de dos columnas (izquierda: seleccion, derecha: resumen sticky)
- Animaciones sutiles con Tailwind transitions
- Secciones colapsables con icono de check al completarse

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
