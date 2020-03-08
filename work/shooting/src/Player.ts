import * as PIXI from "pixi.js"
import {WIDTH, HEIGHT} from './global'
import {Obj} from './Obj'
import { Sound } from "./Sound"
export class Player extends Obj{
    private speed: number = 10
    private bullet_interval = 10
    private bullet_count = 0
    private count = 0
    private damage_count = 0
    constructor(x: number, y: number, is_enemy: boolean){
        super("new_player", x, y, is_enemy)
    }
    public update(){
        let add_x = 0
        let add_y = 0
        if(Obj.key.IsPress_Now("decide") && this.bullet_count++ % this.bullet_interval == 0){
            this.CreateBullet("p_straight", this.x, this.y - this.getHeight() / 2, "purple" , 270, 15)
            Sound.play("pshot")
        }
        if(Obj.key.IsPress_Now("Up"))add_y = -1
        if(Obj.key.IsPress_Now("Down"))add_y = 1
        if(Obj.key.IsPress_Now("Left"))add_x = -1
        if(Obj.key.IsPress_Now("Right"))add_x = 1
        let speed = this.speed
        if(add_x && add_y)speed *= 0.71
        this.x += add_x * speed
        this.y += add_y * speed
        this.adjustPosition()
        this.count++

        if(this.damageFlag)this.damage_count = 100
        if(this.damage_count){
            this.damage_count--
            this.muteki_flag = true
        }
        else this.muteki_flag = false
        this.setAlpha(this.damage_count ? 0.5: 1.0)
    }
}