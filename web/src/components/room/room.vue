<template> 
    <keep-alive>

    <div id='room'>
        <audio src="src/Music/fapai.mp3" autoplay v-if='music==$store.state.Music.musi' loop></audio>
        
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
                    <img v-if='logic.oxImg[ka.index*5+idx-1]!=undefined' v-for='idx in 4' :src="`src/oxPng/card/${logic.oxImg[ka.index*5+idx-1]}.png`"/>
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
                    <p :class='user.initType >= 1 ? "open" : "" '>
                        <span>{{user.initType >= 1 ?  "游戏中" : "暂停中"}}</span>

                        <i v-show='user.type == 5' @click='user.ON_OFF = !user.ON_OFF'>
                            <b></b>
                        </i>
                        <mt-popup
                            v-model="user.ON_OFF"
                            :modal='false'
                            popup-transition="popup-fade"
                            class='gameStyle'>
                                <span @click='gameStyle(1),user.ON_OFF=false' >游戏中</span>
                                <span @click='gameStyle(2),user.ON_OFF=false' >暂停中</span>
                                <i class='triangle-up'></i>
                        </mt-popup>
                    </p>
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
            <v-head></v-head>
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
                            <span>{{$store.state.room.z.diamonds}}</span>

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

                    <li v-for = 'num in (4-$store.state.room.sz.length >= 0 ? 4-$store.state.room.sz.length : 0)'>
                        <div class='konwei'>
                        </div>
                    </li>

                </ul>
            </div>

            <!-- 中间 -->
            <div class='center'>
                <!-- 移动用 -->
                <img src="src/oxPng/card/bei.png" 
                v-for='(num,idx) in main.cardNum*5' :class='[("static_K"),(user.numCard == 7 ? "s":"")]' 
                :style='"visibility:hidden;"+move.trans[idx]' />

                <img v-for='(a,idx) in move.imgNum'  :src='move.srcImg[idx]' 
                :class='[(move.bounce[idx]!=undefined ? "bounce":""),("imgOne")]'  
                :style='"visibility:hidden;position:fixed;z-index:-1;width:1.2rem;height:1.2rem;"+chouma.LandR+move.srcImgStyle[idx]' v-show='move.srcImg[idx]!=""'/>

                <div class='center_top'>
                    <h1>{{user.initTxt[user.initType]}}
                        <span v-show='user.initType >= 2&&user.initType!=4'>
                        {{time.time_x >= 60 ? "0"+Math.floor(time.time_x/60)+":"+(time.time_x%60 >=10? time.time_x%60 : "0"+time.time_x%60) : "00:"+(time.time_x >= 10 ? time.time_x : "0"+time.time_x)}}秒
                        </span>
                    </h1>
                    <p>还可下注：{{main.minFen_x}}</p>
                </div>

                <ul id='room_UL'>
                    <li
                    v-for='(data,index) in 5'
                     @click='control(2,index)' style='z-index:111'
                    :class='[(index==logic.z_index &&user.initType==5 ? "hover_no":""),(chouma.liCss[index]>=1 || move.liType ==index ?"hover":"")]'>
                    <!-- li背景 -->
                    <div class='libj'></div>
                    <!-- 牌 -->
                    <div class='pai'>
                        <img 
                        v-if='logic.oxImg[index*5+ix]!=undefined'
                        v-for='(da,ix) in 5'
                        :src="`src/oxPng/card/${logic.oxImg[index*5+ix]}.png`" 
                        :style='"visibility:hidden;"+logic.imgStyle' />
                        
                        <span v-if='user.initType==7&&logic.oxji[index]!=undefined'>
                            <img :src="`src/srcImg/${logic.oxji[index]}.png`" />
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
                        <img src="../../oxImg/cuopai.png"
                         v-if='logic.liMy_All[index]>0&&user.initType==6' @click='cuopai=true,ka.index=index,ka.img02=""' class='cuopai_anniu'/>

                         <p v-if='user.initType==7 && chenji.myfen[index]!=0' :class='chenji.myfen[index] > 0 ? "yin":"shu"' >{{chenji.myfen[index] <0 ? chenji.myfen[index] : "+"+chenji.myfen[index]}}</p>

                    </div>
                    </li>
                </ul>
                <p :class='user.initType==7?"jieguo":""' >{{chenji.allfen < 0 ? chenji.allfen : "+"+chenji.allfen}}</p>
                <p :class='user.initType==7?"jieguo":""' >{{chenji.allfen < 0 ? chenji.allfen : "+"+chenji.allfen}}</p>
            </div>
            <!-- 右 -->
            <div class='right'>
                <ul>
                    <li
                    v-for='PTW in $store.state.room.pt' 
                    :key='PTW.id'> 
                        
                        <div>
                            <img src="src/srcImg/roomK03.png" alt="" />
                            
                            <div class='leftImg'>
                                <img :src="PTW.headimg" />
                                <span>{{PTW.diamonds}}</span>
                            </div>
                        </div>
                        <p>{{PTW.nickname}}</p>
                    </li>

                    <li v-for='a in (5-$store.state.room.pt.length >= 0 ? 5-$store.state.room.pt.length : 0)'>
                        <div class='konwei'></div>
                    </li>

                </ul>
            </div>
        </div>

        <div class="weibu">
            <!-- 控制器 -->
            <div class='control'>
                <!-- 上下庄 -->
                <span @click="szClick" class='control_left' v-if='$store.state.user.type == 5'>
                </span>
                <span @click="xzClick" :class='[("zhuan2"),("control_left")]' v-if='$store.state.user.type == 2'>
                </span>
                <!-- 筹码 -->
                <span class='control_center' @touchend='move.liType = -1'>
                    <img :src="`src/oxImg/c01.png`" 
                    :class='chouma.one==1?"tuqi":""' @click='control(1,1)'
                     :fen='"1"'/>
                     <img :src="`src/oxImg/c02.png`" 
                    :class='chouma.one==2?"tuqi":""' @click='control(1,2)'
                     :fen='"5"'/>
                     <img :src="`src/oxImg/c03.png`" 
                    :class='chouma.one==3?"tuqi":""' @click='control(1,3)'
                     :fen='"10"'/>
                     <img :src="`src/oxImg/c04.png`" 
                    :class='chouma.one==4?"tuqi":""' @click='control(1,4)'
                     :fen='"10"'/>
                     <img :src="`src/oxImg/c05.png`" 
                    :class='chouma.one==5?"tuqi":""' @click='control(1,5)'
                     :fen='"10"'/>
                </span>

                <span class='control_right'>
                    <img src="../../oxImg/qp.png"/>
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
    // 游戏状态码 {
    //      0 : 执行游戏 
    // }
    export default {
        data: function(){
            return {
                loading: false,     // loading
                wen: 999,   // 组件显示隐藏
                errorTips: '',      // 提示内容
                careTip : false,    // 提示窗
                cuopai: false,      // 搓牌
                music: false,
                test: 0,    // 测试控制

                time1000: 1000, // 速度
                zijiF: 0, // 自己的输赢分
                chouma: {   // 筹码控制
                    one: 0,
                    LandR: 'left:0;top:0;',
                    liCss: [0,0,0,0,0,0,0],  // 所压li显示高亮
                },
                user : {     // 房间初始化数据
                    type: 5,        // 当前房间状态 1-房主 2-庄 3-普通玩家
                    rid: 1,         // 房间id
                    uid: localStorage.brUid, // 自己的id

                    fid: 0,         // 房主id
                    qid: 0,         // 群聊id
                    numCard: 0,     // 几牌
                    ON_OFF: false,  // 游戏开始按钮是否显示
                    gametype: 0,    // 0暂停，1开始
                    number: 0,      // 房间号码
                    Lding: 0,       // 是否在等待上庄
                    auto: true,    // true自动轮庄- -false指定庄家
                    allFen: 0,      // 房间总分
                    myFen: 0,       // 自己的分
                    initTxt: ['游戏暂未开始', '正在初始化游戏资源','准备开始：', '随机庄位：', '发牌中', '可押注时间：', '开牌倒计时：', '开牌结果'],
                    initType: 0,    // 游戏阶段
                    ju: 0,          // 游戏局数
                    oxWater: 0,     // 抽水
                    xiaZZZ: 0,      // 1-> 一局结束后下庄 0-> 不做任何操作
                    timeOrDay: 0,
                    lun: 0,         // 轮庄计算
                },
                lunZ : {
                    type : 1,  // 0 是锁定  1 是轮庄
                    num  : 5,    // 轮庄的次数
                },
                z:  {},      // 庄
                
                dataList : {    // 房间内玩家数据
                    sz: [],     // 上庄人员
                    pt: [],     // 普通玩家
                },
                main : {        // 主体游戏流程代码
                    cardNum : 5,        // 扑克牌数
                    minFen  : 0,        // 最低上庄分数
                    minFen_j: 0,        // 最低上庄分数_计算用
                    minFen_x: 0,        // 最低上庄分数_显示用
                    maxBei  : 0,        // 单局最大倍数
                    beilv   : [],       // 倍率
                    bidui   : 0,        // 比什么
                    minYa   : 0,        // 下注范围
                    maxYa   : 0,        // 下注范围
                    bei     : 0,        // 选择有倍无倍
                    z_type  : 0,        // 庄以及筹码的显示
                    xianshi : null,       // 结算显示用数据
                },
                logic : {       // 主体逻辑代码
                    oxImg  : [],         // 牛牛路径
                    z_index: -1,         // 庄所在的位置    
                    oxji   : [],         // 牛几

                    imgStyle: '',        // 卡牌是否显示
                    sy     : [],         // 输赢判断
                    status : 0,          // 游戏当前状态
                    liAll_F: [0,0,0,0,0,0,0],         // 当前总压分
                    liMy_All: [0,0,0,0,0,0,0],       // 当前个人压分_所有的压分
                    liMy_Ff: [0,0,0,0,0,0,0],         // 当前个人压分_翻倍
                    liMy_Fn: [0,0,0,0,0,0,0],         // 当前个人压分_不翻倍
                },
                time : {        // 游戏时间控制
                    time_x  : 0,    // 显示用—时间
                    $Time: 30,       // 可下注时间s
                    downTime: 10,   // 倒计时时间
                    random  : 3,    // 随机庄
                    speed   : 80,   // 随机速度
                    $openCard: 10,  // 开牌倒计时
                    $esc: 10,      // 10下盘等待
                    
                    $water: 5,      // 流水报表时间
                },
                move : {        // 卡牌动效控制
                    trans: [],      // 背面移动位置
                    bei_s : 4,    // 背面移动速度
                    liType: -1,     // 手指移动到哪个li上面
                    srcImgStyle: [],// xy位置
                    srcImg: [],     // 移动筹码的img
                    
                    bounce: [],     // 弹跳c3
                    imgNum: 1,  // 移动用img的数量
                },
                ka:{    // 搓牌临时
                    initY: 0,   // 开始的y
                    cardH: 0,   // 牌的高度
                    heziType:'',// 盒子的style
                    img02: '',  // img的高度
                    type: 0,    // 阶段判断
                    index: 0,   // 所点开的卡牌所在组
                },
                chenji:{    // 分数成绩
                    allfen: 0,  // 单局总分数波动
                    zfen: 0,    // 庄的分数波动
                    myfen: [0,0,0,0,0,0,0], // 个人押注输赢总分
                },
                message : this.$store.state.placard.message,
            }
        },
        mounted: function(){
            let self = this ;
            this.$store.state.oxCrowd.z = {};   // 清除初始值

            this.goeasy() // 注册群和单
            this.privatelyOwned(localStorage.brUid)
        },
        methods: {
            szClick(){  // 新-申请上庄
                http.post('/Card/applyBanker',{
                    room_id: this.user.rid,
                }).then(res=>{
                    if(res.code == 200){
                        this.$store.state.user.type = 2;
                    }
                })
            },
            xzClick(){  // 新-申请下庄
                http.post('/Card/applyLostBanker',{
                    room_id: this.user.rid,
                }).then(res=>{
                    if(res.code == 200){
                        this.$store.state.user.type = 5;
                    }
                })
            },
            exit () {   // 退出房间
                http.post('/Room/quitRoom',{
                    room_id: this.user.rid,
                }).then(res=>{
                    console.log(res)
                    if(res.code == 200){
                        router.push({name: 'home'});
                    }
                })
            },

            control(n,idx){ 
                switch (n){
                    // 控制器部分
                    case 1 : roomJS.jetton(idx,this);  // 选择什么筹码
                    break;
                    case 2 : roomJS.yazhu(idx,this,http);  // 押注
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
                 // 测试接口用
                http.post('/Card/getResult',{
                    room_id: this.user.rid,
                })
                .then(res => {
                    console.log(res)
                })
            },
            goeasy(){
                var self = this;
                br_goEasy.subscribe({
                    channel: 'room_1',
                    // channel: 'room_'+self.user.rid,
                    onMessage: function(message){
                        console.log(JSON.parse(message.content))

                        var data = JSON.parse(message.content);
                        var type = data.type;
                        var status = data.status;
                        switch(type){
                        case 'QuitRoom':    //有成员退出房间
                            var pt = self.$store.state.room.pt;
                            for(var i=0; i<pt.length; i++){
                                if(pt[i].id == data.uid){
                                    pt.splice(i, 1);
                                    self.$store.state.room['pt'] = pt;
                                    return false;
                                }
                            }
                        break;
                        case 'BankerInfo':  // 庄和上庄
                            for(var i=0; i<data.length; i++){
                                if(data[i].status==1){
                                    self.$store.state.room.z = data[i];
                                } else {
                                    self.$store.state.room.sz.splice(i,1,data[i]);
                                }
                                if(data[i].uid == self.user.uid){
                                    self.user.type = 2;
                                }
                            }
                            console.log(self.z)
                        break;
                        case 'xiaBanker':                        // 下庄
                            var sz = self.$store.state.room.sz;
                            for(var i=0; i<sz.length; i++){
                                if(sz[i].uid == data.uid){
                                    sz.splice(i, 1);
                                    self.$store.state.room['sz'] = sz;
                                    return false;
                                }
                            }
                        break;
                        case "joinRoom":    // 有成员进入房间
                            var pt = self.$store.state.room.pt;
                            var cak = {
                                diamonds: data.diamonds,
                                headimg: data.headimg,
                                nickname: data.nickname,
                                id: data.uid,
                            }
                            // console.log(data.uid + "==" + self.user.uid)
                            if(data.uid == self.user.uid){
                                return false;
                            }
                            pt.splice(i, 0, cak);
                            self.$store.state.room['pt'] = pt;
                        break;
                        case "gameStart":   // 发牌
                            // console.log(data)
                            self.remove();// 游戏数据清除
                            self.user.ju = data.num; // 游戏局数
                            self.user.xiaZZZ = 0;
                            self.logic={
                                oxImg  : data.card,         // 牛牛路径
                                z_index: data.banker,        // 庄所在的位置    
                                oxji   : data.cow,         // 牛几

                                imgStyle: '',        // 卡牌是否显示
                                sy     : [],         // 输赢判断
                                status : 0,          // 游戏当前状态
                                liAll_F: [0,0,0,0,0,0,0],         // 当前总压分
                                liMy_All: [0,0,0,0,0,0,0],       // 当前个人压分_所有的压分
                                liMy_Ff: [0,0,0,0,0,0,0],         // 当前个人压分_翻倍
                                liMy_Fn: [0,0,0,0,0,0,0],         // 当前个人压分_不翻倍
                            }
                            self.K ();  // 开始游戏
                        break;
                        case 'getresult':
                            self.zijiF = 0;
                            for(var i=0; i<data.length; i++){
                                if(data[i].uid == localStorage.brUid){
                                    self.zijiF = data[i].points;
                                }
                            }
                            console.log(self.zijiF)
                        break;
                        case "presure":     // 压分
                            var y_f = {
                                uid : self.user.uid,          // 自己的id
                                few : Number(data.card_num),  // 所压的组
                                fen : Number(data.points),    // 所压的分数
                            }

                            self.logic.liAll_F[y_f.few]+=y_f.fen;   // 分组总压分
                            
                            data.uid==y_f.uid ? self.user.myFen-=y_f.fen:0; // 自己压的分
                            // data.uid==y_f.uid ? (self.$store.state.user.userCard=Number(self.$store.state.user.userCard)-y_f.fen):0; // 自己压的分
                            self.main.minFen_j-=y_f.fen;
                            if(data.uid==y_f.uid || self.user.type==2 || self.user.type==1){
                                self.logic.liMy_Fn[y_f.few]+=y_f.fen;
                                self.logic.liMy_All[y_f.few]+=y_f.fen;
                            }
                        break;
                        case 6 :      // 当局结果
                            self.chenji={    // 分数成绩
                                allfen: 0,  // 单局总分数波动
                                zfen: 0,    // 庄的分数波动
                                myfen: [0,0,0,0,0,0,0], // 个人押注输赢总分
                            }
                            self.main.xianshi = null;
                            self.main.xianshi = data.card;
                            break;
                        case 7 : 
                            break;
                        }
                    }
                }); // 注册goeasy 
            },
            privatelyOwned(uID){    // 个人频道
                var self = this;
                // console.log(uID)
                // console.log(br_goEasy)
                // console.log(localStorage.brToken)
                br_goEasy.subscribe({
                    // channel: 'user_26',
                    channel: 'user_'+uID,
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
                                if(data[i].uid == self.user.uid){
                                     self.$store.state.user.type = 2;
                                }
                            }
                            // console.log(self.z)
                        break;
                        case 'getresult':
                            self.zijiF = 0;
                            for(var i=0; i<data.length; i++){
                                if(data[i].uid == localStorage.brUid){
                                    self.zijiF = Number(data[i].points);
                                }
                            }
                            console.log(self.zijiF)
                        break;
                        }
                    }
                }); // 注册goeasy 
            },
            // 游戏流程
            gameStyle(n){       // 游戏流程--开始(1)--检查庄状态
                var mainBody = this.main;   // 游戏主体数据
                var minFen = mainBody.minFen; // 最低上庄分数
                // var dian = Number(this.dataList.z.dian); // 庄当前分数
                var self = this;
                if( n==1 ){
                    if(true){                   // 庄分数大于最低上庄分数
                        this.user.gametype = 1; // 游戏执行中
                        this.user.initType=1;
                        var i=0;
                        pageTimer["css"] = setInterval(function(){
                            i++;
                            if(i>3){
                                i=1;
                                self.user.initTxt[1] = self.user.initTxt[1].replace('...','');
                            }
                            if(i<=3){
                                self.$set(self.user.initTxt, 1,self.user.initTxt[1]+='.');
                            }
                        },800)
                        // 房卡
                        http.post('/Card/startCard',{room_id: this.user.rid})
                    } else {
                        this.errorTips = '庄家参数异常，请检查有无庄或者庄的分数';
                        this.careTip = true;
                    }
                } else if(n==2) {
                    if(this.user.gametype == 1){
                        this.errorTips = '本轮游戏结束后生效';
                        this.careTip = true;
                    }
                    this.user.gametype = 0;
                }
            },
            K : function(){   // 游戏流程--回调开局(2)
                this.user.initType = 2;
                this.main.minFen_j = this.main.minFen; // 压庄总分
                var time1000 = this.time1000;

                // 清除游戏余留状态
                for(var each in pageTimer) {    // 清除所有定时器
                    clearInterval(pageTimer[each])
                }
                this.time.time_x = this.time.downTime; // 时间赋值
                pageTimer["timer01"] = setInterval( ()=> {
                    this.time.time_x--;
                    if(this.time.time_x <= 0) {
                        this.bank()
                        clearInterval(pageTimer["timer01"])
                    }
                },time1000)
            },
            bank () {           // 2、随机选庄家牌
                let self = this;
                let num = this.main.cardNum; // 几牌
                let zhuan = this.logic.z_index;
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
                },time1000)

                let i = self.move.liType;
                pageTimer["timer03"] = setInterval(function(){
                    i++;
                    if(i>=num){
                        i=0;
                    }
                    self.move.liType = i;
                },self.time.speed)
            },
            c3test: function(){ // 发牌动作
                // self.move.trans = [];   // 测试用-清除数据
                var self = this;
                this.music = true;
                var pai = document.getElementsByClassName('pai');
                var kaNum = this.main.cardNum;          // 玩几牌的
                var s = this.move.bei_s/(kaNum*5);     // 背牌移动速度 Card/score_result
                var setTime = null;

                pai_mover(0,0,0);
                function pai_mover(i,n,o){
                    if(o == kaNum*5){
                        return false;
                    }
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
                        pai_mover(++i,n,++o);
                    },s*1000)
                }
            },
            countDown () {          // 3、可押注时间倒计时
                let self = this;
                this.user.initType = 5;
                this.time.time_x = this.time.$Time;
                var time1000 = this.time1000;
                // 延时器-发完牌后 -- 押注倒计时
                pageTimer['timer04'] = setInterval( ()=> {
                    if(this.time.time_x >= 1){
                        this.time.time_x-- ;
                    } else {
                        self.careTip = false;
                        self.openCard();

                        http.post('/Card/getResult',{
                            room_id: this.user.rid,
                        })
                        .then(res => {
                            console.log(res)
                            
                        })

                        clearInterval(pageTimer['timer04']);
                    }
                } , time1000);
            },
            openCard () {                 // 4、开牌--算输赢
                var self = this;
                var cardNum = this.main.cardNum;    // 牌数
                var z_index = this.logic.z_index;   // 庄的位置
                var time1000 = this.time1000;
                this.logic.imgStyle = "visibility:visible;"

                var o =0;
                pageTimer["timer05"] = setInterval( ()=> {
                    for(var i=0;i<cardNum;i++){
                        this.$set(this.move.trans,i+o,this.move.trans[i+o].replace('px)','px) rotateY(90deg)'));
                    }
                    o+=cardNum;
                    if(o==cardNum*4){
                        this.move.trans[cardNum*4+z_index]="";
                        this.user.initType=6;
                        this.time.time_x = this.time.$openCard;
                        pageTimer["timer06"] = setInterval( ()=> {
                            
                            if(this.time.time_x >= 1){
                                this.time.time_x-- ;
                            } else {
                                self.cuopai=false;
                                for(var i=0;i<cardNum;i++){
                                    this.$set(this.move.trans,i+o,this.move.trans[i+o].replace('px)','px) rotateY(90deg)'));
                                }
                                this.user.initType=7;
                                this.xianshi(); // 分数结果显示
                                // 算胜负计算分数
                                this.time.time_x = this.time.$esc;  // 10s
                                this.move.imgNum=0; // 隐藏筹码
                                
                                pageTimer["timer08"] = setInterval( ()=> {
                                    if(this.time.time_x >= 1){
                                        this.time.time_x-- ;
                                    } else {
                                        self.remove();// 游戏数据清除
                                        this.user.initTxt[1] = '正在初始化游戏资源';
                                        console.log(this.user.ju)
                                        console.log(this.user.lun)
                                        // 检查是否需要换庄
                                        if(this.user.ju >= this.user.lun && this.user.type==1){
                                            if(this.dataList.dd[0]!=undefined){
                                                http.post('/RoomJoin/setMakers',{
                                                    roomid: this.user.rid, // 房间id
                                                    type: 1,  // 1为设置庄家，2为下庄
                                                    id: this.dataList.dd[0].zn_member_id,  // 用户id
                                                })
                                                .then(res => {
                                                    if(res.status==1){
                                                        this.user.lun = this.lunZ.num+Number(this.user.ju)-1;
                                                    } else {
                                                        self.errorTips = res.msg;
                                                        self.careTip = true;
                                                    }
                                                })
                                            } else {
                                                self.errorTips = '游戏局数已满且无下一位上庄玩家';
                                                self.careTip = true;

                                                console.log(111)
                                                this.user.lun+=this.lunZ.num;
                                                clearInterval(pageTimer['timer08']);
                                                return false;
                                            }
                                        }
                                        if(this.user.type==1 && this.user.gametype==1 && this.dataList.z.name!=undefined){
                                            this.gameStyle(1);
                                        } else if(this.user.type==1){
                                            
                                        }
                                        clearInterval(pageTimer['timer08']);
                                    }
                                },time1000)

                                clearInterval(pageTimer['timer06']);
                            }
                        },time1000)

                        clearInterval(pageTimer["timer05"]);
                    }
                },500)
            },
            barter(){       // 更换庄家
                if(this.dataList.dd[0]!=undefined && this.user.gametype==0){
                    http.post('/RoomJoin/setMakers',{
                        roomid: this.user.rid, // 房间id
                        type: 1,  // 1为设置庄家，2为下庄
                        id: this.dataList.dd[0].zn_member_id,  // 用户id
                    })
                    .then(res => {
                        this.errorTips = res.msg;
                        this.careTip = true;
                    })
                } else if(this.user.gametype==1){
                    this.errorTips = '请在游戏暂停后操作';
                    this.careTip = true;
                } else if(this.dataList.dd[0]==undefined){
                    this.errorTips = '当前不存在其他等候上庄者';
                    this.careTip = true;
                }
            },
            xianshi(){      // 分数结果显示
                var self = this;
                var card = self.main.xianshi;
                console.log( self.zijiF );
                self.$store.state.user.userCard=Number(self.$store.state.user.userCard)+self.zijiF;
            },

            remove(){   // 一局结束需要清零的数据
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
                    liMy_Ff: [0,0,0,0,0,0,0],         // 当前个人压分_翻倍
                    liMy_Fn: [0,0,0,0,0,0,0],         // 当前个人压分_不翻倍
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
            },
            to(n){              // 弹框控制
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
                        // this.gameResult(this.user.rid)
                        break;
                    case 3 :    // 抽水分数
                        break;
                    case 4 :    // 游戏内分享
                        break;
                    case 7 :    // 新-流水报表
                        http.post('/Card/waterLog',{
                            room_id: this.user.rid,
                        })
                        .then(res => {
                            console.log(res);
                            var arr = [];
                            for(var an in res.data){
                                arr[Number(an-1)]=res.data[an];
                            }
                            console.log(arr)
                            this.$refs.onWater.waterList=arr.reverse();
                            if(this.user.type==1){
                                this.$refs.onWater.fz=true;
                            }
                        })
                        this.$refs.onWater.water=true
                        break;
                }
            },
            shangZ () {
                var self = this;
                http.post( '/RoomJoin/setMakers', { // 直接下一个上庄
                            roomid: self.$store.state.idRoom.id,
                            id: self.$store.state.data.Zlist[0].zn_member_id || 0,
                            type: 1,  // 1为设置庄家，2为下庄
                        })
                    .then(res => {
                        if(res.status == 0){
                            self.shangZ()
                        } else if(res.status == 1){
                            
                        }
                    })
            },
            
            gameResult () { // 先获取一波所有的游戏结果
                var self = this;
                http.post('/GameLog/gameResult',{
                    room_id : this.user.rid,
                }).then(res=>{
                    this.user.ju = res.data.length;
                    this.user.lun = this.user.ju;
                })
            },
    },
}
</script>