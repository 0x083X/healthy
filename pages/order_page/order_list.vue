<template>
	<view class="order_list_container">
		<div class="order_list_header">
			<u--form>
				<u-form-item prop="formData.searchParams" ref="search_input">
					<u--input v-model="formData.searchParams" placeholder="搜索我的订单" shape="circle"
						prefixIcon="search"></u--input>
					<div class="search_button" @click="getOrderList(formData.searchParams)">搜索</div>
				</u-form-item>
			</u--form>
		</div>
		<div class="order_list_body">
			<u-list scrollable>
				<u-list-item v-for="(item, index) in listData.data" :key="index" class="list_item">
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
						<div class="list_item_advantar">
							<!-- <img src="" alt="" /> -->
							我是头像
						</div>
						<div class="list_item_detail">
							<div class="list_item_detail_time">下单时间：{{item.startTimeText}}-{{item.endTimeText}}</div>
							<div class="list_item_detail_price">￥{{item.price}}</div>
						</div>
					</div>
					<div class="list_item_footer">
						<div class="list_item_footer_left">
							<u-button type="error" :plain="true" shape="circle" size="mini"
								@click="deleteOrder(item)">删除</u-button>
						</div>
						<div class="list_item_footer_right">
							<u-button type="warning" :plain="true" shape="circle" size="mini">详情</u-button>
						</div>
					</div>
				</u-list-item>
			</u-list>
		</div>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		request
	} from '../../utils'
	export default {
		data() {
			return {
				formData: {
					searchParams: ""
				},
				listData: {},
			}
		},
		onLoad() {
			this.getOrderList()
			console.log('this.listData.data', this.listData);
		},
		methods: {
			async getOrderList(params) {
				const res = await request({
					url: "api/get/order/list",
					method: "GET",
					data: {
						pageSize: 10,
						pageNumber: 1,
						keyword: params ? params : ''
					}
				})
				if (res.data.status !== 0) {
					this.$refs.uToast.show({
						message: res.data.message
					})
					return
				}
				this.listData = res.data
			},
			async deleteOrder(item) {
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
					console.log('res err',res);
					this.$refs.uToast.show({
						message: res.data.message
					})
					return
				}

				window.location.reload()
				this.getOrderList()
			},
		},
	}
</script>

<style lang="scss">
	.order_list_container {
		.order_list_header {
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0 8px 0 8px;

			.u-form {
				width: 100%;
				.u-form-item__body__right__content__slot{
					display: flex;
					flex-direction: row;
					align-items: center;
				}
				.search_button{
					margin-left: 12px;
				}
			}
		}

		.order_list_body {
			background-color: #e9e6e3;

			.u-list-item {
				border-radius: 4px;
				background-color: #fff;
				margin: 8px;
				padding: 8px;

				.list_item_header {
					font-size: 12px;
					display: flex;
					align-items: center;
					justify-content: space-between;
					margin-bottom: 4px;

					.list_item_header_left {
						display: flex;
						align-items: center;
					}
					.list_item_header_right{
						color: #434343;
					}
				}

				.list_item_body {
					display: flex;
					align-items: center;

					.list_item_advantar {
						width: 64px;
						height: 64px;
						font-size: 22px;
					}

					.list_item_detail {
						display: flex;

						.list_item_detail_time {
							font-size: 10px;
						}

						.list_item_detail_price {
							font-size: 12px;
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
	}
</style>