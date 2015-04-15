module.exports = function(grunt) {

    grunt.initConfig({
        uncss: {
            settings: {
                options: {
                    ignore: ['ul', 'li', '.units', '.units li', 'input', 'input[type="checkbox"]']
                },
                files: {
                    "src/settings.uncss.css": ['src/settings-src.html']
                }
            }
        },
        cssmin: {
            settings: {
                files: {
                    "src/settings.min.css": ['src/settings.uncss.css']
                }
            }
        },
        uglify: {
            settings: {
                files: {
                    "src/settings.min.js": ["src/data.js", "src/settings.js"]
                }
            }
        },
        processhtml: {
            settings: {
                files: {
                    'src/settings.html': ['src/settings-src.html']
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ['src/data.js', 'src/settings.js'],
                tasks: ['uglify', 'processhtml']
            },
            styles: {
                files: ['src/settings.css'],
                tasks: ['uncss', 'cssmin', 'processhtml']
            }
        }
    });

    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['uncss', 'cssmin', 'uglify', 'processhtml', 'watch']);

};