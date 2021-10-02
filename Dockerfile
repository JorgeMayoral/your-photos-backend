# Compile stage
FROM node:16 AS compiler

WORKDIR /app

ADD package.json .
ADD package-lock.json .

RUN npm install

ADD . .

RUN tsc

# Final stage
FROM node:16

WORKDIR /app

ADD package.json .
ADD package-lock.json .

RUN npm install

COPY --from=compiler /app/dist ./

RUN npx prisma generate

CMD npm start