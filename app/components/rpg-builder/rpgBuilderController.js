app.controller("rpgBuilderController", function($scope, $location, Game, Tileset, Map, Character){
    
    $scope.selectedBlocks={first:false, last:false};
    $scope.lastSelectedBlocks={first:{x:0, y:0}, last:{x:32, y:32}};
    $scope.map = (Game.getMap()) ? Game.getMap() : new Map(32, 19);
    $scope.char = (Game.getCharacter()) ? Game.getCharacter() : new Character("main", "assets/img/charset/default.png", 0, 0);
    $scope.mapSize = {width:$scope.map.getSize().width, height:$scope.map.getSize().height};
    $scope.gameSize = Game.getSize();
    $scope.layer = $scope.map.getCurrentLayer();
    $scope.settingWalls = false;
    
    $scope.tileset = (Game.getTileset()) ? Game.getTileset() : new Tileset("assets/img/tileset/main.png", 256, 1024);
    $scope.blocks = $scope.tileset.getBlocks();
    
    $scope.pnjs = Game.getPNJs();
    if($scope.pnjs.length==0){
        Game.addPNJ(new Character("pnj1", "assets/img/charset/girl1.png", 5, 2));
        Game.addPNJ(new Character("pnj2", "assets/img/charset/girl2.png", 7, 12));
        Game.addPNJ(new Character("pnj3", "assets/img/charset/boy2.png", 9, 5));
    }
        
    $scope.blockSelection = function($event, block){
        if($event.which==1){
            if($scope.settingWalls){
                $scope.tileset.toggleWall(block);
            }
            else{
                $scope.blocks.forEach(function(block){
                    block.selected=false;
                });
                block.over=false;
                block.selected=true;
                $scope.selectedBlocks.first=block;
                $scope.selectedBlocks.last=false;
                $scope.lastSelectedBlocks={
                    first:$scope.selectedBlocks.first, 
                    last:{x:$scope.selectedBlocks.first.x+32, y:$scope.selectedBlocks.first.y+32}
                };
            }
            
        }
    }
    
    $scope.overBlock = function(block){
        if($scope.selectedBlocks.first){
            $scope.selectedBlocks.last=block;
            $scope.selectedBlocks.last.selected=true;
            $scope.blocks.forEach(function(block){
                if(
                    block.x>=$scope.selectedBlocks.first.x && 
                    block.x<=$scope.selectedBlocks.last.x && 
                    block.y>=$scope.selectedBlocks.first.y && 
                    block.y<=$scope.selectedBlocks.last.y
                ){
                    block.selected=true;
                    $scope.lastSelectedBlocks={
                        first:$scope.selectedBlocks.first, 
                        last:{x:$scope.selectedBlocks.last.x+32, y:$scope.selectedBlocks.last.y+32}
                    };
                }
                else block.selected=false;
            });
        }
        else block.over=true;
    }
    
    $scope.leaveBlock = function(block){
        if(!$scope.selectedBlocks.first) block.over=false;
    }
    
    $scope.paintAll = function(){
        $scope.map.fullfill($scope.lastSelectedBlocks.first);
        $scope.$broadcast("refresh");
    }
    
    $scope.erase = function(){
        $scope.map.empty();
        $scope.$broadcast("refresh");
    }
    
    $scope.updateLayer = function(layer){
        $scope.map.updateCurrentLayer(layer);
        $scope.$broadcast("refresh");
    }
    
    $scope.play = function(){
        $scope.$broadcast("createImageData");
        $location.path('player');
    }
        
    $scope.$watch('mapSize', function(newValue, oldValue){
        var diff={width:newValue.width-oldValue.width, height:newValue.height-oldValue.height};
        $scope.map.updateSize(diff);
        var charPos = $scope.char.getInitPos();
        if(charPos.x>=newValue.width || charPos.y>=newValue.height) $scope.char.updateInitPos(0, 0);
    }, true);

    
});