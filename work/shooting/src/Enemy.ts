import {Obj} from './Obj'
export class Enemy extends Obj{
    protected count = 0
    constructor(spriteName: string, x: number, y: number, is_enemy: boolean){
        super(spriteName, x, y, is_enemy)
    }
}
export class Enemy_A extends Enemy{
    constructor(x: number, y: number, is_enemy: boolean){
        super("new_player", x, y, is_enemy)
    }
    public update(){
        this.count++
        if(this.count % 60 === 0){
            for(let i = 0; i < 60; i++)
                this.CreateBullet("straight", this.x, this.y, "orange", i * 6)
        }
        if(this.count % 60 === 30){
            for(let i = 0; i < 60; i++)
                this.CreateBullet("straight", this.x, this.y, "blue", i * 6)
        }
        this.count %= 400
        if(this.count <= 100 || this.count > 300)this.x += 1
        else this.x -= 1
    }
}