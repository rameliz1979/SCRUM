# Laboratorio de ideas · ADSO

Aplicación estática en español basada en `SCRUM.docx`. Permite desarrollar los cinco momentos del taller, evaluar propuestas, dibujar o cargar tres bocetos, construir el primer backlog y descargar la ficha de ideación.

## Ejecutar

Sirve esta carpeta con un servidor HTTP estático, por ejemplo la extensión Live Server de Visual Studio Code. Abre `index.html` mediante ese servidor. Los módulos JavaScript necesitan HTTP; abrir el archivo con doble clic no es suficiente. El CSS compilado está incluido y no requiere npm para usar la aplicación.

Para modificar el diseño con Tailwind CSS 4.3.3, instala Node.js 22 o posterior y ejecuta `npm install` y `npm run build:css`. Edita `assets/tailwind.source.css` y las clases de las vistas; vuelve a compilar después de cambiar estilos. Para ejecutar las pruebas de dominio, importación y documentos usa `npm test`. El workflow de GitHub Pages compila Tailwind y ejecuta estas pruebas antes de publicar.

## GitHub Pages

1. Crea un repositorio en GitHub y sube **el contenido de esta carpeta a la raíz**, incluyendo `.github/workflows/pages.yml` y `.nojekyll`.
2. Usa `main` como rama principal.
3. En Settings → Pages → Build and deployment, selecciona **GitHub Actions**.
4. Ejecuta el workflow «Publicar taller en GitHub Pages» desde Actions o realiza un push a main.
5. El workflow mostrará la dirección publicada. Las rutas relativas funcionan también bajo `https://usuario.github.io/repositorio/`.

También puedes seleccionar Deploy from a branch → main → /(root) en Pages, sin usar el workflow.

## Arquitectura en capas

- `src/domain`: modelo, reglas de validación, puntuación y tiempos del taller.
- `src/application`: casos de uso y composición de la ficha descargable.
- `src/infrastructure`: almacenamiento local y descarga de archivos.
- `src/presentation`: formularios, navegación, temporizador y dibujo.
- `assets`: estilos y diseño adaptable.

La presentación llama a los casos de uso; estos reciben el repositorio como dependencia. El dominio no depende del navegador. Es una arquitectura por capas dentro de una aplicación cliente: GitHub Pages sirve archivos estáticos y no ejecuta un backend.

## Datos y descargas

El avance se guarda en localStorage del navegador por equipo/dispositivo. No hay cuentas, sincronización entre dispositivos ni tablero compartido en tiempo real. Exportar e importar JSON permite transportar el taller. Importar reemplaza el avance actual tras una confirmación. No borres los datos del navegador sin exportar antes. Si el almacenamiento está lleno o bloqueado se muestra un aviso; aún puedes exportar el estado actual.

La ficha se descarga como **`.docx` nativo** (paquete OOXML con imágenes incrustadas), con el logo SENA, identificación, funcionalidades, backlog, todas las listas de problemas e ideas, matriz de puntuación, decisión, bocetos y reflexión. Para PDF utiliza «Ficha PDF» o «Imprimir / Guardar PDF» y selecciona «Guardar como PDF» en el navegador. Ambas versiones usan fecha de Colombia, encabezado institucional, tablas y nombres de archivo basados en el proyecto. Se permiten fichas parciales; los datos faltantes aparecen como «Sin registrar».

Los botones «Agregar problema», «Agregar idea de software» y «Agregar funcionalidad» amplían las listas hasta 200 registros cada una. Conservan los mínimos de cinco problemas, diez ideas y cinco funcionalidades; los registros adicionales se pueden eliminar. Todas las funcionalidades se guardan y se incluyen en las exportaciones Word, PDF y JSON. Al completar un momento se resaltan los campos pendientes en rojo.

El filtro ofrece las ideas del momento anterior en tres listas desplegables, impide repetir propuestas y selecciona automáticamente la de mayor puntuación. En empate conserva la primera según el orden de evaluación y muestra un aviso para que el equipo documente su reflexión. Los respaldos anteriores siguen siendo compatibles; si contienen propuestas que no estaban en la lista de ideas, se conservan incorporándolas a esa lista. La importación admite archivos de hasta 12 MB.

Los bocetos cargados se reducen a 600 × 480 píxeles para ahorrar almacenamiento. Conserva por separado las fotografías originales de las evidencias. El temporizador puede pausarse y se reinicia al cambiar de momento; no persiste al recargar.

## Diseño

Las nueve imágenes de `SCRUM.docx` se conservan en `assets/documento/`. Las cinco primeras acompañan sus respectivos momentos del taller; las cuatro restantes ilustran el banco de problemas desplegable del primer momento. Se sirven localmente y se incluyen al publicar en GitHub Pages.

Interfaz con Tailwind CSS, encabezado verde en degradado, tarjetas con encabezados suaves, formularios amplios y navegación adaptable. Usa verdes de apoyo `#327E60`, `#214D3D` y verde SENA `#39A900`.

Usa el archivo de logo proporcionado en `assets/img/logo-sena-verde-complementario-png-2022.png` como identidad en el encabezado, favicon y documentos exportados. Las nueve imágenes del taller se mantienen en sus secciones.

## Verificación manual

1. Completa equipo y cinco problemas. Recarga y comprueba la persistencia.
2. Intenta completar un momento vacío: debe mostrar los campos pendientes.
3. Registra diez ideas y tres propuestas. Cambia puntuaciones y comprueba totales de 4 a 20.
4. Completa ficha, cinco funcionalidades y necesidades; dibuja/carga tres pantallas.
5. Descarga Word e imprime como PDF; comprueba acentos, contenido y bocetos.
6. Exporta JSON, cambia un dato e importa el respaldo. Verifica restauración y rechazo de JSON incompatible.
7. Revisa la interfaz en móvil, el teclado, el temporizador y la página bajo una ruta de repositorio.

No se requieren dependencias externas ni solicitudes a servicios durante el uso.
