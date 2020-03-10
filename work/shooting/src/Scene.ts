import {ItemManager} from "./ItemManager"
import {WIDTH, HEIGHT} from './global'
export type SceneType = "title" | "levelSelect" | "stageSelect" |"game" | "result" | "option" | "back" | "make_stage"
export class Scene {
    private static func: (v: SceneType) => any
    protected release = undefined
    constructor() {}
    public static SetGotoSceneFunction(func: (v: SceneType) => any){
        this.func = func
    }
    public gotoScene(name: SceneType){
        if(this.release)this.release()
        Scene.func(name)
    }
}