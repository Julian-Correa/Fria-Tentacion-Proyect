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
| Fix submit button en delivery | Alta | Completado | Validacion explicita al avanzar + errores visibles en review |
| Agregar horario de delivery en UI | Alta | Completado | business.json actualizado, visible en paso delivery y formulario |
| Eliminar TODO warning de CheckoutForm | Alta | Completado | Reemplazado por deliveryNote desde config |
| Definir radio de entrega | Alta | Completado | Se evalua por WhatsApp al recibir el pedido |
| Definir horario de entrega | Alta | Completado | Delivery hasta las 00hs, visible en UI |
| Revisar alertas de `npm audit` | Media | Completado | `react-router-dom@7.18.1` (última versión, advisory solo afecta RSC — no usado), `brace-expansion` en ESLint (dev-only, bajo riesgo). Build y tests OK |
| Eliminar `PotBuilder.tsx` inactivo | Baja | Completado | Eliminado en commit `ad7dc06` |
| Soporte multi-pote con edicion directa | Media | Completado | Paso 1 permite agregar varios potes, pasos 2-3 se repiten por cada pote |
| Eliminar pote en paso de revision | Media | Completado | Boton eliminar con icono trash en cada pote del review |
| Day mode / light mode | Media | Completado | Paleta #ffffff, #b6ffff, #40cfff. Toggle sol/luna en header |
| Editar/eliminar tortas en paso de revision | Media | Completado | Controles +/- y boton eliminar en cada torta del review |
| Fix dark mode seleccion retiro/delivery | Baja | Completado | Agregado `dark:has-[:checked]:bg-brand-400/30` para mejor visibilidad |
