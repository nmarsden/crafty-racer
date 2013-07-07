module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';'
      },
      build: {
        src: [
          'lib/qlass.js',
          'lib/crafty_0.5.4.js',
          'lib/gamepad.js',
          'lib/tiledmapbuilder/create_mocks_module.js',
          'lib/tiledmapbuilder/tiledmapbuilder.js',
          'src/levels.js',
          'src/game.js',
          'src/components.js',
          'src/editor.js',
          'src/scenes.js'
        ],
        dest: 'build/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      build: {
        files: {
          'build/<%= pkg.name %>.min.js': ['<%= concat.build.dest %>']
        }
      }
    },
    pngmin: {
      compile: {
        options: {
          ext: '.png'
        },
        files: [
          {
            src: 'assets/images/*.png',
            dest: 'build/assets/images/'
          }
        ]
      }
    },
    copy: {
      main: {
        files: [
          /* Production files (html, css, fonts & audio) */
          {src: ['index-prod.html'], dest: 'build/index.html'},
          {expand: true, src: ['*.css'], dest: 'build/'},
          {expand: true, src: ['assets/audio/*.mp3'], dest: 'build/'},
          {expand: true, src: ['assets/audio/*.wav'], dest: 'build/'},
          {expand: true, src: ['assets/audio/*.ogg'], dest: 'build/'},
          {expand: true, src: ['assets/*.TTF'], dest: 'build/'},
          {expand: true, src: ['assets/images/favicon.ico'], dest: 'build/'},
          /* Extra html & unminified js files for dev */
          {expand: true, src: ['index-dev.html'], dest: 'build/'},
          {expand: true, src: ['index-dev-instrumented.html'], dest: 'build/'},
          {expand: true, src: ['lib/**'], dest: 'build/'},
          {expand: true, src: ['src/**'], dest: 'build/'}
        ]
      }
    },
    watch: {
      files: ['**/*'],
      tasks: ['default'],
      options: {
        nospawn: true,
        interval: 500,
        livereload: true
      }
    },
    exec: {
      wtf_instrument: {
        cmd: 'wtf-instrument --track-heap build/lib/crafty_0.5.4.js build/lib/crafty_0.5.4.instrumented.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-pngmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-exec');

  // Default task(s).
  grunt.registerTask('default', ['concat','uglify','copy','exec:wtf_instrument','pngmin']);

};