import * as PIXI from "pixi.js"
import { StageSelect } from "./StageSelect" 
import { Title } from './Title'
import {Game} from "./Game" 
import {Key} from './key'
import {SceneType, Scene} from './Scene'
import {Fade} from './Fade'
import {GraphicManager} from './GraphicManager'
import { CreateStageTool } from "./CreateStageTool"
import { ENEMY_DATA, BOSS_DATA, ITEMOBJ_DATA, load } from './global'
import { Sound } from './Sound'
import { ScoreBoard } from "./ScoreBoard"
import { Upgrade } from "./Upgrade"
import { Explainment } from "./Explainment"
export class SceneManager{
    private key: Key
    private static instance: SceneManager
    private sceneName : SceneType[] = []
    private scene
    private constructor(private container: PIXI.Container){
        Scene.SetGotoSceneFunction((v) => this.gotoScene(v), this.exitCurrentScene)
        const inst = GraphicManager.GetInstance()
        ENEMY_DATA.forEach(n => inst.loadGraphic(n.name))
        BOSS_DATA.forEach(n => inst.loadGraphic(n.name))
        ITEMOBJ_DATA.forEach(n => inst.loadGraphic(n.name))
		inst.loadGraphic("player")
		inst.loadGraphic("bullet")
        inst.loadGraphic("pbullet")
        inst.loadGraphic("missile")
		Sound.load("sound\\stage1.mp3", "bgm")
		Sound.load("sound\\stage2.mp3", "bgm2")
		Sound.load("sound\\stage_clear.mp3", "clear")
		Sound.load("sound\\player_shot.mp3", "pshot")
        Sound.load("sound\\damage.mp3", "damage")
        Sound.load("sound\\decide.mp3", "decide")
        Sound.load("sound\\back.mp3", "back")
        Sound.load("sound\\score_increase.mp3", "increase")
        Sound.load("sound\\push_z_at_scoreboard.mp3", "push_z")
        Sound.load("sound\\game_over.mp3", "over")
        Sound.load("sound\\beam.mp3", "beam")
        Sound.load("sound\\fail.mp3", "fail")
        load()

        this.key = Key.GetInstance()
        this.key.key_register({code: ["KeyZ", "PadA"], name: "decide"})
        this.key.key_register({code: ["KeyX", "PadB"], name: "cancel"})
        this.key.key_register({code: ["ArrowUp", "PadUp"], name: "Up"})
        this.key.key_register({code: ["ArrowDown", "PadDown"], name: "Down"})
        this.key.key_register({code: ["ArrowLeft", "PadLeft"], name: "Left"})
        this.key.key_register({ code: ["ArrowRight", "PadRight"], name: "Right" })
        this.key.key_register({code: ["ShiftLeft", "PadLB", "PadLT"], name: "Brake"})
        this.gotoScene("title")
    }
    public static init(container: PIXI.Container)
    {
        if (!this.instance)
            this.instance = new SceneManager(container);
        return this.instance;
    }
    private exitCurrentScene = ()=> {
        this.sceneName.pop()
    }
    private gotoScene(name: SceneType){
        if(name === "back"){
            name = this.sceneName.pop()
            if(this.sceneName.length > 0)name = this.sceneName.pop()
        }
        this.sceneName.push(name)
        if(this.scene){
            if(this.scene.release !== undefined)this.scene.release()
            delete this.scene
        }
        const fade = new Fade(this.container, ()=>{
            this.container.removeChildren()
            this.scene = new {
                title: Title,
                stage_select: StageSelect,
                game: Game,
                make_stage: CreateStageTool,
                scoreBoard: ScoreBoard,
                upgrade: Upgrade,
                stageSelect: StageSelect,
                explainment: Explainment,
            }[name](this.container)
        })
    }
}