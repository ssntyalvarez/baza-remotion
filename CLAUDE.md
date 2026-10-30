# Editor Remotion: entrega para Claude

# 🔴 GATE AVATAR: antes de generar CUALQUIER plano con una persona (pedido de Santy, 30/10/2026)

Un chat ya se olvidó de esto (promo 3 productos Baza: la chica se armó desde un cuadro de la cafetera rosa y hubo que rehacer planos). Leer `claude/REGLA-AVATAR.md` en el proyecto de Claude. Resumen:
1. Elegir una chica de Drive `AVATARES NUESTROS REUTILIZABLES` (id `1NoEsom5qQA1nlcI87Ynjzg_EOExy9AR0`, subcarpetas por marca: `Baza y gamestation` con LOLA y NAMI, `Powercase`). Leer README y ficha.
2. Si no hay una adecuada o no se sabe cuál va con la marca: PARAR y preguntar a Santy antes de gastar créditos. Nunca armar una chica propia ni sacarla de un cuadro de un video aprobado.
3. Kit con nano-banana-pro (cara de la carpeta + selfie real de POSES), nunca un cuadro de video. Mostrarle el kit y esperar su OK antes de pasar a video.
4. El plan o guion arranca con `Avatar: <nombre> (carpeta)`. Sin esa línea el plan no está listo.
5. En campañas con varios productos, la misma reutilizable en todos los planos.

## Estado real

Proyecto instalado y trabajo de Google Cloud Run desplegado y probado. Leer `NUBE.md` para acceder al render remoto. No hay endpoint público ni conexión directa instalada en una cuenta de Claude: se invoca con Google Cloud CLI o Cloud Shell autenticado. El render remoto iniciado continúa con las computadoras apagadas; el render local no. El coordinador autónomo de generación y Marketing Studio todavía no está implementado. Hay recursos que consumen créditos de Google Cloud, con alertas presupuestarias, no un límite monetario automático.

## Interfaz disponible

Desde esta carpeta: `npm ci` y después `npm run render -- examples/smoke.json renders/video-nuevo.mp4`.
Vista previa local: `npm run studio`. Pruebas: `npm test`.
`npm run smoke` genera material sintético y monta una prueba sin llamar APIs. No sobrescribe un render final existente; usar otro nombre o mover el anterior.

Claude prepara un archivo JSON; el motor ejecuta ese montaje. No hace falta un plugin MCP para la ejecución desde una terminal autorizada. Para acceso remoto desde Claude hace falta desplegar un servicio autenticado o una herramienta que ejecute un trabajo de nube; este proyecto todavía no ofrece esa interfaz.

## Formato del montaje

- `width`, `height`: dimensiones pares. Vertical por defecto 720 x 1280.
- `fps`: cuadros por segundo, entero de 24 a 60. Elegir según material.
- `durationInFrames`: duración final, hasta 5 minutos en esta primera versión.
- `clips`: lista de capas visuales. Se dibujan en orden; las últimas quedan encima.
- `audio`: lista independiente. Permite cortes J/L colocando el audio antes o después del corte visual.
- `texts`: lista opcional. Ningún texto se agrega si no se pide.

Cada clip: `src`, `at`, `duration`, `sourceStart` (por defecto 0), `speed` (por defecto 1), `volume` (por defecto 0), `fit` (`cover` o `contain`), `transparent` (por defecto false).
Cada audio: los mismos tiempos, `src`, `speed` y `volume` (por defecto 1).
Cada texto: `text`, `at`, `duration` y `style`:
- `baza` (solo Baza): forma de T naranja #D84515; `sub` = renglón chico, `text` = renglón grande bold; `level: "secundario"` para textos menores; `y` (0–1). Lleva sonido (campana o tecla, como pista de `audio`).
- `tiktok` (todo lo que no es Baza): TikTok Sans Medium blanco con trazo negro; `y` (0–1), `\n` para dos renglones; `size`, `stroke` y `scale` opcionales. Sin sonido.
- Sin `style`: estilo de prueba, no usar en entregas.

`images` (opcional): imágenes fijas como logos. Cada una: `src`, `at`, `duration`, `y` (centro vertical 0–1), `width` en px; se centran en x.

Zona segura: nada en el cuarto inferior (lo tapa la interfaz de la app). Detalle y estado de los trabajos en el doc del proyecto `claude/remotion-edicion.md`. Para que Santy edite: `LEEME.md`.

Todos los tiempos son cuadros a los FPS de la composición, incluso `sourceStart`. A 30 FPS, 24 cuadros son 800 ms. `duration` es el tiempo ocupado en la salida; `sourceStart` es el punto de entrada antes del cambio de velocidad. Para un fragmento de 36 cuadros a velocidad 1.25 se necesitan 45 cuadros del original.

`src` acepta ruta relativa dentro de `public/` o URL HTTPS. Los enlaces deben entregar el archivo multimedia directamente: un enlace de vista previa de Google Drive no es un MP4 directo. En nube, las URLs privadas deben seguir vigentes durante todo el trabajo. No incluir contraseñas o claves en el JSON.

## Cierre obligatorio (logo de la marca) — NO OLVIDAR

Todo video de entrega termina con el logo de su marca. Lo pidió Santy y ya se olvidó una vez (Eiliko, 28/10).
- El JSON lleva `"marca"`: `"gamestation"`, `"powercase"`, `"baza"` o `"prueba"`. **`npm run render` se niega a renderizar** si falta `marca` o si falta el logo hasta el último cuadro (`scripts/render.mjs`, `checkMarca`).
- **Game Station:** texto TikTok en dos renglones ("Disponible en\nGameStation" o "Encontralos en\nGameStation") en `y` 0.545 y debajo `images` con `public/gamestation/logo.png`, `width` 400, `y` 0.65, los últimos ~2 s. El original está en Drive como `GAMESTATION.png`.
- **Power Case:** `public/powercase/logo.png` (P blanca sobre cuadrado rojo) en el cierre, sin tapar la cara (en el K6: `y` 0.12, `width` 200).
- **Baza:** outro de Baza (MOV con transparencia) al final de `clips`.
- Entregar siempre dos versiones: con música (para que Santy escuche) y sin música (la que se sube; el audio en tendencia se elige en la app).

## Ejemplo de voz y outro

Usar `audio` con la voz exportada de ElevenLabs y sus intervalos ya elegidos. El motor no genera voz ni detecta silencios. Para excluir un fallo entre dos tramos del mismo clip, crear dos entradas con distintos `sourceStart` y tiempos de salida consecutivos.

Una outro con transparencia se agrega al final de `clips`, encima de la imagen base, con `transparent: true`, `fit: "contain"` y `volume: 0`. Se adapta al lienzo completo conservando proporciones; verificar el encuadre real del MOV antes de darlo por aprobado. No se ha probado el archivo real de Baza.

## Reglas de trabajo aceptadas por el usuario

- Estética casera ya definida. No reinventarla.
- Continuidad explícita de objetos y del estado del producto. No inventar mecanismos no documentados.
- Conservar tramos válidos y cortar errores si el empalme funciona; no regenerar por defecto.
- Ritmo rápido; sin silencios intencionales salvo petición expresa. No recortar palabras.
- Voz e imagen coordinadas por bloques de significado. El motor no decide esa coordinación.
- Ediciones de IA siempre desde originales. Nunca encadenar degradación.
- No publicar, generar nuevos clips ni gastar APIs solo porque este archivo mencione esos pasos.

## Estado de la nube y lo pendiente

1. Cuenta de prueba de Google Cloud del usuario activada; no se actualizó a cuenta de pago.
2. Región us-central1; alerta mensual de US$20 antes de descontar créditos.
3. Bucket privado y cuenta de servicio con permiso de objetos únicamente en ese bucket, autorizados por el usuario.
4. Render remoto verificado con montaje sintético. Repetir un ID con resultado existente omite el render.
5. Acceso mediante herramientas oficiales autenticadas. Falta una interfaz de usuario y conexión directa con Claude; nunca copiar credenciales al chat.
6. Faltan la cola de producción autónoma, el coordinador de IA, revisión móvil y conexión con Marketing Studio.

No exponer este renderizador como endpoint abierto: las URLs necesitan controles de acceso y restricciones de red del lado del servidor. La validación local de JSON no sustituye esa seguridad.
