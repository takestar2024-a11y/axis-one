# Container image launched by Confidential Space. Its digest is pinned in the
# workload identity provider's attribute condition, so any change to this
# image requires updating `image_digest` in infra/ before KMS will release keys.
FROM node:22-slim AS build
WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci
COPY src ./src
COPY test ./test
RUN npm run build && npm prune --omit=dev

FROM node:22-slim
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist/src ./dist/src
COPY package.json ./

# Confidential Space launch policy: only these env vars may be set from VM
# metadata, and container logs are exported only on the debug image.
LABEL "tee.launch_policy.allow_env_override"="KMS_KEY_NAME,WIP_PROVIDER"
LABEL "tee.launch_policy.log_redirect"="debugonly"

USER node
EXPOSE 8080
CMD ["node", "dist/src/main.js"]
