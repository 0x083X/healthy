<!-- 表单填写页 -->
<template>
	<view>
		<view class="order_container">
			<!-- 日期时间展示 -->
			<view class="map-area">
				<map id="myMap" v-if="latitude" style="width: 100%; height: 300px;" :latitude="latitude" :longitude="longitude"
					:markers="markers" min-scale="10" @markertap="handleTapMarker" @tap="handleTapMap"></map>
				<view class="current-hospital" v-if="!!currentHospital && showCurrentHospital">
					<view class="name">{{currentHospital.hospitalName}}</view>
					<view class="tags" v-if="currentHospital.tags.length">
						<view class="tag" v-for="(item,index) in currentHospital.tags" :key="index">{{item}}</view>
					</view>
				</view>
			</view>
			<!-- start -->
			<div class="form_container">
				<u--form labelPosition="left" :model="formData" ref="form">
					<u-form-item label="姓名" prop="userName" borderBottom label-position="top" label-width="100%"
						style="margin-top: 8px;">
						<u-input v-model="formData.userName" border="none" placeholder="请输入姓名"></u-input>
					</u-form-item>
					<u-form-item label="联系电话" prop="userPhone" borderBottom label-position="top" label-width="100%"
						style="margin-top: 8px;">
						<u-input v-model="formData.userPhone" border="none" placeholder="请输入联系电话"
							type="number"></u-input>
					</u-form-item>
					<u-form-item label="年龄" prop="userAge" borderBottom label-position="top" label-width="100%"
						style="margin-top: 8px;">
						<u-input v-model="formData.userAge" border="none" placeholder="请输入年龄" type="number"></u-input>
					</u-form-item>
					<u-form-item @click="showHospital = true; hideKeyboard()" label="就诊医院" prop="userAge" borderBottom
						label-position="top" label-width="100%" style="margin-top: 8px;">
						<u-input v-model="formData.address" disabled disabledColor="#ffffff" placeholder="请选择就诊医院"
							border="none"></u-input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="请选择预约开始时间" prop="startTime" borderBottom label-position="top" label-width="100%"
						style="margin-top: 8px;" @click="showStartTimeBoard()">
						<u-input v-model="formData.startTime" disabled disabledColor="#ffffff" placeholder="请输入就诊时间"
							border="none"></u-input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="请选择预约结束时间" prop="endTime" borderBottom label-position="top" label-width="100%"
						style="margin-top: 8px;" @click="showEndTimeBoard()">
						<u-input v-model="formData.endTime" disabled disabledColor="#ffffff" placeholder="请输入就诊时间"
							border="none"></u-input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="您希望陪诊人性别" prop="requireGender" borderBottom label-position="top"
						label-width="100%">
						<u-radio-group v-model="requireGender" placement="row" @change="changeGender">
							<u-radio :customStyle="{marginRight: '12px', marginTop: '8px'}"
								v-for="(item, index) in sexArray" :key="item.value" :label="item.name"
								:name="item.value">
							</u-radio>
						</u-radio-group>
					</u-form-item>
					<u-form-item label="需求说明" prop="userDescription" borderBottom label-position="top"
						label-width="100%">
						<u-input type="textarea" v-model="formData.userDescription" placeholder="请输入您的需求"
							:border="false" :maxlength="100" height="200"></u-input>
					</u-form-item>
					<u-form-item label="如何联系您" prop="contact" borderBottomss
						@click="showcontactWay = true; hideKeyboard()" label-position="top" label-width="100%">
						<u-input v-model="contactItem" disabled disabledColor="#ffffff" placeholder="请选择如何联系您"
							border="none"></u-input>
						<u-icon slot="right" name="arrow-right"></u-icon>
					</u-form-item>
					<u-form-item label="就诊人特殊情况以及特殊要去说明" prop="risk_content" borderBottom ref="item2"
						label-position="top" label-width="100%">
						<u-input type="textarea" v-model="formData.risk_content" placeholder="例如:老人或者幼童,或者患者有传染可能"
							:border="false" :maxlength="100" height="200"></u-input>
					</u-form-item>
				</u--form>
			</div>
			<!-- end -->
			<u-action-sheet :show="showcontactWay" :actions="contactWayArray" title="请选择如何联系您"
				@close="showcontactWay = false" @select="contactWaySelect">
			</u-action-sheet>

			<u-action-sheet class="scroll-view" :show="showHospital" :actions="hospitalList" title="请选择就诊医院"
				@close="showHospital = false" @select="hospitalSelect">
			</u-action-sheet>

			<!-- 初始时间选择 -->
			<u-datetime-picker :show="startTimeShow" :minDate="initTime" mode="datetime" :formatter="setFormatter"
				@confirm="handleSelectStartTime" @cancel="this.startTimeShow = false"
				:immediateChange="true"></u-datetime-picker>
			<!-- 结束时间选择 -->
			<u-datetime-picker :show="endTimeShow" :minDate="endTimeDate" mode="datetime" :formatter="setFormatter"
				@confirm="handleSelectEndTime" @cancel="this.endTimeShow = false"
				:immediateChange="true"></u-datetime-picker>

			<!-- 加急单展示 -->
			<u-modal :show="urgentOrderShow" title="订单提示" confirmText="确认" @confirm="this.urgentOrderShow = false">
				<view>当前订单为{{ isUprentScope ? "加急订单" : "预约订单" }} 订单金额为{{ Number(totalPrice)/100 }}元</view>
			</u-modal>
			<!-- 订单信息二次提示 -->
			<u-modal :show="orderDetailShow" title="订单提示" confirmText="去支付" cancelText="取消" :showCancelButton="true"
				@confirm="submit" @cancel="orderDetailShow = false">
				<view>您在{{formData.address}}
					<view>
						<view>于{{ formData.startTime }}-{{ formData.endTime }}预定了时长为{{ duration }}小时</view>
						<view>金额为{{ Number(totalPrice)/100 }}元的{{ isUprentScope ? '加急订单' : '预约订单' }}</view>
					</view>
				</view>
			</u-modal>
			<!-- 错误提示 -->
			<u-toast ref="uToast"></u-toast>
			<u-button type="primary" text="提交" customStyle="margin-top: 50px" @click="this.orderDetailShow = true"
				size="large"></u-button>
		</view>
	</view>
</template>


<script>
	import wxmini from '../../mixins/wxmini'
	import {
		request
	} from '../../utils'
	export default {
		mixins: [wxmini],
		data() {
			return {
				// 表单数据
				formData: {
					userName: '',
					userPhone: '',
					userAge: '',
					datetime: '',
					startTime: '',
					endTime: '',
					requireGender: 1,
					userDescription: '',
					contact: 0,
					risk_content: '',
					address: '',
					hospitalId:''
					
				},
				rules: {
					userPhone: [{
							required: false,
						},
						{
							// 自定义验证函数
							validator: (rule, value, callback) => {
								// 返回true表示校验通过，返回false表示不通过
								// 过滤第一层，先判断输入为不为空，因为required: false，不是必填项，所以为空应该返回true
								let iphoneReg = (
									/^1[3-9]\d{9}$/
								); //手机号码
								if (!iphoneReg.test(value)) {
									callback('手机号码格式不正确，请重新填写')
								}
								callback()
							},
							message: '手机号码不正确',
							// 触发器可以同时用blur和change
							trigger: ['blur'],
						}
					],
				},
				city: '',
				showcontactWay: false,
				showHospital: false,
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
				endTimeInit: 0,
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
				latitude: '31.8531187',
				// 地图纬度
				longitude: '117.2550177',
				// 附近医院列表
				hospitalList: [],
				// 当前选择的医院
				currentHospital:null,
				showCurrentHospital:false,
				MapContext:null,
				markers:[],
				defaultMarker:{
					id: 0,
					latitude:31.8531187,
					longitude:117.2550177,
					width:20,
					height:25,
				}
			}
		},
		onLoad() {
			this.initTime = this.formatTimestampDelay(3)
			this.getNearHospitalInfo()
			this.getLocationInfo()
		},
		onReady() {
			this.$refs.form.setRules(this.rules);
		},
		watch: {
			// 监听经度维度变化
			latitude: {
				async handler(val) {
					if(val){
						this.$nextTick(()=>{
							this.MapContext = wx.createMapContext('myMap')
						})
					}
				},
				immediate:true
			}
		},
		computed: {
			contactItem() {
				const index = this.contactWayArray.findIndex(item => item.value === this.formData.contact)
				return this.contactWayArray[index].name
			},
			endTimeDate() {
				return this.initTime
			},
			hospitalItem() {
				// const index = this.hospitalList.findIndex(item => item.value == this.formData.address)
				// return this.hospitalList[index].name
				return this.formData.address
			}
		},
		methods: {
			// 获取附近医院信息
			async getNearHospitalInfo(latitude= 31.8531187,longitude = 117.2550177){
				const detail = await request({
					url: "api/get/near/hospital",
					method: "GET",
					data: {
						latitude,
						longitude,
						highPrecision: false,
					}
				})
				if (detail?.status == 1) {
					this.orderDetailShow = false
					this.$refs.uToast.show({
						message: message,
					})
				}
				this.hospitalList = detail.data.data.map(item => {
					item.name = item.hospitalName
					item.value = item.id
					return item
				})
				this.markers = this.hospitalList.map(v=>{
					return {
						...v,
						iconPath:'https://junzean.com.cn/images/hospital_market.png',
						width:36,
						height:36
					}
				})
				this.markers.unshift(this.defaultMarker)
				const index = this.markers.findIndex(f => f.markerId === 0)
				const mark = {
					markerId:0,
					width:20,
					height:25,
					latitude,
					longitude
				}
				if(index >= 0){
					this.markers.splice(index,1)
				}
				this.markers.unshift(mark)
			},
			// 手机号正则   1(3[0-9]|4[01456879]|5[0-35-9]|6[2567]|7[0-8]|8[0-9]|9[0-35-9])\d{8}
			// 时间戳转日期
			formatTimestamp(timestamp) {
				let date = new Date(timestamp);
				let year = date.getFullYear();
				let month = date.getMonth() + 1;
				let day = date.getDate();
				let hour = date.getHours();
				return year + '-' + month + '-' + day + ' ' + hour + ':00:00';
			},
			// 时间推迟x小时
			formatTimestampDelay(delayTime, startTime) {
				var date = new Date();
				// 初始化时间
				var date1 = new Date().getTime(); // 获取当前时间戳
				return date.setTime((startTime ? startTime : date1) + (delayTime ? 3600000 * delayTime : 3600000));
			},
			// 日期转时间戳
			formatTimestampString(time) {
				return new Date(time.replace(/-/g, '/')).getTime()
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
			// chooseLocationInfo() {
			// 	let that = this;
			// 	uni.getLocation({
			// 		type: "gcj02",
			// 		success: async function(data) {
			// 			// let latitude = data.latitude;
			// 			// let longitude = data.longitude;
			// 			let latitude = 31.8531187;
			// 			let longitude = 117.2550177;
			// 			that.latitude = 31.8531187
			// 			that.longitude = 117.2550177
			// 			// that.circles = [{ //在地图上显示圆
			// 			// 	latitude,
			// 			// 	longitude,
			// 			// 	fillColor: "#D9E6EF", //填充颜色
			// 			// 	color: "#A7B6CB", //描边的颜色
			// 			// 	radius: 50, //半径
			// 			// 	strokeWidth: 2 //描边的宽度
			// 			// }]
			// 			// 选择定位
			// 			uni.chooseLocation({
			// 				latitude,
			// 				longitude,
			// 				keyword: '医院',
			// 				success: function(res) {
			// 					that.place = res;
			// 					var add_data = that.addressard(res.address);
			// 					that.formData.positionData = {
			// 						...add_data,
			// 						latitude: res.latitude,
			// 						longitude: res.longitude
			// 					}
			// 				}
			// 			});
			// 		}
			// 	});
			// },
			
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
			hospitalSelect(e) {
				this.formData.address = e.name
				this.formData.hospitalId = e.id
				this.latitude = e.latitude
				this.longitude = e.longitude
				this.MapContext.moveToLocation({
					latitude: e.latitude,
					longitude: e.longitude,
				})
				setTimeout(()=>{
					this.currentHospital = e
					this.showCurrentHospital = true
				},100)
				this.$refs.form.validateField('formData.address')
			},
			hideKeyboard() {
				uni.hideKeyboard()
			},
			showStartTimeBoard() {
				this.initTime = this.formatTimestampDelay(3)
				this.formData.endTime = ''
				this.startTimeShow = true
				this.hideKeyboard()
			},
			upgradeEndTimeMinDate() {
				this.initTime = this.formatTimestampDelay(2, this.formatTimestampString(this.formData.startTime))
			},
			showEndTimeBoard() {
				if (!this.formData.startTime) {
					this.$refs.uToast.show({
						message: '请先选择订单开始时间'
					})
					return
				}
				this.endTimeShow = true
				this.hideKeyboard()
			},
			handleSelectStartTime(time) {
				this.formData.startTime = this.formatTimestamp(time.value)
				this.startTimeShow = false
				this.upgradeEndTimeMinDate()
			},
			handleSelectEndTime(time) {
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
				if (detail?.status == 1) {
					this.orderDetailShow = false
					this.$refs.uToast.show({
						message: message,
					})
				}
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
					endTime: this.formatTimestampString(this.formData.endTime),
					longitude: this.longitude, // 经度
					latitude: this.latitude // 维度
				}
				const res = await request({
					url: 'api/create/order',
					method: 'POST',
					data: formData
				})
				const {
					message,
					status
				} = res?.data
				const data = res?.data?.data
				if (status == 1) {
					this.orderDetailShow = false
					this.$refs.uToast.show({
						message: message,
					})
				}
				if (data) {
					data.orderID = data.package
					data.totalPrice = this.totalPrice
					uni.redirectTo({
						url: `/pages/pay_page/pay_page?data=${encodeURIComponent(JSON.stringify(data))}`
						// success: d => {
						// 	// 当前页面的数据→传→被打开页面
						// 	d.eventChannel.emit('toOpenedPage', this.message);
						// }
					})
				}
			},
			// 点击图标切换医院
			handleTapMarker(e){
				e.stopPropagation()
				const { markerId } = e.detail
				if(!markerId) return
				const currentHos = this.hospitalList.find(v=>v.id === markerId)
				if(currentHos){
					const {latitude,longitude} = currentHos
					this.MapContext.moveToLocation({
						latitude,longitude
					})
					this.formData.address = currentHos.hospitalName
					this.formData.hospitalId = currentHos.id
					setTimeout(()=>{
						this.currentHospital = currentHos
						this.showCurrentHospital = true
					},100)
				}
			},
			// 点击地图
			handleTapMap(e){
				const {detail} = e
				if(!detail) return
				this.showCurrentHospital = false
				this.MapContext.moveToLocation(detail)
				const {longitude,latitude} = detail
				this.getNearHospitalInfo(latitude,longitude)
			}
		}
	}
</script>

<style lang="scss">
	.order_container {
		.form_container {
			padding: 20px;

			.u-form-item__body__right__message {
				margin-left: 0 !important;
			}
		}
			
		.map-area{
			position: relative;
		}
			
		.current-hospital {
			position: absolute;
			left: 0;
			bottom: 0;
			z-index: 100;
			padding: 10px 20px;
			width: 100%;
			height: 100px;
			background: linear-gradient(to bottom,#fffefead,#ffffff);
			box-sizing: border-box;
				
			.name {
				font-weight: 600;
				font-size: 24px;
				color: #333333;
				
			}
			.tags{
				display: flex;
				color: #ffffff;
				margin-top: 10px;
				.tag{
					border-radius: 4px;
					padding: 4px 8px;
					font-size: 12px;
					background-color: #4bbd03;
					margin-right: 10px;
				}
			}
			
		}
	}

	/deep/.u-action-sheet__item-wrap {
		max-height: 80vh !important;

	}
	.scroll-view{
		.u-reset-button{
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
</style>