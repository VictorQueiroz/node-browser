var gulp = require('gulp');
var gzip = require('gulp-gzip');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var wrapper = require('gulp-wrapper');

var paths = {
	scripts: ['src/**/*.js']
};

gulp.task('scripts', function () {
	var header = `define(` + '"${modulename}"' + `, function(root) {
	var moduleName = ` + '"${modulename}"' + `;
	
	return function(require, module, exports, __dirname, __filename, process, global) {`;

	var footer = `};
	});`;

	var parentHeader = `(function (root) {
	var modules = {};
	var global = {};
	var process = global.process = {
		platform: 'unix',
		_setupDomainUse: function () {},
		stderr: {
			write: function () {
				console.log.apply(console, arguments);
			}
		},
		stdout: {
			write: function () {
				console.log.apply(console, arguments);
			}
		},
		noDeprecation: false,
		throwDeprecation: false,
		traceDeprecation: false,
		ENV: {
			NODE_DEBUG: false
		},
		pid: 12345,
		binding: function () {
			throw new Error('process.binding is not supported');
		}
	};

	function define (moduleName, fn) {
		modules[moduleName] = fn(root);
	}

	var require = global.require = function (moduleName) {
		var moduleObj = (root[moduleName] || modules[moduleName]);
    var exports, module = {};

    module.exports = exports = {};

    if(typeof moduleObj === 'undefined') {
    	throw new Error('module named ' + moduleName + ' does not exist');
    }

		if(typeof moduleObj === 'function') {
			moduleObj.apply(moduleObj, [require, module, exports, './', "` + '${filename}' + `", process, global]);

			moduleObj = modules[moduleName] = root[moduleName] = (module.exports || exports);
		}

		return moduleObj;
	};
	var init = function () {
		Object.keys(modules).forEach(require, this);
	};`;
	var parentFooter = `init(); })(this);`;

	function h(v) {
		return function (file) {
				var fileName = file.path.replace(file.base, '');
				return v.replace(/\${filename}/g, fileName)
										.replace(/\${modulename}/g, fileName.replace(/\.js$/, ''));
		};
	}

	// Standalone modules
	gulp.src(paths.scripts)
		.pipe(wrapper({
			header: h(header),
			footer: footer
		}))
		.pipe(concat('all.js'))
		.pipe(wrapper({
			header: h(parentHeader),
			footer: parentFooter
		}))
		.pipe(uglify({
			compress: {
				unsafe: true,
				dead_code: true,
				hoist_vars: true
			}
		}))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest('dist'))
		.pipe(uglify({
			output: {
				beautify: true
			}
		}))
		.pipe(rename('all.js'))
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
	gulp.watch('src/**/*.js', ['scripts']);
});

gulp.task('default', ['watch']);