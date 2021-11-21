// import * as StringUtils from '../util/string_utils'
const exec = require('child_process').exec
// var iconv = require('iconv-lite')
// 任何你期望执行的cmd命令，ls都可以
// let cmdStr = './你的可执行程序名称 -p 需要输入密码的话'
// // 执行cmd命令的目录，如果使用cd xx && 上面的命令，这种将会无法正常退出子进程
// let cmdPath = '执行cmd命令的路径'
// 子进程名称
let workerProcess

export function runExec (cmd, path) {
  // 执行命令行，如果命令不需要路径，或就是项目根目录，则不需要cwd参数：
  let realPath = {encoding: 'GBK'}
  if (path) {
    path = path.replace(/^\s*|\s*$/g, '')
  }
  console.log('当前要执行的命令为@', path, '', cmd, path.length, cmd.length)
  realPath.cwd = path
  workerProcess = exec(cmd, realPath)
  // 不受child_process默认的缓冲区大小的使用方法，没参数也要写上{}：workerProcess = exec(cmdStr, {})
  // 打印正常的后台可执行程序输出
  // 打印错误的后台可执行程序输出
  workerProcess.stderr.on('data', function (data) {
    console.log('stderr: ' + data)
  })

  // 退出之后的输出
  workerProcess.on('close', function (code) {
    console.log('out code：' + code)
  })
  return workerProcess
}
