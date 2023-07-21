import fs from 'fs'
import lodash from 'lodash'
import Data from './Data.js'
import puppeteer from '../../../lib/puppeteer/puppeteer.js'

let plugin = 'ZhiYu-plugin'

if (fs.existsSync(process.cwd() + '/plugins/Zyy-GM-plugin')) {
  plugin = 'Zyy-GM-plugin'
} else if (fs.existsSync(process.cwd() + '/plugins/ZyyGio-Plugin')) {
  plugin = 'ZyyGio-Plugin'
}

export async function render(app = '', tpl = '', data = {}, imgType = 'jpeg') {
  data._plugin = plugin
  if (lodash.isUndefined(data._res_path)) {
    data._res_path = `../../../../../plugins/${plugin}/resources/`
  }
  Data.createDir(process.cwd() + '/data/', `html/${plugin}/${app}/${tpl}`)
  data.saveId = data.saveId || data.save_id || tpl
  data.tplFile = `./plugins/${plugin}/resources/${app}/${tpl}.html`
  data.pluResPath = data._res_path

  return await puppeteer.screenshot(`${plugin}/${app}/${tpl}`, data)
}

export default { render }
