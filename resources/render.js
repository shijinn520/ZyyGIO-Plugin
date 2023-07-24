import lodash from 'lodash'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'
const { _plugin } = global.ZhiYu

export async function render(app = '', tpl = '', data = {}, imgType = 'jpeg') {
  data._plugin = _plugin
  if (lodash.isUndefined(data._res_path)) {
    data._res_path = `../../../../../plugins/${_plugin}/resources/`
  }

  data.saveId = data.saveId || data.save_id || tpl
  data.tplFile = `./plugins/${_plugin}/resources/${app}/${tpl}.html`
  data.pluResPath = data._res_path

  return await puppeteer.screenshot(`${_plugin}/${app}/${tpl}`, data)
}

export default { render }
