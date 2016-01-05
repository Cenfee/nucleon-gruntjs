module.exports = function(grunt)
{
    
    var setting = require('./setting');
	
	
    // 项目配置
    grunt.initConfig
	({
		
      pkg: grunt.file.readJSON('package.json'),
	  
	  //清理空间
      clean: ["build"], 
	  
	  //把所有的文件拷贝到build的目录里
	  copy: 
	  {
        build: 
		{
          files: 
		  [
            {
              expand: true,
              cwd: '../',
              src: '**.html',
              dest: 'build',
              filter: 'isFile'
            },
			//**/*.html  匹配整个目录树 html
			{
              expand: true,
              cwd: '../',
              src: 'asset/**',
              dest: 'build',
            },
			
			{
              expand: true,
              cwd: '../',
              src: 'script/**',
              dest: 'build',
            },
			
			{
              expand: true,
              cwd: '../',
              src: 'bower_components/**',
              dest: 'build',
            },
           
          ]
        },
        release: 
		{
          expand: true, 
          src: ['build/*.html'], 
          dest: 'html/',
          flatten: true,
          filter: 'isFile'
        },
      },
	  
	  
	  //压缩所有图片
	  imagemin: 
	  {
        image: 
		{
          options: 
		  {
            progressive: true
          },
          files: 
		  [{
            expand: true,                  // Enable dynamic expansion
            cwd: 'build/asset/',          // Src matches are relative to this path
            src: ['**/*.{png,jpg,gif}'],   // Actual patterns to match
            dest: 'build/asset/'          // Destination path prefix
          }]
        }
      },

		
	  
      //根据指定的html的css块，js块进行css压缩，js压缩，目标文件也是写在块上
	  /**
	 	<!-- build:css asset/index/index.css -->
		<link href="asset/index/index.css" rel="stylesheet">
		<link href="asset/index/index.css" rel="stylesheet">	
		<!-- endbuild -->
		
		<!-- build:js script/index/index.js -->
		<script type="text/javascript" src="script/index/index.js"></script>
		<script type="text/javascript" src="script/index/index.js"></script>
		<!-- endbuild -->
		**/
	  useminPrepare: 
	  {
        html: ['build/**/*.html'],  //合并的js和 css 的 块替换地址
        options: {
          dest: "build/"  //build的文件夹
        }
      },
	  
	  //所有资源文件添加MD5版本号
      filerev: 
	  {//下面三个都是表示在原文件上直接修改
        css: 
		{
          src: ['build/asset/**/*.css'],
        },
        js: 
		{
          src: ['build/script/**/*.js'],
        },
        image: 
		{
          src: ['build/asset/**/*.{png,jpg,gif}'],
        }
      },
	  
	  //根据指定的html，更新所有代码中的资源地址
	  usemin: 
	  { 
        html: ['build/**/*.html'], //将HTML中的静态资源进行文件名替换
        //css: ['build/asset/**/*.css'],//将CSS中的静态资源进行文件名替换，如果需要替换JS，可以在下面加一条。
        options: 
		{
           assetsDirs: ['build/'],//告诉usemin去哪里找filerev处理过的静态文件
        }
      },
	  
	  
	  //根据服务端配置，替换所有服务器路径信息
      cdn: 
	  {
        options: 
		{
          /** @required - root URL of your CDN (may contains sub-paths as shown below) */
          cdn: setting.cdnDomain,
          /** @optional  - if provided both absolute and relative paths will be converted */
          flatten: true,
          /** @optional  - if provided will be added to the default supporting types */
          //ejs is nodejs template, if you don't ejs, just ignore 
          supportedTypes: { 'ejs': 'html' }
        },
        dist: 
		{
          /** @required  - string (or array of) including grunt glob variables */
			src: 
			[
				'build/**/*.html',
				//'build/asset/**/*.css'
			],
        }
      },
	  
	  
	  //配置uglify js压缩，不压缩变量名， 例如ng参数名是注入的，有意义
		uglify: 
		{	
			options: 
			{
				mangle: false
			}
	  }
      
    });

    // 加载提供"uglify"任务的插件
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-usemin');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-filerev');
   // grunt.loadNpmTasks('grunt-cdn');
    grunt.loadNpmTasks('grunt-contrib-imagemin');

    // 默认任务
    grunt.registerTask('build', 
	[
	'clean', 
	'copy:build', 
	'imagemin', 
	
	'useminPrepare', 
	'concat', 
	'cssmin', 
	'uglify',  
	
	'filerev', 
	
	'usemin', 
	//'cdn',
	//'copy:release'
	]);
    grunt.registerTask('upload', 'Upload files to cdn', function() 
	{
      var done = this.async();
      
      var cdn = require('./cdn');
       
      cdn.upload();
    });
}
