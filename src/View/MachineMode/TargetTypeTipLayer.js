/**
 * Created by bigqiang on 15/6/27.
 */

var TargetTypeTipLayer = BaseLayer.extend({
    _className:"TargetTypeTipLayer",
    targetModel1:null,
    targetModel2:null,

    ctor:function(targetsArr){
        this._super();
        //this.setColor(cc.color(255,255,255));
        this.setContentSize(cc.size(120, 300));
        this.setPosition(cc.p(0, 250));
        this.setOpacity(0);

        this.initTargetTips(targetsArr);
        return true;
    },

    onEnter:function(){
        this._super();
    },

    onExit:function(){

        this._super();
    },

    createTargetModel:function(){

    },

    initTargetTips:function(targetsArr){
        for(var i = 0; i < targetsArr.length; i++){
            var sprName = "";
            switch (targetsArr[i]){
                case TARGET_TYPE.PLANE:
                    sprName = "#"+TargetModelRes.plane;
                    break;
                case TARGET_TYPE.TANK:
                    sprName = "#"+TargetModelRes.tank;
                    break;
                case TARGET_TYPE.CANNON:
                    sprName = "#"+TargetModelRes.cannon;
                    break;
                default :
                    sprName = "";
                    break;
            }
            if ("" != sprName) {
                var modelSpr = new cc.Sprite(sprName)
                modelSpr.setPosition(110/2, 160/2+i*140);
                this.addChild(modelSpr);
            }
            cc.log("target type is "+targetsArr[i]);
        }
    },

    updateTargetTips:function(targetsTypeArr){
        this.removeAllChildren();
        this.initTargetTips(targetsTypeArr);
    }
})