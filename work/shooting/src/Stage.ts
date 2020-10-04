import {WIDTH, HEIGHT, GlobalParam, STAGE_NUM} from './global'
import {ObjManager} from './ObjManager'
export class Stage {
    private static data: any[] = []
    private offset: number = 0
    private sleepCount: number = 0
    private wait: boolean = false
    private objmanager: ObjManager
    private xhr: any
    private loadedFlag = false
    constructor(){
        if(this.loadedFlag)return
        this.xhr = new XMLHttpRequest();
        Stage.data.length = STAGE_NUM + 1
        this.loadStageData(1)
    }
    private loadStageData(num: number) {
        if (num > STAGE_NUM) {
            this.loadedFlag = true
            return
        }
        this.xhr.open('GET', "asset/stage/stage" + num + ".json", true)
        this.xhr.onreadystatechange = () => {
            if (this.xhr.readyState === 4 && this.xhr.status === 200) {
                Stage.data[num] = (JSON.parse(this.xhr.responseText))
                this.loadStageData(num + 1)
            }
        }
        setTimeout(() => this.xhr.send(null), 10)
    }
    public readStageData(enemy_num: number){
        if (!this.loadedFlag) return
        let stage_data = Stage.data[GlobalParam.stage]
        let new_obj_data: any = []
        if(this.offset === stage_data.length)return "end"
        if(this.sleepCount > 0){
            this.sleepCount--
            return
        }
        while(this.offset !== stage_data.length){
            switch(stage_data[this.offset].name){
                case "sleep":
                    this.sleepCount = stage_data[this.offset].param
                    this.offset++
                    return new_obj_data
                case "waitLine":
                    if(enemy_num)return new_obj_data
                    break
                default:
                    enemy_num++
                    new_obj_data.push(stage_data[this.offset])
            }
            this.offset++
        }
        return new_obj_data
    }
}