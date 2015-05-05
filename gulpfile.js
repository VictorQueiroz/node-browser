var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var wrapper = require('gulp-wrapper');

var paths = {
	scripts: ['src/**/*.js']
};

gulp.task('scripts', function () {
	var header = `modules[` + '"${modulename}"' + `] = (function(root) {
	var moduleName = ` + '"${modulename}"' + `;
	var process = {
		platform: 'unix',
		_setupDomainUse: function () {}
	};

	return function(require, module, exports, __dirname, __filename) {`;

	var footer = `}; })(this);`;

	var parentHeader = `(function (root) {
	var modules = {};
	var global = root;
	var require = function (moduleName) {
		var moduleObj = (root[moduleName] || modules[moduleName]);
    var exports, module = {};

    module.exports = exports = {};

    if(typeof moduleObj === 'undefined') {
    	throw new Error('module named ' + moduleName + ' does not exist');
    }

		if(typeof moduleObj === 'function') {
			moduleObj.apply(moduleObj, [require, module, exports, './', "` + '${filename}' + `"]);

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
		.pipe(uglify())
		.pipe(gulp.dest('dist'));
});

gulp.task('default', ['watch']);