
var GameStatus = cc.LayerColor.extend({
    _className:"GameStatus",
    _width:360,
    _height:40,
    _tryNumTip:null,
    _successNumTip:null,

    ctor:function(){
        this._super();
        var size = cc.winSize;
        this.setColor(cc.color(255,255,255));
        this.setContentSize(this.getWidth(), this.getHeight());
        this.setPosition(size.width/2-this.getWidth()/2, cc.winSize.height - this.getHeight());

        this.addTryCountTip();
        this.addSuccessHitCountTip();
    },

    getWidth:function(){
        return this._width;
    },

    getHeight:function(){
        return this._height;
    },

    addTryCountTip:function(){
        var tipTitleLabel = new cc.LabelTTF("Tried Times: ", "Arial", 20);
        tipTitleLabel.setColor(cc.color(0,0,0));
        tipTitleLabel.setPosition(60, this.getHeight()/2);
        this.addChild(tipTitleLabel);

        this._tryNumTip = new cc.LabelTTF("0", "Arial", 20);
        this._tryNumTip.setColor(cc.color(255,0,0));
        this._tryNumTip.setPosition(tipTitleLabel.getContentSize().width+8, this.getHeight()/2);
        this.addChild(this._tryNumTip);
    },

    addSuccessHitCountTip:function(){
        var tipTitleLabel = new cc.LabelTTF("Hitted Times: ", "Arial", 20);
        tipTitleLabel.setColor(cc.color(0,0,0));
        tipTitleLabel.setPosition(this.getWidth()/2+40, this.getHeight()/2);
        this.addChild(tipTitleLabel);

        this._successNumTip = new cc.LabelTTF("0", "Arial", 20);
        this._successNumTip.setColor(cc.color(255,0,0));
        this._successNumTip.setPosition(tipTitleLabel.getContentSize().width+158, this.getHeight()/2);
        this.addChild(this._successNumTip);
    },

    updateTryNumTip:function(triedNum){
        this._tryNumTip.setString(triedNum);
    },

    updateSuccessNumTip:function(successNum){
        this._successNumTip.setString(successNum);
    },
})