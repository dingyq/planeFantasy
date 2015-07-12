

var flareEffect = function (flare, target, callback) {
    var size = cc.winSize;
    flare.stopAllActions();
    flare.setBlendFunc(cc.SRC_ALPHA, cc.ONE);
    flare.attr({
	    x: -45,
	    y: size.height/2,
	    visible: true,
	    opacity: 0,
		rotation: -120,
		scale: 0.3
	});

    var opacityAnim = cc.fadeTo(0.5, 255);
    var opacDim = cc.fadeTo(1, 0);
    var biggerEase = cc.scaleBy(0.7, 1.2, 1.2).easing(cc.easeSineOut());
    var easeMove = cc.moveBy(0.5, cc.p(size.width/2, 0)).easing(cc.easeSineOut());
    var rotateEase = cc.rotateBy(2.5, 90).easing(cc.easeExponentialOut());
    var bigger = cc.scaleTo(0.5, 1);

    var onComplete = cc.callFunc(callback, target);
    var killflare = cc.callFunc(function () {
        this.parent.removeChild(this,true);
    }, flare);
    flare.runAction(cc.sequence(opacityAnim, biggerEase, opacDim, killflare, onComplete));
    flare.runAction(easeMove);
    flare.runAction(rotateEase);
    flare.runAction(bigger);
};


var FlashSprite = function(sprName, parent){
//        this._super(sprName);
    var stencil = new cc.Sprite(sprName);
    var clipper = new cc.ClippingNode();
    clipper.stencil = stencil;
    clipper.alphaThreshold = 0;

    var spr_title = new cc.Sprite(sprName);
    var spark = new cc.Sprite("res/common/spark.png");
    clipper.addChild(spr_title);
    clipper.addChild(spark);
    var parentSize = parent.getContentSize();
    clipper.setPosition(cc.p(parentSize.width/2, parentSize.height/2));
    parent.addChild(clipper);

    var sz = spr_title.getContentSize();
    var move = cc.moveTo(0.6, cc.p(sz.width, 0));
    var delay1 = cc.delayTime(0.5);
    var move_back = cc.moveTo(0.6, cc.p(-sz.width, 0));
    var delay2 = cc.delayTime(0.5);
    var seq = cc.sequence(delay1, move, delay2, move_back);
    var repeatAction = seq.repeatForever();
    spark.runAction(repeatAction);
}