import { CodeToText, TextToCode } from 'element-china-area-data'

function pluralize(time, label) {
  if (time === 1) {
    return time + label
  }
  return time + label + 's'
}

export function timeAgo(time) {
  const between = Date.now() / 1000 - Number(time)
  if (between < 3600) {
    return pluralize(~~(between / 60), ' minute')
  } else if (between < 86400) {
    return pluralize(~~(between / 3600), ' hour')
  } else {
    return pluralize(~~(between / 86400), ' day')
  }
}

export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }

  if ((time + '').length === 10) {
    time = +time * 1000
  }

  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    date = new Date(parseInt(time))
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

export function formatAddress(str) {
  if (!str) return ''
  const arr = str.split(',')
  let address = ''
  arr.forEach(function(code) {
    address += CodeToText[code]
  })
  return address
}

/* 数字 格式化*/
export function nFormatter(num, digits) {
  const si = [
    { value: 1E18, symbol: 'E' },
    { value: 1E15, symbol: 'P' },
    { value: 1E12, symbol: 'T' },
    { value: 1E9, symbol: 'G' },
    { value: 1E6, symbol: 'M' },
    { value: 1E3, symbol: 'k' }
  ]
  for (let i = 0; i < si.length; i++) {
    if (num >= si[i].value) {
      return (num / si[i].value + 0.1).toFixed(digits).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1') + si[i].symbol
    }
  }
  return num.toString()
}

export function html2Text(val) {
  const div = document.createElement('div')
  div.innerHTML = val
  return div.textContent || div.innerText
}

export function toThousandslsFilter(num) {
  return (+num || 0).toString().replace(/^-?\d+/g, m => m.replace(/(?=(?!\b)(\d{3})+$)/g, ','))
}

export function getSpace(_level) {
  return "margin-left:" + _level * 10 + 'px'
}

// ---------------活动type------------
export function getTypeName(type) {
  let name
  if (type === 1) {
    name = '随机金额红包'
  } else if (type === 2) {
    name = '固定金额红包'
  } else if (type === 3) {
    name = '优惠券'
  }
  return name
}
// 订单状态码和tag的样式判断 isCustomer 0 1 2
export function getOrderStatus(status, isCustomer) {
  let msg
  if (status === 1) {
    msg = isCustomer === 0 ? '等待付款' : isCustomer === 1 ? '买家未付款' : 'danger'
  } else if (status === 2) {
    msg = isCustomer === 2 ? 'info' : '已关闭'
  } else if (status === 3) {
    msg = isCustomer === 0 ? '等待发货' : isCustomer === 1 ? '买家已付款' : 'warning'
  } else if (status === 4) {
    msg = isCustomer === 0 ? '已发货' : isCustomer === 1 ? '等待买家收货' : ''
  } else {
    msg = isCustomer === 2 ? 'success' : '交易成功'
  }
  return msg
}

//msg未读消息
export function getNoReadCount(messageList) {
  let count = 0
  messageList.forEach(item => {
    if (!item.readAlready) count++
  })
  return count
}

//获取消息类型
export function getMsgByType(messageList, type) {

}

//活动状态哈tag样式判断
export function getActivityStatus(status, isType) {
  let msg
  switch (status) {
    case 1:
      msg = !isType ? '停用' : 'danger'
      break;
    case 2:
      msg = !isType ? '已结束' : 'info'
      break;
    case 3:
      msg = !isType ? '未开始' : 'warning'
      break;
    default:
      msg = !isType ? '正常' : 'success'
  }
  return msg
}

//活动状态哈tag样式判断
export function mathCeil(totalMoney) {
  const x = totalMoney * 100
  const y = Math.ceil(x * 0.01) / 100
  return y

}
export function orderPrice(totalMoney, qrTotalPrice) {
  const x = totalMoney * 100
  const y = Math.ceil(x * 0.01) / 100

  return (totalMoney * 100 + y * 100 + qrTotalPrice) / 100
}

//日志异常判断
export function getErrorStatus(data, isTags) {
  const oldData = eval('(' + data.statusCode + ')')
  let msg = !isTags ? '异常' : 'danger'
  switch (data.type) {
    case 'success':
      if (oldData.customerScanedTimes < oldData.scanedLimit && oldData.activityStatus === 0 &&
        oldData.activityDelFlag === '0' && (!oldData.customerLockQr || oldData.customerLockQr === data.vo.qrCodeId)) {
        msg = !isTags ? '正常' : 'success'
      }
      break;
    case 'others_scaned':
      if (oldData.qrCustomer && oldData.qrCustomer !== data.customer) {
        msg = !isTags ? '正常' : 'success'
      }
      break;
    case 'already_scaned':
      if (oldData.qrCustomer === data.customer) {
        msg = !isTags ? '正常' : 'success'
      }
      break;
    case 'not_start':
      if (oldData.activityStatus === 3) {
        msg = !isTags ? '正常' : 'success'
      }
      break;
    case 'over_limit':
      if (oldData.customerScanedTimes >= oldData.scanedLimit) {
        msg = !isTags ? '正常' : 'success'
      }
      break;
    case 'customer_lock':
      if (oldData.customerLockQr && oldData.customerLockQr !== data.vo.qrCodeId) {
        msg = !isTags ? '正常' : 'success'
      }
      break;
    case 'activity_stop':
      if (oldData.activityStatus === 1) {
        msg = !isTags ? '正常' : 'success'
      }
      break;
    case 'activity_finish':
      if (oldData.activityDelFlag === '0' || oldData.activityStatus === 2) {
        msg = !isTags ? '正常' : 'success'
      }
      break;
  }
  return msg
}
