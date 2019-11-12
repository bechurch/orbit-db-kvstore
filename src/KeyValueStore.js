'use strict'

const Store = require('orbit-db-store')
const KeyValueIndex = require('./KeyValueIndex')

class KeyValueStore extends Store {
  constructor(ipfs, id, dbname, options) {
    let opts = Object.assign({}, { Index: KeyValueIndex })
    Object.assign(opts, options)
    super(ipfs, id, dbname, opts)
    this._type = 'keyvalue'
  }

  get all () {
    return this._index._index
  }

  get (key) {
    return this._index.get(key)
  }

  set (key, data) {
    return this.put(key, data)
  }

  put (key, data) {
    return this._addOperation({
      op: 'PUT',
      key: key,
      value: data
    })
  }

  del (key) {
    return this._addOperation({
      op: 'DEL',
      key: key,
      value: null
    })
  }

  static async create (ipfs, identity, address, options) {
    const heads = await Store.loadHeadsFromCache(options.cache, address)
    if (heads.length > 0) {
      options = Object.assign(options, { heads })
    }
    return new KeyValueStore(ipfs, identity, address, options)
  }
}

module.exports = KeyValueStore
