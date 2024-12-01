// 订单详情需要展示的字段，根据订单状态进行筛选

export const detailShowMap = {
	// 待支付
	0: [
		'startTimeText', // 开始时间
		'endTimeText', // 结束时间
		'id', // 订单id
		'address', // 地址
		'userName', // 用户名称
		'userPhone', // 用户手机号
		'userAge', // 用户年龄
		'risk_content', // 特殊情况说明
		 'requireGender', // 性别
		 'userDescription', // 用户需求
		 'contact' // 联系方式
	],
	// 成功
	1: [
		'startTimeText', // 开始时间
		'endTimeText', // 结束时间
		'id', // 订单id
		'address', // 地址
		'userName', // 用户名称
		'userPhone', // 用户手机号
		'userAge', // 用户年龄
		'risk_content', // 特殊情况说明
		 'requireGender', // 性别
		 'userDescription', // 用户需求
		 'contact' // 联系方式
	],
	// 取消
	2: [
		'startTimeText', // 开始时间
		'endTimeText', // 结束时间
		'id', // 订单id
		'address', // 地址
		'userName', // 用户名称
		'userPhone', // 用户手机号
		'userAge', // 用户年龄
		'risk_content', // 特殊情况说明
		 'requireGender', // 性别
		 'userDescription', // 用户需求
		 'contact' // 联系方式
	]
}

	
export const detailValueMap = {
	orderStatus: '订单状态',
	orderStatusDesc: '订单状态描述',
	startTimeText: '预约开始时间',
	startTime: '开始时间时间戳',
	endTimeText: '预约结束时间',
	id: '订单ID',
	pay_id: '支付id',
	address: '医院位置',
	price: '订单价格',
	actualPayment: '实际支付 只在订单支付成功后显示',
	isDelete: '是否订单可以删除',
	userName: '用户名',
	userPhone: '用户电话号码',
	userAge: '用户年龄',
	requireGender: '性别',
	risk_content: '特殊情况说明',
	expiredTime: '订单过期时间戳',
	userDescription: '需求说明',
	contact: '联系方式'
}

export const requireGenderMap = {
	0: '不限制',
	1: '男',
	2: '女'
}

export const contactMap = {
	0: '电话联系',
	1: '微信联系',
	2: '到地方后联系'
}

// 订单状态映射表
export const orderStatusMap = {
	0: {
		tip: '订单未支付',
		type: 'warning'
	},
	1: {
		tip: '订单已完成',
		type: 'success'
	},
	2: {
		tip: '订单已关闭',
		type: 'error'
	}
}

export const detailMap = {
	requireGender: requireGenderMap,
	contact: contactMap
}

const transArr = ['requireGender', 'contact']

// 转换value
export function transValue(key, value) {
	// 首先通过判断key是否需要转换
	if (!transArr.includes(key)) return value
	return detailMap[key][value]
}