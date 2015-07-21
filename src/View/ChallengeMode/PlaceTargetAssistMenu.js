/**
 * Created by bigqiang on 15/7/18.
 */

var PlaceTargetAssistMenu = BaseLayer.extend({
    _className:"PlaceTargetAssistMenu",
    _itemConfig:null,
    _itemTagConfig:null,

    ctor:function(){
        this._super();
        this._cSize  = cc.size(cc.winSize.width, 100);
        this.setColor(cc.color(255,255,0));
        this.setOpacity(0);
        this.setContentSize(this._cSize);
        this.setPosition(cc.winSize.width/2 - this._cSize.width/2, cc.winSize.height-300);

        this._itemTagConfig = {
            clear:100,
            done:200,
        };
        this._itemConfig = [
            {name:"清除", btnNor:btnItemRes.baseBtn, btnCli:btnItemRes.baseBtn, tag:this._itemTagConfig.clear},
            {name:"确定", btnNor:btnItemRes.baseBtn, btnCli:btnItemRes.baseBtn, tag:this._itemTagConfig.done},
        ];

        return true;
    },

    onEnter:function(){
        this._super();

        this.createAssistMenu();

    },

    onExit:function(){



        this._super();
    },

    createAssistMenu:function(){
        var createItem = function(config, handler){
            var norSpr = new cc.Sprite("#"+config.btnNor);
            var cliSpr = new cc.Sprite("#"+config.btnCli);
            var disSpr = new cc.Sprite("#"+config.btnCli);
            var menuItem = new cc.MenuItemSprite(norSpr, cliSpr, disSpr, handler, this);
            menuItem.setTag(config.tag);

            var label = new cc.LabelTTF(config.name, "Arial", 23);
            label.setPosition(menuItem.width/2, menuItem.height/2);
            label.setColor(cc.color.RED);
            menuItem.addChild(label);
            return menuItem;
        };

        this._assistMenu = new cc.Menu();
        this._itemConfig.forEach(function(value){
            cc.log(JSON.stringify(value));
            var item = createItem(value, function(sender){
                this.menuItemClickHandler(sender);
            }.bind(this));
            this._assistMenu.addChild(item);
        }.bind(this));


        this._assistMenu.setPosition(this._cSize.width/2, this._cSize.height/2);
        this._assistMenu.alignItemsHorizontallyWithPadding(10);
        this.addChild(this._assistMenu);
    },
    
    menuItemClickHandler: function (sender) {
        var tag = sender.getTag();
        switch (tag){
            case this._itemTagConfig.clear:
                cc.log("clear");
                this.getDelegate().resetGameInterface();
                break;
            case this._itemTagConfig.done:
                cc.log("done");
                this.getDelegate().layoutTargetDone();
                break;
            default :
                break;
        }
    },

})