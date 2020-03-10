import {WIDTH, HEIGHT} from './global'
import {ObjManager} from './ObjManager'
export class Stage {
    private static data: any
    private offset: number = 0
    private sleepCount: number = 0
    private wait: boolean = false
    private objmanager: ObjManager
    constructor(){
        if(Stage.data)return
        const xhr = new XMLHttpRequest();
        xhr.open('GET', "asset/stage/stage.json", true);
        xhr.onreadystatechange = () => {
            if(xhr.readyState === 4 && xhr.status === 200){
                Stage.data = JSON.parse(xhr.responseText).stage
            }
        }
        setTimeout(() => xhr.send(null), 100)
    }
    public readStageData(enemy_num: number){
        let new_obj_data: any = []
        if(this.offset === Stage.data.length)return "end"
        if(this.sleepCount){
            this.sleepCount--
            return
        }
        while(this.offset !== Stage.data.length){
            switch(Stage.data[this.offset].name){
                case "sleep":
                    this.sleepCount = Stage.data[this.offset].param1
                    break
                case "wait":
                    break
                default:
                    new_obj_data.push(Stage.data[this.offset])
            }
            this.offset++
        }
        return new_obj_data
    }
}