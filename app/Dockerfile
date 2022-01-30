FROM node:alpine

COPY app /
WORKDIR /app
RUN yarn && yarn --production --network-timeout 500000
RUN yarn build

RUN yarn global add serve
CMD ["serve", "-s", "/build", "-l", "8080"]