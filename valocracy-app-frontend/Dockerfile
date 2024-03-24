FROM node:18-alpine

RUN mkdir /var/www && mkdir /var/www/valocracy-app-frontend
WORKDIR /var/www/valocracy-app-frontend/

ENV NODE_ENV production

COPY package.json yarn.lock ./

RUN yarn install
#RUN npm install
COPY . .

#RUN npm install --global yarn
RUN yarn build 
CMD ["yarn", "preview"]
