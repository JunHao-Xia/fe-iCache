import request from '../utils/request'

export function GetCacheUserAppNameList() {
  return request({
    url: '/monitor/GetCacheUserAppNameList',
    method:'GET',
    headers: {
      'debug': 'true',
    }
  })
}
