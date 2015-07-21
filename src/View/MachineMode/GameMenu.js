
var GameMenu = BaseLayer.extend({
    _className:"GameMenu",
    //_restartItem:null,
    //_backItem:null,
    _width:140,
    _height:120,
    _itemConfig:null,
    _itemTagConfig:null,

    ctor:function(){
        this._super();
        this._cSize = cc.size(140,120);
        this.setOpacity(0);
        this._itemTagConfig = {
            restart:100,
            backHall:200,
        }
        this._itemConfig = [
            {name:"重新开始", btnNor:btnItemRes.restartGame, btnCli:btnItemRes.restartGame, tag:this._itemTagConfig.restart},
            {name:"回到大厅", btnNor:btnItemRes.backHall, btnCli:btnItemRes.backHall, tag:this._itemTagConfig.backHall},
        ];
        this.setContentSize(this._cSize);
        this.setPosition(0,cc.winSize.height - this._cSize.height);
    },

    onEnter: function () {
        this._super();
        this.createGameMenu();
    },

    onExit:function(){

        this._super()
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

    createGameMenu: function () {
        var menu = new cc.Menu();
        for(var i = 0; i < this._itemConfig.length; i++){
            var item = this._createMenuItem(this._itemConfig[i], function (sender) {
                this.menuItemClickHandler(sender);
            }.bind(this));
            menu.addChild(item);
        }
        menu.setPosition(this._cSize.width/2, this._cSize.height/2);
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
        cc.log("restart");
        UpdateUIManager.getInstance().dispatch(NOTIFY.RESTART_GAME);//触发事件方法
    },

    backToHall:function(){
        cc.log("back to hall");
        cc.LoaderScene.preload(g_resources, function () {
            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();
            var scene = new GameEntryController();
	        cc.director.runScene(new cc.TransitionFade(1.2, scene));
        }, this);
    },

})