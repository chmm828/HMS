import request from '@/utils/request'

const customerApi = {
  guidanceRecords: (customerId, diseaseId) => `/customers/${customerId}/${diseaseId}/health-guidances`, // 健康指导记录
  guidanceTemplates: (customerId, diseaseId) => `/customers/${customerId}/chronic-diseases/${diseaseId}/templates`, // 获取指导内容模板
  addNewGuidance: (customerId) => `/customers/${customerId}/health-guidances`, // 新建新的指导
  creatGuidance: (customerId, guidanceId) => `/customers/${customerId}/health-guidances/${guidanceId}/create`, // 创建健康指导
  guidanceSendingInfo: (customerId, guidanceId) => `/customers/${customerId}/health-guidances/${guidanceId}/sending-info`, // 健康指导待发送
  ApiSendGuidance: (customerId, guidanceId) => `/customers/${customerId}/health-guidances/${guidanceId}/send`, // 发送健康指导
  guidanceSee: (customerId, guidanceId) => `/customers/${customerId}/health-guidances/${guidanceId}` // 查看健康指导
  }

// 指导记录
export function getGuidanceRecords (customerId, diseaseId, pages) {
  return request({
      url: customerApi.guidanceRecords(customerId, diseaseId),
      method: 'get',
      params: {
          page: pages.page || 1,
          size: pages.size || 10
      }
  })
}

export function getGuidanceTemplates (customerId, diseaseId) {
  return request({
      url: customerApi.guidanceTemplates(customerId, diseaseId),
      method: 'get'
  })
}
// 新建新指导单
export function addNewGuidance (customerId, parameter) {
  return request({
      url: customerApi.addNewGuidance(customerId),
      method: 'post',
      data: parameter
  })
}
export function creatGuidance (customerId, guidanceId) {
  return request({
      url: customerApi.creatGuidance(customerId, guidanceId),
      method: 'post'
  })
}

export function guidanceSendingInfo (customerId, guidanceId) {
  return request({
      url: customerApi.guidanceSendingInfo(customerId, guidanceId),
      method: 'get'
  })
}

export function ApiSendGuidance (customerId, guidanceId, parameter) {
  return request({
      url: customerApi.ApiSendGuidance(customerId, guidanceId),
      method: 'post',
      data: parameter
  })
}
export function guidanceSee (customerId, guidanceId) {
  return request({
      url: customerApi.guidanceSee(customerId, guidanceId),
      method: 'get'
  })
}
