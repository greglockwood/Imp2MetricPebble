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
                options: {
                    compress: {
                        dead_code: true
                    }
                },
                files: {
                    "settings/settings.min.js": ["data.js", "settings/settings.js"]
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
        copy: {
            data: {
                src: 'data.js',
                dest: 'src/data.js',
                options: {
                    process: function (content) {
                        return content + grunt.util.linefeed + 'module.exports = config_data;';
                    }
                }
            }
        },
        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ['data.js', 'settings/settings.js'],
                tasks: ['copy', 'uglify', 'processhtml']
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
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['copy', 'uncss', 'cssmin', 'uglify', 'processhtml', 'watch']);

};
