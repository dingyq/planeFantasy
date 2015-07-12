
//服务器接口地址
var serverAddr = "http://www.995078.com/";//正式线上
//var serverAddr = "http://192.168.1.11/";//测试

//具体方法实现方法
var NetManager = {

    /**
     * 通用获取数据方法getMessage
     * @param successCallBack 成功后回调函数
     * @param errorCallBack  失败后回调函数(默认不填)
     */
    getMessage: function(data,successCallBack) {
        var http = new Http();
        var sendData = data;
        http.getJSON(serverAddr, sendData, successCallBack, null);
    }

};