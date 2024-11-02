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
						// 少了将loginRes.code传给后端的步骤，传了之后后端会返回一个access_token作为token，然后会缓存该token
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
