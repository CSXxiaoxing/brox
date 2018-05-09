<template>
    <div id='home'> 
    <!-- <iframe :src="iframe" frameborder="0" :id='iframeCss'></iframe> -->
        <mt-popup 
            v-model="careTip"
            popup-transition="popup-fade"
            class="care" >
            <span>通知 <i @click="careTip = false"></i></span>
            <p>{{errorTips}}</p>
            <mt-button @click="careTip = false">  确定
            </mt-button>
          </mt-popup>
        
        <!-- 确认退出游戏 -->
        <mt-popup 
            v-model="careTip2"
            popup-transition="popup-fade"
            class="daili" >
            <p class='escGame'>确定退出游戏？</p>
            <mt-button @click="escGame"></mt-button>
        </mt-popup>

        <!-- 绑定代理 -->
         <mt-popup 
            v-model="daili"
            popup-transition="popup-fade"
            class="daili" >
            <label class='lab'>
                <span>绑定代理</span>
                <input type="text" placeholder="请输入代理号" v-model="dlId">
            </label>
            <mt-button @click="bdGame"></mt-button>
        </mt-popup>
        <v-head ref='onheader'></v-head>
        <div class='homeMain'>
            <ul>
                <li @click='join'>
                    <img src="../../oxImg/home01.png" alt="" />
                </li>

                <li @click.capture='$store.state.user.dlGame == 1 ? "":daili = true'>
                    <router-link
                    :to="$store.state.user.dlGame == 1 ? '/room/999':''">
                    <img src="../../oxImg/home02.png" alt="" />
                    </router-link>
                </li>
                <li @click.capture='$store.state.user.dlGame == 1 ? "":daili = true'>
                    <img src="../../oxImg/home03.png" alt="" />
                </li>
            </ul>
        </div>
        <v-foot></v-foot>
        <toShare ref="ontoShareChild" :share='"home"'></toShare>
        <loading v-if='loading'></loading>
    </div>
</template>

<script type="text/javascript">
    import './home.scss';
    import Vue from 'vue';
    import http from '../../utils/httpClient.js';
    import router from '../../router/';
    import { Indicator, InfiniteScroll } from 'mint-ui';

    // 全局组件注册
    import toShare from '../../module/shareModule/toShare.vue'; // 邀请好友
    Vue.component('toShare', toShare)
    import loading from '../loading/loading.vue'; // loading
    Vue.component('loading', loading)
    import header from './header.vue'; // 头部
    Vue.component('v-head', header)
    import foot from './foot.vue'; // 尾部
    Vue.component('v-foot', foot)


    export default {
        data: function(){
            return {
                iframe: '',
                iframeCss: 'iframeCss',
                loading: false,		// loading
                careTip: false,     // 错误提示
                careTip2: false,	// 错误提示
                dlId: '',           // 代理id
                daili: false,	    // 绑定代理

                errorTips: '',      // 错误信息
                errorTips2: '',		// 错误信息
                wen : 111,

                pagesize: 40,	    // 请求条数
                type: 1,		    // 1 所有房间 2 自己开的房间
                p: 1,			    // 当前页

                notice: [],	    // 系统公告
                cardNum: this.$store.state.initRoom.cardNum,
            }
        },
        mounted: function(){
            var self = this;
            br_goEasy.subscribe({
                    channel: 'user_'+localStorage.brUid,
                    onMessage: function(message){
                        // console.log(message.content)
                        console.log(JSON.parse(message.content))
                        var msg = JSON.parse(message.content);
                        var data = msg.data;
                        var type = msg.type;
                        switch(type){
                        case 'RoomInfo':    // 普通玩家
                            self.$store.state.room['pt'] = data;
                        break;
                        case 'BankerInfo':  // 庄和上庄
                            for(var i=0; i<data.length; i++){
                                if(data[i].status==1){
                                    self.$store.state.room.z = data[i];
                                } else {
                                    self.$store.state.room.sz.splice(i,1,data[i]);
                                }
                                if(data[i].uid == localStorage.brUid){
                                    self.$store.state.user.type = 2;
                                }
                            }
                            // console.log(self.z)
                        break;
                    case 18 : // 支付结束
                        self.$refs.onheader.iframeCss = 'iframeCss';
                        self.errorTips = msg.msg;
                        self.careTip = true;
                        localStorage.brCardNum = msg.diamond_num;
                        self.$store.state.user.userCard = msg.diamond_num;
                        break;
                        }
                    }
                }); // 注册goeasy 
        },
        methods: {
            fh(){
                this.$store.dispatch('yinx10010');
                if(this.$refs.onheader.iframeCss == 'iframeCss02'){
                    this.$refs.onheader.iframeCss = 'iframeCss';
                } else {
                    this.careTip2=true;
                }
            },
            escGame(){  // 退出游戏
                router.push({name: 'login'})
            },
            bdGame(){   // 绑定代理
                var self = this;
                http.post('/Member/bindAgent', {
                    agent: this.dlId,
                }).then( res => {
                    console.log(res)
                    if(res.code == 200){
                        localStorage['dlGame'] = '1';
                        self.$store.state.user.dlGame ='1';
                        self.join()
                        self.daili=false;
                    } else {
                        alert(res.msg)
                    }
                })
            },
            join(){     // 进入房间判断
                if(this.$store.state.user.dlGame == 1){
                    http.post('/Room/addRoom', {
                        room_id: 1,
                    },'',this).then( res => {
                        if(res.code == 200){
                            router.push({path: 'room/999'})
                        } else {
                            alert('加入失败')
                        }
                    })
                } else {
                    this.daili=true;
                }
            },

            
            child_KA: function(n){
                switch(n){
                case 1 : // 加入房间
                    break;
                case 2 : // 个人信息
                    break;
                case 3 : // 打开购买房卡
                    break;
                case 4 : // 打开我的房间
                    break;
                case 5 : // 分享界面
                    this.$refs.ontoShareChild.toShare=true;
                    break;
                case 6 : // 原好友页面
                    break;
                }
            }
        }
    }
</script>