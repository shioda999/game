import * as PIXI from "pixi.js"
import { Obj } from './Obj'
import {EFFECT_NAME, HEIGHT} from './global'
export class Effect extends Obj{
    protected count = 0
    constructor(spriteName: string, x: number, y: number, is_enemy: boolean){
        super(spriteName, x, y, is_enemy)
    }
}
export class Damage extends Effect{
    constructor(x: number, y: number, is_enemy: boolean){
        super(EFFECT_NAME[0], x, y, is_enemy)
        this.sprite.blendMode = PIXI.BLEND_MODES.ADD
    }
    public update(){
        this.count++
        if(this.count >= 2)this.sprite.scale.set(1.5)
        let alpha = Math.min(1.0 - (this.count - 5) / 50, this.count / 5) * 0.8
        this.setAlpha(alpha)
        if (alpha <= 0) this.delete()
    }
}
export class SmallDamage extends Effect{
    constructor(x: number, y: number, is_enemy: boolean){
        super(EFFECT_NAME[0], x, y, is_enemy)
        this.sprite.blendMode = PIXI.BLEND_MODES.ADD
        this.sprite.scale.set(0.6)
    }
    public update(){
        this.count++
        let alpha = Math.min(1.0 - (this.count - 5) / 50, this.count / 5) * 0.8
        this.setAlpha(alpha)
        if (alpha <= 0) this.delete()
    }
}
export class ShockWave extends Effect{
    constructor(x: number, y: number, is_enemy: boolean){
        super(EFFECT_NAME[0], x, y, is_enemy)
        this.sprite.blendMode = PIXI.BLEND_MODES.ADD
    }
    public update(){
        this.count++
        this.sprite.scale.x = this.sprite.scale.y = this.count / 100 + 0.1
        let alpha = Math.min(1.0 - (this.count - 5) / 50, this.count / 5) * 0.8
        this.setAlpha(alpha)
        if (alpha <= 0) this.delete()
    }
}