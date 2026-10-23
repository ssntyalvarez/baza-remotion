FROM node:22-bookworm-slim
RUN apt-get update && apt-get install -y --no-install-recommends libnss3 libdbus-1-3 libatk1.0-0 libgbm1 libasound2 libxrandr2 libxkbcommon0 libxfixes3 libxcomposite1 libxdamage1 libatk-bridge2.0-0 libpango-1.0-0 libcairo2 libcups2 fonts-liberation ca-certificates && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-fund --no-audit
COPY src ./src
COPY scripts ./scripts
COPY examples ./examples
COPY public ./public
RUN npx remotion browser ensure
CMD ["node", "scripts/cloud-job.mjs"]
