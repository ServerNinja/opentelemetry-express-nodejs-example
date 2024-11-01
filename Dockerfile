FROM node:22

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

COPY . /usr/src/app

ENV OTEL_TRACE_URL='http://localhost:14268/api/traces'
ENV OTEL_PROVIDER='jaeger'

EXPOSE 3000

CMD [ "npm", "start" ]
