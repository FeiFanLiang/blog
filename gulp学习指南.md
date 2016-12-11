# gulp学习指南

#### 安装gulp

这个一般都知道，就不再赘述了。

```
npm install -g gulp //全局安装
npm install --save-dev gulp //项目中安装
```

#### 常用的Gulp插件

1. [gulp-less](https://www.npmjs.com/package/gulp-less) 

   - 用于编译less，用法简单，可以直接上手

2. [gulp-jshint](https://www.npmjs.com/package/gulp-jshint)

   - 用于检查js代码规范，需要配合`jshint`插件使用

3. [del](https://www.npmjs.com/package/del) 

   - 用于删除文件或者文件夹

   - 一般在移动或者复制文件之前都需要清理目标文件夹，所以在执行task时，需要顺序执行，一般这么设置该任务

     ```javascript
     gulp.task('clean',function(cb){
     	plugins.del(['./public/*']).then(function(){
     		cb();
     	})
     });
     ```

4. [gulp-nodemon](https://www.npmjs.com/package/gulp-nodemon)

   - 该插件主要用于监听node项目文件变化时，自动重启项目
   - 这个插件一开始用的时候会踩坑，比如配置项`ext`是制定监听哪些格式的文件变化时重启项目，如果什么都不指定，则默认监听该项目的所有文件。当设置了指定格式文件之后，最好还需要配置下`watch`配置项，配置监听哪些文件夹下的文件，如果不指定的话，还是默认为整个项目。
   - 该插件配合`browser-sync`插件可以实现实时更新，这个在开发的时候用起来还是很爽的，再也不用使劲按刷新键了:)

5. [browser-sync](https://www.browsersync.io/)

   - 用于浏览器同步刷新的插件，如果是纯前端项目的话，使用和配置比较方便，如果项目结合了`node`的话，可以结合`gulp-nodemon`插件使用

6. [main-bower-files](https://github.com/ck86/main-bower-files)

   - 用于提取`bower`安装的依赖的主要文件

   - 项目中使用`gulp`+`bower`进行项目构建时，可以使用这个插件，快速将`bower`安装的依赖中的主要文件复制到目标文件夹。

   - 这个插件提取主要文件是依靠所安装的依赖包的根目录中的`bower.json`文件中的`main`字段中所列的文件进行提取的，所以当我们安装的依赖没有`bower.json`或者`main`字段中没有设置文件时，就无法提取到主要文件了，这时候需要我们自己在我们项目的根目录中的`bower.json`文件中加一个`overrides`字段，来重写相应依赖的主要文件

     ```javascript
     // bower.json
     "overrides":{
       //bootstrap 有main字段，但是我们可以重写。换句话说，这边罗列我们想要提取出来的文件
         "bootstrap":{
           "main":[
             "dist/css/bootstrap.css",
             "dist/js/bootstrap.js",
             "dist/fonts/glyphicons-halflings-regular.eot",
             "dist/fonts/glyphicons-halflings-regular.svg",
             "dist/fonts/glyphicons-halflings-regular.ttf",
             "dist/fonts/glyphicons-halflings-regular.woff"]
         },
       // jquery 中没有bower.json这个文件，我们需要自己重写。
         "jquery":{
           "main":[
             "jquery.js"
           ]
         }
       
      //gulpfile.js
       var mainBowerFiles = require('main-bower-files');
       gulp.task('devFile',['clean'],function(cb){
     	gulp.src(mainBowerFiles(),{base:'bower_components'})
     		.pipe(gulp.dest('public/libs'));
     	cb();
     });
     ```

     ​

7. [gulp-autoprefixer](https://www.npmjs.com/package/gulp-autoprefixer)

   - 是一个给`css`添加浏览器前缀的插件，可以大大提高书写`css`代码的效率

8. [gulp-concat](https://www.npmjs.com/package/gulp-concat)

   - 是一个合并文件的插件

9. [gulp-uglify](https://www.npmjs.com/package/gulp-uglify) 

   - 是一个用来压缩代码的插件

10. [gulp-load-plugins](https://www.npmjs.com/package/gulp-load-plugins)

    - 是一个用来自动加载`gulp`插件的插件，使用这个插件之后，不再需要在`gulpfile.js`文件的开头使用大量的`require`来引用插件了，可以减少代码量。

    - 该插件配置加载插件是从`package.json`中读取的，所以需要配置加载的插件是`gulp`插件，一般配置为：

      ```javascript
      var plugins = require('gulp-load-plugins')({
          //当用到的插件不是以gulp-或者gulp.开头时，需要额外指出
      	pattern: ['gulp-*', 'gulp.*','main-bower-files','del'],
      	replaceString: /\bgulp[\-.]/
      });
      ```

      ​

#### Gulp配置文件

```javascript
/**
 * @Author zimplexing
 * @Date   2016/11/22
 */
var gulp = require('gulp');
var path = require('path');
var browserSync = require('browser-sync').create();

var plugins = require('gulp-load-plugins')({
	pattern: ['gulp-*', 'gulp.*','main-bower-files','del'],
	replaceString: /\bgulp[\-.]/
});

/*
 *	less预编译为css并生成sourcemap
 */
gulp.task('lessToCss',function(cb){
	gulp.src('src/less/**/*.less')
		.pipe(plugins.sourcemaps.init())
		.pipe(plugins.less())
		.pipe(plugins.sourcemaps.write())
		.pipe(gulp.dest('public/css'));
	cb();
});

/*
 * 检测js代码
 */
gulp.task('jshint',function(){
	return (
		gulp.src('src/js/**/*.js')
			.pipe(plugins.jshint())
	)
});

/*
 *	清除libs目录
 */
gulp.task('clean',function(cb){
	plugins.del(['./public/*']).then(function(){
		cb();
	})
});

//todo bootstrap的dist目录无法去除
/*
 *  开发环境
 */
gulp.task('devFile',['clean'],function(cb){
	gulp.src(plugins.mainBowerFiles(),{base:'bower_components'})
		.pipe(gulp.dest('public/libs'));
	cb();
});


gulp.task('browser-sync', ['develop'], function() {
	browserSync.init(null,{
		proxy: "http://localhost:3000/",
		files: ["public/css/**/*",'views/**/*'],
		browser: "chrome",
		port: 7000
	});
	gulp.watch('src/less/**/*',['lessToCss']);
});

gulp.task('develop',function(cb){
	var started = false;
	return plugins.nodemon({
		script:'./bin/www',
		ext:'js',
		watch:['./routes/**/*'],
		tasks: function (changedFiles) {
			var tasks = [];
			changedFiles.forEach(function (file) {
				if (path.extname(file) === '.js' && !~tasks.indexOf('jshint')) tasks.push('jshint');
				// if (path.extname(file) === '.less' && !~tasks.indexOf('lessToCss')) tasks.push('lessToCss');
			});
			return tasks
		}
	}).on('start',function(){
		if(!started) {
			cb();
			started = true;
		}
	})
});

gulp.task('dev', ['devFile','lessToCss','browser-sync']);
```



#### 参考文章

[Gulp官网](http://www.gulpjs.com.cn/)

[精通gulp的关键：文件路径匹配模式globs](http://yangbo5207.github.io/gulp/2016/08/10/new.html)

[gulp + expressjs + nodemon + browser-sync](https://gist.github.com/sogko/b53d33d4f3b40d3b4b2e)

[A Beginners Guide to Package Manager Bower and Using Gulp to Manage Components](http://andy-carter.com/blog/a-beginners-guide-to-package-manager-bower-and-using-gulp-to-manage-components)

[Automatically Load Gulp Plugins with gulp-load-plugins](http://andy-carter.com/blog/automatically-load-gulp-plugins-with-gulp-load-plugins)

[A Beginners Guide to the Task Runner Gulp](http://andy-carter.com/blog/a-beginners-guide-to-the-task-runner-gulp)

