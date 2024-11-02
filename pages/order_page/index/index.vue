<template>
	<view>
		<view class="order_container">
			<!-- 日期时间展示 -->
			<view class="timer_show">
				{{date}}
			</view>
			<map id="myMap" style="width: 100%; height: 280px;" :latitude="latitude" :longitude="longitude"
				:markers="markers" show-location></map>
			<!-- start -->
			<u--form labelPosition="left" :model="formData" ref="form">
				<u-form-item label="联系电话" prop="phone_number" borderBottom ref="form">
					<u--input v-model="formData.phone_number" border="none" placeholder="请输入联系电话">联系电话</u--input>
				</u-form-item>
				<u-form-item label="陪诊人性别" prop="sex" borderBottom @click="showSex = true; hideKeyboard()">
					<u--input disabled disabledColor="#ffffff" placeholder="请选择性别" border="none"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="需求说明" prop="requirement" borderBottom
					@click="showRequirement = true; hideKeyboard()">
					<u--input disabled disabledColor="#ffffff" placeholder="请选择您的需求" border="none"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="如何联系您" prop="contractWay" borderBottom
					@click="showContractWay = true; hideKeyboard()">
					<u--input disabled disabledColor="#ffffff" placeholder="请选择如何联系您" border="none"></u--input>
					<u-icon slot="right" name="arrow-right"></u-icon>
				</u-form-item>
				<u-form-item label="就诊人特殊情况以及特殊要去说明" prop="radiovalue1" borderBottom ref="item2">
					<u--textarea v-model="formData.instructions" placeholder="例如:老人或者幼童,或者患者有传染可能" ></u--textarea>
				</u-form-item>
			</u--form>
			<!-- end -->
			<u-action-sheet :show="showSex" :actions="sexArray" title="请选择性别" @close="showSex = false"
				@select="sexSelect">
			</u-action-sheet>
			<u-action-sheet :show="showRequirement" :actions="requirementArray" title="请选择您的需求"
				@close="showRequirement = false" @select="reuquirementSelect">
			</u-action-sheet>
			<u-action-sheet :show="showContractWay" :actions="contractWayArray" title="请选择您的需求"
				@close="showContractWay = false" @select="contractWaySelect">
			</u-action-sheet>
			<u-button
				type="primary"
				text="提交"
				customStyle="margin-top: 50px"
				@click="submit"
			></u-button>
			<u-button
				type="error"
				text="重置"
				customStyle="margin-top: 10px"
				@click="reset"
			></u-button>
			<u-button
				type="primary"
				text="微信支付"
				customStyle="margin-top: 10px"
				@click="wxPay"
			></u-button>
		</view>
	</view>
</template>


<script>
	import wxmini from '../../../mixins/wxmini'
	export default {
		mixins: [ wxmini ],
		data() {
			return {
				title: 'Hello',
				date: '',
				setTime: '',
				// 初始化的中心位置
				latitude: 23.099994,
				longitude: 113.324520,
				// 表单数据
				formData: {
					phone_number: '',
					sex: 1,
					requiement: 0,
					contractWay: 0,
					instructions: ''
				},
				showSex: false,
				showRequirement: false,
				showContractWay: false,
				sexArray: [{
						name: '男',
						value: 1
					},
					{
						name: '女',
						value: 0
					},
					{
						name: '不限',
						value: 2
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
				contractWayArray: [
					{
						name: '电话联系',
						value: 0
					},
					{
						name: '微信联系',
						value: 1
					},
					{
						name: '短信联系',
						value: 2
					},
					{
						name: '按时到达地点之后联系',
						value: 3
					},
				],
				// 标记点
				markers: [{
					id: 1,
					latitude: 23.099994,
					longitude: 113.324520,
					name: 'T.I.T 创意园'
				}],
				// 需求说明
				requirementValue: '',
				// 其他需求说明
				otherRequirementValue: '',
			}
		},
		onLoad() {
			var setTime = setInterval(() => {
				let date = new Date()
				let year = date.getFullYear()
				let month = date.getMonth() + 1
				month >= 9 ? month : month = '0' + month
				let day = date.getDate()
				day >= 9 ? day : day = '0' + day
				let hour = date.getHours()
				hour >= 9 ? hour : hour = '0' + hour
				let minute = date.getMinutes()
				minute >= 9 ? minute : minute = '0' + minute
				let second = date.getSeconds()
				second >= 9 ? second : second = '0' + second
				this.date = year + '-' + month + '-' + day + "  " + hour + ":" + minute + ":" + second
			}, 1000)
			const _this = this;
			uni.getSystemInfo({
				success: (res) => {
					_this.mapHeight = res.screenHeight - res.statusBarHeight
					_this.mapHeight = _this.mapHeight
				}
			})
			this.getLocationInfo()
		},
		methods: {
			handleSubmitForm() {
				console.log('提交ss单内容');
			},
			handleResetForm() {
				console.log('重置表单结构');
			},
			// 获取地理位置
			getLocationInfo() {
				var that = this
				uni.getLocation({
					type: 'gcj02',
					success(res) {
						console.log(res, "当前位置");
						that.latitude = res.latitude
						that.longitude = res.longitude
						//标记点
						that.markers = [{
							id: 1,
							latitude: res.latitude,
							longitude: res.longitude,
							iconPath: '../../../static/img/pos.png',
						}]
						that.circles = [{ //在地图上显示圆
							latitude: res.latitude,
							longitude: res.longitude,
							fillColor: "#D9E6EF", //填充颜色
							color: "#A7B6CB", //描边的颜色
							radius: 50, //半径
							strokeWidth: 2 //描边的宽度
						}]
					}
				});
			},

			handleSelectRequire(event) {
				this.requirementValue = event.detail.value || ''
				console.log('requirementValue', this.requirementValue);
			},
			// TODO
			sexSelect(e) {
				this.formData.sex = e.value
				this.$refs.form.validateField('formData.sex')
			},
			reuquirementSelect(e) {
				this.formData.requiement = e.value
				this.$refs.form.validateField('formData.requiement')
			},
			contractWaySelect(e) {
				this.formData.contractWay = e.value
				this.$refs.form.validateField('formData.contractWay')
			},
			getItemValue(arr,index){
				return arr.filter(item => item.value == index).name
			},
			hideKeyboard() {
				uni.hideKeyboard()
			},
			submit(){},
			reset(){},
		}
	}
</script>

<style>

</style>