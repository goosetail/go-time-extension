module.exports = function(grunt) {

  var pkg = grunt.file.readJSON('package.json');
  var mnf = grunt.file.readJSON('core/manifest.json');

  var fileMaps = { browserify: {}, uglify: {} };
  var file, files = grunt.file.expand({cwd:'core/js'}, ['**/*.js']);
  for (var i = 0; i < files.length; i++) {
    file = files[i];
    fileMaps.uglify['build/unpacked-prod/js/' + file] = 'core/js/' + file;
  }

  grunt.initConfig({

    clean: ['build/unpacked-dev', 'build/unpacked-prod', 'build/*.crx'],

    mkdir: {
      unpacked: { options: { create: ['build/unpacked-prod'] } }
    },

    copy: {
      prod: { files: [ {
        expand: true,
        cwd: 'core/',
        src: ['**', '!js/*.js', '!css/*.css'],
        dest: 'build/unpacked-prod/'
      } ] }
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'core/css',
          src: ['*.css', '!*.min.css'],
          dest: 'build/unpacked-prod/css',
          ext: '.css'
        }]
      }
    },

    uglify: {
      min: { files: fileMaps.uglify }
    }

  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-mkdir');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-uglify');


  grunt.registerTask('default', ['clean', 'copy:prod', 'cssmin', 'uglify']);

};
