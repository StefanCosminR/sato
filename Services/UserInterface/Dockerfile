FROM node:latest

WORKDIR /sato-ui

ENV PATH /app/node_modules/.bin:$PATH

RUN npm install -g http-server

COPY . /sato-ui

EXPOSE 4200

CMD http-server dist/UserInterface -p 4200
