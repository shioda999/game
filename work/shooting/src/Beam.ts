import * as PIXI from "pixi.js"
import { WIDTH, HEIGHT, ENEMY_DATA, GlobalParam } from './global'
import { Obj } from "./Obj"
const length = Math.pow(WIDTH * WIDTH + HEIGHT * HEIGHT, 0.5)
export class Beam {
    private graph: PIXI.Graphics
    private count: number = 0
    private angle: number
    readonly omega = Math.PI / 300
    readonly rate = 1.5
    private deleteflag: boolean = false
    private beam: PIXI.Graphics[] = []
    private on = false
    constructor(private target: Obj, private root: Obj, private dx, private dy, private color: number, private auto_focus, private time, private thick) {
        this.graph = new PIXI.Graphics()
        this.thick /= 2
        Obj.container.addChild(this.graph)
        if (target) {
            let tx = this.target.getX()
            let ty = this.target.getY()
            this.angle = this.root.calcAngle(tx - this.dx, ty - this.dy)
        }
        else this.angle = this.root.calcAngleToTarget(target)
        this.CreateBeamGraphic()
    }
    private CreateBeamGraphic() {
        for (let _i = 0; _i < 2; _i++) {
            const beam = new PIXI.Graphics()
            beam.blendMode = PIXI.BLEND_MODES.ADD
            beam.beginFill(this.color, _i ? 1.0 : 0.5)
            for (let i = 0.1; i <= 1; i += 0.1) {
                let thick = this.thick * i
                beam.drawPolygon([0, 0, thick, -thick / this.rate,
                    thick, -length, -thick, -length, -thick, -thick / this.rate])
            }
            beam.endFill()
            this.beam.push(beam)
        }
    }
    public update() { }
    public reset_damageFlag() { }
    public delete() {
        this.deleteflag = true
        Obj.container.removeChild(this.graph)
        this.beam.forEach(n => n.destroy())
    }
    private check_collision = (x: number, y: number, r: number) => {
        if (!this.on) return false
        let d = Math.abs(x + Math.tan(this.angle) * y - (this.root.getX() + this.dx) - (this.root.getY() + this.dy) * Math.tan(this.angle)) * Math.abs(Math.cos(this.angle))
        let t = (this.root.calcAngle(x - this.dx, y - this.dy) - this.angle) + 4 * Math.PI
        while (t > Math.PI) t -= Math.PI * 2
        return Math.atan(-this.rate) <= t && t <= Math.atan(this.rate) && d <= this.thick + r
    }
    private draw() {
        if (this.deleteflag) return
        if (this.count <= this.time) {
            this.graph.clear()
            this.graph.blendMode = PIXI.BLEND_MODES.NORMAL
            this.graph.lineStyle(1, 0xffffff, 0.5)
            let thick = this.thick * (this.time - this.count) / this.time
            this.graph.moveTo(0, 0)
            this.graph.lineTo(thick, -thick / this.rate)
            this.graph.lineTo(thick, -length)
            this.graph.moveTo(0, 0)
            this.graph.lineTo(-thick, -thick / this.rate)
            this.graph.lineTo(-thick, -length)
        }
        else {
            this.on = true
            Obj.container.removeChild(this.graph)
            if (this.count == this.time + 1) this.graph.destroy()
            this.graph = this.beam[this.count % 3 == 0 ? 1 : 0]
            Obj.container.addChild(this.graph)
            if (this.count == this.time + 20) {
                this.on = false
                this.delete()
                return
            }
        }
        if (this.auto_focus && this.target) {
            let tx = this.target.getX()
            let ty = this.target.getY()
            this.angle = this.root.calcAngle(tx - this.dx, ty - this.dy)
        }
        this.graph.position.set(this.root.getX() + this.dx, this.root.getY() + this.dy)
        this.graph.rotation = this.angle
        this.count++
    }
    public check_and_delete() {
        return !this.deleteflag
    }
}