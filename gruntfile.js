module.exports = function(grunt){
	// 1
	grunt.initConfig({
		pkg: grunt.file.readJSON("package.json"),
		uglify: {
			build: {
				src: "./public/static/js/*.js",
				dest: "./public/static/dist/script.min.js"
			},
			dev: {
				options: {
					beautify: true,
					mangle: false,
					compress: false,
					preserveComments: "all"
				},
				src: "./public/static/js/*.js",
				dest: "./public/static/dist/script.min.js"
			}
		},
		sass: {
			dev: {
				options: {
					outputStyle: "expanded"
				},
				files: {
					"./public/static/dist/common.css" : "./public/static/sass/common.scss"
				}
			},
			build: {
				options: {
					outputStyle: "compressed"
				},
				files: {
					"./public/static/dist/common.css" : "./public/static/sass/common.scss"
				}	
			}
		},
		watch: {
			js: {
				files: ["./public/static/js/*.js"],
				tasks: ["uglify:dev"]
			},
			css: {
				files: ["./public/static/sass/*.scss"],
				tasks: ["sass:dev"]	
			}
		}
	});

	// 2
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-sass");

	// 3
	grunt.registerTask("default", ["uglify:dev", "sass:dev"]);
	grunt.registerTask("build", ["uglify:build"]);
}