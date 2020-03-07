let start = 0, end = 0, loopFlag = false
const timerUpdate = () => {
    if(loopFlag){
        setTimeout(timerUpdate, 1)
        end = performance.now()
        document.querySelector('#timer').innerText = "経過時間: " + (end - start).toFixed(0) + "ms"
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
    document.querySelector('#timer').innerText = "経過時間: 0ms"
}