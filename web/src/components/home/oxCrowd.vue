<template>
	<div id='oxCrowd'> 
	<iframe :src="iframe" frameborder="0" :id='iframeCss'></iframe>
	<audio src="src/Music/du001.mp3" autoplay v-if='$store.state.Music.autoplay' loop></audio>
		<mt-popup 
	        v-model="careTip"
	        popup-transition="popup-fade"
	        class="care" >
	        <span>提示 <i @click="careTip = false"></i></span>
	        <p>{{errorTips}}</p>
	        <mt-button @click="careTip = false">  确定
	        </mt-button>
      	</mt-popup>

		<v-head></v-head>


		<div class='homeMain'>
			<ul @click='openS' 
			:class='spinner == 1 ? "ul01":""'
			v-infinite-scroll="loadMore"
  			:infinite-scroll-distance="200">

				<li v-for='(dataRoom) in $store.state.data.DT' :key='"ox"+dataRoom.id' :openState='`${dataRoom.zn_room_type == 1 ? "true" : "false"}`' :roomid = 'dataRoom.zc_number'>
					<b v-if='dataRoom.zn_room_type == 1 ? true : false'></b>
					<p>
						{{dataRoom.zc_title}}
					</p>
				</li>
			</ul>
			
			<mt-spinner 
			type="triple-bounce"
			:size="110" 
			v-show='spinner == 1'>
			</mt-spinner>
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
	
	export default {
		data: function(){
			return {
				iframe: '',
				iframeCss: 'iframeCss',
				loading: false,		// loading getData
				careTip : false,	//错误提示 
				errorTips: '',		// 错误信息
				fanNum : 0,		// 房间数

				pagesize : 40,	// 请求条数
				type : 1,		// 1 所有房间 2 自己开的房间
				p : 1,			// 当前页

				sendId : 0,
				spinner: 0,		// 懒加载loding
				cardNum : this.$store.state.initRoom.cardNum, // 房卡数量
			}
		},
		mounted: function(){
			// document.addEventListener("plusready", function() {
		 //        // 注册返回按键事件
		 //        plus.key.addEventListener('backbutton', function() {
		 //            // 事件处理
		 //            window.history.back();
		 //        }, false);
		 //    });
			var self = this;
			var VX_data = this.$store.state.data.DT;
			var VX_dataid = this.$store.state.data.DTid;
			var VX_dataidALL = this.$store.state.data.DTidALL;

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
                // 房间请求
				http.post('/Room/getRoomList',
                {
                    pagesize : self.pagesize,
                    type 	 : self.type,
                    p 		 : self.p,
                }, '',this)
	            .then(res => {
	            	console.log(res)
	            	if(res.status != 1){
	            		self.$store.state.data.DTP = 0;
	            		self.errorTips = res.msg;
	            		self.careTip = true;
	            		return false;
	            	}
	            	self.$store.state.data.DATE = new Date().getTime();
	            	VX_data = res.data;

	            	for(var i=0; i<VX_data.length; i++){
	            		VX_dataidALL.push(VX_data[i].id)
	            		VX_dataid.push(VX_data[i].id)
	            	}
	            	self.$store.state.data.DT = VX_data;
	            	self.$store.state.data.DTid = VX_dataid;
	            	self.$store.state.data.DTidALL = VX_dataidALL;
	            	self.$store.state.data.DTP = 1;
	            });
                var counT = null;

				console.log(self.$store.state.data.DT.length)
				if(self.$store.state.data.DT.length <= 15){	// 百人牛牛-少于15间房
					counT = setInterval(()=>{
						if(location.hash.slice(-7)!="oxCrowd"){
							return false;
						}
						// 房间请求
						http.post('/Room/getRoomList',
		                {
		                    pagesize : self.pagesize,
		                    type 	 : self.type,
		                    p 		 : self.p,
		                })
			            .then(res => {
			            	console.log(res)
			            	if(res.status == 1){
			            		self.$store.state.data.DATE = new Date().getTime();
			            		VX_data = res.data;
			            		self.$store.state.data.DT = VX_data;
			            		self.$store.state.data.DTid = VX_dataid;
			            		self.$store.state.data.DTidALL = VX_dataidALL;
			            	}
			            });
					},30000)
				} else {
					clearInterval(counT)
				}

			} else {
				router.push({name: '/'});	// 跳回登录页
			}

		},
		methods: {
			kefu: function(){
				// easemobim.bind({
				// 	configId: "91597b29-7705-433a-9b95-7d6e657896bb",
				// 	domain: '//kefu.easemob.com',
				// 	agentName: '客服',
				// 	hideKeyboard: true,
				// 	autoConnect: true,
				// 	hide: true,
				// })
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
					console.log(res)
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
		                                	if(res.msg == "你是房主"){
		                                		router.push({path: `room/${Etar.attributes["roomid"].nodeValue}`});
		                                	} else {
		                                		self.errorTips = '等待房主确认';
		                                		self.careTip = true;
		                                	}
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
			loadMore(){		// 无限加载 fanNum
				var self = this;

				var VX_data = this.$store.state.data.DT;
				var VX_dataid = this.$store.state.data.DTid;
				var VX_dataidALL = this.$store.state.data.DTidALL;
				var VX_p = this.$store.state.data.DTP;

				var VX_Time = this.$store.state.data.DATE;
				var VX_date = new Date().getTime();

				if(VX_date - VX_Time >= 90000){
					self.$store.state.data.Page = self.$store.state.data.DTP;
					self.newData();
				}


				if(VX_p >=0 && this.spinner == 0 && VX_data.length>self.pagesize){
					self.spinner = 1;
					http.post('/Room/getRoomList',
	                {
	                    pagesize : self.pagesize,
	                    type 	 : self.type,
	                    p 		 : VX_p,
	                }, '',this)
		            .then(res => {
		            	self.spinner == 0;	// 关掉loding
		            	console.log(res)
		            	if(res.status != 1){
		            		return false;
		            	}
		            	for(var i=0; i<VX_data.length; i++){
		            		var id = VX_data[i].id;
		            		if(VX_dataid.indexOf(id) < 0){
		            			VX_dataidALL.push(VX_data[i].id)
		            			VX_dataid.push(VX_data[i].id)
		            			VX_data.push(VX_data[i])
		            		}
		            	}

		            	self.$store.state.data.DT = VX_data;
		            	self.$store.state.data.DTid = VX_dataid;
		            	self.$store.state.data.DTidALL = VX_dataidALL;
		            	self.$store.state.data.DTP++;
		            	
		            });
				}
			},
			newData: function(){	// 用于更新数据
				var self = this;
				var page = this.$store.state.data.Page;
				var psize = page*self.pagesize;
				var date = self.$store.state.data.DATE;
				if(psize <= 0 || date == 0){
					return false;
				}

				http.post('/Room/getRoomList',
                {
                    pagesize : psize,
                    type 	 : self.type,
                    p 		 : 1,
                })
	            .then(res => {
	            	if(res.status == 1){
	            		self.$store.state.data.DTid = [];
	            		self.$store.state.data.DTidALL = [];
	            		self.$store.state.data.DT = res.data;

	            		for(var i=0; i<res.data.length; i++){
	            			var id = res.data[i].id;
	            			self.$store.state.data.DTid.push(id)
	            			self.$store.state.data.DTidALL.push(id)
	            		}
	            		self.$store.state.data.DATE = new Date().getTime();
	            		var pp = Math.random(res.data.length/self.pagesize);
	            		self.$store.state.data.DTP = pp;
	            	}
	            })
			},

		}
	}
</script>