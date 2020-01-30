FROM node:latest

WORKDIR /sato-ui

ENV PATH /app/node_modules/.bin:$PATH

RUN npm install -g http-server

COPY . /sato-ui

RUN cd ./URLMetadata && npm install

EXPOSE 4200
EXPOSE 3050

CMD node ./URLMetadata/index.js & http-server dist/UserInterface -p 4200
