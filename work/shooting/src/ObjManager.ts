import * as PIXI from 'pixi.js'
import {Obj} from './Obj'
import {Player} from './Player'
import { P_Straight, Straight, FirstSlow} from './Bullet'
import {WIDTH, HEIGHT} from './global'
import {Enemy, Enemy_A} from './Enemy'
import {Stage}from './Stage'
export class ObjManager{
    stage: Stage
    player: Player[] = []
    player_bullet: any[] = []
    enemy: any[] = []
    enemy_bullet: any[] = []
    constructor(container : PIXI.Container){
        this.stage = new Stage()
        Obj.SetGlobalContainer(container)
        Obj.SetCreateFunc(this.CreateObj, this.CreateBullet)
    }
    private CreateObj = (name: string, x: number, y: number, is_enemy: boolean)=>{
        let target
        if(!is_enemy)target = this.player
        else target = this.enemy
        target.push(new {
            player: Player,
            enemy_A: Enemy_A,
        }[name](x,y,is_enemy))
    }
    private CreateBullet = (name: string, x: number, y: number, color: string, angle: number, speed: number, is_enemy: boolean)=>{
        let target
        if(!is_enemy)target = this.player_bullet
        else target = this.enemy_bullet
        let inst = new {
            p_straight: P_Straight,
            straight: Straight,
            first_slow: FirstSlow
        }[name](x,y,is_enemy, angle, speed, color)
        target.push(inst)
    }
    public update(){
        let target = [this.player, this.player_bullet, this.enemy, this.enemy_bullet]

        this.CreateObjectsFromStageData()

        target.forEach(n =>{
            n.forEach(n => n.update())
        })
        this.player.forEach(n =>{
            this.enemy_bullet.forEach(n2 => n.check_collision(n2))
        })
        this.enemy.forEach(n =>{
            this.player_bullet.forEach(n2 => n.check_collision(n2))
        })
        this.player = this.player.filter(n => n.check_and_delete())
        this.player_bullet = this.player_bullet.filter(n => n.check_and_delete())
        this.enemy = this.enemy.filter(n => n.check_and_delete())
        this.enemy_bullet = this.enemy_bullet.filter(n => n.check_and_delete())
    }
    public draw(){
        let target = [this.player, this.player_bullet, this.enemy, this.enemy_bullet]
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
    private CreateObjectsFromStageData(){
        let data = this.stage.readStageData(this.enemy.length)
        if(data == undefined)return
        if(data === "end")return
        data.forEach(n => {
            this.CreateObj(n.name, n.param1, n.param2, true)
        })
    }
}