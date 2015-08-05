/**
 * Created by bigqiang on 15/6/26.
 */

var BaseLayer = cc.LayerColor.extend({
    _className:"BaseLayer",
    _btnZoomScale:0.05,
    _delegate:null,
    _cSize:null,

    ctor:function(){
        this._super();
        this.setColor(cc.color(0,0,0));
        this._cSize = cc.winSize;

        return true;
    },

    onEnter:function(){
        this._super();
    },

    onExit:function(){
        this._super();
    },

    setDelegate:function(del){
        this._delegate = del;
    },

    getDelegate:function(){
        if (this._delegate) {
            return this._delegate;
        } else {
            return cc.director.getRunningScene();
        }
    },

    removeSelfAndCleanUp:function(isCleanUp){
        var isClean = (isCleanUp)? true : false;
        this.removeFromParent(isClean);
    },

    closeSelf:function(sender, type){
        if(ccui.Widget.TOUCH_ENDED === type){
            cc.log("closeSelf");
            this.removeSelfAndCleanUp();
        }
    },

    createTouchEnabledBg:function(){
        var bgLayout = new ccui.Layout();
        bgLayout.setBackGroundColorType(ccui.Layout.BG_COLOR_SOLID);
        bgLayout.setBackGroundColor(cc.color(0, 0, 0));
        bgLayout.setBackGroundColorOpacity(90);
        //bgLayout.setBackGroundColorOpacity(0);
        bgLayout.setPosition(0, 0);
        bgLayout.setTouchEnabled(true);
        bgLayout.setContentSize(this._cSize);
        this.addChild(bgLayout);
    },

    createCloseBtn:function(tag){
        var closeBtn = new ccui.Button();
        //closeBtn.loadTextures(CommonRes.backBtn,CommonRes.backBtn,CommonRes.backBtn,ccui.Widget.PLIST_TEXTURE);
        closeBtn.setPosition(21, this._cSize.height - 21);
        closeBtn.setAnchorPoint(cc.p(0,1));
        closeBtn.addTouchEventListener(this.closeSelf, this);
        if(tag != undefined){
            closeBtn.setTag(tag);
        }
        this.addChild(closeBtn);
        return closeBtn;
    },

    getButtonZoomScale:function(){
        return this._btnZoomScale;
    },

})
