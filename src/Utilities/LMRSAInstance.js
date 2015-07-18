/**
 * Created by bigqiang on 15/7/2.
 */

var LMRSAInstance = cc.Class.extend({
    _rsaInstance:null,

    ctor:function(){
        //return true;
    },

    init:function(){
        this._rsaInstance = new RSAKey();
        this._rsaInstance.generate(512, "10001");
        return true;
    },

    getPublicKey:function(){
        var ts = this._rsaInstance.n.toString(16);
        return ts;
    },

    decrypt:function(secretStr){
        if(secretStr.length == 0) {
            return "";
        }
        var ts = this._rsaInstance.n.toString(16);
        var res = this._rsaInstance.b64_decrypt(secretStr);
        if(res == null) {
            cc.log("Decryption failed");
            return "";
        } else {
            cc.log("Decryption Time: ");
        }
        return res;
    },

    getMd5Key:function(){
        return "";
    },
})

LMRSAInstance._sharedInstance = null;
LMRSAInstance.getInstance = function(){
    if (!this._sharedInstance) {
        this._sharedInstance = new LMRSAInstance();
        if(this._sharedInstance.init()){
            return this._sharedInstance;
        }
    }else{
        return this._sharedInstance;
    }
    return this._sharedInstance;
}