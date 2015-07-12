/**
 * Created by bigqiang on 15/6/26.
 */

var GameOverLayer = BaseLayer.extend({
    _className:"GameOverLayer",
    _cSize:null,
    _itemTagConfig:null,
    _itemConfig:null,
    _test:null,

    ctor:function(){
        this._super();
        this._cSize = cc.size(140,120);
        this._itemTagConfig = {
            restart:100,
            backHall:200,
        }
        this._itemConfig = [
            {name:"重新开始", btnNor:btnItemRes.restartGame, btnCli:btnItemRes.restartGame, tag:this._itemTagConfig.restart},
            {name:"回到大厅", btnNor:btnItemRes.backHall, btnCli:btnItemRes.backHall, tag:this._itemTagConfig.backHall},
        ];

        return true;
    },

    onEnter:function(){
        this._super();
        this.createBgLayout();
        this.createRestartMenu();
    },

    onExit:function(){

        this._super();
    },

    createBgLayout:function(){
        var touchLayout = new ccui.Layout();
        touchLayout.setTouchEnabled(true);
        touchLayout.setContentSize(cc.winSize);
        touchLayout.setPosition(cc.p(0,0));
        touchLayout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID)
        touchLayout.setBackGroundColorOpacity(120);
        touchLayout.setBackGroundColor(cc.color(0,0,0));
        this.addChild(touchLayout);
    },

    _createMenuItem:function(config, handler){
        //cc.MenuItemFont.setFontSize(30);
        //cc.MenuItemFont.setFontName("Arial");
        var sprNormal = new cc.Sprite("#"+config.btnNor);
        var sprSelect = new cc.Sprite("#"+config.btnCli);
        var sprDisable = new cc.Sprite("#"+config.btnCli);
        var item = new cc.MenuItemSprite(sprNormal, sprSelect, sprDisable, handler, this);
        item.setTag(config.tag);

        return item;
    },

    createRestartMenu:function(){
        var menu = new cc.Menu();
        for(var i = 0; i < this._itemConfig.length; i++){
            var item = this._createMenuItem(this._itemConfig[i], function (sender) {
                this.menuItemClickHandler(sender);
            }.bind(this));
            menu.addChild(item);
        }
        menu.x = cc.winSize.width/2;
        menu.y = 100;
        menu.alignItemsVerticallyWithPadding(10);
        this.addChild(menu);
    },

    menuItemClickHandler:function(sender){
        switch (sender.getTag()){
            case this._itemTagConfig.restart:
                this.onRestart();
                break;
            case this._itemTagConfig.backHall:
                this.backToHall();
                break;
            default :
                break;
        }
    },

    onRestart:function(){
        UpdateUIManager.getInstance().dispatch(NOTIFY.RESTART_GAME);//触发事件方法
        this.removeSelf()
    },

    backToHall:function(){
        cc.LoaderScene.preload(g_resources, function () {
            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();
            var scene = new GameEntryController();
            cc.director.runScene(new cc.TransitionFade(1.2, scene));
        }, this);
        this.removeSelf()
    },

    removeSelf:function(){
        this.removeFromParent();
    },

})


