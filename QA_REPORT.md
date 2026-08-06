# Mobile QA Report

## Resumen
- **Total de pantallas/pasos recorridos:** 7 (Tamaño, Sabores, Toppings, Tortas, Delivery, Datos, Resumen).
- **Total de errores encontrados:** 1
- **Errores críticos:** 0
- **Advertencias (Warnings/UX):** 1

## Errores

### 1. Desbordamiento horizontal (Horizontal Scroll) en dispositivos móviles
- **Pantalla:** Global (Afecta a todas las secciones como botones colapsables y tarjetas de sección).
- **Descripción:** El ancho de algunos elementos interactivos (los botones de los pasos ya completados y la sección activa) exceden el viewport del dispositivo. En un iPhone 15 Pro simulado con un viewport de 393px, el `scrollWidth` del `body` alcanza los 420px y los contenedores de las tarjetas miden 404px de ancho, provocando un ligero scroll horizontal indeseado a lo largo de toda la aplicación.
- **Severidad:** Media (Afecta la percepción de calidad y rompe la ilusión de una "App nativa").
- **Captura:** Registrado en todas las capturas (ej. `screen-9-summary.png`).
- **Cómo reproducirlo:** 
  1. Abrir la aplicación desde un dispositivo móvil (ej. iPhone 15 Pro - ancho 393px).
  2. Deslizar el dedo de izquierda a derecha. Se notará que la pantalla tiene "juego" horizontal.
- **Solución implementada:** Se ha añadido la clase `overflow-x-hidden` a la etiqueta `body` en el archivo `index.html`.

## Consola

No se encontraron errores ni warnings en la consola de JavaScript durante el flujo.
- **Errores:** 0
- **Warnings:** 0

## Network

Todas las solicitudes de red se completaron correctamente sin errores (200 OK). No se detectaron fallos 404 ni 500. Se cargaron correctamente las fuentes (Montserrat) y las imágenes vectoriales de las tortas.
- **Solicitudes fallidas:** Ninguna.

## Responsive

- **Desbordamiento:** Detectado el mencionado scroll horizontal en resoluciones móviles, resuelto.
- **Layouts y tarjetas:** Los layouts de grilla (grid) se ajustan bien en una sola columna para móviles y el diseño progresivo (expandir/colapsar) funciona correctamente.
- **Botón flotante:** El botón flotante de continuar está correctamente situado sobre el footer/summary.

## Accesibilidad

- **Radio Buttons de Delivery:** El input nativo (tipo "radio") de los métodos de entrega ("Retiro" y "Delivery") quedaba interceptado por el div contenedor. 
  - *Solución implementada:* Se han modificado las etiquetas `<label>` nativas enlazando correctamente el `htmlFor` con el `id` del `input` correspondiente en el componente `OrderPage`.

## Conclusión

El funcionamiento lógico de la SPA (Single Page Application) es excelente y cumple satisfactoriamente con la premisa de ser una experiencia fluida, rápida y guiada sin recargas de página.

Se resolvieron satisfactoriamente los dos detalles hallados en la auditoría (Scroll horizontal y semántica de los Radio Buttons).
