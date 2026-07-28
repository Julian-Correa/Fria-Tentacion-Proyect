# Known Issues

## Limitaciones actuales
- No existe backend ni persistencia remota
- El numero de pedido no sera verificable por el negocio fuera de la sesion del cliente
- `npm audit` reporta 7 advisories altos: `brace-expansion` en ESLint (dev-only) y CSRF en `react-router-dom` (solo afecta modo RSC, no usado en esta SPA)

## Reglas de negocio definidas
- Radio de entrega: se evalua manualmente por WhatsApp al recibir el pedido
- Horario de delivery: hasta las 00hs

## Mejoras futuras
- Analitica basica de interacciones
- Internacionalizacion formal si el alcance cambia
- Pruebas de interfaz para el flujo completo del pedido
- Permitir editar potes existentes directamente desde el resumen (sin pasar por el flujo completo)
