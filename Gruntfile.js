//<editor-fold name="Variables">

//<editor-fold name="Drawable Canvas">

var drawableCanvasSourceFiles = [
	"src/DrawableCanvas/src/extensions/*.js",
	"src/DrawableCanvas/src/DrawableCanvas.js",
	"src/DrawableCanvas/src/API.js",
	"src/DrawableCanvas/src/InputService/*.js",
	"src/DrawableCanvas/src/events/*.js",
	"src/DrawableCanvas/src/drawables/ShapeCollisions.js",
	"src/DrawableCanvas/src/drawables/Drawable.js",
	"src/DrawableCanvas/src/drawables/Rectangle.js",
	"src/DrawableCanvas/src/drawables/Circle.js",
	"src/DrawableCanvas/src/angular/**/*.js"
];

//</editor-fold>


//</editor-fold>

//<editor-fold name="Helper Methods">

function combineArrays () {
	var array = [];
	for (var i = 0; i < arguments.length; i++)
	{
		var argument = arguments[i];
		if (Array.isArray(argument))
		{
			argument.forEach(function (item) {
				array.push(item);
			});
		}
		else
		{
			array.push(argument);
		}
	}
	return array;
}

//</editor-fold>


module.exports = function(grunt) {

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		uglify: {
			options: {
				banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
			},
			build: {
				src: 'src/app/**/*.js',
				dest: 'build/<%= pkg.name %>.min.js'
			}
		},
		bower: {
			install: {
				options: {
					targetDir: "bower_components",
					layout: "byComponent",
					cleanTargetDir: false
				}
			}
		},
		less: {
			options: {
				paths: ["bower_components/bootstrap-less"]
			},
			files: {
				"src/css/bootstrap.css": "bower_components/bootstrap-less/bootstrap.less"
			}
		},
		concat: {
			drawableCanvas: {
				src: drawableCanvasSourceFiles,
				dest: "src/DrawableCanvas/build/DrawableCanvas.combined.js"
			}
		},
		jsdoc: {
			drawableCanvas: {
				src: combineArrays(["src/DrawableCanvas/jsdoc"], drawableCanvasSourceFiles),
				options: {
					destination: "src/DrawableCanvas/docs"
				}
			}
		}
	});

	grunt.loadNpmTasks("grunt-bower-task");
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-less");
	grunt.loadNpmTasks("grunt-jsdoc");

	grunt.registerTask('default', ['bower', 'uglify']);

};
