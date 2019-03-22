const redis = require("redis")
const path = require('path')

const encode = (value) => (typeof value === 'string' ? value : JSON.stringify(value))
const decode = (value) => {
  try { value = JSON.parse(value) } catch (e) {}
  return value
}

// Keys are namespaced by db name, since in orbit each store gets its own cache
const keyWrap = (prefix, key) => `${prefix}_${key}`

class Cache {
  constructor (storage, dbAddress, opts) {
    this.opts = opts
    this.store = storage
    this.dbAddress = dbAddress
  }

  async open () { }

  async close () { }

  async destroy () {
    // delete all keys ?
  }

  get (key) {
    return new Promise((resolve, reject) => {
      this.store.get(keyWrap(this.dbAddress, key), (err, reply) => {
        resolve(decode(reply))
      })
    })
  }

  async set (key, value) {
    this.store.set(keyWrap(this.dbAddress, key), encode(value))
  }

  async del (key) {
    this.store.del(keyWrap(this.dbAddress, key))
  }
}

const Start = (opts) => {

  let cache

  return {
     load: async (directory, dbAddress) => {
       // directory not used here for redis
      if (!cache) {
        cache = redis.createClient(opts)
      }
      const dbPath = path.join(dbAddress.root, dbAddress.path)
      return new Cache(cache, dbPath)
     },
     close: async () => {
     },
   }
}

module.exports = Start
