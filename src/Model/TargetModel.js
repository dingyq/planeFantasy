DIRECTION = {
    LEFT:"left",
    RIGHT:"right",
    UP:"up",
    DOWN:"down"
}

TARGET_TYPE = {
    PLANE:"aircraft",
    TANK:"tank",
    CANNON:"cannon",
}

var Point = cc.Class.extend({
    x:0,
    y:0,

    ctor:function(x, y){
        this.x = x;
        this.y = y;
    },

    // 坐标相同
    isEqualToPoint:function(targetPoint){
        return (this.x == targetPoint.x && this.y == targetPoint.y)? true :false;
    },

    // 坐标相连
    isNeighborToPoint:function(targetPoint) {
        if (this.y == targetPoint.y) {
            if(this.x + 1 == targetPoint.x || this.x - 1 == targetPoint.x ){
                return true;
            }
        } else if (this.x == targetPoint.x){
            if(this.y + 1 == targetPoint.y || this.y - 1 == targetPoint.y ){
                return true;
            }
        }
        return false;
    },

    formatToString:function(){
//        cc.log("point (x,y) is ("+this.x+","this.y+")");
        return "(x, y) is ("+this.x+","+this.y+")";
    },
})

Point.isEqualToPoint = function(sourcePoint, targetPoint){
    return (sourcePoint.x == targetPoint.x && sourcePoint.y == targetPoint.y)? true :false;
}

Point.isNeighborToPoint = function(sourcePoint, targetPoint){
    if (sourcePoint.y == targetPoint.y) {
        if(sourcePoint.x + 1 == targetPoint.x || sourcePoint.x - 1 == targetPoint.x ){
            return true;
        }
    } else if (sourcePoint.x == targetPoint.x){
        if(sourcePoint.y + 1 == targetPoint.y || sourcePoint.y - 1 == targetPoint.y ){
            return true;
        }
    }
    return false;
}



var TargetModel = cc.Class.extend({
    _relativePartsSet:new Array(),
    _absolutePartsSet:new Array(),
    _direction:"",
    _relativeHeadPoint:null,
    _absoluteHeadPoint:null,
    _originPoint:null,
    _width:0,
    _height:0,
    _targetType:TARGET_TYPE.PLANE,

    ctor:function(direction, originPoint){
        this.setDirection(direction);
        this.setOriginPoint(originPoint);
        cc.log("TargetModel");
    },

    setDirection:function(direc){
        this._direction = direc;
    },

    getTargetType:function(){
        return this._targetType;
    },

    // 部件相对坐标
    getRelativePartsSet:function(){
        return this._relativePartsSet;
    },

    setRelativePartsSet:function(tmpSet){
        this._relativePartsSet = tmpSet;
    },

    // 部件绝对坐标
    setAbsolutePartsSet:function(tmpSet){
        this._absolutePartsSet = tmpSet;
    },

    getAbsolutePartsSet:function(){
        return this._absolutePartsSet;
    },

    // 头部相对坐标
    getRelativeHeadPoint:function(){
        return this._relativeHeadPoint;
    },

    setRelativeHeadPoint:function(point){
        this._relativeHeadPoint = point;
    },

    // 头部绝对坐标
    getAbsoluteHeadPoint:function(){
        return this._absoluteHeadPoint;
    },

    setAbsoluteHeadPoint:function(point){
        this._absoluteHeadPoint = point;
    },


    getWidth:function(){
        return this._width;
    },

    setWidth:function(wid){
        this._width = wid;
    },

    getHeight:function(){
        return this._height;
    },

    setHeight:function(heit){
        this._height = heit
    },

    getOriginPoint:function(){
        return this._originPoint;
    },

    setOriginPoint:function(point){
        this._originPoint = point;
    },

    generateAbsolutePartsSet:function(){
        var tmpAbSet = new Array();
        for(var i = 0; i < this.getRelativePartsSet().length; i++){
            var pp = this.getRelativePartsSet()[i];
            var tmpPoint = new Point(this.getOriginPoint().x + pp.x, this.getOriginPoint().y + pp.y);
            tmpAbSet.push(tmpPoint);
        }
        this.setAbsolutePartsSet(tmpAbSet);
    },

    generateAbsoluteHeadPoint:function(){
        var point = new Point(this.getRelativeHeadPoint().x+this.getOriginPoint().x, this.getRelativeHeadPoint().y+this.getOriginPoint().y);
        this.setAbsoluteHeadPoint(point);
    },

    initModelData:function(relativeList){
        this.setRelativePartsSet(relativeList);
        this.generateAbsolutePartsSet();
        this.generateAbsoluteHeadPoint();
    },

    updateModelData:function(point){
        this.setOriginPoint(point);
        this.generateAbsolutePartsSet();
        this.generateAbsoluteHeadPoint();
    },

    //updateOriginPoint:function(point){
    //    this._originPoint = point;
    //},
})

TargetModel.create = function(direction, originPoint, targetType){

    cc.log("targetType is " +targetType)
    if(TARGET_TYPE.PLANE == targetType){
        return new AircraftModel(direction, originPoint);
    } else if(TARGET_TYPE.TANK == targetType) {
        return new TankModel(direction, originPoint);
    } else if(TARGET_TYPE.CANNON == targetType) {
        return new CannonModel(direction, originPoint);
    } else {
        return new TankModel(direction, originPoint);
    }
}

var TankModel = TargetModel.extend({
    _targetType:TARGET_TYPE.TANK,

    ctor:function(direction, originPoint){
        this._super(direction, originPoint);

//        var tmpHeadPoint = new Point(0,0);
//        var width = 4;
//        var height = 3;
        var tmpReSet = new Array();
        if (DIRECTION.LEFT == direction) {
            tmpReSet.push(new Point(1,0));
            tmpReSet.push(new Point(2,0));
            tmpReSet.push(new Point(3,0));
            tmpReSet.push(new Point(0,1));
            tmpReSet.push(new Point(1,1));
            tmpReSet.push(new Point(1,2));
            tmpReSet.push(new Point(2,2));
            tmpReSet.push(new Point(3,2));

            this.setRelativeHeadPoint(new Point(0,1));
            this.setWidth(4);
            this.setHeight(3);
        } else if(DIRECTION.RIGHT == direction) {
            tmpReSet.push(new Point(0,0));
            tmpReSet.push(new Point(1,0));
            tmpReSet.push(new Point(2,0));
            tmpReSet.push(new Point(0,2));
            tmpReSet.push(new Point(1,2));
            tmpReSet.push(new Point(2,2));
            tmpReSet.push(new Point(2,1));
            tmpReSet.push(new Point(3,1));

            this.setRelativeHeadPoint(new Point(3,1));
            this.setWidth(4);
            this.setHeight(3);

        } else if(DIRECTION.UP == direction) {
            tmpReSet.push(new Point(0,0));
            tmpReSet.push(new Point(0,1));
            tmpReSet.push(new Point(0,2));
            tmpReSet.push(new Point(2,0));
            tmpReSet.push(new Point(2,1));
            tmpReSet.push(new Point(2,2));
            tmpReSet.push(new Point(1,2));
            tmpReSet.push(new Point(1,3));

            this.setRelativeHeadPoint(new Point(1,3));
            this.setWidth(3);
            this.setHeight(4);
        } else if(DIRECTION.DOWN == direction) {
            tmpReSet.push(new Point(0,1));
            tmpReSet.push(new Point(0,2));
            tmpReSet.push(new Point(0,3));
            tmpReSet.push(new Point(1,0));
            tmpReSet.push(new Point(1,1));
            tmpReSet.push(new Point(2,1));
            tmpReSet.push(new Point(2,2));
            tmpReSet.push(new Point(2,3));

            this.setRelativeHeadPoint(new Point(1,0));
            this.setWidth(3);
            this.setHeight(4);
        }
        this.initModelData(tmpReSet);
        return true;
    }
})

var AircraftModel = TargetModel.extend({
    _targetType:TARGET_TYPE.PLANE,

    ctor:function(direction, originPoint){
        this._super(direction, originPoint);

        var tmpReSet = new Array();
        if (DIRECTION.LEFT == direction) {
            tmpReSet.push(new Point(1,0));
            tmpReSet.push(new Point(3,0));
            tmpReSet.push(new Point(0,1));
            tmpReSet.push(new Point(1,1));
            tmpReSet.push(new Point(2,1));
            tmpReSet.push(new Point(3,1));
            tmpReSet.push(new Point(1,2));
            tmpReSet.push(new Point(3,2));

            this.setRelativeHeadPoint(new Point(0,1));
            this.setWidth(4);
            this.setHeight(3);
        } else if(DIRECTION.RIGHT == direction) {
            tmpReSet.push(new Point(0,0));
            tmpReSet.push(new Point(2,0));
            tmpReSet.push(new Point(0,1));
            tmpReSet.push(new Point(1,1));
            tmpReSet.push(new Point(2,1));
            tmpReSet.push(new Point(3,1));
            tmpReSet.push(new Point(0,2));
            tmpReSet.push(new Point(2,2));

            this.setRelativeHeadPoint(new Point(3,1));
            this.setWidth(4);
            this.setHeight(3);
        } else if(DIRECTION.UP == direction) {
            tmpReSet.push(new Point(0,0));
            tmpReSet.push(new Point(1,0));
            tmpReSet.push(new Point(2,0));
            tmpReSet.push(new Point(1,1));
            tmpReSet.push(new Point(0,2));
            tmpReSet.push(new Point(1,2));
            tmpReSet.push(new Point(2,2));
            tmpReSet.push(new Point(1,3));

            this.setRelativeHeadPoint(new Point(1,3));
            this.setWidth(3);
            this.setHeight(4);
        } else if(DIRECTION.DOWN == direction) {
            tmpReSet.push(new Point(1,0));
            tmpReSet.push(new Point(0,1))
            tmpReSet.push(new Point(1,1));
            tmpReSet.push(new Point(2,1));
            tmpReSet.push(new Point(1,2));
            tmpReSet.push(new Point(0,3));
            tmpReSet.push(new Point(1,3));
            tmpReSet.push(new Point(2,3));

            this.setRelativeHeadPoint(new Point(1,0));
            this.setWidth(3);
            this.setHeight(4);
        }
        this.initModelData(tmpReSet);
        return true;
    }
})

var CannonModel = TargetModel.extend({
    _targetType:TARGET_TYPE.CANNON,

    ctor:function(direction, originPoint){
        this._super(direction, originPoint);
        var tmpReSet = new Array();
        if (DIRECTION.LEFT == direction) {
            tmpReSet.push(new Point(1,0));
            tmpReSet.push(new Point(3,0));
            tmpReSet.push(new Point(0,1));
            tmpReSet.push(new Point(1,1));
            tmpReSet.push(new Point(2,1));
            tmpReSet.push(new Point(1,2));
            tmpReSet.push(new Point(3,2));

            this.setRelativeHeadPoint(new Point(0,1));
            this.setWidth(4);
            this.setHeight(3);
        } else if(DIRECTION.RIGHT == direction) {
            tmpReSet.push(new Point(0,0));
            tmpReSet.push(new Point(2,0));
            tmpReSet.push(new Point(1,1));
            tmpReSet.push(new Point(2,1));
            tmpReSet.push(new Point(3,1));
            tmpReSet.push(new Point(0,2));
            tmpReSet.push(new Point(2,2));

            this.setRelativeHeadPoint(new Point(3,1));
            this.setWidth(4);
            this.setHeight(3);
        } else if(DIRECTION.UP == direction) {
            tmpReSet.push(new Point(0,0));
            tmpReSet.push(new Point(2,0));
            tmpReSet.push(new Point(1,1));
            tmpReSet.push(new Point(0,2));
            tmpReSet.push(new Point(1,2));
            tmpReSet.push(new Point(2,2));
            tmpReSet.push(new Point(1,3));

            this.setRelativeHeadPoint(new Point(1,3));
            this.setWidth(3);
            this.setHeight(4);
        } else if(DIRECTION.DOWN == direction) {
            tmpReSet.push(new Point(1,0));
            tmpReSet.push(new Point(0,1))
            tmpReSet.push(new Point(1,1));
            tmpReSet.push(new Point(2,1));
            tmpReSet.push(new Point(1,2));
            tmpReSet.push(new Point(0,3));
            tmpReSet.push(new Point(2,3));

            this.setRelativeHeadPoint(new Point(1,0));
            this.setWidth(3);
            this.setHeight(4);
        }
        this.initModelData(tmpReSet);


        return true;
    }
})

