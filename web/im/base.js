// 地址管理
// var GAME_ALL_URL = 'http://www.wanjiba888.com';
var GAME_ALL_URL = '';
var WANJI_ALL_URL = 'http://cow.haminniao.com/api';



// rem控制代码
// 把尺寸放大N倍（N是window.devicePixelRatio）
var wdaaachen = document.documentElement.clientWidth*window.devicePixelRatio/10;
//物理像素*设备像素比=真实像素
document.getElementsByTagName("html")[0].style.fontSize = wdaaachen + "px";
// 把屏幕的倍率缩小到N分之一（N是window.devicePixelRatio）
var scale = 1/window.devicePixelRatio;
var mstr = 'initial-scale='+ scale +', maximum-scale='+ scale +', minimum-scale='+ scale +', user-scalable=no';
document.getElementById("vp").content = mstr;

var br_goEasy = null;
br_goEasy = new GoEasy({
    appkey: 'BC-d074375f4cab438da73d82aa9dcf6c6e',
    userId: '25',
    onConnected: function () {
        console.log("成功连接GoEasy。");
    },
    onDisconnected: function () {
        console.log("与GoEasy连接断开。");
    },
    onConnectFailed: function (error) {
        console.log("与GoEasy连接失败，错误编码：" + error.code + "错误信息：" + error.content);
    }
});

// 控制台输出日志
function outSet(msg) {
    console.log(msg);
}
// 界面弹出吐司提示
function outLine(msg) {
    mui.toast(msg);
}

var IMG_WX_WANJI = null;
// H5 plus事件处理
var as='pop-in';// 默认窗口动画
var audio_TYPE = 1;
var er = null, rt = null, t = null, HTML_R = null, ri = null;
var bUpdated = false;
var audio_URL = null;
var end_time = 0;
var BASE64 = null;
var JPEG64 = null;
var JPEG_SRC = null;
