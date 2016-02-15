app.factory("Tileset", function(Game){
    
    var Tileset = function(src, width, height){

        var _this = this;
        this.img = new Image();
        this.img.src = src;
        this.width = width;
        this.height = height;
        this.blocks=[];
      
        for(var y=0; y<this.height; y+=32){
            for(var x=0; x<this.width; x+=32){
                this.blocks.push({
                    x:x, y:y,
                    over: false,
                    selected: false,
                    wall: false
                });
            }
        }
        this.blocks[0].selected=true;
        
        this.id=this.img.src.match(/tileset\/(.*).png$/);
        this.id=this.id[0].match(/\/(.*).png$/);
        this.id=this.id[0].replace("/", "");
        this.id=this.id.replace(".png", "");
        
        var defaultWalls;
        
        switch(this.id){
            case "main":
                defaultWalls = [2,3,4,5,6,7,11,12,13,14,15,19,20,21,22,23,27,28,29,30,31,39,46,47,54,55];
                break;
        }
        
        
        defaultWalls.forEach(function(wall){
            _this.blocks[wall].wall=true;
        });
        
        Game.setTileset(this);
    }
    
    Tileset.prototype.toggleWall = function(block){
        block.wall=!block.wall;
        Game.setTileset(this);
    }
    
    Tileset.prototype.getIMG = function(){
        return this.img;
    }
    
    Tileset.prototype.getSRC = function(){
        return this.img.src;
    }
    
    Tileset.prototype.getBlocks = function(){
        return this.blocks;
    }
    
    Tileset.prototype.getSize = function(){
        return {width:this.width, height:this.height};
    }
    
    Tileset.prototype.isWall = function(x, y){
        var found=false;
        var i=0;
        while(!found && i<this.blocks.length){
            if(this.blocks[i].x==x && this.blocks[i].y==y) found=true;
            else i++;
        }
        return this.blocks[i].wall;
    }
    
    return Tileset;
});