import request from '../utils/request'
import axios from 'axios'
import AxiosMax from "./Axios"
import { retry } from './axiosRetry'
import { checkErrorStatus } from './checkErrorStatus'
import staticAxiosConfig from './config'
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

//请求封装
const _RequstInterceptors = {
  requestInterceptors(config) {
    return config
  },
  requestInterceptorsCatch(err) {
    return err
  },
  responseInterceptor(config) {
    return config
  },
  responseInterceptorsCatch(axiosInstance, err) {
    let message = err.code === 'ECONNABORTED' ? '请求超时' : undefined
    if (axios.isCancel(err)) {
      return Promise.reject(err);
    }
    console.log(err)
    checkErrorStatus(err.response?.status, message,  (message) => console.log(message))
    return retry(axiosInstance, err)
  },
}

const useRequest = new AxiosMax({
  directlyGetData: true,
  baseURL: staticAxiosConfig.baseUrl,
  timeout: 3000,
  interceptors: _RequstInterceptors,
  abortRepetitiveRequest: true,
  retryConfig: {
    count: 5,
    waitTime: 500
  }
})

export default useRequest