<template>
	<view class="order_list_container">
		<div class="order_list_header">
			<u-sticky @fixed="true"><u-search v-model="searchParams" :showAction="true" actionText="搜索"
					:animation="true" @search="getOrderList(this.searchParams)"
					placeholder="搜索我的订单"></u-search></u-sticky>

		</div>
		<div class="order_list_body" :style="{paddingBottom: batchOperateShow ? '50px' : 'initial'}">
			<u-list scrollable @scrolltolower="scrollToBottom">
				<u-list-item v-for="(item, index) in listData" :key="index" class="list_item">
					<div class="batch_selection">
						<u-checkbox-group>
							<u-checkbox v-if="batchOperateShow == true" @change="selectionChange(item)"
								activeColor="#ff565d" size="14" :disabled="!item.isDelete"></u-checkbox>
						</u-checkbox-group>
					</div>
					<div class="list_item_container">
						<div class="list_item_header">
							<div class="list_item_header_left">
								<div class="list_item_header_name">{{item.address}}</div>
								<u-icon name="arrow-right"></u-icon>
							</div>
							<div class="list_item_header_right">
								{{item.orderStatusDesc}}
							</div>
						</div>
						<div class="list_item_body">
							<div class="list_item_detail">
								<div class="list_item_detail_time">下单时间：{{item.startTimeText}}-{{item.endTimeText}}
								</div>
								<div class="list_item_detail_price">￥{{item.price}}</div>
							</div>
						</div>
						<div class="list_item_footer">
							<div class="list_item_footer_left">
								<u-button type="error" shape="circle" v-if="item.isDelete" size="mini"
									@click="openSingleModel(item.orderId)">删除订单</u-button>
								<u-button type="error" shape="circle" v-else ize="mini" @click="cancelOrder(item)">取消订单</u-button>

							</div>
							<div class="list_item_footer_right">
								<u-button type="primary" shape="circle" @click="getOrderDetail(item)" size="mini">详情</u-button>
							</div>
						</div>
					</div>
				</u-list-item>
				<view class="batch_operate_area" v-if="batchOperateShow == true">
					<u-button type="error" :plain="true" shape="circle" size="mini"
						@click="this.batchDeleteOrderTipsShow = true">批量删除</u-button>
				</view>
				<u-loadmore :status="status" />
			</u-list>
			<!-- <u-empty v-if="listData.length" mode="list"></u-empty> -->
		</div>
<!-- 		<view class="batch_operate_button" @click="this.batchOperateShow = !this.batchOperateShow">
			{{this.batchOperateAreaText()}}</view>
		<u-toast ref="uToast"></u-toast> -->
		<u-modal :show="deleteOrderTipsShow" title="提示" content='确认删除该订单吗' :showCancelButton="true"
			@confirm="confirmDeleteOrder()" @cancel="cancelDeleteOrder()"></u-modal>
		<u-modal :show="batchDeleteOrderTipsShow" title="提示" content='确认批量删除订单吗' :showCancelButton="true"
			@confirm="confirmDeleteOrder()" @cancel="cancelDeleteOrder()"></u-modal>
	</view>
</template>

<script>
	import {
		request
	} from '../../utils'
	export default {
		data() {
			return {
				searchParams: "",
				listData: [],
				batchOperateShow: false,
				currentDeleteIds: [],
				deleteOrderTipsShow: false,
				batchDeleteOrderTipsShow: false,
				page: 1,
				pageSize: 10,
				status: "nomore",
				total: 0
			}
		},
		onShow() {
			this.getOrderList()
		},
		watch: {
			batchOperateShow: {
				handler(val, oldVal) {
					this.batchOperateShow = val
				}
			}
		},
		methods: {
			// throttle(fn, wait) {
			// 	let lastTime = 0;
			// 	// 上次执行时间 
			// 	return function(...args) {
			// 		const now = new Date().getTime();
			// 		// 当前时间 
			// 		if (now - lastTime >= wait) {
			// 			fn.apply(this, args);
			// 			// 执行函数 
			// 			lastTime = now;
			// 			// 更新上次执行时间 
			// 		}
			// 	};
			// },
			scrollToBottom() {
				console.log('this.total', this.total);
				console.log('this.listData', this.listData);
				setTimeout(() => {
					if (this.total < this.listData.length) {
						return
					}
					this.status = 'loading'
					this.page += 1
					this.getOrderList()
				}, 1000)
			},
			openSingleModel(item) {
				this.deleteOrderTipsShow = true;
				this.currentDeleteIds = [];
				this.currentDeleteIds.push(item)
			},
			confirmDeleteOrder() {
				this.deleteOrderTipsShow = false
				this.deleteOrder(this.currentDeleteIds)
			},
			cancelDeleteOrder(item) {
				this.deleteOrderTipsShow = false
			},
			batchOperateAreaText() {
				return this.batchOperateShow ? '完成' : '管理'
			},
			async getOrderList(params) {
				const res = await request({
					url: "api/get/order/list",
					method: "GET",
					data: {
						pageSize: 10,
						pageNo: this.page,
						keyword: params ? params : ''
					}
				})
				if (res.data.status !== 0) {
					this.$refs.uToast.show({
						message: res.data.message
					})
					return
				}
				if (this.page == 1) {
					this.listData = res.data.data
					this.total = res.data.total
				} else {
					console.log('data', this.listData);
					this.listData = this.listData.concat(res.data.data)
					this.status = 'nomore'
				}
				console.log('this.listData', this.listData);

			},
			async getOrderDetail(item) {
				const {
					orderId
				} = item
				const res = await request({
					url: "api/get/order/detail",
					method: "GET",
					data: {
						orderId
					}
				})
				uni.navigateTo({
					url: `/pages/order_detail/order_detail?orderId=${orderId}`
				})
			},
			async cancelOrder(item) {
				const {
					orderId,
					pay_id
				} = item
				const res = await request({
					url: "api/cancel/order",
					method: "PUT",
					data: {
						orderId,
						pay_id
					}
				})
				if (res.data.status !== 0) {
					this.$refs.uToast.show({
						message: res.data.message
					})
					return
				}
				uni.reLaunch({
					url: '/pages/order_list/order_list'
				})
				this.getOrderList()
			},
			async deleteOrder(item) {
				const orderIds = item instanceof Array ? item : [item]
				const res = await request({
					url: "api/batch/delete/order",
					method: "POST",
					data: {
						orderIds
					}
				})
				if (res.data.status !== 0) {
					this.$refs.uToast.show({
						message: res.data.message
					})
					return
				}
				uni.reLaunch({
					url: '/pages/order_list/order_list'
				})
				// this.getOrderList()
			},
			selectionChange(item) {
				if (item.isDelete) {
					this.currentDeleteIds.push(item.orderId)
				}
			}
		},
	}
</script>

<style lang="scss">
	.order_list_container {
		height: calc(100vh - 44px) !important;

		.order_list_header {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 8px;

			.u-form {
				width: 100%;

				.u-form-item__body__right__content__slot {
					display: flex;
					flex-direction: row;
					align-items: center;
				}

				.search_button {
					margin-left: 12px;
				}
			}
		}

		.order_list_body {
			position: relative;
			background-color: #f2f2f2;
			margin-bottom: 50px;

			.list_item_container {
				width: 100%;
			}

			.u-list-item {
				border-radius: 4px;
				background-color: #fff;
				margin: 8px;
				padding: 8px;
				display: flex;
				align-items: center;
				flex-direction: row;

				.list_item_header {
					font-size: 12px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 10px;

					.list_item_header_left {
						display: flex;
						align-items: center;
					}

					.list_item_header_right {
						color: #434343;
					}
				}

				.list_item_body {
					display: flex;
					align-items: center;
					margin-bottom: 10px;
					min-height: 28px;

					.list_item_advantar {
						width: 64px;
						height: 64px;
						font-size: 22px;
					}

					.list_item_detail {
						width: 100%;
						display: flex;
						justify-content: space-between;

						.list_item_detail_time {
							font-size: 10px;
						}

						.list_item_detail_price {
							font-size: 14px;
							font-weight: 500;
						}
					}
				}

				.list_item_footer {
					display: flex;
					justify-content: space-between;
					font-size: 12px;
				}
			}
		}

		.batch_operate_button {
			width: 48px;
			height: 48px;
			border-radius: 50%;
			background-color: #ff565d;
			position: fixed;
			bottom: 100px;
			right: 20px;
			color: #fff;
			font-weight: 500;
			display: flex;
			align-items: center;
			justify-content: center;
			font-size: 12px;
		}

		.batch_operate_area {
			width: 100%;
			height: 40px;
			display: flex;
			align-items: center;
			justify-content: flex-end;
			position: fixed;
			bottom: 0;
			left: 0;
			background-color: #fff;
			border-radius: 4px;

			.u-button {
				margin-left: 70%;
				margin-right: 10%;
			}
		}

		// .u-empty {
		// 	margin-top: 50px !important;
		// }
	}
</style>