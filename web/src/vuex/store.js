import Vue from 'vue';
import Vuex from 'vuex';
import http from '../utils/httpClient.js';
import bad from './badDict.js';

Vue.use(Vuex);
// this.$store.dispatch('yinx10010') // 音效
export default new Vuex.Store({
    // 字符串数据存储
    // 使用demo : this.$store.state.Music.autoplay
    // 使用demo : $store.state.room.room_id
    state: {
        // 用户信息
        user: {
            userName: localStorage.brName,
            userID: localStorage.brUid,
            userImg: localStorage.brImg,
            userCard: localStorage.brCardNum,
            dlGame: localStorage.dlGame,// 是否代理
            dlPerson: localStorage.dlPerson,// 代理人号码
            type: 5,    // z
            friend  : [],   // 好友列表
            friendId: [],   // 好友的id
            dict: {},       // 群_头像字典
            dictH: {},      // 好友_头像字典
        },
        room: { // 房间数据
            z: {
                status: 0,
            }, // 庄
            sz: [],     // 上庄人员
            pt: [],     // 普通玩家
            room_id: [],    // 房间总成员id
        },
        oxCrowd: {  // 牛群游戏大厅
            notice: [],     // 系统公告
        },
        Music: {    // 音乐 /音效 
            autoplay: false, // 音乐
            musi: true,     // 音效
            src: false,     // 点击气泡-音效
            qxzhu: false,   // 请下注-音效
            click01_num: 0,   // 选择筹码-音效
            click01: [],   // 选择筹码-音效
            click02_num: 0,   // 丢筹码-筹码数量
            click02: [],   // 丢筹码-音效
        },

        // 默认数据
        initRoom: {
            radioValue: ['比J', '比Q', '比K', '无牛关机 (庄赢)'],
            ox: ['牛一', '牛二', '牛三', '牛四', '牛五', '牛六', '牛七', '牛八', '牛九', '牛牛', '五花牛'],
            oxK: '比Q',
            time: [30, 60, 120, 180, 300, 480],
            miss: ['秒', '分钟'],
            oxNumber: [1, 1, 1, 1, 1, 1, 1, 2, 2, 3, 5, 10],
            // 一个中文两个字节
            nameLenth: 16,
            // 最低上分数
            minG: 5000,
            cardNum:0,
        },
        idRoom: {
            id: 0,              // 房间id
            room_id: 0,         // 房间number
            roomName: '',       // 房间名字
            oxK: '',            // 比什么
            scope: [1,100],     // 下注范围
            oxNumber: [],       // 倍率
            time: 30,           // 押注时间  
            open: false,        // 是否开放
            newMan: false,      // 新人确认
            cardFn: 0,          // 玩法（几副牌）
            room: 'bell',       // 房间计费方式
            scale: 1,           // 抽水比例
            minGrade: 100,      // 最小上庄分数
            zn_chatid: 0,       // 群聊号码
            ju: '',             // 上庄局数
            ForT: 0,            // 是否房主
        },
        placard:{
             message:'健康游戏，请勿赌博，谢谢合作',             //房间公告
        },
        time: {
            initTime: 6,    // 游戏初始化准备时间
            random: 3,      // 游戏选择庄牌时间
            speed: 80,      // 随机背景的速度
            endTime: 5,     // 庄开牌后等待时间
            countTime: 10,  // 剩下全开倒计时
        }, //基础时间设置
        // 设置值
        setRoom: {},
        badDict: bad,
        // 聊天辅助
        txt: [],
        txt_idx: [],
        txt_time: [],
        // 消息传递
        obj: '',
        data: {
            DT: [],     // 大厅数据
            DTid: [],    // 房间id,防重复ID
            DTidALL: [],    // 去重
            DTP: -1,    // 页数以及启动无限加载
            DATE: 0,    // 重复获取数据时间
            Page: 0,    // 需要更新的页数

            zhaoFZ: [],     // 找房主聊天的人，排队盒子

            Room: {},      // 房间数据
            Ztype : {},     // 房间内，庄的数据

            // Zlist: [],     // 申请庄的列表
            Zlist: '',     // 申请庄的列表
            apptype: 0,     // 1 上庄成功 0 没上庄

            listOver: [],   // 开奖记录
            juAll: 0,      // 房间总局数
        },   // 存放各种数据避免重复请求
        systemMess:{
            title :'', //信息标题
            content : '', //信息内容
            time :'', //信息时间
        }
    },
    // 属性计算
    // 使用demo ：this.$store.getters.doneTodos
    getters: {
        doneTodos: state => {
            return state.todos.filter(todo => todo.done)
        },
    },
    // 方法，mutations必须同步执行 onCreateGroup
    // 使用demo : this.$store.commit('increment')
    mutations: {
        increment (state) {
            // 变更状态
        },
        ls () {   // 历史history
            history.back()
        },
    },
    // 这里的方法可异步执行
    // 使用demo : this.$store.dispatch('aaa')
    actions: {
        yinx10010(){ // 点击气泡-音效
            if (this.state.Music.musi){
                this.state.Music.src = false;
                this.state.Music.src = true;
                // console.log(this.state.Music.src)
                setTimeout(() => {
                    this.state.Music.src = false;
                }, 200);
            } else {
                this.state.Music.src = false;
            }
        },
        qxzhu() { // 请下注-音效
            if (this.state.Music.musi) {
                this.state.Music.qxzhu = false;
                this.state.Music.qxzhu = true;
            } else {
                this.state.Music.qxzhu = false;
            }
        },
        qxzhu_esc() { // 关闭请下注-音效
            this.state.Music.qxzhu = false;
        },
        click01() { // 选择筹码-音效
            if (this.state.Music.musi) {
                this.state.Music.click01_num++;
                this.state.Music.click01.push(false)
                var leng = this.state.Music.click01_num;
                this.state.Music.click01[leng - 1] = false;
                this.state.Music.click01[leng - 1] = true;
                setTimeout(() => {
                    this.state.Music.click01[leng - 1] = false;
                }, 800);
            } else {
                // this.state.Music.click02 = false;
            }
        },
        click01_esc() { // 选择筹码结束-音效
            this.state.Music.click01_num = 0;
            this.state.Music.click01 = [];
        },
        click02() { // 丢筹码-音效
            if (this.state.Music.musi) {
                this.state.Music.click02_num++;
                this.state.Music.click02.push(false)
                var leng = this.state.Music.click02_num;
                this.state.Music.click02[leng-1] = false;
                this.state.Music.click02[leng-1] = true;
                setTimeout(() => {
                    this.state.Music.click02[leng-1] = false;
                }, 800);
            } else {
                // this.state.Music.click02 = false;
            }
        },
        click02_esc() { // 丢筹码结束-音效
            this.state.Music.click02_num=0;
            this.state.Music.click02=[];
        },

        
    },
})


