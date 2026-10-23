#!/usr/bin/env bash
set -euo pipefail
PROJECT=project-a14dd0c8-69ad-4846-b09
REGION=us-central1
BUCKET="${PROJECT}-remotion"
SERVICE_ACCOUNT="remotion-render@${PROJECT}.iam.gserviceaccount.com"
IMAGE="${REGION}-docker.pkg.dev/${PROJECT}/remotion/editor:v1"
gcloud config set project "$PROJECT"
gcloud services enable run.googleapis.com artifactregistry.googleapis.com storage.googleapis.com billingbudgets.googleapis.com
gcloud artifacts repositories describe remotion --location="$REGION" >/dev/null 2>&1 || gcloud artifacts repositories create remotion --repository-format=docker --location="$REGION"
gcloud storage buckets describe "gs://${BUCKET}" >/dev/null 2>&1 || gcloud storage buckets create "gs://${BUCKET}" --location="$REGION" --uniform-bucket-level-access --public-access-prevention
gcloud iam service-accounts describe "$SERVICE_ACCOUNT" >/dev/null 2>&1 || gcloud iam service-accounts create remotion-render --display-name='Remotion render privado'
# El permiso del siguiente paso requiere confirmación del usuario antes de ejecutar este script.
gcloud storage buckets add-iam-policy-binding "gs://${BUCKET}" --member="serviceAccount:${SERVICE_ACCOUNT}" --role=roles/storage.objectUser
gcloud auth configure-docker "${REGION}-docker.pkg.dev" --quiet
docker build -t "$IMAGE" .
docker push "$IMAGE"
gcloud run jobs deploy remotion-render --image="$IMAGE" --region="$REGION" --service-account="$SERVICE_ACCOUNT" --cpu=2 --memory=4Gi --tasks=1 --parallelism=1 --max-retries=0 --task-timeout=900s --set-env-vars="RENDER_BUCKET=${BUCKET}"
printf '\nRemotion listo: proyecto=%s región=%s bucket=%s\n' "$PROJECT" "$REGION" "$BUCKET"
