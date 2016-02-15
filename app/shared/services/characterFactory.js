app.factory("Character", function(Game){
    
    var Character = function(id, charset, x, y){
        this.id=id;
        this.initPos = {x:x, y:y};
        this.x = this.initPos.x*32;
        this.y = this.initPos.y*32;
        this.posOnScreen = {x:this.x, y:this.y};
        this.speed = 3;
        this.dir = 0;
        this.anim = 1;
        this.frame = 0;
        this.autoMoveFrame = 0;
        this.seconds = 0;
        this.changeDirectionAtSecond = Math.floor((Math.random() * 3)+1);
        this.randDir = 1;
        this.img = new Image();
        this.img.src = charset;
        this.blockedByWall = false;
        this.moveWithMapUp = false;
        this.moveWithMapDown = false;
        this.moveWithMapLeft = false;
        this.moveWithMapRight = false;
        if(this.id=="main") Game.setCharacter(this);

    }
    
    Character.prototype.save = function(){
        if(this.id=="main") Game.setCharacter(this);
        else Game.setPNJ(this);
    }
    
    Character.prototype.getID = function(){
        return this.id;
    }
    
    Character.prototype.isBlockedByWall = function(){
        return this.blockedByWall;
    }
    
    Character.prototype.getIMG = function(){
        return this.img;
    }
    
    Character.prototype.getSRC = function(){
        return this.img.src;
    }
    
    Character.prototype.resetPos = function(){
        this.x = this.initPos.x*32;
        this.y = this.initPos.y*32;
        this.dir = 0;
    }
    
    Character.prototype.getPos = function(){
        return {x:this.x, y:this.y};
    }

    Character.prototype.getInitPos = function(){
        return this.initPos;
    }
    
    Character.prototype.updateInitPos = function(x, y){
        this.initPos.x=x;
        this.initPos.y=y;
        this.x = this.initPos.x*32;
        this.y = this.initPos.y*32;
        this.save();
    }
    
    Character.prototype.getSpeed = function(){
        return this.speed;
    }
    
    Character.prototype.getDir = function(){
        return this.dir;
    }
    
    Character.prototype.getAnim = function(){
        return this.anim;
    }
    
    Character.prototype.getPosOnScreen = function(){
        return this.posOnScreen;
    }
    
    Character.prototype.moveUpMap = function(px){
        this.posOnScreen.y -= px;
    }
    
    Character.prototype.moveDownMap = function(px){
        this.posOnScreen.y += px;
    }
    
    Character.prototype.moveLeftMap = function(px){
        this.posOnScreen.x += px;
    }
    
    Character.prototype.moveRightMap = function(px){
        this.posOnScreen.x -= px;
    }
    
    Character.prototype.updatePosOnScreen = function(){
        
        var gameSize = Game.getSize();
        var mapSize = Game.getMap().getSize();
        var mapWidth = mapSize.width*32;
        var mapHeight = mapSize.height*32;
        var halfWidth = gameSize.width/2;
        var halfHeight = gameSize.height/2;
        
        if(this.id=="main"){
            if(mapWidth>gameSize.width){
                if(this.x>=halfWidth && this.x<=(mapWidth-halfWidth)) this.posOnScreen.x = halfWidth;
                else if(this.x>(mapWidth-halfWidth)) this.posOnScreen.x = this.x-mapWidth+gameSize.width;
                else this.posOnScreen.x = this.x;
            }
            if(mapHeight>gameSize.height){
                if(this.y>=halfHeight && this.y<=(mapHeight-halfHeight)) this.posOnScreen.y = halfHeight;
                else if(this.y>(mapHeight-halfHeight)) this.posOnScreen.y = this.y-mapHeight+gameSize.height;
                else this.posOnScreen.y = this.y;
            }
        }
        else{
            var mapPos = Game.getMap().getPos();
            this.posOnScreen.x = this.x-Math.abs(mapPos.x);
            this.posOnScreen.y = this.y-Math.abs(mapPos.y);
        }
    }
    
    Character.prototype.moveLeft = function(){
        var map = Game.getMap();
        this.dir=1;
        if(this.x>=0){
            if(map.isWall(this.x+2, this.y+18)){
                this.blockedByWall=true;
            }else{
                this.blockedByWall=false;
                this.x-=this.speed;
            }
            
        }
        this.updatePosOnScreen();
        this.updateAnim();
        this.save();
    }
    
    Character.prototype.moveRight = function(){
        var map = Game.getMap();
        var mapWidth = map.getSize().width*32;
        this.dir=2;
        if(this.x<mapWidth-32){
            if(map.isWall(this.x+26, this.y+18)){
                this.blockedByWall=true;
            }else{
                this.blockedByWall=false;
                this.x+=this.speed;
            }
                
        }
        this.updatePosOnScreen();
        this.updateAnim();
        this.save();
    }
    
    Character.prototype.moveUp = function(){
        var map = Game.getMap();
        this.dir=3;
        if(this.y>=0){
            if(map.isWall(this.x+13, this.y+16) || map.isWall(this.x+18, this.y+16)){
                this.blockedByWall=true;
            }
            else{
                this.blockedByWall=false;
                this.y-=this.speed;
            }
             
        }
        this.updatePosOnScreen();
        this.updateAnim();
        this.save();
    }
    
    Character.prototype.moveDown = function(){
        var map = Game.getMap();
        var mapHeight = map.getSize().height*32;
        this.dir=0;
        if(this.y<mapHeight-36){
            if(map.isWall(this.x+13, this.y+33) || map.isWall(this.x+18, this.y+33)){
                this.blockedByWall=true;
            }
            else{
                this.blockedByWall=false;
                this.y+=this.speed;
            }
            
        }
        this.updatePosOnScreen();
        this.updateAnim();
        this.save();
    }
    
    Character.prototype.resetAnim = function(){
        this.anim = 1;
        this.frame = 0;
    }
    
    Character.prototype.updateAnim = function(){
        
        this.frame++;
        if(this.frame==5){
            this.frame=0;
            this.anim = (this.anim+1)%3;
        }
    }
    
    Character.prototype.automove = function(){
        
        var gameSize = Game.getSize();
        if(this.x>=-32 && this.x<=gameSize.width && this.y>=0-32 && this.y<=gameSize.height){
            
            this.autoMoveFrame++;

            if(this.autoMoveFrame==20){
                this.seconds++;
                this.autoMoveFrame=0;
                if(this.seconds==this.changeDirectionAtSecond){
                    this.randDir = Math.floor(Math.random() * 5);
                    this.changeDirectionAtSecond = Math.floor((Math.random() * 3)+1);
                    this.seconds = 0;
                }
            }
            
            switch(this.randDir){
                case 0:
                    this.moveDown();
                    break;
                case 1:
                    this.moveLeft();
                    break;
                case 2:
                    this.moveRight();
                    break;
                case 3:
                    this.moveUp();
                    break;
                case 4:
                    this.resetAnim();
                    break;
            }
        }
    }
    
    return Character;
});