## 1. 编译golang代码
FROM golang:1.16-alpine as builder
RUN sed -i "s/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g" /etc/apk/repositories &&\
    apk add --no-cache git

ENV GOPROXY=https://goproxy.io
ARG GO_DIR=.

WORKDIR /sshark
# git describe --tags --always

COPY $GO_DIR/go.mod .
COPY $GO_DIR/go.sum .
RUN go mod download

COPY $GO_DIR .
RUN export GITHASH=$(git rev-parse --short HEAD) && \
    export BUILDAT=$(date) && \
    go build -ldflags "-w -s -X 'main.buildAt=$BUILDAT' -X 'main.gitHash=$GITHASH'"




## 3. copy聚合前端代码
FROM alpine
LABEL maintainer="Eric Zhou<dejavuzhou@qq.com>"

RUN sed -i "s/dl-cdn.alpinelinux.org/mirrors.aliyun.com/g" /etc/apk/repositories && apk add curl

# web+api端口建议映射到443 80
EXPOSE 9528

WORKDIR /opt/bin

# 需要挂在的目录，配置文件和日志
# /data/kssh.config 挂在配置文件
# /data/sshark 读写目录挂载 ssh-sessrion-terminal 日志文件
VOLUME /data

COPY --from=builder   /sshark/rdpgo     rdpgo

CMD ["./rdpgo"]