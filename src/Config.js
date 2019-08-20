import { getQueryParameter } from './util'
import merge                 from 'deepmerge'
import defaultConfig         from './config.default'
import base64Url             from 'base64url'
import YAML                  from 'yaml'

export default new class Config {
  constructor() {
    this.config = null
    this.localConfig = null
  }

  load(config = null) {
    const rawConfig = getQueryParameter('rawConfig')

    if (config !== null) {
      this.localConfig = config
      this.config = merge(defaultConfig, config)
    } else if (rawConfig !== null) {
      this.localConfig = YAML.parse(base64Url.decode(rawConfig))
      this.config = merge(defaultConfig, this.localConfig)
    } else {
      this.loadFromLocalStorage()
    }

    this.persist()
  }

  loadFromLocalStorage() {
    const config = window.localStorage.getItem('config')

    if (config !== null) {
      const localConfig = YAML.parse(config)
      this.config = merge(defaultConfig, localConfig)
      this.localConfig = localConfig
    }
  }

  persist() {
    if (!this.localConfig) {
      return
    }

    window.localStorage.setItem('config', YAML.stringify(this.localConfig, null, 2))
  }

  get isConfigured() {
    return this.config !== null
  }

  get root() {
    return this.config
  }

  get local() {
    return this.localConfig
  }
}
