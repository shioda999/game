import {Obj} from './Obj'
import {ITEMOBJ_DATA} from './global'
export class ItemObj extends Obj{
    protected static addScore: (score: number) => any
    protected count = 0
    constructor(spriteName: string, x: number, y: number, is_enemy: boolean){
        super(spriteName, x, y, is_enemy)
        this.sprite.scale.set(0.5)
    }
    public static setCollisionFunc(addScore) {
        ItemObj.addScore = addScore
    }
}
export class Coin1 extends ItemObj{
    constructor(x: number, y: number, is_enemy: boolean){
        super(ITEMOBJ_DATA[0].name, x, y, is_enemy)
        this.collision_callback = () => { ItemObj.addScore(1), this.delete() }
    }
    public update(){
        let angle = this.calcAngleToPlayer()
        const speed = 10
        this.x += Math.sin(angle) * speed
        this.y -= Math.cos(angle) * speed
    }
}
export class Coin10 extends ItemObj{
    constructor(x: number, y: number, is_enemy: boolean){
        super(ITEMOBJ_DATA[1].name, x, y, is_enemy)
        this.collision_callback = () => { ItemObj.addScore(10), this.delete() }
    }
    public update(){
        let angle = this.calcAngleToPlayer()
        const speed = 8
        this.x += Math.sin(angle) * speed
        this.y -= Math.cos(angle) * speed
    }
}