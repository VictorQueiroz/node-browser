describe('events', function () {
	it('should have EventEmitter', function () {
		events.EventEmitter.should.not.be.undefined;
	});

	it('should emit events', function () {
		var server = new events.EventEmitter;

		function listener (mydata) {
			mydata.should.be.exactly(100).and.be.a.Number;
		}

		server.on('myevent', listener);

		server.emit('myevent', 100);
	});

	it('should list listeners', function () {
		var server = new events.EventEmitter;

		function listener (mydata) {
			mydata.should.be.exactly(100).and.be.a.Number;
		}

		server.on('myevent', listener);

		server.emit('myevent', 100);

		server.listeners('myevent')[0].should.be.exactly(listener);
	});

	it('should support once time events', function () {
		var server = new events.EventEmitter;
		var counter = 0;

		function listener () {
			counter += 100;
		}

		server.once('increaseCounter', listener);

		counter.should.be.exactly(0);

		server.emit('increaseCounter');

		counter.should.be.exactly(100);

		server.emit('increaseCounter');

		counter.should.be.exactly(100);
	});

	it('should remove listener', function () {
		var server = new events.EventEmitter;
		var counter = 0;

		function listener () {
			counter += 100;
		}

		server.on('increaseCounter', listener);

		counter.should.be.exactly(0);

		server.emit('increaseCounter');

		counter.should.be.exactly(100);

		server.removeListener('increaseCounter', listener);

		server.emit('increaseCounter');

		counter.should.be.exactly(100);
	});

	it('should remove all listeners', function () {
		var server = new events.EventEmitter;
		var counter = 0;

		function listener1 () {
			counter += 100;
		}

		function listener2 () {
			counter += 100;
		}

		server.on('increaseCounter', listener1);
		server.on('increaseCounter', listener2);

		counter.should.be.exactly(0);

		server.emit('increaseCounter');

		counter.should.be.exactly(200);

		server.removeAllListeners('increaseCounter');

		server.emit('increaseCounter');

		counter.should.be.exactly(200);
	});
});