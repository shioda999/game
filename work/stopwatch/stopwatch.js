let start = 0, end = 0, loopFlag = false
const printTime = (time) => {
    let s = Math.floor(time / 1000)
    let m = Math.floor(s / 60)
    let h = Math.floor(m / 60)
    let d = Math.floor(h / 24)
    let str = ""
    if(d)str += d + "日 "
    if(h)str += h % 24 + "時 "
    if(m)str += m % 60 + "分 "
    return str + s % 60 + "秒" + Math.floor(time) % 1000
}
const timerUpdate = () => {
    if(loopFlag){
        setTimeout(timerUpdate, 1)
        end = performance.now()
        document.querySelector('#timer').innerText = "経過時間: " + printTime(end - start)
    }
}
const clickFunc = () => {
    if(!loopFlag){
        document.querySelector('#button1').innerText = "stop"
        start = performance.now() - (end - start)
        loopFlag = true
        timerUpdate()
    }
    else {
        document.querySelector('#button1').innerText = "start"
        loopFlag = false
    }
    
}
const resetFunc = () => {
    loopFlag = false
    start = end = 0
    document.querySelector('#timer').innerText = "経過時間: 0秒000"
}