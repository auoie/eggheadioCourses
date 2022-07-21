FROM golang:latest as builder
WORKDIR /app
COPY ./scripts/build-script/go.* ./
RUN go mod download
COPY ./scripts/build-script/ .
RUN --mount=type=cache,target=/root/.cache/go-build \
  GOOS=linux GOARCH=amd64 CGO_ENABLED=0 go build -o main main.go

FROM node:latest
RUN apt-get update
RUN apt-get install -y rsync
WORKDIR /app
COPY package*.json .
RUN npm ci
COPY . .
COPY --from=builder /app/main .
CMD [ "./main" ]
