const redis = require('redis')
const path = require('path')

const encode = (value) => (typeof value === 'string' ? value : JSON.stringify(value))
const decode = (value) => {
  try { value = JSON.parse(value) } catch (e) {}
  return value
}

// Maps keys from orbit-db v22 to keys currently in our implementation
const keyMap = (key) => {
  const splits = key.split('/')
  const keyPath = splits.pop()
  const heads = keyPath.includes('Heads')
  const dbAddress = splits.slice(2).join('/')
  if (heads) return `${dbAddress}_${keyPath}`
  const manifestKey = `/orbitdb/${dbAddress}/${keyPath}`
  return `${dbAddress}_${manifestKey}`
}

class Cache {
  constructor (redisOpts = {}) {
    this.store = redis.createClient(redisOpts)
  }

  open () {
    // just open in constructor
    return Promise.resolve()
  }

  async close () { }

  async destroy () { }

  get (key) {
    return new Promise((resolve, reject) => {
      this.store.get(keyMap(key), (err, reply) => {
        resolve(decode(reply))
      })
    })
  }

  async set (key, value) {
    this.store.set(keyMap(key), encode(value))
  }

  async del (key) {
    this.store.del(keyMap(key))
  }
}

module.exports = Cache
