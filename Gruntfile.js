//<editor-fold name="Variables">

//<editor-fold name="Drawable Canvas">

var drawableCanvasSourceFiles = [
	"src/DrawableCanvas/src/**/*"
];

//</editor-fold>


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
				src: 'src/<%= pkg.name %>.js',
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
		}
	});

	grunt.loadNpmTasks("grunt-bower-task");
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks("grunt-contrib-concat");
	grunt.loadNpmTasks("grunt-contrib-less");

	grunt.registerTask('default', ['bower', 'uglify']);

};
