import requestUtils from './http/request';
export function saveFlow() {
  return requestUtils.post({
    url: '/flow/saveFlow'
  })
}