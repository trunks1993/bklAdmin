import request from '@/utils/request'

export function createActivity(activity) {
  return request({
    url: '/activity/save',
    method: 'post',
    data: activity
  })
}
//更新活动信息
export function updateActivity(activity) {
  return request({
    url: '/activity/update',
    method: 'post',
    data: activity
  })
}
export function getActivityList(listQuery) {
  return request({
    url: '/activity/findList',
    method: 'post',
    data: listQuery
  })
}
export function getActivitySearchList(userId) {
  return request({
    url: '/activity/getActivitySearchList',
    method: 'post',
    params: {
      userId: userId
    }
  })
}
export function changeStatus(activityId, status) {
  return request({
    url: '/activity/switchStatus',
    method: 'post',
    params: {
      activityId: activityId,
      status: status
    }
  })
}
export function deleteActivity(activityId) {
  return request({
    url: '/activity/delete',
    method: 'post',
    params: { activityId }
  })
}

export function getNoScanedInfo(activityId) {
  return request({
    url: '/activity/deleteAudit',
    method: 'post',
    params: { activityId }
  })
}

//活动统计
export function initStatisticsByActivityId(activityId, dateType) {
  return request({
    url: '/activity/getCountDataByActivity',
    method: 'post',
    params: {
      activityId: activityId,
      dateType: dateType
    }
  })
}
