<template>
	<view>
		<view class="order_container">
			<!-- 日期时间展示 -->
			<map id="myMap" style="width: 100%; height: 300px;" :latitude="formData.positionData.latitude"
				:longitude="formData.positionData.longitude" :markers="markers" show-location
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
				<u-form-item label="日期时间" prop="datetime" borderBottom label-position="top" label-width="100%"
					style="margin-top: 8px;" @click="dateTimePicker = true; hideKeyboard()">
					<u-input v-model="formData.datetime" disabled disabledColor="#ffffff" placeholder="请输入就诊时间" border="none"></u-input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="陪诊人性别" prop="requireGender" borderBottom @click="showSex = true; hideKeyboard()"
					label-position="top" label-width="100%">
					<u-input v-model="genderItem" disabled disabledColor="#ffffff" placeholder="请选择性别" border="none"></u-input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="需求说明" prop="userDescription" borderBottom
					label-position="top" label-width="100%">
					<u-input type="textarea" v-model="formData.userDescription" placeholder="请输入您的需求" :border="false" :maxlength="100" height="200"></u-input>
				</u-form-item>
				<u-form-item label="如何联系您" prop="contact" borderBottomss
					@click="showcontactWay = true; hideKeyboard()" label-position="top" label-width="100%">
					<u-input v-model="contactItem" disabled disabledColor="#ffffff" placeholder="请选择如何联系您" border="none"></u-input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="就诊人特殊情况以及特殊要去说明" prop="risk_content" borderBottom ref="item2" label-position="top"
					label-width="100%">
					<u-input type="textarea" v-model="formData.risk_content" placeholder="例如:老人或者幼童,或者患者有传染可能" :border="false" :maxlength="100" height="200"></u-input>
				</u-form-item>
			</u--form>
			<!-- end -->
			<u-action-sheet :show="showSex" :actions="sexArray" title="请选择性别" @close="showSex = false"
				@select="sexSelect">
			</u-action-sheet>
			<u-action-sheet :show="showcontactWay" :actions="contactWayArray" title="请选择如何联系您"
				@close="showcontactWay = false" @select="contactWaySelect">
			</u-action-sheet>
			<u-datetime-picker @confirm="dateTimePickerConfirm" @cancel="dateTimePicker = false" :show="dateTimePicker"
			 :default-value="formData.datetime" ref="datetimePicker" mode="datetime" closeOnClickOverlay>
			</u-datetime-picker>
			<u-button type="primary" text="提交" customStyle="margin-top: 50px" @click="submit"></u-button>
<!-- 			<u-button type="primary" text="微信支付" customStyle="margin-top: 10px" @click="wxPay"></u-button> -->
		</view>
	</view>
</template>


<script>
	import wxmini from '../../../mixins/wxmini'
	import { request } from '../../../utils'
	export default {
		mixins: [wxmini],
		data() {
			return {
				// 表单数据
				formData: {
					userPhone: '',
					userAge: '',
					datetime: '',
					requireGender: 1,
					userDescription: '',
					contact: 0,
					risk_content: '',
					address: '合肥市第一人民医院',
				},
				city: '',
				showSex: false,
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
				// 当前时间选择器展示
				dateTimePicker: false,
			}
		},
		onLoad() {
			var date = new Date()
			var timer = this.formatTimestamp(date)
			this.formData.datetime = timer
		},
		computed:{
			genderItem(){
				const index = this.sexArray.findIndex(item=> item.value === this.formData.requireGender)
				return this.sexArray[index].name
			},
			contactItem(){
				const index = this.contactWayArray.findIndex(item=> item.value === this.formData.contact)
				return this.contactWayArray[index].name
			}
		},
		methods: {
			formatTimestamp(timestamp) {
			    let date = new Date(timestamp);
			    let year = date.getFullYear();
			    let month = date.getMonth() + 1;
			    let day = date.getDate();
			    let hour = date.getHours();
			    let minute = date.getMinutes();
			    let second = date.getSeconds();
			    return year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second;
			  },
			getLocationInfo() {
				let that = this;
				uni.getLocation({
					type: "gcj02",
					success: function(data) {
						let latitude = data.latitude;
						let longitude = data.longitude;
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
			sexSelect(e) {
				this.formData.requireGender = e.value
				this.$refs.form.validateField('formData.sex')
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
			async submit() {
				const res = await request({
					url: 'api/create/order',
					method: 'POST',
					data: this.formData
				})
				const message = res?.data?.data
				if (message) {
					message.orderID = message.package
					uni.navigateTo({
						url: '/pages/pay_page/pay_page',
						success:d=>{
							// 当前页面的数据→传→被打开页面
							d.eventChannel.emit('toOpenedPage', message);
						}
					})
				}
			},
			dateTimePickerConfirm(data) {
				this.formData.datetime = this.formatTimestamp(data.value)
				this.dateTimePicker = false
			}
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