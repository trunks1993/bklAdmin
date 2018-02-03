import request from '@/utils/request'

export function createUser(user) {
  return request({
    url: '/user/save',
    method: 'post',
    data: user
  })
}
export function getUserList(listQuery) {
  return request({
    url: '/user/findList',
    method: 'post',
    data: listQuery
  })
}
export function isValidUsername(username) {
  return request({
    url: '/user/isDuplicateUser',
    method: 'post',
    params: {
      username
    }
  })
}
//绑定微信
export function getBindQrCode(userId) {
  return request({
    url: '/qrCode/getBindingQrCode',
    method: 'post',
    params: {
      userId: userId
    }
  })
}

// 订单操作
export function getOrderList(listQuery) {
  return request({
    url: '/systemOrder/findList',
    method: 'post',
    data: listQuery
  })
}
export function deletOrder(orderId) {
  return request({
    url: '/systemOrder/delete',
    method: 'post',
    params: {
      orderId
    }
  })
}
export function cancelOrder(orderId) {
  return request({
    url: '/systemOrder/cancel',
    method: 'post',
    params: {
      orderId
    }
  })
}
export function getOrderByNo(orderNo) {
  return request({
    url: '/systemOrder/findOrderByOrderNo',
    method: 'post',
    params: {
      orderNo
    }
  })
}
export function paySuccess(activityId) {
  return request({
    url: '/qrCode/generateQrCode',
    method: 'post',
    params: {
      activityId: activityId
    }
  })
}
// 地址管理
export function saveDeliveryAddress(deliveryAddress) {
  return request({
    url: '/deliveryAddress/save',
    method: 'post',
    data: deliveryAddress
  })
}
export function getDeliveryAddressList(listQuery) {
  return request({
    url: '/deliveryAddress/findList',
    method: 'post',
    data: listQuery
  })
}
export function deleteDeliveryAddressList(deliveryAddressId) {
  return request({
    url: '/deliveryAddress/delete',
    method: 'post',
    params: {
      deliveryAddressId
    }
  })
}
export function setDefaultAddressList(deliveryAddressId) {
  return request({
    url: '/deliveryAddress/setDefault',
    method: 'post',
    params: {
      deliveryAddressId
    }
  })
}
//发货
export function sendDelivery(logistical) {
  return request({
    url: '/systemOrder/delivery',
    method: 'post',
    params: {
      orderId: logistical.orderId,
      isDelivery: logistical.isDelivery,
      expCompany: logistical.expCompany,
      expNo: logistical.expNo
    }
  })
}
//确认收货
export function confirmDelivery(orderId) {
  return request({
    url: '/systemOrder/confirm',
    method: 'post',
    params: {
      orderId
    }
  })
}
// 支付操作
export function unifiedOrder(id) {
  return request({
    url: '/systemOrder/unifiedOrder',
    method: 'post',
    params: {
      orderId: id
    }
  })
}

export function balancePayOrder(orderId, password) {
  return request({
    url: '/systemOrder/balancePayOrder',
    method: 'post',
    params: {
      orderId,
      password
    }
  })
}

//获取二维码价格
export function getQrTotalPrice(id, qrCount) {
  return request({
    url: '/qrPrice/getChargeQrPrice',
    method: 'post',
    params: {
      userId: id,
      chargeNum: qrCount
    }
  })
}
export function createQrOrder(id, qrCount) {
  return request({
    url: '/qrCode/chargeQrCode',
    method: 'post',
    params: {
      userId: id,
      chargeNum: qrCount
    }
  })
}
export function getQrCodeTradeDetail(listQuery) {
  return request({
    url: '/qrCodeTrade/findList',
    method: 'post',
    data: listQuery
  })
}

//余额交易明细
export function getBalanceTradeDetail(listQuery) {
  return request({
    url: '/balanceTrade/findList',
    method: 'post',
    data: listQuery
  })
}

//统计模块
export function initStatistics(userId, dateType) {
  return request({
    url: '/user/getTotalStatistics',
    method: 'post',
    params: {
      userId: userId,
      dateType: dateType
    }
  })
}
//获取消息
export function getMsg(listQuery) {
  return request({
    url: '/message/getMessageList',
    method: 'post',
    params: {
      userId: listQuery.userId,
      offset: listQuery.offset,
      count: listQuery.count
    }
  })
}

//扫码记录
export function getScanRecordList(listQuery) {
  return request({
    url: '/qrCode/getScanList',
    method: 'post',
    data: listQuery
  })
}

// 标记为已读
export function iknown(userId) {
  return request({
    url: '/message/readAllMessageByUser',
    method: 'post',
    params: { userId: userId }
  })
}
