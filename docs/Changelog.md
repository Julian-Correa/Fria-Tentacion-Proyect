# Changelog

## 2026-07-27
- Creacion de la documentacion base obligatoria
- Registro del estado inicial del workspace vacio
- Registro de decisiones iniciales de arquitectura
- Inicializacion del proyecto con Vite, React, TypeScript y TailwindCSS
- Implementacion del flujo de pedido con Zustand, React Hook Form y Zod
- Implementacion de integracion con WhatsApp, pagina de exito y persistencia local
- Agregado de pruebas criticas para calculos, validacion y mensaje de WhatsApp
- Configuracion de Netlify, ESLint, Prettier y Vitest
- Actualizacion de `src/data/flavors.json` con el catalogo real de 52 sabores
- Agregado `src/data/prices.json` y actualizacion de precios reales de tamanos
- Creacion de `README.md` principal del proyecto
- Publicacion inicial del proyecto en GitHub sobre la rama `main`

## 2026-07-28
- Refactor completo de `OrderPage` a flujo progresivo de 8 pasos (tamano → sabores → toppings → tortas → delivery → datos → revision → WhatsApp)
- Eliminacion de `HomePage` redirigiendo `/` a `/pedido`
- Simplificacion del header de `AppShell` eliminando navegacion innecesaria
- Eliminacion de radios de delivery duplicados en `CheckoutForm` (paso dedicado aparte)
- Sincronizacion de `orderType` entre Zustand store y React Hook Form en el paso de delivery
- Fix de infinite re-render loop en `useOrder` hook (selectores de Zustand individuales)
- Actualizacion del `completed` state al editar tamano/sabores desde secciones colapsadas
- Agregado de 7 nuevos toppings con precios reales a `toppings.json`
- Implementacion de seleccion multi-pote en paso 1 (tamanos): se pueden agregar varios potes antes de pasar a sabores
- Paso 2 (sabores) y paso 3 (toppings) repetidos por cada pote con indicador de progreso (Pote X de Y)
- Los sabores del primer pote persisten al pasar al siguiente (misma card reutilizada)
- CTA contextual: "Guardar y siguiente" / "Continuar a toppings" / "Agregar al pedido"
- Al terminar toppings del ultimo pote, todos los potes se agregan al store simultaneamente
- Flujo de edicion adaptado al nuevo modelo multi-pote
- Boton eliminar pote en paso de revision
- Controles +/- y delete para tortas en paso de revision
- Implementacion completa de day mode con paleta `#ffffff` (fondo), `#b6ffff` (acentos), `#40cfff` (primario)
- Migracion de todos los componentes UI al patron `dark:` para soporte light/dark mode
- Revision de alertas `npm audit`: react-router-dom@7.18.1, eslint mantenido en 9.x
- Actualizacion de documentacion completa


