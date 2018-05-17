<template> 
    <keep-alive>

    <div id='room'>
        <audio src="src/Music/fapai.mp3" autoplay 
        v-if='$store.state.Music.musi==true&&music==true' loop></audio>

        <mt-popup  
            v-model="careTip"
            popup-transition="popup-fade"
            class="care" >
            <span>通知 <i @click="careTip = false">×</i></span>
            <p>{{errorTips}}</p>
            <mt-button @click="careTip = false"> 
            </mt-button>
        </mt-popup >
        
        <mt-popup 
            v-model="cuopai"
            popup-transition="popup-fade"
            class="cuopai" >
            <div>
                <div class='fourCard'>
                    <img 
                    v-if='logic.oxImg[ka.index*5+idx-1]!=undefined' 
                    v-for='idx in 4'  :key='idx+"plus"'
                    :src="`src/oxPng/card/${logic.oxImg[ka.index*5+idx-1]}.png`"/>
                </div>
                <div class='cuopaiCard' @touchstart='control(3)' @touchmove='control(4)' @touchend='control(5)' :style='ka.heziType' >
                    <img src="src/oxPng/cardPlus/bei.png" alt="" />
                    <img v-if='logic.oxImg[ka.index*5+4]!=undefined' :src="`src/oxPng/cardPlus/${logic.oxImg[ka.index*5+4]}.png`" alt="" :style='ka.img02'/>
                </div>
            </div>
        </mt-popup >
        <!-- 头部 -->
        <header>
            <ul>
                <li>
                    <i><a @click='exit'></a></i>
                    <span @click='testtt'>第<i>{{user.ju}}</i>局</span>
                </li>
                <li>
                    <span @click='to(2)'><i></i>开奖记录</span>
                    <span @click='to(7)'>
                        <i></i><a>流水报表</a>
                    </span>
                </li>
            </ul>
        </header>
        <div class="userK">
            <v-head ref='onheader'></v-head>
        </div>
        <!-- 游戏主体 -->
        <div class='roomMain'>
            <!-- 左 -->
            <div class='left'>
                    <!-- <p>{{$store.state.room.z}}</p> -->
                <div class="li">
                    <div v-show='$store.state.room.z.status != 1' class='konwei'>
                    </div>

                    <div v-if='$store.state.room.z.status == 1' >
                        <img src="../../oxImg/room_left02.png" />
                        <img src="../../oxImg/room_left01.png" />
                        <img class='leftZhuan' src="../../oxImg/room002.png" />
                        
                        <div class='leftImg'>
                            <img :src="$store.state.room.z.headimg" alt="" />
                            <span>{{$store.state.room.z.uid==1?100000:$store.state.room.z.diamonds}}</span>

                            <p v-if='user.initType==7' :class='chenji.zfen > 0 ? "yin":"shu"' >{{chenji.zfen<0 ? chenji.zfen : "+"+chenji.zfen}}</p>
                        </div>
                    </div>
                    <p v-show='$store.state.room.z.status == 1'>
                        {{$store.state.room.z.nickname}}
                    </p>
                </div>
                <ul>
                    <li  
                    v-for = '(data, index) in $store.state.room.sz' 
                    :key='data.uid'>
                        <div>
                            <img src="../../oxImg/roomK03.png" alt="" />
                            <img :src="'src/oxPng/roomPage0'+(index <= 1 ? index+2:4)+'.png'" alt="" />
                            <span>{{index+2}}</span>
                            <div class='leftImg'>
                                <img v-if='data.uid!=undefined' :src="data.headimg" alt="" />
                                <span>{{data.diamonds}}</span>
                            </div>
                        </div>
                        <p>{{data.nickname}}</p>
                    </li>

                    <li v-for = 'num in (4-$store.state.room.sz.length >= 0 ? 4-$store.state.room.sz.length : 0)' :key='num+"kon"'>
                        <div class='konwei'>
                        </div>
                    </li>

                </ul>
            </div>

            <!-- 中间 -->
            <div class='center'>
                <!-- 移动用 -->
                <img src="src/oxPng/card/bei.png" class='static_K'  
                v-for='(num,idx) in main.cardNum*5'
                :style='"visibility:hidden;"+move.trans[idx]' :key='"ydy"+idx'/>
                <!-- 压分数字 -->
                <p v-for='(a,idx) in move.imgNum'
                    :class='[(move.bounce[idx]!=undefined ? "clickFen":""),("clickFen02")]'  
                    :style='"visibility:hidden;position:fixed;z-index:-1;"+chouma.LandR+move.srcImgStyle[idx]' v-show='move.srcImg[idx]!=""' :key='idx'>
                    +{{move.bounce[idx]}}
                </p>

                <div class='center_top'>
                    <h1>{{user.initTxt[user.initType]}}
                        <span v-show='user.initType >= 2&&user.initType!=4'>
                        {{time.time_x >= 60 ? "0"+Math.floor(time.time_x/60)+":"+(time.time_x%60 >=10? time.time_x%60 : "0"+time.time_x%60) : "00:"+(time.time_x >= 10 ? time.time_x : "0"+time.time_x)}}秒
                        </span>
                    </h1>
                    <p>还可下注：{{br.xFen}}</p>
                </div>

                <ul>
                    <li
                    v-for='(data,index) in 5'
                    style='z-index:111' :key='"li"+index'
                    :class='[(index==logic.z_index &&user.initType==5 ? "hover_no":""),(chouma.liCss[index]>=1 || move.liType ==index ?"hover":"")]'>
                    <!-- li背景 -->
                    <div class='libj'></div>
                    <!-- 牌 -->
                    <div class='pai'>
                        <img 
                        v-if='logic.oxImg[index*5+ix]!=undefined'
                        v-for='(da,ix) in 5' :key='"pai"+ix'
                        :src="`src/oxPng/card/${logic.oxImg[index*5+ix]}.png`" 
                        :style='"visibility:hidden;"+logic.imgStyle' />
                        
                        <span v-if='user.initType==8'>
                            <img :src="'src/oxPng/'+logic.oxji[index]+'.png'" />
                        </span>
                    </div>
                    
                    <!-- 筹码以及分数 -->
                    <div class="chou_fen">
                        <div class="not_zhuang" v-if='main.z_type==1&&index!=logic.z_index'>
                            <img src="../../oxImg/cc00.png" />
                            <p>{{logic.liAll_F[index]}}</p>
                            <p>{{logic.liMy_All[index]}}</p>
                        </div>
                        <img src="../../oxImg/room002.png" v-if='main.z_type==1&&index==logic.z_index'/>
                        <img src="../../oxImg/cuopai.png" style='z-index: 999;'
                         v-if='logic.liMy_All[index]>0&&user.initType==6' @click='cuopai=true,ka.index=index,ka.img02=""' class='cuopai_anniu'/>

                         <p v-if='user.initType==8 && chenji.myfen[index]!=0' :class='chenji.myfen[index] > 0 ? "yin":"shu"' >{{chenji.myfen[index] <0 ? chenji.myfen[index] : "+"+chenji.myfen[index]}}</p>

                    </div>
                    </li>
                </ul>
                <ul class='dianUl'>
                    <li v-for='(data,index) in 5' 
                    @click='logic.z_index == index ? "" : control(2,index)' 
                    :key='"click"+index'>
                    </li>
                </ul>
                <p :class='user.initType==8?"jieguo":""' >{{chenji.allfen < 0 ? chenji.allfen : "+"+chenji.allfen}}</p>
                <p :class='user.initType==8?"jieguo":""' >{{chenji.allfen < 0 ? chenji.allfen : "+"+chenji.allfen}}</p>
            </div>
            <!-- 右 -->
            <div class='right'>
                <ul>
                    <li
                    v-for='PTW in $store.state.room.pt' 
                    :key='PTW.uid'> 
                        
                        <div>
                            <img src="../../oxImg/roomK03.png" alt="" />
                            
                            <div class='leftImg'>
                                <img :src="PTW.headimg" />
                                <span>{{PTW.diamonds}}</span>
                            </div>
                        </div>
                        <p>{{PTW.nickname}}</p>
                    </li>

                    <li v-for='a in (5-$store.state.room.pt.length >= 0 ? 5-$store.state.room.pt.length : 0)' :key='"kon2"+a'>
                        <div class='konwei'></div>
                    </li>

                </ul>
            </div>
        </div>

        <div class="weibu">
            <!-- 控制器 -->
            <div class='control'>
                <!-- 上下庄 -->
                <span @click="ast(1)" class='control_left' v-if='$store.state.user.type == 5'>
                </span>
                <span @click="ast(2)" :class='[("zhuan2"),("control_left")]' v-if='$store.state.user.type == 2'>
                </span>
                <!-- 筹码 -->
                <span class='control_center' @touchend='move.liType = -1'>
                    <img src="../../oxImg/c01.png"
                    :class='chouma.one==1?"tuqi":""' @click='control(1,1)'
                     :fen='"1"'/>
                     <img src="../../oxImg/c02.png" 
                    :class='chouma.one==2?"tuqi":""' @click='control(1,2)'
                     :fen='"5"'/>
                     <img src="../../oxImg/c03.png" 
                    :class='chouma.one==3?"tuqi":""' @click='control(1,3)'
                     :fen='"10"'/>
                     <img src="../../oxImg/c04.png" 
                    :class='chouma.one==4?"tuqi":""' @click='control(1,4)'
                     :fen='"10"'/>
                     <img src="../../oxImg/c05.png" 
                    :class='chouma.one==5?"tuqi":""' @click='control(1,5)'
                     :fen='"10"'/>
                </span>

                <span class='control_right'>
                    <!-- <img src="../../oxImg/qp.png" /> -->
                </span>
            </div>

        </div>
        
        <toShare ref="ontoShareChild" :share='"room"'></toShare>

        <prize ref="onprizeChild" ></prize>

        <idMessage ref="onidMessageChild" ></idMessage>
        
        <waterReport ref="onWater"></waterReport>
        <loading v-if='loading'></loading>
    </div>
    </keep-alive>
</template>

<script type="text/javascript">
    import './room.scss';
    import roomJS from './room.js';
    import assistJS from './assist.js'; // 辅助代码（上下庄等）
    import Vue from 'vue';
    import router from '../../router/';
    import http from '../../utils/httpClient.js';
    import { Swipe, SwipeItem } from 'mint-ui';
    // 组件
    import header from '../home/header.vue'; // 头部
    Vue.component('v-head', header)
    import toShare from '../../module/shareModule/toShare.vue'; // 邀请
    Vue.component('toShare', toShare)
    import idMessage from '../../module/homeModule/idMessage.vue';  // 个人参数
    Vue.component('idMessage', idMessage)
    import prize from '../../module/roomModule/openRecords.vue';
    Vue.component('prize', prize)   // 开奖记录
    import loading from '../loading/loading.vue';   // loading
    Vue.component('loading', loading)
    import waterReport from './waterReport.vue';  // 原流水报表
    Vue.component('waterReport', waterReport)
    // 定义所有定时器
    // 游戏中定时器(timer-N) [01准备5s, 02随机庄家, 03随机庄位置, 04押注倒计时, 05牌全开, 06-10s下一盘]
    let pageTimer = {};
    export default {
        data: function(){
            return {
                loading: false,         // loading
                wen: 999,               // 组件显示隐藏
                errorTips: '',          // 提示内容
                careTip: false,         // 提示窗
                cuopai: false,          // 搓牌
                music: false,           // 音效
                time1000: 950,         // 速度总控
                jishu: 0,

                zijiF: 0,       // 自己的输赢分--待修复
                ziAll: localStorage.brCardNum,  // 个人总钻石
                chouma: {       // 筹码控制
                    one: 0,
                    LandR: 'left:0;top:0;',
                    liCss: [ 0, 0, 0, 0, 0, 0, 0 ],  // 所压li显示高亮
                },
                br: {   // 百人
                    xFen: 0,    // 可压分
                },
                user: {     // 房间初始化数据
                    type: 5,        // 当前房间状态 1-房主 2-庄 3-普通玩家
                    rid: 1,         // 房间id
                    uid: localStorage.brUid, // 自己的id
                    initTxt: [ '游戏暂未开始', '正在初始化游戏资源', '准备开始：', '随机庄位：', '发牌中', '可押注时间：', '开牌倒计时：', '开牌结果:', '开牌结果:', '等待下一局游戏：' ],
                    initType: 0,    // 游戏阶段
                    gametype: 0,    // 0暂停，1开始
                    myFen: 0,       // 自己的分
                    ju: 0,          // 游戏局数
                },
                z: {},      // 庄
                dataList: {    // 房间内玩家数据
                    sz: [],     // 上庄人员
                    pt: [],     // 普通玩家
                },
                main: {        // 主体游戏流程代码
                    cardNum: 5,        // 扑克牌数
                    beilv: [],       // 倍率
                    bei: 0,        // 选择有倍无倍
                    z_type: 0,        // 庄以及筹码的显示
                    xianshi: null,     // 结算显示用数据
                },
                logic: {       // 主体逻辑代码 
                    oxImg: [],         // 牛牛路径
                    z_index: -1,         // 庄所在的位置
                    oxji: [],         // 牛几
                    imgStyle: '',        // 卡牌是否显示
                    sy: [],         // 输赢判断
                    status: 0,          // 游戏当前状态
                    liAll_F: [ 0, 0, 0, 0, 0, 0, 0 ],         // 当前总压分
                    liMy_All: [ 0, 0, 0, 0, 0, 0, 0 ],       // 当前个人压分_所有的压分
                },
                $time: [],
                time: {             // 游戏时间控制
                    time_x: 0,      // 显示用—时间
                    downTime: 0,    // 10 开局倒计时时间
                    random: 2,      // 3 随机庄
                    speed: 80,      // 随机庄的速度
                    $Time: 30,      // 可下注时间s
                    $openCard: 8,   // 开牌倒计时
                    $esc: 8,        // 10 开牌结果
                    over: 3,        // 等待下一局游戏
                },
                move: {        // 卡牌动效控制
                    trans: [],      // 背面移动位置
                    bei_s: 4,    // 背面移动速度
                    liType: -1,     // 手指移动到哪个li上面
                    srcImgStyle: [], // xy位置
                    srcImg: [],     // 移动筹码的img
                    bounce: [],     // 弹跳c3
                    imgNum: 1,  // 移动用img的数量
                },
                ka: {    // 搓牌临时
                    initY: 0,   // 开始的y
                    cardH: 0,   // 牌的高度
                    heziType: '', // 盒子的style
                    img02: '',  // img的高度
                    type: 0,    // 阶段判断
                    index: 0,   // 所点开的卡牌所在组
                },
                chenji: {    // 分数成绩
                    allfen: 0,  // 单局总分数波动
                    zfen: 0,    // 庄的分数波动
                    myfen: [ 0, 0, 0, 0, 0, 0, 0 ], // 个人押注输赢总分
                },
            }
        },
        mounted: function(){
            let self = this ;
            this.$store.state.oxCrowd.z = {};   // 清除初始值
            this.to(8, true) // 获取局数
            this.goeasy() // 注册群
            this.privatelyOwned(localStorage.brUid) // 注册个人
            this.reLink() // 断线重连
        },
        methods: {
            exit () {   // 退出房间
                var self = this;
                http.post('/Room/quitRoom', {
                    room_id: this.user.rid,
                }).then(res => {
                    console.log(res)
                    if(res.code == 200){
                        br_goEasy.unsubscribe({
                            channel: 'user_'+localStorage.brUid
                        })
                        br_goEasy.unsubscribe({
                            channel: 'room_'+self.user.rid,
                        })
                        this.remove("esc");  // 游戏数据清除
                    }
                })
            },
            reLink(){   // 断线重连
                var self = this;
                http.post('/Room/reLink', {
                    room_id: this.user.rid,
                }).then(res => {
                    console.log(res)
                    if(res.code == 200){
                        var data = res.data;
                        // 重连游戏部分
                        if(data.time <= 4){
                            commonality(data)
                            self.K ();  // 开始游戏
                        } else if(data.time > 4 && data.time < 35){
                            commonality(data, 2, 37-data.time)
                            this.user.initType = 5;
                            this.main.z_type = 1; // 小筹码显示
                        } else if(data.time >= 35 && data.time < 48){ // 搓牌阶段
                            commonality(data, 3, 48-data.time)
                            this.main.z_type = 1; // 小筹码显示
                            this.user.initType = 7; // 开牌倒计时
                        } else { // 等待下一盘阶段
                            self.nextGame(60-data.time)
                        }
                        // 重连分数渲染
                        for(var i=0; i<data.card_log.length; i++){
                            var yaF = {
                                uid: self.user.uid,          // 自己的id
                                few: Number(data.card_log[i].card_num),  // 所压的组
                                fen: Number(data.card_log[i].points),    // 所压的分数
                            }
                            self.logic.liAll_F[yaF.few]+=yaF.fen;   // 分组总压分

                        }
                        for(var i=0; i<data.card_log_uid.length; i++){
                            var yaF = {
                                uid: self.user.uid,          // 自己的id
                                few: Number(data.card_log_uid[i].card_num),  // 所压的组
                                fen: Number(data.card_log_uid[i].points),    // 所压的分数
                            }
                            self.chouma.liCss[Number(data.card_log_uid[i].card_num)] = 1;
                            self.$store.state.user.userCard=Number(self.$store.state.user.userCard)-yaF.fen; // 自己压的分

                            self.logic.liMy_All[yaF.few]+=yaF.fen;
                        }
                        // ----------
                    }
                })
                function commonality(data, type, time){
                    var room = self.$store.state.room;
                    room['pt'] = data.room_list;
                    room.z = {
                        diamonds: data.banker.diamonds,
                        headimg: data.banker.headimg,
                        nickname: data.banker.nickname,
                        uid: data.banker.uid,
                        status: 1,
                    }
                    for(var i=0; i<room.sz.length; i++){
                        if(data.banker.uid == room.sz[i].uid){
                            room.sz.splice(i, 1);
                        }
                    }
                    self.user.ju = data.num; // 游戏局数
                    self.br.xFen = Number(data.banker.diamonds); // 可压分数
                    // console.log(self.br.xFen)
                    self.logic={
                        oxImg: data.card,         // 牛牛路径
                        z_index: data.banker_num, // 庄所在的位置
                        oxji: data.result,          // 牛几
                        imgStyle: '',               // 卡牌是否显示
                        sy: [],         // 输赢判断
                        status: 0,          // 游戏当前状态
                        liAll_F: [ 0, 0, 0, 0, 0, 0, 0 ],         // 当前总压分
                        liMy_All: [ 0, 0, 0, 0, 0, 0, 0 ],       // 当前个人压分_所有的压分
                    }
                    if(type == 2 || type == 3){
                        self.$nextTick(function(){ // v-for渲染已经完成
                            pai_mover2(0, 0, 0);
                        })
                    }
                    function pai_mover2(i, n, o){
                        if(o == 25){
                            if(type == 2){
                                self.countDown(time)
                            } else if(type == 3){
                                self.openCard(time)
                            }
                            return false;
                        }
                        var pai = document.getElementsByClassName('pai');
                        var pai2 = document.getElementsByClassName('static_K')[o].getBoundingClientRect();
                        var imgs= pai[i].children[n].getBoundingClientRect();

                        self.move.trans.push("visibility:visible;transform:translate(-"+(pai2.left-imgs.left)+"px,"+(imgs.top-pai2.top)+"px);z-index:13"+n);
                        var setTime = null;
                        if(i==5-1){
                            i=-1;n++;
                        }
                        pai_mover2(++i, n, ++o);
                    }
                }
            },
            ast(n){      // assist.js
                switch (n){
                // 控制器部分
                case 1 : assistJS.szClick(this, http); // 新-申请上庄
                    break;
                case 2 : assistJS.xzClick(this, http); // 新-申请下庄
                    break;
                }
            },
            control(n, idx) {
                switch (n){
                // 控制器部分
                case 1 : 
                    roomJS.jetton(idx, this);  // 选择什么筹码
                    this.$store.dispatch('click01'); // 筹码声音
                    break;
                case 2 : roomJS.yazhu(idx, this, http);  // 押注
                    break;
                case 3 : roomJS.cuoinit(this);  // 搓牌开始
                    break;
                case 4 : roomJS.cuoka(this);    // 搓牌实现
                    break;
                case 5 :  roomJS.cuoEnd(this);  // 搓牌结束
                    break;
                }
            },
            testtt(){
                // 游戏开始
                // this.gameStyle()
                // 测试接口用
                // http.post('/Card/getResult',{
                //     room_id: this.user.rid,
                // })
                // .then(res => {
                //     console.log(res)
                // })
            },
            goeasy(){   // 群频道
                var self = this;
                br_goEasy.subscribe({
                    channel: 'room_'+self.user.rid,
                    onMessage: function(message){
                        console.log(JSON.parse(message.content))
                        var data = JSON.parse(message.content);
                        var type = data.type;
                        switch(type){
                        case 'QuitRoom':    //有成员退出房间
                            var pt = self.$store.state.room.pt;
                            var roomId = self.$store.state.room.room_id;
                            roomId.splice(roomId.indexOf(data.uid),1)
                            for(var i=0; i<pt.length; i++){
                                if(pt[i].uid == data.uid){
                                    pt.splice(i, 1);
                                    self.$store.state.room['pt'] = pt;
                                    return false;
                                }
                            }
                            break;
                        case 'BankerInfo':  // 庄和上庄
                            var data = data.data;
                            // var pt = self.$store.state.room.pt;
                            for(var i=0; i<data.length; i++){
                                if(data[i].status==1){
                                    self.$store.state.room.z = data[i];
                                } else {
                                    self.$store.state.room.sz.splice(i,1,data[i]);
                                }
                                if(data[i].uid == self.user.uid){
                                    self.$store.state.user.type = 2;
                                }
                                // if(data[i].uid == pt[i])
                            }
                            console.log(self.z)
                            break;
                        case 'applySuccess': // 申请上庄成功成员回调
                            // console.log(data)
                            var pt = self.$store.state.room.pt;
                            var sz = self.$store.state.room.sz;
                            // console.log(pt)
                            for(var i=0; i<pt.length; i++){
                                if(pt[i].uid == data.uid){
                                    sz.push(pt[i])
                                    pt.splice(i, 1);
                                }
                            }
                            break;
                        case 'xiaBanker':                        // 下庄
                            var sz = self.$store.state.room.sz;
                            var pt = self.$store.state.room.pt;
                            for(var i=0; i<sz.length; i++){
                                if(sz[i].uid == data.uid){
                                    pt.push(sz[i])
                                    sz.splice(i, 1);
                                    self.$store.state.room['sz'] = sz;
                                    return false;
                                }
                            }
                            if(data.uid == self.$store.state.room.z.uid){
                                pt.push(self.$store.state.room.z)
                            }
                            break;
                        case 'joinRoom':    // 有成员进入房间
                            var ptt = self.$store.state.room.pt;
                            var roomId = self.$store.state.room.room_id;
                            var cak = {
                                diamonds: data.diamonds,
                                headimg: data.headimg,
                                nickname: data.nickname,
                                id: data.uid,
                            }
                            if(data.uid == self.user.uid){
                                return false;
                            }
                            if(roomId.indexOf(data.uid) < 0){
                                roomId.push(data.uid)
                                ptt.splice(i, 0, cak);
                            }
                            self.$store.state.room['pt'] = ptt;
                            break;
                        case 'gameStart':   // 发牌
                            self.jishu = 0;
                            self.remove();// 游戏数据清除
                            var room = self.$store.state.room;
                            room['pt'] = data.room_list;
                            // console.log(data.banker)
                            room.z = {
                                diamonds: data.banker.diamonds,
                                headimg: data.banker.headimg,
                                nickname: data.banker.nickname,
                                uid: data.banker.uid,
                                status: 1,
                            }
                            for(var i=0; i<room.sz.length; i++){
                                if(data.banker.uid == room.sz[i].uid){
                                    room.sz.splice(i, 1);
                                }
                            }
                            self.user.ju = data.num; // 游戏局数
                            self.br.xFen = data.banker.diamonds; // 可压分数
                            self.logic={
                                oxImg: data.card,         // 牛牛路径
                                z_index: data.banker_num, // 庄所在的位置
                                oxji: data.result,          // 牛几
                                imgStyle: '',               // 卡牌是否显示
                                sy: [],         // 输赢判断
                                status: 0,          // 游戏当前状态
                                liAll_F: [ 0, 0, 0, 0, 0, 0, 0 ],         // 当前总压分
                                liMy_All: [ 0, 0, 0, 0, 0, 0, 0 ],       // 当前个人压分_所有的压分
                            }
                            self.K ();  // 开始游戏
                            break;
                        case 'presure':     // 压分
                            var yaF = {
                                uid: self.user.uid,          // 自己的id
                                few: Number(data.card_num),  // 所压的组
                                fen: Number(data.points),    // 所压的分数
                            }
                            self.logic.liAll_F[yaF.few]+=yaF.fen;   // 分组总压分
                            data.uid==yaF.uid ? (self.$store.state.user.userCard=Number(self.$store.state.user.userCard)-yaF.fen):0; // 自己压的分
                            self.br.xFen-=yaF.fen;
                            if(data.uid==yaF.uid || self.user.type==2 || self.user.type==1){
                                self.logic.liMy_All[yaF.few]+=yaF.fen;
                            }
                            break;
                        }
                    }
                });
            },
            privatelyOwned(uID){    // 个人频道
                var self = this;
                br_goEasy.subscribe({
                    channel: 'user_'+uID,
                    onMessage: function(message){
                        // console.log(message.content)
                        console.log(JSON.parse(message.content))
                        var msg = JSON.parse(message.content);
                        var data = msg.data;
                        var type = msg.type;
                        switch(type){
                        case 'RoomInfo':    // 普通玩家
                            var room = self.$store.state.room;
                            room['pt'] = data;
                            for(var i=0; i<data.length; i++){
                                if(room.room_id.indexOf(data[i].id) < 0){
                                    room.room_id.push(data[i].id)
                                }
                            }
                            break;
                        case 'BankerInfo':  // 庄和上庄
                            var room = self.$store.state.room;
                            for(var i=0; i<data.length; i++){
                                if(room.room_id.indexOf(data[i].uid) < 0){
                                    room.room_id.push(data[i].uid)
                                }
                                if(data[i].status==1){
                                    self.$store.state.room.z = data[i];
                                } else {
                                    self.$store.state.room.sz.splice(i,1,data[i]);
                                }
                                if(data[i].uid == localStorage.brUid){
                                    self.$store.state.user.type = 2;
                                }
                            }
                            break;
                        case 'getresult':  // 计算结果
                            self.zijiF = 0;
                            for(var an=0; an<data.length; an++){
                                if(data[an].uid == localStorage.brUid){
                                    self.zijiF = Number(data[an].points);
                                }
                            }
                            console.log(msg.diamond)
                            self.ziAll = Number(msg.diamond);
                            break;
                        case 18 : // 支付结束
                            console.log(self.$refs.onheader)
                            self.$refs.onheader.iframeCss = 'iframeCss';
                            self.errorTips = msg.msg;
                            self.careTip = true;
                            localStorage.brCardNum = msg.diamond_num;
                            self.$store.state.user.userCard = msg.diamond_num;
                            break;
                        }
                    }
                });
            },
            // 游戏流程
            gameStyle(){       // 游戏流程--开始(1)--检查庄状态
                var txt = this.user.initTxt;
                this.user.gametype = 1; // 游戏执行中
                this.user.initType=1;
                txt[1] = '正在初始化游戏资源';
                var i=0;
                pageTimer['css'] = setInterval( () => {
                    i++;
                    i>3?(i=1,txt = txt.replace('...', '')):false;
                    i<=3?this.$set(this.user.initTxt, 1, txt+='.'):false;
                }, 900)
                // 手动执行开始
                http.post('/Card/startCard', {room_id: this.user.rid})
            },
            K: function(){   // 游戏流程--回调开局(2)
                for(var each in pageTimer) {    // 清除所有定时器
                    clearInterval(pageTimer[each])
                }
                this.bank()
            },
            bank () {           // 2、随机选庄家牌
                let self = this;
                let num = this.main.cardNum; // 几牌
                var time1000 = this.time1000;
                this.time.time_x = this.time.random; // 时间赋值
                this.user.initType = 3;
                pageTimer["timer02"] = setInterval( ()=> {
                    self.time.time_x--;
                    if(self.time.time_x < 0) {    
                        this.time.time_x = '';
                        this.user.initType = 4;     // 文字-->发牌中
                        clearInterval(pageTimer["timer03"])
                        this.move.liType = -1;
                        this.main.z_type = 1;
                        this.c3test();  // 发牌      
                        clearInterval(pageTimer["timer02"])
                    }
                }, time1000)
                let i = self.move.liType;
                pageTimer["timer03"] = setInterval(function(){
                    i++;
                    if(i>=num){
                        i=0;
                    }
                    self.move.liType = i;
                },self.time.speed)
            },
            c3test: function(time = 1000){ // 发牌动作
                var self = this;
                this.music = true;
                var pai = document.getElementsByClassName('pai');
                var kaNum = this.main.cardNum;          // 玩几牌的
                var s = this.move.bei_s/(kaNum*5);     // 背牌移动速度
                var setTime = null;
                var count = 0;
                pai_mover(0,0,0);
                function pai_mover(i,n,o){
                    if(o == 25){
                        return false;
                    }
                    self.Num_L
                    var pai2 = document.getElementsByClassName('static_K')[o].getBoundingClientRect();
                    var imgs= pai[i].children[n].getBoundingClientRect();

                    self.move.trans.push("visibility:visible;transform:translate(-"+(pai2.left-imgs.left)+"px,"+(imgs.top-pai2.top)+"px);transition:transform "+s+"s ease;z-index:13"+n);

                    setTime = setTimeout(function(){
                        if(i==kaNum-1){
                            i=-1;n++;
                        }
                        if(self.move.trans.length == kaNum*5){
                            self.music = false;
                            self.countDown();
                            clearTimeout(setTime)
                        }
                        pai_mover(++i, n, ++o);
                    }, s*time)
                }
            },
            countDown ($time = 0) {          // 3、可押注时间倒计时
                this.$store.dispatch('qxzhu'); // 请下注

                let self = this;
                this.user.initType = 5;
                if($time == 0){
                    this.time.time_x = this.time.$Time;
                } else {
                    this.time.time_x = $time;
                }
                var time1000 = this.time1000;
                // 延时器-发完牌后 -- 押注倒计时
                pageTimer['timer04'] = setInterval( ()=> {
                    if(this.time.time_x >= 1){
                        this.time.time_x-- ;
                    } else {
                        self.careTip = false;
                        self.openCard();
                        clearInterval(pageTimer['timer04']);
                    }
                }, time1000);
            },
            openCard ($time = 0) {                 // 4、开牌--算输赢
                var self = this;
                var cardNum = 5;    // 牌数
                var z_index = Number(this.logic.z_index);   // 庄的位置
                var time1000 = this.time1000;
                this.logic.imgStyle = 'visibility:visible;'
                var o =0;
                pageTimer['timer05'] = setInterval( () => {
                    this.user.initType=6;

                    if($time == 0){
                        this.time.time_x = this.time.$openCard;
                        for(var i=0;i<cardNum;i++){
                            this.$set(this.move.trans, i+o, this.move.trans[i+o].replace('px)', 'px) rotateY(90deg)'));
                        }
                        o+=5;
                    } else {
                        this.time.time_x = $time;
                        for(var i=0; i<20; i++){
                            this.$set(this.move.trans, i, this.move.trans[i].replace('px)', 'px) rotateY(90deg)'));
                        }
                        o=20;
                    }
                    if(o==20){
                        this.move.trans[cardNum*4+z_index]='';
                        pageTimer['timer06'] = setInterval( () => {
                            if(this.time.time_x == 6){
                                http.post('/Card/getResult',{  // 每局获取结果
                                    room_id: this.user.rid,
                                })
                            }
                            if(this.time.time_x >= 1){
                                this.time.time_x--;
                            } else {
                                self.cuopai=false;
                                this.user.initType = 8;
                                for(var i=0; i<=5; i++){
                                    self.move.trans[cardNum*4+i]='';
                                }
                                this.xianshi(); // 分数结果显示
                                // 算胜负计算分数
                                this.time.time_x = this.time.$esc;  // 8s
                                // console.log(this.time.time_x)
                                pageTimer['timer08'] = setInterval( () => {
                                    if(this.time.time_x >= 1){
                                        this.time.time_x--;
                                        // console.log(this.time.time_x)
                                    } else {
                                        self.remove();  // 游戏数据清除
                                        this.nextGame(this.time.over)
                                        clearInterval(pageTimer['timer08']);
                                    }
                                }, time1000)
                                clearInterval(pageTimer['timer06']);
                            }
                        }, time1000)
                        clearInterval(pageTimer['timer05']);
                    }
                }, 500)
            },
            nextGame($time){ // 等待下一局游戏
                var time1000 = this.time1000;
                this.user.initType=9;
                this.time.time_x = $time;  // 3s
                pageTimer['timer09'] = setInterval( () => {
                    if(this.time.time_x >= 1){
                        this.time.time_x--;
                    } else {
                        clearInterval(pageTimer['timer09']);
                    }
                }, time1000)
            },
            xianshi(){      // 分数结果显示
                var self = this;
                // console.log(self.$store.state.user.userCard)
                var Allnum = Number(self.ziAll);
                self.$store.state.user.userCard=Allnum.toFixed(2);
                localStorage.brCardNum = self.$store.state.user.userCard;
                // console.log(self.$store.state.user.userCard)
                self.chenji={    // 分数成绩
                    allfen: self.zijiF,  // 单局总分数波动
                    zfen: 0,    // 庄的分数波动
                    myfen: [ 0, 0, 0, 0, 0 ], // 个人押注输赢总分
                }
            },
            remove(type){   // 一局结束需要清零的数据
                this.$store.dispatch('qxzhu_esc'); // 去除请下注dom
                this.$store.dispatch('click01_esc'); // 筹码声音参数清零
                this.$store.dispatch('click02_esc'); // 筹码声音参数清零

                this.main.z_type = -1;
                this.logic = {           // 主体逻辑代码
                    z_index: -1,         // 庄所在的位置
                    oxImg  : [],         // 牛牛路径
                    imgStyle: '',        // 卡牌是否显示
                    oxji   : [],         // 牛几
                    sy     : [],         // 输赢判断
                    status : 0,          // 游戏当前状态
                    liAll_F: [0,0,0,0,0,0,0],         // 当前总压分
                    liMy_All: [0,0,0,0,0,0,0],        // 当前个人压分_所有的压分
                }
                this.move = {        // 卡牌动效控制
                    trans: [],      // 背面移动位置
                    bei_s : 4,     // 背面移动速度
                    liType: -1,     // 手指移动到哪个li上面
                    srcImgStyle: [],// xy位置
                    srcImg: [],     // 移动筹码的img
                    bounce: [],     // 弹跳c3
                    imgNum: 1,  // 移动用img的数量
                }
                this.chenji={    // 分数成绩
                    allfen: 0,  // 单局总分数波动
                    zfen: 0,    // 庄的分数波动
                    myfen: [0,0,0,0,0,0,0], // 个人押注输赢总分
                }
                this.chouma={   // 筹码控制
                    one: 0,
                    LandR: 'left:0;top:0;',
                    liCss: [0,0,0,0,0,0,0],  // 所压li显示高亮
                }
                if(type == 'esc'){   // 退出房间
                    for(var each in pageTimer) {
                        clearInterval(pageTimer[each])
                    }
                    router.push({name: 'home'});
                }
            },
            to(n, type=false){              // 弹框控制 type==true阻止继续
                var self = this;
                switch (n) {
                case 2 :    // 开奖记录
                    http.post('/Card/getNiuLog',{
                        room_id : this.user.rid,
                    }).then(res=>{
                        console.log(res)
                        function sortObj(obj) {
                            var arr = [];
                            var obj2 = {};
                            for (var i in obj) {
                                arr.push([obj[i],i])
                            };
                            arr.reverse();
                            var len = arr.length;
                            self.$refs.onprizeChild.ooxDataL = len;
                            console.log(arr)
                            self.$refs.onprizeChild.ooxData = arr;
                            var obj = {};
                            for (var i = 0; i < len; i++) {
                                obj[arr[i][1]] = arr[i][0];
                            }
                        }
                        sortObj(res.data)
                    })
                    this.$refs.onprizeChild.onprize=true;
                    break;
                case 7 :    // 新-流水报表
                    http.post('/Card/waterLog', {
                        room_id: this.user.rid,
                    })
                        .then(res => {
                            console.log(res);
                            var arr = [];
                            for(var an in res.data){
                                arr.push(res.data[an]);
                            }
                            // this.user.ju = arr.length;
                            this.$refs.onWater.waterList=arr.reverse();
                            if(this.user.type==1){
                                this.$refs.onWater.fz=true;
                            }
                        })
                    if(type){
                        return false;
                    }
                    this.$refs.onWater.water=true
                    break;
                case 8 :    // 游戏总局数
                    http.post('/Card/getNum', {
                        room_id: this.user.rid,
                    })
                        .then(res => {
                            if(res.code == 200){
                                this.user.ju = res.data;
                            }
                            // console.log(res);
                        })
                    break;
                }
            },
            shangZ () {
                var self = this;
                http.post( '/RoomJoin/setMakers', {  // 直接下一个上庄
                    roomid: self.$store.state.idRoom.id,
                    id: self.$store.state.data.Zlist[0].zn_member_id || 0,
                    type: 1,  // 1为设置庄家，2为下庄
                })
                    .then(res => {
                        if(res.status == 0){
                            self.shangZ()
                        } else if(res.status == 1){}
                    })
            },
    },
}
</script>