#!/usr/bin/env bash
set -euo pipefail
if [[ $# -ne 2 ]]; then printf 'Uso: bash scripts/submit-cloud.sh ID montaje.json\n'; exit 1; fi
ID="$1"
if [[ ! "$ID" =~ ^[a-zA-Z0-9_-]{1,80}$ ]]; then printf 'ID no válido\n'; exit 1; fi
BUCKET=project-a14dd0c8-69ad-4846-b09-remotion
if gcloud storage ls "gs://${BUCKET}/jobs/${ID}/timeline.json" >/dev/null 2>&1; then
  printf 'Ese ID ya existe. Elegí uno nuevo para evitar modificar un trabajo.\n'; exit 1
fi
gcloud storage cp "$2" "gs://${BUCKET}/jobs/${ID}/timeline.json"
gcloud run jobs execute remotion-render --project=project-a14dd0c8-69ad-4846-b09 --region=us-central1 --update-env-vars="JOB_ID=${ID}" --async
printf '\nEstado: gcloud storage cat gs://%s/jobs/%s/status.json\n' "$BUCKET" "$ID"
