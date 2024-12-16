export function GetAppNameList() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['Trade-Service', 'Order-Service', 'User-Service']);
    }, 500);
  });
}

export function GetAddressList(appName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['192.168.0.101:9099', '192.168.0.102:9099']);
    }, 500);
  });
}

export function GetCacheNameList(address) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(['Product-Cache', 'Order-Cache']);
    }, 500);
  });
}

export function GetCacheKeyList(cacheName, address) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const data = {
        'Product-Cache': {
          '192.168.0.101:9099': ['sku-43', 'sku-80'],
          '192.168.0.102:9099': ['sku-37', 'sku-67'],
        },
        'Order-Cache': {
          '192.168.0.101:9099': ['sku-38', 'sku-45'],
          '192.168.0.102:9099': ['sku-50', 'sku-60'],
        },
      };

      resolve(data[cacheName][address] || []);
    }, 500);
  });
}

export function GetCacheValue(cacheName, cacheKey, address) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const productId = parseInt(cacheKey.split('-')[1]);
      resolve({
        AccessTime: 1727898945,
        CacheValueMetrics: {
          CacheHitCount: 2,
          CacheSize: 16,
        },
        Data: {
          ProductId: productId,
          ProductName: `MockProductName_${productId}`,
          ProductPrice: 81000,
          ProductSku: 1000 + productId,
        },
        WriteTime: 1727898945,
      });
    }, 500);
  });
}

export function GetCacheMetrics(address, cacheName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        memoryUsage: [350, 370, 250, 300, 320, 280],
        cacheSizeDistribution: [
          { value: 590, name: 'user_cache' },
          { value: 142, name: 'stock_cache' },
          { value: 340, name: 'rule_cache' },
          { value: 410, name: 'trade-cache' }
        ],
        cpuUsage: [5, 0.5, 7, 0.1, 5],
        cacheHitRate: 70
      });
    }, 500);
  });
}

export function GetMetricsByCombination(appName, address, cacheName) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 根据不同的组合返回不同的数据
      const data = {
        memoryUsage: [Math.random() * 400, Math.random() * 400, Math.random() * 400],
        cacheSizeDistribution: [
          { value: Math.random() * 600, name: 'user_cache' },
          { value: Math.random() * 150, name: 'stock_cache' },
          { value: Math.random() * 350, name: 'rule_cache' },
          { value: Math.random() * 450, name: 'trade-cache' }
        ],
        cpuUsage: [Math.random() * 10, Math.random() * 10, Math.random() * 10],
        cacheHitRate: Math.floor(Math.random() * 100)
      };
      resolve(data);
    }, 500);
  });
} 