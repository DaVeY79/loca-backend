FROM mhart/alpine-node:9

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

ADD package.json ./
ADD yarn.lock ./
RUN yarn --pure-lockfile

ADD . .
RUN yarn build

EXPOSE 3000
CMD ["yarn", "start"]
