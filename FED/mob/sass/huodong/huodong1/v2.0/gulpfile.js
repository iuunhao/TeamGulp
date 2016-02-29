 var sOpt = {
     sSass: 'sass',
     sHtml: 'htm',
     sCss: 'css',
     sImg: 'images',
     m: 'all',
     sNode_modules: 'FED',
     sUrl: process.cwd(),
     isRepeat: function() {
         var arr = this.sUrl.split('/');
         var hash = {};
         for (var i in arr) {
             if (hash[arr[i]])
                 return true;
             hash[arr[i]] = true;
         }
         return false;

     },
     sDest2: function() {
         // if (arguments[0] == 'alone') {
         var sUrl2 = this.sUrl.slice(0, this.sUrl.indexOf(this.sNode_modules) + this.sNode_modules.length + 1) + 'node_modules/';
         return sUrl2;
         // } else {
         //     var sUrl2 = this.sUrl;
         //     return sUrl2;
         // }
     }
 }
 switch (sOpt.m) {
     case 'alone':
         sOpt.isRepeat(sOpt.sUrl);
         var sSassUrl = sOpt.sUrl,
             sPackUrl = sOpt.sDest2(sOpt.m),
             sHtmlUrl = sOpt.sUrl.replace(sOpt.sSass, sOpt.html),
             sImgUrl = sOpt.sUrl.replace(sOpt.sSass, sOpt.sImg);
         break;
     default:
         if (sOpt.isRepeat(sOpt.sUrl)) {
             console.log('\x1B[43m\x1B[33m███████████████████████████████████████████████████████████\x1B[39m\x1B[49m');
             console.log('\x1B[31m您需要注意，您的路径中包含多个重复文件夹名称，我们将会以第一个重复位置的为您替换路径。\x1B[39m');
             console.log('您的原始路径为：' + '\x1B[33m' + sOpt.sUrl + '\x1b[0m');
             console.log('路径里包含多个：' + '\x1B[31m' + sOpt.sSass + '\x1B[39m');
             console.log('编译后的路径为：' + '\x1B[32m' + sDest + '\x1B[39m');
             console.log('\x1B[43m\x1B[33m███████████████████████████████████████████████████████████\x1B[39m\x1B[49m');
         }
         var sSassUrl = sOpt.sUrl.replace(sOpt.sSass, sOpt.sCss),
             sPackUrl = sOpt.sDest2(sOpt.m),
             sHtmlUrl = sOpt.sUrl.replace(sOpt.sSass, sOpt.html),
             sImgUrl = sOpt.sUrl.replace(sOpt.sSass, sOpt.sImg);
 }

 console.log('-------------------------------------------------------------');
 console.log(sSassUrl)
 console.log(sPackUrl)
 console.log(sHtmlUrl)
 console.log(sImgUrl)
 console.log('==============')
 console.log(sSassUrl + '/*.scss')
 console.log('-------------------------------------------------------------');

 var lr = require(sPackUrl + 'tiny-lr'),
     server = lr(),
     gulp = require(sPackUrl + 'gulp'),
     sass = require(sPackUrl + 'gulp-sass'),
     autoprefixer = require(sPackUrl + 'autoprefixer'),
     livereload = require(sPackUrl + 'gulp-livereload'),
     webserver = require(sPackUrl + 'gulp-webserver'),
     opn = require(sPackUrl + 'opn'),
     concat = require(sPackUrl + 'gulp-concat'),
     clean = require(sPackUrl + 'gulp-clean'),
     zip = require(sPackUrl + 'gulp-zip'),
     copy = require(sPackUrl + "gulp-copy"),
     imagemin = require(sPackUrl + 'gulp-imagemin'),
     pngquant = require(sPackUrl + 'imagemin-pngquant'),
     tinypng = require(sPackUrl + 'gulp-tinypng'),
     postcss = require(sPackUrl + 'gulp-postcss'),
     cssgrace = require(sPackUrl + 'cssgrace'),
     rename = require(sPackUrl + 'gulp-rename'),
     //cssnext  = require(sPackUrl+'/'+'cssnext'),
     sass = require(sPackUrl + 'gulp-sass'),
     cssnano = require(sPackUrl + 'cssnano'),
     lost = require(sPackUrl + 'lost');


 var config = {
         "project": "Gulp",
         "localserver": {
             "host": "localhost",
             "port": "8081"
         },
         "tinypngapi": "9SefQcfb3s7A7Ns7UvdO8TXp0DbHLwnG"
     }
     //开启本地 Web 服务器功能
 gulp.task('webserver', function() {
     gulp.src(sHtmlUrl)
         .pipe(webserver({
             host: config.localserver.host,
             port: config.localserver.port,
             livereload: true,
             directoryListing: false
         }));
 });

 //通过浏览器打开本地 Web服务器 路径
 gulp.task('openbrowser', function() {
     opn('http://' + sHtmlUrl + ':' + config.localserver.port);
 });

 //多余文件删除
 gulp.task('clean', function() {
     return gulp.src(sSassUrl + '/' + '.sass-cache')
         .pipe(clean({ force: true }))
         .pipe(gulp.dest(sSassUrl + '/' + 'clean'));
 });
 //压缩图片
 //压缩图片
 gulp.task('imagemin', function() {
     return gulp.src(sImgUrl + '/*')
         .pipe(imagemin({
             progressive: true,
             svgoPlugins: [{ removeViewBox: false }],
             use: [pngquant()]
         }))
         .pipe(gulp.dest(sImgUrl));
 });


 //压缩图片 - tinypng
 gulp.task('tinypng', function() {
     gulp.src(sImgUrl + '/*.{png,jpg,jpeg}')
         .pipe(tinypng(config.tinypngapi))
         .pipe(gulp.dest(sImgUrl));
 });

 //重命名project.md 文件
 // gulp.task('rename', function() {
 //     return gulp.src("./Project.md")
 //         .pipe(rename("README.md"))
 //         .pipe(gulp.dest("./build"));
 // });

 // postcss与sass结合体
 gulp.task('css', function() {
     var processors = [
         autoprefixer({
             browsers: ['last 2 version'],
             cascade: false,
             remove: false
         })
         // ,
         //require("autorem")({
         //legacy: true,
         //baseFontSize: 10
         //}),
         //cssnext(),
         // cssgrace,
         // lost()
     ];

     return gulp.src(sOpt.sUrl + '/*.scss')
         .pipe(sass().on('error', sass.logError))
         .pipe(postcss(processors))
         .pipe(gulp.dest(sSassUrl));
     // 路径设置
     // console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
 });


 //文件监控
 gulp.task('watch', function() {

     server.listen(35729, function(err) {
         if (err) {
             return console.log(err);
         }
     });

     gulp.watch(sSassUrl + '/*.scss', ['css']);

     gulp.watch([sSassUrl + '/*.scss', sHtmlUrl + '/*.html', sPackUrl + '/*.css'], function(e) {
         server.changed({
             body: {
                 files: [e.path]
             }
         });
     });

 });




 //默认任务
 gulp.task('default', function() {
     console.log('Starting Gulp tasks, enjoy coding!');
     gulp.run('css');
     gulp.run('imagemin');
     // gulp.run('tinypng');
     gulp.run('watch');
     gulp.run('webserver');
     gulp.run('openbrowser');
 });



 //打包主体build 文件夹并按照时间重命名
 // gulp.task('zip', function() {
 //     function checkTime(i) {
 //         if (i < 10) {
 //             i = "0" + i
 //         }
 //         return i
 //     }

 //     var d = new Date();
 //     var year = d.getFullYear();
 //     var month = checkTime(d.getMonth() + 1);
 //     var day = checkTime(d.getDate());
 //     var hour = checkTime(d.getHours());
 //     var minute = checkTime(d.getMinutes());

 //     return gulp.src('./build/**')
 //         .pipe(zip(config.project + '-' + year + month + day + hour + minute + '.zip'))
 //         .pipe(gulp.dest('./'));
 // });
