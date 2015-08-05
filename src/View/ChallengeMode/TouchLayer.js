/**
 * Created by bigqiang on 15/6/28.
 */
var TouchLayer = BaseLayer.extend({
    _classname:"TouchLayer",
    _xUnits:0,
    _yUnits:0,
    _selectedModel:null,

    ctor:function(contentSize, xUnit, yUnit){
        this._super();
        this.setOpacity(0);
        this.setContentSize(contentSize);
        this.ignoreAnchorPointForPosition(false);
        this.setAnchorPoint(0, 0);
        this.setPosition(0,0);
        this._xUnits = xUnit;
        this._yUnits = yUnit;
        this.createTouchListener();

        return true;
    },

    onEnter:function(){
        this._super();

    },

    onExit:function(){


        this._super();
    },

    getXUnitsNum:function(){
        return this._xUnits;
    },

    getYUnitsNum:function(){
        return this._yUnits;
    },

    updateSelectedModel:function(model){
        this._selectedModel = model;
    },

    getSelectedModel:function(){
        return this._selectedModel;
    },

    createTouchListener:function(){
        var xU = this.getXUnitsNum();
        var yU = this.getYUnitsNum();

        var listener1 = cc.EventListener.create({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches:true,
            beginPosi:null,
            lastX:0,
            lastY:0,
            lastTakeUpSpr:null,
            lastSelectedModel:null,
            illegalPointsList:new Array(),

            onTouchBegan:function(touch, event){
                //cc.log("touch layer onTouchBegan");
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                this.beginPosi = locationInNode;
                this.lastX = 0;
                this.lastY = 0;
                this.illegalPointsList = new Array();
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);

                //cc.log(s.width + " "+ s.height);
                if (null == target.getSelectedModel()) {
                    return false;
                };
                //if (cc.rectContainsPoint(rect, locationInNode)) {
                    return true;
                //}
                //return false;
            },
            onTouchMoved:function(touch, event){
                cc.log("touch layer onTouchMoved");
                var target = event.getCurrentTarget();
                var movePoint = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (!cc.rectContainsPoint(rect, movePoint)) {
                    var pointsList = target.getSelectedModel().getAbsolutePartsSet();
                    for (var k = 0; k < pointsList.length; k ++){
                        var tag = pointsList[k].x * 100 + pointsList[k].y + 1;
                        var markSpr = target.getDelegate().getChildByTag(tag);
                        if (markSpr){
                            markSpr.showLayoutTip(false);
                        }
                    }
                    return;
                }
                //cc.log("point x,y is"+touch.getLocation().x, touch.getLocation().y);

                var isFind = false;
                for (var i = this.lastX; i < xU; i ++){
                    for (var j = this.lastY; j < yU; j ++){
                        var tmpSpr = target.getDelegate().getChildByTag(i*100+j+1);
                        if(tmpSpr){
                            //cc.log("tmpSpr "+tmpSpr.getContentSize().width+"   "+tmpSpr.getContentSize().height)
                            if ((movePoint.x > tmpSpr.x && movePoint.x < tmpSpr.x + tmpSpr.getContentSize().width) &&
                                (movePoint.y > tmpSpr.y && movePoint.y < tmpSpr.y + tmpSpr.getContentSize().height)){
                                //cc.log("onTouchMoved true"+(i*100+j+1));
                                this.lastX = i-1;
                                this.lastY = j-1;
                                isFind = true;

                                if ((this.lastTakeUpSpr && (tmpSpr !== this.lastTakeUpSpr))) {
                                    //this.lastTakeUpSpr.showLayoutTip(false);
                                    this.lastSelectedModel = target.getSelectedModel();
                                    // update sprite by model point list
                                    var pointsList = target.getSelectedModel().getAbsolutePartsSet();
                                    for (var k = 0; k < pointsList.length; k ++){
                                        var tag = pointsList[k].x * 100 + pointsList[k].y + 1;
                                        var markSpr = target.getDelegate().getChildByTag(tag);
                                        if (markSpr){
                                            markSpr.showLayoutTip(false);
                                        }
                                    }

                                }

                                if (!tmpSpr.getIsTakeUp()){
                                    target.getSelectedModel().updateModelData(new Point(i,j));
                                    this.lastSelectedModel = target.getSelectedModel();
                                    this.lastTakeUpSpr = tmpSpr;

                                    this.illegalPointsList.splice(0, this.illegalPointsList.length);
                                    // update sprite by model point list
                                    var legality = target.checkPointListLegality();
                                    var pointsList = target.getSelectedModel().getAbsolutePartsSet();
                                    for (var k = 0; k < pointsList.length; k ++){
                                        var tag = pointsList[k].x * 100 + pointsList[k].y + 1;
                                        var markSpr = target.getDelegate().getChildByTag(tag);
                                        if(markSpr){
                                            markSpr.showLayoutTip(true, legality);
                                            if (!legality) {
                                                this.illegalPointsList.push(pointsList[k]);
                                            }
                                        }
                                    }
                                }

                                break;
                            } else {


                            }
                        }
                    }
                    if (isFind) break;
                }
            },

            onTouchEnded:function(touch, event){
                cc.log("touch layer onTouchEnded");
                var target = event.getCurrentTarget();
                var locationInNode = target.convertToNodeSpace(touch.getLocation());
                var s = target.getContentSize();
                var rect = cc.rect(0, 0, s.width, s.height);
                if (cc.rectContainsPoint(rect, locationInNode)) {
                    UpdateUIManager.getInstance().dispatch(NOTIFY.TARGET_MODEL_PLACED, target.getSelectedModel());
                }
                target.updateSelectedModel(null);
                cc.log("length is "+this.illegalPointsList.length);
                for(var i = 0; i < this.illegalPointsList.length; i++){
                    var tag = this.illegalPointsList[i].x * 100 + this.illegalPointsList[i].y + 1;
                    cc.log("tag is "+tag);
                    var markSpr = target.getDelegate().getChildByTag(tag);
                    if(markSpr){
                        markSpr.showLayoutTip(false);
                    }
                }
                this.illegalPointsList = null;
            },

        });
        cc.eventManager.addListener(listener1, this);

    },


    checkPointListLegality:function() {
        return this.getDelegate().getParent().checkTargetModelPlacingLegality(this.getSelectedModel())

        //var legality = true;
        //var pointList = this.getSelectedModel().getAbsolutePartsSet();
        //for (var i = 0; i < pointList.length; i ++){
        //    if (pointList[i].x >= this.getXUnitsNum() || pointList[i].y >= this.getYUnitsNum()){
        //        legality = false;
        //        return false;
        //        break;
        //    }
        //}
        //
        //
        //
        //
        //
        //return legality;
    }
})
