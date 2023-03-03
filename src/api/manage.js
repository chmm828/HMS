import request from '@/utils/request'

const api = {
  user: '/users',
  role: '/role-permission/roles',
  service: '/service',
  permission: '/role-permission/permissions',
  orgTree: '/org/tree',
  changeDisable: (id) => '/users/' + id + '/status',
  editHomeDuty: '/groups/setCreatedBy'
}

export default api

export function getUserList (parameter) {
  return request({
    url: api.user,
    method: 'get',
    params: parameter
  })
}

export function getRoleList (parameter) {
  return request({
    url: api.role,
    method: 'get',
    params: parameter
  })
}

export function getServiceList (parameter) {
  return request({
    url: api.service,
    method: 'get',
    params: parameter
  })
}

export function getPermissions (parameter) {
  return request({
    url: api.permission,
    method: 'get',
    params: parameter
  })
}

export function getOrgTree (parameter) {
  return request({
    url: api.orgTree,
    method: 'get',
    params: parameter
  })
}

// id == 0 add     post
// id != 0 update  put
export function saveService (parameter) {
  return request({
    url: api.service,
    method: parameter.id === 0 ? 'post' : 'put',
    data: parameter
  })
}

export function saveSub (sub) {
  return request({
    url: '/sub',
    method: sub.id === 0 ? 'post' : 'put',
    data: sub
  })
}

export function changeDisable (id, parameter) {
  return request({
    url: api.changeDisable(id),
    method: 'get',
    params: parameter
  })
}

export function editHomeDuty (parameter) {
  return request({
    url: api.editHomeDuty,
    method: 'post',
    data: parameter
  })
}
