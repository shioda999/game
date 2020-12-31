import * as PIXI from "pixi.js"
import {Scene} from './Scene';
import {WIDTH, HEIGHT, GlobalParam, save, RAPID, SPEED, SIZE} from './global'
import {Key} from './key'
import {Sound} from './Sound'
const FPS_UPDATE_FREQ = 20
const style = new PIXI.TextStyle({
    align: "center",
    dropShadow: true,
    dropShadowAngle: 6.7,
    dropShadowBlur: 14,
    dropShadowColor: "#5700c2",
    dropShadowDistance: 0,
    fill: [
        "#0ef",
        "#003b7a"
    ],
    fillGradientStops: [
        0.5,
        1
    ],
    fontFamily: "Georgia",
    fontSize: 82,
    fontVariant: "small-caps",
    letterSpacing: 5,
    lineJoin: "round",
    miterLimit: 1,
    stroke: "#5700c2",
    strokeThickness: 14,
    whiteSpace: "normal"
});
const w = WIDTH / 2
const h = HEIGHT / 3
const fontsize = HEIGHT / 20
export class StageClear {
    private text: PIXI.Text
    private graph: PIXI.Graphics
    private count: number
    constructor(private container: PIXI.Container, private func: () => any) {
        this.text = new PIXI.Text("Stage Clear", style)
        this.text.anchor.set(0.5)
        this.text.position.set(WIDTH / 2, HEIGHT / 2.1)
        container.addChild(this.text)

        this.graph = new PIXI.Graphics()
        this.graph.beginFill(0, 0.8)
        this.graph.drawRoundedRect(0, 0, w, h, h / 10)
        this.graph.endFill()
        this.graph.x = WIDTH / 2 - w / 2, this.graph.y = HEIGHT / 2 - h / 2
        
        this.count = 0
        this.loop()
        Sound.stop("all")
        Sound.play("clear", true, GlobalParam.bgm_volume * 1.2)
    }
    private loop = () => {
        if (this.is_end()) {
            this.func()
            return
        }
		requestAnimationFrame(this.loop)
        this.count++
        this.text.alpha = Math.min(this.count / 50, 1.0)
        if(this.count == 200)this.get_item()
    }
    private is_end() {
        return this.count >= 400
    }
    private get_item() {
        console.log(GlobalParam.save_data.clear)
        switch (GlobalParam.stage) {
            case 1:
                GlobalParam.save_data.unlock.rapid[1] = true
                GlobalParam.save_data.unlock.speed[1] = true
                GlobalParam.save_data.unlock.size[1] = true
                if (GlobalParam.save_data.clear < 1) {
                    GlobalParam.save_data.clear = 1
                    GlobalParam.new_employment = true
                    this.messagebox("新しい装備を手に入れました\n\n ● 連射速度 "+RAPID[1]+"回/秒\n ● 砲口初速 ×"+SPEED[1]+"\n ● 寸法 ×"+SIZE[1])
                }
                else this.count = 400
                break
            case 2:
                GlobalParam.save_data.unlock.sub[1] = true
                GlobalParam.save_data.unlock.child[1] = true
                if (GlobalParam.save_data.clear < 2) {
                    GlobalParam.save_data.clear = 2
                    GlobalParam.save_data.max_cost = 200
                    GlobalParam.new_employment = true
                    this.messagebox("新しい装備を手に入れました\n\n ● 予備兵器　サブ弾\n ● 子機 1個\n\nコスト上限100 → 200")
                }
                else this.count = 400
                break
            case 3:
                GlobalParam.save_data.unlock.sub[2] = true
                GlobalParam.save_data.unlock.sub[3] = true
                if (GlobalParam.save_data.clear < 3) {
                    GlobalParam.save_data.clear = 3
                    GlobalParam.new_employment = true
                    this.messagebox("新しい装備を手に入れました\n\n ● 予備兵器　ミサイル\n ● 予備兵器　ビーム")
                }
                else this.count = 400
                break
        }
        save()
    }
    private messagebox(str: string) {
        console.log(str)
        this.graph.removeChildren()

        const text = new PIXI.Text(str, new PIXI.TextStyle({
            fontFamily: "Arial",
            fontSize: fontsize,
            fill: [0xffffff, 0x999999]
        }))
        text.position.set(WIDTH / 20, HEIGHT / 20)
        this.graph.addChild(text)
        this.container.addChild(this.graph)
    }
}