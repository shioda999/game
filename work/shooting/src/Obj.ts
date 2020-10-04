import * as PIXI from "pixi.js"
import {WIDTH, HEIGHT, ENEMY_DATA, GlobalParam, BOSS_DATA} from './global'
import {GraphicManager} from './GraphicManager'
import {Key} from './key'
import { Sound } from "./Sound"
import { PLAYER_RANGE, PLAYER_LP } from "./global"
export class Obj{
    protected static px: number
    protected static py: number
    protected static key: Key
    public static container: PIXI.Container
    protected sprite: PIXI.AnimatedSprite
    private flag: boolean = true
    protected muteki_flag: boolean = false
    protected range: number = 0
    private Lp: number = 10
    private Ap: number = 1
    protected damageFlag: boolean
    protected collision_callback: () => any
    protected delete_callback: () => any
    protected static player_x: number
    protected static player_y: number
    private static func : (name: string, x: number, y: number, is_enemy: boolean) => any
    private static bullet_func : (name: string, x: number, y: number, color: string, angle: number, speed: number, is_enemy: boolean) => any
    private static effect_func: (name: string, x: number, y: number) => any
    private static itemobj_func : (name: string, x: number, y: number) => any
    protected static change_bullet_to_coin_func: () => any
    protected static search_target_func: (obj: Obj) => any
    constructor(spriteName: string, protected x: number, protected y: number, protected is_enemy: boolean, index?: number[]){
        this.x = x, this.y = y
        this.sprite = GraphicManager.GetInstance().GetSprite(spriteName, index)
        this.setter(spriteName)
        if(!Obj.key){
            Obj.key = Key.GetInstance()
        }
        Obj.container.addChild(this.sprite)
    }
    public setter(spriteName: string) {
        let enemy_id: number = -1
        if (spriteName == "player") {
            this.range = PLAYER_RANGE
            this.Lp = PLAYER_LP
            this.Ap = 0
            return
        }
        ENEMY_DATA.forEach((n, i) => { if (n.name == spriteName) enemy_id = i })
        if (enemy_id != -1) {
            this.range = ENEMY_DATA[enemy_id].range
            this.Lp = ENEMY_DATA[enemy_id].Lp
            return
        }
        BOSS_DATA.forEach((n, i) => { if (n.name == spriteName) enemy_id = i })
        if (enemy_id != -1) {
            this.range = BOSS_DATA[enemy_id].range
            this.Lp = BOSS_DATA[enemy_id].Lp
            return
        }
        //this.range = range
        //this.Lp = Lp
        //this.Ap = Ap
    }
    public static SetCreateFunc(func: (name: string, x: number, y: number, is_enemy: boolean) => any,
        bullet_func: (name: string, x: number, y: number, color: string, angle: number, speed: number, is_enemy: boolean) => any,
        effect_func: (name: string, x: number, y: number) => any,
        itemobj_func: (name: string, x: number, y: number) => any,
        change_bullet_to_coin_func: () => any,
        search_target_func: (obj: Obj) => any,
    ) {
        this.func = func
        this.bullet_func = bullet_func
        this.effect_func = effect_func
        this.itemobj_func = itemobj_func
        this.change_bullet_to_coin_func = change_bullet_to_coin_func
        this.search_target_func = search_target_func
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
    public CreateItemObj(name: string, x: number, y: number) {
        Obj.itemobj_func(name, x, y)
    }
    public CreateScore(score: number, x: number, y: number) {
        let r = 5
        let n1 = score % 10
        let n10 = Math.floor(score / 10)
        //let n100 = Math.floor(score / 100)
        for (let i = 0; i < n10; i++) {
            this.CreateItemObj("coin10",
                x + r * Math.cos(Math.random() * 2 * Math.PI),
                y + r * Math.sin(Math.random() * 2 * Math.PI))
            r+=3
        }
        for (let i = 0; i < n1; i++) {
            this.CreateItemObj("coin1",
                x + r * Math.cos(Math.random() * 2 * Math.PI),
                y + r * Math.sin(Math.random() * 2 * Math.PI))
            r+=3
        }
    }
    public SearchTarget() {
        return Obj.search_target_func(this)
    }
    public static updatePlayerPos(x: number, y: number){
        this.player_x = x, this.player_y = y
    }
    public check_and_delete(){
        let flag = this.x > -WIDTH / 10 && this.x < WIDTH * 11 / 10
            && this. y > -HEIGHT / 10 && this.y < HEIGHT * 11 / 10 && this.flag
        if(!flag)this.release()
        return flag
    }
    public check_collision(obj: Obj){
        if(!this.muteki_flag
            && Math.pow( this.x - obj.x, 2) + Math.pow( this.y - obj.y, 2) < Math.pow(this.range + obj.range, 2)){
            this.Lp -= obj.Ap
            this.damageFlag = true
            if(obj.collision_callback)obj.collision_callback()
            if (this.Lp <= 0) {
                this.delete()
                this.createDamageEffect()
            }
        }
    }
    /*public check_collision_beam(x: number, y: number, angle: number, thick: number) {
        if(!this.muteki_flag
            && Math.pow( this.x - obj.x, 2) + Math.pow( this.y - obj.y, 2) < Math.pow(this.range + obj.range, 2)){
            this.Lp -= obj.Ap
            this.damageFlag = true
            if(obj.collision_callback)obj.collision_callback()
            if (this.Lp <= 0) {
                this.delete()
                this.createDamageEffect()
            }
        }
    }*/
    public itemobj_collision(obj: Obj) {
        if(Math.pow( this.x - obj.x, 2) + Math.pow( this.y - obj.y, 2) < Math.pow(this.range + obj.range, 2)){
            if(obj.collision_callback)obj.collision_callback()
        }
    }
    protected delete() {
        if(this.delete_callback)this.delete_callback()
        this.flag = false
    }
    protected adjustPosition(){
        this.x = Math.min(Math.max(0, this.x), WIDTH)
        this.y = Math.min(Math.max(0, this.y), HEIGHT)
    }
    public draw(){
        this.sprite.x = this.x
        this.sprite.y = this.y
    }
    public getWidth(){
        return this.sprite.width
    }
    public getHeight(){
        return this.sprite.height
    }
    public reset_damageFlag() {
        this.damageFlag = false
    }
    public createDamageEffect(sound = true) {
        const r = 10
        const n = 10
        for (let i = 0; i < n; i++) {
            Obj.effect_func("damage", this.x + 2 * Math.random() * r - r, this.y + 2 * Math.random() * r - r)
        }
        if(sound)Sound.play("damage", false, GlobalParam.se_volume)
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
    protected updatePlayerPosition() {
        Obj.px = this.x
        Obj.py = this.y
    }
    public calcAngleToPlayer() {
        return -Math.atan2(this.x - Obj.px, this.y - Obj.py)
    }
    public calcAngleToTarget(target: Obj) {
        if(!target)return this.is_enemy ? Math.PI : 0
        return -Math.atan2(this.x - target.x, this.y - target.y)
    }
    protected toRadian(angle: number) {
        return angle * Math.PI / 180
    }
    public getLp() {
        return this.Lp
    }
    public static getPlayerX() {
        return Obj.px
    }
    public static getPlayerY() {
        return Obj.py
    }
    public Is_Enemy() {
        return this.is_enemy
    }
    public getX() {
        return this.x
    }
    public getY() {
        return this.y
    }
}