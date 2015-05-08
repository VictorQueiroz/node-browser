describe('assert', function () {
	it('should throws an exception that displays the values for actual and expected separated by the provided operator', function () {
		var called = false;
		assert.throws(function () {
			assert.fail(true, true, 'you failed', true);
		}, function (err) {
			if(err instanceof Error) {
				return (called = true);
			}
		});
		called.should.be.true;
	});

	it('should tests if value is truthy, it is equivalent to assert.equal(true, !!value, message)', function () {
		var called = false,
		value = true;
		assert.doesNotThrow(function () {
			assert(value);
			assert.ok(value);
			assert.equal(true, !!value);
		}, function () {
			called = true;
		});
		called.should.be.false;
	});

	it('should tests shallow, coercive equality with the equal comparison operator', function () {
		assert.doesNotThrow(function () {
			assert.equal(1, '1');
		});
	});

	it('should tests shallow, coercive non-equality with the not equal comparison operator', function () {
		var called = false;
		assert.doesNotThrow(function () {
			called = true;
			assert.notEqual(1, 2);
		});
		called.should.be.true;
	});

	it('should tests for deep equality. Primitive values are compared with the equal comparison operator', function () {
		var called = false;
		assert.doesNotThrow(function () {
			assert.deepEqual({ a: 1 }, { a: 1 });
		}, function () {
			called = true;
		});
		called.should.be.false;
	})

	it('should tests for any deep inequality', function () {
		var called = false;

		assert.doesNotThrow(function () {
			assert.notDeepEqual(1, 2);
		}, function () {
			called = true;
		});

		called.should.be.false;

		assert.throws(function () {
			assert.notDeepEqual(1, 1);
		}, function (err) {
			if(err instanceof Error) {
				return called = true;
			}
		});

		called.should.be.true;
	})

	it('should tests strict equality, as determined by the strict equality operator', function () {
		var called = false;
		var obj = {
			myObj: {
				value: 1
			}
		};
		
		assert.doesNotThrow(function () {
			assert.strictEqual(obj, obj);
		});

		called.should.be.false;

		assert.throws(function () {
			assert.strictEqual(obj, {
				myObj: {
					value: 1
				}
			});
		}, function (err) {
			if(err instanceof Error) {
				return called = true;
			}
		});

		called.should.be.true;
	});

	it('should tests strict non-equality, as determined by the strict not equal operator', function () {
		var called = false;
		assert.doesNotThrow(function () {
			assert.notStrictEqual(1, 2);
		}, function () {
			called = true;
		});
		called.should.be.false;

		assert.throws(function () {
			assert.notStrictEqual(1, 1);
		}, function (err) {
			if(err instanceof Error) {
				return called = true;
			}
		});

		called.should.be.true;
	});

	it('should tests for deep equality', function () {
		var called = false;
		assert.doesNotThrow(function () {
			assert.deepStrictEqual(1, 1);
		}, function () {
			called = true;
		});

		called.should.be.false;

		assert.throws(function () {
			assert.deepStrictEqual(1, '1');
		}, function (err) {
			if(err instanceof Error) {
				return called = true;
			}
		});

		called.should.be.true;
	});

	it('should tests for deep inequality', function () {
		var called = false;
		assert.doesNotThrow(function () {
			assert.notDeepStrictEqual(1, '1');
		}, function () {
			called = true;
		})
		called.should.be.false;

		assert.throws(function () {
			assert.notDeepStrictEqual(1, 1);
		}, function (err) {
			if(err instanceof Error) {
				return called = true;
			}
		})

		called.should.be.true;
	})

	it('should validate instanceof using constructor', function () {
		var called = false;

		assert.throws(function() {
	  	called = true;
	    throw new Error("Wrong value");
	  }, Error);

		called.should.be.true;
	});

	it('should expects block not to throw an error', function () {
		var called = false;

		assert.doesNotThrow(function () {
			// didn't throw an error
		}, function () {
			called = true;
		});
		called.should.be.false;
	});

	it('should tests if value is not a false value, throws if it is a true value', function () {
		var called = false;
		assert.doesNotThrow(function () {
			assert.ifError(false);
		}, function () {
			called = true;
		});
		called.should.be.false;

		assert.throws(function () {
			assert.ifError(true);
		}, function (err) {
			if(err) {
				return called = true;
			}
		})

		called.should.be.true;
	});
});