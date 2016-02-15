app.factory("Keyboard", function(){
    
    var Keyboard = function(){
        
        var _this=this;
        this.keys={};
        
        document.onkeydown = function(e){
           _this.keys[e.which]=true;
        }
    
        document.onkeyup = function(e){
            delete _this.keys[e.which];
        }
    }
    
    Keyboard.prototype.getKeys = function(){
        return this.keys;
    }
    
    return Keyboard;
    
});
