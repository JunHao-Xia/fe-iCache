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