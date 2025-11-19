class spriteAnimate{
    constructor(canvas,imgIndex,id){
         if (typeof canvas === 'string') {
            canvas = document.getElementById(canvas);
        }
        this.canvas = canvas
        this.ctx = canvas.getContext("2d");
        this.imgIndex = imgIndex
        this.id = id

        this.img = null
        this.frames = []
        this.currentFrame = 0

        this.running = false
        this.lastTime = 0
        this.speed = 100
    }

    async loadAction(action) {
        const act = this.imgIndex[this.id].actions[action]
        if(!act) throw new Error('动作索引不存在')
        
        const data = await fetch(act.json).then(r=>r.json())

        const img = new Image();
        img.src = act.src;
        await new Promise(resolve => {
        img.onload = resolve;
            })
        

        this.img = img
        this.speed = act.speed
        this.frames = Object.values(data.frames)
        this.currentFrame = 0
    }

    async setAction(action) {
        await this.loadAction(action)
    }

    async start(action=null){
        if (this.running) return;
        this.running = true
        if(action){
            await this.loadAction(action)
        }
        requestAnimationFrame(this.loop.bind(this))
    }

    stop(){
        this.running = false
    }
    
    loop(time){
        if (!this.running) return

        if (time-this.lastTime>=this.speed){
            this.draw()
            this.lastTime = time
        }
        requestAnimationFrame(this.loop.bind(this))
    }
    draw(){
        const ctx = this.ctx
        ctx.clearRect(0,0,this.canvas.width,this.canvas.height)
        
        const f = this.frames[this.currentFrame]

        ctx.drawImage(
            this.img,
            f.frame.x,f.frame.y,f.frame.w,f.frame.h,
            0,0,
            this.canvas.width,this.canvas.height
        );
        this.currentFrame = (this.currentFrame+1)%this.frames.length
    }
}