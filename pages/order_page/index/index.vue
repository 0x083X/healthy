<template>
	<view>
		<view class="order_container">
			<!-- 日期时间展示 -->
			<map id="myMap" style="width: 100%; height: 300px;" :latitude="latitude"
				:longitude="longitude" :markers="markers" show-location
				@tap="getLocationInfo()"></map>
			<!-- start -->
			<u--form labelPosition="left" :model="formData" ref="form" style="padding: 8px;">
				<u-form-item label="联系电话" prop="userPhone" borderBottom label-position="top" label-width="100%"
					style="margin-top: 8px;">
					<u-input v-model="formData.userPhone" border="none" placeholder="请输入联系电话"></u-input>
				</u-form-item>
				<u-form-item label="年龄" prop="userAge" borderBottom label-position="top" label-width="100%"
					style="margin-top: 8px;">
					<u-input v-model="formData.userAge" border="none" placeholder="请输入年龄"></u-input>
				</u-form-item>
				<u-form-item label="请选择预约开始时间" prop="startTime" borderBottom label-position="top" label-width="100%"
					style="margin-top: 8px;" @click="showStartTimeBoard">
					<u-input v-model="formData.startTime" disabled disabledColor="#ffffff" placeholder="请输入就诊时间"
						border="none"></u-input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="请选择预约结束时间" prop="endTime" borderBottom label-position="top" label-width="100%"
					style="margin-top: 8px;" @click="endTimeShow = true; hideKeyboard()">
					<u-input v-model="formData.endTime" disabled disabledColor="#ffffff" placeholder="请输入就诊时间"
						border="none"></u-input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="陪诊人性别" prop="requireGender" borderBottom label-position="top" label-width="100%">
					<u-radio-group v-model="requireGender" placement="row" @change="changeGender">
						<u-radio :customStyle="{marginRight: '12px', marginTop: '8px'}"
							v-for="(item, index) in sexArray" :key="item.value" :label="item.name" :name="item.value">
						</u-radio>
					</u-radio-group>
				</u-form-item>
				<u-form-item label="需求说明" prop="userDescription" borderBottom label-position="top" label-width="100%">
					<u-input type="textarea" v-model="formData.userDescription" placeholder="请输入您的需求" :border="false"
						:maxlength="100" height="200"></u-input>
				</u-form-item>
				<u-form-item label="如何联系您" prop="contact" borderBottomss @click="showcontactWay = true; hideKeyboard()"
					label-position="top" label-width="100%">
					<u-input v-model="contactItem" disabled disabledColor="#ffffff" placeholder="请选择如何联系您"
						border="none"></u-input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="就诊人特殊情况以及特殊要去说明" prop="risk_content" borderBottom ref="item2" label-position="top"
					label-width="100%">
					<u-input type="textarea" v-model="formData.risk_content" placeholder="例如:老人或者幼童,或者患者有传染可能"
						:border="false" :maxlength="100" height="200"></u-input>
				</u-form-item>
			</u--form>
			<!-- end -->
			<u-action-sheet :show="showcontactWay" :actions="contactWayArray" title="请选择如何联系您"
				@close="showcontactWay = false" @select="contactWaySelect">
			</u-action-sheet>
			<!-- 初始时间选择 -->
			<u-datetime-picker :show="startTimeShow" :minDate="initTime" mode="datetime" :formatter="setFormatter"
				@confirm="handleSelectStartTime"></u-datetime-picker>
			<!-- 结束时间选择 -->
			<u-datetime-picker :show="endTimeShow" :minDate="initTime" mode="datetime" :formatter="setFormatter"
				@confirm="handleSelectEndTime"></u-datetime-picker>
			<!-- 加急单展示 -->
			<u-modal :show="urgentOrderShow" title="订单提示" confirmText="确认"
				@confirm="this.urgentOrderShow = false">
				<view>当前订单为{{ isUprentScope ? "加急订单" : "预约订单" }} 订单金额为{{ Number(totalPrice)/100 }}元</view>
			</u-modal>
			<!-- 订单信息二次提示 -->
			<u-modal :show="orderDetailShow" title="订单提示" confirmText="去支付" cancelText="取消" :showCancelButton="true" @confirm="submit" @cancel="orderDetailShow = false">
				<view>您在{{ formData.startTime }}-{{ formData.endTime }}在合肥市人民第一医院
					预定了时长为{{ duration }}小时 金额为{{ Number(totalPrice)/100 }}元的{{ isUprentScope ? '加急订单' : '预约订单' }}</view>
			</u-modal>
			<!-- 错误提示 -->
			<u-toast ref="uToast"></u-toast>
			<u-button type="primary" text="提交" customStyle="margin-top: 50px" @click="this.orderDetailShow = true"></u-button>
		</view>
	</view>
</template>


<script>
	import wxmini from '../../../mixins/wxmini'
	import {
		request
	} from '../../../utils'
	export default {
		mixins: [wxmini],
		data() {
			return {
				// 表单数据
				formData: {
					userPhone: '',
					userAge: '',
					datetime: '',
					startTime: '',
					endTime: '',
					requireGender: 1,
					userDescription: '',
					contact: 0,
					risk_content: '',
					address: '合肥市第一人民医院',
				},
				city: '',
				showcontactWay: false,
				sexArray: [{
						name: '男',
						value: 1
					},
					{
						name: '女',
						value: 2
					},
					{
						name: '不限',
						value: 0
					},
				],
				requirementArray: [{
						name: '医院检查',
						value: 0
					},
					{
						name: '挂号打点滴',
						value: 1
					},
					{
						name: '小型手术陪护',
						value: 2
					},
					{
						name: '住院陪护',
						value: 3
					},
				],
				contactWayArray: [{
						name: '电话联系',
						value: 0
					},
					{
						name: '微信联系',
						value: 1
					},
					{
						name: '按时到达地点之后联系',
						value: 2
					},
				],
				// 标记点
				markers: [{
					id: 1,
					latitude: 31.8531187,
					longitude: 117.2550177,
					name: '',
					width: '25',
					height: '25',
				}],
				// 需求说明
				requirementValue: '',
				// 其他需求说明
				otherRequirementValue: '',
				// 初始时间选择展示条件
				startTimeShow: false,
				// 结束时间选择展示条件
				endTimeShow: false,
				// 当前时间值初始化
				initTime: 0,
				// 订单是否加急
				isUprentScope: false,
				// 当前订单金额
				totalPrice: 0,
				// 订单提示弹窗展示
				urgentOrderShow: false,
				// 订单预定持续时间
				duration: 0,
				// 二次确认订单持续时间确认
				orderDetailShow: false,
				// 跳转支付页面传递参数
				message: {},
				// 地图经度
				latitude: '',
				// 地图纬度
				longitude: ''
			}
		},
		onLoad() {
			this.initTime = this.formatTimestampDelay()
			this.getLocationInfo()
		},
		computed: {
			contactItem() {
				const index = this.contactWayArray.findIndex(item => item.value === this.formData.contact)
				return this.contactWayArray[index].name
			},
		},
		methods: {
			// 时间戳转日期
			formatTimestamp(timestamp) {
				let date = new Date(timestamp);
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				let hour = date.getHours();
				return year + '-' + month + '-' + day + ' ' + hour + ':00:00';
			},
			// 初始化时间推迟一小时
			formatTimestampDelay() {
				var date = new Date();
				var date1 = new Date().getTime(); // 获取当前时间戳

				// 当前时间戳+3600s（一小时，其他时间通过计算时间戳进行相应加减），重新设置 Date 对象
				return date.setTime(date1 + 3600000);
			},
			// 日期转时间戳
			formatTimestampString(time) {
				let date = new Date(time)
				return date.getTime()
			},
			getLocationInfo() {
				let that = this;
				uni.getLocation({
					type: "gcj02",
					success: function(data) {
						let latitude = data.latitude;
						let longitude = data.longitude;
						that.latitude = latitude
						that.longitude = longitude
						that.markers = [{
							id: 1,
							latitude,
							longitude,
							iconPath: '../../../static/img/pos.png',
							width: '20',
							height: '20',
						}]
						that.circles = [{ //在地图上显示圆
							latitude,
							longitude,
							fillColor: "#D9E6EF", //填充颜色
							color: "#A7B6CB", //描边的颜色
							radius: 50, //半径
							strokeWidth: 2 //描边的宽度
						}]
					}
				});
			},
			chooseLocationInfo(){
				let that = this;
				uni.getLocation({
					type: "gcj02",
					success: function(data) {
						let latitude = data.latitude;
						let longitude = data.longitude;
						// that.markers = [{
						// 	id: 1,
						// 	latitude,
						// 	longitude,
						// 	iconPath: '../../../static/img/pos.png',
						// 	width: '20',
						// 	height: '20',
						// }]
						// that.circles = [{ //在地图上显示圆
						// 	latitude,
						// 	longitude,
						// 	fillColor: "#D9E6EF", //填充颜色
						// 	color: "#A7B6CB", //描边的颜色
						// 	radius: 50, //半径
						// 	strokeWidth: 2 //描边的宽度
						// }]
						// 选择定位
						uni.chooseLocation({
							latitude,
							longitude,
							success: function(res) {
								that.place = res;
								var add_data = that.addressard(res.address);
								that.formData.positionData = {
									...add_data,
									latitude: res.latitude,
									longitude: res.longitude
								}
							}
						});
					}
				});
			},
			changeGender(val) {
				this.formData.requireGender = val
			},
			reuquirementSelect(e) {
				this.formData.userDescription = e.value
				this.$refs.form.validateField('formData.requiement')
			},
			contactWaySelect(e) {
				this.formData.contact = e.value
				this.$refs.form.validateField('formData.contactWay')
			},
			hideKeyboard() {
				uni.hideKeyboard()
			},
			showStartTimeBoard() {
				this.initTime = this.formatTimestampDelay()
				this.startTimeShow = true
				this.hideKeyboard()
			},
			showEndTimeBoard() {
				this.initTime = this.formatTimestampDelay()
				this.endTimeShow = true
				this.hideKeyboard()
			},
			handleSelectStartTime(time) {
				this.formData.startTime = this.formatTimestamp(time.value)
				this.startTimeShow = false
			},
			handleSelectEndTime(time) {
				if (!this.formData.startTime) {
					this.$refs.uToast.show({
						message: '请先选择订单开始时间'
					})
				}
				this.formData.endTime = this.formatTimestamp(time.value)
				this.endTimeShow = false
				// 展示订单详情
				this.handleCheckOrderStatus()
			},
			async handleCheckOrderStatus() {
				const {
					startTime,
					endTime
				} = this.formData
				const startTimeStamp = this.formatTimestampString(startTime)
				const endTimeStamp = this.formatTimestampString(endTime)
				const detail = await request({
					url: "api/get/duration/price",
					method: "GET",
					data: {
						startTime: startTimeStamp,
						endTime: endTimeStamp,
					}
				})
				this.isUprentScope = detail.data.data.isUprentScope
				this.totalPrice = detail.data.data.totalPrice
				this.duration = detail.data.data.duration
				this.urgentOrderShow = true
			},
			setFormatter(type, value) {
				if (type === 'year') {
					return `${value}年`
				}
				if (type === 'month') {
					return `${value}月`
				}
				if (type === 'day') {
					return `${value}日`
				}
				if (type === 'hour') {
					return `${value}时`
				}
				if (type === 'minute') {
					return `${value}分`
				}
				return value
			},
			async submit() {
				// 格式化时间
				const formData = {
					...this.formData,
					startTime: this.formatTimestampString(this.formData.startTime),
					endTime: this.formatTimestampString(this.formData.endTime)
				}
				const res = await request({
					url: 'api/create/order',
					method: 'POST',
					data: formData
				})
				const message = res?.data?.data
				if (message) {
					message.orderID = message.package
					message.totalPrice = this.totalPrice
					this.message = message
					uni.navigateTo({
						url: '/pages/pay_page/pay_page',
						success: d => {
							// 当前页面的数据→传→被打开页面
							d.eventChannel.emit('toOpenedPage', this.message);
						}
					})
				}
			},
		}
	}
</script>

<style>
	.form {
		padding: 0 8px;
	}

	.u-form-item__body {
		margin-top: 8rpx;
		padding: 8px;
	}
</style>