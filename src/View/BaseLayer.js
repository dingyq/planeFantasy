/**
 * Created by bigqiang on 15/6/26.
 */

var BaseLayer = cc.Layer.extend({
    _delegate:null,

    ctor:function(){
        this._super();

        return true;
    },

    onEnter:function(){
        this._super();
    },

    onExit:function(){
        this._super();
    },

    setDelegate:function(del){
        this._delegate = del;
    },

    getDelegate:function(){
        return this._delegate;
    },



})
