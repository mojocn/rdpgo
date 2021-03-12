# gei



## 运行demo
```shell
cd $代码目录

# 编译前端代码
cd frontend
npm install
npm run build

# 编辑golang 代码(docker)
cd ..

docker-compose build

# 运行 docker-compose 
docker-compose up --remove-orphans


echo '浏览器访问 http://127.0.0.1:9528'
```

## todo:(懒...)

1. guac 目录独立单独的package,只依赖标准库,减少go.mod的行数
2. 优化前端代码,