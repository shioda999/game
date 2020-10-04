import * as PIXI from "pixi.js"
import {Scene} from './Scene';
import {WIDTH, HEIGHT, GlobalParam} from './global'
import {Key} from './key'
import {Sound} from './Sound'
import { ItemManager } from "./ItemManager";
const FPS_UPDATE_FREQ = 20
const style = new PIXI.TextStyle({
    align: "center",
    dropShadow: true,
    dropShadowAngle: 6.7,
    dropShadowBlur: 14,
    dropShadowColor: "#571600",
    dropShadowDistance: 0,
    fill: [
        "red",
        "#8f0000"
    ],
    fillGradientStops: [
        0.6,
        1
    ],
    fontFamily: "Georgia",
    fontSize: 82,
    fontVariant: "small-caps",
    letterSpacing: 5,
    lineJoin: "round",
    miterLimit: 1,
    stroke: "#571600",
    strokeThickness: 12,
    whiteSpace: "normal"
});
export class GameOver {
    private item_manager: ItemManager
    private text: PIXI.Text
    private count: number
    private releaseFlag: boolean = false
    private graph: PIXI.Graphics
    constructor(private container: PIXI.Container, private func: () => any, private func2: () => any) {
        this.text = new PIXI.Text("Game Over", style)
        this.text.anchor.set(0.5)
        this.text.position.set(WIDTH / 2, HEIGHT / 2)
        container.addChild(this.text)
        this.count = 0
        this.loop()
        Sound.stop("all")
        Sound.play("over", true, GlobalParam.bgm_volume * 1.2)
    }
    private loop = () => {
        if (this.releaseFlag) return
		requestAnimationFrame(this.loop)
        this.count++
        Key.GetInstance().RenewKeyData()
        
        if (this.count >= 50 && this.count < 250 && Key.GetInstance().IsPress("decide")) {
            this.count = 250, this.text.y = HEIGHT / 2 - 150
        }
        if (this.count < 200) this.text.alpha = Math.min(this.count / 50, 1.0)
        else if (this.count < 250) {
            this.text.y -= 3
        }
        else if (this.count == 250) {
            const w = WIDTH / 2, h = HEIGHT / 3
            const graph = new PIXI.Graphics()
            graph.beginFill(0x000000, 0.8)
            graph.drawRoundedRect(-w / 2 + WIDTH / 2, -h / 2 + HEIGHT / 2, w, h, WIDTH / 20)
            graph.endFill()
            this.graph = graph
            this.container.addChild(graph)
            this.item_manager = new ItemManager(WIDTH / 2, HEIGHT / 2, WIDTH / 3, HEIGHT / 10, this.container,
                this.decide, undefined)
            this.item_manager.appendItem("Continue", HEIGHT / 10, [0xffffff, 0xcccccc, 0x555555])
            this.item_manager.appendItem("Quit", HEIGHT / 10, [0xffffff, 0xcccccc, 0x555555])
        }
        else {
            this.item_manager.update()
        }
    }
    private decide = ()=> {
        let focus = this.item_manager.getFocus()
        if (focus == 0) {
            this.func()
            this.item_manager.delete()
            this.container.removeChild(this.text)
            this.container.removeChild(this.graph)
        }
        else this.func2()
        this.releaseFlag = true
    }
}