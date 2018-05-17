(function(){
    //取消浏览器的所有事件，使得active的样式在手机上正常生效
    document.addEventListener('touchstart',function(){
        return false;
    },true);
    // 禁止选择
    document.oncontextmenu=function(){
        return false;
    };
    function plusReady(){
        // plus.navigator.setStatusBarBackground("#2B2B2B"); // 状态栏背景颜色
        // 隐藏滚动条
        plus.webview.currentWebview().setStyle({scrollIndicator:'none'});
        // Android处理返回键
        plus.key.addEventListener('backbutton',function(){
            ('iOS'==plus.os.name)?plus.nativeUI.confirm('确认退出？', function(e){
                if(e.index>0){
                    plus.runtime.quit();
                }
            }, '提示', ['取消','确定']):(confirm('确认退出？')&&plus.runtime.quit());
        },false);
        // compatibleAdjust();
        // 获取音频目录对象
        plus.io.resolveLocalFileSystemURL('_doc/', function(entry){
            entry.getDirectory('audio', {create : true}, function(dir){
                gentry = dir;
                updateHistory();
            }, function(e){
                // alert('Get directory "audio" failed: '+e.message);
            });
        }, function(e){
            // alert('Resolve "_doc/" failed: '+e.message);
        } );
    }
    // 获取录音历史列表 createItem
    function updateHistory(){
        if(bUpdated||!gentry||!document.body){//兼容可能提前注入导致DOM未解析完更新的问题
            return;
        }
        var reader = gentry.createReader();
        reader.readEntries(function(entries){
            for(var i in entries){
                if(entries[i].isFile){
                    // createItem(entries[i]);
                    console.log(entries[i]);
                }
            }
        }, function(e){
            // alert('读取录音列表失败：'+e.message);
        });
        bUpdated = true;
    }

    // 扩展API加载完毕后调用onPlusReady回调函数 
    document.addEventListener( "plusready", onPlusReady, false );
    
    // 扩展API加载完毕，现在可以正常调用扩展API 
    function onPlusReady() {
        HTML_R = plus.audio.getRecorder(); 
    }
    // 原生事件封装__全局投射
    window.WebView_Object = function () { };
    WebView_Object.prototype = {
        // 开始录音
        startRecord : function () {
            if ( HTML_R == null ) {
                // alert( "录音对象未获取" );
                return;
            }
            HTML_R.record( {
                filename:"_doc/audio/"
            }, function (p) {
                plus.io.resolveLocalFileSystemURL(p, function(entry){

                    entry.file(function(file){
                        var reader = new plus.io.FileReader();
                        reader.onloadend = function (e) {
                            console.log(e.target.result);
                        };
                        reader.readAsDataURL(file);
                    },function(e){
                        // alert("读写出现异常: " + e.message );
                    })
                    // audio_URL = entry.name;
                }, function(e){
                    // alert('读取录音文件错误：'+e.message);
                });
            }, function ( e ) {
                // alert( "录音失败: " + e.message );
            } );
            return this;
        },
        // 结束录音
        stopRecord : function () {
            HTML_R.stop();
            return this;
        },
        // 播放音频文件
        playAudio : function (li){
            if(!li){
                // alert('无效的音频文件');
                return;
            }
            console.log(li)
            this.startPlay(li);
        },
        // 开始播放
        startPlay : function (url){
            p = plus.audio.createPlayer(url);
            p.play(function(){
                console.log('播放完成！');
            }, function(e){
                alert('播放音频文件"'+url+'"失败：'+e.message);
            });
        },
        // 从相册中选择图片
        galleryImg : function (){
            // outSet('从相册中选择图片：');
            plus.gallery.pick(function(path){
                // outLine(path); // 转base64上传
                var reader = new plus.io.FileReader();
                reader.onloadend = function (e) {
                    JPEG(e.target.result)
                };
                reader.readAsDataURL(path);
            }, function(e){
                // outSet('取消选择图片');
            }, {filter:'image'});
        },
    } 
    if(window.plus){
        plusReady();
    }else{
        document.addEventListener('plusready',plusReady,false);
    }
})()