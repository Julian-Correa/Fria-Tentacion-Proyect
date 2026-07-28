# Known Issues

## Limitaciones actuales
- No existe backend ni persistencia remota
- El numero de pedido no sera verificable por el negocio fuera de la sesion del cliente
- `npm audit` aun reporta advisories upstream en `react-router-dom` y dependencias de tooling
- `PotBuilder.tsx` quedo inactivo tras refactor a flujo inline en OrderPage (se puede eliminar)

## Bugs conocidos
- ~~Infinite re-render loop en `OrderSummary` por selector de Zustand que creaba objeto nuevo en cada render~~ (fix: selectores individuales en `useOrder` hook)
- El `completed` state para `toppings` con nota no se actualiza al editar secciones colapsadas (solo se actualiza al agregar el pote)

## Reglas de negocio definidas
- Radio de entrega: se evalua manualmente por WhatsApp al recibir el pedido
- Horario de delivery: hasta las 00hs

## Mejoras futuras
- Analitica basica de interacciones
- Internacionalizacion formal si el alcance cambia
- Pruebas de interfaz para el flujo completo del pedido
- Soporte multi-pote con edicion directa (no solo crear/eliminar)
