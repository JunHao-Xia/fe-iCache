import axios from 'axios'
import AxiosMax from "./Axios"
import { retry } from './axiosRetry'
import { checkErrorStatus } from './checkErrorStatus'
import staticAxiosConfig from './config'
//请求封装
const _RequstInterceptors = {
  requestInterceptors(config) {
    config.headers = {
      'debug': 'true'
    }
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
    count: 3,
    waitTime: 500
  }
})

export default useRequest