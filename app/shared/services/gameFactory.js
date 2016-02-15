app.factory('Game', function(){
   
    var _tileset;
    var _map;
    var _char;
    var _width=1000;
    var _height=600;
    var _pnjs=[];
    
    function getSize(){
        return {width:_width, height:_height};
    }
    
    function setTileset(tileset){
        _tileset=tileset;
    }

    function setMap(map){
        _map=map;
    }
    
    function setCharacter(char){
        _char=char;
    }
    
    function setPNJ(newpnj){
        var i=0;
        var found=false;
        while(!found && i<_pnjs.length){
            if(_pnjs[i].id==newpnj.id) found=true;
            else i++;
        }
        _pnjs[i]=newpnj;
    }
    
    function getTileset(){
        return _tileset;
    }
    
    function getMap(){
        return _map;
    }
    
    function getCharacter(){
        return _char;
    }
    
    function getPNJs(){
        return _pnjs;
    }
    
    function addPNJ(pnj){
        _pnjs.push(pnj);
    }
    
    return {
        getSize: getSize,
        setTileset: setTileset,
        getTileset: getTileset,
        getCharacter: getCharacter,
        setCharacter: setCharacter,
        getPNJs: getPNJs,
        setPNJ: setPNJ,
        addPNJ: addPNJ,
        setMap: setMap,
        getMap: getMap
    }
    
});