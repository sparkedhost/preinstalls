const { server } = require('../../index')

module.exports = new server.routeFile((file) => file
	.http('GET', '/', (http) => http // This Route will clear all cookies of the user set on the current page, thanks to fileBasedRouting it will end up as "/cookies/clear"
		.onRequest((ctr) => {
			ctr.cookies.clear()

			ctr.printHTML((html) => html
				.t('h1', { style: { color: 'green' } }, 'Your Cookies have been cleared!')
				.t('a', { href: '/cookies/list' }, 'List Cookies')
			)
		})
	)
)