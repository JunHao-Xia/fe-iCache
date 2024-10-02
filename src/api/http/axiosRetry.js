

export function retry(instance, err) {
  const config = err.config
  const { waitTime, count } = config.retryConfig ?? {}
  config.currentCount = config.currentCount ?? 0
  console.log(`第${config.currentCount}次重连`)
  if (config.currentCount >= count) {
    return Promise.reject(err)
  }
  config.currentCount++
  return wait(waitTime).then(() => instance(config))
}

function wait(waitTime) {
  return new Promise(resolve => setTimeout(resolve, waitTime))
}


