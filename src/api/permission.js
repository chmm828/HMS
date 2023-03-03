import request from '@/utils/request'

const userApi = {
    GetPermissionRoles: '/role-permission/roles',
    GetPermissionPermissions: '/role-permission/permissions',
    EditRole: roleName => { return `/role-permission/roles/${roleName}` },
    AddRole: roleName => { return `/role-permission/roles/${roleName}` },
    DeleteRole: roleName => { return `/role-permission/roles/${roleName}` }
    // EditRole: '/role-permission/roles'
}

export function GetPermissionRoles () {
    return request({
        url: userApi.GetPermissionRoles,
        method: 'get'
    })
}

export function GetPermissionPermissions () {
    return request({
        url: userApi.GetPermissionPermissions,
        method: 'get'
    })
}

// 编辑修改权限
export function EditRole (parameter) {
    return request({
        url: userApi.EditRole(parameter.name),
        method: 'put',
        data: parameter
    })
}

// 新建用户
export function AddRole (parameter) {
    return request({
        url: userApi.AddRole(parameter.name),
        method: 'post',
        data: parameter
    })
}

// 删除用户
export function DeleteRole (name) {
    return request({
        url: userApi.DeleteRole(name),
        method: 'delete'
    })
}
