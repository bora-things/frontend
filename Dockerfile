# compilation
FROM node:lts-alpine as build-stage
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
WORKDIR /app
RUN echo "VITE_API_URL=$VITE_API_URL" > .env
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# production
FROM nginx:stable-alpine as production-stage
ADD ./nginx/ /etc/nginx/
COPY --from=build-stage /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
