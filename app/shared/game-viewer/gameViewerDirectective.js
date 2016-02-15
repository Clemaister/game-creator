app.directive("gameViewer", function(Game){
    return {
        restrict: "AE",
        scope:{
            tileset: "=",
            map: "=",
            char: "=",
            pnjs: "=",
            mode: "@",
            selectedBlocks: "=",
        },
        templateUrl: "app/shared/game-viewer/gameViewerView.html",
        link: function (scope, elem, attr) {
            
            scope.mousePos = {x:0, y:0};
            scope.highlightedCases={first:false, last:false};
            scope.selectedCases={first:false, last:false};
            scope.casesToMove={first:false, last:false};
            scope.painting=false;
            scope.selecting=false;
            scope.selectionDone=false;
            scope.movingSelection=false;
            scope.char.anims=[];
            scope.pnjs.forEach(function(pnj){
               pnj.anims=[]; 
            });
            
            for(var i=0; i<4; i++){//direction
                var anim=[];
                for(var j=0; j<3; j++){//anim
                    anim.push({x:j*32, y:i*32});
                }
                scope.char.anims.push(anim);
                scope.pnjs.forEach(function(pnj){
                    pnj.anims.push(anim);
                })
            }

            var canvas = elem[0].querySelector('canvas');
            var ctx = canvas.getContext("2d");
            if(scope.tileset) var tilesetIMG = scope.tileset.getIMG();

            scope.draw = function(){

                switch(scope.mode){
                        
                    case 'editor':
                        scope.basicDisplay();
                        scope.drawCases("editor");
                        scope.drawGrid();
                        if(!scope.selecting) scope.drawHighlightedCases();
                        scope.drawCharacter(scope.char);
                        scope.drawPNJs();
                        scope.drawSelectedCases();
                        break;
                        
                    case 'viewer':
                        scope.viewerDisplay();
                        scope.drawMapImage();
                        scope.drawCharacter(scope.char);
                        scope.drawPNJs();
                        break;
                }
                
            }
        
            scope.drawCharacter = function(char){
    
                var posX, posY, dir, anim;
                var charsetIMG = char.getIMG();
                
                switch(scope.mode){
                        
                    case 'editor':
                        var pos = char.getInitPos();
                        posX = pos.x*32;
                        posY = pos.y*32;
                        dir = 0;
                        anim = 1;
                        break;
                        
                    case 'viewer':
                        var pos = char.getPosOnScreen();
                        posX=pos.x;
                        posY=pos.y;
                        dir = char.getDir();
                        anim = char.getAnim();
                        break;
                }
            
                ctx.drawImage(
                    charsetIMG,
                    char.anims[dir][anim].x, 
                    char.anims[dir][anim].y, 
                    32, 32, posX, posY, 32, 32
                );
            }
            
            scope.drawPNJs = function(){
                scope.pnjs.forEach(function(pnj){
                   scope.drawCharacter(pnj); 
                });
            }
            
            scope.drawMapImage = function(){
                
                var imageData = scope.map.getImageData();
                var mapPos = scope.map.getPos();
                var mapSize = scope.map.getSize();
                var gameSize = Game.getSize();
                
                ctx.putImageData(
                    imageData, 
                    mapPos.x, mapPos.y, 
                    0, 0, mapSize.width*32, mapSize.height*32
                );
            }
            
            scope.drawCases = function(mode){
                
                var layers=scope.map.getLayers();
                var currentLayer = scope.map.getCurrentLayer();
                
                var filterSet=false;
                for(var i=0; i<layers.length; i++){
                    
                    if(mode=="editor"){
                        if(
                            (currentLayer==0 && (i==1 || i==2)) || 
                            (currentLayer==1 && (i==0 || i==2)) || 
                            (currentLayer==2 && (i==0 || i==1))
                          ){
                            ctx.globalAlpha=0.5;
                        }
                    }
                    
                    for(var x=0; x<layers[i].length; x++){
                        for(var y=0; y<layers[i][x].length; y++){
                            
                            if(layers[i][x][y].content){
                                ctx.drawImage(
                                    tilesetIMG, 
                                    layers[i][x][y].content.x,
                                    layers[i][x][y].content.y, 
                                    32, 32, x*32, y*32, 32, 32
                                );
                            }
                            
                        }
                    }
                    ctx.globalAlpha=1;
                }
                
            }
            
            scope.mouseDown = function($event){
                switch(scope.mode){
                    case 'editor':
                        if($event.which==1){
                            if(scope.selecting && scope.selectionDone) scope.moveOrRemoveSelection();
                            else scope.startPainting();
                        }
                        else if($event.which==3)
                            scope.selectCase();
                        break;
                }
            }
            
            scope.mouseMove = function($event){
                switch(scope.mode){
                    case 'editor':
                        scope.overCase($event);
                        break;
                }
            }
            
            scope.mouseLeave = function(){
                switch(scope.mode){
                    case 'editor':
                        scope.outMap();
                        break;
                }
            }
            
            scope.mouseUp = function(){
                switch(scope.mode){
                    case 'editor':
                        if(scope.painting) scope.finishedPainting();
                        else if(scope.selecting && !scope.selectionDone) scope.saveSelectedCases();
                        else if(scope.movingSelection) scope.finishedMovingSelection();
                        break;
                }
            }
            
            scope.saveSelectedCases = function(){
                scope.casesToMove={first:scope.selectedCases.first, last:scope.selectedCases.last};
                scope.selectionDone=true;
            }
            
            scope.moveOrRemoveSelection = function(){
                if(scope.selectedCases.last){
                    if(
                        scope.mousePos.x>=scope.selectedCases.first.x && scope.mousePos.x<=scope.selectedCases.last.x &&
                        scope.mousePos.y>=scope.selectedCases.first.y && scope.mousePos.y<=scope.selectedCases.last.y
                      ) {
                        scope.movingSelection=true;
                    }
                        
                    else
                        scope.selecting=false;
                }
                else{
                    if(
                        scope.mousePos.x>=scope.selectedCases.first.x && scope.mousePos.x<=scope.mousePos.x+1 &&
                        scope.mousePos.y>=scope.selectedCases.first.y && scope.mousePos.y<=scope.mousePos.y+1
                      ) 
                        scope.movingSelection=true;
                    else
                        scope.selecting=false;
                }
            }
            
            scope.selectCase = function(){
                scope.selecting=true;
                scope.selectionDone=false;
                scope.selectedCases={first:{x:scope.mousePos.x, y:scope.mousePos.y}, last:{x:scope.mousePos.x, y:scope.mousePos.y}};
            }
            
            scope.viewerDisplay = function(){
                canvas.width = Game.getSize().width;
                canvas.height = Game.getSize().height;
                scope.fill(canvas.width, canvas.height);
            }
            
            scope.basicDisplay = function(){
                var size = scope.map.getSize();
                canvas.width = size.width*32;
                canvas.height = size.height*32;
                scope.fill(canvas.width, canvas.height);
            }
            
            scope.fill = function(width, height){
                ctx.fillStyle = "#000000";
                ctx.fillRect(0, 0, width, height);
            }
            
            scope.drawGrid = function(){
                var size = scope.map.getSize();
                ctx.strokeStyle = "#818181";
                ctx.lineWidth = 1;
                for(var i=1; i<size.width; i++){
                    ctx.beginPath();
                    ctx.moveTo(i*32, 0);
                    ctx.lineTo(i*32, size.height*32);
                    ctx.stroke();
                }
                for(var i=1; i<size.height; i++){
                    ctx.beginPath();
                    ctx.moveTo(0, i*32);
                    ctx.lineTo(size.width*32, i*32);
                    ctx.stroke();
                }
                
            }
            
            scope.drawHighlightedCases = function(){
                
                var rectWidth = scope.selectedBlocks.last.x-scope.selectedBlocks.first.x;
                var formatedLastX = scope.selectedBlocks.last.x/32;
                var formatedFirstX = scope.selectedBlocks.first.x/32;
                var formatedRectWidth = formatedLastX-formatedFirstX;
                var rectHeight = scope.selectedBlocks.last.y-scope.selectedBlocks.first.y;
                var formatedLastY = scope.selectedBlocks.last.y/32;
                var formatedFirstY = scope.selectedBlocks.first.y/32;
                var formatedRectHeight = formatedLastY-formatedFirstY;
                scope.highlightedCases.last.x = scope.highlightedCases.first.x+formatedRectWidth;
                scope.highlightedCases.last.y = scope.highlightedCases.first.y+formatedRectHeight;

                ctx.drawImage(
                    tilesetIMG, 
                    scope.selectedBlocks.first.x,
                    scope.selectedBlocks.first.y, 
                    rectWidth, rectHeight, 
                    scope.highlightedCases.first.x*32, 
                    scope.highlightedCases.first.y*32, 
                    formatedRectWidth*32, 
                    formatedRectHeight*32
                );
                
                ctx.globalAlpha=0.7;
                ctx.fillStyle="#4e4e4e";
                ctx.fillRect(
                    scope.highlightedCases.first.x*32, 
                    scope.highlightedCases.first.y*32, 
                    formatedRectWidth*32, 
                    formatedRectHeight*32
                );
                ctx.globalAlpha=1;
      
            }
            
            scope.drawSelectedCases = function(){
                
                if(scope.selecting){
                    
                    var rectWidth = ((scope.selectedCases.last.x+1)-scope.selectedCases.first.x);
                    var rectHeight = ((scope.selectedCases.last.y+1)-scope.selectedCases.first.y);

                    ctx.lineWidth=3;
                    ctx.strokeStyle="#ffffff";
                    ctx.strokeRect(
                        scope.selectedCases.first.x*32, 
                        scope.selectedCases.first.y*32, 
                        rectWidth*32, 
                        rectHeight*32
                    );
                }
      
            }
            
            scope.overCase = function($event){
                scope.updateMousePos($event);
                scope.highlightedCases.first = {
                    x:scope.mousePos.x,
                    y:scope.mousePos.y
                };
                if(scope.painting){
                    var formatedLastX = scope.selectedBlocks.last.x/32;
                    var formatedFirstX = scope.selectedBlocks.first.x/32;
                    var formatedRectWidth = formatedLastX-formatedFirstX;
                    var formatedLastY = scope.selectedBlocks.last.y/32;
                    var formatedFirstY = scope.selectedBlocks.first.y/32;
                    var formatedRectHeight = formatedLastY-formatedFirstY;
                    var size = {width:formatedRectWidth, height:formatedRectHeight};
                    scope.map.cover(scope.mousePos, scope.selectedBlocks, size);
                }
                if(scope.selecting && !scope.selectionDone){
                    scope.selectedCases.last={x:scope.mousePos.x, y:scope.mousePos.y};
                }
                if(scope.selecting && scope.selectionDone && scope.movingSelection){
                    var sizeW = scope.selectedCases.last.x-scope.selectedCases.first.x;
                    var sizeH = scope.selectedCases.last.y-scope.selectedCases.first.y;
                    scope.selectedCases.first={x:scope.mousePos.x, y:scope.mousePos.y};
                    scope.selectedCases.last={x:scope.selectedCases.first.x+sizeW, y:scope.selectedCases.first.y+sizeH};
                }
                scope.draw();
            }
            
            scope.finishedMovingSelection = function(){
                
                scope.movingSelection=false;
                
                var layer = scope.map.getCurrentMap();
                
                var size = {
                    width:scope.selectedCases.last.x-scope.selectedCases.first.x, 
                    height:scope.selectedCases.last.y-scope.selectedCases.first.y
                };
                
                var x1 = scope.casesToMove.first.x;
                var y1 = scope.casesToMove.first.y;
                
                var char = scope.char;
                var charPos = scope.char.getInitPos();
                
                var onCharCase = false;
                if(x1==charPos.x && y1==charPos.y) onCharCase=true;
                var i=0;
                var found=false;
                
                while(!found && i<scope.pnjs.length){
                    var pnjPos = scope.pnjs[i].getInitPos();
                    if(x1==pnjPos.x && y1==pnjPos.y) found=true;
                    else i++;
                }
                
                if(found){
                    onCharCase=true;
                    char=scope.pnjs[i];
                } 
                
                if(size.width==0 && size.height==0 && onCharCase){//If selecting Character, then move it
                    char.updateInitPos(scope.selectedCases.first.x, scope.selectedCases.first.y);
                    scope.selecting=false;
                }
                else{
                    for(var x2=scope.selectedCases.first.x; x2<=scope.selectedCases.last.x; x2++){//If selecting blocks, then copy it
                        for(var y2=scope.selectedCases.first.y; y2<=scope.selectedCases.last.y; y2++){
                            var content = (layer[x1][y1].content) ? layer[x1][y1].content : false;
                            scope.map.updateCaseContent({x:x2, y:y2}, content, layer[x1][y1].wall);
                            y1++;
                        }
                        x1++;
                        y1=scope.casesToMove.first.y;
                    }   
                }
        
            }
            
            scope.updateMousePos = function($event){
                var rect = canvas.getBoundingClientRect();
                scope.mousePos.x = $event.clientX - rect.left;
                scope.mousePos.y = $event.clientY - rect.top;
                scope.mousePos.x = parseInt(scope.mousePos.x/32);
                scope.mousePos.y = parseInt(scope.mousePos.y/32);
            }
            
            scope.startPainting = function(){
                scope.painting=true;
                var formatedLastX = scope.selectedBlocks.last.x/32;
                var formatedFirstX = scope.selectedBlocks.first.x/32;
                var formatedRectWidth = formatedLastX-formatedFirstX;
                var formatedLastY = scope.selectedBlocks.last.y/32;
                var formatedFirstY = scope.selectedBlocks.first.y/32;
                var formatedRectHeight = formatedLastY-formatedFirstY;
                var size = {width:formatedRectWidth, height:formatedRectHeight};
                scope.map.cover(scope.mousePos, scope.selectedBlocks, size);
                scope.draw();
            }
            
            scope.setMapInitPos = function(){
                
                var charPos = scope.char.getInitPos();
                var gameSize = Game.getSize();
                var mapSize = scope.map.getSize();
                var halfWidth = gameSize.width/2;
                var halfHeight = gameSize.height/2;
                var mapWidth = mapSize.width*32;
                var mapHeight = mapSize.height*32;
                var distanceMovedX = charPos.x*32;
                var distanceMovedY = charPos.y*32;
                
                for(var x=0; x<distanceMovedX; x++){
                    if(x>=halfWidth && x<=(mapWidth-halfWidth)){
                        scope.map.moveLeft(1);
                    } 
                }
                
                for(var y=0; y<distanceMovedY; y++){
                    if(y>=halfHeight && y<=(mapHeight-halfHeight)){
                        scope.map.moveUp(1);
                    }
                }
                
            }

            scope.outMap = function(){
                scope.painting=false;
                scope.highlightedCases={first:false, last:false};
                scope.draw();
            }
            
            scope.finishedPainting = function(){
                scope.painting=false;
            }
            
            scope.$on("refresh", scope.draw);
            
            scope.$on("createImageData", function(){
                
                scope.fill(canvas.width, canvas.height);
                scope.drawCases("save");
                scope.map.setImageData(
                    ctx.getImageData(
                        0, 0, 
                        scope.map.getSize().width*32, 
                        scope.map.getSize().height*32
                    )
                );
                
                scope.map.resetPos();
                scope.char.resetPos();
                scope.pnjs.forEach(function(pnj){pnj.resetPos()});
                scope.setMapInitPos();
            
            });
                                    
            scope.$watch('map.getSize()', function(){
                scope.draw();
            }, true);

        }
    }
});