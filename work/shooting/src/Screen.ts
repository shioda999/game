import * as PIXI from "pixi.js"
import { WIDTH, HEIGHT, GlobalParam } from './global'
import { Sound } from './Sound'
const size = 32
export class Screen {
    private static instance: Screen
    private container: PIXI.Container
    private option_form: PIXI.Container
    private option: PIXI.Sprite
    private speaker: PIXI.Sprite
    private speaker_on_flag: boolean = true
    private speaker_on_texture: PIXI.Texture
    private speaker_off_texture: PIXI.Texture
    private option_capture_container: PIXI.Container
    private speaker_capture_container: PIXI.Container
    private rotateGearIntervalID: any
    public app: PIXI.Application
    public OnresizeFunctions = []
    constructor() {
        Sound.set_master_volume(GlobalParam.master_volume)
        this.container = new PIXI.Container()
        this.setOptionForm()
        this.setOptionGraphic()
        this.setPosition()
        this.AddOnresizeFunc(this.setPosition)
        this.setShortCutKey()
        window.onresize = () => {
            this.OnresizeFunctions.forEach(n => n())
        }
    }
    public static init() {
        if (!this.instance)
            this.instance = new Screen();
        return this.instance;
    }
    public getContainer() {
        return this.container
    }
    private setPosition = () => {
        let temp = this.app
        this.app = new PIXI.Application({
            backgroundColor: 0,
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight - 10,
            antialias: true
        })
        if (temp) {
            document.body.removeChild(temp.view)
            temp.stage.removeChildren()
            temp.destroy()
        }
        document.body.appendChild(this.app.view)
        this.app.stage.width = document.documentElement.clientWidth
        this.app.stage.height = document.documentElement.clientHeight
        this.container.x = (document.documentElement.clientWidth - WIDTH) / 2
        this.container.y = (document.documentElement.clientHeight - HEIGHT) / 2

        const frame = new PIXI.Graphics()
        frame.beginFill(0, 0)
        frame.lineStyle(Math.max(this.container.x, this.container.y), 0x1099bb, 1.0, 1)
        frame.drawRect(this.container.x, this.container.y, WIDTH, HEIGHT)
        frame.endFill()
        frame.zIndex = 1
        frame.name = "frame"
        this.app.stage.sortableChildren = true
        this.container.sortableChildren = true
        this.app.stage.addChild(frame)
        this.app.stage.addChild(this.container)
        if (this.option) {
            this.option.x = this.container.x + WIDTH - size / 2
            this.option.y = this.container.y + size / 2
            this.speaker.x = this.container.x + WIDTH - size / 2
            this.speaker.y = this.container.y + size / 2 * 3
            this.app.stage.addChild(this.option)
            this.app.stage.addChild(this.speaker)
        }
    }
    public AddOnresizeFunc(func) {
        this.OnresizeFunctions.push(func)
    }
    public DeleteOnresizeFunc(func) {
        this.OnresizeFunctions = this.OnresizeFunctions.filter(n => n != func)
    }
    private setOptionGraphic() {
        this.option = PIXI.Sprite.from("asset/graphic/option.png")
        this.option.interactive = true
        this.option.on("pointerover", this.showOptionText)
        this.option.on("pointerout", this.hideOptionText)
        this.option.on("pointerdown", this.optionClick)
        this.option.x = this.container.x + WIDTH - size / 2
        this.option.y = this.container.y + size / 2
        this.option.zIndex = 2
        this.option.anchor.set(0.5)

        this.speaker_on_texture = PIXI.Texture.from("asset/graphic/speaker_on.png")
        this.speaker_off_texture = PIXI.Texture.from("asset/graphic/speaker_off.png")
        this.speaker = new PIXI.Sprite(this.speaker_on_texture)
        this.speaker.interactive = true
        this.speaker.on("pointerover", this.showSpeakerText)
        this.speaker.on("pointerout", this.hideSpeakerText)
        this.speaker.on("pointerdown", this.speakerClick)
        this.speaker.zIndex = 2
        this.speaker.anchor.set(0.5)
        this.speaker.x = this.container.x + WIDTH - size / 2
        this.speaker.y = this.container.y + size / 2 * 3

        this.option_capture_container = new PIXI.Container
        this.speaker_capture_container = new PIXI.Container

        /*const graphics = new PIXI.Graphics()
        graphics.beginFill(0x555555)
        graphics.drawRect(0, 0, 100, 30)
        graphics.endFill()
        this.option_capture_container.addChild(graphics)*/
        const text = new PIXI.Text("オプション(P)", new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: 'normal',
            fill: '#dddddd',
            stroke: '#4a1850',
            strokeThickness: 2
        }))
        text.anchor.x = 1.0
        text.anchor.y = 0.5
        this.option_capture_container.addChild(text)
        this.option_capture_container.zIndex = 2

        const text2 = new PIXI.Text("ミュート(M)", new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: 'normal',
            fill: '#dddddd',
            stroke: '#4a1850',
            strokeThickness: 2
        }))
        text2.anchor.x = 1.0
        text2.anchor.y = 0.5
        this.speaker_capture_container.addChild(text2)
        this.speaker_capture_container.zIndex = 2
    }
    private rotateOptionGear = () => {
        this.option.angle += Math.PI / 5
    }
    private showOptionText = () => {
        this.option_capture_container.x = this.option.x - size / 2
        this.option_capture_container.y = this.option.y
        this.app.stage.addChild(this.option_capture_container)
        this.rotateGearIntervalID = setInterval(this.rotateOptionGear, 16)
    }
    private hideOptionText = () => {
        clearInterval(this.rotateGearIntervalID)
        this.option.angle = 0
        this.app.stage.removeChild(this.option_capture_container)
    }
    public optionClick = () => {
        GlobalParam.pause_flag = true
        this.showOptionForm()
    }
    private showSpeakerText = () => {
        this.speaker_capture_container.x = this.option.x - size / 2
        this.speaker_capture_container.y = this.option.y + size
        this.app.stage.addChild(this.speaker_capture_container)
    }
    private hideSpeakerText = () => {
        this.app.stage.removeChild(this.speaker_capture_container)
    }
    public speakerClick = () => {
        this.speaker_on_flag = !this.speaker_on_flag
        if (this.speaker_on_flag) {
            this.speaker.texture = this.speaker_on_texture
            Sound.set_master_volume(1)
        }
        else {
            this.speaker.texture = this.speaker_off_texture
            Sound.set_master_volume(0)
        }
    }
    private setShortCutKey() {
        document.addEventListener('keydown', (event) => {
            if (event.code == "KeyM") this.speakerClick()
            if (event.code == "KeyP") this.optionClick()
        })
    }
    private setOptionForm() {
        const w = WIDTH / 3 * 2
        const h = HEIGHT / 3
        const r = w / 10
        this.option_form = new PIXI.Container
        const graphics = new PIXI.Graphics()
        graphics.lineStyle(2, 0xFF00FF, 1)
        graphics.beginFill(0x650A5A, 0.25)
        graphics.drawRoundedRect(-w / 2, -h / 2, w, h, r)
        graphics.endFill()

        const text = new PIXI.Text("bgm", new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: 16,
            fontStyle: 'normal',
            fontWeight: 'normal',
            fill: '#dddddd',
            stroke: '#4a1850',
            strokeThickness: 2
        }))
        text.x = -w / 3
        text.y = h / 2 - h / 5
        graphics.addChild(text)
        this.option_form.addChild(graphics)
    }
    private showOptionForm = () => {
        this.option_form.x = this.container.x + WIDTH / 2
        this.option_form.y = this.container.y + HEIGHT / 2
        this.app.stage.addChild(this.option_form)
    }
    private hideOptionForm = () => {
        this.app.stage.removeChild(this.option_form)
    }
}