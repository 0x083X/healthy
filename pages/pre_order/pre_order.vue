<template>
	<view class="pre_order_page">
		这是首页
		<u-button type="primary" text="去下单" @click="goToOrder"></u-button>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			goToOrder() {
				uni.navigateTo({
					url: "/pages/order_page/order_page"
				})
			}
		}
	}
</script>

<style lang="scss">
	.pre_order_page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		padding: 20px;
		height: 100%;
	}
</style>