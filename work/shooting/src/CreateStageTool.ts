import * as PIXI from "pixi.js"
import {WIDTH, HEIGHT} from './global'
import {GraphicManager} from './GraphicManager'
import {Scene} from './Scene'
import {Screen} from './Screen'
const name = ["player", "player", "player", "player", "player", "player", "player", "player", "player", "player"]
const w = WIDTH / 9
const p_w = WIDTH / 10

export class CreateStageTool extends Scene{
    private enemy_list: PIXI.AnimatedSprite[] = []
    private fog: PIXI.Container
    constructor(private container: PIXI.Container){
        super()
        this.release = () => {
            const screen = Screen.init()
            screen.DeleteOnresizeFunc(this.set)
            screen.app.stage.off("click",this.click)
        }
		const inst = GraphicManager.GetInstance()
        inst.loadGraphics(name)
        inst.SetLoadedFunc(() => {
            const inst = GraphicManager.GetInstance()
            name.forEach(n => {
                let sprite = inst.GetSprite(n)
                sprite.scale.x = sprite.scale.y = Math.min(sprite.width / p_w, sprite.height / p_w)
                this.enemy_list.push(sprite)
            })
            Screen.init().AddOnresizeFunc(this.set)
            this.set()
        })
        this.fog = new PIXI.Container()
        const graph = new PIXI.Graphics()
        graph.lineStyle(0,0)
        graph.beginFill(0xFF0000, 0.5);
        graph.drawRect(0, 0, w, w)
        graph.endFill()
        this.fog.addChild(graph)
        this.fog.zIndex = 4
    }
    private set = () => {
        const app = Screen.init().app
        const list_x = this.container.x + WIDTH + w * 2 / 3
        const list_y = this.container.y
        const list_w_num = Math.floor((this.container.x - w * 4 / 3) / w) + 1
        const list_w = list_w_num * w
        const graphics = new PIXI.Graphics();
        app.stage.interactive = true
        app.stage.on("click", this.click)
        graphics.lineStyle(2, 0xCCCC00, 1);
        graphics.beginFill(0);
        for(let i = 0; i < name.length; i++){
            this.enemy_list[i].x = list_x + (i % list_w_num) * w
            this.enemy_list[i].y = list_y + Math.floor(i / list_w_num) * w
            this.enemy_list[i].zIndex = 3
            app.stage.addChild(this.enemy_list[i])
            graphics.drawRect(
                this.enemy_list[i].x - w / 2,
                this.enemy_list[i].y - w / 2,
                w, w);
        }
        graphics.zIndex = 2
        graphics.endFill()
        app.stage.addChild(graphics)
    }
    private click = () => {
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
            if(id < name.length){
                this.fog.x = this.enemy_list[id].x - w / 2,
                this.fog.y = this.enemy_list[id].y - w / 2,
                app.stage.addChild(this.fog)
            }
        }
        else{
            app.stage.removeChild(this.fog)
        }
    }
}