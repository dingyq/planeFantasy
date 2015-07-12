
var NetAccess = cc.Class.extend({
	_sharedXhr:null,
	
	ctor:function(){
		this.init()
	},
	
	init:function(){
		return true;
	},
	
	_getSign:function(reqPkg){
		var url = "";
		var signStr = "";
		var keyList = [];
		var i = 0;
		for (var key in reqPkg) {
			keyList[i] = key;
			i = i + 1;
		}
		Array.sort(keyList);
		
		for (var index in keyList){
			var key = keyList[index];
			url = url+key+"="+encodeURIComponent(reqPkg[key])+"&";
//			cc.log(encodeURIComponent(reqPkg[key]))
//			cc.log(encodeURI(reqPkg[key]))
			signStr = signStr+key+reqPkg[key];
		}
		
		signStr = signStr+Landlords.getInstance().getUrlKey();
		var urlsign = hex_md5(signStr);
		url = url+"urlsign="+urlsign;
		var result = {
			urlRlt:url,
			urlsignRlt:urlsign
		};
		
		cc.log("url is "+JSON.stringify(JSON.stringify(reqPkg)));
//		cc.log("url is "+JSON.stringify(reqPkg));
		return result
	},
	
	urlFormat:function(reqPkg){
		//参数补齐
		if (reqPkg["from_where"] == null && Helper.getChannel()!= null) {
			reqPkg["from_where"] = Helper.getChannel();
		}
		if (reqPkg["uid"] == null && Landlords.getInstance().getUsrId() != null) {
			reqPkg["uid"] = Landlords.getInstance().getUsrId();
		}
		if (reqPkg["session_id"] == null && Landlords.getInstance().getSessionId() != null) {
			reqPkg["session_id"] = Landlords.getInstance().getSessionId();
		}
		if (reqPkg["version"] == null) {
			reqPkg["version"] = Helper.getAppVersion();
		}
		if (reqPkg["script_version"] == null) {
			reqPkg["script_version"] = cc.sys.localStorage.getItem(LD.CURRENT_LUA_VERSION_CODE); 
		}
		
		if (reqPkg['game'] == null) {
			reqPkg['game'] = LD.GAME_NAME;
		}
		
		var requestRlt = this._getSign(reqPkg);
		return requestRlt;
	},
	
	loadImage:function(imagePath, funcCallBack){
		imagePath = "http://www.999com.com/index.php?r=user/getvercode&loginname=18682328421";
		if (imagePath==null || imagePath=="") {
			return
		}
		var xhr = cc.loader.getXMLHttpRequest();
		xhr.responseType = "arraybuffer";
		xhr.open("GET", imagePath);
		xhr.onreadystatechange = function (){
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
//				var responseObj = JSON.parse(xhr.responseText);
				var responseObj = xhr.response;
				if (responseObj["retcode"] == LMRC_RET_CODE.SESSION_KEY_OUTTIME) {

				}else if(responseObj["retcode"] == LMRC_RET_CODE.LOGIN_REPEAT_ONLINE_ERROR){

				}else {	
					funcCallBack(true, responseObj);
				}
			}else if(xhr.status == -1){
				cc.log("http链接超时");
			}
		};

		xhr.send()
	},
	
	loadImgFromUrl: function (target, imgUrl, p, tag) {
//		NetAccess.getInstance().loadImgFromUrl(this.tmpLayer, imagePath, cc.p(0,0),10);
		if(!imgUrl)return;
		var self = target;
		var loadCb = function(err, img){
			if (err != null) {
				cc.log(err)
				return
			}
			var logo  = new cc.Sprite(img); 
			logo.x = p.x;
			logo.y = p.y;
			logo.tag = tag;
			self.addChild(logo);
		}
		cc.loader.loadImg(imgUrl, null, loadCb);
	},
	
	getRequest:function(reqPkg, funcCallBack){
		var result = this.urlFormat(reqPkg);
		var reqUrl = result["urlRlt"];
		var urlString = Helper.hostName()+"/index.php?"+reqUrl;
		var xhr = cc.loader.getXMLHttpRequest();
		xhr.open("GET", urlString);
		xhr.onreadystatechange = function (){
			cc.log("xhr.readyState "+xhr.readyState);
			cc.log(xhr.responseText);
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
				var responseObj = JSON.parse(xhr.responseText);
				if (responseObj["retcode"] == LMRC_RET_CODE.SESSION_KEY_OUTTIME) {

				}else if(responseObj["retcode"] == LMRC_RET_CODE.LOGIN_REPEAT_ONLINE_ERROR){

				}else {	
					funcCallBack(true, responseObj);
				}
			}else if(xhr.status == -1){
				cc.log("http链接超时");
			}
		};
		
		xhr.send();
		
	},
	
	postRequest:function(route, reqPkg, funcCallBack){
		var result = this.urlFormat(reqPkg);
		var reqUrl = result["urlRlt"];
		var urlString = LD.URL_HEADER + route;
		
//		var urlString = "http://"+Helper.hostName()+"/index.php/user/register";
		
//		var urlString = "http://google.com.hk";
		var xhr = cc.loader.getXMLHttpRequest();
		xhr.timeout= 10;
		xhr.open("POST", urlString);
		cc.log(urlString + "?" + reqUrl);
//		cc.log(reqUrl);
		xhr.onreadystatechange = function (){
			cc.log("xhr.readyState "+xhr.readyState);
			cc.log(xhr.responseText);
			if (xhr.readyState == 4 && (xhr.status >= 200 && xhr.status <= 207)) {
				var responseObj = JSON.parse(xhr.responseText);
				if (responseObj["retcode"] == LMRC_RET_CODE.SESSION_KEY_OUTTIME) {
					
				}else if(responseObj["retcode"] == LMRC_RET_CODE.LOGIN_REPEAT_ONLINE_ERROR){
					
				}else {	
					funcCallBack(true, responseObj);
				}
			}else if(xhr.status == -1){
				funcCallBack(false);
				cc.log("http time out js");
			}else{
				funcCallBack(false);
				cc.log("http link wrong");
			}
		};
		xhr.send(reqUrl);
		return xhr;
	},
})

NetAccess._sharedXhr = null

NetAccess.getInstance = function(){
	cc.assert(NetAccess._sharedXhr, "Havn't call setSharedXhr");
	if (!NetAccess._sharedXhr) {
		NetAccess._sharedXhr = new NetAccess();
	}
	return NetAccess._sharedXhr;
}

