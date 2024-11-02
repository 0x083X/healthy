<template>
	<view class="content">
		<view class="header"></view>
		<view class="main"></view>
		<view class="footer">
			<button type="default" @click="handleLogin">登陆</button>
		</view>
	</view>
</template>

<script>
	import { mapMutations, mapState } from 'vuex'
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		computed: {
			...mapState('user', ['userInfo']),
		},
		onLoad() {

		},
		methods: {
			...mapMutations('user', ['setUserInfo']),
			handleLogin() {
				uni.login({
					provider: 'weixin',
					success: async (loginRes) => {
						// 该逻辑应该由后端操作的
						// const code = loginRes.code
						// const appid = "wx1af96eacc975debe"
						// const secret = "d5e179a8fca4c23a437b8e2d5e567fcd"
						// wx.request({
						// 	url: 'https://api.weixin.qq.com/sns/jscode2session?appid='+appid+'&secret='+secret+'&grant_type=authorization_code&js_code=' + code,
						// 	header: {
						// 		'content-type': 'application/json'
						// 	},
						// 	success: function (result) {
						// 		if(result.statusCode === 200) {
						// 			console.log(result.data.openid,'openid=======');
						// 			uni.setStorageSync('openid', result.data.openid);
						// 			uni.setStorageSync('session_key', result.data.session_key);
						// 			debugger
						// 		}
												
						// 	}
						// })
						await this.getUserInfo()
						uni.navigateTo({
							url: '/pages/order_page/index/index'
						})
					}
				});
			},
			async getUserInfo() {
				// 登录成功
				uni.getUserInfo({
				    provider: 'weixin',
				    success: (info) => {
				        // 获取用户信息成功, info.authResult是用户信息
				        const wxUserInfo = info.userInfo
						// 存储用户信息
						this.setUserInfo(wxUserInfo)
						console.log(this.userInfo)
				    }
				})
			}
		}
	}
</script>

<style lang="scss">
		
	* {
		box-sizing: border-box;
	}
	html,
	body,
	uni-page-body {
		height: 100%;
	}
	.content {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100%;
		.header {
			height: 100px;
			width: 100%;
		}
		.main {
			flex: 1;
			width: 100%;
		}
		.footer {
			display: flex;
			align-items: center;
			padding: 15px;
			height: 100px;
			width: 100%;
		}
	}
</style>
