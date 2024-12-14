<template>
	<view class="pre_order_page">
		<view  class="home-btn">
			<u-button type="primary" plain="true" text="去下单"  @click="goToOrder"></u-button>
		</view>
		<image class="home-image" src="../../static/home/home.png"></image>
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

<style lang="scss" scoped>
	.pre_order_page {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		height: 100vh!important;
	} 
	.home-image{
		height: 100%;
		width: 100%;
	}
	.home-btn{
		padding: 0 20px;
		position: absolute;
		bottom: 30px;
		width: 100%;
		box-sizing: border-box;
	}
	/deep/.u-button--plain.u-button--primary{
		color: #bb6664  !important;
		border-color: #bb6664;
	}
</style>