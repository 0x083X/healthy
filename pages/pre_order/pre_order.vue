<template>
  <view class="pre_order_page">
    <image style="width: 100%" src="@/static/home/home.png"></image>
    <view class="order-box">
      <view class="order-item">
        <view class="padding text-868686">请认真填写订单信息以便陪诊人更准确准时的服务</view>
        <view class="home-btn">
          <u-button @click="goToOrder" shape="circle" color="#44af9b" text="点击下单"></u-button>
        </view>
      </view>

    </view>

    <u-notice-bar color="#44af9b"
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
      swiperList: [
        '@/static/home.png',
        'https://cdn.uviewui.com/uview/swiper/swiper2.png',
        'https://cdn.uviewui.com/uview/swiper/swiper3.png',
      ],
      noticeText: '如有疑问，请联系客服电话17355071759'
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
  //display: flex;
  //flex-direction: column;
  //align-items: center;
  //justify-content: center;
  height: 100vh !important;
  background-color: #F6F6F6;
}

//.home-image{
//	height: 100%;
//	width: 100%;
//}
.home-btn {
  //position: absolute;
  //bottom: 30px;
  //width: 100%;
  //box-sizing: border-box;
  font-size: 44rpx;
  font-weight: bold;
}

///deep/.u-button--plain.u-button--primary{
//	color: #bb6664  !important;
//	border-color: #bb6664;
//}
.padding {
  padding: 20rpx;
}

.margin {
  margin: 20rpx;
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
.text-868686{
  color: #868686;
  font-size: 28rpx;
}
</style>