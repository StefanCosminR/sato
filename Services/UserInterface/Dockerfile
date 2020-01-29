FROM node:12.2.0

WORKDIR /sato-ui

ENV PATH /app/node_modules/.bin:$PATH

COPY package.json /sato-ui/package.json
RUN npm install
RUN npm install -g @angular/cli

COPY . /sato-ui

EXPOSE 4200

CMD ng serve --prod --host 0.0.0.0
