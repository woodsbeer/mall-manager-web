/**
 * Created by Rubick.Li on 2017/9/19.
 */

import iView from 'iview'
import axios from 'axios'
import deepAssign from 'deep-assign'
import { setToken, getToken, getSign } from '@/libs/util'
import config from '@/config'
axios.defaults.timeout = 30000
axios.defaults.baseURL = config.baseURLL
axios.interceptors.request.use(
  config => {
    // console.log(config.data instanceof FormData,'config.data instanceof FormData');
    // config.data = !!config.data ? config.data instanceof FormData ? config.data : JSON.parse(JSON.stringify(config.data)) : undefined;
    config.headers['Token'] = getToken()
    config.headers['Cache-Control'] = 'no-cache'
    // config.headers['appid'] = 'insiap';
    return config
  },
  error => {
    iView.Message.error('网络异常')
    return Promise.reject(error)
  })

axios.interceptors.response.use(
  response => {
    if (response.status === 200) {
      return response.data
    }
    iView.Message.error(response.statusText)
    return Promise.reject(response)
  },
  error => {
    iView.Message.error('服务器异常')
    return Promise.reject(error)
  })

const Main = (option) => {
  return axios.get('app/systemTime/get')
    .then((signTimestamp) => {
      console.log('已经获取时间，')
      return axios(deepAssign(
        {
          headers: {
            'Authorization': getSign(signTimestamp.data ? signTimestamp.data.dateTime : null)
          }
        },
        option
      ))
    })
}

export default Main
