- 运行mongodb的安装文件
- 到安装目录中新建`data` `log`目录
- 配置mongodb,并添加为window的服务
`PS C:\Program Files\MongoDB\Server\3.2\bin> .\mongod.exe --dbpath 'C:\Program Files\MongoDB\data' --logpath='C:\Program Files\MongoDB\log\mongo.log' --install`
- 配置完后,到服务中去启动mongodb服务
- 运行mongo命令,连接数据库
