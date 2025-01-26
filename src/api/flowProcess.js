import requestUtils from './http/request';

export function save(param) {
  return requestUtils.post({
    url: '/flow/save',
    data: param
  })
}

export function getProcessNodeList() {
  return requestUtils.get({
    url: '/flow/getProcessNodeList'
  })
}