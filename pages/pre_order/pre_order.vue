<template>
	<view class="pre_order_page">
    <image style="width: 100%" src="@/static/home/home.png"></image>
    <view class="order-box">
      <view class="padding">请认真填写订单信息以便陪诊人更准确准时的服务</view>
      <view class="home-btn">
        <u-button  @click="goToOrder" shape="circle" color="#44af9b"  text="点击下单"></u-button>
      </view>
    </view>

    <u-notice-bar  color="#44af9b"
                   bgColor="#ecf7f5" :text="noticeText"></u-notice-bar>
    <view class="margin">
      <u-swiper
          :list="swiperList"
      ></u-swiper>
    </view>

<!--		<image class="home-image" src="https://junzean.com.cn/images/Homepage.png"></image>-->
	</view>
</template>

<script>
	export default {
		data() {
			return {
        swiperList:[
          '@/static/home.png',
          'https://cdn.uviewui.com/uview/swiper/swiper2.png',
          'https://cdn.uviewui.com/uview/swiper/swiper3.png',
        ],
        noticeText:'如有疑问，请联系客服电话17355071759'
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
	//.pre_order_page {
	//	display: flex;
	//	flex-direction: column;
	//	align-items: center;
	//	justify-content: center;
	//	height: 100vh!important;
	//}
	//.home-image{
	//	height: 100%;
	//	width: 100%;
	//}
	.home-btn{
		padding: 0 20px;
		//position: absolute;
		//bottom: 30px;
		//width: 100%;
		//box-sizing: border-box;
    margin: 20rpx 0;
		font-size: 44rpx;
		font-weight: bold;
	}
	///deep/.u-button--plain.u-button--primary{
	//	color: #bb6664  !important;
	//	border-color: #bb6664;
	//}
  .padding{
    padding: 20rpx;
  }
  .margin{
    margin: 20rpx;
  }
  .color{
    background: rgba(68,175,155,0.1);
  }
  .order-box{
    background: white;
    width: 100%;
    position: relative;
    bottom: 25px;
    z-index: 99;
  }
</style>