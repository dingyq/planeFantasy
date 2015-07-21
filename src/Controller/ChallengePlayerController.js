/**
 * Created by bigqiang on 15/6/27.
 */

var ChallengePlayerController = cc.Scene.extend({
    _gameLayer:null,
    _xUnits:11,
    _yUnits:15,
    _gameMenu:null,
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
    },

    onExit:function(){
        UpdateUIManager.getInstance().removeListeners(NOTIFY.TARGET_MODEL_SELECTED);
        UpdateUIManager.getInstance().removeListeners(NOTIFY.TARGET_MODEL_PLACED);

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

    resetGameInterface:function(){
        cc.log("resetGameInterface");
        this._gameLayer.resetGameLayer();
    },

    layoutTargetDone:function(){
        var result = this._gameLayer.layoutTargetsDone();

    },

})
