
var GameEntryController = cc.Scene.extend({
    _className:"GameEntryController",
    _ship:null,

    onEnter:function(){
        this._super();
        cc.spriteFrameCache.addSpriteFrames(res.pieceField_plist);
        cc.spriteFrameCache.addSpriteFrames(res.targetModel_plist);
        cc.spriteFrameCache.addSpriteFrames(res.buttonItem_plist);

//        UpdateUIManager.getInstance().addPageUpdateListeners(NOTIFY.RESTART_GAME, this.restartGame, this);//绑定事件方法
        this.initUserInterface();
//        this.schedule(this.update, 0.1);
    },

    onExit:function(){
//        UpdateUIManager.getInstance().removeListeners(NOTIFY.RESTART_GAME);//删除事件方法
//        cc.spriteFrameCache.removeSpriteFramesFromFile(res.pieceField_plist);
//        cc.spriteFrameCache.removeSpriteFramesFromFile(res.targetModel_plist);

        this._super();
    },

    initUserInterface:function(){
        var winSize = cc.winSize;
        var bgSpr = new cc.Sprite(res.gameHallBg_jpg);
        bgSpr.setPosition(winSize.width/2, winSize.height/2);
        this.addChild(bgSpr);

        var sysMenu = new SystemMenu();
        this.addChild(sysMenu);

//        this._ship = new cc.Sprite(res.card_blade_master);
//        this.addChild(this._ship, 0, 4);
//        this._ship.x = Math.random() * winSize.width;
//        this._ship.y = 0;
//        this._ship.runAction(cc.moveBy(2, cc.p(Math.random() * winSize.width, this._ship.y + winSize.height + 100)));
    },

    update:function(){
//        var winSize = cc.winSize;
//        if (this._ship.y >= winSize.height) {
//            this._ship.x = Math.random() * winSize.width;
//	        this._ship.y = 10;
//            this._ship.runAction(cc.moveBy(
//                parseInt(5 * Math.random(), 10),
//                cc.p(Math.random() * winSize.width, this._ship.y + winSize.height)
//            ));
//        }
    }
})