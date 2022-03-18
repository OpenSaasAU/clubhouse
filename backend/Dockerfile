FROM node:17-alpine AS builder
RUN apk update
# Set working directory
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=@opensaas-clubhouse/backend --docker

# Add lockfile and package.json's of isolated subworkspace
FROM node:17-alpine AS installer
ENV NODE_ENV=production
ENV SESSION_SECRET=TEMP_SESSION_SECRET_1234567890132
ENV DATABASE_ADAPTER=prisma_postgresql
RUN apk update
WORKDIR /app
COPY --from=builder /app/out/yarn.lock ./yarn.lock
COPY --from=builder /app/out/full/ .
RUN yarn install

FROM node:17-alpine AS sourcer
ENV NODE_ENV=production
ENV SESSION_SECRET=TEMP_SESSION_SECRET_1234567890132
ENV DATABASE_ADAPTER=prisma_postgresql
RUN apk update
WORKDIR /app
COPY --from=installer /app/ .
COPY .gitignore .gitignore
RUN yarn turbo run build --scope=@opensaas-clubhouse/backend --include-dependencies --no-deps
EXPOSE 3000
CMD ["yarn", "start"]
