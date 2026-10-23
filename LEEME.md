# Remotion personal — primera base

Incluye montaje por cuadros, recortes reutilizando un mismo original, cambios de velocidad, audio separado, volumen fijo por fragmento, capas de video transparentes y textos opcionales. Salida MP4 H.264. Dependencias de Remotion fijadas a 4.0.538.

Incluye un trabajo privado de render en Google Cloud Run, desplegado y probado el 22 de octubre de 2026. Ver `NUBE.md` para acceso autenticado, límites y presupuesto. Se subió código y material sintético al proyecto de Google Cloud autorizado; no se subieron anuncios ni claves privadas. No se actualizó la cuenta de prueba a una cuenta de pago.

No incluye generación de clips, ElevenLabs, detección automática de fallos/silencios, mezcla dinámica de volumen, publicación, interfaz móvil ni coordinador autónomo de Claude.

Ver `CLAUDE.md` para el formato de montaje y las instrucciones de uso. Los archivos en `public/` los puede servir Remotion: no poner claves ni documentos privados allí.

## Arranque

En una terminal dentro de esta carpeta:

```text
npm ci
npm test
npm run smoke
npm run studio
```

Render de un montaje nuevo:

```text
npm run render -- examples/smoke.json renders/mi-video.mp4
```

La prueba sintética usa un tono de audio, no una voz. La primera ejecución descarga el navegador necesario. `renders/prueba-montaje.mp4` es el resultado de prueba cuando smoke termina correctamente.

## Requisitos para producción

Probar el MOV real de la outro, clips reales con sus FPS/codecs, cortes y mezcla contra una versión aprobada. El renderizador comprueba que no haya huecos visuales pero todavía no inspecciona duración de fuentes, continuidad narrativa ni calidad visual. No subir un servicio a producción antes de agregar autenticación, almacenamiento privado, controles de URLs y límites de trabajo.

Licencia: verificar la elegibilidad de Remotion para el uso personal o de empresa correspondiente. Renderizar en nube puede tener cargos aunque el software sea gratuito.
