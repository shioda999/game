import * as PIXI from "pixi.js"
import {WIDTH, HEIGHT, BOSS_DATA} from './global'
import {GraphicManager} from './GraphicManager'
import {Scene} from './Scene'
import {Screen} from './Screen'
import { Key } from './key'
import {ENEMY_DATA} from './global'
const w = WIDTH / 9
const p_w = WIDTH / 10
const unit = 40

export class CreateStageTool extends Scene{
    private temp: PIXI.Container
    private upTriangle: PIXI.Graphics
    private downTriangle: PIXI.Graphics
    private enemy_list: PIXI.Sprite[] = []
    private fog: PIXI.Graphics
    private batu: PIXI.Graphics
    private selectingID: number = -1
    private key: Key
    private pos: number[] = []
    private _pos: number
    private clickFlag: boolean = false
    private settedSprite: PIXI.Sprite[] = []
    private infoText: PIXI.Text
    private input: HTMLInputElement
    private reader: FileReader
    private saveFlag: boolean = true
    private waitline_id: number
    private releaseFlag = false
    
    constructor(private container: PIXI.Container) {
        super()
        const inst = GraphicManager.GetInstance()
        this.release = () => {
            this.releaseFlag = true
            const screen = Screen.init()
            screen.DeleteOnresizeFunc(this.set)
            screen.app.stage.off("pointerdown", () => this.clickList())
            const frame = screen.app.stage.getChildByName("frame")
            screen.app.stage.removeChildren()
            screen.app.stage.addChild(this.container)
            screen.app.stage.addChild(frame)
        }
        inst.SetLoadedFunc(() => {
            this.key = Key.GetInstance()
            this.key.key_register({ code: ["ShiftLeft"], name: "shift" })
            this.key.key_register({ code: ["ControlLeft"], name: "ControlLeft" })

            this.fog = new PIXI.Graphics()
            this.fog.lineStyle(0, 0)
            this.fog.beginFill(0xFF0000, 0.5);
            this.fog.drawRect(-w / 2, -w / 2, w, w)
            this.fog.endFill()
            this.fog.zIndex = 4

            this.batu = new PIXI.Graphics()
            const path = [
                w / 8, w / 4, w / 4, w / 8, w / 8, 0,
                w / 4, -w / 8, w / 8, -w / 4, 0, -w / 8,
                -w / 8, -w / 4, -w / 4, -w / 8, -w / 8, 0,
                -w / 4, w / 8, -w / 8, w / 4, 0, w / 8,
            ];
            this.batu.lineStyle(2, 0)
            this.batu.beginFill(0xFF0000, 1)
            this.batu.drawPolygon(path)
            this.batu.endFill()
            this.batu.zIndex = 4

            this.temp = new PIXI.Container()
            const graph = new PIXI.Graphics()
            graph.lineStyle(0, 0)
            graph.beginFill(0);
            graph.drawRect(0, 0, WIDTH, HEIGHT)
            graph.endFill()
            graph.zIndex = -1
            graph.interactive = true
            graph.on("pointerdown", () => (this.clickScreen(), this.clickFlag = true))
                .on("pointermove", () => (this.drawInfomationText(), this.clickFlag && this.clickScreen()))
                .on("pointerup", () => (this.clickFlag = false))
                .on("pointerupoutside", () => (this.clickFlag = false))
            this.container.addChild(graph)
            this.container.addChild(this.temp)

            this.input = document.createElement("input")
            this.input.type = "file"
            this.input.hidden = true
            this.input.onchange = this.loadFile

            this.reader = new FileReader()
            this.reader.onload = this.readFile
        
            ENEMY_DATA.forEach(n => {
                let sprite = inst.GetSprite(n.name)
                sprite.scale.x = sprite.scale.y = Math.min(p_w / sprite.width, p_w / sprite.height)
                this.enemy_list.push(sprite)
            })
            BOSS_DATA.forEach(n => {
                let sprite = inst.GetSprite(n.name)
                sprite.scale.x = sprite.scale.y = Math.min(p_w / sprite.width, p_w / sprite.height)
                this.enemy_list.push(sprite)
            })
            Screen.init().AddOnresizeFunc(this.set)
            this.set()
        })
    }
    private set = () => {
        const app = Screen.init().app
        const list_x = this.container.x + WIDTH + w * 2 / 3
        const list_y = this.container.y
        const list_w_num = Math.floor((this.container.x - w * 4 / 3) / w) + 1
        const list_w = list_w_num * w
        let graph = new PIXI.Graphics();
        graph.lineStyle(2, 0xCCCC00, 1);
        graph.beginFill(0);
        let i: number
        ENEMY_DATA.forEach((n, id) => {
            if(n.name == "waitLine")this.waitline_id = id
        })
        for(i = 0; i < ENEMY_DATA.length + BOSS_DATA.length; i++){
            this.enemy_list[i].x = list_x + (i % list_w_num) * w
            this.enemy_list[i].y = list_y + Math.floor(i / list_w_num) * w
            this.enemy_list[i].zIndex = 3
            if (i !== this.waitline_id) app.stage.addChild(this.enemy_list[i])
            else {
                const str = new PIXI.Text("wait", new PIXI.TextStyle({
                    fontSize: p_w / 3,
                    fontWeight: 'bold',
                    fill: ['#fff200', '#fff200'],
                }))
                str.anchor.x = str.anchor.y = 0.5, str.zIndex = 3
                str.x = list_x + (i % list_w_num) * w, str.y = list_y + Math.floor(i / list_w_num) * w
                app.stage.addChild(str)
            }
            graph.drawRect(
                this.enemy_list[i].x - w / 2,
                this.enemy_list[i].y - w / 2,
                w, w);
        }
        graph.interactive = true
        graph.on("pointerdown", () => this.clickList())
        graph.zIndex = 2
        graph.endFill()
        app.stage.addChild(graph)
        this.setTriangle()
        this.setSaveButton()
        this.drawInfomationText()
    }
    private clickList() {
        if(this.releaseFlag)return
        const app = Screen.init().app
        const mouse = app.renderer.plugins.interaction.mouse.global
        const list_x = this.container.x + WIDTH + w * 2 / 3
        const list_y = this.container.y
        const list_w_num = Math.floor((this.container.x - w * 4 / 3) / w) + 1
        const list_w = list_w_num * w
        const a = Math.floor((mouse.x - list_x + w / 2) / w)
        const b = Math.floor((mouse.y - list_y + w / 2) / w) * list_w_num
        if(0 <= a && a <= list_w_num){
            const id = a + b
            if(id < ENEMY_DATA.length + BOSS_DATA.length){
                this.selectingID = id
                this.fog.x = this.enemy_list[id].x,
                this.fog.y = this.enemy_list[id].y,
                app.stage.addChild(this.fog)
            }
        }
    }
    private clickScreen() {
        const app = Screen.init().app
        const mouse = app.renderer.plugins.interaction.mouse.global
        let x = mouse.x - this.container.x - this.temp.x
        let y = mouse.y - this.container.y - this.temp.y
        if(x < 0 || x > WIDTH)return
        x = this.arrangePos(x)
        y = this.arrangePos(y)
        if(this.selectingID == this.waitline_id)x = WIDTH / 2
        let pos = x + y * (WIDTH + unit)
        let i = this.pos.indexOf(pos)
        if (i !== -1) {
            if (this.key.IsPress_Now("ControlLeft"))this.deleteSprite(pos)
            return
        }
        if(!this.key.IsPress_Now("shift"))return
        if (this.selectingID < 0) return
        let name
        if (this.selectingID < ENEMY_DATA.length) name = ENEMY_DATA[this.selectingID].name
        else name = BOSS_DATA[this.selectingID - ENEMY_DATA.length].name
        this.setSprite(name, pos)
    }
    private setSprite(name: string, pos: number) {
        this.pos.push(this._pos = pos)
        const sprite = GraphicManager.GetInstance().GetSprite(name)
        if (!sprite) {
            console.log("error:" + name)
            return
        }
        this.settedSprite.push(sprite)
        sprite.y = Math.floor(pos / (WIDTH + unit))
        sprite.x = pos - sprite.y * (WIDTH + unit)
        sprite.interactive = true
        sprite.on("pointerdown", (e) => this.spriteDragStart(sprite))
        .on('pointerup', () => this.spriteDragEnd(sprite))
        .on('pointerupoutside', () => this.spriteDragEnd(sprite))
        .on('pointermove', () => this.spriteDragging(sprite));
        this.temp.addChild(sprite)
        this.saveFlag = false
    }
    private deleteSprite(pos: number) {
        let len = this.settedSprite.length
        for (let i2 = 0; i2 < len; i2++){
            if (this.settedSprite[i2].x + this.settedSprite[i2].y * (WIDTH + unit) === pos) {
                this.temp.removeChild(this.settedSprite[i2])
                this.settedSprite[i2].destroy()
                this.settedSprite.splice(i2, 1)
                this.pos = this.pos.filter(n => n !== pos)
                this.saveFlag = false
                break
            }
        }
    }
    private spriteDragStart(sprite: PIXI.Sprite){
        sprite.alpha = 0.5
        this._pos = sprite.x + sprite.y * (WIDTH + unit)
        if (this.key.IsPress_Now("ControlLeft"))this.deleteSprite(this._pos)
        else this.pos = this.pos.filter(n => n !== this._pos)
    }
    private spriteDragging(sprite: PIXI.Sprite){
        if(sprite.alpha !== 0.5)return
        const mouse = Screen.init().app.renderer.plugins.interaction.mouse.global
        sprite.x = mouse.x - this.container.x - this.temp.x
        sprite.y = mouse.y - this.container.y - this.temp.y
        sprite.x = Math.min(WIDTH, Math.max(0, sprite.x))
        sprite.x = this.arrangePos(sprite.x)
        sprite.y = this.arrangePos(sprite.y)
        if(sprite.name === "waitLine")sprite.x = WIDTH / 2
        let pos = sprite.x + sprite.y * (WIDTH + unit)
        if(pos !== this._pos)this.saveFlag = false
        if(sprite.alpha !== 0.5)return
        let i = this.pos.indexOf(pos)
        if (i !== -1) {
            this.batu.x = sprite.x, this.batu.y = sprite.y
            this.temp.addChild(this.batu)
        }
        else {
            this.temp.removeChild(this.batu)
        }
    }
    private spriteDragEnd(sprite: PIXI.Sprite){
        if(sprite.alpha !== 0.5)return
        sprite.alpha = 1.0
        let pos = sprite.x + sprite.y * (WIDTH + unit)
        let i = this.pos.indexOf(pos)
        if(i !== -1){
            sprite.y = Math.floor(this._pos / (WIDTH + unit))
            sprite.x = this._pos - sprite.y * (WIDTH + unit)
            pos = this._pos
            this.temp.removeChild(this.batu)
        }
        this.pos.push(pos)
    }
    private setTriangle(){
        const app = Screen.init().app
        let graph = new PIXI.Graphics();
        const x = WIDTH / 30
        graph.beginFill(0xCCCC00);
        graph.lineStyle(2, 0, 1);
        graph.moveTo(WIDTH / 2 + this.container.x - x, this.container.y - x / 2);
        graph.lineTo(WIDTH / 2 + this.container.x, this.container.y - x * 3 / 2);
        graph.lineTo(WIDTH / 2 + this.container.x + x, this.container.y - x / 2);
        graph.lineTo(WIDTH / 2 + this.container.x - x, this.container.y - x / 2);
        graph.closePath();
        graph.endFill();
        graph.zIndex = 2
        graph.interactive = true
        graph.on("pointerdown", () => this.up())
        .on('pointerupoutside', () => this.stop_up())
        .on("pointerup", () => this.stop_up())
        app.stage.addChild(this.upTriangle = graph)
        graph = new PIXI.Graphics();
        graph.beginFill(0xCCCC00);
        graph.lineStyle(2, 0, 1);
        graph.moveTo(WIDTH / 2 + this.container.x - x, this.container.y + HEIGHT+ x / 2);
        graph.lineTo(WIDTH / 2 + this.container.x, this.container.y + HEIGHT+  x * 3 / 2);
        graph.lineTo(WIDTH / 2 + this.container.x + x, this.container.y + HEIGHT+ x / 2);
        graph.lineTo(WIDTH / 2 + this.container.x - x, this.container.y + HEIGHT+ x / 2);
        graph.closePath();
        graph.endFill();
        graph.zIndex = 2
        graph.interactive = true
        graph.on("pointerdown", () => this.down())
        .on('pointerupoutside', () => this.stop_down())
        .on("pointerup", () => this.stop_down())
        app.stage.addChild(this.downTriangle = graph)
    }
    private up(){
        this.upTriangle.alpha = 0.5
        let loop = setInterval(() => {
            if(this.upTriangle.alpha === 1.0)clearInterval(loop)
            else if(this.key.IsPress_Now("shift"))this.temp.y += 30
            else this.temp.y += 5
        }, 16)
    }
    private down(){
        this.downTriangle.alpha = 0.5
        let loop = setInterval(() => {
            if(this.downTriangle.alpha === 1.0)clearInterval(loop)
            else if(this.key.IsPress_Now("shift"))this.temp.y -= 30
            else this.temp.y -= 5
            this.temp.y = Math.max(this.temp.y, 0)
        }, 16)
    }
    private stop_up(){
        this.upTriangle.alpha = 1.0
    }
    private stop_down(){
        this.downTriangle.alpha = 1.0
    }
    private arrangePos(num: number){
        return Math.floor((num + unit / 2) / unit) * unit
    }
    private setSaveButton() {
        const b_w = w * 2, b_h = w
        this.createButton("読込", HEIGHT + this.container.y - b_h * 2.3, b_w, b_h, () => this.load())
        this.createButton("保存", HEIGHT + this.container.y - b_h, b_w, b_h, () => this.output())
        this.createButton("戻る", HEIGHT + this.container.y - b_h * 3.6, b_w, b_h, () => {
            let result = confirm("未保存の場合データが破棄されますがよろしいですか？")
            if(!result)return
            this.gotoScene("back")
        })
    }
    private createButton(str: string, y: number, b_w: number, b_h: number, func: () => any) {
        const button = new PIXI.Graphics()
        button.x = (this.container.x - b_w) / 2
        button.y = y
        button.beginFill(0xffffff)
        button.drawRect(0, 0, b_w, b_h)
        button.endFill()
        button.lineStyle(2,0,0.3,1)
        button.moveTo(0, b_h)
        button.lineTo(b_w, b_h)
        button.lineTo(b_w, 1)

        const buttonText = new PIXI.Text(str, {
            fontFamily: 'Arial',
            fontSize: b_h / 3,
            fill: 0
        })
        buttonText.anchor.set(0.5)
        buttonText.x = b_w / 2
        buttonText.y = b_h / 2
        button.addChild(buttonText)
        button.interactive = true
        button.on("pointerdown", () => button.alpha = 0.5)
            .on("pointerupoutside", () => button.alpha = 1.0)
            .on("pointerup", () => (func(), button.alpha = 1.0))
        button.zIndex = 3
        Screen.init().app.stage.addChild(button)
    }
    private drawInfomationText() {
        if(this.releaseFlag)return
        const app = Screen.init().app
        const mouse = app.renderer.plugins.interaction.mouse.global
        let x = mouse.x - this.container.x - this.temp.x
        let y = mouse.y - this.container.y - this.temp.y
        x = Math.min(WIDTH, Math.max(0, x))
        x = this.arrangePos(x)
        y = this.arrangePos(HEIGHT - y)
        let max_y = 0
        this.pos.forEach(n => max_y = Math.max(max_y, HEIGHT - Math.floor(n / (WIDTH + unit))))
        const str = "X    : " + x + "\nY    : " + y + "\nMaxY : " + max_y + "\nDiff : " + (y - max_y)
        const text = new PIXI.Text(str, {
            fontFamily: 'Arial',
            fontSize: w / 3,
            fill: 0
        })
        text.x = (this.container.x - w * 2) / 2
        text.y = this.container.y
        text.zIndex = 3
        app.stage.addChild(text)
        app.stage.removeChild(this.infoText)
        this.infoText = text
    }
    private loadFile = (ev) => {
        var target = ev.target
        var file = target.files[0]
        var type = file.type
        var size = file.size
        this.input.value = ''
        if ( type !== 'application/json' ) {
            alert('選択できるファイルはJSONファイルだけです。')
            return
        }
        this.reader.readAsText(file)
    }
    private readFile = () => {
        if (typeof (this.reader.result) !== "string") return
        let data = JSON.parse(this.reader.result)
        let len: number = data.length
        let y: number = HEIGHT
        this.temp.removeChildren()
        this.settedSprite.forEach(n => n.destroy())
        this.settedSprite = []
        this.pos = []
        for (let i = 0; i < len; i++){
            let name: string = data[i].name
            if (name === "sleep") {
                y -= data[i].param
            }
            else {
                this.setSprite(name, y * (WIDTH + unit) + data[i].param)
            }
        }
        this.saveFlag = true
    }
    private load() {
        if (!this.saveFlag) {
            let result = confirm("未保存の場合データが破棄されますがよろしいですか？")
            if(!result)return
        }
        this.input.click()
    }
    private output() {
        let name = prompt("ファイル名を入力してください", "stage.json");
        if(name === null)return
        let data = [], y: number = HEIGHT
        let len = this.settedSprite.length
        this.settedSprite.sort((a, b) => b.y - a.y)
        for (let i = 0; i < len; i++){
            if (y !== this.settedSprite[i].y) {
                data.push({name: "sleep", param: y - this.settedSprite[i].y})
                y = this.settedSprite[i].y
            }
            data.push({name: this.settedSprite[i].name, param: this.settedSprite[i].x})
        }
        let blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
        let anchor = document.createElement("a")
        anchor.hidden = true
        anchor.href = window.URL.createObjectURL(blob)
        anchor.download = name
        anchor.click()
        this.saveFlag = true
    }
}