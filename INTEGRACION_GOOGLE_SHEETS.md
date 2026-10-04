# Conectar las confirmaciones a Google Sheets

El formulario registra el nombre completo, el estado de confirmación, los nombres de todos los acompañantes y la fecha de envío. El script crea una pestaña llamada **Confirmaciones** con esas columnas.

## Preparar Google Sheets

1. Crea una hoja de cálculo en Google Sheets.
2. En esa hoja abre **Extensiones → Apps Script**.
3. Copia el contenido de `google-apps-script.gs` al editor y guarda.
4. Pulsa **Implementar → Nueva implementación**. Elige **Aplicación web**.
5. Configura **Ejecutar como: Yo** y el acceso como **Cualquier persona** para que los invitados puedan confirmar sin iniciar sesión.
6. Implementa, autoriza el acceso que solicite Google y copia la URL que termina en `/exec`.
7. En `script.js`, pega esa URL en `googleAppsScriptUrl` dentro de `CONFIG`.

Si modificas el código de Apps Script después, crea una nueva versión desde **Implementar → Administrar implementaciones → Editar**.

## Completar la invitación

En el bloque `CONFIG` al inicio de `script.js`, reemplaza:

- `photoUrl`: una URL pública directa a tu foto (por ejemplo, alojada en tu sitio).
- `locationName`: nombre del salón o lugar.
- `locationAddress`: dirección completa, incluyendo ciudad y país. El mapa incrustado y el botón de Google Maps usarán esa dirección.
- `googleAppsScriptUrl`: URL `/exec` de la aplicación web desplegada.

La página requiere conexión a internet para Google Fonts, el mapa y el envío. El navegador no puede verificar la respuesta de Apps Script mediante este envío entre dominios, así que tras desplegarlo conviene hacer un envío de prueba y confirmar que aparece como nueva fila en la hoja.
