<template>
	<view class="pre_order_page">
		<barrage-list class="barrage" ref="barrageList"></barrage-list>
		<image style="width: 100%" :src="homeImage"></image>
		<view class="order-box">
			<view class="order-item">
				<view class="padding text-868686">请认真填写订单信息以便陪诊人更准确准时的服务</view>
				<view class="home-btn">
					<u-button @click="goToOrder" shape="circle" color="#44af9b" text="点击下单"></u-button>
				</view>
			</view>

		</view>

		<u-notice-bar color="#44af9b" bgColor="#ecf7f5" :text="noticeText"></u-notice-bar>
		<swiper autoplay circular indicator-dots class="swiper">
				<swiper-item v-for="(item,index) in swiperList" :key="index">
					<image :src="item" mode="widthFix"></image>
				</swiper-item>
		</swiper>
    <image class="poster" :src="homeImage1"></image>

    <view class="send-barrage">
			<input placeholder="善语结善缘" v-model="content" maxlength="20" placeholder-style="color: #fff;"></input>
			<button @click="sendBarrage">发送</button>
		</view>
	</view>
</template>

<script>
	import BarrageList from '../../components/BarrageList.vue'
	import { request } from '../../utils'
	export default {
		data() {
			return {
				swiperList: [1, 2, 3, 4, 5].map(m => this.$domain + `images/swiper/swiper${m}.png`),
				noticeText: '如有疑问，请联系客服电话17355071759',
				homeImage: this.$domain + 'images/home/home.png',
        homeImage1: this.$domain + 'images/home/poster2.0.jpg',
				content: '',
			}
		},
		components: {
			BarrageList,
		},
		methods: {
			goToOrder() {
				uni.navigateTo({
					url: "/pages/order_page/order_page"
				})
			},
			// 发送弹幕
			sendBarrage() {
				if (!this.content) return
				const data = {
					content: this.content
				}
				request({
					url: 'api/add/barrage',
					data,
					method: 'POST'
				}).then(res => {
					if (res.data.status === 0) {
						uni.showToast({
							icon: 'none',
							title: res.data.message
						})
						this.$refs.barrageList.addDanmu(this.content, true)
						this.content = ''
					} else {
						uni.showToast({
							icon: 'error',
							title: res.data.message
						})
					}
				})
			}
		},
    onLoad() {
      console.log(this.swiperList)
    },
	}
</script>

<style lang="scss" scoped>
	.barrage {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
	}

	.send-barrage {
		display: flex;
		align-items: center;
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 100rpx;
		font-size: 30rpx;
		box-sizing: border-box;
		padding: 0 20rpx;
		box-shadow: 0 10px rgba(0, 0, 0, .5);

		input {
			flex: 1;
			height: 70rpx;
			border-radius: 20rpx;
			background-color: #44af9b;
			padding: 0 20rpx;
			color: #fff;
		}

		button {
			height: 70rpx;
			width: 140rpx;
			line-height: 70rpx;
			border-radius: 20rpx;
			margin-left: 20rpx;
			font-size: 30rpx;
			border: 1px solid #44af9b;
			background-color: #44af9b;
			color: #fff;

			&::after {
				border: none;
			}
		}
	}

	.swiper{
		margin: 40rpx 0 40rpx 0;
		image{
			height: 100%;
			width: 100%;
		}
	}

	.pre_order_page {
		//display: flex;
		//flex-direction: column;
		//align-items: center;
		//justify-content: center;
		height: 100vh !important;
		background-color: #F6F6F6;
	}

	.home-btn {
		//position: absolute;
		//bottom: 30px;
		//width: 100%;
		//box-sizing: border-box;
		font-size: 44rpx;
		font-weight: bold;
	}

	.padding {
		padding: 20rpx;
	}

	.color {
		background: rgba(68, 175, 155, 0.1);
	}

	.order-box {
		position: relative;
		height: 160rpx;

		.order-item {
			box-sizing: border-box;
			background: white;
			border-radius: 40rpx 40rpx 0 0;
			padding: 30rpx;
			width: 100%;
			position: absolute;
			bottom: 20rpx;
			z-index: 99;
		}
	}

	.text-868686 {
		color: #868686;
		font-size: 28rpx;
	}
  .poster{
    width: 100%;
    height: 200rpx;
  }
</style>