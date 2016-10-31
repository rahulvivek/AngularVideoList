module.exports = function(grunt) {

  grunt.initConfig({
    jshint: {
      all: ['app/**/*.js', 'app/*.js']
    },

    browserify: {
      dist: {
        files: {
          'client/js/bundle.js': [
              'app/**/*.js',
              'app/*.js',
           ],
           'client/js/vendor.js': [
              'node_modules/angular/angular.js',
              'node_modules/angular-ui-router/release/angular-ui-router.js',
              'node_modules/angular-md5/angular-md5.js',
              'node_modules/angular-input-stars/angular-input-stars.js',
              'node_modules/ng-infinite-scroll/build/ng-infinite-scroll.js',
              'node_modules/angular-ui-event/dist/event.js'
           ]
        },
      }
    },

    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: 'app/css',
          src: ['*.scss'],
          dest: 'client/css',
          ext: '.css',
        }]
      }
    },

    jasmine: {
      pivotal: {
        src: 'app/**/*.js',
        options: {
          specs: 'test/specs/*Spec.js',
          helpers: 'test/specs/*Helper.js',
          vendor: [
            'client/js/vendor.js',
            'node_modules/angular-mocks/angular-mocks.js'
          ]
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  
  grunt.registerTask('default', ['jasmine', 'jshint', 'browserify', 'sass']);  

};