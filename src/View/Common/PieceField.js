
var PieceField = cc.Sprite.extend({
    _className:"PieceField",
    _X:0,
    _Y:0,
    _isFlipped:false,
    _isMarked:false,
    _isPart:false,
    _isHead:false,
    _isTakeUp:false,
    _isPlaced:false,
    _lastClickTime:null,
    _canTouched:true,

    ctor:function(isPart, isHead){
        this._super("#"+pieceFiledRes.default);
        if (isPart){
            this.setIsPart(true);
            this.setIsHead(isHead);
        }
        this.setLastClickTime(this.getCurrentTime());
        this.init();
    },

    resetState:function(isPart, isHead){
        this.setSpriteFrame(pieceFiledRes.default);
        if (isPart){
            this.setIsPart(true);
            this.setIsHead(isHead);
        } else {
            this.setIsPart(false);
            this.setIsHead(false);
        }
        this.setIsFlipped(false);
        this.setIsMarked(false);
        this.setIsTakeUp(false);
        this.setIsPlaced(false);
        this.setLastClickTime(this.getCurrentTime());
    },

    setCanTouched:function(canTouch){
        this._canTouched = canTouch;
    },

    getCanTouched:function(){
        return this._canTouched;
    },

    setIsPlaced:function(isPlaced){
        this._isPlaced = isPlaced;
    },

    getIsPlaced:function(){
        return this._isPlaced;
    },

    setIsTakeUp:function(isTakeUp){
        this._isTakeUp = isTakeUp;
    },

    getIsTakeUp:function(){
        return this._isTakeUp;
    },

    setIsPart:function(isPart){
        this._isPart = isPart;
        cc.log("_isPart is "+this._isPart);
    },

    getIsPart:function(){
        return this._isPart;
    },

    setIsHead:function(isHead){
        this._isHead = isHead;
        cc.log("_isHead is "+this._isHead);
    },

    getIsHead:function() {
        return this._isHead;
    },

    getIsFlipped:function(){
        return this._isFlipped;
    },

    setIsFlipped:function(isFlip){
        this._isFlipped = isFlip;
    },

    isDoubleClicked:function(){
        return true;
        //return this.getCurrentTime() - this.getLastClickTime() < 300;
    },

    getIsMarked:function(){
        return this._isMarked;
    },

    setIsMarked:function(isMark){
        this._isMarked = isMark;
    },

    getCurrentTime:function(){
        var tmpDate = new Date();
        return tmpDate.getTime();
    },

    setLastClickTime:function(time){
        this._lastClickTime = time;
    },

    updateLastClickTime:function(){
        this.setLastClickTime(this.getCurrentTime());
    },

    getLastClickTime:function() {
        return this._lastClickTime;
    },

    init:function(){
        var listener1 = cc.EventListener.create({
            cancelled:false,
            beginPosi:null,
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true, //设置是否吞没事件，在 onTouchBegan 方法返回 true 时吞掉事件，不再向下传递。
            onTouchBegan:function(touch, event){
                //实现 onTouchBegan 事件处理回调函数
                var target = event.getCurrentTarget(); // 获取事件所绑定的 target, 通常是cc.Node及其子类
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                this.beginPosi = locationInNode;
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                //cc.log("PieceField began... x = " + locationInNode.x + ", y = " + locationInNode.y);
                if(cc.rectContainsPoint(rect, locationInNode) && target.getCanTouched()) {
                    // 判断触摸点是否在按钮范围内
                    //cc.log("sprite began... x = " + locationInNode.x + ", y = " + locationInNode.y);
                    return true;
                }

                return false;
            },

            onTouchMoved:function(touch, event){
                //实现onTouchMoved事件处理回调函数, 触摸移动时触发
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());

                if(Math.abs(this.beginPosi.x - locationInNode.x)>25 || Math.abs(this.beginPosi.x - locationInNode.x)>25){
                    this.cancelled = true;
                } else {
                    this.cancelled = false;
                }
            },

            onTouchEnded:function(touch, event){
                // 实现onTouchEnded事件处理回调函数
                if(this.cancelled) {
                    this.cancelled = false;
                    return false;
                }

                var target = event.getCurrentTarget();
                target.handleClickEvent()
            }
        });

        cc.eventManager.addListener(listener1, this);
    },

    handleClickEvent:function(){

        cc.log("handleClickEvent");
        if(this.getIsFlipped()){
            return false;
        }
        if(this.isDoubleClicked()) {
            // 双击处理
            UpdateUIManager.getInstance().dispatch(NOTIFY.TARGET_TRY_HIT);
            this.setIsFlipped(true);
            if(this.getIsPart()) {
                if (this.getIsHead()) {
                    // 击中头部
                    this.setSpriteFrame(pieceFiledRes.headHit);
//                    cc.log("TARGET_HEAD_HIT");
                    UpdateUIManager.getInstance().dispatch(NOTIFY.TARGET_HEAD_HIT, this.getTag());
                } else {
                    // 击中身体
                    this.setSpriteFrame(pieceFiledRes.bodyHit);
//                    cc.log("TARGET_BODY_HIT");
                    UpdateUIManager.getInstance().dispatch(NOTIFY.TARGET_BODY_HIT, this.getTag());
                }
            } else {
                    this.setSpriteFrame(pieceFiledRes.fail);
            }
        } else {
            // 单击处理
            this.updateLastClickTime();
            if(this.getIsMarked()) {
                // 取消标记
                this.setIsMarked(false);
                this.setSpriteFrame(pieceFiledRes.default);
            } else {
                // 标记位置
                this.setIsMarked(true);
                this.setSpriteFrame(pieceFiledRes.mark);
            }
        }
    },

    showStatus:function(){
        if(!this.getIsFlipped()){
            this.setIsFlipped(true);
            if(this.getIsHead()){
                this.setSpriteFrame(pieceFiledRes.headHit);
            } else {
                this.setSpriteFrame(pieceFiledRes.bodyHit);
            }
        }
    },

    showLayoutTip:function(isTakeUp, isLegal){
        if(this.getIsPlaced()){
            return;
        }
        this.setIsTakeUp(isTakeUp);
        if (isTakeUp) {
            if (isLegal){
                this.setSpriteFrame(pieceFiledRes.legal);
            } else {
                this.setSpriteFrame(pieceFiledRes.illegal);
            }
        } else {
            this.setSpriteFrame(pieceFiledRes.default)
        }
    },

})

PieceField.factoryCreate = function(isPart, isHead){
    var tmpField = new PieceField(isPart, isHead);
    return tmpField;
}