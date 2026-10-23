# Despliegue Google Cloud

Proyecto autorizado: `project-a14dd0c8-69ad-4846-b09`. Región inicial: `us-central1`.
Job: `remotion-render`. Bucket privado: `project-a14dd0c8-69ad-4846-b09-remotion`.

Estado verificado el 22 de octubre de 2026: trabajo `remotion-render` desplegado. Prueba remota `remotion-render-4h9gx` completada correctamente; salida privada `jobs/prueba-20261022/result.mp4`. Archivo descargado y comprobado: MP4, 720 x 1280, 2.005 segundos, video y audio a 48 kHz. Es material sintético, no un anuncio real ni la outro de Baza.

Imagen desplegada: `us-central1-docker.pkg.dev/project-a14dd0c8-69ad-4846-b09/remotion/editor:v1`, digest `sha256:b642e83e9a9721a0f32fa9e371c09001b77e9c414ff5855d9462813ed738b088`.

Alerta presupuestaria creada: US$20 mensuales, con avisos al 50%, 90% y 100%, calculados antes de descontar créditos. ID `26a2ae05-2596-4e4e-91df-243708e66b82`. No es un corte automático de gastos.

## Arquitectura de esta entrega

Cloud Run Job ejecuta un montaje y termina. No depende de que el equipo que lo inició siga prendido. No tiene un endpoint público. La identidad de ejecución solo recibe `storage.objectUser` sobre el bucket del editor, sin claves descargadas ni acceso a Drive.

Recursos por ejecución: 2 CPU, 4 GiB, una tarea, cero reintentos y timeout 15 minutos. Un archivo de bloqueo impide renders simultáneos entre ejecuciones. Un timeout puede dejar el bloqueo: verificar que no haya ejecución activa antes de eliminar `control/render.lock`. El bloqueo no se borra automáticamente por tiempo para evitar dos renders a la vez.

Límites de entrada: 30 FPS, hasta 1920 px por lado y 90 segundos; 300 MB por fuente y 1 GB total. Solo fuentes `gs://BUCKET/assets/...`: no admite URLs arbitrarias en la nube. Las pruebas locales pueden usar HTTPS. No son un límite monetario diario; se deben restringir las ejecuciones y vigilar el consumo.

## Instalar desde Cloud Shell

Subir el archivo de despliegue, extraerlo en una carpeta nueva y ejecutar `bash scripts/deploy-cloud.sh` desde la raíz del proyecto. El script crea infraestructura y otorga el permiso indicado: requiere autorización previa del usuario. Usa Docker en Cloud Shell para construir y subir la imagen, sin configurar una identidad extra de Cloud Build.

## Enviar un montaje

1. Subir clips/voz/outro al prefijo privado `assets/` con nombres de versión que no se reutilicen.
2. Preparar JSON según `CLAUDE.md`, usando `gs://BUCKET/assets/...` en cada `src`.
3. Elegir ID nuevo por montaje. Subir el JSON como `jobs/ID/timeline.json`.
4. Ejecutar:

```text
gcloud run jobs execute remotion-render --project=project-a14dd0c8-69ad-4846-b09 --region=us-central1 --update-env-vars=JOB_ID=ID --async
```

5. Consultar `jobs/ID/status.json`. Resultado completado: `jobs/ID/result.mp4`.

Para descargar con acceso autenticado:

```text
gcloud storage cp gs://project-a14dd0c8-69ad-4846-b09-remotion/jobs/ID/result.mp4 ./resultado.mp4
```

El render no modifica ni borra los originales. Si el resultado ya existe, repetir ese ID no lo vuelve a renderizar. Para cambios, usar otro ID.

## Acceso de Claude y móvil

Claude necesita una terminal autorizada con Google Cloud CLI, o usar Cloud Shell desde su navegador con la cuenta del usuario. No colocar tokens en el chat. El motor no incluye una API MCP ni OAuth de terceros; el acceso directo desde Claude web sin terminal todavía no está configurado. Una interfaz móvil de revisión, una cola de tareas y el trabajador que consulta Marketing Studio todavía no forman parte de esta entrega.

Iniciar un job lo deja corriendo en Google; eso no hace que Claude Desktop siga razonando con tu computadora apagada. Para producción autónoma completa faltaría alojar también al coordinador.
