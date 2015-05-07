describe('path', function () {
	it('should join path', function () {
		path.join('/foo', 'bar', 'baz/asdf', 'quux', '..').should.be.exactly('/foo/bar/baz/asdf');
	});

	it('should normalize path', function () {
		path.normalize('/foo/bar//baz/asdf/quux/..').should.be.exactly('/foo/bar/baz/asdf');
	});

	it('should normalize paths', function () {
		var currentPath = window.location.href;

		path.resolve('/foo/bar', './baz').should.be.exactly('/foo/bar/baz');
		path.resolve('/foo/bar', '/tmp/file/').should.be.exactly('/tmp/file');
		path.resolve('wwwroot', 'static_files/png/', '../gif/image.gif').should.be.exactly('http:/localhost:9876/context.html/wwwroot/static_files/gif/image.gif');
	});

	it('should determines whether path is an absolute path', function () {
		path.isAbsolute('/foo/bar').should.be.exactly(true)
		path.isAbsolute('/baz/..') .should.be.exactly(true)
		path.isAbsolute('qux/')		 .should.be.exactly(false);
		path.isAbsolute('.')			 .should.be.exactly(false);

		path.win32.isAbsolute('//server')  .should.be.exactly(true);
		path.win32.isAbsolute('C:/foo/..') .should.be.exactly(true);
		path.win32.isAbsolute('bar\\baz')  .should.be.exactly(false);
		path.win32.isAbsolute('.')         .should.be.exactly(false);
	});

	it('should solve the relative *from* to *to*', function () {
		var from = '//a/b//c',
				to = '/d//e/b';
		path.resolve(from, path.relative(from, to)) == path.resolve(to);

		path.win32.relative('C:\\orandea\\test\\aaa', 'C:\\orandea\\impl\\bbb').should.be.exactly('..\\..\\impl\\bbb');
		path.relative('/data/orandea/test/aaa', '/data/orandea/impl/bbb').should.be.exactly('../../impl/bbb');
	});

	it('should return the directory name of a path', function () {
		path.dirname('/foo/bar/baz/asdf/quux').should.be.exactly('/foo/bar/baz/asdf');
	});

	it('should return the last portion of a path', function () {
		path.basename('/foo/bar/baz/asdf/quux.html').should.be.exactly('quux.html');
		path.basename('/foo/bar/baz/asdf/quux.html', '.html').should.be.exactly('quux');
	})

	it('should return the extension of the path, from the last \'.\' to end of string in the last portion of the path', function () {
		path.extname('index.html').should.be.exactly('.html');
		path.extname('index.coffee.md').should.be.exactly('.md');
		path.extname('index.').should.be.exactly('.');
		path.extname('index').should.be.exactly('');
	})

	it('should returns an object from a path string', function () {
		path.parse('/home/user/dir/file.txt').should.have.properties({
		  root : "/",
		  dir : "/home/user/dir",
		  base : "file.txt",
		  ext : ".txt",
		  name : "file"
		});
	})

	it('should returns a path string from an object', function () {
		path.format({
		  root : "/",
		  dir : "/home/user/dir",
		  base : "file.txt",
		  ext : ".txt",
		  name : "file"
		}).should.be.exactly('/home/user/dir/file.txt');
	});
});