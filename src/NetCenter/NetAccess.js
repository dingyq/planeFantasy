/**
 * Created by bigqiang on 15/7/1.
 */

var NetAccess = cc.Class.extend({
	_className:"NetAccess",
	_sharedXhr:null,

	ctor:function(){
		this.init()
	},

	init:function(){
		return true;
	},

	getSign:function(reqPkg){
		var url = "";
		var signStr = "";
		var keyList = [];
		var i = 0;
		for (var key in reqPkg) {
			keyList[i] = key;
			i = i + 1;
		}
		keyList.sort();

		for (var index in keyList){
			var key = keyList[index];
			url = url+key+"="+encodeURIComponent(reqPkg[key])+"&";
//			cc.log(encodeURIComponent(reqPkg[key]))
//			cc.log(encodeURI(reqPkg[key]))
			signStr = signStr+key+reqPkg[key];
		}

		signStr = signStr+TexasPokerUser.getInstance().getUrlKey();
		var urlsign = hex_md5(signStr);
		url = url+"urlsign="+urlsign;
		var result = {
			urlRlt:url,
			urlSignRlt:urlsign
		};
		//cc.log("url is "+JSON.stringify(JSON.stringify(keyList)));
		return result
	},

	urlFormat:function(reqPkg){
		//参数补齐
		//if (reqPkg["from_where"] == null && Helper.getChannel()!= null) {
		//	reqPkg["from_where"] = Helper.getChannel();
		//}
		//if (reqPkg["uid"] == null && TexasPokerUser.getInstance().getUserId() != null) {
		//	reqPkg["uid"] = TexasPokerUser.getInstance().getUserId();
		//}
		//if (reqPkg["session_id"] == null && TexasPokerUser.getInstance().getSessionId() != null) {
		//	reqPkg["session_id"] = TexasPokerUser.getInstance().getSessionId();
		//}
		//if (reqPkg["version"] == null) {
		//	reqPkg["version"] = Helper.getAppVersion();
		//}
		//if (reqPkg["script_version"] == null) {
		//	reqPkg["script_version"] = LocalStorage.getInstance().getScriptVersion();
		//}

		var requestRlt = this.getSign(reqPkg);
		return requestRlt;
	},

	downloadImage:function(imageUrl, funcCallBack){
		cc.log("imageUrl "+imageUrl);
		if(null == imageUrl || "" == imageUrl) {
			funcCallBack(false);
			return;
		}
		var loadCb = function(err, img){
			if (err != null) {
				cc.log(err)
				return
			}
			funcCallBack(true, img);
		}
		cc.loader.loadImg(imageUrl, {isCrossOrigin:true}, loadCb);
	},

	getRequest:function(reqPkg, funcCallBack){
		var result = this.urlFormat(reqPkg);
		var reqUrl = result["urlRlt"];
		var urlString = serverAddr+reqUrl;
		var xhr = cc.loader.getXMLHttpRequest();
		xhr.open("GET", urlString);
		xhr.onreadystatechange = function (){
			cc.log("xhr.readyState "+xhr.readyState);
			cc.log(xhr.responseText);
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
				var responseObj = JSON.parse(xhr.responseText);
				if (responseObj["retcode"] == RET_CODE.SESSION_KEY_OUTTIME) {

				}else {
					funcCallBack(true, responseObj);
				}
			}else if(xhr.status == -1){
				cc.log("http链接超时");
			}
		};
		xhr.send();
	},

	postRequest:function(reqPkg, funcCallBack){
		var result = this.urlFormat(reqPkg);
		var reqUrl = result["urlRlt"];
		var urlString = serverAddr;
		var xhr = cc.loader.getXMLHttpRequest();
		//xhr.timeout= 10;
		xhr.open("POST", urlString+reqUrl);
		xhr.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		//xhr.setRequestHeader("Content-Type","text/plain;charset=UTF-8");
		cc.log(urlString + reqUrl);
		xhr.onreadystatechange = function (){
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
				cc.log("done "+xhr.responseText);
				var responseObj = JSON.parse(xhr.responseText);
				if (responseObj["retcode"] == RET_CODE.SESSION_KEY_OUTTIME) {

				}else if(responseObj["retcode"] == RET_CODE.LOGIN_REPEAT_ONLINE_ERROR){

				}else {
					funcCallBack(true, responseObj);
				}
			}else if(xhr.status == -1){
				funcCallBack(false);
				cc.log("http time out js");
			}else{
				if(xhr.readyState == 1){
					cc.log("opened");
				}else if(xhr.readyState == 2){
					cc.log("receiving");
				}else if(xhr.readyState == 3){
					cc.log("loading");
				} else {
					funcCallBack(false);
					cc.log("http link wrong");
				}
			}
		};
		xhr.send(reqUrl);
		return xhr;
	},
})

NetAccess._sharedXhr = null

NetAccess.getInstance = function(){
	//cc.assert(NetAccess._sharedXhr, "Havn't call setSharedXhr");
	if (!NetAccess._sharedXhr) {
		NetAccess._sharedXhr = new NetAccess();
	}
	return NetAccess._sharedXhr;
}

