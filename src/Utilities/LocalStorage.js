var LocalStorage = cc.Class.extend({
    _db:null,
    _dbKey:{
        uid:"uid",
        loginTime:"logintime"
    },

    init:function(){
        return;
    },

    insertRecordInfo:function(infoObj){
        if(infoObj != null){
            cc.sys.localStorage.setItem(this._dbKey.uid, infoObj[this._dbKey.uid]);
            cc.sys.localStorage.setItem(this._dbKey.loginTime, infoObj[this._dbKey.loginTime]);
        }
    }
})

LocalStorage._sharedStorage = null;

LocalStorage.getInstance = function(){
    cc.assert(LocalStorage._sharedStorage, "Havn't call setSharedStorage");

    if(!LocalStorage._sharedStorage){
        LocalStorage._sharedStorage = new LocalStorage();
        if(LocalStorage._sharedStorage.init()){
            return LocalStorage._sharedStorage;
        }
    }else{
        return LocalStorage._sharedStorage;
    }
}