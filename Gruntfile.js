module.exports = function(grunt) {

    grunt.initConfig({
        uncss: {
            settings: {
                options: {
                    ignore: ['h2', 'ul', 'li', '.units', '.units li', 'input', 'input[type="checkbox"]']
                },
                files: {
                    "settings/settings.uncss.css": ['settings/settings-src.html']
                }
            }
        },
        cssmin: {
            settings: {
                files: {
                    "settings/settings.min.css": ['settings/settings.uncss.css']
                }
            }
        },
        uglify: {
            settings: {
                files: {
                    "settings/settings.min.js": ["src/data.js", "settings/settings.js"]
                }
            }
        },
        processhtml: {
            settings: {
                files: {
                    'settings/settings.html': ['settings/settings-src.html']
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ['src/data.js', 'settings/settings.js'],
                tasks: ['uglify', 'processhtml']
            },
            styles: {
                files: ['settings/settings.css'],
                tasks: ['uncss', 'cssmin', 'processhtml']
            },
            html: {
                files: ['settings/settings-src.html'],
                tasks: ['processhtml']
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
