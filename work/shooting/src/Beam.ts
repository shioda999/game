import * as PIXI from "pixi.js"
import {WIDTH, HEIGHT, ENEMY_DATA, GlobalParam} from './global'
import {GraphicManager} from './GraphicManager'
import {Key} from './key'
import { Sound } from "./Sound"
import { Obj } from "./Obj"
const length = Math.pow(WIDTH * WIDTH + HEIGHT * HEIGHT, 0.5)
export class Beam{
    private graph: PIXI.Graphics
    private count: number = 0
    private angle: number
    readonly omega = Math.PI / 300
    readonly rate = 1.5
    private deleteflag: boolean = false
    private beam: PIXI.Graphics[] = []
    constructor(private target: Obj, private root: Obj, private dx, private dy, private color: number, private time = 50, private thick = 10) {
        this.graph = new PIXI.Graphics()
        this.thick /= 2
        Obj.container.addChild(this.graph)
        this.angle = root.calcAngleToTarget(target)
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
    public update() {
        if(this.deleteflag)return
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
            Obj.container.removeChild(this.graph)
            if (this.count == this.time + 1)this.graph.destroy()
            this.graph = this.beam[this.count % 3 == 0 ? 1 : 0]
            Obj.container.addChild(this.graph)
            if(this.count == this.time + 20)this.delete()
        }
        this.angle = this.root.calcAngleToTarget(this.target)
        this.graph.position.set(this.root.getX() + this.dx, this.root.getY() + this.dy)
        this.graph.rotation = this.angle
        this.count++
    }
    public delete() {
        this.deleteflag = true
        Obj.container.removeChild(this.graph)
        this.beam.forEach(n => n.destroy())
    }
    private check_collision() {
        
    }
}