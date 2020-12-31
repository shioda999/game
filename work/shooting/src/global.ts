export const WIDTH = 640
export const HEIGHT = 480
export const EFFECT_NAME = ["itoga_bomb"]
export const BULLET_COLOR = ["blue", "l_blue", "purple", "cyan", "l_green", "green", "red", "orange", "black"]
export const PLAYER_RANGE = 15
export const PLAYER_LP = 5
export const PLAYER_SHOT = 1
export const ENEMY_DATA = [
    {
        name: "enemy_A",
        range: 30,
        Lp: 2,
        score: 3
    },
    {
        name: "enemy_B",
        range: 30,
        Lp: 5,
        score: 8
    },
    {
        name: "enemy_C",
        range: 30,
        Lp: 3,
        score: 25
    },
    {
        name: "enemy_D",
        range: 30,
        Lp: 30,
        score: 100
    },
    {
        name: "enemy_E",
        range: 30,
        Lp: 15,
        score: 100
    },
    {
        name: "enemy_F",
        range: 30,
        Lp: 15,
        score: 100
    },
    {
        name: "itoga_bomb",
        range: 20,
        Lp: 100,
    },
    {
        name: "player",
        range: 20,
        Lp: 100,
    },
    {
        name: "player",
        range: 20,
        Lp: 100,
    },
    {
        name: "player",
        range: 20,
        Lp: 100,
    },
    {
        name: "player",
        range: 20,
        Lp: 100,
    },
    {
        name: "player",
        range: 20,
        Lp: 100,
    },
    {
        name: "waitLine"
    }
]
export const BOSS_DATA = [
    {
        name: "boss_A",
        range: 40,
        Lp: 120,
        score: 1000,
        Lp_border: [90, 50, 20]
    },
    {
        name: "boss_B",
        range: 40,
        Lp: 150,
        score: 1500,
        Lp_border: [100, 70, 40]
    },
    {
        name: "boss_C",
        range: 40,
        Lp: 250,
        score: 2500,
        Lp_border: [180, 120, 60]
    },
    {
        name: "boss_D",
        range: 40,
        Lp: 300,
        score: 4000,
        Lp_border: [200, 120, 80]
    },

    {
        name: "boss_E",
        range: 40,
        Lp: 1000,
        score: 10000,
        Lp_border: [900, 750, 600, 450, 300, 150]
    }
]
export const ITEMOBJ_DATA = [
    {
        name: "coin1"
    },
    {
        name: "coin10"
    }
]
export namespace GlobalParam {
    export let stage: number = 0
    export let pause_flag: boolean
    export let master_volume: number = 0.1
    export let bgm_volume: number = 1
    export let se_volume: number = 0.5
    export let data = { score: 1000, remain_life: 3, time: 0 }
    export let new_employment = false
    export let save_data = {
        rapid: 1,
        speed: 0,
        size: 2,
        attack: 0,
        sub: 2,
        child: 0,
        unlock: {
            rapid: [true, false, false],
            speed: [true, false, false],
            size: [true, false, false],
            attack: [true, false, false],
            sub: [true, false, false, false],
            child: [true, false, false, false]
        },
        max_cost: 100,
        clear: 1
    }
}
export const RAPID = [5, 7.5, 10]
export const RAPID_COST = [0, 60, 100]
export const SPEED = [1, 1.5, 2]
export const SPEED_COST = [0, 30, 80]
export const SIZE = [1, 0.75, 0.5]
export const SIZE_COST = [0, 30, 80]
export const ATTACK = [1, 2, 3]
export const ATTACK_COST = [0, 100, 200]
export const SUB = ["なし", "サブ弾", "ミサイル", "ビーム",]
export const SUB_COST = [0, 50, 80, 80]
export const CHILD = [0, 1, 2, 3]
export const CHILD_COST = [0, 120, 300, 450]
export const STAGE_NUM = 3

export function save() {
    var now = new Date();
    now.setMonth((now.getMonth() + 3) % 12 + 1);
    document.cookie = "shooting_data=" + encodeURIComponent(JSON.stringify(GlobalParam.save_data)) + ";expires=" + now.toUTCString();
}
export function load() {
    let str = decodeURIComponent(get_cookieVal("shooting_data"))
    if (str == "undefined") return
    GlobalParam.save_data = JSON.parse(str)
}
export function get_cookieVal(key) {
    return ((document.cookie + ';').match(key + '=([^¥S;]*)') || [])[1];
}