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

    ctor:function(xUnit, yUnit){
        this._super();

        this._targetCount = 2;
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

    updateSelectedTargetModel:function(model){
        this.setSelectedTargetModel(model);
        this.touchLayer.updateSelectedModel(model);
    },

    selectedModelPlaced:function(model){
        if(this._targetCount <= 0){
            var pointList = model.getAbsolutePartsSet();
            for(var i = 0; i < pointList.length; i ++){
                var sprTag = pointList[i].x*100+pointList[i].y+1;
                var tmpSpr = this.gameContentLayer.getChildByTag(sprTag);
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
            for (var j = 0; j < pointList.length; j++){
                cc.log("model idx"+i+"  point x,y is "+pointList[j].x+"  "+pointList[j].y);
                var sprTag = pointList[j].x*100+pointList[j].y+1;
                var tmpSpr = this.gameContentLayer.getChildByTag(sprTag);
                if (null != tmpSpr){
                    tmpSpr.setCanTouched(true);
                    tmpSpr.setIsPart(true);
                    tmpSpr.setIsPlaced(true);
                    tmpSpr.showStatus();
                    //this._canvasMatrixM.isPartPoint(new Point(i, j)), this._canvasMatrixM.isHeadPoint(new Point(i,j))
                }
            }
        }
    },

    checkTargetModelPlacingLegality:function(model){
        return this._canvasMatrixM.checkTargetModelIsLegal(model);
    },

    generateCanvasMatrixModel:function(){
        this._canvasMatrixM = new CanvasMatrixModel(this.getXUnitsNum(), this.getYUnitsNum());// the canvas data model
        //this._canvasMatrixM.randomTargets();
    },

    createGameContentLayer:function(){
        var size = cc.winSize;
        // the gameContentLayer, use to add to scrollView in future.
        this.gameContentLayer= new cc.Layer();
        var blContentSize = cc.size(this.getXUnitsNum()*this._sprWidth+(this.getXUnitsNum()-1)*this._gap, this.getYUnitsNum()*this._sprHeight+(this.getYUnitsNum()-1)*this._gap);
        this.gameContentLayer.setContentSize(blContentSize);
        this.gameContentLayer.setScale(this.getZoomOutScale());
        this.gameContentLayer.setPosition(size.width/2 - blContentSize.width/2,size.height/2 - blContentSize.height/2);
        this.addChild(this.gameContentLayer);

        this.initPlayCanvas();
    },

    initPlayCanvas:function(){
        for(var i = 0; i < this.getXUnitsNum(); i++){
            for(var j = 0; j < this.getYUnitsNum(); j++){
                var sprTag = i*100+j+1;
                var tmpSpr = this.gameContentLayer.getChildByTag(sprTag);
                if (null == tmpSpr){
                    tmpSpr = PieceField.factoryCreate();
                    tmpSpr.setCanTouched(false);
                    //this._canvasMatrixM.isPartPoint(new Point(i, j)), this._canvasMatrixM.isHeadPoint(new Point(i,j))
                    tmpSpr.setTag(sprTag);
                    var posi = cc.p(i*(this._sprWidth+this._gap)+this._sprWidth/2, j*(this._sprHeight+this._gap)+this._sprHeight/2);
                    tmpSpr.setPosition(posi);
                    this.gameContentLayer.addChild(tmpSpr);
                } else {
                    tmpSpr.resetState();
                    //this._canvasMatrixM.isPartPoint(new Point(i, j)), this._canvasMatrixM.isHeadPoint(new Point(i,j))
                }
            }
        }
    },

    createTouchLayer:function() {
        this.touchLayer = new TouchLayer(this.gameContentLayer.getContentSize(), this.getXUnitsNum(), this.getYUnitsNum());
        this.touchLayer.setDelegate(this.gameContentLayer);
        this.gameContentLayer.addChild(this.touchLayer, this.getXUnitsNum()*this.getYUnitsNum()+10);

    },
})