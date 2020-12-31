import {Obj} from './Obj'
import {BOSS_DATA, BULLET_COLOR, GlobalParam, HEIGHT, WIDTH} from './global'
import { Sound } from './Sound'
import { GraphicManager } from './GraphicManager'
import { MyRand } from './BackGround'
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
        Obj.change_bullet_to_coin_func()
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
export class Boss_B extends Boss {
    readonly data: any = BOSS_DATA[1]
    private drone_count = 0
    private add_x: number = 0
    private temp_angle: number
    private drone: PIXI.Sprite[] = []
    readonly drone_num = 4
    readonly r = 60
    constructor(x: number, y: number, is_enemy: boolean) {
        super(BOSS_DATA[1].name, x, y, is_enemy)
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
        for (let i = 0; i < this.drone_num; i++) {
            this.drone[i].position.set(
                this.x + this.r * Math.cos(this.toRadian(this.drone_count + 360 / this.drone_num * i)),
                this.y + this.r * Math.sin(this.toRadian(this.drone_count + 360 / this.drone_num * i)))
        }
    }
    public update() {
        this.count++
        const w = WIDTH / 3
        this.drone_count++
        switch (this.state) {
            case 0:
                if (this.y < HEIGHT / 3) this.y += 2.0
                else if (this.y == HEIGHT / 3) this.y += 1.0, this.count = 0
                if (this.count >= 50 && this.count % 50 <= 20) {
                    if (this.count % 50 == 0) {
                        this.temp_angle = this.calcAngleToPlayer()
                    }
                    if (this.count % 10 == 0) {
                        for (let i = 0; i < 360; i += 24) {
                            this.CreateBullet("first_slow", this.x, this.y, "blue", this.temp_angle + this.toRadian(i), 8)
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
                if (this.count >= 50 && this.count % 50 <= 20) {
                    if (this.count % 10 == 0) {
                        for (let i = 0; i < this.drone_num; i++) {
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
                if (this.count >= 50) {
                    if (this.count % 10 == 0) {
                        for (let i = 0; i < this.drone_num; i++) {
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
                if (this.count >= 80) {
                    if (this.count % 5 == 0) {
                        for (let i = 0; i < this.drone_num; i++) {
                            let angle = Math.atan2(this.y - this.drone[i].y, this.x - this.drone[i].x)
                            this.CreateBullet("straight", this.drone[i].x, this.drone[i].y, "red",
                                this.toRadian(-90) + angle, (this.count % 20 / 40 + 1))
                            this.CreateBullet("straight", this.drone[i].x, this.drone[i].y, "red",
                                this.toRadian(-60) + angle, (this.count % 20 / 40 + 1))
                            this.CreateBullet("straight", this.drone[i].x, this.drone[i].y, "red",
                                this.toRadian(-120) + angle, (this.count % 20 / 40 + 1))
                        }
                    }
                }
        }
    }
}

export class Boss_C extends Boss{
    readonly data: any = BOSS_DATA[2]
    private drone_count = 0
    private add_x: number = 0
    private temp_angle: number
    private drone: PIXI.Sprite[] = []
    readonly drone_num = 5
    readonly r = 60
    constructor(x: number, y: number, is_enemy: boolean){
        super(BOSS_DATA[2].name, x, y, is_enemy)//enemy_A
        for (let i = 0; i < this.drone_num; i++)
            this.drone.push(GraphicManager.GetInstance().GetSprite("bullet", [BULLET_COLOR.indexOf("black")]))
        this.delete_callback = () => this.delete_drone()
        this.set_drones()
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
                this.x + this.r * Math.cos(this.toRadian(this.drone_count + 360 / this.drone_num * i)),
                this.y + this.r * Math.sin(this.toRadian(this.drone_count + 360 / this.drone_num * i)))
        }
    }
    public update() {
        this.count++
        const w = WIDTH / 3
        this.drone_count++
        switch (this.state) {
            case 0:
                this.update_drone()
                if (this.y < HEIGHT / 3) this.y += 2.0
                else if(this.y == HEIGHT / 3)this.y += 1.0, this.count = 0
                if(this.y >= HEIGHT / 3 && this.count % 50 >= 30){
                    if (this.count % 10 == 0) {
                        for (let i2 = 0; i2 < this.drone_num; i2++) {
                            let angle = Math.atan2(this.y - this.drone[i2].y, this.x - this.drone[i2].x)
                            for (let i = -30; i <= 30; i += 20) {
                                this.CreateBullet("straight", this.drone[i2].x, this.drone[i2].y, "blue", angle + this.toRadian(i), 3 + Math.floor(this.count % 30 / 10))
                            }
                        }
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                    this.y = HEIGHT / 3
                    this.add_x = 1
                }
                break
            case 1:
                this.update_drone()
                if(this.count >= 50){
                    if (this.count % 100 == 0) {
                        this.CreateBeam(this.SearchTarget(),this, 0, 0, 0x5050ff, false, 40, 30)
                    }
                    if (this.count % 30 == 0) {
                        for (let i2 = 0; i2 < this.drone_num; i2++) {
                            let angle = Math.atan2(this.y - this.drone[i2].y, this.x - this.drone[i2].x)
                            for (let i = -10; i <= 10; i += 10) {
                                this.CreateBullet("first_slow", this.drone[i2].x, this.drone[i2].y, "blue", angle + this.toRadian(i), 3 + Math.floor(this.count % 30 / 10))
                            }
                        }
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                    this.add_x = 1
                }
                break
            case 2:
                this.update_drone()
                if (this.x >= WIDTH / 2 + w) this.add_x = -1.2
                else if (this.x <= WIDTH / 2 - w) this.add_x = 1.2
                this.x += this.add_x
                if(this.count >= 50){
                    if (this.count % 15 == 0) {
                        for (let i = 0; i < this.drone_num; i++){
                            let angle = Math.atan2(this.y - this.drone[i].y, this.x - this.drone[i].x)
                            this.CreateBullet("straight", this.drone[i].x, this.drone[i].y, "red",
                                this.toRadian(-90) + angle, this.count % 30 / 10 + 2)
                        }
                    }
                }
                if (this.count % 100 == 0) {
                    this.CreateBeam(this.SearchTarget(), this, 0, 0, 0x5050ff, false, 40, 30)
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                }
                break
            case 3:
                this.update_drone()
                if(this.count >= 50){
                    if (this.count % 5 == 0) {
                        for (let i = 0; i < this.drone_num; i++){
                            let angle = Math.atan2(this.y - this.drone[i].y, this.x - this.drone[i].x)
                            this.CreateBullet("last_slow", this.drone[i].x, this.drone[i].y, "red",
                                this.toRadian(-90 + this.count / 10 % 5 - 2) + angle, this.count % 20 / 60 + 0.5)
                            this.CreateBullet("last_slow", this.drone[i].x, this.drone[i].y, "red",
                                this.toRadian(-60 + this.count / 10 % 5 - 2) + angle, this.count % 20 / 60 + 0.5)
                            this.CreateBullet("last_slow", this.drone[i].x, this.drone[i].y, "red",
                                this.toRadian(-120 + this.count / 10 % 5 - 2) + angle, this.count % 20 / 60 + 0.5)
                        }
                    }
                }
        }
    }
}

export class Boss_D extends Boss{
    readonly data: any = BOSS_DATA[3]
    private drone_count = 0
    private add_x: number = 0
    private drone: PIXI.Sprite[] = []
    readonly drone_num = 6
    private r = 60
    constructor(x: number, y: number, is_enemy: boolean){
        super("boss_D", x, y, is_enemy)//enemy_A
        for (let i = 0; i < this.drone_num; i++)
            this.drone.push(GraphicManager.GetInstance().GetSprite("bullet", [BULLET_COLOR.indexOf("black")]))
        this.delete_callback = () => this.delete_drone()
        this.set_drones()
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
                this.x + this.r * Math.cos(this.toRadian(this.drone_count * 1.5 + 360 / this.drone_num * i)),
                this.y + this.r * Math.sin(this.toRadian(this.drone_count * 1.5 + 360 / this.drone_num * i)))
        }
    }
    public update() {
        this.count++
        const w = WIDTH / 3
        this.drone_count++
        switch (this.state) {
            case 0:
                this.update_drone()
                if (this.y < HEIGHT / 3) this.y += 2.0
                else if(this.y == HEIGHT / 3)this.y += 1.0, this.count = 0
                if(this.y >= HEIGHT / 3){
                    if (this.count % 3 == 0 && this.count % 90 < 60) {
                        for (let i = 0; i < this.drone_num; i++){
                            let angle = Math.atan2(this.y - this.drone[i].y, this.x - this.drone[i].x)
                            this.CreateBullet("straight", this.drone[i].x, this.drone[i].y, "l_blue",
                                this.toRadian(-60 - this.count % 9 * 10) + angle, this.count % 20 / 20 + 1, 0.5)
                        }
                    }
                    if (this.count % 30 == 10) {
                        for (let i = 0; i < 360; i += 24) {
                            this.CreateBullet("straight", this.x, this.y, "blue", this.toRadian(i))
                        }
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                    this.y = HEIGHT / 3
                    this.add_x = 1
                }
                break
            case 1:
                this.update_drone()
                if(this.count >= 80){
                    if (this.count % 7 == 0) {
                        for (let i2 = 0; i2 < this.drone_num; i2++) {
                            let angle = Math.atan2(this.y - this.drone[i2].y, this.x - this.drone[i2].x)
                            this.CreateBullet("straight", this.drone[i2].x, this.drone[i2].y, "blue",
                                angle, 2 + this.count % 28 / 10)
                        }
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                    this.drone_count = 0
                }
                break
            case 2:
                this.update_drone()
                if (this.r < 120) this.r++
                else {
                    this.drone_count += 6.5
                    if (this.count % 2) {
                        for (let i2 = 0; i2 < this.drone_num; i2++) {
                            let angle = Math.atan2(this.y - this.drone[i2].y, this.x - this.drone[i2].x)
                            this.CreateBullet("straight", this.drone[i2].x, this.drone[i2].y, "blue",
                                angle, 3)
                            this.CreateBullet("straight", this.drone[i2].x, this.drone[i2].y, "blue",
                                angle + this.toRadian(180), 3)
                        }
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                    this.add_x = 1.5
                }
                break
            case 3:
                this.update_drone()
                if (this.x >= WIDTH / 2 + w) this.add_x = -1.5
                else if (this.x <= WIDTH / 2 - w) this.add_x = 1.5
                this.x += this.add_x
                if(this.count >= 100){
                    if (this.count % 10 == 0 && this.count % 100 < 30) {
                        for (let i = 0; i < 360; i += 30){
                            let t = this.count % 15 / 5
                            this.CreateBullet("straight", this.drone[t].x, this.drone[t].y, "red", this.toRadian(i + this.count), 1, this.count % 200 == 0 ? 1 : 0.5)
                            this.CreateBullet("straight", this.drone[t + 3].x, this.drone[t + 3].y, "red", this.toRadian(i + this.count), 1, this.count % 200 == 0 ? 1 : 0.5)
                        }
                    }
                    if(this.count % 100 == 0)this.CreateBeam(undefined, this, 0, 0, 0x995599, false, 30, 30)
                }
        }
    }
}
export class Boss_E extends Boss{
    readonly data: any = BOSS_DATA[4]
    private drone_count = 0
    private add_x: number = 0
    private drone: PIXI.Sprite[] = []
    readonly drone_num = 8
    private r = 0
    private temp_angle
    private pos_x = [WIDTH / 2, 233, 207, 126, 166,250, 330, 426, 390]
    private pos_y = [HEIGHT / 3, 184, 98, 126, 35, 35, 86, 178, 100]
    private rand: MyRand
    constructor(x: number, y: number, is_enemy: boolean){
        super("boss_E", x, y, is_enemy)//enemy_A
        for (let i = 0; i < this.drone_num; i++)
            this.drone.push(GraphicManager.GetInstance().GetSprite("bullet", [BULLET_COLOR.indexOf("black")]))
        this.rand = new MyRand(5)
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
                this.x + this.r * Math.cos(this.toRadian(this.drone_count * 2 + 360 / this.drone_num * i)),
                this.y + this.r * Math.sin(this.toRadian(this.drone_count * 2 + 360 / this.drone_num * i)))
        }
    }
    public update() {
        this.count++
        const w = WIDTH / 3
        this.drone_count++
        switch (this.state) {
            case 0:
                if (this.y < HEIGHT / 3) this.y += 2.0
                else if(this.y == HEIGHT / 3)this.y += 1.0, this.count = 0
                if(this.y >= HEIGHT / 3){
                    if (this.count % 30 == 10) {
                        for (let i = 0; i < 360; i += 10) {
                            this.CreateBullet("straight", this.x, this.y, "blue", this.toRadian(i), 2, 0.5)
                        }
                    }
                    if (this.count % 50 == 49) {
                        let angle = this.calcAngleToTarget(this.SearchTarget())
                        for (let i = 0; i < 360; i += 10) {
                            this.CreateBullet("straight", this.x, this.y, "blue", this.toRadian(i) + angle, 3)
                        }
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                    this.y = HEIGHT / 3
                    this.add_x = 1
                }
                break
            case 1:
                const dx = [0, -30, 0, 40, -30, 20]
                const dy = [0, 10, -40, 10, -20, 0]
                if (this.count % 150 == 100 || this.count % 150 == 110) {
                    let angle = this.calcAngleToTarget(this.SearchTarget())
                    let p = Math.floor(this.count / 150) % dx.length
                    for (let i = 0; i < 360; i += 8) {
                        this.CreateBullet("reflect", this.x + dx[p], this.y + dy[p], "cyan", this.toRadian(i) + angle, 2, 0.5)
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                }
                break
            case 2:
                if (this.count >= 50) {
                    if (this.count % 24 == 0) {
                        let angle = this.calcAngleToTarget(this.SearchTarget())
                        for (let i = 0; i < 360; i += 10) {
                            this.CreateBullet("straight", this.x, this.y, "l_blue", this.toRadian(i) + angle, 4, 0.7)
                        }
                    }
                    if (this.count % 24 == 12) {
                        let angle = this.calcAngleToTarget(this.SearchTarget())
                        for (let i = 0; i < 360; i += 10) {
                            this.CreateBullet("straight", this.x, this.y, "blue", this.toRadian(i) + angle, 4, 0.7)
                        }
                    }
                }
                if (this.count > 150) {
                    let c = this.count - 150
                    let p = Math.floor(c / 150) % this.pos_x.length
                    let p2 = (p + 1) % this.pos_x.length
                    let r = Math.min(Math.max((c % 150 / 150) * 1.5 - 0.25, 0), 1)
                    this.x = this.pos_x[p] * (1 - r) + this.pos_x[p2] * r
                    this.y = this.pos_y[p] * (1 - r) + this.pos_y[p2] * r
                }

                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                }
                break
            case 3:
                if (this.count < 50) {
                    this.x += (WIDTH / 2 - this.x) / (50 - this.count)
                    this.y += (HEIGHT / 3 - this.y) / (50 - this.count)
                }
                if (this.count >= 250 && this.count % 20 == 0) {
                    for (let i = 0; i < 360; i += 10){
                        this.CreateBullet("straight", this.x, this.y, "blue", this.toRadian(i + this.count % 20 / 2), 3, 1.5)
                    }
                }
                else if (this.count >= 50 && this.count % 10 == 0) {
                    for (let i = 0; i < 360; i += 10){
                        this.CreateBullet("straight", this.x, this.y, "l_blue", this.toRadian(i + this.count % 20 / 2), 3, 0.5)
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                }
                break
            case 4:
                if (this.count == 60) {
                    for (let i = 0; i < 360; i += 15) {
                        this.CreateBullet("straight", this.x, this.y, "red", this.toRadian(i), 7, 5)
                        this.CreateBullet("straight", this.x, this.y, "red", this.toRadian(i), 10, 3)
                    }
                }
                if (this.count >= 120) {
                    if (this.count % 30 == 0) {
                        this.temp_angle = this.calcAngleToTarget(this.SearchTarget())
                        for (let i = 0; i < 360; i += 20) {
                            this.CreateBullet("first_slow", this.x, this.y, "blue", this.toRadian(i) + this.temp_angle, 10)
                        }
                    }
                    if (this.count % 3 == 0) {
                        for (let i = 0; i < 360; i += 60) {
                            this.CreateBullet("first_slow", this.x, this.y, "l_blue", this.toRadian(i + (this.count % 30 < 15 ? 0 : 30)) + this.temp_angle, 5, 0.8)
                        }
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                }
                break
            case 5:
                if(this.r == 0)this.set_drones()
                this.update_drone()
                if (this.r < 60) this.r++, this.count = 0, this.add_x = 2
                else {
                    if (this.x >= WIDTH / 2 + w) this.add_x = -2
                    else if (this.x <= WIDTH / 2 - w) this.add_x = 2
                    this.x += this.add_x
                    if (this.count % 30 == 0) {
                        for (let i = 0; i < this.drone_num; i++){
                            let target = this.SearchTarget()
                            if (!target) break
                            let angle = -Math.atan2(this.drone[i].x - target.getX(), this.drone[i].y - target.getY())
                            this.CreateBullet("straight", this.drone[i].x, this.drone[i].y, "blue", angle, 8, 0.4)
                        }
                    }
                    if (this.count % 5 == 0 && this.count % 200 > 150) {
                        for (let i = 0; i < this.drone_num; i++){
                            let target = this.SearchTarget()
                            if (!target) break
                            let angle = -Math.atan2(this.drone[i].x - target.getX(), this.drone[i].y - target.getY())
                            this.CreateBullet("straight", this.drone[i].x, this.drone[i].y, "blue", angle, 6, 0.8)
                            this.CreateBullet("straight", this.drone[i].x, this.drone[i].y, "l_blue", angle, 8, 0.4)
                        }
                    }
                }
                if (this.getLp() <= this.data.Lp_border[this.state]) {
                    this.next_form()
                    this.delete_drone()
                }
                break
            case 6:
                if (this.count < 50) {
                    this.x += (WIDTH / 2 - this.x) / (50 - this.count)
                    this.y += (HEIGHT / 3 - this.y) / (50 - this.count)
                }
                else if(this.count < 250){
                    let y = 0
                    const time = 200
                    const l_time = 50
                    let c = this.count - 50
                    if (y < HEIGHT && c % 10 == 0) {
                        let target = this.SearchTarget()
                        if (!target) return
                        let angle
                        if (c % time < l_time) {
                            angle = this.toRadian(90)
                            for (let i = 0; i < HEIGHT; i += 20) {
                                this.CreateBullet("missile", 0, y + i, "", angle, 20, 2.2)
                            }
                        }
                        else if(c % time >= time / 2 && c % time < time / 2 + l_time){
                            angle = this.toRadian(270)
                            for (let i = 0; i < HEIGHT; i += 20) {
                                this.CreateBullet("missile", WIDTH, y + i, "", angle, 20, 2.2)
                            }
                        }
                    }
                }
                else if (this.count <= 400) {
                    if (this.count % 30 == 0) {
                        const beam_r = this.count - 200
                        for (let i = 0; i < 360; i += 30){
                            this.CreateBeam(this.SearchTarget(),this, beam_r * Math.cos(this.toRadian(i)), beam_r * Math.sin(this.toRadian(i)), 0x33ffff, false, 30, 20)
                        }
                        Sound.play("beam", false, GlobalParam.se_volume)
                    }
                }
                else if(this.count % 300 <= 200){
                    if (this.count % 15 == 0) {
                        for (let i = 0; i < 360; i += 10) {
                            this.CreateBullet("first_slow", this.x, this.y, "cyan", this.toRadian(i), 5, 0.6)
                        }
                    }
                    if (this.count % 15 == 5) {
                        for (let i = 0; i < 360; i += 10) {
                            this.CreateBullet("first_slow", this.x + 24, this.y + 18, "cyan", this.toRadian(i), 5, 0.6)
                        }
                    }
                    if (this.count % 15 == 10) {
                        for (let i = 0; i < 360; i += 10) {
                            this.CreateBullet("first_slow", this.x - 18, this.y + 24, "cyan", this.toRadian(i), 5, 0.6)
                        }
                    }
                }
                else if (this.count % 300 >= 250 && this.count % 20 == 0) {
                    for (let i = 0; i < 360; i += 10) {
                        this.CreateBullet("first_slow", this.x, this.y, "blue", this.calcAngleToTarget(this.SearchTarget()) + this.toRadian(i), 10, 2.5)
                    }
                }
                break
        }
    }
}