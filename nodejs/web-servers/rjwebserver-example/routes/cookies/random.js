const { utils } = require('rjweb-server')
const { server } = require('../../index')

module.exports = new server.routeFile((file) => file
	.http('GET', '/', (http) => http // This Route will clear all cookies of the user set on the current page, thanks to fileBasedRouting it will end up as "/cookies/clear"
		.onRequest((ctr) => {
			for (let i = 0; i < 5; i++) {
				const name = utils.randomCode([3, 3]),
					value = utils.randomStr({ length: 10 })

				ctr.cookies.set(name, {
					value: value,
					maxAge: utils.time(24).h()
				})
			}

			ctr.printHTML((html) => html
				.t('h1', { style: { color: 'green' } }, 'Set 5 random Cookies!')
				.t('a', { href: '/cookies/list' }, 'List Cookies')
			)
		})
	)
)