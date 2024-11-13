<template>
	<view class="container">
		<view class="text">
			支付成功
		</view>
		<u-button type="success" text="返回" class="btn" @click="jumpToForm"></u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			jumpToForm() {
				uni.reLaunch({
					url: '/pages/order_page/index/index'
				})
			}
		}
	}
</script>

<style lang="scss">
.container {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	padding: 20px;
	height: 50%;
	.text {
		margin-bottom: 20px;
	}
}
</style>
