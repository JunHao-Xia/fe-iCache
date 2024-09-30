import request from '../utils/request'

export function GetAppNameList() {
  return request({
    url: '/monitor/GetCacheUserAppNameList',
    method:'GET',
    headers: {
      'debug': 'true',
    }
  })
}

export function GetAddressList(appName) {
  return request({
    url: `/monitor/GetCacheUserAddressList/${appName}`,
    method: 'GET',
    headers: {
      'debug': 'true',
    }
  });
}

export function GetCacheNameList(address) {
  return request({
    url: `/monitor/GetCacheNameList/${address}`,
    method: 'GET',
    headers: {
      'debug': 'true',
    }
  });
}