
var shares=null,share_bhref=false;
var share_img='';//分享显示图片
var share_thumb_img=''//缩略图
var share_content='';//分享内容
var share_href='';//分享链接
var share_title='';//分享标题
var bussType = '';//业务类型
var bussId = '';//业务单号
var wrhShare = function(){
    return {
        /**
         * 初始化分享服务
         */
        init : function(){
            plus.share.getServices( function(s){
                shares={};
                for(var i in s){
                    var t=s[i];
                    shares[t.id]=t;
                }
            }, function(e){
                mui.toast( "获取分享服务列表失败："+e.message );
            } );

        },
        /**
         * 分享操作
         * @param {Object} id
         * @param {Object} ex
         */
        shareAction : function(id,ex){
            var s=null;
            if(!id||!(s=shares[id])){
                mui.toast( "无效的分享服务！" );
                return;
            }
            if ( s.authenticated ) {
                wrhShare.shareMessage(s,ex);
            } else {
                s.authorize( function(){
                        wrhShare.shareMessage(s,ex);
                    },function(e){
                    mui.toast( "认证授权失败："+e.code+" - "+e.message );
                });
            }
        },
        shareShow : function(){
            var ids=[{id:"sinaweibo"},{id:"weixin",ex:"WXSceneSession"},{id:"weixin",ex:"WXSceneTimeline"},{id:"qq"}],
            bts=[{title:"分享到新浪微博"},{title:"发送给微信好友"},{title:"分享到微信朋友圈"},{title:"分享到QQ"}];
            plus.nativeUI.actionSheet({cancel:"取消",buttons:bts},
                function(e){
                    var i=e.index;
                    if(i>0){
                        wrhShare.shareAction(ids[i-1].id,ids[i-1].ex);
                    }else{

                    }
                }
            );
        },
        /**
         * 打开分享操作列表 imgServer
         * @param {Object} bussType_param 业务类型 必填 业务类型枚举类 BusinessTypeEnum
         * @param {Object} bussId_param 业务Id 必填
         * @param {Object} title_param 标题 必填
         * @param {Object} content_param 内容 必填
         * @param {Object} img_param 图片 可选 格式:album/20150725123555_519.JPG,不需要加图片域名 
         * @param {Object} href_param 链接 可选,格式:'http://wanrenhui.com'
         */
        sendShare : function(bussType_param,bussId_param,title_param,content_param,img_param,href_param){
            wrhShare.init();
            bussType = bussType_param;
            bussId = bussId_param;
            share_title = title_param;
            share_content = content_param;
            if(img_param != ''){
                share_img = imgServer+img_param;
                share_thumb_img = imgServer+img_param+'@80w_80h_0e';
            }
            share_href = href_param;
            if(share_href == ''){
                share_bhref=false;
            }else{
                share_bhref=true;
            }
            wrhShare.shareShow();
        },
        /**
         * 发送分享消息
         * @param {Object} s
         * @param {Object} ex
         */
        shareMessage : function(s,ex){
            var msg={extra:{scene:ex}};
            msg.content = share_content;
            msg.title = share_title;
            msg.thumbs=[share_thumb_img];
            msg.pictures=[share_img];
            var sendMessage = function(){
                console.log(JSON.stringify(msg)); 
                var params = {bussType:bussType,bussId:bussId,content:share_content,title:share_title,href:share_href,img:share_img,type:s.id};
                                //保存分享记录到数据库 
                var addShare = function(){
                    wrhFunc.ajax('/userShare/addShare', params, 'post', function(data){
                    });
                }
                s.send( msg, function(){
                    mui.toast("分享到\""+s.description+"\"成功！ ");
                    console.log("分享到\""+s.description+"\"成功，返回应用 ");//分享给qq好友，微信好友如果不返回应用，无法监听到分享成功回调
                    params.status = 0;
                    addShare();
                }, function(e){
                    console.log("分享到\""+s.description+"\"失败！ "+e.code+" - "+e.message);
                    params.status = 1;
                    params.message = e.code+e.message;
                    addShare();
                } );
            }
            if('sinaweibo' == s.id){//新浪微博无法分享链接,不传递href，不能写href='',否则无法显示图片
                if(plus.os.name=="Android"){//Android 不能分享网络图片
                    //下载图片到本地
                    mui.toast("下载图片中，即将打开新浪微博分享...");
                    var dtask = plus.downloader.createDownload();
                    var localPictures = '';
                    function onStateChanged( d, status ) {
                        switch(d.state){
                            case 4:
                            if(status == 200){
                                console.log("图片下载完成：" + d.filename);
                                localPictures = plus.io.convertLocalFileSystemURL(d.filename);
                                msg.thumbs=[localPictures];
                                msg.pictures=[localPictures];
                                sendMessage();
                            } else {
                                mui.toast("下载图片失败");
                            }
                            break;
                            case 1:
                                console.log("下载开始");
                            break;
                            case 2:
                                console.log("请求已响应"); 
                            break;
                            case 3:
                                console.log("下载进行中");
                            break;
                            default:
                                console.log("state: " + d.state);
                            break;
                        }
                    }
                    mui.each(msg.pictures, function(i, n){
                        // 创建下载任务
                        var dtask = plus.downloader.createDownload( n );
                        dtask.addEventListener( "statechanged", onStateChanged, false );
                        dtask.start();
                    });
                }
            }else{
                msg.href=share_href;
                sendMessage();          
            }

        }
    }

}();



var auths=null;
document.getElementById("loginByWX").addEventListener('tap', function() {
    plus.oauth.getServices( function(services){
        auths = services;
        
        for(var k in auths){
            console.log(auths[k].id)
        }
        //auths解释0QQ 1微信 2微博 3小米，但是不建议使用auths[1]类似的写法，因为各个设备排序不一样，比较坑爹
        //注意获取使用unionid，此id通用后期的微信端等它会用户共享，（openid完全唯一）
        //var s = auths[1];
        var s;
        for (var i = 0; i < auths.length; i++){
            //用这样的写法指定第三方，参照：
            //[LOG] : xiaomi
            //[LOG] : qq
            //[LOG] : sinaweibo
            //[LOG] : weixin

            if (auths[i].id == 'weixin'){
             s = auths[i];
             break; 
            }
        }
        
        if(!s.authResult){
            s.login(function(e){
                // 获取登录操作结果
                s.getUserInfo( function(e){
                    console.log( "获取用户信息成功："+JSON.stringify(s.userInfo) );
                    mui.toast('登录成功');
                }, function(e){
                    console.log( "获取用户信息失败："+e.message+" - "+e.code );
                    mui.toast('获取用户信息失败');
                } );
                
            }, function(e){
                mui.toast('登录认证失败');
            });
        }else{
            //已经登录认证
            mui.toast('登录成功');
        }
 
    }, function(e){
        console.log( "获取登录失败："+e.message+" - "+e.code );
        mui.toast('登录认证失败');
    });
});



var Intent = null,
    File = null,
    Uri = null,
    main = null;
var shares = null;
var shareImageUrl = '';
mui.plusReady(function() {  
    updateSerivces();
    if (plus.os.name == "Android") {
        Intent = plus.android.importClass("android.content.Intent");
        File = plus.android.importClass("java.io.File");
        Uri = plus.android.importClass("android.net.Uri");
        main = plus.android.runtimeMainActivity();
    }
})
/**
 * 更新分享服务
 */
function updateSerivces() {
    plus.share.getServices(function(s) {
        shares = {};
        for (var i in s) {
            var t = s[i];
            shares[t.id] = t;
        }
        outSet("获取分享服务列表成功");
    }, function(e) {
        outSet("获取分享服务列表失败：" + e.message);
    });
}
/**
 * 分享操作
 */
function shareAction(id, ex) {
    var s = null;
    if (!id || !(s = shares[id])) {
        outLine("无效的分享服务！");
        return;
    }
    if (s.authenticated) {
        outSet("---已授权---");
        shareMessage(s, ex);
    } else {
        outSet("---未授权---");
        s.authorize(function() {
            shareMessage(s, ex);
        }, function(e) {
            outLine("认证授权失败");
        });
    }
}
/**
 * 发送分享消息
 */
function shareMessage(s, ex) {
    var msg = {
        content: '分享-详情',
        href: 'http://blog.csdn.net/zhuming3834',
        title: 'HGDQ-分享测试-title',
        content: 'HGDQ-分享测试-content',
        thumbs: ['http://img3.3lian.com/2013/v10/4/87.jpg'],
        pictures: ['http://img3.3lian.com/2013/v10/4/87.jpg'],
        extra: {
            scene: ex
        }
    };
    s.send(msg, function() {
        outLine("分享成功!");
    }, function(e) {
        outLine("分享失败!");
    });
}
/**
 * 分享按钮点击事件
 */
function shareHref() {
    var ids = [{
            id: "weixin", 
            ex: "WXSceneSession"  /*微信好友*/
        }, {
            id: "weixin",
            ex: "WXSceneTimeline" /*微信朋友圈*/
        }, {
            id: "qq"   /*QQ好友*/
        }, {
            id: "tencentweibo"   /*腾讯微博*/
        },{
            id: "sinaweibo"  /*新浪微博*/
        }],
        bts = [{
            title: "发送给微信好友"
        }, {
            title: "分享到微信朋友圈"
        }, {
            title: "分享到QQ"
        }, {
            title: "分享到腾讯微博"
        }, {
            title: "分享到新浪微博"
        }];
    plus.nativeUI.actionSheet({
            cancel: "取消",
            buttons: bts
        },
        function(e) {
            var i = e.index;
            if (i > 0) {
                shareAction(ids[i - 1].id, ids[i - 1].ex);
            }
        }
    );
}       
// 控制台输出日志
function outSet(msg) {
    console.log(msg);
}
// 界面弹出吐司提示
function outLine(msg) {
    mui.toast(msg);
}



// 获取用户头像标签
       var headImage = document.getElementById('headImage');

       mui.init({
           swipeBack:true //启用右滑关闭功能
       });

       mui.plusReady(function() {  
           plus.oauth.getServices(function(services) {
               auths = services;
           }, function(e) {
               alert("获取登录服务列表失败：" + e.message + " - " + e.code);
           });
       })

       document.getElementById('weixin').addEventListener('tap',function() {
           console.log("微信");
           authLogin('weixin');
       })
       document.getElementById('qq').addEventListener('tap',function() {
           console.log("QQ");
           authLogin('qq');
       })
       document.getElementById('sinaweibo').addEventListener('tap',function() {
           console.log("微博");
           authLogin('sinaweibo');
       })

       // 登录操作
       function authLogin(type) {
           var s;
           for (var i = 0; i < auths.length; i++) {
               if (auths[i].id == type) {
                   s = auths[i];
                   break;
               }
           }
           if (!s.authResult) {
               s.login(function(e) {
                   mui.toast("登录认证成功！");
                   authUserInfo(type);
               }, function(e) {
                   mui.toast("登录认证失败！");
               });
           } else {
               mui.toast("已经登录认证！");
           }
       }
       //注销
       function authLogout() {
           for (var i in auths) {
               var s = auths[i];
               if (s.authResult) {
                   s.logout(function(e) {
                       console.log("注销登录认证成功！");
                   }, function(e) {
                       console.log("注销登录认证失败！");
                   });
               }
           }
       }
       // 微信登录认证信息
       function authUserInfo(type) {
           var s;
           for (var i = 0; i < auths.length; i++) {
               if (auths[i].id == type) {
                   s = auths[i];
                   break;
               }
           }
           if (!s.authResult) {
               mui.toast("未授权登录！");
           } else {
               s.getUserInfo(function(e) {
                   var josnStr = JSON.stringify(s.userInfo);
                   var jsonObj = s.userInfo;
                   console.log("获取用户信息成功：" + josnStr);
                   showData(type,jsonObj);
                   authLogout();
               }, function(e) {
                   alert("获取用户信息失败：" + e.message + " - " + e.code);
               });
           }
       }
       // 显示用户头像信息
       function showData(type,data) {
           switch (type){
               case 'weixin':
                   headImage.src = data.headimgurl;
                   break;
               case 'qq':
                   headImage.src = data.figureurl_qq_2;
                   break;
               case 'sinaweibo':
                   headImage.src = data.avatar_large;
                   break;
               default:
                   break;
           }
       }



       var auths=null;
       // 监听plusready事件  
       document.addEventListener( "plusready", function(){
        // 扩展API加载完毕，现在可以正常调用扩展API
        plus.oauth.getServices( function(services){
            auths = services;
        }, function(e){
            alert( "获取分享服务列表失败："+e.message+" - "+e.code );
        } );
       }, false );
       // 登录操作
       function authLogin(){
        var s = auths[0];
        if ( !s.authResult ) {
            s.login( function(e){
                alert( "登录认证成功！" );
            }, function(e){
                alert( "登录认证失败！" );
            } );
        }else{
            alert( "已经登录认证！" );
        }
       }
       // 添加用户手机号信息
       function addPhoneNumber(){
        var s = auths[0];
        if ( !s.authResult ) {
            alert("未登录授权！");
        } else {
            s.addPhoneNumber( function(e){
                alert( "添加用户手机号信息成功！" );
            }, function(e){
                alert( "添加用户手机号信息失败："+e.message+" - "+e.code );
            } );
        }
       }



       mui.plusReady(function() {  
                   plus.oauth.getServices(function(services) {
                       auths = services;
                   }, function(e) {
                       alert("获取登录服务列表失败：" + e.message + " - " + e.code);
                   });
               })

               document.getElementById('weixin').addEventListener('tap',function() {
                   console.log("微信");
                   authLogin('weixin');
               })
               document.getElementById('qq').addEventListener('tap',function() {
                   console.log("QQ");
                   authLogin('qq');
               })
               document.getElementById('sinaweibo').addEventListener('tap',function() {
                   console.log("微博");
                   authLogin('sinaweibo');
               })

               // 登录操作
               function authLogin(type) {
                   var s;
                   for (var i = 0; i < auths.length; i++) {
                       if (auths[i].id == type) {
                           s = auths[i];
                           break;
                       }
                   }
                   if (!s.authResult) {
                       s.login(function(e) {
                           mui.toast("登录认证成功！");
                           authUserInfo(type);
                       }, function(e) {
                           mui.toast("登录认证失败！");
                       });
                   } else {
                       mui.toast("已经登录认证！");
                   }
               }
               //注销
               function authLogout() {
                   for (var i in auths) {
                       var s = auths[i];
                       if (s.authResult) {
                           s.logout(function(e) {
                               console.log("注销登录认证成功！");
                           }, function(e) {
                               console.log("注销登录认证失败！");
                           });
                       }
                   }
               }
               // 微信登录认证信息
               function authUserInfo(type) {
                   var s;
                   for (var i = 0; i < auths.length; i++) {
                       if (auths[i].id == type) {
                           s = auths[i];
                           break;
                       }
                   }
                   if (!s.authResult) {
                       mui.toast("未授权登录！");
                   } else {
                       s.getUserInfo(function(e) {
                           var josnStr = JSON.stringify(s.userInfo);
                           var jsonObj = s.userInfo;
                           console.log("获取用户信息成功：" + josnStr);
                           showData(type,jsonObj);
                           authLogout();
                       }, function(e) {
                           alert("获取用户信息失败：" + e.message + " - " + e.code);
                       });
                   }
               }

com.hamingniao.niuniu
D:/ox/superOX/testOx/debug.keystore
androiddebugkey