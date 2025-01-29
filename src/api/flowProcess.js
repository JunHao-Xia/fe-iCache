import requestUtils from './http/request';

export function save(param) {
  return requestUtils.post({
    url: '/flow/chain/saveFlowChain',
    data: param
  })
}
export function getFlowChainList(param) {
  return requestUtils.post({
    url: '/flow/chain/getFlowChainList',
    data: param
  })
}

export function getProcessNodeList() {
  return requestUtils.get({
    url: '/flow/node/getFlowNodeList'
  })
}
