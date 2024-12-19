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
					url: '/pages/order_list/order_list'
				})
			}
		},
		onLoad(){
			uni.showToast({
			title: '您已下单成功，稍后会有陪诊人与您联系，请耐心等待',
			icon: 'none',
			duration: 2000
			})
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
