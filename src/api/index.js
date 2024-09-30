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

export function GetCacheUserAddressList(appName) {
  return request({
    url: `/monitor/GetCacheUserAddressList/${appName}`,
    method: 'GET',
    headers: {
      'debug': 'true',
    }
  });
}
