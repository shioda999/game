import * as PIXI from "pixi.js"
import { Beam } from "./Beam"
import {WIDTH, HEIGHT, GlobalParam, SPEED, RAPID, SIZE} from './global'
import {Obj} from './Obj'
import { Sound } from "./Sound"
export class Player extends Obj{
    private speed: number = 8
    public stage_flag: boolean = true
    private bullet_interval = 60 / RAPID[GlobalParam.save_data.rapid]
    private bullet_count = 0
    private count = 0
    private muteki_count = 0
    readonly MUTEKI_TIME = 120
    private beam: Beam
    constructor(x: number, y: number, is_enemy: boolean){
        super("player", x, y, is_enemy)
        this.range *= SIZE[GlobalParam.save_data.size]
        this.sprite.scale.x = this.sprite.scale.y = 0.7 * SIZE[GlobalParam.save_data.size]
    }
    public update(){
        let add_x = 0
        let add_y = 0
        this.updatePlayerPosition()

        let launch_able = (Math.floor(this.bullet_count / this.bullet_interval) != Math.floor((this.bullet_count - 1) / this.bullet_interval))
                
        if (Obj.key.IsPress_Now("decide")
            && launch_able && this.stage_flag) {
            this.bullet_count++
            this.CreateBullet("missile", this.x, this.y - this.getHeight() / 2, "purple", 0,
                SPEED[GlobalParam.save_data.speed] * 8)
            Sound.play("pshot", false, 0.5 * GlobalParam.se_volume)
        }
        else if (!launch_able)this.bullet_count++
        if(Obj.key.IsPress_Now("Up"))add_y = -1
        if(Obj.key.IsPress_Now("Down"))add_y = 1
        if(Obj.key.IsPress_Now("Left"))add_x = -1
        if (Obj.key.IsPress_Now("Right")) add_x = 1
        let speed = this.speed
        if(add_x && add_y)speed *= 0.71
        if (Obj.key.IsPress_Now("Brake")) speed *= 0.3
        this.x += add_x * speed
        this.y += add_y * speed
        this.adjustPosition()
        this.count++
        if (this.count % 100 == 0) {
            this.beam = new Beam(this.SearchTarget(), this, 0, 0, 0xff3333)
        }
        if(this.beam)this.beam.update()

        if (this.damageFlag) {
            this.muteki_count = this.MUTEKI_TIME
            this.createDamageEffect()
        }
        if(this.muteki_count > 0){
            this.muteki_count--
            this.muteki_flag = true
        }
        else this.muteki_flag = false, this.muteki_count = 0
        this.setAlpha(this.muteki_count % 4 ? 0.5: 1.0)
    }
    public muteki() {
        this.muteki_count = this.MUTEKI_TIME
    }
}