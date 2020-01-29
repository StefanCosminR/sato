FROM swift:latest as builder
RUN apt-get update
RUN apt-get install openssl libssl-dev libz-dev -y
WORKDIR /root
COPY . .
RUN swift build -c release

EXPOSE 80

CMD ./.build/release/RunServer
