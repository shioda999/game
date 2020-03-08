import * as PIXI from "pixi.js"
import {WIDTH, HEIGHT} from './global'
export class Screen {
    private static instance: Screen
    private container: PIXI.Container
    private app: PIXI.Application
    constructor(){
        this.container = new PIXI.Container()
        this.setPosition()
        window.onresize = this.setPosition
    }
    public static init(){
        if (!this.instance)
            this.instance = new Screen();
        return this.instance;
    }
    public getContainer(){
        return this.container
    }
    private setPosition = ()=> {
        if(this.app){
            document.body.removeChild(this.app.view)
            this.app.stage.removeChildren()
            this.app.destroy()
        }
        this.app = new PIXI.Application({ backgroundColor: 0 ,
             width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight - 10,
            antialias: true
        })
        document.body.appendChild(this.app.view)
        this.app.stage.width = document.documentElement.clientWidth
        this.app.stage.height = document.documentElement.clientHeight
        this.container.x = (document.documentElement.clientWidth - WIDTH) / 2
        this.container.y = (document.documentElement.clientHeight - HEIGHT) / 2

        const frame = new PIXI.Graphics()
        frame.beginFill(0,0)
        frame.lineStyle(Math.max(this.container.x, this.container.y), 0x1099bb,1.0, 1)
        frame.drawRect(this.container.x, this.container.y, WIDTH, HEIGHT)
        frame.endFill()
        frame.zIndex = 1
        this.app.stage.sortableChildren = true
        this.container.sortableChildren = true
        this.app.stage.addChild(frame)
        this.app.stage.addChild(this.container)
    }
}