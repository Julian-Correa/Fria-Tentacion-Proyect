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
1. Elegir tamanos de potes (multi-pote: se pueden agregar varios potes antes de continuar)
2. Seleccionar sabores (se repite por cada pote, con indicador de progreso)
3. Agregar toppings opcionales (se repite por cada pote, max 3, con costo adicional)
4. Sumar tortas opcionales
5. Elegir retiro o delivery
6. Completar datos del cliente (nombre, telefono, direccion si es delivery)
7. Revisar resumen completo
8. Enviar por WhatsApp → pagina de exito

Cada paso colapsa al completarse con resumen visible. El usuario puede reabrir pasos anteriores para editar.

## Flujo de estado
1. La app carga configuracion y datos estaticos
2. El usuario avanza paso a paso por el flujo progresivo
3. Paso 1: se agregan potes pendientes (solo con tamano) a estado local
4. Pasos 2-3: sabores y toppings se asignan a cada pote pendiente individualmente
5. Al completar toppings del ultimo pote, todos los potes se agregan al store simultaneamente
6. El store calcula resumen, subtotal y total en vivo
7. El formulario valida datos del cliente segun tipo de entrega
8. Se genera un ID corto de pedido
9. Se arma y abre el mensaje de WhatsApp
10. Se navega a la pagina de exito

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
