import request from '@/utils/request'

const api = {
    upload: type => { return '/files/upload/' + type }
}

export function upload (type, watermark, fileList) {
    return request({
        url: api.upload(type),
        method: 'post',
        params: {
            type: type,
            watermark: watermark
        },
        data: fileList
    })
}
