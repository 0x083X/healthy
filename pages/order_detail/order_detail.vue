<template>
	<view class="detail">
		<view class="detail-container">
			<view class="detail-container-header">
				<view class="detail-container-header-main">
					<view class="detail-container-header-main-tip">
						订单信息
					</view>
					<u-tag class="detail-container-header-main-status" :type="orderStatusMap[detail.orderStatus].type" :text="orderStatusMap[detail.orderStatus].tip" size="mini">
					</u-tag>
				</view>
				<view class="detail-container-header-sub" v-if="detail.orderStatus === 0">
					<u--text text="订单剩余时间" class="detail-container-header-sub-tip" type="warning" size=12>
					</u--text>
					<view class="detail-container-header-sub-time">
						<u-count-down :time="detail.expiredTime - new Date().getTime()" format="mm:ss" @finish="cancelOrderFn"></u-count-down>
					</view>
				</view>
			</view>
			<view class="detail-container-message">
				<view class="detail-container-message-box" v-for="item in showDetail" :key="item.key">
					<view class="detail-container-message-box-label">
						{{ item.label }}
					</view>
					<view class="detail-container-message-box-value">
						{{ item.value }}
					</view>
				</view>
			</view>
		</view>
		<view class="detail-footer">
			<view class="detail-footer-fee">
				<view class="detail-footer-fee-tip">
					订单金额:
				</view>
				<view class="detail-footer-fee-amount">
					￥{{ orderPrice }}
				</view>
			</view>
			<view class="detail-footer-btns">
				<u-button type="success" :loading="loading" :customStyle="btnGetCode" @click="pay" v-if="payOrderBtnShow" size="mini" >去支付</u-button>
				<u-button type="warning" :loading="loading" :customStyle="btnGetCode" @click="payAgain" v-if="buyAgainOrderBtnShow" size="mini" >再次购买</u-button>
				<u-button type="error" :loading="loading" :customStyle="btnGetCode" @click="deleteOrder(detail.orderId)" v-if="deleteOrderBtnShow" size="mini" >删除订单</u-button>
				<u-button type="error" :loading="loading" :customStyle="btnGetCode" @click="cancelOrderFn" v-else size="mini" >取消订单</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	import wxmini from '../../mixins/wxmini'
	import order from '../../mixins/order'
	import  { detailShowMap, detailValueMap, orderStatusMap, detailMap, transValue } from '../../utils/detailFilter.js'
	export default {
		mixins: [ wxmini, order ],
		computed: {
				
			orderPrice() {
				// 支付成功时选择实际支付金额
				console.log('price')
				return this.detail.orderStatus === 1 ? this.detail.actualPayment : this.detail.price 
			},
			// 删除订单按钮显隐逻辑
			deleteOrderBtnShow() {
				console.log('cancel')
				return this.detail.isDelete
			},
			// 再次购买按钮显隐逻辑
			buyAgainOrderBtnShow() {
				console.log('buy')
				return this.detail.orderStatus !== 0
			},
			// 去支付按钮显隐逻辑
			payOrderBtnShow() {
				console.log('pay')
				return this.detail.orderStatus === 0
			}
		},
		data() {
				
			return {
				detail: {}, // 订单所有的信息
				showDetail: {}, // 页面上展示的订单信息
				loading: false,// 按钮loading
				btnGetCode: {
					borderRadius: '7px',//驼峰命名注意----这里如果不规范，会整体失效,px，rpx作为单位都可以,一定要有引号
					width: '60px',
					marginRight: '5px'
				},
				orderStatusMap, // 订单状态
				timer: null, // 时钟
				time: 0, // 过期时间
				orderId: 0,
			}
		},
		onLoad(options) {
			console.log(options.orderId, '12')
			this.orderId = options.orderId
			this.getOrderDetail(options.orderId)
		},
		methods: {
			cancelOrderFn() {
				this.cancelOrder({orderId: this.detail.orderId, pay_id: this.detail.pay_id}, `/pages/order_detail/order_detail?orderId=${this.orderId}`)
			},
			pay() {
				this.$request({
					url: "api/keep/pay/order",
					method: 'POST',
					data: {
						orderId: this.detail.id,
						pay_id: this.detail.pay_id
					}
				}).then(res => {
					if (res.data.status === 1) {
						uni.showToast({
							title: res.data.message,
							icon: 'none'
						})
						return
					}
					const msg = res.data
					msg.data.orderID = msg.data.package
					this.wxPay(msg.data)
				}).catch(err => {
					console.log(err)
				})
			},
			// 再次购买
			payAgain() {
				uni.redirectTo({
					url: '/pages/order_page/order_page'
				})
			},
			filterOrderDetail() {
				console.log(this.detail, 'detail')
				const showDetailArr = detailShowMap[this.detail.orderStatus]
				console.log(showDetailArr)
				const array = Object.entries(this.detail).filter(item => {
					return showDetailArr.includes(item[0])
				})
				console.log(array)
				this.showDetail = array.map(arrItem => {
					const key = arrItem[0]
					const value = arrItem[1]
					return {
						key,
						value: transValue(key, value),
						label: detailValueMap[key]
					}
				})
				console.log(this.showDetail)
			},
			// 赋值方法
			setData(target, data) {
				if (!data) return	
				for(const key in data) {
					this.$set(target, key, data[key])
				}
				this.$forceUpdate()
			},
			getOrderDetail(orderId) {
				// 如果没有id就报错
				if (!orderId) {
					uni.showToast({
						title: '缺少订单参数',
						icon: 'none'
					})
					return
				}
					
				this.$request({
					url: 'api/get/order/detail',
					method: 'GET',
					data: {
						orderId
					}
				}).then(res => {
					this.setData(this.detail, res?.data?.data)
					this.filterOrderDetail()
					console.log(this.detail)
				}).catch(err => {
					
				})
			}
		}
	}
	
</script>

<style lang="scss" scoped>
		
	.detail {
		display: flex;
		flex-direction: column;
		// height: 100%;
		background-color: #eee;
		&-container {
			flex: 1;
			display: flex;
			flex-direction: column;
			margin: 20px;
			padding: 20px;
			border-radius: 20px;
			background-color: #fff;
				
			&-header {
				display: flex;
				flex-direction: column;
				&-main {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding-bottom: 8px;
					border-bottom: 1px solid #eee;
					// line-height: 30px;
					height: 30px;
					&-tip {
						font-weight: bold;
						font-size: 16px;
					}
				}
				&-sub {
					display: flex;
					justify-content: space-between;
					align-items: center;
					padding: 8px 0;
					border-bottom: 1px solid #eee;
					// line-height: 30px;
					height: 30px;
				}
			}
				
			&-message {
				display: flex;
				flex-direction: column;
				padding: 5px 0 20px;
				&-box {
					display: flex;
					justify-content: space-between;
					align-items: center;
					height: 40px;
					border-bottom: 1px solid #eee;
					&-label {
						font-size: 12px;
						color: #a6a6a6;
						margin-right: 5px;
					}
					&-value {
						font-size: 14px;
					}
				}
			}
		}
		&-footer {
			display: flex;
			justify-content: space-between;
			align-items: center;
			padding: 0 20px;
			height: 50px;
			background-color: #fff;
				
			&-fee {
				display: flex;
				align-items: center;
				&-tip {
					font-size: 12px;
				}
				&-amount {
					font-weight: bold;
				}
			}
			&-btns {
				display: flex;
				// flex: 1;
				// justify-content: flex-start;
				// &-pay {
				// 	height: 10px;
				// }
			}
		}
	}
</style>