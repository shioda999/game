import * as PIXI from "pixi.js"
import {WIDTH, HEIGHT} from './global'
import {GraphicManager} from './GraphicManager'
import {Key} from './key'
export class Obj{
    protected static key: Key
    private static container: PIXI.Container
    private sprite: PIXI.AnimatedSprite
    protected sprite_angle: number = 0
    private flag: boolean
    protected muteki_flag: boolean = false
    private range: number = 20
    private Lp: number = 10
    private Ap: number = 1
    protected damageFlag: boolean
    protected static player_x: number
    protected static player_y: number
    private static func : (name: string, x: number, y: number, is_enemy: boolean) => any
    private static bullet_func : (name: string, x: number, y: number, color: string, angle: number, speed: number, is_enemy: boolean) => any
    public static SetCreateFunc(func: (name: string, x: number, y: number, is_enemy: boolean) => any,
    bullet_func: (name: string, x: number, y: number, color: string, angle: number, speed: number, is_enemy: boolean) => any){
        this.func = func
        this.bullet_func = bullet_func
    }
    public CreateObject(name: string, x: number, y: number){
        Obj.func(name, x, y, this.is_enemy)
    }
    public CreateBullet(name: string, x: number, y: number, color: string, angle?: number, speed?: number){
        if(angle === undefined){
            if(!this.is_enemy)angle = 270
            else angle = 90
        }
        if(speed === undefined)speed = 2
        Obj.bullet_func(name, x, y, color, angle, speed, this.is_enemy)
    }
    public static updatePlayerPos(x: number, y: number){
        this.player_x = x, this.player_y = y
    }
    public check_and_delete(){
        let flag = this.x > -WIDTH / 3 && this.x < WIDTH * 11 / 10
            && this. y > -HEIGHT / 3 && this.y < HEIGHT * 11 / 10 || this.flag
        if(!flag)this.release()
        return flag
    }
    protected adjustPosition(){
        this.x = Math.min(Math.max(0, this.x), WIDTH)
        this.y = Math.min(Math.max(0, this.y), HEIGHT)
    }
    constructor(spriteName: string, protected x: number, protected y: number, protected is_enemy: boolean, index?: number[]){
        this.x = x, this.y = y
        this.sprite = GraphicManager.GetInstance().GetSprite(spriteName, index)
        if(!Obj.key){
            Obj.key = Key.GetInstance()
        }
        Obj.container.addChild(this.sprite)
    }
    public draw(){
        this.sprite.x = this.x
        this.sprite.y = this.y
        this.sprite.angle = this.sprite_angle
    }
    public getWidth(){
        return this.sprite.width
    }
    public getHeight(){
        return this.sprite.height
    }
    public setter(range: number, Lp: number, Ap: number){
        this.range = range
        this.Lp = Lp
        this.Ap = Ap
    }
    public check_collision(obj: Obj){
        if(!this.muteki_flag
            && Math.pow( this.x - obj.x, 2) + Math.pow( this.y - obj.y, 2) < Math.pow(this.range + obj.range, 2)){
            this.Lp -= obj.Ap
            this.damageFlag = true
        }
        else this.damageFlag = false
    }
    public static SetGlobalContainer(container: PIXI.Container){
        this.container = container
    }
    protected setAlpha(alpha :number){
        this.sprite.alpha = alpha
    }
    private release(){
        this.sprite.destroy()
    }
}