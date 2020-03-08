import * as PIXI from "pixi.js"
export class GraphicManager{
    private callback: () => any
    private loadedList: string[] = []
    private loadingList: string[] = []
    private texture: PIXI.Texture[][] = []
    private loader: PIXI.Loader
    private static instance: GraphicManager
    public static GetInstance(){
        if(!this.instance)this.instance = new GraphicManager()
        return this.instance
    }
    private constructor(){
        this.loader = PIXI.Loader.shared
    }
    public loadGraphics(spriteName: string[]){
        spriteName.forEach(n => this.loadGraphic(n))
    }
    public loadGraphic(spriteName: string){
        if(this.loadingList.indexOf(spriteName) === -1
            && this.loadedList.indexOf(spriteName) === -1){
            this.loadingList.push(spriteName)
            this.load()
        }
    }
    private load(){
        if(this.loader.loading)return
        const spriteName = this.loadingList.pop()
        const jsonFileName = 'asset/' + spriteName + '_sprite.json'
        this.loadedList.push(spriteName)
        this.loader.add(jsonFileName).load(()=>{
            let texture: PIXI.Texture
            this.texture.push([])
            const k = this.texture.length - 1
            let count: number = 0
            while(1){
                texture = PIXI.Texture.from(spriteName + '_' + count + '.png')
                if(!texture.valid)break
                this.texture[k].push(texture)
                count++
            }
            if(this.loadingList.length === 0 && this.callback){
                this.callback()
                this.callback = undefined
            }
            else{
                this.load()
            }
        })
    }
    public SetLoadedFunc(callback: () => any){
        this.callback = callback
        if(this.loadingList.length === 0 && this.callback){
            this.callback()
        }
    }
    public isLoaded(spriteName: string){
        return this.loadedList.indexOf(spriteName) !== -1
    }
    public GetSprite(spriteName: string, index?: number[]){
        const i = this.loadedList.indexOf(spriteName)
        if(i === -1){
            return undefined
        }
        let sprite: PIXI.AnimatedSprite
        let textures
        if(index == undefined)textures = this.texture[i]
        else textures = this.texture[i].filter((n, x) => index.indexOf(x) !== -1)
        sprite = new PIXI.AnimatedSprite(textures)
        if(index || index && index.length > 1){
            sprite.animationSpeed = 0.5
            sprite.play()
        }
        sprite.anchor.x = sprite.anchor.y = 0.5
        sprite.blendMode = PIXI.BLEND_MODES.ADD
        return sprite
    }
}