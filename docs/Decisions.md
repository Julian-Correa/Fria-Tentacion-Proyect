# Decisions

## ADR-001
- Fecha: 2026-07-27
- Decision: usar una SPA frontend-only con confirmacion de pedidos por WhatsApp
- Razon: el alcance definido no requiere backend ni persistencia remota
- Alternativas: backend propio, formulario por email, ecommerce completo
- Impacto: el numero de pedido sera efimero y la confirmacion real dependera de WhatsApp

## ADR-002
- Fecha: 2026-07-27
- Decision: separar datos de negocio editables en archivos JSON
- Razon: permitir mantenimiento manual por parte del propietario sin tocar componentes
- Alternativas: constantes TypeScript, CMS, backend
- Impacto: la UI debe consumir datos normalizados desde `src/data/`

## ADR-003
- Fecha: 2026-07-27
- Decision: centralizar configuracion transversal en `src/config/app.ts`
- Razon: evitar magic numbers y facilitar cambios futuros entre sesiones
- Alternativas: valores distribuidos en componentes, variables sueltas en utilidades
- Impacto: toda logica compartida debe leer configuracion desde una unica fuente

## ADR-004
- Fecha: 2026-07-27
- Decision: dejar como TODO explicito el radio y horario de entrega
- Razon: son reglas de negocio importantes que no fueron definidas
- Alternativas: asumir valores temporales
- Impacto: la UI y validaciones deben evitar depender de estas reglas hasta su definicion

## ADR-005
- Fecha: 2026-07-27
- Decision: persistir el borrador del pedido con Zustand y LocalStorage, pero no persistir el ultimo numero de pedido
- Razon: el carrito no debe perderse al refrescar, pero el identificador confirmado es efimero por requerimiento
- Alternativas: no persistir nada, persistir tambien el ultimo pedido, usar solo estado local
- Impacto: la pagina de exito depende de memoria de sesion y el carrito se limpia al confirmar

## ADR-006
- Fecha: 2026-07-27
- Decision: snapshotear nombre y precio de productos dentro del carrito al agregarlos
- Razon: el resumen y el pedido enviado a WhatsApp deben ser estables aunque el catalogo editable cambie luego
- Alternativas: recalcular siempre desde el catalogo vivo usando solo IDs
- Impacto: el carrito preserva el contexto exacto del pedido armado por el cliente

## ADR-007
- Fecha: 2026-07-27
- Decision: usar React Router con rutas simples y flujo SPA para `/`, `/pedido`, `/exito` y `404`
- Razon: el alcance es frontend-only y no requiere loaders ni data APIs complejas
- Alternativas: router basado en archivos, framework full-stack, flujo single-screen
- Impacto: navegacion simple, facil mantenimiento y compatibilidad directa con Netlify SPA redirects

## ADR-008
- Fecha: 2026-07-27
- Decision: tomar el listado entregado por el negocio como fuente de verdad actual para `src/data/flavors.json`
- Razon: los sabores deben mantenerse editables y reflejar exactamente el catalogo operativo del local
- Alternativas: conservar el listado inicial de ejemplo, normalizar nombres manualmente
- Impacto: la UI muestra etiquetas y acentos tal como fueron definidos por el negocio

## ADR-009
- Fecha: 2026-07-27
- Decision: separar `sizes.json` de `prices.json`, usando este ultimo como fuente de verdad para precios y limites de sabores
- Razon: el negocio entrego precios reales como archivo propio y eso reduce acoplamiento entre etiquetas y reglas comerciales
- Alternativas: seguir guardando precio y limite dentro de `sizes.json`
- Impacto: la carga del catalogo ahora fusiona ambos archivos por `id`

## ADR-010
- Fecha: 2026-07-27
- Decision: mantener un `README.md` raiz como punto de entrada operativo del proyecto
- Razon: facilita onboarding rapido entre sesiones y centraliza setup, scripts y estructura general
- Alternativas: depender solo de la carpeta `docs/`
- Impacto: cualquier colaborador puede arrancar el proyecto sin recorrer primero la documentacion interna completa
