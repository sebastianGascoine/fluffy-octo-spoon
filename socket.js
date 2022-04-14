const io = require('socket.io');

const shared = require('./shared');

module.exports = function(httpServer) {
	const server = new io.Server(httpServer);

	server.on('connection', function(socket) {
	    // Use socket to communicate with this particular client only, sending it it's own id
	    socket.emit('welcome', { message: 'Welcome!', id: socket.id });

	    socket.on('update', function (data) {
	        // Broadcast to everyone (including self)
	        server.emit('update', data.ident);
	    });
	});
}