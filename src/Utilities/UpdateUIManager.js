//全局事件名称
var NOTIFY = {
    GAME_OVER:"gameOver",
    RESTART_GAME:"restartGame",
    TARGET_HEAD_HIT:"targetHeadHit",
    TARGET_BODY_HIT:"targetBodyHit",
    TARGET_TRY_HIT:"targetTryHit",
    TARGET_MODEL_SELECTED:"targetModelSelected",
    TARGET_MODEL_PLACED:"targetModelPlaced",
}

var UpdateUIManager=cc.Class.extend({
    _pageManagers:null,
    init:function(){
        this._pageManagers={};
    },
    /**
     * 添加事件监听
     * @param pageStr 标识在哪个page上(自定义的，不同page的pageStr不同)
     * @param func
     */
    addPageUpdateListeners :function(pageStr,func,targetObj, multiple){
        multiple = multiple || 0;
        if(!this._pageManagers[pageStr]){
            this._pageManagers[pageStr]=new signals.Signal();
        }

        if(!multiple){
            this._pageManagers[pageStr].removeAll();
        }
        this._pageManagers[pageStr].add(func,targetObj);
    },
    removeListeners:function(pageStr){
        if(this._pageManagers&&this._pageManagers[pageStr])
            this._pageManagers[pageStr].removeAll();
    },
    /**
     * 根据pageStr分发pageStr指定的页面的事件
     * @param pageStr
     * @param params type json
     */
    dispatch:function(pageStr,params){
        if(this._pageManagers[pageStr]){
            this._pageManagers[pageStr].dispatch(params);
        }
    }
});
UpdateUIManager.s_SharedPageManager = null;
UpdateUIManager.getInstance = function () {
    if (!UpdateUIManager.s_SharedPageManager) {
        UpdateUIManager.s_SharedPageManager = new UpdateUIManager();
        UpdateUIManager.s_SharedPageManager.init();
    }
    return UpdateUIManager.s_SharedPageManager;
};