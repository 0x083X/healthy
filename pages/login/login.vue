<template>
	<view class="content">
		<image :src="backImage" class="bg-image"></image>
		<view style="z-index:99">
			<u--form labelPosition="left" ref="loginForm" :model="form" :rules="rules">
				<view class="footer">
					<u-button @click="wxLogin" shape="circle" color="#44af9b" plain text="一键登录"></u-button>
				</view>
				<view>
					<u-checkbox-group v-model="form.isAgree">
						<u-checkbox :name="1" shape="circle" activeColor="#44af9b"></u-checkbox>
						<span class="text-12">
							我已阅 读并同意 <span class="text-decoration" @click="actionshow = true">《会员服务协议》、《小程序隐私政策》</span>
						</span>
					</u-checkbox-group>
				</view>
			</u--form>
		</view>
		<view>
			<u-action-sheet round="10" title="隐私政策" :show="actionshow" @close="actionshow = false">
				<view class="padding">
					<view class="text-868686">
						欢迎使用泽安陪诊官方平台!请您在使用前点击<span class="text-44af9b">《隐私协议》</span>并仔细阅读，如您同意全部内容，请点击同意开始使用我们的服务。
						若点击"不同意"，您将无法使用我们的产品和服务，并会退出本小程序
					</view>
					<view class="flex">
						<u-button @click="actionshow = false" :plain="true" shape="circle" :hairline="true"
							text="不同意退出"></u-button>
						<u-button :customStyle="{marginLeft: '8px'}" @click="agreeCk" shape="circle" color="#44af9b"
							text="同意并继续"></u-button>
					</view>
				</view>
			</u-action-sheet>
		</view>
	</view>
</template>

<script>
	import {
		mapMutations,
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				form: {
					isAgree: [] // 是否勾选同意用户协议
				},
				actionshow: false,
				backImage:this.$domain + 'images/login/login-bg.png'
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
			if (!token) return
			uni.switchTab({
				url: '/pages/pre_order/pre_order'
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
						console.log(loginRes)
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
							uni.switchTab({
								url: "/pages/pre_order/pre_order"
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
						// 	url: '/pages/order_page/index'
						// })
					}
				})
			},
			wxLogin() {
				console.log(this.form.isAgree)
				if (this.form.isAgree.includes(1)) {
					this.login()
				} else {
					uni.showToast({
						title: `请勾选会员服务协议`,
						icon: 'none'
					});
				}
			},
			getPhoneNumber(e) {
				if (this.form.nickName) {
					console.log(e)
				}
			},
			agreeCk() {
				this.actionshow = false
				this.form.isAgree = [1]
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
		height: calc(100vh - 44px) !important;
		.bg-image{
			position: absolute;
			left: 0;
			top: 0;
			height: 100%;
			width: 100%;
			z-index: 1;
		}

		.logo {
			margin: auto;
			height: 160px;
			width: 160px;
			border-radius: 50%;
		}

		.main {
			flex: 1;
			width: 100%;
			margin-top: 200px;

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
			padding: 15px 20rpx;
			width: 100%;
			position: relative;
			bottom: 0;
		}
	}

	.home-image {
		height: 100%;
		width: 100%;
		position: fixed;
	}

	.text-12 {
		font-size: 12px;
		color: #333333;
	}

	.text-decoration {
		scroll-padding-left: 10px;
		text-decoration: underline;
	}

	.flex {
		display: flex;
		padding-top: 20rpx;
	}

	.padding {
		padding: 40rpx;
		text-align: left;
	}

	.text-868686 {
		color: #868686;
	}

	.text-44af9b {
		color: #44af9b;
	}
</style>