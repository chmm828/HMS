import request from '@/utils/request'

const Api = {
  ListAllIndexes: '/health-indexes',
  CreateIndexItem: (projectName) => `/health-indexes/${projectName}/items`,
  UpdateIndexItem: (projectName, id) => `/health-indexes/${projectName}/items/${id}`,
  DeleteIndexItem: (projectName, id) => `/health-indexes/${projectName}/items/${id}`,
  CreateProject: (projectName) => `/health-indexes/${projectName}`,
  UpdateProject: (projectName) => `/health-indexes/${projectName}`,
  DeleteProject: (projectName) => `/health-indexes/${projectName}`
}

export function listAllIndexes () {
  return request({
    url: Api.ListAllIndexes,
    method: 'get'
  })
}

// projects

export function createProject (projectName) {
  return request({
    url: Api.CreateProject(projectName),
    method: 'post'
  })
}

export function deleteProject (projectName) {
  return request({
    url: Api.DeleteProject(projectName),
    method: 'delete'
  })
}

export function updateProjectName (projectName, newProjectName) {
  return request({
    url: Api.UpdateProject(projectName),
    method: 'put',
    data: {
      projectName: newProjectName
    }
  })
}

// items

export function createIndexItem (projectName, payload) {
  return request({
    url: Api.CreateIndexItem(projectName),
    method: 'post',
    data: payload
  })
}

export function updateIndexItem (projectName, itemId, payload) {
  return request({
    url: Api.UpdateIndexItem(projectName, itemId),
    method: 'put',
    data: payload
  })
}

export function deleteIndexItem (projectName, itemId) {
  return request({
    url: Api.DeleteIndexItem(projectName, itemId),
    method: 'delete'
  })
}
