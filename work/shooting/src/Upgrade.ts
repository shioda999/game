import * as PIXI from "pixi.js"
import { Scene } from './Scene';
import { WIDTH, HEIGHT, GlobalParam, RAPID, RAPID_COST, SPEED, SPEED_COST, SIZE, SIZE_COST, SUB, SUB_COST, CHILD, CHILD_COST, save } from './global'
import { Key } from './key'
import { ItemManager } from './ItemManager';
import { GraphicManager } from './GraphicManager';
import { Sound } from "./Sound";

const sx = WIDTH / 24, sy = HEIGHT / 4
const item_w = WIDTH / 4
const item_h = HEIGHT / 13
const padding1 = 5
const padding2 = 20
const equip_box_w = WIDTH / 3.2
const equip_box_h = HEIGHT / 16
const select_sx = sx + item_w + equip_box_w + padding1 + padding2
const select_sy = sy
const headline_word_size = HEIGHT / 16
const equip_word_size = HEIGHT / 22
const cost_word_size = HEIGHT / 18
const message_word_size = HEIGHT / 35
const cost_sx = WIDTH * 0.93
const cost_sy = HEIGHT / 13
const explain_text_size = WIDTH / 40
const explain_text_sx = WIDTH / 2
const explain_text_sy = HEIGHT * 0.9

export class Upgrade extends Scene {
    private key: Key
    private loopID: any
    private item_manager: ItemManager
    private item: ItemManager[] = []
    private focussing_item: ItemManager
    private item_equipment: ItemManager
    private cost_container: PIXI.Container
    constructor(private container: PIXI.Container) {
        super()
        const player_sprite = GraphicManager.GetInstance().GetSprite("player")
        const text = new PIXI.Text("Z-keyで装備を変更, X-keyでキャンセル", new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontWeight: "bold",
            fontSize: explain_text_size,
            fill: 0xcccccc
        }))
        text.position.set(explain_text_sx, explain_text_sy)
        container.addChild(text)
        container.addChild(player_sprite)
        player_sprite.position.set(sx, sy / 2)
        player_sprite.anchor.set(0, 0.5)
        this.release = () => {
            clearInterval(this.loopID)
            container.removeChild(player_sprite)
        }
        this.item_manager = new ItemManager(sx, sy, item_w, item_h, container,
            () => this.decide(), () => this.cancel(), 0, 0)
        this.focussing_item = this.item_manager

        let item: ItemManager

        this.item_manager.appendItem("連射速度", headline_word_size, [0xf0f0f0, 0x999999], true)
        item = new ItemManager(select_sx, select_sy, equip_box_w, equip_box_h, container,
            () => this.decide2(), () => this.cancel2(), 0, 0, "decide", "back", "fail", 0x4B0000)
        for (let i = 0; i < RAPID.length; i++) {
            item.appendItem(RAPID[i] + "回/秒(cost " + RAPID_COST[i] + ")", equip_word_size, [0xf0f0f0, 0x999999], true,
                GlobalParam.save_data.unlock.rapid[i])
        }
        item.hide()
        this.item.push(item)

        this.item_manager.appendItem("砲口初速", headline_word_size, [0xf0f0f0, 0x999999], true)
        item = new ItemManager(select_sx, select_sy, equip_box_w, equip_box_h, container,
            () => this.decide2(), () => this.cancel2(), 0, 0, "decide", "back", "fail", 0x4B0000)
        for (let i = 0; i < SPEED.length; i++) {
            item.appendItem("×" + SPEED[i] + "(cost " + SPEED_COST[i] + ")", equip_word_size, [0xf0f0f0, 0x999999], true,
                GlobalParam.save_data.unlock.speed[i])
        }
        item.hide()
        this.item.push(item)

        this.item_manager.appendItem("寸法", headline_word_size, [0xf0f0f0, 0x999999], true)
        item = new ItemManager(select_sx, select_sy, equip_box_w, equip_box_h, container,
            () => this.decide2(), () => this.cancel2(), 0, 0, "decide", "back", "fail", 0x4B0000)
        for (let i = 0; i < SIZE.length; i++) {
            item.appendItem("×" + SIZE[i] + "(cost " + SIZE_COST[i] + ")", equip_word_size, [0xf0f0f0, 0x999999], true,
                GlobalParam.save_data.unlock.size[i])
        }
        item.hide()
        this.item.push(item)

        this.item_manager.appendItem("予備兵器", headline_word_size, [0xf0f0f0, 0x999999], true)
        item = new ItemManager(select_sx, select_sy, equip_box_w, equip_box_h, container,
            () => this.decide2(), () => this.cancel2(), 0, 0, "decide", "back", "fail", 0x4B0000)
        for (let i = 0; i < SUB.length; i++) {
            item.appendItem(SUB[i] + "(cost " + SUB_COST[i] + ")", equip_word_size, [0xf0f0f0, 0x999999], true,
                GlobalParam.save_data.unlock.sub[i])
        }
        item.hide()
        this.item.push(item)

        this.item_manager.appendItem("子機", headline_word_size, [0xf0f0f0, 0x999999], true)
        item = new ItemManager(select_sx, select_sy, equip_box_w, equip_box_h, container,
            () => this.decide2(), () => this.cancel2(), 0, 0, "decide", "back", "fail", 0x4B0000)
        for (let i = 0; i < CHILD.length; i++) {
            item.appendItem(CHILD[i] + "個(cost " + CHILD_COST[i] + ")", equip_word_size, [0xf0f0f0, 0x999999], true,
                GlobalParam.save_data.unlock.child[i])
        }
        item.hide()
        this.item.push(item)

        this.item_manager.appendItem("戻る", headline_word_size, [0xf0f0f0, 0x999999], true)

        this.set_equipment()

        this.disp_equipment()

        this.disp_cost()

        this.key = Key.GetInstance()
        this.loopID = setInterval(() => this.loop(), 30)
    }
    private decide() {
        let focus = this.item_manager.getFocus()
        if (focus == this.item.length) {
            this.back_to_title()
        }
        else {
            this.focussing_item = this.item[focus]
            this.focussing_item.show()
        }
    }
    private cancel() {
        this.back_to_title()
    }
    private back_to_title() {
        if (this.check_cost()) {
            this.gotoScene("back")
        }
        else {
            Sound.stop("all")
            Sound.play("fail", false, GlobalParam.se_volume)
        }
    }
    private decide2() {
        this.focussing_item.hide()
        let id = this.focussing_item.getFocus()
        switch (this.focussing_item) {
            case this.item[0]:
                GlobalParam.save_data.rapid = id
                break
            case this.item[1]:
                GlobalParam.save_data.speed = id
                break
            case this.item[2]:
                GlobalParam.save_data.size = id
                break
            case this.item[3]:
                GlobalParam.save_data.sub = id
                break
            case this.item[4]:
                GlobalParam.save_data.child = id
                break
            default:
                return
        }
        this.focussing_item = this.item_manager
        this.disp_equipment()
        this.disp_cost()
        save()
    }
    private cancel2() {
        this.focussing_item.hide()
        let id: number
        switch (this.focussing_item) {
            case this.item[0]:
                id = GlobalParam.save_data.rapid
                break
            case this.item[1]:
                id = GlobalParam.save_data.speed
                break
            case this.item[2]:
                id = GlobalParam.save_data.size
                break
            case this.item[3]:
                id = GlobalParam.save_data.sub
                break
            case this.item[4]:
                id = GlobalParam.save_data.child
                break
            default:
                this.focussing_item = this.item_manager
                return
        }
        this.focussing_item.setFocus(id)
        this.focussing_item = this.item_manager
    }
    private loop() {
        if (GlobalParam.pause_flag) return
        this.key.RenewKeyData()
        this.focussing_item.update()
    }
    private set_equipment() {
        let pdata = GlobalParam.save_data
        this.item[0].setFocus(pdata.rapid)
        this.item[1].setFocus(pdata.speed)
        this.item[2].setFocus(pdata.size)
        this.item[3].setFocus(pdata.sub)
        this.item[4].setFocus(pdata.child)
    }
    private disp_equipment() {
        if (!this.item_equipment) {
            this.item_equipment = new ItemManager(sx + item_w + padding1, sy, equip_box_w, item_h, this.container,
                undefined, undefined, 0, 0, "", "", "", 0x4B0000
            )
            for (let i = 0; i < this.item.length; i++) {
                this.item_equipment.appendItem(this.item[i].getstr(), equip_word_size, [0xffffff, 0x999999], true)
            }
            this.item_equipment.no_focus()
        }
        else {
            for (let i = 0; i < this.item.length; i++) {
                this.item_equipment.change_str(i, this.item[i].getstr())
            }
        }
    }
    private disp_cost() {
        if (!this.cost_container) {
            this.cost_container = new PIXI.Container()
            this.cost_container.position.set(cost_sx, cost_sy)
            this.container.addChild(this.cost_container)
        }
        else this.cost_container.removeChildren()
        const text = new PIXI.Text("cost : " + this.calc_cost() + " / " + GlobalParam.save_data.max_cost, new PIXI.TextStyle({
            fontFamily: 'Arial',
            fontWeight: 'bold',
            fontSize: cost_word_size,
            fill: this.check_cost() ? [0xffffff, 0x999999] : [0xff0000, 0xcc0000]
        }))
        text.x += text.width * 0.1
        text.y += text.height * 0.1
        const graph = new PIXI.Graphics()
        graph.beginFill(0x222222)
        graph.drawRoundedRect(0, 0, text.width * 1.2, text.height * 1.2, 10);
        graph.endFill()
        graph.addChild(text)
        graph.x -= text.width * 1.2
        this.cost_container.addChild(graph)

        if (!this.check_cost()) {
            const text2 = new PIXI.Text("コストオーバー", new PIXI.TextStyle({
                fontFamily: 'Arial',
                fontWeight: "bold",
                fontSize: message_word_size,
                fill: [0xff0000, 0xcc0000]
            }))
            text2.position.set(-text2.width * 1.1, text.height * 1.2)
            this.cost_container.addChild(text2)
        }
    }
    private calc_cost() {
        let cost: number = 0
        cost += RAPID_COST[this.item[0].getFocus()]
        cost += SPEED_COST[this.item[1].getFocus()]
        cost += SIZE_COST[this.item[2].getFocus()]
        cost += SUB_COST[this.item[3].getFocus()]
        cost += CHILD_COST[this.item[4].getFocus()]
        return cost
    }
    private check_cost() {
        return this.calc_cost() <= GlobalParam.save_data.max_cost
    }
}