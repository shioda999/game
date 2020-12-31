import * as PIXI from "pixi.js"
import {Scene} from './Scene';
import {WIDTH, HEIGHT, GlobalParam} from './global'
import {Key} from './key'
import {Player} from './Player'
import {ObjManager} from './ObjManager'
import {GraphicManager} from './GraphicManager'
import { Sound } from './Sound'
import { StageClear } from './StageClear'
import { ItemObj } from './ItemObj'
import { ScoreBoard } from './ScoreBoard'
import { GameOver } from "./GameOver";
import { BackGround } from "./BackGround";
const FPS_UPDATE_FREQ = 20
const text_style = new PIXI.TextStyle({
	fontFamily: "Arial",
	fontSize: 16,
	fill: [0xffffff]
})
export class Game extends Scene {
	private score_text: PIXI.Text
	private coin_sprite: PIXI.Sprite
	private stage: number = 1
	private curTime: number
	private prevTime: number
	private countFrame: number = 0
	private key: Key
	private fpsContainer: PIXI.Container
	private fpsText: PIXI.Text
	private fpsBox: PIXI.Graphics
	private releaseFlag: boolean = false
	private objmanager: ObjManager
	private score: number = 0
	private time: number = 0
	private background: BackGround
    constructor(private container: PIXI.Container) {
		super()
		this.release = () => {
			this.objmanager.release()
			this.releaseFlag = true
			Sound.stop("bgm")
		}
		this.background = new BackGround(container, this.stage)
		this.objmanager = new ObjManager(container)
		const inst = GraphicManager.GetInstance()
		inst.SetLoadedFunc(() => {
			this.objmanager.setPlayer()
			this.key = Key.GetInstance()
			this.curTime = new Date().getTime() - 1000 * FPS_UPDATE_FREQ / 60
			this.initFpsContainer()
			this.loop()
		})
		ItemObj.setCollisionFunc(this.AddScore)
		Sound.play("bgm", true, GlobalParam.bgm_volume)

		this.coin_sprite = inst.GetSprite("coin1")
		this.coin_sprite.scale.set(0.5)
		this.coin_sprite.anchor.set(0, 1)
		this.coin_sprite.position.set(0, HEIGHT)
		this.container.addChild(this.coin_sprite)
	}
	private loop = () => {
		if(this.releaseFlag)return
		if (this.objmanager.is_clear() || this.key.IsPress("r")) {
			new StageClear(this.container, () => {
				GlobalParam.data = {score: this.score, remain_life: this.getPlayerLp(), time: this.time}
				this.exitCurrentScene()
				this.gotoScene("scoreBoard")
			})
			return
		}
		if (this.objmanager.is_gameover()) {
			new GameOver(this.container, () => {
				Sound.stop("all")
				Sound.play("bgm", true, GlobalParam.bgm_volume)
				this.objmanager.continue()
				this.score = 0
				this.loop()
			}, () => {
				GlobalParam.data = {score: this.score, remain_life: this.getPlayerLp(), time: this.time}
				this.exitCurrentScene()
				this.gotoScene("scoreBoard")
			})
			return
		}
		requestAnimationFrame(this.loop)
		if (GlobalParam.pause_flag) return
		this.key.RenewKeyData()
		this.background.update()
		this.objmanager.update()
		this.objmanager.draw()
		this.update_score_text()
		if(this.countFrame % FPS_UPDATE_FREQ === 0){
			this.prevTime = this.curTime
			this.curTime = new Date().getTime()
			this.updateFPS(this.curTime - this.prevTime)
		}
		this.countFrame++
		this.time++
		if (this.key.IsPress("cancel")) {
			Sound.play("cancel", false, GlobalParam.se_volume)
			this.gotoScene("back")
		}
	}
	private AddScore = (score: number) => {
		this.score += score
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
	private getPlayerLp(): number {
		return this.objmanager.getPlayerLp()
	}
	private update_score_text() {
		this.container.removeChild(this.score_text)
		this.score_text = new PIXI.Text("    × " + this.score, text_style)
		this.score_text.position.set(0, HEIGHT)
		this.score_text.anchor.x = 0
		this.score_text.anchor.y = 1.0
		this.container.addChild(this.score_text)
	}
}