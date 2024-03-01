###################
# BUILD FOR PRODUCTION
###################

FROM node:20-alpine AS build

WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node backend/package*.json ./
COPY --chown=node:node backend/prisma ./prisma/

# Install app dependencies
RUN npm install

COPY --chown=node:node backend .

# Run the build command which creates the production bundle
RUN npm run build

# Set NODE_ENV environment variable
ENV NODE_ENV production

# Running `npm ci` removes the existing node_modules directory and passing in --only=production ensures that only the production dependencies are installed. This ensures that the node_modules directory is as optimized as possible
RUN npm ci --only=production && npm cache clean --force

USER node


FROM --platform=$BUILDPLATFORM node:20-alpine AS frontend

WORKDIR /app

# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY --chown=node:node frontend/package*.json ./

# Install app dependencies
RUN npm install

COPY --chown=node:node frontend .

# Run the build command which creates the production bundle

RUN npm run build

###################
# PRODUCTION
###################

FROM node:20-alpine AS production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node --from=build /app/package*.json ./
COPY --chown=node:node --from=build /app/dist ./dist
COPY --chown=node:node --from=build /app/prisma ./prisma
COPY --chown=node:node --from=frontend /app/build ./frontend/build

EXPOSE 3000

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
