import * as PIXI from "pixi.js"
import { Obj } from './Obj'
import { BULLET_COLOR, HEIGHT, WIDTH } from './global'
export class Bullet extends Obj{
    constructor(name: string, x: number, y: number, is_enemy: boolean, protected angle: number, protected speed: number, color: string, size: number){
        super(name, x, y, is_enemy, [BULLET_COLOR.indexOf(color)])
        this.angle = angle, this.speed = speed
        this.sprite.blendMode = PIXI.BLEND_MODES.ADD
        this.range *= size
        this.sprite.scale.set(size)
    }
}
export class P_Straight extends Bullet{
    public constructor(x: number, y: number, is_enemy: boolean, angle: number, speed: number, color: string, size: number){
        super("pbullet", x - 2, y, is_enemy, angle, speed, color, size)
        this.sprite.rotation = angle
        this.collision_callback = this.delete
    }
    public update(){
        this.x += this.speed * Math.sin(this.angle)
        this.y -= this.speed * Math.cos(this.angle)
    }
}
export class Straight extends Bullet{
    public constructor(x: number, y: number, is_enemy: boolean, angle: number, speed: number, color: string, size: number){
        super("bullet", x - 2, y, is_enemy, angle, speed, color, size)
        this.collision_callback = this.delete
    }
    public update(){
        this.x += this.speed * Math.sin(this.angle)
        this.y -= this.speed * Math.cos(this.angle)
    }
}
export class FirstSlow extends Bullet{
    private max_speed: number
    public constructor(x: number, y: number, is_enemy: boolean, angle: number, speed: number, color: string, size: number){
        super("bullet", x - 2, y, is_enemy, angle, speed, color, size)
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
    private first_speed: number
    public constructor(x: number, y: number, is_enemy: boolean, angle: number, speed: number, color: string, size: number){
        super("bullet", x - 2, y, is_enemy, angle, speed, color, size)
        this.collision_callback = this.delete
        this.slow_speed = speed
        this.speed = this.first_speed = speed * 10
    }
    public update(){
        this.x += this.speed * Math.sin(this.angle)
        this.y -= this.speed * Math.cos(this.angle)
        this.speed = Math.max(this.speed - this.first_speed / 25, this.slow_speed)
    }
}
export class Reflect extends Bullet{
    private reflect_count = 0
    public constructor(x: number, y: number, is_enemy: boolean, angle: number, speed: number, color: string, size: number){
        super("bullet", x - 2, y, is_enemy, angle, speed, color, size)
        this.collision_callback = this.delete
        this.speed = speed
    }
    public update() {
        this.x += this.speed * Math.sin(this.angle)
        this.y -= this.speed * Math.cos(this.angle)
        if(this.reflect_count >= 1)return
        if(this.x < 0 && this.y < 0)this.reflect_count++, this.angle = this.angle + Math.PI
        else if (this.x < 0) this.reflect_count++, this.angle = -this.angle
        else if (this.y < 0) this.reflect_count++, this.angle = Math.PI - this.angle
        if(this.x > WIDTH && this.y > HEIGHT)this.reflect_count++, this.angle = this.angle + Math.PI
        else if (this.x > WIDTH) this.reflect_count++, this.angle = - this.angle
        else if (this.y > HEIGHT) this.reflect_count++, this.angle = Math.PI - this.angle
        if(this.reflect_count){
            this.x += this.speed * Math.sin(this.angle)
            this.y -= this.speed * Math.cos(this.angle)
        }
    }
}
export class Missile extends Obj {
    private target: Obj
    private speed_temp: number
    private omega: number
    public constructor(x: number, y: number, is_enemy: boolean, private angle: number, private speed: number, color: string, size: number){
        super("missile", x, y, is_enemy)
        this.angle = angle, this.speed_temp = speed
        this.omega = Math.PI / 150
        this.speed = speed / 5
        this.range *= size
        this.sprite.scale.set(size)
        this.collision_callback = () => {
            this.delete()
            this.createDamageEffect(false, true)
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
export class StraightMissile extends Obj {
    private speed_temp: number
    public constructor(x: number, y: number, is_enemy: boolean, private angle: number, private speed: number, color: string, size: number){
        super("missile", x, y, is_enemy)
        this.angle = angle, this.speed_temp = speed
        this.speed = speed / 2
        this.range *= size
        this.sprite.scale.set(size)
        this.collision_callback = () => {
            this.delete()
            this.createDamageEffect(false, true)
        }
    }
    public update() {
        this.sprite.rotation = this.angle
        this.speed += 0.01 * this.speed_temp
        this.x += this.speed * Math.sin(this.angle)
        this.y -= this.speed * Math.cos(this.angle)
    }
}