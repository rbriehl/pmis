# PMIS — self-contained production image
# Build from the repo root:
#   docker build -f deploy/Dockerfile \
#     --build-arg NEXT_PUBLIC_SUPABASE_URL=https://your-internal-supabase \
#     --build-arg NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key \
#     --build-arg NEXT_PUBLIC_BASE_PATH=/pmis \
#     -t pmis .
#
# NOTE: NEXT_PUBLIC_* variables are baked in AT BUILD TIME (Next.js inlines
# them into the browser bundle). Changing them requires a rebuild.

FROM node:24-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
# If your work network blocks npmjs.org, point npm at the internal mirror first:
#   RUN npm config set registry https://artifactory.yourcorp.internal/api/npm/npm-remote/
RUN npm ci

FROM node:24-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG NEXT_PUBLIC_BASE_PATH=/pmis
ENV NEXT_PUBLIC_SUPABASE_URL=$NEXT_PUBLIC_SUPABASE_URL \
    NEXT_PUBLIC_SUPABASE_ANON_KEY=$NEXT_PUBLIC_SUPABASE_ANON_KEY \
    NEXT_PUBLIC_BASE_PATH=$NEXT_PUBLIC_BASE_PATH
RUN npm run build

FROM node:24-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN addgroup -S app && adduser -S app -G app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
USER app
EXPOSE 3000
CMD ["node", "server.js"]
