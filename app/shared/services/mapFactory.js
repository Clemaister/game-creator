app.factory("Map", function(Game){
    
    var Map = function(width, height){
        
        this.width = width;
        this.height = height;
        this.x = 0;
        this.y = 0;
        this.layers=[];
        this.currentLayer=0;
        this.imageData;
      
        for(var i=0; i<3; i++){
            var xArray=[];
            for(var x=0; x<this.width; x++){
                var yArrays = [];
                for(var y=0; y<this.height; y++){
                    yArrays.push({content:false, wall:false});
                }
                xArray.push(yArrays);
            }
            this.layers.push(xArray);
        }
        Game.setMap(this);
    }
    
    Map.prototype.getSize = function(){
        return {width:this.width, height:this.height};
    }
    
    Map.prototype.updateCurrentLayer = function(layer){
        this.currentLayer=layer;
    }
    
    Map.prototype.getCurrentLayer = function(){
        return this.currentLayer;
    }
    
    Map.prototype.getContent = function(pos){
        return this.layers[this.currentLayer][pos.x][pos.y].content;
    }
    
    Map.prototype.getLayers = function(){
        return this.layers; 
    }
    
    Map.prototype.getCurrentMap = function(){
        return this.layers[this.currentLayer];
    }
    
    Map.prototype.updateCaseContent = function(pos, content, wall){
        if(this.layers[this.currentLayer][pos.x] && this.layers[this.currentLayer][pos.x][pos.y]){
            this.layers[this.currentLayer][pos.x][pos.y].content=content;
            this.layers[this.currentLayer][pos.x][pos.y].wall=wall;
            Game.setMap(this);
        }
    }
    
    Map.prototype.cover = function(pos, content, size, copy){
        
        var tileContent={x:content.first.x, y:content.first.y};
        for(var y=pos.y; y<pos.y+size.height; y++){
            for(var x=pos.x; x<pos.x+size.width; x++){
                if(this.layers[this.currentLayer][x] && this.layers[this.currentLayer][x][y]){
                    this.layers[this.currentLayer][x][y].content={
                        x:tileContent.x, 
                        y:tileContent.y
                    };
                    var wall = Game.getTileset().isWall(tileContent.x, tileContent.y);
                    this.layers[this.currentLayer][x][y].wall = wall;
                    tileContent.x+=32;
                }
            }
            tileContent.x=content.first.x;
            tileContent.y+=32;
        }
        Game.setMap(this);
        
    }
    
    Map.prototype.empty = function(){
        for(var y=0; y<this.height; y++){
            for(var x=0; x<this.width; x++){
                this.layers[this.currentLayer][x][y].content=false;
                this.layers[this.currentLayer][x][y].wall=false;
            }
        }
        Game.setMap(this);
    }
    
    Map.prototype.fullfill = function(selected){
        for(var y=0; y<this.height; y++){
            for(var x=0; x<this.width; x++){
                this.layers[this.currentLayer][x][y].content={
                    x:selected.x, 
                    y:selected.y
                };
                var wall=Game.getTileset().isWall(selected.x, selected.y);
                this.layers[this.currentLayer][x][y].wall=wall;
            }
        }
        Game.setMap(this);
    }
    
    Map.prototype.updateSize = function(diff){
        
        var _this = this;
        
        if(diff.width!=0 || diff.height!=0){
                
            this.layers.forEach(function(xArray){
                if(diff.width>0){
                    for(var u=0; u<diff.width; u++){
                        var yArray=[];
                        for(var y=0; y<_this.height; y++) yArray.push({content:false, wall:false}); 
                        xArray.push(yArray);
                    } 
                }
                else if(diff.width<0){
                    for(var u=0; u>diff.width; u--) xArray.pop();
                }

                xArray.forEach(function(yArray){
                    if(diff.height>0){
                        for(var u=0; u<diff.height; u++) yArray.push({content:false, wall:false});
                    }else if(diff.height<0){
                        for(var u=0; u>diff.height; u--) yArray.pop();
                    }
                });
            })

            this.width=this.layers[0].length;
            this.height=this.layers[0][0].length;
        }
        Game.setMap(this);
    }
    
    Map.prototype.isWall = function(x, y){
        var formatedX = parseInt(x/32);
        var formatedY = parseInt(y/32);
        return (
            this.layers[0][formatedX][formatedY].wall ||
            this.layers[1][formatedX][formatedY].wall ||
            this.layers[2][formatedX][formatedY].wall
        );
    }
    
    Map.prototype.setImageData = function(imageData){
        this.imageData=imageData;
    }
    
    Map.prototype.getImageData = function(){
        return this.imageData;
    }
    
    Map.prototype.resetPos = function(){
        this.x=0;
        this.y=0;
    }
    
    Map.prototype.getPos = function(){
        return {x:this.x, y:this.y};
    }
    
    Map.prototype.moveUp = function(px){
        this.y-=px;
        var pnjs = Game.getPNJs();
        pnjs.forEach(function(pnj){
            pnj.moveUpMap(px);
        });
    }
    
    Map.prototype.moveDown = function(px){
        this.y+=px;
        var pnjs = Game.getPNJs();
        pnjs.forEach(function(pnj){
            pnj.moveDownMap(px);
        });
    }
    
    Map.prototype.moveLeft = function(px){
        this.x-=px;
        var pnjs = Game.getPNJs();
        pnjs.forEach(function(pnj){
            pnj.moveLeftMap(px);
        });
    }
    
    Map.prototype.moveRight = function(px){
        this.x+=px;
        var pnjs = Game.getPNJs();
        pnjs.forEach(function(pnj){
            pnj.moveRightMap(px);
        });
    }
    
    return Map;
});