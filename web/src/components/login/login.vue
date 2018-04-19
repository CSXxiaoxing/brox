<template>
	<div id='login'>
		<h1  v-if='test_txt>=0' @click='test(test_txt)'>测试按钮<input type="text" v-model='test_txt'/></h1>

		<mt-popup 
		    v-model="careTip"
		    popup-transition="popup-fade" :modal='false'
		    class="care" >
		    <span>通知 <i @click="careTip = false"></i></span>
		    <p>{{errorTips}}</p>
		    <mt-button @click="careTip = false">  确定
		    </mt-button>
		</mt-popup>

		<mt-popup
		    v-model="zhuce"
		    popup-transition="popup-fade" 
		    :modal='true'
		    class="zhuce">
		    <b class="close" @touchend="zhuce = false"></b>
		    <h4 :class='TEXTerror'>{{TEXTerror.length >= 1 ? "输入不能为空" :text[0]}}</h4>
		    <label> 
			    <span>您的昵称</span> 
			    <input type="text" placeholder='输入昵称' v-model.trim='nikename'/> 
		    </label>
	        <label> 
	    	    <span>输入密码</span> 
	    	    <input type="text" placeholder='输入密码' v-model.trim='password'/>
	        </label>
	        <label>
			    <span>手机号码</span> 
			    <input type="text" placeholder='输入手机号' v-model.trim='cell'/> 
		    </label>
		    <label>
			    <span>验证码</span>
			    <input type="text" placeholder='输入验证码' v-model.trim=' code'/> 
			    <i @click="daoTime<60 ? '' : sendCode()">{{daoTxt}}</i>
		    </label>
		    <span @touchend="input(4)" ></span>
		</mt-popup>

		<mt-popup
		    v-model="phone"
		    popup-transition="popup-fade" 
		    :modal='true'
		    class="phone">
		    <b class="close" @touchend="phone = false"></b>
		    <h4 :class='TEXTerror'>{{TEXTerror.length >= 1 ? "输入不能为空" :text[1]}}</h4>
		    <label> 
			    <span>手机号码</span> 
			    <input type="text" placeholder='输入手机号' v-model.trim='cell'/> 
		    </label>
	        <label> 
	    	    <span>输入密码</span> 
	    	    <input type="password" placeholder='输入密码' v-model.trim='password'/> 
	        </label>
	        <label @click='[(find = true),(type = 2)]' >忘记密码？点击找回！</label>
	        <hr/>
		    <span @click="input(2)"></span>
		</mt-popup>

		<mt-popup
		    v-model="find"
		    popup-transition="popup-fade" 
		    :modal='true'
		    class="find">
		    <b class="close" @touchend="find = false"></b>
		    <h4 :class='TEXTerror'>{{TEXTerror.length >= 1 ? "输入不能为空" :text[2]}}</h4>
		    <label> 
			    <span>手机号码</span> 
			    <input type="text" placeholder='输入手机号' v-model.trim='cell'/>
		    </label>
		    <label> 
			    <span>验证码</span> 
			    <input type="text" placeholder='输入验证码' v-model.trim=' code'/>
			    <i @click="daoTime<60 ? '' : sendCode()">{{daoTxt}}</i>
		    </label>
	        <label> 
	    	    <span>新的密码</span> 
	    	    <input type="text" placeholder='输入新的密码' v-model.trim='password'/> 
	        </label>
	        <hr/>
		    <span @touchend="input(3)"></span>
		</mt-popup>

		<div class='logo' @click='test_txt++'></div>
		<div class="nouser" v-show="a == 0">
			<span class='spanLog' @click='wxLogin'></span>
			<span class='spanLog' @click='[(phone = true),(type = 1)]'></span>

			<p>还没有账号？<span @click='[(zhuce = true),(type = 3)]'>注册</span></p>
		</div>

		<div class="haveuser"  v-show="a == 1 ">
			<span>{{Qname}}<b @click="a=0" @touchend="loginOut">切换</b></span>
			<span @touchend='local'></span>
		</div>
		<loading v-if='loading'></loading>
	</div>
</template>

<style  lang='scss' scoped>
	@import '../../utils/baseVar.scss';
	h1{
		font-size: 50px;
		line-height: 80px;
		height: 80px;
		width: 300px;
		background: #000;
		color: #fff;
		border-radius: 40px;
		position: absolute;
		left: 50%;
		top: 10%;
		-webkit-transform: translate(-50%,0);
		   -moz-transform: translate(-50%,0);
		    -ms-transform: translate(-50%,0);
		     -o-transform: translate(-50%,0);
		        transform: translate(-50%,0);
		border: 5px solid pink;
		input{
			margin-top: 0.3rem;
			height: 80px;
			width: 300px;
			font-size: 50px;
		}
	}
    b{
    	padding: 0.092593rem;
    }
    @mixin h4 {
		font-size: 0.611111rem;
		color: #3B3B3B;
		line-height: 0.611111rem;
		margin-bottom: 0.518519rem;
		font-weight: 300;
    }
    @mixin min-active {
		position: absolute;
		bottom: 0.19rem;
		left: 50%;
		-webkit-transform: translate(-50%,0) scale(0.95,0.95);
		   -moz-transform: translate(-50%,0) scale(0.95,0.95);
		    -ms-transform: translate(-50%,0) scale(0.95,0.95);
		     -o-transform: translate(-50%,0) scale(0.95,0.95);
		        transform: translate(-50%,0) scale(0.95,0.95);
    }
    @mixin label {
    	display: block;
    	height: 0.851852rem;
    	padding: 0.12963rem 0;
    	text-align: left;
    	span {
    		display: inline-block;
    		font-size: 0.41rem;
    		line-height: 0.851852rem;
    		width: 1.944444rem;
    	}
    	input {
			border: 0.027778rem solid #CCBDA8;
			background-color: rgba(255,255,255,0);
			height: 0.796296rem;
			padding-left: 0.240741rem;
			font-size: 0.37037rem;
			line-height: 0.796296rem;
			-webkit-border-radius: 0.092593rem;
			-moz-border-radius: 0.092593rem;
			-ms-border-radius: 0.092593rem;
			-o-border-radius: 0.092593rem;
			border-radius: 0.093rem;
    	}
    }
    @mixin b {
    	right: -0.4rem;
    	top: -0.16rem;
    	position: absolute;
    	background: $login008 no-repeat;
    	background-size: 0.907407rem 0.972222rem;
    	height: 0.972222rem;
    	width: 0.907407rem;
    }
	#login {
		height: 100%;
		width: 100%;
		background: $login001 no-repeat;
		background-size: 100% 100%;
		position:fixed;
		left:0;
		top:0;
		overflow:hidden;
		@mixin spans {
			width: 5.388889rem;
			height: 1.462963rem;
			display: inline-block;
			
			position: absolute;
			left: 50%;
			bottom: 4.796296rem;
			-webkit-transform: translate(-50%, 0);
			   -moz-transform: translate(-50%, 0);
			    -ms-transform: translate(-50%, 0);
			     -o-transform: translate(-50%, 0);
			        transform: translate(-50%, 0);
		}
		@mixin position {
			position: absolute;
			left: 50%;
			-webkit-transform: translate(-50%, 0);
			   -moz-transform: translate(-50%, 0);
			    -ms-transform: translate(-50%, 0);
			     -o-transform: translate(-50%, 0);
			        transform: translate(-50%, 0);
		}
		.logo {
			@include position;
			top: 5rem;
			width: 7.462963rem;
			height: 4.555556rem;
			background: $login002 no-repeat;
			background-size: 7.462963rem 4.555556rem;
		}
		.nouser{
			.spanLog:nth-of-type(1){
				background: $login003 no-repeat;
				background-size: 5.388889rem 1.462963rem;
				width: 5.388889rem;
				height: 1.462963rem;
				@include spans;
				bottom: 4.8rem;
			}
			.spanLog:nth-of-type(2){
				background: $login004 no-repeat;
				background-size: 5.388889rem 1.462963rem;
				@include spans;
				bottom: 2.9rem;
			}

			.spanLog:active {
		        -webkit-transform: translate(-50%, 6px);
		           -moz-transform: translate(-50%, 6px);
		            -ms-transform: translate(-50%, 6px);
		             -o-transform: translate(-50%, 6px);
		                transform: translate(-50%, 6px);
		    }
			p {
				@include position;
				bottom: 1.814815rem;
				font-size: 0.537037rem;
				height: 0.555556rem;
				line-height: 0.555556rem;
				color: #C7C7C5;
				span {
					color: #0F9728;
					border-bottom: 0.018519rem solid #0F9728;
				}
			}
		}

		.haveuser{
			span:nth-of-type(1){
				position: absolute;
				bottom: 3.833333rem;
				font-size: 0.555556rem;
				color: #CCC7CD;
				-webkit-transform: translate(-50%, 0);
				   -moz-transform: translate(-50%, 0);
				    -ms-transform: translate(-50%, 0);
				     -o-transform: translate(-50%, 0);
				        transform: translate(-50%, 0);
				b{
					text-decoration: underline;
					color: #10DF59;
					font-weight: normal;
				}
			}
			span:nth-of-type(2){
				background: $login010 no-repeat;
				@include spans;

				background-size: 4.388889rem 1.462963rem;
				width: 4.388889rem;
				height: 1.462963rem;
				bottom: 2.2rem;
			}
		}	
	}
	#login::-webkit-scrollbar {
    	display: none;
	}
	.zhuce {
		// width: 8.666667rem;
		width: 8.75rem;
		height: 7.888889rem;

		background: $login007 no-repeat;
		background-size: 8.75rem 7.888889rem;
		
		padding: 0.37037rem 0.37037rem 0.388889rem 0.62963rem;
		@include box-sizing();
		border-radius: 0.277778rem;
		h4{		@include h4;	}
		span:last-child{
			display: inline-block;
			height: 1.074074rem;
			width: 3.361111rem;

			position: absolute;
			bottom: 0.32rem;
			left: 50%;
			-webkit-transform: translate(-50%,0);
			   -moz-transform: translate(-50%,0);
			    -ms-transform: translate(-50%,0);
			     -o-transform: translate(-50%,0);
			        transform: translate(-50%,0);
			background: $login006 no-repeat;
			background-size: 3.361111rem 1.074074rem;
		}
		span:last-child:active{
			position: absolute;
			bottom: 0.3rem;
			left: 50%;
			-webkit-transform: translate(-50%,0) scale(0.95,0.95);
			   -moz-transform: translate(-50%,0) scale(0.95,0.95);
			    -ms-transform: translate(-50%,0) scale(0.95,0.95);
			     -o-transform: translate(-50%,0) scale(0.95,0.95);
			        transform: translate(-50%,0) scale(0.95,0.95);
		}
		// login008
		label{
		 	@include label; 
			width: 100%;
			span{
				width: 26%;
				font-size: 0.41rem;
			}
			input{
				width: 70%;
				-webkit-box-sizing: border-box;
				-moz-box-sizing: border-box;
				-ms-box-sizing: border-box;
				-o-box-sizing: border-box;
				box-sizing: border-box;
			}
		}
		label:nth-of-type(4){ 
			padding-bottom: 0.296296rem;
			border-bottom: 0.027778rem solid #D4D4D4;
			margin-bottom: 0.333333rem;
			position: relative;
			input{
				width: 2.8rem;
				margin-right: 0.111111rem;
			}
			i {
				font-style: normal;
				font-size: 0.333333rem;
				color: #fff;
				
				-webkit-border-radius: 0.240741rem;
				-moz-border-radius: 0.240741rem;
				-ms-border-radius: 0.240741rem;
				-o-border-radius: 0.240741rem;
				border-radius: 0.240741rem;
				display: inline-block;
				line-height: 0.851852rem;

				height: 0.861111rem;
				width: 2.203704rem;

				position: absolute;
				top: 0.16rem;
				right: -0.04rem;
				text-align: center;

				background: $login009 no-repeat;
				background-size: 2.203704rem 0.861111rem;

			}
		}
		b{	@include b;  }
	}
	.phone{
		width: 8.75rem;
		height: 7.064815rem;

		background: $login005 no-repeat;
		background-size: 8.75rem 7.064815rem;
		padding: 0.37037rem 0.37037rem 0.388889rem 0.62963rem;
		@include box-sizing();
		
		-webkit-border-radius: 0.277778rem;
		-moz-border-radius: 0.277778rem;
		-ms-border-radius: 0.277778rem;
		-o-border-radius: 0.277778rem;
		border-radius: 0.277778rem;
		h4{		@include h4;	}
		span:last-child{
			display: inline-block;
			height: 1.074074rem;
			width: 3.361111rem;

			position: absolute;
			bottom: 0.2rem;
			left: 50%;
			-webkit-transform: translate(-50%,0);
			   -moz-transform: translate(-50%,0);
			    -ms-transform: translate(-50%,0);
			     -o-transform: translate(-50%,0);
			        transform: translate(-50%,0);

			background: $login006 no-repeat;
			background-size: 3.361111rem 1.074074rem;
		}
		span:last-child:active{ @include min-active; }
		label{
			@include label;
			span{
				width: 26%;
				font-size: 0.41rem;
			}
			input{
				width: 66%;
			}
			margin: 0.222222rem 0.0rem;
		}
		label:nth-of-type(3){
			padding-right: 0.703704rem;
			text-align: right;
			color: #14AF0B;
			font-size: 0.388889rem;
			text-decoration: underline;	
			}
		hr{
			width: 8.7rem;
			position: absolute;
			left: 0;
			color: #CCBDA8;
			height: 1px;
		}
		b{	@include b;  }
	}
	.find {
		width: 8.75rem;
		height: 7.2rem;

		background: $login007 no-repeat;
		background-size: 8.75rem 7.888889rem;

		padding: 0.37037rem 0.37037rem 0.388889rem 0.62963rem;
		@include box-sizing();
		
		-webkit-border-radius: 0.277778rem;
		-moz-border-radius: 0.277778rem;
		-ms-border-radius: 0.277778rem;
		-o-border-radius: 0.277778rem;
		border-radius: 0.277778rem;
		h4{		
			@include h4;
			margin-bottom: 0.185185rem;
		}
		span:last-child{
			display: inline-block;
			height: 1.074074rem;
			width: 3.361111rem;
			
			position: absolute;
			bottom: 0.2rem;
			left: 50%;
			-webkit-transform: translate(-50%,0);
			   -moz-transform: translate(-50%,0);
			    -ms-transform: translate(-50%,0);
			     -o-transform: translate(-50%,0);
			        transform: translate(-50%,0);
			background: $login006 no-repeat;
			background-size: 3.361111rem 1.074074rem;
		}
		span:last-child:active{
			position: absolute;
			bottom: 0.19rem;
			left: 50%;
			-webkit-transform: translate(-50%,0) scale(0.95,0.95);
			   -moz-transform: translate(-50%,0) scale(0.95,0.95);
			    -ms-transform: translate(-50%,0) scale(0.95,0.95);
			     -o-transform: translate(-50%,0) scale(0.95,0.95);
			        transform: translate(-50%,0) scale(0.95,0.95);
		}
		label{
			@include label;
			padding: 0.296296rem 0.0rem;
		}
		label:nth-of-type(2){ 
			position: relative;
			padding: 0;
			margin: 0.296296rem 0rem;
			input{
				width: 2.8rem;
				margin-right: 0.111111rem;
			}
			i {
				font-style: normal;
				font-size: 0.333333rem;
				color: #fff;
				
				-webkit-border-radius: 0.240741rem;
				   -moz-border-radius: 0.240741rem;
				    -ms-border-radius: 0.240741rem;
				     -o-border-radius: 0.240741rem;
				        border-radius: 0.240741rem;
				display: inline-block;
				line-height: 0.851852rem;
				height: 0.851852rem;
				width: 2.203704rem;
				position: absolute;
				top: -0.02rem;
				right: 0rem;
				text-align: center;

				background: $login009 no-repeat;
				background-size: 2.203704rem 0.861111rem;
			}
		}

		b{	@include b;  }
	}
</style>

<script type="text/javascript">
	import Vue from 'vue';
	import loading from '../loading/loading.vue';
	Vue.component('loading', loading)
	import http from '../../utils/httpClient.js';
	import router from '../../router/';

	Vue.component('loading', loading)

	export default {
		data(){
			return {
				test_txt : -3,
				loading: false,		// loading
				zhuce: false,
				login:false,
				find: false,
				phone:false,
				text: ["注册", "登录", "找回密码"],
				zhuceType: true, 
				TEXTerror: '',
				// 用户资料
				nikename: '',
				password: '',
				cell: '',
				code: '',
				a: 0,
				// 60s状态设置
				daoTime: 60,
				daoTxt: '获取验证码',

				Qname: localStorage.oxName,
				type:0,
				careTip : false,
				errorTips: '',		// 错误信息
			}
		},
		mounted: function(){
			var self = this;
			if(localStorage.oxToken){
				this.a = 1;
			} else {
				this.a = 0;
			}
			// document.querySelector('#login').addEventListener('touchstart', function (ev) {
			//     event.preventDefault();
			// });
			document.querySelector('#login').addEventListener('touchmove', function (ev) {
			    event.preventDefault();
			});
		},
		methods: {
			test(n){
				share_WANJI(n)
			},
			wxLogin(){
				weixin_WANJI_DL();
				// $store
				this.loading=true;
				var self = this;

				window.weixin_DL = function(wx_data){
					self.loading=false;
					var data = wx_data.data;
					if( localStorage['oxUid'] != data.uid ){
						// 注册
						var options2 = {
						    username: 'hz_niuniu_'+ data.uid,
						    password: '123456',
						    nickname: data.member_info.nickname,
						    appKey: WebIM.config.appkey,
						    success: function () { 
						        console.log('注册成功')
						    },  
						    error: function () {
						    	console.log('注册失败')
						    },
						    apiUrl: WebIM.config.apiURL
						};
						conn.registerUser(options2);
					}
					localStorage['oxToken'] = data.token;
					localStorage['oxUid'] = data.uid;
					localStorage['oxImg'] = data.member_info.headimg;
					localStorage['oxName'] = data.member_info.nickname;
					self.$store.state.user.userName = data.member_info.nickname;
					self.$store.state.user.userID = data.uid;
					self.$store.state.user.userImg = data.member_info.headimg;
					
					http.post('/MemberFriend/getFrientList',{   // 初次进入获取总好友列表
					    uid : data.uid,
					}).then(res=>{
					    console.log(res)
					    var arr = [];
					    for(var i=0; i<res.msg.length; i++){
					    	arr.push(res.mag[i].fid)
					    }
					    self.$store.state.user.friend  = res.msg;
					    self.$store.state.user.friendId= arr;
					})
					self.$store.dispatch('dl');        // 聊天登录
					weixin_WANJI_DL_data = null;
					router.push({name: 'home'});
					self.phone = false;
				}
			},
			local () {
				if(localStorage.oxToken){
					http.post('/MemberFriend/getFrientList',{   // 初次进入获取总好友列表
					    uid : localStorage.oxUid,
					}).then(res=>{
					    console.log(res)
					    // console.log(res.msg.length)
					    var arr = [];
					    for(var i=0; i<res.msg.length; i++){
					    	arr.push(res.msg[i].fid)
					    }
					    this.$store.state.user.friend  = res.msg;
					    this.$store.state.user.friendId= arr;
					    console.log(this.$store.state.user)
					})
					router.push({name: 'home'});
				} else {
					this.a = 0;
				}
			},
			input (n) {		//input非空验证 
				var type = true;
				var self = this;
				if(n >= 2){
					!this.password ? type = false : 0;
					!this.cell ? type = false : 0;
				}
				if(n >= 3){
					!this.code ? type = false : 0;
				}
				if(n >= 4){
					!this.nikename ? type = false : 0;
				}
				function txtErr(){
					self.TEXTerror = 'TEXTerror';
					var a = setTimeout(()=>{
						self.TEXTerror = '';
						clearTimeout(a)
					},2000)
				}
				if(type == false) {
					txtErr()
				} else {
					if(n == 2) {
						self.loging();
					}
					if(n == 3) {
						self.findPassword();
					}
					if(n == 4) {
						self.zhuCe();
					}
				}
			},
			loging() {		//登录
				var self = this;
				http.post( '/Member/login', {
						mobile: Number(self.cell),
						password: self.password,
					}, '', this )
					.then(res => {
						console.log(res)
						if(res.status == 1){
							var data = res.data;
							if( localStorage['oxUid'] != data.uid ){
								// 注册
								var options2 = {
								    username: 'hz_niuniu_'+ data.uid,
								    password: '123456',
								    nickname: localStorage.oxName,
								    appKey: WebIM.config.appkey,
								    success: function () { 
								        console.log('注册成功')
								    },  
								    error: function () {
								    	console.log('注册失败')
								    },
								    apiUrl: WebIM.config.apiURL
								};
								conn.registerUser(options2);
							}
							localStorage['oxToken'] = data.token;
							localStorage['oxUid'] = data.uid;
							localStorage['oxImg'] = GAME_ALL_URL+data.member_info.headimg;
							localStorage['oxName'] = data.member_info.nickname;
							this.$store.state.user.userName = localStorage.oxName;
							this.$store.state.user.userID = localStorage.oxUid;
							this.$store.state.user.userImg = localStorage.oxImg;
			
							http.post('/MemberFriend/getFrientList',{   // 初次进入获取总好友列表
							    uid : localStorage.oxUid,
							}).then(res=>{
							    console.log(res)
							    var arr = [];
							    for(var i=0; i<res.msg.length; i++){
							    	arr.push(res.mag[i].fid)
							    }
							    this.$store.state.user.friend  = res.msg;
							    this.$store.state.user.friendId= arr;
							})
							this.$store.dispatch('dl')         // 聊天登录
							router.push({name: 'home'});
							self.phone = false;
						} else {
							self.errorTips = res.msg;
							self.careTip = true;
						}
					})
			},
			zhuCe() {		//注册
				var self = this;
				http.post( '/Member/registered', {
							mobile: self.cell,
							password: self.password,
							code: self.code,
							nikename: self.nikename,
						}, '', this )
					.then(res => {
						if(res.status == 1){
							self.loging();
						} else {
							self.errorTips = res.msg;
							self.careTip = true;
						}
						self.zhuce = false;
					})
			},
			findPassword() {	//找回密码
				var self = this;

				http.post( '/Member/changePassword', {
							mobile: self.cell,
							password: self.password,
							code: self.code,
						}, '', this )
					.then(res => {
						if(status == 1){
							router.push({name: 'home'});
						} else {
							self.errorTips = res.msg;
							self.careTip = true;
						}
						self.find = false;
					})
			},
			
			loginOut(){		//登出
				var self =this;
				http.post('/Member/login_out',
				{
					token: localStorage.oxToken,
					uid: localStorage.oxUid,
				})
				.then(res => {
						console.log(res)
						if(res.status == 1){
							localStorage.removeItem('oxToken')
							self.a = 0;
						} else {
							self.errorTips = res.msg;
							self.careTip = true;
						}
					})
			},
			//手机验证码
			sendCode(){
				var self = this;
				this.daoTxt=this.daoTime+'s';
				var setTime = setInterval(()=>{
					this.daoTime--;
					this.daoTxt=this.daoTime+'s';
					if(this.daoTxt=="0s"){
						this.daoTime = 60;
						this.daoTxt='获取验证码'
						clearInterval(setTime)
					}
				},1000)
				http.post('/Api/Sms/sendYzm',{
					mobile : self.cell,
					type : self.type,
				})
				.then(res=> {
					console.log(res)
					if(res.status == 0){
						self.errorTips = res.msg;
						self.careTip = true;
					}
				})
			},
		}
	}
</script>