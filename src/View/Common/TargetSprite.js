/**
 * Created by bigqiang on 15/6/27.
 */

var TargetSprite = cc.Sprite.extend({
    _className:"TargetSprite",
    sprName:"",
    bgContainer:null,
    sprType:null,
    sprDirection:null,
    sprRotation:0,

    ctor:function(sprName){
        this._super(sprName);
        this.sprName = sprName;
        this.init();
        return true;
    },

    setSpriteProperty:function(type, direction, rotation, sprName){
        this.setSpriteType(type);
        this.setSpriteDirection(direction);
        this.setSpriteRotation(rotation);
        this.setSpriteName(sprName);
    },

    setSpriteName:function(sprName){
        this.sprName = sprName
    },

    getSpriteName:function(){
        return this.sprName;
    },

    setSpriteRotation:function(rotate){
        this.sprRotation = rotate
    },

    getSpriteRotation:function(){
        return this.sprRotation;
    },

    setSpriteType:function(type){
        this.sprType = type;
    },

    setSpriteDirection:function(direction){
        this.sprDirection = direction;
    },

    getSpriteType:function(){
        return this.sprType;
    },

    getSpriteDirection:function(){
        return this.sprDirection;
    },

    setBgContainer:function(bgC){
        this.bgContainer = bgC;
    },

    getBgContainer:function(){
        if (this.bgContainer){
            return this.bgContainer;
        } else {
            return cc.director.getRunningScene();
        }

        //return this.getParent();
    },

    init:function(){
        cc.log("target sprite init");

        var listener1 = cc.EventListener.create({
            event:cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:false,
            beginPosi:null,
            floatingSprite:null,
            scaleFactor:1,

            onTouchBegan:function(touch, event){
                //cc.log("target sprite onTouchBegan");
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                this.beginPosi = locationInNode;
                var s = target.getContentSize();
                var rect = cc.rect(0,0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)){
                    target.targetSelectedHandler();

                    this.floatingSprite = new cc.Sprite(target.getSpriteName());
                    cc.log("target sprite name is "+target.getSpriteName());
                    this.floatingSprite.setOpacity(180);
                    this.floatingSprite.setRotation(target.getSpriteRotation());
                    this.floatingSprite.setScale(this.scaleFactor);
                    this.floatingSprite.setPosition(touch.getLocation());
                    target.getBgContainer().addChild(this.floatingSprite);

                    return true;
                }
                return false;
            },

            onTouchMoved:function(touch, event){
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var point = cc.p(locationInNode.x, locationInNode.y);
                //cc.log("point x,y is"+touch.getLocation().x, touch.getLocation().y);

                this.floatingSprite.setPosition(touch.getLocation());
            },

            onTouchEnded:function(touch, event){
                var target = event.getCurrentTarget();
                if(this.floatingSprite) {
                    this.floatingSprite.removeFromParent();
                    this.floatingSprite = null;
                }
            },

        });
        cc.eventManager.addListener(listener1, this);

    },

    targetSelectedHandler:function(){
        var config={
            spriteType:this.getSpriteType(),
            spriteDirection:this.getSpriteDirection(),
        }
        UpdateUIManager.getInstance().dispatch(NOTIFY.TARGET_MODEL_SELECTED, config);
    },


})