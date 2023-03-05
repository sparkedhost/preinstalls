/** @type {import('rjweb-server/interfaces').CtrFile} */
module.exports = {
	method: 'GET',
	path: '/say/<word>', // This Route will repeat what the user specified as parameter word

	async code(ctr) {
		ctr.print(ctr.params.get('word'))
	}
}