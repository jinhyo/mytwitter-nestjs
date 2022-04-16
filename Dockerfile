FROM node:14 

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g pm2

COPY ./ ./
EXPOSE 3000

CMD [ "pm2-runtime", "start", "npm", "--", "run", "start:dev" ]