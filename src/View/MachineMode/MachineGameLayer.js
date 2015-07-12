
var MachineGameLayer = BaseLayer.extend({
    _className:"MachineGameLayer",
    canvasMatrixM:null,
    gameStatusLayer:null,
    gameContentLayer:null,
    _targetTryHitNum:0,
    _targetSuccessHitNum:0,
    _xUnits:0,
    _yUnits:0,
    _zoomOutScale:1,
    _gap:2,
    _sprWidth:52,
    _sprHeight:52,

    ctor:function(xUnitsCanvas, yUnitsCanvas){
        this._super();
        this.setXUnitsNum(xUnitsCanvas);
        this.setYUnitsNum(yUnitsCanvas);

        this.generateCanvasMatrixModel();
        this.addGameContentLayer();
        this.addGameStatusLayer();
        this.addTargetTypeTipLayer();

        return true;
    },

    onEnter:function(){
        this._super();
        UpdateUIManager.getInstance().addPageUpdateListeners(NOTIFY.TARGET_HEAD_HIT, this.targetHeadHit, this);
        UpdateUIManager.getInstance().addPageUpdateListeners(NOTIFY.TARGET_BODY_HIT, this.targetBodyHit, this);
        UpdateUIManager.getInstance().addPageUpdateListeners(NOTIFY.TARGET_TRY_HIT, this.countTargetTryHit, this);
    },

    onExit:function(){
        UpdateUIManager.getInstance().removeListeners(NOTIFY.TARGET_HEAD_HIT);
        UpdateUIManager.getInstance().removeListeners(NOTIFY.TARGET_BODY_HIT);
        UpdateUIManager.getInstance().removeListeners(NOTIFY.TARGET_TRY_HIT);
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

    addTargetTypeTipLayer:function(){
        this.targetTypeTipL = new TargetTypeTipLayer(this.canvasMatrixM.getTargetsTypeList());
        this.targetTypeTipL.setScale(0.6)
        this.addChild(this.targetTypeTipL);
    },

    addGameStatusLayer:function(){
        this.gameStatusLayer = new GameStatus();
        this.addChild(this.gameStatusLayer);
    },

    generateCanvasMatrixModel:function(){
        this.canvasMatrixM = new CanvasMatrixModel(this.getXUnitsNum(), this.getYUnitsNum());// the canvas data model
        this.canvasMatrixM.randomTargets();
    },

    addGameContentLayer:function(){
        var size = cc.winSize;
        // the gameContentLayer, use to add to scrollView in future.
        this.gameContentLayer= new cc.Layer();
        var blContentSize = cc.size(this.getXUnitsNum()*this._sprWidth+(this.getXUnitsNum()-1)*this._gap, this.getYUnitsNum()*this._sprHeight+(this.getYUnitsNum()-1)*this._gap);
        this.gameContentLayer.setContentSize(blContentSize);
        this.gameContentLayer.setScale(this.getZoomOutScale());
        this.gameContentLayer.setPosition(size.width/2 - blContentSize.width/2,size.height/2 - blContentSize.height/2);
        //this.gameContentLayer.setPosition(size.width - blContentSize.width-30,size.height/2 - blContentSize.height/2);
        this.addChild(this.gameContentLayer);

        this.drawPieceFieldOnContentLayer();
    },

    drawPieceFieldOnContentLayer:function(){
        for(var i = 0; i < this.getXUnitsNum(); i++){
            for(var j = 0; j < this.getYUnitsNum(); j++){
                var sprTag = i*100+j;
                var tmpSpr = this.gameContentLayer.getChildByTag(sprTag);
                if (null == tmpSpr){
                    tmpSpr = PieceField.factoryCreate(this.canvasMatrixM.isPartPoint(new Point(i, j)), this.canvasMatrixM.isHeadPoint(new Point(i,j)));
                    tmpSpr.setTag(sprTag);
                    var posi = cc.p(i*(this._sprWidth+this._gap)+this._sprWidth/2, j*(this._sprHeight+this._gap)+this._sprHeight/2);
                    tmpSpr.setPosition(posi);
                    this.gameContentLayer.addChild(tmpSpr);
                } else {
                    tmpSpr.resetState(this.canvasMatrixM.isPartPoint(new Point(i, j)), this.canvasMatrixM.isHeadPoint(new Point(i,j)));
                }
            }
        }
    },

    gameOverHandle:function(){
        cc.log("gameOverHandle");
        var targetsList = this.canvasMatrixM.getTargetsList();
        for(var i = 0; i < targetsList.length; i ++) {
            var tmpPointList = targetsList[i].getAbsolutePartsSet();
            for(var j = 0; j < tmpPointList.length; j++) {
                var sprTag = parseInt(tmpPointList[j].x)*100 + parseInt(tmpPointList[j].y);
                var tmpSpr = this.gameContentLayer.getChildByTag(sprTag);
                tmpSpr.showStatus();
            }
        }
    },

    resetGameLayer:function(){
        cc.log("resetGameLayer");
        this.setTargetTryHitNum(0);
        this.setTargetSuccessHitNum(0);
        this.canvasMatrixM.resetModel();
        this.drawPieceFieldOnContentLayer();

        this.targetTypeTipL.updateTargetTips(this.canvasMatrixM.getTargetsTypeList());
    },

    setTargetTryHitNum:function(param){
        if(0==param){
            this._targetTryHitNum = 0;
        } else {
            this._targetTryHitNum++;
        }
        this.gameStatusLayer.updateTryNumTip(this._targetTryHitNum);
    },

    setTargetSuccessHitNum:function(param){
        if(0==param){
            this._targetSuccessHitNum = 0;
        } else {
            this._targetSuccessHitNum++;
        }
        this.gameStatusLayer.updateSuccessNumTip(this._targetSuccessHitNum);
    },

    countTargetSuccessHit:function(){
        this.setTargetSuccessHitNum(1);
    },

    countTargetTryHit:function(){
        this.setTargetTryHitNum(1);
    },


    targetHeadHit:function(positionTag){
        this.countTargetSuccessHit();
        var point = new Point(Math.floor(positionTag/100), Math.floor(positionTag%100));
        this.canvasMatrixM.targetHeadHit(point);
    },

    targetBodyHit:function(positionTag){
        this.countTargetSuccessHit();
        var point = new Point(Math.floor(positionTag/100), Math.floor(positionTag%100));
        this.canvasMatrixM.targetBodyHit(point);
    },
})