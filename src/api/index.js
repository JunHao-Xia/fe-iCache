import _useRequest from './http/request';
export function GetAppNameList() {
  return _useRequest.get({
    url: '/monitor/GetCacheUserAppNameList'
  })
}
export function GetAddressList(appName) {
  return _useRequest.get({
    url: `/monitor/GetCacheUserAddressList/${appName}`,
  });
}
export function GetCacheNameList(address) {
  return _useRequest.get({
    url: `/monitor/GetCacheNameList/${address}`
  });
}
export function GetCacheKeyList(cacheName,address) {
  return _useRequest.get({
    url: `/monitor/GetCacheKeyList/${cacheName}/${address}`
  });
}

export function GetCacheValue(cacheName,cacheKey,address) {
  return _useRequest.get({
    url: `/monitor/GetValueToCacheUser/${cacheName}/${cacheKey}/${address}`
  });
}