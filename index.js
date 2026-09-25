const core = require('@actions/core');
const dayjs = require('dayjs');
const dayjsPluginUTC = require('dayjs/plugin/utc')

dayjs.extend(dayjsPluginUTC)

async function main() {
	try {
		const timezone = core.getInput('timeZone');// default: 0
		const formatStr = core.getInput('format');// default: ''
		console.log('time zone: ', timezone)
		console.log('time format: ', formatStr)

		const str = dayjs().utcOffset(timezone).format(formatStr)
		console.log("time formatStr: ", str)

		core.setOutput("time", str);

	} catch (error) {
		core.setFailed(error.message);
	}
}

main();
