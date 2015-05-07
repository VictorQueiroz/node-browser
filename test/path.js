describe('path', function () {
	it('should join path', function () {
		path.join.apply(this, ['a', 'b', 'c', 'd']).should.be.exactly('a/b/c/d');
	});
});