var FlashSprite = cc.Class.extend({
    ctor:function(sprName){
//        this._super(sprName);

        var stencil = new cc.Sprite(sprName);
        var clipper = new cc.ClippingNode();
        clipper.stencil = stencil;
        clipper.alphaThreshold = 0;

        var spr_title = new cc.Sprite(sprName);
        var spark = new cc.Sprite("res/spark.png");
        clipper.addChild(spr_title)
        clipper.addChild(spark)
        clipper.setPosition(cc.p(62, 18))
//        aboutItem.addChild(clipper)

        var sz = spr_title.getContentSize();

        var move = cc.moveTo(0.6, cc.p(sz.width, 0));
        var delay1 = cc.delayTime(0.5);
        var move_back = cc.moveTo(0.6, cc.p(-sz.width, 0));
        var delay2 = cc.delayTime(0.5);
        var seq = cc.sequence(delay1, move, delay2, move_back);
        var repeatAction = seq.repeatForever();
        spark.runAction(repeatAction)
    }

})