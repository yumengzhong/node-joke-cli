#!/usr/bin/env node
const cheerio = require('cheerio')
const superAgent = require('superagent')
const readline = require('readline')
const colors = require('colors')

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    prompt: ' 😆 😆 您正在使用joke-cli,按下回车查看笑话 😜 >>>'
})
let url = 'http://www.qiushibaike.com/text/page/'
let page = 1

// 使用数组来存放笑话
let jokeStories = []
// 载入笑话并存入数组中
function loadJokes(){
      // 数组中的笑话不足三条时就请求下一页的数据
    if(jokeStories.length<3){
        superAgent
        .get(url+page)
        .end((err, res)=>{
            if(err) console.error(err)
            const $ = cheerio.load(res.text)
            const jokeList = $('.article .content span')
            jokeList.each(function(i, item){
                jokeStories.push($(this).text()) //存入数组
            })
            page++
        })
    }
}

rl.prompt()
loadJokes()
// line事件 每当 input 流接收到接收行结束符（\n、\r 或 \r\n）时触发 'line' 事件。 通常发生在用户按下 <Enter> 键或 <Return> 键。
// 按下回车键显示一条笑话
rl.on('line', (line) => {
    if(jokeStories.length>0){
        console.log('======================')
        console.log(jokeStories.shift().bgCyan.black) //用colors模块改变输出颜色
        loadJokes()
    }else{
        console.log('正在加载中~~~'.green)
    }
    rl.prompt()
}).on('close', () => {
    console.log('Bye!')
    process.exit(0)
})
