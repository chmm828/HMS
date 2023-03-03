import request from '@/utils/request'

const api = {
  getMedicine: '/medicine',
  addMedicine: (name) => '/medicine/' + name,
  editMedicineGoal: (name) => '/medicine/' + name,
  addMedicineItem: (name) => '/medicine/' + name + '/items',
  editMedicineItem: (name, itemId) => '/medicine/' + name + '/items/' + itemId,
  delMedicineItem: (name, itemId) => '/medicine/' + name + '/items/' + itemId,
  addMedicineToChronic: (diseaseId) => '/chronic-diseases/' + diseaseId + '/medicine',
  delMedicineToChronic: (diseaseId, indexId) => '/chronic-diseases/' + diseaseId + '/medicine/' + indexId
}

export function getMedicine () {
  return request({
    url: api.getMedicine,
    method: 'get'
  })
}

export function addMedicine (name) {
  return request({
    url: api.addMedicine(name),
    method: 'post'
  })
}

export function editMedicineGoal (name, parameter) {
  return request({
    url: api.editMedicineGoal(name),
    method: 'put',
    data: parameter
  })
}

export function addMedicineItem (name, parameter) {
  return request({
    url: api.addMedicineItem(name),
    method: 'post',
    data: parameter
  })
}

export function editMedicineItem (name, itemId, parameter) {
  return request({
    url: api.editMedicineItem(name, itemId),
    method: 'put',
    data: parameter
  })
}

export function delMedicineItem (name, itemId) {
  return request({
    url: api.delMedicineItem(name, itemId),
    method: 'delete'
  })
}

export function addMedicineToChronic (diseaseId, parameter) {
  return request({
    url: api.addMedicineToChronic(diseaseId),
    method: 'post',
    data: parameter
  })
}

export function delMedicineToChronic (diseaseId, indexId) {
  return request({
    url: api.delMedicineToChronic(diseaseId, indexId),
    method: 'delete'
  })
}
