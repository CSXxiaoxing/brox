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
        <mt-popup 
            v-model="careTip2"
            popup-transition="popup-fade"
            class="care" >
            <span>通知 <i @click="careTip2 = false"></i></span>
            <p>{{errorTips2}}</p>
            <mt-button @click="escGame">  确定
            </mt-button>
        </mt-popup>

		<v-head></v-head>

		<div class='homeMain'>
			<ul>
				<li>
					<router-link to="/oxCrowd">
					<img src="../../image/homeA01.png" alt="" />
					</router-link>
				</li>
				<li><img src="../../image/homeA02.png" alt="" /></li>
				<li><img src="../../image/homeA03.png" alt="" /></li>
			</ul>
		</div>

		<v-foot></v-foot>

		<idMessage ref="onidMessageChild" ></idMessage>
		<buyRoom ref="onbuyRoomChild" ></buyRoom>
		<noOpen  ref="onOpenChild" ></noOpen>
		<joinRoom ref="onjoinRoomChild" ></joinRoom>
		<varRoom ref="onvarRoomChild" ></varRoom>
		<myRoom ref="onmyRoomChild" ></myRoom>
		<toShare ref="ontoShareChild" :share='"home"'></toShare>
		<friendVIP ref="onfriendVIPChild"></friendVIP>
		
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
	import buyRoom from '../../module/homeModule/buyRoom.vue'; // 购买房卡
	Vue.component('buyRoom', buyRoom)
	import setRoom from '../../module/homeModule/varRoom.vue'; // 创建房间
	Vue.component('varRoom', setRoom)
	import toShare from '../../module/shareModule/toShare.vue'; // 邀请好友
	Vue.component('toShare', toShare)
	import joinRoom from '../../module/homeModule/joinRoom.vue'; // 输入房间号进入
	Vue.component('joinRoom', joinRoom)
	import myRoom from '../../module/homeModule/myRoom.vue'; // 我的房间
	Vue.component('myRoom', myRoom)
	import loading from '../loading/loading.vue'; // loading
	Vue.component('loading', loading)
	import friendVIP from '../friend/friend.vue'; // 好友
	Vue.component('friendVIP', friendVIP)
	import header from './header.vue'; // 头部
	Vue.component("v-head",header)
	import foot from "./foot.vue"; // 尾部
	Vue.component("v-foot",foot)
	import idMessage from '../../module/homeModule/idMessage.vue';	// 个人参数
	Vue.component('idMessage', idMessage)

	export default {
		data: function(){
			return {
				iframe: '',
				iframeCss: 'iframeCss',
				loading: false,		// loading getData
                careTip : false,    //错误提示 
				careTip2 : false,	//错误提示 
                errorTips: '',      // 错误信息
				errorTips2: '',		// 错误信息

				pagesize : 40,	// 请求条数
				type : 1,		// 1 所有房间 2 自己开的房间
				p : 1,			// 当前页

				sendId : 0,
				spinner: 0,		// 懒加载loding
				notice : [],	// 系统公告
				cardNum : this.$store.state.initRoom.cardNum,
			}
		},
		mounted: function(){

			var self = this;
			goEasy.subscribe({
			    channel: "user_"+localStorage.oxUid,
			    onMessage: function(message){
			        // console.log(JSON.parse(message.content))
			        var data = JSON.parse(message.content);
			        var type = data.type;
			        switch(type){
			            case 2 :                            // 通知房主有人加入
			                console.log(data)
			                var obj = {
			                	name: data.nikename,
			                	uid: data.id,
			                	rid: data.roomid,
                                roomName: data.room_name,
                                roomNum: data.room_number,
			                	type: 2,
			                }
			                var arr = self.$store.state.system.lodin;
			                if(arr[0]==undefined){
			                	arr.push(obj);
			                }
			                for(var i=0; i<arr.length; i++){
			                	if(arr[i].uid!=obj.uid && arr[i].rid!=obj.rid){
			                		arr.push(obj);
			                	}
			                }
			                console.log(arr)
			                break;
                        
			        }
			        
			    }
			});


			if(localStorage.oxToken && localStorage.oxUid){
				// 系统公告
                http.post('/MemberNotice/getAnnouncement',{
                    id : self.id,
                }, '' ,this)
                .then(res => {
                	if(res.status == 1){
                		var notice = self.$store.state.oxCrowd.notice;
                		notice = [];
                		console.log(res.data[0])
                		if(res.data[0] == undefined){
                			notice.push(' 文明游戏，请勿赌博！')
                		}
                		for(let i in res.data){
                			notice.push(res.data[i].zc_content)
                		}
                		self.$store.state.oxCrowd.notice = notice;
                	}
                })
			} else {
				router.push({name: 'login'});	// 跳回登录页
			}
		},
		methods: {
			kefu: function(){	// 环信客服
				// easemobim.bind({
				// 	configId: "91597b29-7705-433a-9b95-7d6e657896bb",
				// 	domain: '//kefu.easemob.com',
				// 	agentName: '客服',
				// 	hideKeyboard: true,
				// 	autoConnect: true,
				// 	hide: true,
				// })
			},
            escGame(){  // 退出游戏】
                router.push({name: 'login'})
            },
			child_KA: function(n){
				switch(n){
					case 1 : // 加入房间
						this.$refs.onjoinRoomChild.joinRoom=true;
						break;
					case 2 : // 个人信息
						this.$refs.onidMessageChild.idMessage=true;
						break;
					case 3 : // 打开购买房卡
						this.$refs.onbuyRoomChild.buyRoom=true;
						break;
					case 4 : // 打开我的房间
						this.$refs.onmyRoomChild.myRoom=true;
						break;
					case 5 : // 分享界面
						this.$refs.ontoShareChild.toShare=true;
						break;
					case 6 : // 原好友页面
						this.$refs.onfriendVIPChild.friend_VIP=true;
						break;
				}
			},
			varRoom(){	// 创建房间
				this.$refs.onvarRoomChild.initType = 0;
				this.$refs.onvarRoomChild.boxState.CvarRoom=true;
				var self = this;
				http.post('/Room/getRoomNumber',
				{
					token: localStorage.oxToken,
				},'',this)
				.then(res => {
					this.$refs.onvarRoomChild.initData.zc_number =  res.data;
				})
				this.$refs.onvarRoomChild.noModal();
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
		                            http.post('/Room/joinRoom' ,
		                            {
		                                zn_room_id : res.data.id,
		                            }, '' ,this)
		                            .then(res => {
		                                console.log(res)
		                                if( res.status == 3 ){
		                                    router.push({path: `room/${Etar.attributes["roomid"].nodeValue}`});
		                                    // alert('房间号码不存在')
		                                } else if( res.status == 1 ){
		                                    router.push({path: `room/${res.data.zc_number}`});
		                                } else if( res.status == 0 ){
		                                    self.errorTips = '你已在房间内，请退出当前房间';
		                                    self.careTip = true;
		                                }
		                            })

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