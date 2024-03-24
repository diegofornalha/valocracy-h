FROM node:21.7.1-alpine3.19

RUN mkdir /var/www && mkdir /var/www/valocracy && mkdir /var/www/valocracy/logs
WORKDIR /var/www/valocracy/

ENV NODE_ENV production

COPY package.json ./

RUN apk add --update msttcorefonts-installer fontconfig && \
    update-ms-fonts && \
    fc-cache -f

# Install Python and build tools
RUN apk add --no-cache python3 make g++\
    && apk add --update --no-cache \
    pixman-dev \
    libpng \
    libpng-dev \
    giflib-dev \
    jpeg-dev \
    cairo-dev \
    pango-dev \
    libtool \
    autoconf \
    automake

# Add the glibc package maintainer's public key for package verification
RUN apk --no-cache add ca-certificates wget && \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub

# Download and install glibc
RUN wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.34-r0/glibc-2.34-r0.apk && \
    apk add --allow-untrusted --force-overwrite glibc-2.34-r0.apk

# #  Add glibc
# RUN apk --no-cache add ca-certificates wget && \
#     wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub && \
#     wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.29-r0/glibc-2.29-r0.apk && \
#     apk add --allow-untrusted --force-overwrite glibc-2.29-r0.apk

# Add the glibc package maintainer's public key for package verification
RUN apk --no-cache add ca-certificates wget && \
    wget -q -O /etc/apk/keys/sgerrand.rsa.pub https://alpine-pkgs.sgerrand.com/sgerrand.rsa.pub

# Download and install glibc
RUN wget https://github.com/sgerrand/alpine-pkg-glibc/releases/download/2.34-r0/glibc-2.34-r0.apk && \
    apk add --allow-untrusted --force-overwrite glibc-2.34-r0.apk

RUN npm i @types/express
RUN npm i resolve-tspaths
RUN npm i typescript -g
RUN yarn install
RUN yarn add canvas
RUN yarn add sharp --ignore-engines
COPY . .

RUN yarn build 
CMD ["yarn", "prod"]