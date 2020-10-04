import {Obj} from './Obj'
import {ENEMY_DATA, HEIGHT} from './global'
export class Enemy extends Obj{
    protected count = 0
    constructor(spriteName: string, x: number, y: number, is_enemy: boolean){
        super(spriteName, x, y, is_enemy)
        let index: number = -1
        for (let i = 0; i < ENEMY_DATA.length; i++){
            if (ENEMY_DATA[i].name == spriteName) {
                index = i;
                break;
            }
        }
        if(index == -1)return
        this.delete_callback = () => {
            this.CreateScore(ENEMY_DATA[index].score, this.x, this.y)
        }
    }
}
export class Enemy_A extends Enemy{
    constructor(x: number, y: number, is_enemy: boolean){
        super(ENEMY_DATA[0].name, x, y, is_enemy)//enemy_A
    }
    public update(){
        this.count++
        this.y += 1.5
    }
}
export class Enemy_B extends Enemy{
    constructor(x: number, y: number, is_enemy: boolean){
        super(ENEMY_DATA[1].name, x, y, is_enemy)//enemy_A
    }
    public update(){
        this.count++
        if(this.y < HEIGHT / 3)this.y += 2
        if (this.count % 100 == 0) {
            let angle = this.calcAngleToPlayer()
            this.CreateBullet("straight", this.x, this.y, "blue", angle)
            this.CreateBullet("straight", this.x, this.y, "blue", angle + this.toRadian(20))
            this.CreateBullet("straight", this.x, this.y, "blue", angle - this.toRadian(20))
        }
    }
}
export class Enemy_C extends Enemy{
    constructor(x: number, y: number, is_enemy: boolean){
        super(ENEMY_DATA[2].name, x, y, is_enemy)//enemy_A
    }
    public update(){
        this.count++
        if(this.y < HEIGHT / 3)this.y += 2
        if (this.count % 100 == 0) {
            const w = 20
            this.CreateBullet("straight", this.x + w, this.y, "blue", Math.PI)
            this.CreateBullet("straight", this.x - w, this.y, "blue", Math.PI)
        }
    }
}
export class Enemy_D extends Enemy{
    constructor(x: number, y: number, is_enemy: boolean){
        super(ENEMY_DATA[3].name, x, y, is_enemy)//enemy_A
    }
    public update(){
        this.count++
        if(this.count % 70 === 0){
            for(let i = 0; i < 10; i++)
                this.CreateBullet("straight", this.x, this.y, "blue", this.toRadian(i * 36 + this.count / 5))
        }
        if(this.count % 70 === 35){
            for(let i = 0; i < 10; i++)
                this.CreateBullet("straight", this.x, this.y, "blue", this.toRadian(i * 36 + this.count / 5))
        }
        this.count %= 400
        if(this.count <= 100 || this.count > 300)this.x += 1
        else this.x -= 1
        if(this.y < HEIGHT / 4)this.y++
    }
}
export class Enemy_E extends Enemy{
    constructor(x: number, y: number, is_enemy: boolean){
        super(ENEMY_DATA[4].name, x, y, is_enemy)//enemy_A
    }
    public update(){
        if (this.y < HEIGHT / 4) this.y += 2
        else {
            if (this.count % 100 < 30 && this.count % 10 == 0) {
                this.CreateBullet("missile", this.x, this.y, "", this.calcAngleToPlayer(), 5)
            }
            this.count++
            this.count %= 400
            if (this.count <= 100 || this.count > 300) this.x += 1
            else this.x -= 1
        }
    }
}
export class Enemy_F extends Enemy{
    private temp_angle: number
    constructor(x: number, y: number, is_enemy: boolean){
        super(ENEMY_DATA[5].name, x, y, is_enemy)//enemy_A
    }
    public update() {
        this.count++
        if (this.y < HEIGHT / 3) this.y += 3.0
        else if (this.y == HEIGHT / 3) this.y += 1.0, this.count = 0
        else if (this.count % 50 <= 24) {
            if (this.count % 50 == 0) {
                this.temp_angle = this.calcAngleToPlayer()
            }
            if (this.count % 4 == 0) {
                for (let i = 0; i <= this.count % 50 / 4; i++) {
                    this.CreateBullet("straight", this.x, this.y, "blue",
                        this.temp_angle + this.toRadian((i - this.count % 50 / 8) * 25), 2)
                }
            }
        }
    }
}