import {ItemManager} from "./ItemManager"
import {WIDTH, HEIGHT} from './global'
export type SceneType = "title" | "levelSelect" | "stageSelect" |"game" | "result" | "option" | "back"
export class Scene {
    private static func: (v: SceneType) => any
    public item_manager: ItemManager
    constructor(x: number, y: number, w: number, h: number, container: PIXI.Container, decide: () => any, cancel: () => any) {
        this.item_manager = new ItemManager(x,y,w,h, container, decide, cancel)
    }
    public static SetGotoSceneFunction(func: (v: SceneType) => any){
        this.func = func
    }
    public gotoScene(name: SceneType){
        Scene.func(name)
    }
}