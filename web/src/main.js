import Vue from 'vue';
import Vuex from 'vuex';
import App from './App.vue';
import router from './router/';
import store from './vuex/store.js';


// mintUI
import MintUI from 'mint-ui';
import 'mint-ui/lib/style.css';
Vue.use(MintUI); 

// rem保证
if(!window.wdaaachen){   // 不存在rem则重新载入rem
    var wdaaachen = document.documentElement.clientWidth*window.devicePixelRatio/10;
    document.getElementsByTagName("html")[0].style.fontSize = wdaaachen + "px";
    var scale = 1/window.devicePixelRatio;
    var mstr = 'initial-scale='+ scale +', maximum-scale='+ scale +', minimum-scale='+ scale +', user-scalable=no';
    document.getElementById("vp").content = mstr;
}
// 兼容ios
document.body.addEventListener('touchmove', ()=>{});

// 容量检测
! function(){
    if(!window.localStorage) {
        console.log('浏览器不支持localStorage');
    }
    var size = 0;
    for(var item in window.localStorage) {
        if(window.localStorage.hasOwnProperty(item)) {
            size += window.localStorage.getItem(item).length;
        }
    }
    if((size / 1024).toFixed(2) >= 5120 ){
        localStorage.setItem('oxTxtAll', "{}")
        localStorage.setItem('oxQun', "{}")
    }
    console.log('当前localStorage使用容量为' + (size / 1024).toFixed(2) + 'KB');
} ()


// 创建初始化聊天储存
// localStorage.setItem('oxTxtAll', "{}")
if(!localStorage.oxTxtAll){ // 单聊
  localStorage.setItem('oxTxtAll', "{}")
}
// localStorage.setItem('oxQun', "{}")
if(!localStorage.oxQun){ // 群聊
  localStorage.setItem('oxQun', "{}")
}




new Vue({
  el: '#app',
  store,
  router,
  render: h => h(App)
})