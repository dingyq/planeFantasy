
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

var RET_CODE = {
    SUCCESS:0,
    //账户相关
    //-101001 业务错误,需要显示给用户的(如密码错误或注册时，此手机号已经测试过了)
    //-102001
    //-103001
    ILLEGAL_PARAMETERS:-10000,        //非法参数
    UNKNOW_ERROR:-101001,             //未知错误
    LOGINNAME_ERROR:-101002,          //用户名不存在
    PASSWORD_ERROR:-101003,           //密码错误
    LOGIN_NO_ERROR:-101004,           //没有登录
    AUTH_ERROR:-101005,               //授权码错误
    AUTH_FAILURE:-101006,             //授权码失效
    AUTH_CODE_EMPTY:-101007,             //验证码为空
    AUTH_CODE_ERROR:-101008,             //验证码错误
    USEUP_FIVE_CHANCE:-101009,        //在30分钟内，输错5次密码，暂时不能登录
    USER_ACCOUNT_FREEZED:-101012, //用户冻结了，不能登录,后台冻结
    LOGIN_REPEAT_ONLINE_ERROR:-101013, //同一个用户同时在线
    //注册
    UNKNOW_ERROR:-102001,             //未知错误
    ILLEGAL_NAME:-102002,             //用户名非法
    ILLEGAL_PASSWORD:-102003,         //密码非法
    AFFIRM_PASSWORD_WRONG:-102004,     //两次密码不一样
    EXIST_LOGINNAME:-102005,           //用户名已存在
    REPEAT_SHORT_MESSAGE_CODE:-102007,  //重复发送短信验证码
    AUTHCODE_UP_LIMIT:-102012,   //您的手机接收验证码次数已超过上限
    //与用户交互（房间内）
    CHAT_FREQUENCY_NUM_ERR:-214001,     //在规定时间内发送魔法表情的次数不能超过规定的最大值
    GAME_MONEY_LACK:-202023,         //游戏币不足
    SNG_MATCH_ING:-202031,          //用户当前正处于sng桌的比赛状态，不能执行当前的入座操作
    SNG_STANDUP:-202032, //用户当前正处于sng桌的围观状态，不能执行当前的入座操作
    ALREADY_SIT:-202001, //用户已处于坐下状态
    STANDUP_NOT_NEED:-203001,    //已处于站起或离桌状态，无需再执行站起
    CHANGE_LEFT_CHIP_LACK:-212003,   //用户剩余筹码不足,不能换桌
    SIT_NO_EMPTY_SEAT:-202006,   //没有空座位

    SIT_AGAIN_UPDATE_ERR:-202007, //用户重新坐下时更新人桌信息失败
    SIT_USER_STATUS_FORBID:-202021, //用户在所有的桌子里面存在“非离开”的状态，不能入座sng牌桌
    STANDUP_GET_USER_SEAT_ERR:-203006, //用户站起来后取牌局中的在座的用户列表出错
    STANDUP_UPDATE_LAST_ACTIVE_SEAT_ERR:-203007, //本轮最后一个投注用户站起来后更新本轮最后投注用户的位置失败
    BET_HOLE_CARD_ERR:-204013,  //更新底牌信息出错
    BET_BOARD_PRIZE_UPDATE_BOARD_STATUS_ERR:-204027, //牌局派奖后更新牌局的派奖状态失败

    //返回大厅（房间内）
    //激活用户
    SESSION_KEY_OUTTIME:-600003,     //sessionKey超时

}