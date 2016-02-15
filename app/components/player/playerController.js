app.controller("playerController", function($scope, $location, $interval, Game, Keyboard){

    $scope.map = Game.getMap();
    $scope.char = Game.getCharacter();
    $scope.pnjs = Game.getPNJs();
    $scope.keyboard = new Keyboard();
    
    $scope.checkKeys = function(){
        
        var keys = $scope.keyboard.getKeys();
        if(keys[39]){
            $scope.char.moveRight();
            $scope.moveCamera();
        }
        else if(keys[37]){
            $scope.char.moveLeft();
            $scope.moveCamera();
        }
        else if(keys[38]){
            $scope.char.moveUp();
            $scope.moveCamera();
        }
        else if(keys[40]){
            $scope.char.moveDown();
            $scope.moveCamera();
        }
        else $scope.char.resetAnim();
        
    }
    
    $scope.edit = function(){
        $interval.cancel($scope.main);
        $location.path("/");
    }
    
    $scope.moveCamera = function(){
        
        var charPos = $scope.char.getPos();
        var charSpeed = $scope.char.getSpeed();
        var gameSize = Game.getSize();
        var mapSize = $scope.map.getSize();
        var halfWidth = gameSize.width/2;
        var halfHeight = gameSize.height/2;
        var mapWidth = mapSize.width*32;
        var mapHeight = mapSize.height*32;
        
        if(charPos.x>=halfWidth && charPos.x<=(mapWidth-halfWidth) && !$scope.char.isBlockedByWall()){
            if($scope.char.getDir()==1) $scope.map.moveRight(charSpeed);
            else if($scope.char.getDir()==2) $scope.map.moveLeft(charSpeed);
        } 
        if(charPos.y>=halfHeight && charPos.y<=(mapHeight-halfHeight) && !$scope.char.isBlockedByWall()){
            if($scope.char.getDir()==0) $scope.map.moveUp(charSpeed);
            else if($scope.char.getDir()==3) $scope.map.moveDown(charSpeed);
        }
        
    }
    
    $scope.mainLoop = function(){
        $scope.checkKeys();
        $scope.pnjs.forEach(function(pnj){pnj.automove()});
        $scope.$broadcast("refresh");
    }
    
    $scope.main = $interval($scope.mainLoop, 20);
    
});