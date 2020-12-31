import * as PIXI from "pixi.js"
import { Scene } from './Scene';
import { WIDTH, HEIGHT, GlobalParam } from './global'
import { Key } from './key'
import { GraphicManager } from "./GraphicManager";
import { Sound } from "./Sound";
const fontsize = HEIGHT / 20
const sx = WIDTH / 10
const sy = HEIGHT / 8
export class Explainment extends Scene {
    private key: Key
    private loopID: any
    private text: PIXI.Text
    private container: PIXI.Container
    constructor(container: PIXI.Container) {
        super()
        this.release = () => {
            clearInterval(this.loopID)
        }
        this.container = new PIXI.Container()

        const player = GraphicManager.GetInstance().GetSprite("player")
        player.position.set(sx + fontsize, sy + fontsize / 2)
        player.scale.set(0.7)
        this.container.addChild(player)
        const text = new PIXI.Text("\
　　を操作し、すべての敵を破壊してゲームクリア。\n\n\
方向キーで移動。Zキーで弾を発射。\n\nXキーでゲームを強制終了。\n\n\
Shiftを押している間は移動速度が減速。\n\n\
ステージをクリアするごとに新しい装備が解放される。", new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: fontsize,
            fill: [0xffffff, 0x999999]
        }))
        const text2 = new PIXI.Text("Xキーでタイトルに戻る。", new PIXI.TextStyle({
            fontFamily: "Arial",
            fontWeight: "bold",
            fontSize: fontsize,
            fill: [0x3333ff, 0x3333bb]
        }))
        text2.position.set(WIDTH / 2, HEIGHT * 0.9)
        text2.anchor.set(0.5)

        text.position.set(sx, sy)
        this.container.addChild(text)
        this.container.addChild(text2)
        container.addChild(this.container)
        this.key = Key.GetInstance()
        this.loopID = setInterval(() => this.loop(), 30)
    }
    private loop() {
        if (GlobalParam.pause_flag) return
        this.key.RenewKeyData()
        if (this.key.IsPress("cancel")) {
            Sound.play("back", false, GlobalParam.se_volume)
            this.gotoScene("back")
        }
    }
}