import {Obj} from './Obj'
import {BOSS_DATA, BULLET_COLOR, GlobalParam, HEIGHT, WIDTH} from './global'
import { Sound } from './Sound'
import { GraphicManager } from './GraphicManager'
export class Boss extends Obj{
    protected count = 0
    protected state: number = 0
    constructor(spriteName: string, x: number, y: number, is_enemy: boolean){
        super(spriteName, x, y, is_enemy)
        let index: number = -1
        for (let i = 0; i < BOSS_DATA.length; i++){
            if (BOSS_DATA[i].name == spriteName) {
                index = i;
                break;
            }
        }
        if(index == -1)return
        this.delete_callback = () => {
            this.CreateScore(BOSS_DATA[index].score, this.x, this.y)
            console.log("score:" + BOSS_DATA[index].score)
            Obj.change_bullet_to_coin_func()
        }
    }
    protected next_form() {
        this.state++
        this.count = 0
        this.createDamageEffect()
    }
}
export class Boss_A extends Boss{
    readonly data: any = BOSS_DATA[0]
    private add_x: number = 0
    private temp_angle: number
    constructor(x: number, y: number, is_enemy: boolean){
        super(BOSS_DATA[0].name, x, y, is_enemy)//enemy_A
    }
    public update() {
        this.count++
        const w = WIDTH / 3
        switch (this.state) {
            case 0:
                if (this.y <= HEIGHT / 3) this.y += 1.0
                else if(this.count % 50 <= 20){
                    if (this.count % 50 == 0) {
                        this.temp_angle = this.calcAngleToPlayer()
                    }
                    if(this.count % 10 == 0){
                        this.CreateBullet("straight", this.x, this.y, "blue", this.temp_angle, 3)
                        this.CreateBullet("straight", this.x, this.y, "blue", this.temp_angle + this.toRadian(30), 3)
                        this.CreateBullet("straight", this.x, this.y, "blue", this.temp_angle - this.toRadian(30), 3)
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                    this.y = HEIGHT / 3
                    this.add_x = 1
                }
                break
            case 1:
                if (this.x >= WIDTH / 2 + w) this.add_x = -1
                else if (this.x <= WIDTH / 2 - w) this.add_x = 1
                this.x += this.add_x
                if (this.count % 120 == 0) {
                    for (let i = 0; i <= 360; i += 30){
                        this.CreateBullet("straight", this.x, this.y, "blue",
                            this.toRadian(i + this.count % 50), 2)
                    }
                }
                if (this.count % 120 == 60) {
                    for (let i = 0; i <= 360; i += 30){
                        this.CreateBullet("straight", this.x, this.y, "red",
                            this.toRadian(i + this.count % 50), 2)
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                }
                break
            case 2:
                if (this.x >= WIDTH / 2 + w) this.add_x = -1.2
                else if (this.x <= WIDTH / 2 - w) this.add_x = 1.2
                this.x += this.add_x
                if (this.count % 10 == 0) {
                    this.CreateBullet("straight", this.x, this.y, "blue",
                        Math.random() * 2 * Math.PI, 1 + Math.random() * 2)
                }
                if (this.count % 10 == 5) {
                    this.CreateBullet("straight", this.x, this.y, "red",
                        Math.random() * 2 * Math.PI, 1 + Math.random() * 2)
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                }
                break
            case 3:
                if (this.count % 50 == 20) {
                    this.temp_angle = this.calcAngleToPlayer()
                }
                if (this.count % 50 >= 30) {
                    if(this.count % 50 == 30)Sound.play("beam", false, GlobalParam.se_volume)
                    this.CreateBullet("straight", this.x, this.y, "orange", this.temp_angle, 5)
                }
        }
    }
}
export class Boss_B extends Boss{
    readonly data: any = BOSS_DATA[1]
    private add_x: number = 0
    private temp_angle: number
    constructor(x: number, y: number, is_enemy: boolean){
        super(BOSS_DATA[1].name, x, y, is_enemy)//enemy_A
    }
    public update() {
        this.count++
        const w = WIDTH / 3
        switch (this.state) {
            case 0:
                if (this.y < HEIGHT / 3) this.y += 1.0
                else if(this.y == HEIGHT / 3)this.y += 1.0, this.count = 0
                else if(this.count % 50 <= 24){
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
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                    this.y = HEIGHT / 3
                    this.add_x = 1.2
                }
                break
            case 1:
                if (this.x >= WIDTH / 2 + w) this.add_x = -1.2
                else if (this.x <= WIDTH / 2 - w) this.add_x = 1.2
                this.x += this.add_x
                if(this.count >= 50 && this.count % 50 <= 20){
                    if (this.count % 50 == 0) {
                        this.temp_angle = this.calcAngleToPlayer()
                    }
                    if(this.count % 10 == 0){
                        this.CreateBullet("first_slow", this.x, this.y, "blue", this.temp_angle, 4)
                        this.CreateBullet("first_slow", this.x, this.y, "blue", this.temp_angle + this.toRadian(30), 4)
                        this.CreateBullet("first_slow", this.x, this.y, "blue", this.temp_angle - this.toRadian(30), 4)
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                }
                break
            case 2:
                if (this.x >= WIDTH / 2 + w) this.add_x = -1.2
                else if (this.x <= WIDTH / 2 - w) this.add_x = 1.2
                this.x += this.add_x
                if (this.count % 10 == 0) {
                    this.CreateBullet("first_slow", this.x, this.y, "blue",
                        Math.random() * 2 * Math.PI, 1 + Math.random() * 3)
                }
                if (this.count % 10 == 5) {
                    this.CreateBullet("straight", this.x, this.y, "red",
                        Math.random() * 2 * Math.PI, 1 + Math.random() * 3)
                }
                if (this.count % 120 == 0) {
                    for (let i = 0; i <= 360; i += 30){
                        this.CreateBullet("straight", this.x, this.y, "blue",
                            this.toRadian(i + this.count % 50), 2)
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                }
                break
            case 3:
                if(this.count >= 50 && this.count % 50 <= 20){
                    if (this.count % 50 == 0) {
                        this.temp_angle = this.calcAngleToPlayer()
                    }
                    if (this.count % 10 == 0) {
                        for (let i = 0; i < 360; i += 24) {
                            this.CreateBullet("first_slow", this.x, this.y, "blue", this.temp_angle + this.toRadian(i), 8)
                        }
                    }
                }
        }
    }
}

export class Boss_C extends Boss{
    readonly data: any = BOSS_DATA[2]
    private add_x: number = 0
    private temp_angle: number
    private drone: PIXI.Sprite[] = []
    readonly drone_num = 4
    readonly r = 60
    constructor(x: number, y: number, is_enemy: boolean){
        super(BOSS_DATA[2].name, x, y, is_enemy)//enemy_A
        for (let i = 0; i < this.drone_num; i++)
            this.drone.push(GraphicManager.GetInstance().GetSprite("bullet", [BULLET_COLOR.indexOf("black")]))
        this.delete_callback = () => this.delete_drone()
    }
    private set_drones() {
        this.drone.forEach(n => Obj.container.addChild(n))
        this.update_drone()
    }
    private delete_drone() {
        this.drone.forEach(n => Obj.container.removeChild(n))
    }
    private update_drone() {
        for (let i = 0; i < this.drone_num; i++){
            this.drone[i].position.set(
                this.x + this.r * Math.cos(this.toRadian(this.count + 360 / this.drone_num * i)),
                this.y + this.r * Math.sin(this.toRadian(this.count + 360 / this.drone_num * i)))
        }
    }
    public update() {
        this.count++
        const w = WIDTH / 3
        switch (this.state) {
            case 0:
                if (this.y < HEIGHT / 3) this.y += 2.0
                else if(this.y == HEIGHT / 3)this.y += 1.0, this.count = 0
                if (this.count % 50 == 0) {
                    this.temp_angle = this.calcAngleToPlayer()
                    for (let i = 0; i < 360; i += 24) {
                        for (let i2 = 2; i2 <= 4; i2++) {
                            this.CreateBullet("straight", this.x, this.y, "blue",
                                this.temp_angle + this.toRadian((i)), i2)
                        }
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                    this.y = HEIGHT / 3
                    this.add_x = 1
                    this.set_drones()
                }
                break
            case 1:
                this.update_drone()
                if (this.x >= WIDTH / 2 + w) this.add_x = -1.2
                else if (this.x <= WIDTH / 2 - w) this.add_x = 1.2
                this.x += this.add_x
                if(this.count >= 50 && this.count % 50 <= 20){
                    if (this.count % 10 == 0) {
                        for (let i = 0; i < this.drone_num; i++){
                            let angle = Math.atan2(this.y - this.drone[i].y, this.x - this.drone[i].x)
                            this.CreateBullet("straight", this.drone[i].x, this.drone[i].y, "red",
                                this.toRadian(-90) + angle)
                        }
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                }
                break
            case 2:
                this.update_drone()
                if (this.x >= WIDTH / 2 + w) this.add_x = -1.2
                else if (this.x <= WIDTH / 2 - w) this.add_x = 1.2
                this.x += this.add_x
                if(this.count >= 50){
                    if (this.count % 10 == 0) {
                        for (let i = 0; i < this.drone_num; i++){
                            let angle = Math.atan2(this.y - this.drone[i].y, this.x - this.drone[i].x)
                            this.CreateBullet("straight", this.drone[i].x, this.drone[i].y, "red",
                                this.toRadian(-90) + angle, this.count % 30 / 10 + 1)
                        }
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                }
                break
            case 3:
                this.update_drone()
                if(this.count >= 50){
                    if (this.count % 10 == 0) {
                        for (let i = 0; i < this.drone_num; i++){
                            let angle = Math.atan2(this.y - this.drone[i].y, this.x - this.drone[i].x)
                            this.CreateBullet("first_slow", this.drone[i].x, this.drone[i].y, "red",
                                this.toRadian(-90) + angle, this.count % 30 + 10)
                        }
                    }
                }
        }
    }
}
export class Boss_D extends Boss{
    readonly data: any = BOSS_DATA[3]
    private add_x: number = 0
    private temp_angle: number
    private drone: PIXI.Sprite[] = []
    readonly drone_num = 4
    readonly r = 60
    constructor(x: number, y: number, is_enemy: boolean){
        super(BOSS_DATA[3].name, x, y, is_enemy)//enemy_A
        for (let i = 0; i < this.drone_num; i++)
            this.drone.push(GraphicManager.GetInstance().GetSprite("bullet", [BULLET_COLOR.indexOf("black")]))
        this.delete_callback = () => this.delete_drone()
    }
    private set_drones() {
        this.drone.forEach(n => Obj.container.addChild(n))
        this.update_drone()
    }
    private delete_drone() {
        this.drone.forEach(n => Obj.container.removeChild(n))
    }
    private update_drone() {
        for (let i = 0; i < this.drone_num; i++){
            this.drone[i].position.set(
                this.x + this.r * Math.cos(this.toRadian(this.count + 360 / this.drone_num * i)),
                this.y + this.r * Math.sin(this.toRadian(this.count + 360 / this.drone_num * i)))
        }
    }
    public update() {
        this.count++
        const w = WIDTH / 3
        switch (this.state) {
            case 0:
                if (this.y < HEIGHT / 3) this.y += 2.0
                else if(this.y == HEIGHT / 3)this.y += 1.0, this.count = 0
                if (this.count % 50 == 0) {
                    this.temp_angle = this.calcAngleToPlayer()
                    for (let i = 0; i < 360; i += 24) {
                        for (let i2 = 2; i2 <= 4; i2++) {
                            this.CreateBullet("straight", this.x, this.y, "blue",
                                this.temp_angle + this.toRadian((i)), i2)
                        }
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                    this.y = HEIGHT / 3
                    this.add_x = 1
                    this.set_drones()
                }
                break
            case 1:
                this.update_drone()
                if (this.x >= WIDTH / 2 + w) this.add_x = -1.2
                else if (this.x <= WIDTH / 2 - w) this.add_x = 1.2
                this.x += this.add_x
                if(this.count >= 50 && this.count % 50 <= 20){
                    if (this.count % 10 == 0) {
                        for (let i = 0; i < this.drone_num; i++){
                            let angle = Math.atan2(this.y - this.drone[i].y, this.x - this.drone[i].x)
                            this.CreateBullet("straight", this.drone[i].x, this.drone[i].y, "red",
                                this.toRadian(-90) + angle)
                        }
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                }
                break
            case 2:
                this.update_drone()
                if (this.x >= WIDTH / 2 + w) this.add_x = -1.2
                else if (this.x <= WIDTH / 2 - w) this.add_x = 1.2
                this.x += this.add_x
                if(this.count >= 50){
                    if (this.count % 10 == 0) {
                        for (let i = 0; i < this.drone_num; i++){
                            let angle = Math.atan2(this.y - this.drone[i].y, this.x - this.drone[i].x)
                            this.CreateBullet("straight", this.drone[i].x, this.drone[i].y, "red",
                                this.toRadian(-90) + angle, this.count % 30 / 10 + 1)
                        }
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                }
                break
            case 3:
                this.update_drone()
                if(this.count >= 50){
                    if (this.count % 10 == 0) {
                        for (let i = 0; i < this.drone_num; i++){
                            let angle = Math.atan2(this.y - this.drone[i].y, this.x - this.drone[i].x)
                            this.CreateBullet("first_slow", this.drone[i].x, this.drone[i].y, "red",
                                this.toRadian(-90) + angle, this.count % 30 + 10)
                        }
                    }
                }
        }
    }
}