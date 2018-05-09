<template>
    <div id='login'>
        <mt-popup 
            v-model="careTip"
            popup-transition="popup-fade" :modal='false'
            class="care" >
            <span>通知 <i @click="careTip = false"></i></span>
            <p>{{errorTips}}</p>
            <mt-button @click="careTip = false">  确定
            </mt-button>
        </mt-popup>
        <!-- <h1 @click='test(1)'>____</h1> -->
        <!-- <h1 @click='test(2)'>————</h1> -->
        <!-- <h1 @click='test(3)'>——33——</h1> -->
        <!-- <h1 @click='test(18813975741)'>——1sss——</h1> -->
        <mt-button @click='wxLogin'></mt-button>
        <loading v-if='loading'></loading>
    </div>
</template>

<style  lang='scss' scoped>
    @import '../../utils/baseVar.scss';
    h1{
        color: #fff;
        font-size: 60px;
    }
    #login {
        height: 100%;
        width: 100%;
        background: $login no-repeat;
        background-size: 100% 100%;
        position:fixed;
        left:0;
        top:0;
        overflow: hidden;
        button{
            width: 4.2rem;
			height: 1.4rem;
            background: $wx_login no-repeat;
            background-size: 100% 100%;

            display: inline-block;
            position: absolute;
            left: 50%;
            bottom: 1.6rem;
            transform: translate(-50%, 0);
            border-radius: 0.75rem;
        }
    }
</style>

<script type="text/javascript">
    import Vue from 'vue';
    import router from '../../router/';

    import loading from '../loading/loading.vue';
    Vue.component('loading', loading);
    import http from '../../utils/httpClient.js';

    export default {
        data(){
            return {
                careTip: false,
                loading: false,
                errorTips: '',
            }
        },
        mounted: function(){
            document.querySelector('#login').addEventListener('touchmove', function (event) {
                event.preventDefault()
            });
            
        },
        methods: {
            wxLogin(){
                // router.push({name: 'home'});
                weixin_WANJI_DL();
                // $store
                this.loading=true;
                var self = this;
                window.weixin_DL = function(wx_data){
                    self.loading=false;
                    var data = wx_data.data;
                    self.goease(data.id)
                    localStorage['brToken'] = data.sign;
                    localStorage['brUid'] = data.id;
                    localStorage['brImg'] = data.headimg;
                    localStorage['brName'] = data.nickname;
                    localStorage['brCardNum'] = data.diamonds;
                    localStorage['dlGame'] = data.is_agent;
                    self.$store.state.user.userID = data.id;
                    self.$store.state.user.userImg = data.headimg;
                    self.$store.state.user.userName = data.nickname;
                    self.$store.state.user.userCard = data.diamonds;
                    self.$store.state.user.dlGame = data.is_agent;
                    router.push({name: 'home'});
                    weixin_WANJI_DL_data = null;
                    self.phone = false;
                }
            },
            test(n){
                var self = this;
                http.post('/Member/login',{
                    phone: n, // 1 2 3 
                    password: 123456,
                }, '', this)    
                    .then(res => {
                        // res = JSON.parse(res)
                        console.log(res)
                        var data = res.data;
                        self.goease(data.id)
                        localStorage['brToken'] = data.sign;
                        localStorage['brUid'] = data.id;
                        localStorage['brImg'] = data.headimg;
                        localStorage['brName'] = data.nickname;
                        localStorage['brCardNum'] = data.diamonds;
                        self.$store.state.user.userID = data.id;
                        self.$store.state.user.userImg = data.headimg;
                        self.$store.state.user.userName = data.nickname;
                        self.$store.state.user.userCard = data.diamonds;
                        localStorage['dlGame'] = data.is_agent;
                        localStorage['dlPerson'] = data.agent_id;
                        self.$store.state.user.dlGame = data.is_agent;
                        self.$store.state.user.dlPerson = data.agent_id;
                        if(res.code==201 || res.code==202){
                            localStorage['dlGame'] = 0;
                            self.$store.state.user.dlGame = 0;
                        }
                        router.push({name: 'home'});
                        
                    })
            },
            goease(id){
                // 连接io服务端
                br_goEasy = new GoEasy({
                    appkey: 'BC-d074375f4cab438da73d82aa9dcf6c6e',
                    userId: `'${id}'`,
                    onConnected: function () {
                        console.log("成功连接GoEasy。");
                    },
                    onDisconnected: function () {
                        console.log("与GoEasy连接断开。");
                    },
                    onConnectFailed: function (error) {
                        console.log("与GoEasy连接失败，错误编码："+error.code+"错误信息："+error.content);
                    }
                });
            },
        }
    }
</script>