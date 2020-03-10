import * as PIXI from "pixi.js"
import {Title} from "./Title" 
import {Game} from "./Game" 
import {Key} from './key'
import {SceneType, Scene} from './Scene'
import {Fade} from './Fade'
import {GraphicManager} from './GraphicManager'
import { CreateStageTool } from "./CreateStageTool"
export class SceneManager{
    private key: Key
    private static instance: SceneManager
    private sceneName : SceneType[] = []
    private scene
    private constructor(private container: PIXI.Container){
        Scene.SetGotoSceneFunction((v) => this.gotoScene(v))

        this.key = Key.GetInstance()
        this.key.key_register({code: ["r"], name: "r"})
        this.key.key_register({code: ["z", "PAD-A"], name: "decide"})
        this.key.key_register({code: ["x", "PAD-B"], name: "cancel"})
        this.key.key_register({code: ["ArrowUp", "PAD-UP"], name: "Up"})
        this.key.key_register({code: ["ArrowDown", "PAD-DOWN"], name: "Down"})
        this.key.key_register({code: ["ArrowLeft", "PAD-LEFT"], name: "Left"})
        this.key.key_register({code: ["ArrowRight", "PAD-RIGHT"], name: "Right"})
        this.gotoScene("title")
    }
    public static init(container: PIXI.Container)
    {
        if (!this.instance)
            this.instance = new SceneManager(container);
        return this.instance;
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
              game: Game,
              make_stage: CreateStageTool
            }[name](this.container)
        })
    }
}