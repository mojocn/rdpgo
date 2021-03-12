package main

import (
	"embed"
	"github.com/gin-gonic/gin"
	"github.com/sirupsen/logrus"
	"path"
	"path/filepath"
	"strings"
)

var buildAt string
var gitHash string

func main() {
	logrus.SetReportCaller(true)
	r := gin.Default()
	r.GET("/version", func(c *gin.Context) { c.JSON(200, gin.H{gitHash: buildAt}) })
	r.Use(feMw("/"))               //替换nginx serve 前端HTML代码
	r.GET("/ws", ApiWsGuacamole()) //websocket proxy to guacd
	r.Run(":9528")
}

//go:embed frontend/dist/*
var fs embed.FS

const fsBase = "frontend/dist" //和 embed一样

//feMw 使用go.16新的特性embed 到包前端编译后的代码. 替代nginx.   one binary rules them all
func feMw(urlPrefix string) gin.HandlerFunc {
	const indexHtml = "index.html"

	return func(c *gin.Context) {
		urlPath := strings.TrimSpace(c.Request.URL.Path)
		if urlPath == urlPrefix {
			urlPath = path.Join(urlPrefix, indexHtml)
		}
		urlPath = filepath.Join(fsBase, urlPath)

		f, err := fs.Open(urlPath)
		if err != nil {
			return
		}
		fi, err := f.Stat()
		if strings.HasSuffix(urlPath, ".html") {
			c.Header("Cache-Control", "no-cache")
			c.Header("Content-Type", "text/html; charset=utf-8")
		}

		if strings.HasSuffix(urlPath, ".js") {
			c.Header("Content-Type", "text/javascript; charset=utf-8")
		}
		if strings.HasSuffix(urlPath, ".css") {
			c.Header("Content-Type", "text/css; charset=utf-8")
		}

		if err != nil || !fi.IsDir() {
			bs, err := fs.ReadFile(urlPath)
			if err != nil {
				logrus.WithError(err).Error("embed fs")
				return
			}
			c.Status(200)
			c.Writer.Write(bs)
			c.Abort()
		}
	}
}
