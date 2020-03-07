let count = 0
const clickFunc = () => {
    count++
    document.querySelector('#count').innerText = "クリック数: " + count
}
const resetFunc = () => {
    count = 0
    document.querySelector('#count').innerText = "クリック数: 0"
}