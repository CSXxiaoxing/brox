<template>
    <div id='home'> 
    <iframe :src="iframe" frameborder="0" :id='iframeCss'></iframe>
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

        <v-head></v-head>

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

        
        
        <noOpen  ref="onOpenChild" ></noOpen>

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


    import noOpen from '../../module/homeModule/noOpen.vue'; // 提示房间未公开
    Vue.component('noOpen', noOpen)


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

                sendId: 0,
                spinner: 0,		// 懒加载loding
                notice: [],	    // 系统公告
                cardNum: this.$store.state.initRoom.cardNum,
            }
        },
        mounted: function(){
            var self = this;
            br_goEasy.subscribe({
                    // channel: 'user_26',
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
                        }
                    }
                }); // 注册goeasy 
            // if(localStorage.oxToken && localStorage.oxUid){
            //     // 系统公告
            //     http.post('/MemberNotice/getAnnouncement',{
            //         id: self.id,
            //     }, '', this)
            //         .then(res => {
            //             if(res.status == 1){
            //                 var notice = self.$store.state.oxCrowd.notice;
            //                 notice = [];
            //                 console.log(res.data[0])
            //                 if(res.data[0] == undefined){
            //                     notice.push(' 文明游戏，请勿赌博！')
            //                 }
            //                 for(let i in res.data){
            //                     notice.push(res.data[i].zc_content)
            //                 }
            //                 self.$store.state.oxCrowd.notice = notice;
            //             }
            //         })
            // } else {
            //     router.push({name: 'login'});	// 跳回登录页
            // }
        },
        methods: {
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
            },
            openS(e){
                let Etar = e.target;
                var self=this;
                var Tar = () => {
                    var EtarName = Etar.nodeName.toLowerCase();
                    if(EtarName == 'li'){
                        var nodeValue = Etar.attributes["openState"].nodeValue;

                        nodeValue == 'false' ? this.$refs.onOpenChild.onOpenRoom =
                        ++[[]][+[]]+[+[]] == 10 : 0.1+0.2 ==0.3;

                        if(nodeValue == 'true'){
                            this.sendId = Etar.attributes["roomid"].nodeValue
                            http.post('/Room/getRooms',{
                                number: this.sendId,
                            },'',this)
                            .then(res => {
                                // console.log(res)
                                if(res.status == 1) {
                                }
                            })
                        }
                        return false;
                    } else if(EtarName == 'body'){
                        return false;
                    } else {
                        Etar = Etar.parentElement;
                        Tar();
                    }
                };
                Tar();
            },
            loadMore(){		// 无限加载
                var self = this;
                var VX_data = this.$store.state.data;
                var time = new Date().getTime();
                var VX_time = self.$store.state.data.DTtime;
                if((time - VX_time) < 800 || VX_data.DT.length < 15){
                    return false;
                }
                this.spinner = 1;
                if((time - VX_time) > self.$store.state.data.DTtimeos){
                http.post('/Room/getRoomList' ,	// 房间请求
                {
                    pagesize : self.pagesize,
                    type 	 : self.type,
                    p 		 : self.$store.state.data.DTpage,
                }, '')
                .then(res => {
                    if(res.status == 1){
                    var arr = [];
                    var dtid = self.$store.state.data.DTid;
                    var arrlength = res.data.length;
                    var DTcount = 0;
                    var weiyi = 0;
                    for(let i in res.data){
                        var val = res.data[i];
                        if(dtid.indexOf(val.id) < 0){	// id识别是否重复
                            weiyi++;
                            arr.push({
                                key 	   : val.id,			// key值
                                open 	   : val.zn_room_type ==1 ? true : false,// 是否开放
                                roomName   : val.zc_title,		// 房间名字
                                roomNumber : val.zc_number,		// 房间号码
                                number 	   : val.pernumber,		// 房间人数
                            })
                            self.$store.state.data.DTid.push(val.id)
                        } else {
                            DTcount++;
                        }
                    }
                    if(DTcount >= arrlength-1){
                        self.$store.state.data.DTtimeos = 5000;
                        self.$store.state.data.DTpage++;
                    } else {
                        self.$store.state.data.DTtimeos = 0;
                    }
                    var arr01 = self.$store.state.data.DT;
                    self.$store.state.data.DT = arr01.concat(arr);
                    self.$store.state.data.DTtime = time;
                    }
                    self.spinner = 0;
                })} else {
                    var atime = setTimeout(() => {
                        self.spinner = 0;
                        clearTimeout(atime)
                      }, 2500);
                }
            }
        }
    }
</script>