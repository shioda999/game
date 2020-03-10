import {Item} from './Item'
import * as PIXI from "pixi.js"
import {WIDTH, HEIGHT} from './global'
import {Key} from './key'
export class ItemManager{
    private currentFocusId: number = 0
    private key: Key
    private padding = HEIGHT / 20
    private items: Item[] = []
    constructor(private sx: number, private sy: number, private width: number, private height: number, private container: PIXI.Container,
        private decide: () => any, private cancel: () => any){
        this.key = Key.GetInstance()
    }
    public appendItem = (text: string, size: number, color = [0x000000], x =  this.sx, y = this.sy,
         anchor_x = 0.5, anchor_y = 0.5) => {
        const style = new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontSize: size,
            fill: color
        });
        const textContainer = new PIXI.Container()
        const graph = new PIXI.Graphics()
        const textdata = new PIXI.Text(text, style)
        const w = this.width
        const h = this.height
        graph.beginFill(0x0000ff, 0.3)
        graph.drawRoundedRect(- w / 2, - h / 2, w, h, h / 10);
        graph.endFill();
        graph.name = "graph"
        textContainer.addChild(graph)
        textdata.anchor.x = anchor_x
        textdata.anchor.y = anchor_y
        textdata.name = "textdata"
        textContainer.addChild(textdata)
        this.items.push(new Item(textContainer, this.container, this.items.length, WIDTH / 40))
        this.items[this.items.length - 1].sendCurrentSelectingItemID(0)
        for(let i = 0; i < this.items.length; i++){
            let text = this.items[i].itemContainer
            text.position.x = this.sx
            text.position.y = this.sy + (i - Math.floor(this.items.length / 2)) * (h + this.padding)
        }
    }
    public update(){
        if(this.key.IsPress("Up")){this.up()}
        if(this.key.IsPress("Down")){this.down()}
        if(this.key.IsPress("decide")){this.decide()}
        if(this.key.IsPress("cancel")){this.cancel()}
    }
    public SetPadding(padding: number){
        this.padding = padding
    }
    private up(){
        this.currentFocusId += this.items.length - 1
        this.updateFocusID()
    }
    private down(){
        this.currentFocusId += 1
        this.updateFocusID()
    }
    private updateFocusID(){
        if(this.items.length === 0)this.currentFocusId = 0
        else this.currentFocusId %= this.items.length
        for(let i = 0; i< this.items.length; i++){
            this.items[i].sendCurrentSelectingItemID(this.currentFocusId)
        }
    }
    public getFocus(){
        return this.currentFocusId
    }
}