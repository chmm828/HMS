import request from '@/utils/request'

const customerApi = {
    healthIndex: '/health-indexes', // 获取健康指标
    healthDis: diseaseId => `/health-diseases/${diseaseId}/children`, // 疾病诊断
    healthReport: (customerId) => `/health-reports/${customerId}/reports`, // 新建检测报告
    healthCustomerReport: '/health-reports/',
    heathLevels: diseaseId => `/chronic-diseases/${diseaseId}/levels` // 获取与更新分级
}

// 获取健康指标
export function getHealthIndex () {
    return request({
        url: customerApi.healthIndex,
        method: 'get'
    })
}

// 疾病诊断
export function gethealthDis (diseaseId) {
    return request({
        url: customerApi.healthDis(diseaseId),
        method: 'get'
    })
}

// 新建检测报告
export function addHealthReport (customerId, parameter) {
    return request({
        url: customerApi.healthReport(customerId),
        method: 'post',
        data: parameter
    })
}

// 查看健康报告
export function getHealthCustomerReport (customerId, reportId) {
    return request({
        url: customerApi.healthCustomerReport + customerId + '/reports/' + reportId
    })
}

export function getHealthReport (customerId, values, pages) {
    return request({
        url: customerApi.healthReport(customerId),
        method: 'get',
        params: {
            word: values || '',
            page: pages.page || 1,
            size: pages.size || 10
        }
    })
}
// 更新分级设置
export function updateHeathLevels (diseaseId, parameter) {
  return request({
      url: customerApi.heathLevels(diseaseId),
      method: 'put',
      data: parameter
      // data: {
      //   level: levels.level,
      //   template: levels.levels
      //  }
  })
}
// 获取分级表
export function getHeathLevels (diseaseId) {
  return request({
      method: 'get',
      url: customerApi.heathLevels(diseaseId)
  })
}
