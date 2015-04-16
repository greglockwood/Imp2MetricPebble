module.exports = function (grunt) {

    var doNotModifyHeaderText = grunt.file.read('shared/_do_not_modify_header.txt');

    function copySharedScriptConfig(filename, globalVarToExport) {
        return {
            src: 'shared/' + filename,
            dest: 'src/' + filename,
            options: {
                process: function (content) {
                    return doNotModifyHeaderText + content + grunt.util.linefeed + 'module.exports = ' + globalVarToExport + ';';
                }
            }
        };
    }

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
                    "settings/settings.min.js": ["shared/data.js", "settings/settings.js"]
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
            data: copySharedScriptConfig('data.js', 'config_data'),
            format: copySharedScriptConfig('format.js', 'format')
        },
        "js-test": {
            default: {
                options: {}
            }
        },
        watch: {
            options: {
                livereload: true
            },
            scripts: {
                files: ['shared/data.js', 'shared/format.js', 'settings/settings.js'],
                tasks: ['copy', 'uglify', 'processhtml']
            },
            styles: {
                files: ['settings/settings.css'],
                tasks: ['uncss', 'cssmin', 'processhtml']
            },
            html: {
                files: ['settings/settings-src.html'],
                tasks: ['processhtml']
            },
            tests: {
                files: ['<%= watch.scripts.files %>', 'test/*.unittests.js'],
                tasks: ['copy', 'js-test']
            }
        }
    });

    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-js-test');

    grunt.registerTask('default', ['copy', 'uncss', 'cssmin', 'uglify', 'processhtml', 'js-test', 'watch']);

};
