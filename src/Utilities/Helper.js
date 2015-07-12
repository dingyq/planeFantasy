
var Helper = cc.Class.extend({

    ctor:function(){
        return true;
    }
})

Helper.getRandomDirection = function(){
    switch(Math.ceil(Math.random()*4)){
        case 1:
            return DIRECTION.UP;
        case 2:
            return DIRECTION.DOWN;
        case 3:
            return DIRECTION.LEFT;
        case 4:
            return DIRECTION.RIGHT;
        default:
            return DIRECTION.UP;
    }
}

Helper.getRandomOriginPoint = function(xEdge, yEdge){
    var xPosi = Math.floor(Math.random()*(xEdge-4));
    var yPosi = Math.floor(Math.random()*(yEdge-4));
    return new Point(xPosi, yPosi);
}

Helper.getRandomTargetType = function(){
    switch(Math.ceil(Math.random()*3)){
        case 1:
            return TARGET_TYPE.PLANE;
        case 2:
            return TARGET_TYPE.TANK;
        case 3:
            return TARGET_TYPE.CANNON;
        default:
            return TARGET_TYPE.PLANE;
    }
}