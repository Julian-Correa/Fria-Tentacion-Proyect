# Todo

## Pendiente
| Tarea | Prioridad | Estado | Notas |
| --- | --- | --- | --- |
| Crear documentacion obligatoria | Alta | Completado | Estado inicial registrado |
| Inicializar stack base del proyecto | Alta | Completado | Vite, React, TS, Tailwind, ESLint, Prettier, Vitest |
| Implementar datos configurables en JSON | Alta | Completado | `business.json`, `sizes.json`, `prices.json`, `flavors.json`, `toppings.json`, `cakes.json` |
| Actualizar catalogo real de sabores | Alta | Completado | `src/data/flavors.json` reemplazado por listado provisto por el negocio |
| Actualizar precios reales de tamanos | Alta | Completado | `src/data/prices.json` agregado como fuente de verdad de precios y limites |
| Crear README principal | Alta | Completado | Documentacion de uso, stack, scripts y estructura |
| Publicar repositorio en GitHub | Alta | Completado | Push realizado a `Julian-Correa/Fria-Tentacion-Proyect` |
| Implementar flujo de pedido y resumen en vivo | Alta | Completado | Potes, toppings, tortas, retiro y delivery |
| Implementar integracion con WhatsApp | Alta | Completado | Mensaje formateado y apertura en nueva pestana |
| Persistir carrito en LocalStorage | Alta | Completado | Zustand persistiendo pedido y datos del cliente |
| Agregar pruebas de logica critica | Alta | Completado | Reglas de sabores, calculo total y mensaje WhatsApp |
| Preparar Netlify | Media | Completado | `netlify.toml` con redirect SPA |
| Refactor a flujo progresivo de 8 pasos | Alta | Completado | OrderPage con UI paso a paso, secciones colapsables y CTA contextual |
| Eliminar landing page | Alta | Completado | `/` redirige a `/pedido` |
| Eliminar radios duplicados en CheckoutForm | Alta | Completado | Delivery se selecciona en paso dedicado |
| Fix infinite loop en useOrder hook | Alta | Completado | Selectores individuales de Zustand |
| Actualizar toppings con precios reales | Media | Completado | 7 toppings nuevos agregados |
| Definir radio de entrega | Alta | Pendiente | TODO de negocio |
| Definir horario de entrega | Alta | Pendiente | TODO de negocio |
| Revisar alertas de `npm audit` | Media | Pendiente | `react-router-dom` y tooling aun reportan advisories upstream |
| Eliminar `PotBuilder.tsx` inactivo | Baja | Pendiente | Quedo sin uso tras refactor a flujo inline en OrderPage |
| Soporte multi-pote con edicion directa | Baja | Pendiente | Actualmente solo crear/eliminar, no editar potes existentes |
