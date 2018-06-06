<p align="center">
  <img src="iblueio.png" alt="iBlue" width="100" height="100">
</p>
<h1 align="center">
  timecloud
</h1>
<p align="center">
  A distributed scheduling system based on Node.js
</p>

# Features

- 任务监控界面，线上浏览日志

- 任务超时控制

- 防止单点故障

- 微信报警通知

- 任务失败后，使用信号`SIGUSR2`通知任务进程，请在指定时间内处理自己的任务并使进程退出

- 每个进程同一时间内只执行一个任务，进程满载后其余任务进入任务队列(可在监控界面查看)

- 任务失败或超时会自动重试（次数默认为2次），当失败时会发通知，通知频率和crontab一样


# Timecloud

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Timecloud](#timecloud)
    - [Create Job](#create-job)
        - [1) Interface](#1-interface)
        - [2) Deploy](#2-deploy)
        - [3) Watch logs](#3-watch-logs)
    - [Local debug](#local-debug)
    - [Feature](#feature)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Create Job

---

### 1) Interface

在自己的项目文件下添加`timecloud.json`文件

```json
{
  "jobs": [
    {
      "name": "npm",
      "script": "npm start",
      "maintainer": "user",
      "timeout": 5000,
      "schedule": "*/30 * * * * *"
    },
    {
      "name": "start",
      "script": "./bin/start",
      "maintainer": "user",
      "timeout": 30000,
      "schedule": "0 * * * * *"
    },
    {
      "name": "update",
      "script": "./bin/update",
      "maintainer": ["user1", "user2"],
      "timeout": 40000,
      "schedule": "0 0 * * * *"
    }
  ]
}
```

**当任务出错或超时后，timecloud会往进程传递`SIGUSR2`信号，请监听该信号并在`5秒`内处理自己的任务，避免不必要的损失。**

```js
process.on('SIGUSR2', async () => {
  await doSomethingImportant()
  process.exit(0)
})
```

**参数说明**

`name`: 任务名称

`script`: 将要执行的脚本，可以是`npm start`,　或`./bin`目录下的脚本(注意脚本执行指令的正确写法，前面要有一点)

`maintainer`: 任务失败后会发送任务告警信息, `user`为需要通知的用户

`schedule`: 即crontab

```
* * * * * *
| | | | | | 
| | | | | +-- Day of the Week   (range: 0-6, 0 standing for Monday)
| | | | +---- Month             (range: 0-11)
| | | +------ Day of the Month  (range: 1-31)
| | +-------- Hour              (range: 0-23)
| +---------- Minute            (range: 0-59)
+------------ Second            (range: 0-59)
```

`timeout`：任务超时判断，超时后即判定任务失败


### 2) Deploy

使用`timecloud-scripts`部署任务

> TODO

### 3) Watch logs

进入任务监控界面即可看到日志按钮

## Local debug

- 在timecloud路径下执行`npm i`

- 将你的包放在home目录下的npm文件夹里，要有`timecloud.json`文件

- 开启本地`MongoDB`

- 在timecloud路径下执行`ENV=dev npm start`即可

- pm2日志输出在home目录下的log文件夹里

- 停止任务输入`npm stop`

- 任务监控界面在`localhost:8080`
