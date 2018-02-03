/**
 * Created by trunks on 17/12/11.
 */
import Vue from 'vue'
import { formatAddress } from '@/filters'

export function dataTransfer(data, parent, level, expandedAll) {
  let tmp = []
  Array.from(data).forEach(function(record) {
    if (record._expanded === undefined) {
      Vue.set(record, '_expanded', expandedAll)
    }
    if (record.hidden === "true") {
      record.hidden = true
    } else {
      record.hidden = false
    }
    if (parent) {
      Vue.set(record, '_parent', parent)
    }
    let _level = 0
    if (level !== undefined && level !== null) {
      _level = level + 1
    }
    Vue.set(record, '_level', _level)
    tmp.push(record)
    if (record.children && record.children.length > 0) {
      let children = dataTransfer(record.children, record, _level, expandedAll)
      tmp = tmp.concat(children)
    }
  })
  return tmp
}

export function formatAddressToArr(data) {
  data.address = data.address.split(',')
  return data
}

export function formatDefaultAddress(deliveryAddressList) {
  for (const item of deliveryAddressList) {
    if (item.status === 0) {
      return formatAddress(item.address) + item.addressDetail+" ( "+item.receiver+" 收)"+" "+item.phone
    }
  }
}
