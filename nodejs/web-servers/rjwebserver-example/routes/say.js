const { server } = require('../index')

module.exports = new server.routeFile((file) => file
	.http('GET', '/{word}', (http) => http // This Route will repeat what the user specified as parameter word, thanks to fileBasedRouting it will end up as "/say/<word>"
		.onRequest((ctr) => {
			ctr.print(ctr.params.get('word'))
		})
	)
)