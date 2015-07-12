var AircraftBeatController = cc.Scene.extend({
    _gameLayer:null,
    _xUnits:9,
    _yUnits:15,

    onEnter:function(){
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.pieceField_plist);
        cc.spriteFrameCache.addSpriteFrames(res.targetModel_plist);
        cc.spriteFrameCache.addSpriteFrames(res.buttonItem_plist);

        UpdateUIManager.getInstance().addPageUpdateListeners(NOTIFY.RESTART_GAME, this.restartGame, this);//绑定事件方法
        UpdateUIManager.getInstance().addPageUpdateListeners(NOTIFY.GAME_OVER, this.gameOver, this);

        this.initUserInterface();
    },

    onExit:function(){
        UpdateUIManager.getInstance().removeListeners(NOTIFY.RESTART_GAME);//删除事件方法
        UpdateUIManager.getInstance().removeListeners(NOTIFY.GAME_OVER);
        this._super();
    },

    initUserInterface:function(){
        var winSize = cc.winSize;
        var bgSpr = new cc.Sprite(res.gameHallBg_jpg);
        bgSpr.setPosition(winSize.width/2, winSize.height/2);
        this.addChild(bgSpr);

        this._gameLayer= new MachineGameLayer(this._xUnits, this._yUnits);
        this._gameLayer.setDelegate(this);
        this.addChild(this._gameLayer);

        this.createGameMenu();
    },

    createGameMenu:function(){
        this.gameMenu = new GameMenu();
        this.addChild(this.gameMenu);
    },

    restartGame:function(){
        this._gameLayer.resetGameLayer();
    },

    gameOver:function(){
        this._gameLayer.gameOverHandle();

        var gameOverLayer = new GameOverLayer()
        this.addChild(gameOverLayer);

    },

})