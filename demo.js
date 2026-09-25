const dayjs = require('dayjs')
const dayjsPluginUTC = require('dayjs/plugin/utc')

dayjs.extend(dayjsPluginUTC)

let a = dayjs().format('')
console.log(a)
