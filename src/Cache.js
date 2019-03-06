const redis = require("redis")

const encode = (value) => (typeof value === 'string' ? value : JSON.stringify(value))
const decode = (value) => {
  try { value = JSON.parse(value) } catch (e) {}
  return value
}

class Cache {
  constructor (opts) {
    this.opts = opts
    this.store = redis.createClient(this.opts);
  }

  async open () { }

  async close () { }

  async destroy () {
    // delete all keys ?
  }

  get (key) {
    return new Promise((resolve, reject) => {
      this.store.get(key, (err, reply) => {
        resolve(decode(reply))
      })
    })
  }

  async set (key, value) {
    this.store.set(key, encode(value))
  }

  async del (key) {
    this.store.del(key)
  }
}

const Start = (opts) => {
  return {
     load: async (directory, dbAddress) => {
       return new Cache(opts)
     },
     close: async () => {
     },
   }
}

module.exports = Start
