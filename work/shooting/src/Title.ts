import {Scene} from './Scene';
import {WIDTH, HEIGHT} from './global'
import {Key} from './key'
export class Title extends Scene {
        private key: Key
        private loopID: number
        constructor(container: PIXI.Container) {
                super(WIDTH / 2, HEIGHT / 2, WIDTH / 3, HEIGHT / 10, container,
                         () => this.decide(), () => this.cancel())
                this.item_manager.appendItem("item1",HEIGHT / 10, [0xffffff, 0xcccccc, 0x555555])
                this.item_manager.appendItem("item2",HEIGHT / 10, [0xffffff, 0xcccccc, 0x555555])
                this.item_manager.appendItem("item3",HEIGHT / 10, [0xffffff, 0xcccccc, 0x555555])
                this.key = Key.GetInstance()
                this.loopID = setInterval(() => this.loop(), 30)
        }
        private decide(){
                this.gotoScene("game")
        }
        private cancel(){
                this.gotoScene("back")
        }
        private loop(){
                this.key.RenewKeyData()
                this.item_manager.update()
        }
        public release(){
                clearInterval(this.loopID)
        }
}