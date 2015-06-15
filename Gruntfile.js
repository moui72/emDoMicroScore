var taskName = '';
module.exports = function(grunt) {

  var _ = require('lodash');

  // Load required Grunt tasks. These are installed based on the versions listed
  // * in 'package.json' when you do 'npm install' in this directory.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-less');
  grunt.loadNpmTasks('grunt-coffeelint');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-ng-annotate');
  grunt.loadNpmTasks('grunt-html2js');
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-cordovacli');

  /** ********************************************************************************* */
  /** **************************** File Config **************************************** */
  var fileConfig = {
    build_dir: 'build',
    compile_dir: 'bin',

    /**
     * This is a collection of file patterns for our app code (the
     * stuff in 'src/'). These paths are used in the configuration of
     * build tasks. 'js' is all project javascript, except tests.
     * 'commonTemplates' contains our reusable components' ('src/common')
     * template HTML files, while 'appTemplates' contains the templates for
     * our app's code. 'html' is just our main HTML file. 'less' is our main
     * stylesheet, and 'unit' contains our app's unit tests.
     */
    app_files: {
      js: ['./src/**/*.module.js', 'src/**/*.js', '!src/**/*.spec.js', '!src/assets/**/*.js'],
      jsunit: ['src/**/*.spec.js'],

      coffee: ['./src/**/*.module.coffee', 'src/**/*.coffee', '!src/**/*.spec.coffee'],
      coffeeunit: ['src/**/*.spec.coffee'],

      appTemplates: ['src/app/**/*.tpl.html'],
      commonTemplates: ['src/common/**/*.tpl.html'],

      html: ['src/index.html'],
      less: 'src/less/main.less'
    },

    /**
     * This is a collection of files used during testing only.
     */
    test_files: {
      js: [
        'vendor/angular-mocks/angular-mocks.js'
      ]
    },

    /**
     * This is the same as 'app_files', except it contains patterns that
     * reference vendor code ('vendor/') that we need to place into the build
     * process somewhere. While the 'app_files' property ensures all
     * standardized files are collected for compilation, it is the user's job
     * to ensure non-standardized (i.e. vendor-related) files are handled
     * appropriately in 'vendor_files.js'.
     *
     * The 'vendor_files.js' property holds files to be automatically
     * concatenated and minified with our project source files.
     *
     * The 'vendor_files.css' property holds any CSS files to be automatically
     * included in our app.
     *
     * The 'vendor_files.assets' property holds any assets to be copied along
     * with our app's assets. This structure is flattened, so it is not
     * recommended that you use wildcards.
     */
    vendor_files: {
      js: [
        'vendor/angular/angular.js',
        'vendor/angular-resource/angular-resource.js',
        'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'vendor/placeholders/angular-placeholders-0.0.1-SNAPSHOT.min.js',
        'vendor/angular-ui-router/release/angular-ui-router.js',
        'vendor/angular-ui-utils/modules/route/route.js',
        'vendor/angular-event-emitter/angular-event-emitter.js'
      ],
      css: [],
      assets: [
        'vendor/font-awesome/fonts/fontawesome-webfont.eot',
        'vendor/font-awesome/fonts/fontawesome-webfont.svg',
        'vendor/font-awesome/fonts/fontawesome-webfont.ttf',
        'vendor/font-awesome/fonts/fontawesome-webfont.woff',
        'vendor/font-awesome/fonts/fontawesome-webfont.woff2',
        'vendor/font-awesome/fonts/FontAwesome.otf'
      ]
    }
  };

  /** ********************************************************************************* */
  /** **************************** Task Config **************************************** */
  var taskConfig = {
    pkg: grunt.file.readJSON("package.json"),
    cordovacli: {
      options: {
        path: 'cordova',
        cli: 'cordova'
      },
      cordova: {
        options: {
          command: ['create', 'platform', 'plugin', 'build'],
          platforms: ['android'],
          plugins: [],
          path: 'cordova',
          id: 'us.peckenpaugh.emDoMsc',
          name: 'EmDo Microcosm Scorer'
        }
      },
      create: {
        options: {
          command: 'create',
          id: 'com.myHybridApp',
          name: 'myHybridApp'
        }
      },
      add_platforms: {
        options: {
          command: 'platform',
          action: 'add',
          platforms: ['ios', 'android']
        }
      },
      add_plugins: {
        options: {
          command: 'plugin',
          action: 'add',
          plugins: [
            'battery-status',
            'camera',
            'console',
            'contacts',
            'device',
            'device-motion',
            'device-orientation',
            'dialogs',
            'file',
            'geolocation',
            'globalization',
            'inappbrowser',
            'media',
            'media-capture',
            'network-information',
            'splashscreen',
            'vibration'
          ]
        }
      },
      remove_plugin: {
        options: {
          command: 'plugin',
          action: 'rm',
          plugins: [
            'battery-status'
          ]
        }
      },
      build_ios: {
        options: {
          command: 'build',
          platforms: ['ios']
        }
      },
      build_android: {
        options: {
          command: 'build',
          platforms: ['android']
        }
      },
      emulate_android: {
        options: {
          command: 'emulate',
          platforms: ['android'],
          args: ['--target', 'Nexus5']
        }
      }
    },
    /**
     * The banner is the comment that is placed at the top of our compiled
     * source files. It is first processed as a Grunt template, where the 'less than percent equals'
     * pairs are evaluated based on this very configuration object.
     */
    meta: {
      banner: '/**\n' +
        ' * <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %>\n' +
        ' *\n' +
        ' * Copyright (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n' +
        ' */\n'
    },


    clean: {
      all: [
        '<%= build_dir %>',
        '<%= compile_dir %>'
      ],
      vendor: [
        '<%= build_dir %>/vendor/'
      ],
      index: ['<%= build_dir %>/index.html']
    },

    copy: {
      build_app_assets: {
        files: [{
          src: ['**'],
          dest: '<%= build_dir %>/assets/',
          cwd: 'src/assets',
          expand: true
        }]
      },
      build_vendor_assets: {
        files: [{
          src: ['<%= vendor_files.assets %>'],
          dest: '<%= build_dir %>/assets/',
          cwd: '.',
          expand: true,
          flatten: true
        }]
      },
      build_appjs: {
        files: [{
          src: ['<%= app_files.js %>'],
          dest: '<%= build_dir %>/',
          cwd: '.',
          expand: true
        }]
      },
      build_vendorjs: {
        files: [{
          src: ['<%= vendor_files.js %>'],
          dest: '<%= build_dir %>/',
          cwd: '.',
          expand: true
        }]
      },
      buildmock_vendorjs: {
        files: [{
          src: ['<%= vendor_files.js %>', '<%= test_files.js %>'],
          dest: '<%= build_dir %>/',
          cwd: '.',
          expand: true
        }]
      },
      build_vendorcss: {
        files: [{
          src: ['<%= vendor_files.css %>'],
          dest: '<%= build_dir %>/',
          cwd: '.',
          expand: true
        }]
      },
      compile_assets: {
        files: [{
          src: ['**'],
          dest: '<%= compile_dir %>/assets',
          cwd: '<%= build_dir %>/assets',
          expand: true
        }]
      }
    },

    concat: {
      // The 'build_css' target concatenates compiled CSS and vendor CSS together.
      build_css: {
        src: [
          '<%= vendor_files.css %>',
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ],
        dest: '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
      },
      // The 'compile_js' target concatenates app and vendor js code together.
      compile_js: {
        options: {
          banner: '<%= meta.banner %>'
        },
        src: [
          '<%= vendor_files.js %>',
          'module.prefix',
          '<%= build_dir %>/src/**/*.module.js',
          '<%= build_dir %>/src/**/*.js',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          'module.suffix'
        ],
        dest: '<%= compile_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.js'
      }
    },

    coffee: {
      source: {
        options: {
          bare: true
        },
        expand: true,
        cwd: '.',
        src: ['<%= app_files.coffee %>'],
        dest: '<%= build_dir %>',
        ext: '.js'
      }
    },
    ngAnnotate: {
      options: {
        singleQuotes: true
      },
      build: {
        files: [
          {
            src: ['<%= app_files.js %>'],
            cwd: '<%= build_dir %>',
            dest: '<%= build_dir %>',
            expand: true
          },
        ]
      },
    },
    uglify: {
      compile: {
        options: {
          banner: '<%= meta.banner %>'
        },
        files: {
          '<%= concat.compile_js.dest %>': '<%= concat.compile_js.dest %>'
        }
      }
    },
    less: {
      build: {
        files: {
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>'
        }
      },
      compile: {
        files: {
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css': '<%= app_files.less %>'
        },
        options: {
          cleancss: true,
          compress: true
        }
      }
    },
    jshint: {
      src: [
        '<%= app_files.js %>'
      ],
      test: [
        '<%= app_files.jsunit %>'
      ],
      gruntfile: [
        'Gruntfile.js'
      ],
      options: {
        curly: true,
        immed: true,
        newcap: true,
        noarg: true,
        sub: true,
        boss: true,
        eqnull: true
      },
      globals: {}
    },
    coffeelint: {
      src: {
        files: {
          src: ['<%= app_files.coffee %>']
        }
      },
      test: {
        files: {
          src: ['<%= app_files.coffeeunit %>']
        }
      }
    },
    html2js: {
      app: {
        options: {
          base: 'src/app'
        },
        src: ['<%= app_files.appTemplates %>'],
        dest: '<%= build_dir %>/templates-app.js'
      },
      common: {
        options: {
          base: 'src/common'
        },
        src: ['<%= app_files.commonTemplates %>'],
        dest: '<%= build_dir %>/templates-common.js'
      }
    },

    index: {
      build: {
        appName: 'emDoScore',
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= build_dir %>/src/**/*.module.js',
          '<%= build_dir %>/src/**/*.js',
          '<%= html2js.common.dest %>',
          '<%= html2js.app.dest %>',
          '<%= vendor_files.css %>',
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      },

      mock: {
        appName: 'mockApp',
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= test_files.js %>',
          '<%= build_dir %>/src/**/*.module.js',
          '<%= build_dir %>/src/**/*.js',
          '<%= html2js.common.dest %>',
          '<%= html2js.app.dest %>',
          '<%= vendor_files.css %>',
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      },
      compile: {
        appName: 'emDoScore',
        dir: '<%= compile_dir %>',
        src: [
          '<%= concat.compile_js.dest %>',
          '<%= vendor_files.css %>',
          '<%= build_dir %>/assets/<%= pkg.name %>-<%= pkg.version %>.css'
        ]
      }
    },
    express: {
      devServer: {
        options: {
          port: 9000,
          hostname: 'localhost',
          serverreload: false,
          bases: 'build',
          livereload: true
        }
      }
    },
    karma: {
      options: {
        configFile: '<%= build_dir %>/karma-unit.js'
      },
      unit: {
        runnerPort: 9019,
        background: true
      },
      continuous: {
        singleRun: true
      }
    },
    karmaconfig: {
      unit: {
        dir: '<%= build_dir %>',
        src: [
          '<%= vendor_files.js %>',
          '<%= html2js.app.dest %>',
          '<%= html2js.common.dest %>',
          '<%= test_files.js %>'
        ]
      }
    },
    delta: {
      options: {
        livereload: true
      },
      gruntfile: {
        files: 'Gruntfile.js',
        tasks: ['jshint:gruntfile', 'clean:vendor', 'copy:build_vendorjs', 'copy:build_vendorcss', 'index:build'],
        options: {
          livereload: false
        }
      },
      jssrc: {
        files: [
          '<%= app_files.js %>'
        ],
        tasks: ['jshint:src', 'karma:unit:run', 'copy:build_appjs', 'index:build']
      },
      coffeesrc: {
        files: [
          '<%= app_files.coffee %>'
        ],
        tasks: ['coffeelint:src', 'coffee:source', 'karma:unit:run', 'copy:build_appjs', 'index:build']
      },
      assets: {
        files: [
          'src/assets/**/*'
        ],
        tasks: ['copy:build_app_assets']
      },
      html: {
        files: ['<%= app_files.html %>'],
        tasks: ['index:build']
      },
      tpls: {
        files: [
          '<%= app_files.appTemplates %>',
          '<%= app_files.commonTemplates %>'
        ],
        tasks: ['html2js']
      },
      less: {
        files: ['src/**/*.less'],
        tasks: ['less:build']
      },
      jsunit: {
        files: [
          '<%= app_files.jsunit %>'
        ],
        tasks: ['jshint:test', 'karma:unit:run'],
        options: {
          livereload: false
        }
      },
      coffeeunit: {
        files: [
          '<%= app_files.coffeeunit %>'
        ],
        tasks: ['coffeelint:test', 'karma:unit:run'],
        options: {
          livereload: false
        }
      }
    }
  };


  /** ********************************************************************************* */
  /** **************************** Project Configuration ****************************** */
  // The following chooses some watch tasks based on whether we're running in mock mode or not.
  //  Our watch (delta above) needs to run a different index task and copyVendorJs task
  //  in several places if "grunt watchmock" is run.
  taskName = grunt.cli.tasks[0]; // the name of the task from the command line (e.g. "grunt watch" => "watch")
  var indexTask = taskName === 'watchmock' ? 'index:mock' : 'index:build';
  var copyVendorJsTask = taskName === 'watchmock' ? 'copy:buildmock_vendorjs' : 'copy:build_vendorjs';
  taskConfig.delta.gruntfile.tasks = ['jshint:gruntfile', 'clean:vendor', copyVendorJsTask, 'copy:build_vendorcss', indexTask];
  taskConfig.delta.jssrc.tasks = ['jshint:src', 'copy:build_appjs', indexTask];
  taskConfig.delta.coffeesrc.tasks = ['coffeelint:src', 'coffee:source', 'karma:unit:run', 'copy:build_appjs', indexTask];
  taskConfig.delta.html.tasks = [indexTask];

  // Take the big config objects we defined above, combine them, and feed them into grunt
  grunt.initConfig(_.assign(taskConfig, fileConfig));

  // In order to make it safe to just compile or copy *only* what was changed,
  // we need to ensure we are starting from a clean, fresh build. So we rename
  // the 'watch' task to 'delta' (that's why the configuration var above is
  // 'delta') and then add a new task called 'watch' that does a clean build
  // before watching for changes.
  grunt.renameTask('watch', 'delta');
  grunt.registerTask('watch', ['build', 'karma:unit', 'express', 'delta']);
  // watchmock is just like watch, but includes testing resources for using $httpBackend
  grunt.registerTask('watchmock', ['buildmock', 'karma:unit', 'express', 'delta']);

  // The default task is to build and compile.
  grunt.registerTask('default', ['build', 'compile']);


  // The 'build' task gets your app ready to run for development and testing.
  grunt.registerTask('build', [
    'clean:all', 'html2js', 'jshint', 'coffeelint', 'coffee', 'less:build',
    'concat:build_css', 'copy:build_app_assets', 'copy:build_vendor_assets',
    'copy:build_appjs', 'copy:build_vendorjs', 'copy:build_vendorcss', 'ngAnnotate:build', 'index:build', 'karmaconfig',
    'karma:continuous'
  ]);

  // just like build, but includes testing resources for using $httpBackend and switches to mock application in index.html
  grunt.registerTask('buildmock', [
    'clean:all', 'html2js', 'jshint', 'coffeelint', 'coffee', 'less:build',
    'concat:build_css', 'copy:build_app_assets', 'copy:build_vendor_assets',
    'copy:build_appjs', 'copy:buildmock_vendorjs', 'copy:build_vendorcss', 'ngAnnotate:build', 'index:mock', 'karmaconfig',
    'karma:continuous'
  ]);

  // The 'compile' task gets your app ready for deployment by concatenating and minifying your code.
  // Note - compile builds off of the build dir (look at concat:compile_js), so run grunt build before grunt compile
  grunt.registerTask('compile', [
    'less:compile', 'concat:build_css', 'copy:compile_assets', 'concat:compile_js', 'uglify', 'index:compile'
  ]);

  // The debug task is just like watch without any of the testing.
  //  This is good for debugging issues that cause 'grunt watch' to fail due to test errors.
  //  Just 'grunt debug' and debug your app within a browser, then go back to grunt watch once you've
  //  fixed the problem.  You'll usually see the source of the problem right away in the console.
  grunt.registerTask('debug', [
    'clean:all', 'html2js', 'jshint', 'less:build',
    'concat:build_css', 'copy:build_app_assets', 'copy:build_vendor_assets',
    'copy:build_appjs', 'copy:build_vendorjs', 'copy:build_vendorcss', 'ngAnnotate:build', 'index:build', 'express', 'delta'
  ]);

  // A utility function to get all app JavaScript sources.
  function filterForJS(files) {
    return files.filter(function(file) {
      return file.match(/\.js$/);
    });
  }

  // A utility function to get all app CSS sources.
  function filterForCSS(files) {
    return files.filter(function(file) {
      return file.match(/\.css$/);
    });
  }

  // The index.html template includes the stylesheet and javascript sources
  // based on dynamic names calculated in this Gruntfile. This task assembles
  // the list into variables for the template to use and then runs the
  // compilation.
  grunt.registerMultiTask('index', 'Process index.html template', function() {
    var dirRE = new RegExp('^(' + grunt.config('build_dir') + '|' + grunt.config('compile_dir') + ')\/', 'g');

    // this.fileSrc comes from either build:src, compile:src, or karmaconfig:src in the index config defined above
    // see - http://gruntjs.com/api/inside-tasks#this.filessrc for documentation
    var jsFiles = filterForJS(this.filesSrc).map(function(file) {
      return file.replace(dirRE, '');
    });
    var cssFiles = filterForCSS(this.filesSrc).map(function(file) {
      return file.replace(dirRE, '');
    });

    var app = this.data.appName;

    // this.data.dir comes from either build:dir, compile:dir, or karmaconfig:dir in the index config defined above
    // see - http://gruntjs.com/api/inside-tasks#this.data for documentation
    grunt.file.copy('src/index.html', this.data.dir + '/index.html', {
      process: function(contents, path) {
        // These are the variables looped over in our index.html exposed as "scripts", "styles", and "version"
        return grunt.template.process(contents, {
          data: {
            appName: app,
            scripts: jsFiles,
            styles: cssFiles,
            version: grunt.config('pkg.version'),
            author: grunt.config('pkg.author'),
            date: grunt.template.today("yyyy")
          }
        });
      }
    });
  });

  // In order to avoid having to specify manually the files needed for karma to
  // run, we use grunt to manage the list for us. The 'karma/*' files are
  // compiled as grunt templates for use by Karma. Yay!
  grunt.registerMultiTask('karmaconfig', 'Process karma config templates', function() {
    var jsFiles = filterForJS(this.filesSrc);

    grunt.file.copy('karma/karma-unit.tpl.js', grunt.config('build_dir') + '/karma-unit.js', {
      process: function(contents, path) {
        // This is the variable looped over in the karma template of our index.html exposed as "scripts"
        return grunt.template.process(contents, {
          data: {
            scripts: jsFiles
          }
        });
      }
    });
  });
};
