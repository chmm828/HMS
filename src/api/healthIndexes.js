import request from '@/utils/request'

const api = {
  getHealthIndexes: `health-indexes`,
  GetIndexColumns: 'health-reports/columns'
}
export function getHealthIndexes () {
  return request({
    url: api.getHealthIndexes,
    method: 'get'
  })
}

export function getIndexColumns () {
  return request({
    url: api.GetIndexColumns,
    method: 'get'
  })
}
