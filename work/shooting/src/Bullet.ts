import * as PIXI from "pixi.js"
import { Obj } from './Obj'
import { BULLET_COLOR } from './global'
export class Bullet extends Obj{
    constructor(name: string, x: number, y: number, is_enemy: boolean, protected angle: number, protected speed: number, color: string){
        super(name, x, y, is_enemy, [BULLET_COLOR.indexOf(color)])
        this.angle = angle, this.speed = speed
        this.sprite.blendMode = PIXI.BLEND_MODES.ADD
    }
}
export class P_Straight extends Bullet{
    public constructor(x: number, y: number, is_enemy: boolean, angle: number, speed: number, color: string){
        super("pbullet", x - 2, y, is_enemy, angle, speed, color)
        this.collision_callback = this.delete
    }
    public update(){
        this.x += this.speed * Math.sin(this.angle)
        this.y -= this.speed * Math.cos(this.angle)
    }
}
export class Straight extends Bullet{
    public constructor(x: number, y: number, is_enemy: boolean, angle: number, speed: number, color: string){
        super("bullet", x - 2, y, is_enemy, angle, speed, color)
        this.collision_callback = this.delete
    }
    public update(){
        this.x += this.speed * Math.sin(this.angle)
        this.y -= this.speed * Math.cos(this.angle)
    }
}
export class FirstSlow extends Bullet{
    private max_speed: number
    public constructor(x: number, y: number, is_enemy: boolean, angle: number, speed: number, color: string){
        super("bullet", x - 2, y, is_enemy, angle, speed, color)
        this.collision_callback = this.delete
        this.max_speed = speed
        this.speed = 0
    }
    public update(){
        this.x += this.speed * Math.sin(this.angle)
        this.y -= this.speed * Math.cos(this.angle)
        this.speed = Math.min(this.speed + this.max_speed / 100, this.max_speed)
    }
}
export class LastSlow extends Bullet{
    private slow_speed: number
    private first_speed: number = 5
    public constructor(x: number, y: number, is_enemy: boolean, angle: number, speed: number, color: string){
        super("bullet", x - 2, y, is_enemy, angle, speed, color)
        this.collision_callback = this.delete
        this.slow_speed = speed
        this.speed = this.first_speed
    }
    public update(){
        this.x += this.speed * Math.sin(this.angle)
        this.y -= this.speed * Math.cos(this.angle)
        this.speed = Math.min(this.speed - this.first_speed / 100, this.slow_speed)
    }
}
export class Missile extends Obj {
    private target: Obj
    private speed_temp: number
    readonly omega = Math.PI / 150
    public constructor(x: number, y: number, is_enemy: boolean, private angle: number, private speed: number, color: string){
        super("missile", x, y, is_enemy)
        this.angle = angle, this.speed_temp = speed
        this.speed = 1
        this.collision_callback = () => {
            this.delete()
            this.createDamageEffect(false)
        }
        this.target = this.SearchTarget()
        //this.angle = this.calcAngleToTarget(this.target)
    }
    public update() {
        if (this.target) {
            let d = this.calcAngleToTarget(this.target) + 4 * Math.PI - this.angle
            while (d >= 2 * Math.PI) d -= 2 * Math.PI
            if (d > this.omega && d <= Math.PI) d = this.omega
            else if(d > Math.PI && d < 2 * Math.PI - this.omega)d = 2 * Math.PI - this.omega
            this.angle += d + 2 * Math.PI
            while (this.angle >= 2 * Math.PI) this.angle -= 2 * Math.PI
        }
        this.sprite.rotation = this.angle
        this.speed += 0.01 * this.speed_temp
        this.x += this.speed * Math.sin(this.angle)
        this.y -= this.speed * Math.cos(this.angle)
    }
}