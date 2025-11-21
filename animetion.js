
class spriteAnimate{
    constructor(ispPlayer,id,canvas=null){
        if (typeof canvas==='string'&&ispPlayer==='player'){
            this.canvas = document.getElementById(canvas)
            this.imgIndex = petAnimeIndex
        }
        else if (ispPlayer==='player') {
            this.canvas = document.getElementById('petBattleCanvas');
            this.imgIndex = petAnimeIndex
            this.attackOffset=90
        }
        else if (ispPlayer==='enemy') {
            this.canvas = document.getElementById('enemyBattleCanvas');
            this.imgIndex = enemyAnimeIndex
            this.attackOffset=-90
        }
        else{return console.log('类型错误')}
        this.ctx = this.canvas.getContext("2d");
        this.id = id
        this.img = null
        this.frames = []
        this.currentFrame = 0
        this.running = false
        this.lastTime = 0
        this.speed = 100
        this.startY=null
        this.startX=null
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
        TWEEN.update(time);
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
    move(time){
        let start = { x: 0 };
        const attackOffset = this.attackOffset
        this.attackTween = new TWEEN.Tween(start)
        .to({ x: attackOffset }, 300)
        .easing(TWEEN.Easing.Quadratic.Out)
        .onUpdate(obj => {
            this.canvas.style.transform = `translateX(${obj.x}px)`;
        })
        .onComplete(() => {
        new TWEEN.Tween(start)
            .to({ x: 0 }, 300)
            .easing(TWEEN.Easing.Quadratic.In)
            .onUpdate(obj => {
                this.canvas.style.transform = `translateX(${obj.x}px)`;
            })
            .start();
    })
    .start();
    }
}

class battleUnit {
    constructor(Identy,id,level){
        this.id = id 
        this.level = level
         if (Identy === 'player'){
            this.Index = playerBattleIndex
            this.lifeType =document.getElementById('playerLife')
        }
        else if (Identy ==='enemy'){
            this.Index = enemyBattleIndex
            this.lifeType =document.getElementById('enemyLife')
        }
        else{
            return console.log('玩家数据错误')
        }
        this.life = this.Index[this.id].life*this.level
        this.attackValue = this.Index[this.id].attack*this.level
        this.healValue = this.Index[this.id].heal*this.level
        this.maxLife = Math.floor(this.Index[this.id].life*this.level)
        this.speed = this.Index[this.id].speed*this.level
        this.skill1 = this.Index[this.id].skill1
        this.skill2 = this.Index[this.id].skill2
        this.skill3 = this.Index[this.id].skill3
        this.skillkey1 = this.Index[this.id].skillkey1
        this.skillkey2 = this.Index[this.id].skillkey2
        this.skillkey3 = this.Index[this.id].skillkey3
        this.isLive = true
    }
    updateLife(){
        this.life = Math.floor(this.life)
        this.lifeType.textContent = `${this.life}/${this.maxLife}`
    }
    takeDmg(dmg){
        this.life-=dmg
        if(this.life<=0){
            this.life = 0
            this.isLive = false
        }
        this.updateLife()
    }
    attack(aim){
        if(!aim) return console.log('目标不存在')
        const dmg = Math.random()>0.6?this.attackValue*1.5:this.attackValue
        aim.takeDmg(dmg)
    }
    heal(){
        this.life += this.healValue
        if (this.life>this.maxLife){this.life = this.maxLife}
        this.updateLife()
    }
    vampire(aim){
        const dmg = this.attackValue*0.8
        this.life += dmg*0.2
        if (this.life>this.maxLife){this.life = this.maxLife}
        this.updateLife()
        aim.takeDmg(dmg)
    }
}

class gameManager{
    constructor(){
        this.showTimer = null
        this.playerID = 1
        this.playerLevel = (Math.floor(parseInt(localStorage.getItem('petEXP')))/10000+1)
        this.enemyID = 1
        this.enemyLevel = parseInt(localStorage.getItem('petEnemy'))
        if(!this.playerID){console.log('用户不存在')}
        this.player = null
        this.enemy = null
        this.petAnime = null
        this.enemyAnime = null
        this.gameon = false
        this.playerTurn = false
        this.enemyTurn = false
        this.firstTimer = null
        this.isWin = false
    }
    async gameStart(){
        canBattle=false
        if(this.gameon){return console.log("战斗已开始");}
        this.gameon = true
        this.player = new battleUnit('player',this.playerID,this.playerLevel)
        this.enemy = new battleUnit('enemy',this.enemyID,this.enemyLevel)
        this.petAnime = new spriteAnimate('player',this.playerID)
        this.enemyAnime = new spriteAnimate('enemy',this.enemyID)
        await this.showBattleWin()
        this.showskillBtm()
        this.player.updateLife()
        this.enemy.updateLife()
        this.showEnemyLevel()
        this.firstAction()
    }
    firstAction(){
        if(this.firstTimer){clearTimeout(this.firstTimer)}
        if(this.player.speed>=this.enemy.speed){
        this.playerTurn = true
        this.showTips('你先攻')
        }
        else{
            this.enemyTurn =true
            this.showTips('敌人先攻')
            this.firstTimer = setTimeout(()=>{this.enemyAction()},1000)
        }
    }
    showskillBtm(){
        document.getElementById('skill1').textContent = this.player.skill1
        document.getElementById('skill2').textContent = this.player.skill2
        document.getElementById('skill3').textContent = this.player.skill3
    }
    showEnemyLevel(){
        document.getElementById('enemyLevel').textContent = "等级： "+this.enemyLevel
    }
    async showBattleWin(){
        document.getElementById('battleWin').classList.add('show')
        document.getElementById('battleCover').classList.add('show')
        await this.petAnime.start('sword')
        await this.enemyAnime.start('stand')
    }
    showTips(word){
        if(!word){return}
        const tips = document.getElementById('battletips')
        tips.textContent=word
    }
    battleShow(act){
        const el =  document.getElementById('battleShow')
        if(act==='attack'){
            el.classList.add('attack')
            setTimeout(()=>{el.classList.remove('attack')},500)
            }

        else if (act==='heal'){
            el.classList.add('heal')
            setTimeout(()=>{el.classList.remove('heal')},500)
            }
    }
    playerAction(act){
        if(!this.gameon) return
        if(!this.playerTurn) return
        if (act==='attack'){
            this.player.attack(this.enemy)
            this.petAnime.move()
        }
        if (act==='heal'){
            this.player.heal()
        }
        if(act==='vampire'){
            this.player.vampire(this.enemy)
            act = 'attack'
            this.petAnime.move()
        }
        this.battleShow(act)
        this.playerTurn = false
        this.enemyTurn = true
        this.showTips('敌方回合')
        setTimeout(()=>{
            this.winnerCheck()
            this.enemyAction()
        },2000)
    }
    enemyAction(){
        if(!this.gameon) return
        if(!this.enemyTurn) return
        if(this.player.life>=0.6*this.player.maxLife&&this.enemy.life<this.enemy.maxLife*0.8){
            if(Math.random()>0.8){
                this.enemy.heal()
                this.battleShow('heal')
            }
            else{this.enemy.attack(this.player)
                this.battleShow('attack')
                this.enemyAnime.move()
            }
        }
        else{this.enemy.attack(this.player)
            this.battleShow('attack')
            this.enemyAnime.move()
        }
        setTimeout(()=> {
        this.winnerCheck()
        this.playerTurn = true
        this.enemyTurn = false
        this.showTips('你的回合')   
        },2000)
    }
    async winnerCheck(){
        if(this.player.isLive&&this.enemy.isLive) return
        if(!this.player.isLive){
            alert('输！')
            this.gameon = false
            this.isWin = false
            this.closeGame()
            destroyGame()
            return
        }
        else if(!this.enemy.isLive){
            alert('赢！')
            this.isWin = true
            this.gameon =false
            try{
            await newEnemy(this.isWin)
            }catch{Error,alert('网络错误'),console.log('上传失败')}
            finally {
            this.closeGame()
            destroyGame()
            return}
        }
    }
    
    closeGame(){
        if(!this.gameon){
        document.getElementById('battleWin').classList.remove('show')
        document.getElementById('battleCover').classList.remove('show')
        this.petAnime.stop()
        this.enemyAnime.stop()
        canBattle=true
        }
    }
    escape(){
        this.gameon = false
        this.closeGame()
        destroyGame()
    }

}
