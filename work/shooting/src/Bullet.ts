import {Obj} from './Obj'
let c = ["blue", "l_blue", "purple", "cyan", "l_green", "green", "red", "orange", "black"]
export class Bullet extends Obj{
    constructor(name: string, x: number, y: number, is_enemy: boolean, protected angle: number, protected speed: number, color: string){
        super(name, x, y, is_enemy, [c.indexOf(color)])
        this.angle = angle, this.speed = speed
    }
}
export class P_Straight extends Bullet{
    public constructor(x: number, y: number, is_enemy: boolean, angle: number, speed: number, color: string){
        super("pbullet", x - 2, y, is_enemy, angle, speed, color)
    }
    public update(){
        this.x += this.speed * Math.cos(this.angle * Math.PI / 180)
        this.y += this.speed * Math.sin(this.angle * Math.PI / 180)
    }
}
export class Straight extends Bullet{
    public constructor(x: number, y: number, is_enemy: boolean, angle: number, speed: number, color: string){
        super("bullet", x - 2, y, is_enemy, angle, speed, color)
    }
    public update(){
        this.x += this.speed * Math.cos(this.angle * Math.PI / 180)
        this.y += this.speed * Math.sin(this.angle * Math.PI / 180)
    }
}
export class FirstSlow extends Bullet{
    public constructor(x: number, y: number, is_enemy: boolean, angle: number, speed: number, color: string){
        super("new_bullet", x - 2, y, is_enemy, angle, speed, color)
    }
    public update(){
        this.x += this.speed * Math.cos(this.angle * Math.PI / 180)
        this.y += this.speed * Math.sin(this.angle * Math.PI / 180)
    }
}