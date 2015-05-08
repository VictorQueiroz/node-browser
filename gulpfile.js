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
	var modules = {}, global = {}, resolveds = {};

	if(!Error.hasOwnProperty('captureStackTrace')) {
		Error.captureStackTrace = function (obj) {
		  if (Error.prepareStackTrace) {
		    var frame = {
		      isEval: function () { return false; },
		      getFileName: function () { return "filename"; },
		      getLineNumber: function () { return 1; },
		      getColumnNumber: function () { return 1; },
		      getFunctionName: function () { return "functionName" }
		    };

		    obj.stack = Error.prepareStackTrace(obj, [frame, frame, frame]);
		  } else {
		    obj.stack = obj.stack || obj.name || "Error";
		  }
		};
	}

	var require = global.require = function (moduleName) {
		var moduleObj = (root[moduleName] || modules[moduleName]);
    var exports, module = {};

    module.exports = exports = {};

    if(typeof moduleObj === 'undefined') {
    	throw new Error('module named ' + moduleName + ' does not exist');
    }

		if((typeof resolveds[moduleName]) === 'undefined') {
			moduleObj.apply(moduleObj, [require, module, exports, './', "` + '${filename}' + `", process, global]);

			moduleObj = modules[moduleName] = root[moduleName] = module.exports;

			resolveds[moduleName] = true;
		}

		return moduleObj;
	};

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
		},
		cwd: function () {

			return window.location.href;
		}
	};

	function define (moduleName, fn) {
		modules[moduleName] = fn(root);
	}

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
			mangle: false,
			output: {
				beautify: true
			}
		}))
		.pipe(gulp.dest('dist'))
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
		.pipe(gulp.dest('dist'));
});

gulp.task('watch', function () {
	gulp.watch('src/**/*.js', ['scripts']);
});

gulp.task('default', ['watch']);