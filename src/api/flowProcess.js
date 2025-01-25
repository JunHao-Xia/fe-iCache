import requestUtils from './http/request';

export function saveFlow() {
  return requestUtils.post({
    url: '/flow/saveFlow'
  })
}
export function toEL(param) {
  console.log(param)
  return requestUtils.post({
    url: '/flow/toEl',
    data: param
  })
}

export function getProcessNodeList() {
  return requestUtils.get({
    url: '/flow/getProcessNodeList'
  })
}