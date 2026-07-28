# Coding Standards

## Principios
- SOLID
- DRY
- KISS
- YAGNI
- Composicion sobre herencia

## React
- Solo componentes funcionales
- Hooks para estado y efectos
- TypeScript estricto
- Preferir composicion y props tipadas
- Evitar componentes grandes o profundamente anidados

## Datos y configuracion
- Datos de negocio en JSON
- Configuracion transversal en `src/config/app.ts`
- No hardcodear precios, limites ni textos de negocio dentro de componentes

## Estado
- Zustand como fuente unica de verdad del pedido
- Persistencia local controlada y tipada

## Formularios y validacion
- React Hook Form + Zod
- Mostrar mensajes de error claros en espanol

## Estilo y tooling
- ESLint para calidad
- Prettier para formato
- Tailwind para estilos
- Pruebas unitarias para logica critica

## Documentacion
- Actualizar `ProjectMemory.md`, `Todo.md`, `Decisions.md`, `Changelog.md` y `SessionLog.md` al cerrar cada tarea relevante
