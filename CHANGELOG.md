# Changelog

Todos los cambios relevantes de StreamZone se documentan aquí.
Formato basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/).

## [Sin publicar]

## [0.3.0] - 2026-10-08

### Añadido
- Páginas nuevas: `producto.html`, `pedidos.html`, `seguimiento.html`, `gracias.html`, `faq.html`, `contacto.html`, `nosotros.html`, `terminos.html`, `privacidad.html`, `reembolso.html` y `404.html`.
- `config.js`: un solo lugar para el número de WhatsApp, el correo, el horario y el país.
- Botón flotante de WhatsApp en todas las páginas.
- Favicon (`favicon.svg`) y etiquetas Open Graph en todas las páginas.
- Número de pedido (`SZ-AAMMDD-XXXX`) al finalizar; historial en "Mis pedidos" y consulta en "Seguimiento".
- `catalogo.js`: catálogo compartido entre `servicios.html` y `producto.html`.
- Archivos compartidos `base.css`/`base.js` (páginas nuevas) y `comun.css`/`comun.js` (todas las páginas).

### Cambiado
- Al finalizar, el carrito se vacía y se redirige a `gracias.html`; el mensaje de WhatsApp incluye el número de pedido.
- Los botones "Ver producto" del index y de servicios abren `producto.html`.
- Los enlaces del footer (términos, privacidad, reembolso, ayuda) apuntan a páginas reales.
- `carrito.js` toma el número de WhatsApp de `config.js`.

## [0.2.0] - 2026-10-08

### Añadido
- `pages/servicios.html`: catálogo completo con búsqueda, filtro por categoría y botón de añadir al carrito.
- `pages/login.html`: ingreso y registro de cuentas, vista de cuenta y cierre de sesión.
- La sesión se refleja en el icono de usuario del index y de servicios (inicial del nombre).
- `CHANGELOG.md`.

### Cambiado
- Los servicios usan los mismos ids (`p0`–`p4`) y la misma clave `streamzone_cart` que el index y el carrito, así que todo queda conectado.
- `carrito.html` se movió a `pages/` para que coincida con los enlaces del index.

### Notas
- Las cuentas se guardan solo en el navegador (localStorage) con la contraseña cifrada con SHA-256 y sal. Es una demo: para producción hace falta un backend de autenticación.
- Pendiente de configurar: número de WhatsApp en `pages/carrito.html` y precios reales (hoy `null` = "por confirmar").

## [0.1.0] - 2026-10-07

### Añadido
- Página de inicio con hero, carrusel de servicios, detalle de producto con descuentos por volumen, ventajas, FAQ y contacto.
- Carrito con cantidades, cupón, métodos de pago y pedido por WhatsApp.
- Buscador, menú móvil y enlace activo según scroll.
