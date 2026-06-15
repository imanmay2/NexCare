FROM golang:1.26
WORKDIR /app
COPY go.mod go.sum .
RUN go mod tidy
COPY . .
RUN go build -o main .
EXPOSE 8090
CMD ["go","run","main.go"]