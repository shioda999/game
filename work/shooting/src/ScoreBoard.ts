import * as PIXI from "pixi.js"
import { Scene } from './Scene';
import {WIDTH, HEIGHT, GlobalParam} from './global'
import {Key} from './key'
import { Sound } from "./Sound";
export class ScoreBoard extends Scene {
    private key: Key
    private loopID: number
    private bar: Bar
    private state: number = 0
    private text: PIXI.Text
    private push_z: PIXI.Text
    private score: number = 0
    private count: number = 0
    readonly style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: WIDTH / 20,
        fill: ['#33ff66'],
        stroke: '#4a1850',
        strokeThickness: 4,
    });
    constructor(private container: PIXI.Container) {
        super()
        this.key = Key.GetInstance()
        this.loopID = setInterval(() => this.loop(), 16)
        this.bar = new Bar(container)
    }
    private loop() {
        const life_bonus = 500
        if (GlobalParam.pause_flag) return
        this.key.RenewKeyData()
        if(Key.GetInstance().IsPress("decide"))this.bar.skip()
        if (this.bar.check()) {
            switch (this.state) {
                case 0:
                    this.score += GlobalParam.data.score
                    this.drawText("撃破スコア (+" + GlobalParam.data.score + ")")
                    this.bar.add(GlobalParam.data.score)
                    this.state++
                    break
                case 1:
                    if (GlobalParam.data.remain_life == 0) {
                        this.state = 3
                        break
                    }
                    this.score += GlobalParam.data.remain_life * life_bonus
                    this.drawText("ライフボーナス (+" + GlobalParam.data.remain_life + "×" + life_bonus + ")")
                    this.bar.add(GlobalParam.data.remain_life * life_bonus)
                    this.state++
                    break
                case 2:
                    let v = 1000 - Math.floor(GlobalParam.data.time / 60)
                    this.score += v
                    this.drawText("タイムボーナス (+" + v + ")")
                    this.bar.add(v)
                    this.state++
                    break
                case 3:
                    this.drawText("合計スコア " + this.score)
                    this.state++
                    this.count = 0
                    break
                default:
                    this.count++
                    if (this.count == 60) {
                        const style = this.style.clone()
                        style.fontSize = WIDTH / 30
                        style.fill = [0xffffff, 0xcccccc, 0xaaaaaa]
                        this.push_z = new PIXI.Text("Push Z-Key", style)
                        this.container.addChild(this.push_z)
                        this.push_z.position.set(WIDTH / 2, HEIGHT / 2 + WIDTH / 10)
                        this.push_z.anchor.set(0.5)
                    }
                    if (this.count >= 60) {
                        this.push_z.alpha = Math.pow(Math.sin(Math.PI * (this.count - 60) / 120), 2)
                        if (Key.GetInstance().IsPress("decide")) {
                            Sound.stop("all")
                            Sound.play("push_z", false, GlobalParam.se_volume)
                            clearInterval(this.loopID)
                            this.gotoScene("back")
                        }
                    }
                    break
            }
        }
        this.bar.update()
        if(this.text && this.state <= 2)this.text.alpha = Math.max(0, this.text.alpha - 0.003)
    }
    private drawText(str: string) {
        if (this.text) {
            this.container.removeChild(this.text)
            this.text.destroy()
        }
        this.text = new PIXI.Text(str, this.style)
        this.text.position.set(WIDTH / 2, HEIGHT / 2 - WIDTH / 10)
        this.text.anchor.set(0.5)
        this.container.addChild(this.text)
    }
}
class Bar {
    private bk: PIXI.Graphics
    private bar: PIXI.Graphics
    private value: number = 0
    private current: number = 0
    private count: number = 0
    private max_speed: number = 0
    private text: PIXI.Text
    readonly w = WIDTH / 1.8
    readonly h = WIDTH / 30
    readonly T = 60
    readonly K = 2000
    readonly color: number[] = [0xff0000, 0x00ff00, 0x00ccff, 0xff00cc, 0xffff00]
    readonly style = new PIXI.TextStyle({
        fontFamily: 'Arial',
        fontSize: this.h * 1.2,
        fill: ['#33ff66'],
        stroke: '#4a1850',
        strokeThickness: 3,
    });
    constructor(private container: PIXI.Container) {
        const w = this.w, h = this.h
        this.value = this.current = this.count = 0
        this.bk = new PIXI.Graphics()
        this.bk.lineStyle(1, 0xFFFFFF, 0.8, 1);
        this.bk.drawRect((WIDTH - w) / 2, (HEIGHT - h) / 2, w, h);
        this.bk.endFill();

        this.bar = new PIXI.Graphics()

        container.addChild(this.bk)
        container.addChild(this.bar)
    }
    public add(v: number) {
        this.max_speed = v / 60
        this.value += v
        if (this.text) {
            this.container.removeChild(this.text)
            this.text.destroy()
        }
        this.text = new PIXI.Text("+" + v, this.style)
        this.container.addChild(this.text)
        this.text.position.set((WIDTH + this.w + this.h) / 2, HEIGHT / 2)
        this.text.anchor.y = 0.5
        this.count = 0
    }
    public update() {
        let speed: number = Math.max(Math.min(this.max_speed, (this.value - this.current) / 10), 8)
        this.current = Math.min(this.current + speed, this.value)
        if(this.value != this.current && this.count % 3 == 0)Sound.play("increase", false, GlobalParam.se_volume * 0.6)
        this.bar.clear()

        let color = this.color[Math.round(Math.floor(this.current / this.K) % this.color.length)]
        this.bar.beginFill(color)
        this.bar.drawRect((WIDTH - this.w) / 2, (HEIGHT - this.h) / 2, this.w * (this.current % this.K / this.K), this.h);
        this.bar.endFill()
        if (this.text) {
            this.text.alpha = Math.max(0, 1 - this.count / this.T / 1.5)
        }
        this.count++
    }
    public check() {
        return this.count >= this.T && this.value <= this.current
    }
    public skip() {
        this.current = this.value
        this.count = this.T * 1000
    }
}