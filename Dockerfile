FROM ubuntu:20.04
ARG DEBIAN_FRONTEND=noninteractive

WORKDIR /app

RUN apt-get update -y && \
  apt-get install build-essential -y && \
  apt-get install git -y && \
  apt-get install curl -y

RUN apt-get install -y libgtk2.0-0 libgtk-3-0 libgbm-dev \
  libnotify-dev libgconf-2-4 libnss3 libxss1 libasound2 \
  libxtst6 xauth xvfb tzdata software-properties-common

RUN add-apt-repository ppa:deadsnakes/ppa -y && \
  apt-get install python3.12 python3-pip -y && \
  pip install pipenv

RUN curl -sL https://deb.nodesource.com/setup_20.x -o nodesource_setup.sh && \
  bash nodesource_setup.sh && \
  cat /etc/apt/sources.list.d/nodesource.list

RUN apt-get install nodejs -y
RUN node --version && npm --version

COPY package.json /.project/package.json
COPY package-lock.json /.project/package-lock.json
RUN cd /.project && npm ci
RUN mkdir -p /root/app && cp -a /.project/. /root/app/

WORKDIR /root/app

RUN npm ci

COPY . /root/app

# build arguments
ARG APP_ENV

RUN npm run build

CMD [ "npm", "start" ]
