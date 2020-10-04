import * as PIXI from 'pixi.js'
import {Obj} from './Obj'
import {Player} from './Player'
import { P_Straight, Straight, FirstSlow, LastSlow, Missile} from './Bullet'
import {WIDTH, HEIGHT} from './global'
import { Enemy, Enemy_A, Enemy_B, Enemy_C, Enemy_D, Enemy_E, Enemy_F } from './Enemy'
import {Effect, Damage, ShockWave} from './Effect'
import {Stage}from './Stage'
import { Coin1, Coin10 } from './ItemObj'
import { Boss_A, Boss_B, Boss_C } from './Boss'
export class ObjManager{
    stage: Stage
    player: Player[] = []
    player_bullet: any[] = []
    enemy: any[] = []
    enemy_bullet: any[] = []
    effects: any[] = []
    itemobj: any[] = []
    stage_clear_flag: boolean = false
    wait_count: number = 30
    constructor(container : PIXI.Container){
        this.stage = new Stage()
        Obj.SetGlobalContainer(container)
        Obj.SetCreateFunc(this.CreateObj, this.CreateBullet, this.CreateEffect, this.CreateItemObj,
        this.changeBulletToCoin, this.SearchTarget)
    }
    private CreateObj = (name: string, x: number, y: number, is_enemy: boolean)=>{
        let target
        if(!is_enemy)target = this.player
        else target = this.enemy
        target.push(new {
            player: Player,
            enemy_A: Enemy_A,
            enemy_B: Enemy_B,
            enemy_C: Enemy_C,
            enemy_D: Enemy_D,
            enemy_E: Enemy_E,
            enemy_F: Enemy_F,
            boss_A: Boss_A,
            boss_B: Boss_B,
            boss_C: Boss_C
        }[name](x,y,is_enemy))
    }
    private CreateBullet = (name: string, x: number, y: number, color: string, angle: number, speed: number, is_enemy: boolean)=>{
        let target
        if(!is_enemy)target = this.player_bullet
        else target = this.enemy_bullet
        let inst = new {
            p_straight: P_Straight,
            straight: Straight,
            first_slow: FirstSlow,
            last_slow: LastSlow,
            missile: Missile
        }[name](x,y,is_enemy, angle, speed, color)
        target.push(inst)
    }
    private CreateEffect = (name: string, x: number, y: number) => {
        let inst = new {
            damage: Damage,
            shockwave: ShockWave
        }[name](x,y)
        this.effects.push(inst)
    }
    private CreateItemObj = (name: string, x: number, y: number) => {
        let inst = new {
            coin1: Coin1,
            coin10: Coin10,
        }[name](x,y)
        this.itemobj.push(inst)
    }
    public update(){
        let target = [this.player, this.player_bullet, this.enemy, this.enemy_bullet, this.effects, this.itemobj]

        let r = this.CreateObjectsFromStageData()

        if (r == "end" && this.enemy.length == 0) {
            this.player.forEach(n => n.stage_flag = false)
            this.changeBulletToCoin()
            if(this.itemobj.length == 0){
                this.stage_clear_flag = true
            }
        }
        if(this.getPlayerLp() == 0)this.wait_count--

        target.forEach(n =>{
            n.forEach(n => { n.update(), n.reset_damageFlag() })
        })
        this.player.forEach(n =>{
            this.enemy_bullet.forEach(n2 => n.check_collision(n2))
        })
        this.player.forEach(n =>{
            this.enemy.forEach(n2 => n.check_collision(n2))
        })
        this.player.forEach(n =>{
            this.itemobj.forEach(n2 => n.itemobj_collision(n2))
        })
        this.enemy.forEach(n =>{
            this.player_bullet.forEach(n2 => n.check_collision(n2))
        })
        this.player = this.player.filter(n => n.check_and_delete())
        this.player_bullet = this.player_bullet.filter(n => n.check_and_delete())
        this.enemy = this.enemy.filter(n => n.check_and_delete())
        this.enemy_bullet = this.enemy_bullet.filter(n => n.check_and_delete())
        this.effects = this.effects.filter(n => n.check_and_delete())
        this.itemobj = this.itemobj.filter(n => n.check_and_delete())
    }
    public draw(){
        let target = [this.player, this.player_bullet, this.enemy, this.enemy_bullet, this.effects, this.itemobj]
        target.forEach(n =>{
            n.forEach(n => n.draw())
        })
    }
    public release(){
		delete this.player
    }
    public setPlayer(){
        this.CreateObj("player", WIDTH / 2, HEIGHT * 3 / 4, false)
    }
    public is_clear() {
        return this.stage_clear_flag
    }
    public is_gameover() {
        return this.wait_count <= 0
    }
    private CreateObjectsFromStageData(){
        let data = this.stage.readStageData(this.enemy.length)
        if(data == undefined)return
        if(data === "end")return "end"
        data.forEach(n => {
            console.log(n.name)
            this.CreateObj(n.name, n.param, -32, true)
        })
    }
    private changeBulletToCoin = ()=> {
        this.enemy_bullet.forEach(n => {
            this.CreateItemObj("coin1", n.x, n.y)
            n.delete()
        })
    }
    public getPlayerLp(): number {
        if(this.player.length == 0)return 0
        return this.player[0].getLp()
    }
    public continue() {
        if (this.player.length == 0) {
            this.CreateObj("player", Obj.getPlayerX(), Obj.getPlayerY(), false)
            this.player[0].muteki()
        }
        this.wait_count = 30
    }
    private SearchTarget = (obj: Obj) => {
        let targets = obj.Is_Enemy() ? this.player : this.enemy
        let target = 0
        let l = WIDTH * WIDTH + HEIGHT * HEIGHT
        targets.forEach(n => {
            let t = (obj.getX() - n.getX()) * (obj.getX() - n.getX()) + (obj.getY() - n.getY()) * (obj.getY() - n.getY())
            if(l > t)target = n, l = t
        })
        return target
    }
}