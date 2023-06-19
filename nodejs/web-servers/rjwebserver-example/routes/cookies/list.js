const { server } = require('../../index')

module.exports = new server.routeFile((file) => file
	.http('GET', '/', (http) => http // This Route will list all cookies of the user using the built in html builder, thanks to fileBasedRouting it will end up as "/cookies/list"
		.onRequest((ctr) => {
			ctr.printHTML((html) => html
				.t('h1', { style: { color: 'green' } }, 'Your Cookies')
				.t('ul', {}, (tag) => tag
					.forEach(ctr.cookies.entries(), (tag, [ name, value ]) => tag
						.t('li', {}, `${name} is set to ${value}`) // Will automatically deal with xss
					)
				)
				.t('br', {}, '')
				.t('a', { href: '/cookies/clear' }, 'Clear all cookies')
				.t('br', {}, '')
				.t('a', { href: '/cookies/random' }, 'Add Random Cookies')
			)
		})
	)
)