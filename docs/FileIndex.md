# File Index

## docs/ProjectMemory.md
- Memoria viva del proyecto, stack, reglas y estado actual

## docs/Todo.md
- Lista de tareas pendientes, prioridades y estado

## docs/Decisions.md
- Registro ADR de decisiones tecnicas y de negocio relevantes

## docs/Architecture.md
- Descripcion de arquitectura, modulos y flujos principales

## docs/Changelog.md
- Historial cronologico de cambios del proyecto

## docs/CodingStandards.md
- Convenciones de codigo y mantenimiento

## docs/KnownIssues.md
- Limitaciones, bugs y mejoras futuras conocidas

## docs/SessionLog.md
- Resumen por sesion con trabajo completado y siguiente paso sugerido

## README.md
- Entrada principal del proyecto con setup, scripts, estructura y reglas implementadas

## src/config/app.ts
- Configuracion central de negocio, storage y feature flags

## src/services/catalog.ts
- Carga y validacion tipada de todos los JSON del negocio

## src/data/prices.json
- Fuente editable de precios vigentes y limites de sabores por tamano

## src/store/order-store.ts
- Estado global del pedido con persistencia local

## src/features/order/components/PotBuilder.tsx
- Constructor principal de potes con reglas de sabores y toppings

## src/features/order/components/OrderSummary.tsx
- Resumen en vivo con totales y eliminacion de items

## src/features/order/components/CheckoutForm.tsx
- Formulario de retiro/delivery validado con React Hook Form y Zod

## src/services/whatsapp.ts
- Construccion del mensaje y URL de WhatsApp

## src/utils/orderCalculations.ts
- Calculos de subtotal, total y precios por item

## src/features/order/schemas/orderSchema.ts
- Schemas Zod para cliente, potes y pedido completo
