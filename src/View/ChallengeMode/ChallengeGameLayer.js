/**
 * Created by bigqiang on 15/6/27.
 */
var ChallengeGameLayer = BaseLayer.extend({
    _zoomOutScale:1,
    _selectedTargetModel:null,
    _canvasMatrixM:null,
    _gap:2,
    _sprWidth:52,
    _sprHeight:52,
    _xUnits:0,
    _yUnits:0,
    _targetCount:2,
    _gameContentLayer:null,
    _touchLayer:null,

    ctor:function(xUnit, yUnit){
        this._super();
        this._targetCount = 2;
        this.setOpacity(0);
        this.setXUnitsNum(xUnit);
        this.setYUnitsNum(yUnit);

    },

    onEnter:function(){
        this._super();

        this.generateCanvasMatrixModel();
        this.createGameContentLayer();
        this.createTouchLayer();
    },

    onExit:function(){
        this._super();
    },

    resetTargetCount:function(){
        this._targetCount = 2;
    },

    getIsAllTargetPlaced:function(){
        return this._targetCount > 0;
    },

    getXUnitsNum:function(){
        return this._xUnits;
    },

    setXUnitsNum:function(units){
        this._xUnits = units;
    },

    getYUnitsNum:function(){
        return this._yUnits;
    },

    setYUnitsNum:function(units){
        this._yUnits = units;
    },

    getZoomOutScale:function(){
        return this._zoomOutScale;
    },

    setSelectedTargetModel:function(model){
        this._selectedTargetModel = model;
    },

    getSelectedTargetModel:function(){
        return this._selectedTargetModel;
    },

    // 获取布局后target点
    getLayoutTargetsPointsList:function(){
        var bodyPointsList = new Array();
        var headPointsList = new Array();
        var modelList = this._canvasMatrixM.getTargetsList();
        for(var i = 0; i < modelList.length; i ++) {
            var pointList = modelList[i].getAbsolutePartsSet();
            pointList.forEach(function(value){
                bodyPointsList.push(value);
            });
            var head = modelList[i].getAbsoluteHeadPoint();
            headPointsList.push(head);
        }

        return {
            bodyList:bodyPointsList,
            headList:headPointsList,
        };
    },

    updateSelectedTargetModel:function(model){
        this.setSelectedTargetModel(model);
        this._touchLayer.updateSelectedModel(model);
    },

    // 布局结束后，重新初始化界面
    layoutTargetsDone:function(){
        var result = this.getLayoutTargetsPointsList();
        //cc.log("layoutTargetDone " + JSON.stringify(result));
        for(var i = 0; i < this.getXUnitsNum(); i++){
            for(var j = 0; j < this.getYUnitsNum(); j++){
                var sprTag = i*100+j+1;
                var tmpSpr = this._gameContentLayer.getChildByTag(sprTag);
                if (null != tmpSpr){
                    var jump = cc.rotateBy(0.3, 0, -90);
                    var jump1 = cc.rotateBy(0.3, 0, -90);
                    var dataConfig = {
                        part:this._canvasMatrixM.isPartPoint(new Point(i, j)),
                        head:this._canvasMatrixM.isHeadPoint(new Point(i, j)),
                    }
                    tmpSpr.runAction(cc.sequence(cc.delayTime(this.getYUnitsNum()*0.05 + 0.05*i - 0.05*j), jump, cc.callFunc(function(target, dataC){
                        target.setCanTouched(true);
                        target.resetState(dataC.part, dataC.head);
                    }, tmpSpr, dataConfig), jump1));
                }
            }
        }
    },

    // 放置选中的target
    selectedModelPlaced:function(model){
        if(this._targetCount <= 0){
            var pointList = model.getAbsolutePartsSet();
            for(var i = 0; i < pointList.length; i ++){
                var sprTag = pointList[i].x*100+pointList[i].y+1;
                var tmpSpr = this._gameContentLayer.getChildByTag(sprTag);
                if (null != tmpSpr){
                    tmpSpr.showLayoutTip(false);
                }
            }
            return
        };

        var isLegal = this._canvasMatrixM.checkTargetModelIsLegal(model);
        if (isLegal) {
            this._canvasMatrixM.addTargetToListByModel(model);
            this._targetCount --;
        } else {

        }

        var modelList = this._canvasMatrixM.getTargetsList();
        for(var i = 0; i < modelList.length; i ++){
            var pointList = modelList[i].getAbsolutePartsSet();
            var head = modelList[i].getAbsoluteHeadPoint();
            for (var j = 0; j < pointList.length; j++){
                //cc.log("model idx"+i+"  point x,y is "+pointList[j].x+"  "+pointList[j].y);
                var sprTag = pointList[j].x*100+pointList[j].y+1;
                var tmpSpr = this._gameContentLayer.getChildByTag(sprTag);
                if (null != tmpSpr){
                    tmpSpr.setCanTouched(true);
                    tmpSpr.setIsPart(true);
                    if(pointList[j].isEqualToPoint(head)) {
                        tmpSpr.setIsHead(true);
                    }
                    tmpSpr.setIsPlaced(true);
                    tmpSpr.showStatus();
                    //this._canvasMatrixM.isPartPoint(new Point(i, j)), this._canvasMatrixM.isHeadPoint(new Point(i,j))
                }
            }
        }
    },

    // 移动拖放过程中判断位置是否合法
    checkTargetModelPlacingLegality:function(model){
        return this._canvasMatrixM.checkTargetModelIsLegal(model);
    },

    generateCanvasMatrixModel:function(){
        this._canvasMatrixM = new CanvasMatrixModel(this.getXUnitsNum(), this.getYUnitsNum());// the canvas data model
        //this._canvasMatrixM.randomTargets();
    },

    getCanvasMatrixM:function(){
        return this._canvasMatrixM;
    },

    // 彻底重新清除界面
    resetGameLayerComplete:function(){
        // reset interface
        //this.resetGameLayerByModelList(this._canvasMatrixM.getTargetsList());
        this.initPlayCanvas();
        this.resetTargetCount();
        // reset model
        this._canvasMatrixM.clearTargetsList();
    },

    // 重新清除界面
    resetGameLayer:function(){
        // reset interface
        this.resetGameLayerByModelList(this._canvasMatrixM.getTargetsList());
        this.resetTargetCount();
        // reset model
        this._canvasMatrixM.clearTargetsList();
    },

    // 根据已选数据model定向清空点阵
    resetGameLayerByModelList:function(modelList){
        for(var i = 0; i < modelList.length; i ++){
            var pointList = modelList[i].getAbsolutePartsSet();
            for (var j = 0; j < pointList.length; j++){
                //cc.log("model idx"+i+"  point x,y is "+pointList[j].x+"  "+pointList[j].y);
                var sprTag = pointList[j].x*100+pointList[j].y+1;
                var tmpSpr = this._gameContentLayer.getChildByTag(sprTag);
                if (null != tmpSpr){
                    //var jump = cc.jumpBy(0.3, cc.p(0,10));
                    var jump = cc.rotateBy(0.3, 0, -90);
                    var jump1 = cc.rotateBy(0.3, 0, -90);
                    tmpSpr.runAction(cc.sequence(jump, cc.callFunc(function(){
                        this.setCanTouched(false);
                        this.resetState();
                    }, tmpSpr), jump1));
                }
            }
        }
    },

    // 创建基本点阵
    createGameContentLayer:function(){
        var size = cc.winSize;
        // the _gameContentLayer, use to add to scrollView in future.
        this._gameContentLayer= new cc.Layer();
        var blContentSize = cc.size(this.getXUnitsNum()*this._sprWidth+(this.getXUnitsNum()-1)*this._gap, this.getYUnitsNum()*this._sprHeight+(this.getYUnitsNum()-1)*this._gap);
        this._gameContentLayer.setContentSize(blContentSize);
        this._gameContentLayer.setScale(this.getZoomOutScale());
        this._gameContentLayer.setPosition(size.width/2 - blContentSize.width/2,size.height/2 - blContentSize.height/2);
        this.addChild(this._gameContentLayer);

        this.initPlayCanvas();
    },

    // 初始化点阵
    initPlayCanvas:function(){
        for(var i = 0; i < this.getXUnitsNum(); i++){
            for(var j = 0; j < this.getYUnitsNum(); j++){
                var sprTag = i*100+j+1;
                var tmpSpr = this._gameContentLayer.getChildByTag(sprTag);
                if (null == tmpSpr){
                    tmpSpr = PieceField.factoryCreate();
                    tmpSpr.setCanTouched(false);
                    //this._canvasMatrixM.isPartPoint(new Point(i, j)), this._canvasMatrixM.isHeadPoint(new Point(i,j))
                    tmpSpr.setTag(sprTag);
                    var posi = cc.p(i*(this._sprWidth+this._gap)+this._sprWidth/2, j*(this._sprHeight+this._gap)+this._sprHeight/2);
                    tmpSpr.setPosition(posi);
                    this._gameContentLayer.addChild(tmpSpr);
                } else {
                    tmpSpr.setCanTouched(false);
                    tmpSpr.resetState();
                    //this._canvasMatrixM.isPartPoint(new Point(i, j)), this._canvasMatrixM.isHeadPoint(new Point(i,j))
                }
            }
        }
    },

    createTouchLayer:function() {
        this._touchLayer = new TouchLayer(this._gameContentLayer.getContentSize(), this.getXUnitsNum(), this.getYUnitsNum());
        this._touchLayer.setDelegate(this._gameContentLayer);
        this._gameContentLayer.addChild(this._touchLayer, this.getXUnitsNum()*this.getYUnitsNum()+10);
    },

    gameOverHandle:function(){
        cc.log("gameOverHandle");
        var targetsList = this._canvasMatrixM.getTargetsList();
        for(var i = 0; i < targetsList.length; i ++) {
            var tmpPointList = targetsList[i].getAbsolutePartsSet();
            for(var j = 0; j < tmpPointList.length; j++) {
                var sprTag = parseInt(tmpPointList[j].x)*100 + parseInt(tmpPointList[j].y) + 1;
                var tmpSpr = this._gameContentLayer.getChildByTag(sprTag);
                tmpSpr.showStatus();
            }
        }
    },
})