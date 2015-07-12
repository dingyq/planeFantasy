
var CanvasMatrixModel = cc.Class.extend({
    _matrix:null,
    _headPointList:null,
    _xUnits:0,
    _yUnits:0,
    _targetsList:null,
    _targetNumInit:2,
    _targetNumExist:0,

    ctor:function(xU, yU){
        this._xUnits = xU;
        this._yUnits = yU;

        this.initModelData();
        return true;
    },

    initModelData:function(){
        this._targetNumExist = this.getTargetNumInit();
        this._targetsList = new Array(); //目标集合
        this._headPointList = new Array(); //目标头部集合

        this._matrix = new Array();
        for(var i = 0; i < this.getXUnits(); i++){
            this._matrix[i] = new Array();
            for(var j = 0; j < this.getYUnits(); j++){
                this._matrix[i][j] = 0;
            }
        }
    },

    getTargetNumInit:function(){
        return this._targetNumInit;
    },

    getXUnits:function(){
        return this._xUnits;
    },

    getYUnits:function(){
        return this._yUnits;
    },

    getTargetsList:function(){
        return this._targetsList;
    },

    getTargetsTypeList:function(){
        var targetTypeList = new Array();
        for (var i = 0; i < this.getTargetsList().length; i ++){
            targetTypeList.push(this.getTargetsList()[i].getTargetType());
        }
        return targetTypeList;
    },

    addTargetToList:function(targetM){
        this._targetsList.push(targetM);
    },


    addTargetToListByDetailProperty:function(direction, originPoint, targetType){
        //var tmpTarget;
//        if(targetType == null) {
//            tmpTarget = TargetModel.create(direction, originPoint);
//        }
        var model = TargetModel.create(direction, originPoint, targetType);
        //this.addTargetToListByModel(tmpTarget);

        if(this.checkTargetModelIsLegal(model)) {
            this.addTargetToList(model);
            this.markCoordinate(model);
            return true;
        } else {
            cc.log("add failed because of illegal target");
            return false;
        }
    },

    addTargetToListByModel:function(model){
        if(this.checkTargetModelIsLegal(model)) {
            this.addTargetToList(model);
            this.markCoordinate(model);
            return true;
        } else {
            cc.log("add failed because of illegal target");
            return false;
        }
    },

    markMatrixPoint:function(point){
        this._matrix[point.x][point.y] = 1;
    },

    getMatrix:function(){
        return this._matrix;
    },

    addToHeadPointList:function(point){
        this._headPointList.push(point);
    },

    getHeadPointList:function(){
        return this._headPointList;
    },

    isHeadPoint:function(point){
        for(var i = 0; i < this.getHeadPointList().length; i ++) {
            if (this.getHeadPointList()[i].isEqualToPoint(point)){
                return true;
            }
        }
        return false;
    },

    isPartPoint:function(point) {
        if(1 == this.getMatrix()[point.x][point.y]){
            return true;
        } else {
            return false;
        }
    },

    checkTargetModelIsLegal:function(targetNew){
        //check legality
        var targetWidth = targetNew.getWidth();
        var targetHeight = targetNew.getHeight();
        var targetOriginPoint = targetNew.getOriginPoint();
        var targetNewAbPartsSet = targetNew.getAbsolutePartsSet();

        //target 超出画布边界
        if(targetWidth+targetOriginPoint.x > this.getXUnits() || targetHeight+targetOriginPoint.y > this.getYUnits()){
            //cc.log("target illegal "+targetOriginPoint.x+" "+targetOriginPoint.y);
            return false;
        }

        var isNeighbored = false;
        if (0 == this.getTargetsList().length) isNeighbored = true;
        for(var i = 0; i < this.getTargetsList().length; i++) {
            var tmpTarget = this.getTargetsList()[i];
            // undo --
            cc.log("tmpTarget's headPoint is "+tmpTarget.getAbsoluteHeadPoint().formatToString());
            var existTargetAbPartsSet = tmpTarget.getAbsolutePartsSet();


            for(var j = 0; j < existTargetAbPartsSet.length; j++) {
                for(var k = 0; k < targetNewAbPartsSet.length; k++){
                    // 与已存在的目标位置存在冲突
                    if(Point.isEqualToPoint(targetNewAbPartsSet[k], existTargetAbPartsSet[j])){
                        return false;
                    }

                    // 与已存在的目标坐标不相连
                    if(Point.isNeighborToPoint(targetNewAbPartsSet[k], existTargetAbPartsSet[j])){
                        isNeighbored = true;
                    }
                }
            }
        }

        return isNeighbored;
    },

    markCoordinate:function(targetModel){
        var targetModelInfo = targetModel.getAbsolutePartsSet();
        for(var i = 0; i < targetModelInfo.length; i++){
            this.markMatrixPoint(targetModelInfo[i]);
        }
//        this.setHeadPoint(targetModel.getAbsoluteHeadPoint());
        this.addToHeadPointList(targetModel.getAbsoluteHeadPoint());
        cc.log("head x is "+targetModel.getAbsoluteHeadPoint().x+" y is "+targetModel.getAbsoluteHeadPoint().y);
    },

    randomTargets:function(){
        var tNum = this.getTargetNumInit();
        while(tNum > 0) {
            if(this.addTargetToListByDetailProperty(Helper.getRandomDirection(), Helper.getRandomOriginPoint(this.getXUnits(), this.getYUnits()), Helper.getRandomTargetType())) {
                tNum--;
            }
        }
    },

    resetModel:function(){
        this.initModelData();
        this.randomTargets();
    },

    targetHeadHit:function(paramPoint){
        cc.log("head point hited "+paramPoint.formatToString());
        if(--this._targetNumExist <= 0) {
            UpdateUIManager.getInstance().dispatch(NOTIFY.GAME_OVER);
        }
    },

    targetBodyHit:function(paramPoint){
        cc.log("head body hited "+paramPoint.formatToString());
    },
})
