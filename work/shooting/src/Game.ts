import * as PIXI from "pixi.js"
import {Scene} from './Scene';
import {WIDTH, HEIGHT} from './global'
import {Key} from './key'
import {Player} from './Player'
import {ObjManager} from './ObjManager'
import {GraphicManager} from './GraphicManager'
import {Sound} from './Sound'
const FPS_UPDATE_FREQ = 20
export class Game extends Scene {
	private curTime: number
	private prevTime: number
	private countFrame: number = 0
	private key: Key
	private fpsContainer: PIXI.Container
	private fpsText: PIXI.Text
	private fpsBox: PIXI.Graphics
	private releaseFlag: boolean = false
	private objmanager: ObjManager
    constructor(private container: PIXI.Container) {
    	super(WIDTH / 2, HEIGHT / 2, WIDTH / 3, HEIGHT / 10, container,
			() => this.decide(), () => this.cancel()
		)
		this.objmanager = new ObjManager(container)
		const inst = GraphicManager.GetInstance()
		inst.loadGraphic("new_player")
		inst.loadGraphic("pbullet_blue")
		inst.loadGraphic("pbullet_red")
		inst.loadGraphic("pbullet_green")
		inst.loadGraphic("bullet")
		inst.loadGraphic("pbullet")
		inst.loadGraphic("bullet_red")
		inst.loadGraphic("new_bullet")
		inst.SetLoadedFunc(() => {
			this.objmanager.setPlayer()
			this.key = Key.GetInstance()
			this.curTime = new Date().getTime() - 1000 * FPS_UPDATE_FREQ / 60
			this.initFpsContainer()
			this.loop()
		})
		Sound.load("test.mp3", "bgm")
		Sound.load("player_shot.mp3", "pshot")
		Sound.set_volume("pshot", 0.15)
		Sound.play("bgm", true)
	}
	private loop = ()=> {
		if(this.releaseFlag)return
		requestAnimationFrame(this.loop)
        this.key.RenewKeyData()
		this.objmanager.update()
		this.objmanager.draw()
		if(this.countFrame % FPS_UPDATE_FREQ === 0){
			this.prevTime = this.curTime
			this.curTime = new Date().getTime()
			this.updateFPS(this.curTime - this.prevTime)
		}
		this.item_manager.update()
		this.countFrame++
	}
	private decide(){
        //this.gotoScene("game")
	}
	private cancel(){
        this.gotoScene("back")
	}
	private orgRound(value, base) {
		return Math.round(value * base) / base;
	}
	private updateFPS(delta: number){
		this.fpsContainer.removeChildren()
		if(this.fpsText)this.fpsText.destroy()
		if(this.fpsBox)this.fpsBox.destroy()
		this.fpsText = new PIXI.Text("FPS:" + this.orgRound(1000 * FPS_UPDATE_FREQ / delta, 100).toFixed(2),{
			fontFamily: "Arial", fontSize: WIDTH / 30, fill: 0xdddddd
		})
		this.fpsBox = new PIXI.Graphics()
		this.fpsBox.lineStyle(2, 0xcccccc, 1, 1.0)
		this.fpsBox.beginFill(0x0000ff, 0.3)
		this.fpsBox.drawRect(0, 0, this.fpsText.width, this.fpsText.height)
		this.fpsBox.endFill()
		this.fpsContainer.addChild(this.fpsBox)

		this.fpsContainer.addChild(this.fpsText)
		this.fpsContainer.x = WIDTH - this.fpsText.width - 3
		this.fpsContainer.y = HEIGHT - this.fpsText.height - 3
	}
	private initFpsContainer(){
		this.fpsContainer = new PIXI.Container()
		this.fpsContainer.zIndex = 1
		this.container.addChild(this.fpsContainer)
	}
	public release(){
		this.objmanager.release()
		this.releaseFlag = true
		Sound.stop("bgm")
	}
}