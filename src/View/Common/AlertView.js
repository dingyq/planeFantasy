/**
 * Created by bigqiang on 15/8/5.
 */

var AlertView = BaseLayer.extend({
    title:"",
    message:"",
    cancelBtnTitle:"确定",
    cancelBtnHandler:null,
    otherBtnTitle:"",
    otherBtnHandler:null,
    btnCounts:1,
    _cSize:null,

    bgPanel:null,
    _closeBtn:null,
    cancelBtn:null,
    otherBtn:null,
    titleText:null,
    msgText:null,

    _btnResConfig:null,
    // message
    // title, message
    // title, message, cancelBtnTitle
    // title, message, cancelBtnTitle, cancelBtnClick
    // title, message, cancelBtnTitle, cancelBtnClick, otherBtnTitle
    // title, message, cancelBtnTitle, cancelBtnClick, otherBtnTitle, otherBtnHandler
    ctor:function(){
        this._super();
        cc.log("AlertView parameter count is "+arguments.length);
        if (arguments.length == 1) {
            this.message = arguments[0];
        } else if(arguments.length == 2) {
            this.title = arguments[0];
            this.message = arguments[1];
        } else if(arguments.length == 3) {
            this.title = arguments[0];
            this.message = arguments[1];
            this.cancelBtnTitle = arguments[2];
        } else if(arguments.length == 4) {
            this.title = arguments[0];
            this.message = arguments[1];
            this.cancelBtnTitle = arguments[2];
            this.cancelBtnHandler = arguments[3];
        } else if(arguments.length == 5) {
            this.title = arguments[0];
            this.message = arguments[1];
            this.cancelBtnTitle = arguments[2];
            this.cancelBtnHandler = arguments[3];
            this.otherBtnTitle = arguments[4];
            this.btnCounts = 2;
        } else if(arguments.length == 6) {
            this.title = arguments[0];
            this.message = arguments[1];
            this.cancelBtnTitle = arguments[2];
            this.cancelBtnHandler = arguments[3];
            this.otherBtnTitle = arguments[4];
            this.otherBtnHandler = arguments[5];
            this.btnCounts = 2;
        }
        this._cSize = cc.size(516, 468);
        this._btnResConfig = {
            confirmBtn:BtnItemRes.baseBtn,
            cancelBtn:BtnItemRes.baseBtn,
        }
    },

    onEnter: function () {
        this._super();
        this.setContentSize(cc.winSize);
        this.setLocalZOrder(1000);
        this.setOpacity(0);
        this.createBgContainer();
        this.createButton();
        this.createCloseRightBtn();
    },

    onExit:function(){

        this._super();
    },

    createBgContainer:function(){
        var touchLayout = new ccui.Layout();
        touchLayout.setContentSize(cc.winSize);
        touchLayout.setPosition(0, 0);
        touchLayout.setTouchEnabled(true);
        this.addChild(touchLayout);

        this.bgPanel = new cc.LayerColor(cc.color(255, 255, 255, 255));
        this.bgPanel.setOpacity(0);
        this.bgPanel.setContentSize(this._cSize);
        this.bgPanel.setPosition(this.width/2 - this._cSize.width/2, this.height/2 - this._cSize.height/2);
        this.addChild(this.bgPanel);

        //var bgSpr = new cc.Scale9Sprite(CommonRes.alertViewBg);
        //bgSpr.setCapInsets(cc.rect(27, 27, 10, 10));
        //bgSpr.setContentSize(this._cSize);
        //bgSpr.setPosition(this._cSize.width/2, this._cSize.height/2);
        var bgSpr = new cc.LayerColor(cc.color(0, 0, 0, 255));
        bgSpr.setContentSize(this._cSize);
        bgSpr.setPosition(0, 0);
        this.bgPanel.addChild(bgSpr);

        this.titleText = new ccui.Text();
        this.titleText.attr({
            string: this.title,
            font: "30px AmericanTypewriter",
            x: this._cSize.width/2,
            y: this._cSize.height-50,
            fontSize:30,
        });
        this.titleText.setColor(cc.color(220, 220, 220));
        this.bgPanel.addChild(this.titleText);

        this.msgText = new cc.LabelTTF(this.message, "Arial", 24);
        this.msgText.setPosition(this._cSize.width/2, 305);
        if (this.msgText.width > this._cSize.width - 100) {
            this.msgText.setDimensions(this._cSize.width - 100, 200);
            this.msgText.setPosition(this._cSize.width/2, this._cSize.height/2);
        }
        this.msgText.setColor(cc.color(220, 220, 220));
        this.bgPanel.addChild(this.msgText);
    },

    _createBtn:function(titleText, position, imageRes){
        var btn = new ccui.Button();
        btn.setTitleText(titleText);
        btn.setPosition(position);
        btn.setTitleColor(cc.color(255, 255, 255));
        btn.setPressedActionEnabled(true);
        btn.setZoomScale(this.getButtonZoomScale());
        btn.loadTextures(imageRes, imageRes, imageRes, ccui.Widget.PLIST_TEXTURE);
        btn.setTitleFontSize(24);
        return btn;
    },

    createButton:function(){
        this.cancelBtn = this._createBtn(this.cancelBtnTitle, cc.p(this._cSize.width/(this.btnCounts*2), 50), this._btnResConfig.confirmBtn);
        this.cancelBtn.addTouchEventListener(this.cancelBtnClick, this);
        this.bgPanel.addChild(this.cancelBtn);

        if (this.btnCounts==2) {
            //this.cancelBtn.loadTextures(this._btnResConfig.cancelBtn, this._btnResConfig.cancelBtn, this._btnResConfig.cancelBtn, ccui.Widget.PLIST_TEXTURE);
            this.cancelBtn.setPosition(this._cSize.width*3/(this.btnCounts*2), 50);
            this.otherBtn = this._createBtn(this.otherBtnTitle, cc.p(this._cSize.width/(this.btnCounts*2), 50), this._btnResConfig.cancelBtn);
            this.otherBtn.addTouchEventListener(this.otherBtnClick, this);
            this.bgPanel.addChild(this.otherBtn);
        }
    },

    show:function(){
        cc.director.getRunningScene().addChild(this, 999999);
    },

    cancelBtnClick:function(sender, type){
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                if (this.cancelBtnHandler) {
                    this.cancelBtnHandler();
                }
                this.removeSelfAndCleanUp(true);
                break;
            default:
                break;
        }
    },

    otherBtnClick:function(sender, type){
        switch (type) {
            case ccui.Widget.TOUCH_ENDED:
                if (this.otherBtnHandler) {
                    this.otherBtnHandler();
                }
                this.removeSelfAndCleanUp(true);
                break;
            default:
                break;
        }
    },

    createCloseRightBtn:function(){
        var closeBtn = new ccui.Button();
        closeBtn.loadTextures(BtnItemRes.baseBtn, BtnItemRes.baseBtn, BtnItemRes.baseBtn, ccui.Widget.PLIST_TEXTURE);
        closeBtn.setPosition(this._cSize.width - 21, this._cSize.height - 21);
        closeBtn.setAnchorPoint(cc.p(1,1));
        closeBtn.setPressedActionEnabled(true);
        closeBtn.setZoomScale(this.getButtonZoomScale());
        closeBtn.addTouchEventListener(this.closeSelf, this);
        this.bgPanel.addChild(closeBtn);

        this._closeBtn = closeBtn;
    },
})
