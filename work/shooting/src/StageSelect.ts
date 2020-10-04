import * as PIXI from "pixi.js"
import {Scene} from './Scene';
import {WIDTH, HEIGHT, GlobalParam} from './global'
import {Key} from './key'
import { ItemManager } from './ItemManager';
export class StageSelect extends Scene {
	private key: Key
	private loopID: number
	private item_manager: ItemManager
	constructor(container: PIXI.Container) {
		super()
		this.release = () => {
			clearInterval(this.loopID)
		}
		this.item_manager = new ItemManager(WIDTH / 2, HEIGHT / 2, WIDTH / 3, HEIGHT / 10, container,
			() => this.decide(), () => this.cancel())
		let clear = GlobalParam.save_data.clear
		this.item_manager.appendItem("装備変更", HEIGHT / 13, [0xffffff, 0x999999], false, true, 0x4B0000)
		this.item_manager.appendItem("ステージ1", HEIGHT / 13, [0xffffff, 0x999999], false)
		this.item_manager.appendItem("ステージ2", HEIGHT / 13, [0xffffff, 0x999999], false, clear >= 1)
		this.item_manager.appendItem("ステージ3", HEIGHT / 13, [0xffffff, 0x999999], false, clear >= 2)
		this.key = Key.GetInstance()
		this.loopID = setInterval(() => this.loop(), 30)
	}
	private decide() {
		let val = this.item_manager.getFocus()
		switch (val) {
			case 0:
				this.gotoScene("upgrade")
				break
			case 1:
			case 2:
			case 3:
				GlobalParam.stage = val
				this.gotoScene("game")
				break
		}
	}
	private cancel() {
		this.gotoScene("back")
	}
	private loop() {
		if (GlobalParam.pause_flag) return
		this.key.RenewKeyData()
		this.item_manager.update()
	}
}