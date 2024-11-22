<template>
	<view class="content">
		<view class="header"></view>
		<view class="main">
			<u--form
				labelPosition="left"
				ref="loginForm"
				:model="form"
				:rules="rules"
			>
				<u-form-item class="item">
					<button open-type="chooseAvatar" @chooseavatar="onChooseAvatar" class="avatar">
						<u--image :src="form.avatar" width="80px" height="80px"></u--image>
					</button>
				</u-form-item>
				<u-form-item prop="form.nickName" label="称呼:" borderBottom>
					<u--input
						v-model="form.nickName"
						border="none"
					></u--input>
				</u-form-item>
			</u--form>
		</view>
		<view class="footer">
			<!-- <u-button text="微信登录" @click="showGetUserInfoModal" type="success" shape="circle"></u-button> -->
			<!-- <u-button type="success" open-type="getPhoneNumber" @getphonenumber="getPhoneNumber">手机号一键登录</u-button> -->
			<u-button type="success" @click="wxLogin">登录</u-button>
		</view>
	</view>
</template>

<script>
	import { mapMutations, mapState } from 'vuex'
	export default {
		data() {
			return {
				form: {
					avatar: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
					nickName: '',
				},
				rules: {
					"nickName": {
						type: 'string',
						required: true,
						message: '请填写昵称',
						trigger: ['blur', 'change']
					}
				}
			}
		},
		computed: {
			...mapState('user', ['userInfo']),
		},
		onReady() {
			//如果需要兼容微信小程序，并且校验规则中含有方法等，只能通过setRules方法设置规则。
			this.$refs.loginForm.setRules(this.rules)
		},
		onLoad() {
			const token = uni.setStorageSync('token')
			// 使用token进行登录
			if(!token) return 
			uni.navigateTo({
				url: '/pages/order_page/index/index'
			})
		},
		methods: {
			...mapMutations('user', ['setUserInfo']),
			//获取微信头像
			onChooseAvatar(e) {
				this.form.avatar = e.detail.avatarUrl;
			},
			login() {
				uni.login({
					provider: 'weixin',
					success: (loginRes) => {
						const data = {
							code: loginRes.code,
							avatar: this.form.avatar,
							nickName: this.form.nickName
						}
						this.$request({
							url: 'api/login/openID',
							data,
							method: 'POST'
						}).then(res => {
							const msg = res.data
							// 缓存登录状态
							uni.setStorageSync('token', msg.token)
							console.log(uni.getStorageSync('token'))
							uni.redirectTo({
								url: "/pages/order_page/index/index"
							})
						}).catch(err => {
							// console.log(err, 'error')
							console.log(err)
							uni.showToast({
								title: err.errMsg,
								icon: 'none'
							})
						})
						// uni.redirectTo({
						// 	url: '/pages/order_page/index/index'
						// })
					}
				})
			},
			wxLogin() {
				if (this.form.nickName) {
					this.login()
				} else {
					uni.showToast({
						title: `请输入昵称`,
						icon: 'none'
					});
				}
			},
			getPhoneNumber(e) {
				if (this.form.nickName) {
					console.log(e)
				} 
			}
			
			
			
		// 	showGetUserInfoModal() {
		// 		uni.showModal({
		// 			title: '登录提示',
		// 			content: '您需要授权微信登录后才能正常使用小程序功能',
		// 			success: (res) => {
		// 				//如果用户点击了确定按钮
		// 				if (res.confirm) {
		// 					this.getUserInfo()
		// 				}
		// 			}
		// 		});
		// 	},
		// 	handleLogin() {
		// 		uni.login({
		// 			provider: 'weixin',
		// 			success: (loginRes) => {
		// 				console.log(loginRes.code)
		// 				// 该逻辑应该由后端操作的
		// 				// const code = loginRes.code
		// 				// const appid = "wx1af96eacc975debe"
		// 				// const secret = "d5e179a8fca4c23a437b8e2d5e567fcd"
		// 				// wx.request({
		// 				// 	url: 'https://api.weixin.qq.com/sns/jscode2session?appid='+appid+'&secret='+secret+'&grant_type=authorization_code&js_code=' + code,
		// 				// 	header: {
		// 				// 		'content-type': 'application/json'
		// 				// 	},
		// 				// 	success: function (result) {
		// 				// 		if(result.statusCode === 200) {
		// 				// 			console.log(result.data.openid,'openid=======');
		// 				// 			uni.setStorageSync('openid', result.data.openid);
		// 				// 			uni.setStorageSync('session_key', result.data.session_key);
		// 				// 			debugger
		// 				// 		}
												
		// 				// 	}
		// 				// })
		// 				this.getUserInfo()
		// 				uni.navigateTo({
		// 					url: '/pages/order_page/index/index'
		// 				})
		// 			}
		// 		});
		// 	},
		// 	getUserInfo() {
		// 		// 登录成功
		// 		uni.getUserProfile({
		// 		    // provider: 'weixin',
		// 			desc: '用户登录',
		// 		    success: (info) => {
		// 				console.log(info, 123)
		// 				debugger
		// 		        // 获取用户信息成功, info.authResult是用户信息
		// 		        const wxUserInfo = info.userInfo
		// 				// 存储用户信息
		// 				this.setUserInfo(wxUserInfo)
		// 				console.log(this.userInfo)
		// 		    },
		// 			fail: (err) => {
		// 				console.log(err)
		// 				debugger
		// 				reject(err)
		// 			}
		// 		})
		// 	}
		},
	}
</script>

<style lang="scss">
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20px;
		height: 100%;
		.header {
			height: 100px;
			width: 100%;
		}
		.main {
			flex: 1;
			width: 100%;
			.avatar {
				display: flex;
				flex-direction: column;
				justify-content: center;
				align-items: center;
				background: none;
				color: inherit;
				border: none;
				padding: 0;
				font: inherit;
				cursor: pointer;
				outline: inherit;
			}
		}
		.footer {
			display: flex;
			align-items: center;
			padding: 15px;
			height: 200px;
			width: 100%;
		}
	}
</style>
