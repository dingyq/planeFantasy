var AboutController = cc.Scene.extend({
    _className:"AboutController",
    _itemConfig:null,
    _itemTagConfig:null,
    _cSize:null,

    onEnter:function(){
        this._super();
        this._cSize = cc.winSize;
        this._itemTagConfig = {
            backHall:200,
        }
        this._itemConfig = [
            {name:"回到大厅", btnNor:BtnItemRes.backHall, btnCli:BtnItemRes.backHall, tag:this._itemTagConfig.backHall},
        ];

        this.initUserInterface();
    },

    onExit:function(){
        this._super();
    },

    initUserInterface:function(){
        var bgSpr = new cc.Sprite(res.gameHallBg_jpg);
        bgSpr.setPosition(this._cSize.width/2, this._cSize.height/2);
        this.addChild(bgSpr);

        var shareSpr = new cc.Sprite(res.aaShare_png);
        shareSpr.setScale(0.5);
        shareSpr.setPosition(this._cSize.width/2, this._cSize.height/2);
        this.addChild(shareSpr);

        this.createGameMenu();
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
        menu.x = 80;
        menu.y = this._cSize.height - 40;
        menu.alignItemsVertically();
        this.addChild(menu);
    },

    menuItemClickHandler:function(sender){
        switch (sender.getTag()){
            case this._itemTagConfig.backHall:
                this.backToHall();
                break;
            default :
                break;
        }
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