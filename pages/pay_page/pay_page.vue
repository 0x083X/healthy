<template>
	<view class="container">
		<header class="header">
			<view class="header-text">
				请支付
			</view>
			<view class="header-amount">
				{{ Number(payOrderDetail.totalPrice)/100 }}元
			</view>
		</header>
		<main class="main">
			<pay-type :payTypeConfig="payTypeConfig" :autoChoose="chooseMethod"></pay-type>
		</main>
		<footer class="footer">
			<u-button type="success" @click="wxPay(payOrderDetail)">去支付</u-button>
		</footer>
	</view>
</template>

<script>
	import PayType from '../../component/PayType.vue'
	import payTypeConfig from '../../utils/payTypeConfig'
	import wxmini from '../../mixins/wxmini'
	export default {
		onLoad(option) {
			this.getOpenerEventChannel().on('toOpenedPage', data =>{
				this.payOrderDetail = data
			})
		},
		components: {
			PayType,
			chooseMethod: '微信支付'
		},
		mixins: [ wxmini ],
		data() {
			return {
				payTypeConfig,
				payOrderDetail: {},
			}
		},
		methods: {
			
		},
		
	}
</script>

<style lang="scss">
	
.container {
	display: flex;
	flex-direction: column;
	padding: 20px;
	height: 100%;
	box-sizing: border-box;
}
.header {
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
	height: 150px;
	&-text {
		font-size: 20px;
		font-weight: bold;
	}
	&-amount {
		margin-top: 10px;
		font-size: 14px;
		color: #999;
	}
}
	
.main {
	flex: 1;
}
.footer {
	height: 50px;
}
</style>
