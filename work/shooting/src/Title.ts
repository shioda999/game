import {Scene} from './Scene';
import {WIDTH, HEIGHT} from './global'
import {Key} from './key'
import { ItemManager } from './ItemManager';
export class Title extends Scene {
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
                this.item_manager.appendItem("item1",HEIGHT / 10, [0xffffff, 0xcccccc, 0x555555])
                this.item_manager.appendItem("item2",HEIGHT / 10, [0xffffff, 0xcccccc, 0x555555])
                this.item_manager.appendItem("item3",HEIGHT / 10, [0xffffff, 0xcccccc, 0x555555])
                this.key = Key.GetInstance()
                this.loopID = setInterval(() => this.loop(), 30)
        }
        private decide(){
                switch(this.item_manager.getFocus()){
                case 0:
                        this.gotoScene("game")
                        break
                case 1:
                        this.gotoScene("make_stage")
                }
        }
        private cancel(){
                this.gotoScene("back")
        }
        private loop(){
                this.key.RenewKeyData()
                this.item_manager.update()
        }
}