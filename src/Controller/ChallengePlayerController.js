/**
 * Created by bigqiang on 15/6/27.
 */

var ChallengePlayerController = cc.Scene.extend({
    _gameLayer:null,
    _xUnits:11,
    _yUnits:15,
    _targetTryHitNum:0,
    _targetSuccessHitNum:0,
    _gameMenu:null,
    _gameStatusLayer:null,
    _targetSelectPanel:null,
    _placeAssistMenu:null,


    onEnter:function(){
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.pieceField_plist);
        cc.spriteFrameCache.addSpriteFrames(res.targetModel_plist);
        cc.spriteFrameCache.addSpriteFrames(res.buttonItem_plist);

        this.initUserInterface();
        UpdateUIManager.getInstance().addPageUpdateListeners(NOTIFY.TARGET_MODEL_SELECTED, this.targetModelSelected, this);
        UpdateUIManager.getInstance().addPageUpdateListeners(NOTIFY.TARGET_MODEL_PLACED, this.targetModelPlaced, this);
        UpdateUIManager.getInstance().addPageUpdateListeners(NOTIFY.RESTART_GAME, this.restartGame, this);//绑定事件方法
        UpdateUIManager.getInstance().addPageUpdateListeners(NOTIFY.GAME_OVER, this.gameOver, this);

        UpdateUIManager.getInstance().addPageUpdateListeners(NOTIFY.TARGET_HEAD_HIT, this.targetHeadHit, this);
        UpdateUIManager.getInstance().addPageUpdateListeners(NOTIFY.TARGET_BODY_HIT, this.targetBodyHit, this);
        UpdateUIManager.getInstance().addPageUpdateListeners(NOTIFY.TARGET_TRY_HIT, this.countTargetTryHit, this);
    },

    onExit:function(){
        UpdateUIManager.getInstance().removeListeners(NOTIFY.TARGET_MODEL_SELECTED);
        UpdateUIManager.getInstance().removeListeners(NOTIFY.TARGET_MODEL_PLACED);
        UpdateUIManager.getInstance().removeListeners(NOTIFY.RESTART_GAME);
        UpdateUIManager.getInstance().removeListeners(NOTIFY.GAME_OVER);

        UpdateUIManager.getInstance().removeListeners(NOTIFY.TARGET_HEAD_HIT);
        UpdateUIManager.getInstance().removeListeners(NOTIFY.TARGET_BODY_HIT);
        UpdateUIManager.getInstance().removeListeners(NOTIFY.TARGET_TRY_HIT);

        this._super();
    },

    targetModelSelected:function(property){
        var tmpTargetModel = TargetModel.create(property.spriteDirection, new Point(0, 0), property.spriteType);
        this._gameLayer.updateSelectedTargetModel(tmpTargetModel);
    },

    targetModelPlaced:function(model){
        this._gameLayer.selectedModelPlaced(model);
    },

    initUserInterface:function(){
        var winSize = cc.winSize;
        var bgSpr = new cc.Sprite(res.gameHallBg_jpg);
        bgSpr.setPosition(winSize.width/2, winSize.height/2);
        this.addChild(bgSpr);

        this._gameLayer= new ChallengeGameLayer(this._xUnits, this._yUnits);
        this._gameLayer.setScale(0.8);
        this._gameLayer.setDelegate(this);
        this.addChild(this._gameLayer);

        //var targetSpr = new TargetSprite(res.planeModel_png);
        ////targetSpr.setScale(0.6);
        //targetSpr.setBgContainer(this);
        //targetSpr.setPosition(100, 100);
        //this.addChild(targetSpr);

        //var tmpTargetModel = TargetModel.create(DIRECTION.UP, new Point(0, 0), TARGET_TYPE.PLANE);
        //this._gameLayer.updateSelectedTargetModel(tmpTargetModel);

        this.createTargetSelectPanel();
        this.createGameMenu();
        this.createAssistantMenu();
        this.createGameStatusLayer();
    },

    createGameMenu:function(){
        this._gameMenu = new GameMenu();
        this._gameMenu.setDelegate(this);
        this.addChild(this._gameMenu);
    },

    createTargetSelectPanel:function(){
        this._targetSelectPanel = new TargetSelectPanel();
        this._targetSelectPanel.setDelegate(this);
        this.addChild(this._targetSelectPanel);
    },

    createAssistantMenu:function(){
        this._placeAssistMenu = new PlaceTargetAssistMenu();
        this._placeAssistMenu.setDelegate(this);
        this.addChild(this._placeAssistMenu);
    },

    createGameStatusLayer:function(){
        this._gameStatusLayer = new GameStatus();
        this._gameStatusLayer.setVisible(false);
        this.addChild(this._gameStatusLayer);
    },



    setTargetTryHitNum:function(param){
        if(0==param){
            this._targetTryHitNum = 0;
        } else {
            this._targetTryHitNum++;
        }
        this._gameStatusLayer.updateTryNumTip(this._targetTryHitNum);
    },

    setTargetSuccessHitNum:function(param){
        if(0==param){
            this._targetSuccessHitNum = 0;
        } else {
            this._targetSuccessHitNum++;
        }
        this._gameStatusLayer.updateSuccessNumTip(this._targetSuccessHitNum);
    },

    // 计数成功击中次数
    countTargetSuccessHit:function(){
        this.setTargetSuccessHitNum(1);
    },

    // 计数总共尝试次数
    countTargetTryHit:function(){
        this.setTargetTryHitNum(1);
    },

    targetHeadHit:function(positionTag){
        this.countTargetSuccessHit();
        var point = new Point(Math.floor(positionTag/100), Math.floor(positionTag%100));
        this._gameLayer.getCanvasMatrixM().targetHeadHit(point);
    },

    targetBodyHit:function(positionTag){
        this.countTargetSuccessHit();
        var point = new Point(Math.floor(positionTag/100), Math.floor(positionTag%100));
        this._gameLayer.getCanvasMatrixM().targetBodyHit(point);
    },

    // 清除点阵，重新布局
    resetGameInterface:function(){
        cc.log("resetGameInterface");
        this._gameLayer.resetGameLayer();
    },

    // 确认摆放
    layoutTargetDone:function(){
        if(this._gameLayer.getIsAllTargetPlaced()){
            //(new AlertView("尚未布置完毕，请重新检查")).show();
            //return;
        }

        this._gameLayer.layoutTargetsDone();
        //隐藏掉帮助menu
        this._placeAssistMenu.setVisible(false);
        //隐藏掉target布置menu
        this._targetSelectPanel.setVisible(false);

        this._gameStatusLayer.setVisible(true);
    },

    gameOver:function(){
        cc.log("gameOver");
        this._gameLayer.gameOverHandle();
        var gameOverLayer = new GameOverLayer();
        this.addChild(gameOverLayer);
    },

    //重新开始
    restartGame:function(){
        this.setTargetTryHitNum(0);
        this.setTargetSuccessHitNum(0);
        this._placeAssistMenu.setVisible(true);
        this._targetSelectPanel.setVisible(true);
        this._gameStatusLayer.setVisible(false);
        this._gameLayer.resetGameLayerComplete();
    },

})
