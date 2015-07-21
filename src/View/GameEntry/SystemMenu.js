var SystemMenu = BaseLayer.extend({
    _className:"SystemMenu",
    _fontColor:cc.color(255, 255, 255),
    _itemConfig:null,
    _itemTagConfig:null,
    _cSize:null,

    ctor:function(){
        this._super();
        cc.log("initUserInterface")
        this._cSize = cc.winSize;
        this.setOpacity(0);
        this._itemTagConfig = {
            machine:100,
            challenge:200,
            gameOption:300,
            aboutGame:400,
        }
        this._itemConfig = [
            {name:"单机模式", btnNor:btnItemRes.machineMode, btnCli:btnItemRes.machineMode, tag:this._itemTagConfig.machine},
            {name:"挑战模式", btnNor:btnItemRes.challengeMode, btnCli:btnItemRes.challengeMode, tag:this._itemTagConfig.challenge},
            {name:"游戏选项", btnNor:btnItemRes.gameOption, btnCli:btnItemRes.gameOption, tag:this._itemTagConfig.gameOption},
            {name:"关于游戏", btnNor:btnItemRes.aboutGame, btnCli:btnItemRes.aboutGame, tag:this._itemTagConfig.aboutGame},
        ];
    },

    onEnter:function(){
        this._super();
        this.flare = new cc.Sprite(res.flare_jpg);
        this.addChild(this.flare, 15, 10);
        this.flare.visible = false;

        this.createGameMenu();
        //        this.createClipperTest();
    },

    onExit:function(){
        this._super();
    },

    _createMenuItem:function(config, handler){
        //cc.MenuItemFont.setFontSize(30);
        //cc.MenuItemFont.setFontName("Arial");
        var sprNormal = new cc.Sprite("#"+config.btnNor);
        var sprSelect = new cc.Sprite("#"+config.btnCli);
        var sprDisable = new cc.Sprite("#"+config.btnCli);
        var item = new cc.MenuItemSprite(sprNormal, sprSelect, sprDisable, handler, this);
        item.setTag(config.tag);

        FlashSprite("#"+config.btnNor, item);

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

        menu.alignItemsVerticallyWithPadding(30);
        this.addChild(menu);
    },

    menuItemClickHandler:function(sender){
        switch (sender.getTag()){
            case this._itemTagConfig.machine:
                this.onMachineModeClick();
                break;
            case this._itemTagConfig.challenge:
                this.onNetMode();
                break;
            case this._itemTagConfig.gameOption:
                this.onOption();
                break;
            case this._itemTagConfig.aboutGame:
                this.onAbout();
                break;
            default :
                break;
        }
    },

    onMachineModeClick:function(){
        this.onButtonEffect();
        //this.onMachineMode();
        flareEffect(this.flare, this, this.onMachineMode);
    },

    onMachineMode:function(){
        cc.LoaderScene.preload(g_resources, function () {
            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();
            var scene = new AircraftBeatController();
            cc.director.runScene(new cc.TransitionFade(1.2, scene));
        }, this);
    },

    onNetMode:function(){
        cc.LoaderScene.preload(g_resources, function () {
            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();
            var scene = new ChallengePlayerController();
            cc.director.runScene(new cc.TransitionFade(1.2, scene));
        }, this);
    },

    onOption:function(){
        cc.log("onOption");
        cc.LoaderScene.preload(g_resources, function () {
            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();
            var scene = new OptionController();
            cc.director.runScene(new cc.TransitionFade(1.2, scene));
        }, this);
    },

    onAbout:function(){
        cc.log("onAbout");
        cc.LoaderScene.preload(g_resources, function () {
            cc.audioEngine.stopMusic();
            cc.audioEngine.stopAllEffects();
            var scene = new AboutController();
            cc.director.runScene(new cc.TransitionFade(1.2, scene));
        }, this);
    },

    onButtonEffect:function(){
        // 播放音效

    },

    createClipperTest:function(){
        var stencil = new cc.Sprite("res/common/game_title.png");
        var clipper = new cc.ClippingNode();
        clipper.stencil = stencil;
        clipper.alphaThreshold = 0;


        var spr_title = new cc.Sprite("res/common/game_title.png");
        var spark = new cc.Sprite("res/common/spark.png");
        clipper.addChild(spr_title)
        clipper.addChild(spark)
        clipper.setPosition(cc.p(300, 300))
        this.addChild(clipper)

        var sz = spr_title.getContentSize();

        var move = cc.moveTo(0.6, cc.p(sz.width, 0));
        var delay1 = cc.delayTime(0.5);
        var move_back = cc.moveTo(0.6, cc.p(-sz.width, 0));
        var delay2 = cc.delayTime(0.5);
        var seq = cc.sequence(delay1, move, delay2, move_back);
        var repeatAction = seq.repeatForever();
        spark.runAction(repeatAction)
    },
})