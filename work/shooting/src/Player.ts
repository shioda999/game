import * as PIXI from "pixi.js"
import { WIDTH, HEIGHT, GlobalParam, SPEED, RAPID, SIZE, BULLET_COLOR } from './global'
import { GraphicManager } from "./GraphicManager"
import { Obj } from './Obj'
import { Sound } from "./Sound"
export class Player extends Obj {
    private speed: number = 8
    public stage_flag: boolean = true
    private bullet_interval = 60 / RAPID[GlobalParam.save_data.rapid]
    private bullet_count = 0
    private count = 0
    private muteki_count = 0
    readonly MUTEKI_TIME = 120
    private child_sprite = []
    private pos_table = []
    readonly dis = 6
    constructor(x: number, y: number, is_enemy: boolean) {
        super("player", x, y, is_enemy)
        this.range *= SIZE[GlobalParam.save_data.size]
        this.sprite.scale.x = this.sprite.scale.y = 0.7 * SIZE[GlobalParam.save_data.size]

        let graphic_inst = GraphicManager.GetInstance()
        for (let i = 0; i < GlobalParam.save_data.child; i++) {
            let sprite = graphic_inst.GetSprite("bullet", [BULLET_COLOR.indexOf("black")])
            Obj.container.addChild(sprite)
            this.child_sprite.push(sprite)
        }
        for (let i = GlobalParam.save_data.child * this.dis; i > 0; i--) {
            this.pos_table.push(x)
            this.pos_table.push(y + i * this.speed)
        }
        this.child_move()
        this.delete_callback = () => {
            this.child_sprite.forEach(n => {
                Obj.container.removeChild(n)
            })
        }
    }
    public update() {
        this.updatePlayerPosition()

        let launch_able = (Math.floor(this.bullet_count / this.bullet_interval) != Math.floor((this.bullet_count - 1) / this.bullet_interval))

        if (Obj.key.IsPress_Now("decide")
            && launch_able && this.stage_flag) {
            this.bullet_count++
            this.CreateBullet("p_straight", this.x, this.y - this.getHeight() / 2, "purple", 0,
                SPEED[GlobalParam.save_data.speed] * 8)
            Sound.play("pshot", false, 0.3 * GlobalParam.se_volume)
            this.child_sprite.forEach(n => {
                this.CreateBullet("p_straight", n.x, n.y, "blue", 0,
                    SPEED[GlobalParam.save_data.speed] * 8)
            })
        }
        if (GlobalParam.save_data.sub == 1 && this.count % 20 == 0) {
            this.CreateBullet("p_straight", this.x, this.y - this.getHeight() / 2, "red", this.calcAngleToTarget(this.SearchTarget()),
                10)
        }
        if (GlobalParam.save_data.sub == 2 && this.count % 60 <= 20 && this.count % 10 == 0) {
            this.CreateBullet("missile", this.x, this.y - this.getHeight() / 2, "purple", 0, 10, 1.5)
        }
        if (GlobalParam.save_data.sub == 3 && this.count % 150 == 0) {
            this.CreateBeam(this.SearchTarget(), this, 0, 0, 0xff3333)
        }
        else if (!launch_able) this.bullet_count++
        this.move()
        this.child_move()
        this.count++

        if (this.damageFlag) {
            this.muteki_count = this.MUTEKI_TIME
            this.createDamageEffect()
        }
        if (this.muteki_count > 0) {
            this.muteki_count--
            this.muteki_flag = true
        }
        else this.muteki_flag = false, this.muteki_count = 0
        this.setAlpha(this.muteki_count % 4 ? 0.5 : 1.0)
    }
    private move() {
        let add_x = 0
        let add_y = 0
        if (Obj.key.IsPress_Now("Up")) add_y = -1
        if (Obj.key.IsPress_Now("Down")) add_y = 1
        if (Obj.key.IsPress_Now("Left")) add_x = -1
        if (Obj.key.IsPress_Now("Right")) add_x = 1
        let speed = this.speed
        if (add_x && add_y) speed *= 0.71
        if (Obj.key.IsPress_Now("Brake")) speed *= 0.3
        this.x += add_x * speed
        this.y += add_y * speed
        this.adjustPosition()
    }
    private child_move() {
        if (GlobalParam.save_data.child == 0) return
        let len = this.pos_table.length
        if (this.pos_table[len - 2] == this.x && this.pos_table[len - 1] == this.y) return
        this.pos_table.push(this.x)
        this.pos_table.push(this.y)
        this.child_sprite.forEach((n, i) => {
            n.position.set(this.pos_table[len - (i + 1) * this.dis * 2], this.pos_table[len - (i + 1) * this.dis * 2 + 1])
            //console.log(this.pos_table[len - (i + 1) * this.dis * 2], this.pos_table[len - (i + 1) * this.dis * 2 + 1])
        })
        this.pos_table.shift()
        this.pos_table.shift()
    }
    public muteki() {
        this.muteki_count = this.MUTEKI_TIME
    }
}