
function Http(){
    var _succCallback = function(){};
    var _errCallback = function(){};

}
Http.prototype.getJSON = function(url,data,callBack,errorCallBack ){
    if(typeof (callBack) == "function"){
        this._succCallback = callBack;
    }else{
        this._succCallback = function(){}
    }
    if(typeof (errorCallBack) == "function"){
        this. _errorCallBack = errorCallBack;
    }
    var xmlHttp = new XMLHttpRequest();

    var params = "";
    if(typeof(data)=="object"){
        for(key in data){
            params+=(key+"="+data[key]+"&");
        }
    }else{
        params = data;
    }

    xmlHttp.open("POST",url);
    xmlHttp.send(params);

    var me=this;
    //===================  ajax回调
    xmlHttp.onreadystatechange = function(){

        cc.log(url+" "+ JSON.stringify(params) +xmlHttp.responseText);
        if(xmlHttp.readyState == 4){
            if(xmlHttp.status == 200){
                //Mlog.c("data :",xmlHttp.responseText);
                var strData = "";
                if(xmlHttp.responseText.length>0){ //当内容为空时会有"[]"
                    strData=xmlHttp.responseText;
                    me._succCallback(strData);

                }else{
                    MLog.l("什么都没有，请检查网络");
                    return;
                }
            }
            else{
                //网络错误处理
                if(me._errorCallBack) {
                    JSON.stringify(me._errorCallBack);
                    me._errorCallBack();
                }
            }
        }else{
            //网络错误处理
            if(me._errorCallBack) {
                me._errorCallBack();
            }
        }
    }
}