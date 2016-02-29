var Base = function() {
    this.url = process.cwd();
    this.cur = '/sass/';
    this.cssTarget = '/css/';
    this.htmlTarget = '/html/';
    this.imagesTarget = '/images/';
    this.fileLabe = 'file://';
    this.sPort = 3000;
    this.sNode_modules = 'FED';
    this.pathReg = '^v([0-9]\.[0-9])*?';
    return {
        pathCss: this.sGetMark(this.cssTarget),
        pathSass: this.url,
        pathHtml: this.sGetMark(this.htmlTarget),
        pathImg: this.sGetMark(this.imagesTarget),
        pathSever: this.sGetSeverPath(),
        domain: 'http://localhost:' + this.sPort + '/' + this.getSeverPath(this.htmlTarget),
        domainImg: 'http://localhost:' + this.sPort + '/' + this.getSeverPath(this.imagesTarget),
        DIYPath: this.pushCustomize('/css/', this.pathReg),
        pluginPath: this.sGetSeverPath() + 'node_modules/',
        morPath: this.url,
        fileLabe: this.fileLabe,
        isPC: this.isPC(),
        relativePath: this.relativePath('/css/', '/images/')
    }
};
Base.prototype.sGetMark = function(pushPath) {
    return this.url.replace(RegExp(this.cur), pushPath);
};
Base.prototype.sGetSeverPath = function() {
    var path = this.url,
        module = this.sNode_modules;
    return path.slice(0, path.indexOf(module) + module.length + 1);
}
Base.prototype.getSeverPath = function(pushPath) {
    var path = this.sGetMark(pushPath),
        SeverPathIndex = path.indexOf(this.sNode_modules) + this.sNode_modules.length + 1;
    return path.slice(SeverPathIndex, path.length);
};
Base.prototype.pushCustomize = function(type, sPath) {
    var path = this.url,
        reg = RegExp(sPath, 'i'),
        pathArr = [],
        newPathArr = [];
    path = path.replace(RegExp(this.cur), type);

    // if (!this.isMac()) {
    if (true) {
        pathArr = path.split('/')
    } else {
        // pathArr = path.split('/\')
    }
    path = path.replace(RegExp(this.cur), type);

    for (var i = 0; i <= pathArr.length; i++) {
        if (!reg.test(pathArr[i]))
            newPathArr.push(pathArr[i]);

    }
    newPathArr = newPathArr.join('/');
    newPathArr = newPathArr.slice(0, newPathArr.length - 1);

    // if (this.isMac()) {
    if (true)
        return newPathArr;
    return newPathArr
};
Base.prototype.isMac = function() {
    if (process.platform == 'darwin')
        return true;
    return false;

};
Base.prototype.isPC = function() {
    var reg = RegExp('/pc/'),
        isExist = reg.test(this.url);
    if (isExist)
        return true;
    return false;

};
Base.prototype.pathGet = function(pathStr) {
    var reg = RegExp('css');
    if (reg.test(pathStr)) {
        var _localPath = this.pushCustomize(pathStr, this.pathReg);
    } else {
        var _localPath = this.sGetMark(pathStr);
    };

    var locaStrLen = _localPath.indexOf(pathStr);
    var locaPathStr = _localPath.slice(locaStrLen, _localPath.length);
    var locaArr = locaPathStr.split('/');
    var locaArrLen = locaPathStr.split('/').length;
    var locaPathStrSub = locaPathStr.slice(1, locaPathStr.length);
    return {
        locaPathStr: locaPathStr,
        locaArr: locaArr,
        locaArrLen: locaArrLen,
        locaPathStrSub: locaPathStrSub
    }
};
Base.prototype.relativePath = function() {
    var _css = this.pathGet(arguments[0]);
    var _img = this.pathGet(arguments[1]);
    var _relate = new Array(_css.locaArrLen).join('../');
    return _relate + _img.locaPathStrSub + '/';
}
var WDO = new Base();



// console.log('-cssPath:=====' + WDO.pathCss);
// console.log('sassPath:=====' + WDO.pathSass);
// console.log('htmlPath:=====' + WDO.pathHtml);
// console.log('imagPath:=====' + WDO.pathImg);
// console.log('sevePath111:=====' + WDO.pathSever);
// console.log('domaPath:=====' + WDO.domain);
// console.log('DIYPath:=====' + WDO.DIYPath);
// console.log('domaImag:=====' + WDO.domainImg);


var lr = require(WDO.pluginPath + 'tiny-lr'),
    server = lr(),
    gulp = require(WDO.pluginPath + 'gulp'),
    sass = require(WDO.pluginPath + 'gulp-sass'),
    autoprefixer = require(WDO.pluginPath + 'autoprefixer'),
    livereload = require(WDO.pluginPath + 'gulp-livereload'),
    opn = require(WDO.pluginPath + 'opn'),
    clean = require(WDO.pluginPath + 'gulp-clean'),
    imagemin = require(WDO.pluginPath + 'gulp-imagemin'),
    imageminJpegRecompress = require('imagemin-jpeg-recompress'),
    imageminOptipng = require('imagemin-optipng'),
    postcss = require(WDO.pluginPath + 'gulp-postcss'),
    postcss2 = require(WDO.pluginPath + 'postcss'),
    cssgrace = require(WDO.pluginPath + 'cssgrace'),
    cssnext = require(WDO.pluginPath + '/' + 'cssnext'),
    cssnano = require(WDO.pluginPath + 'cssnano'),
    lost = require(WDO.pluginPath + 'lost'),
    browserSync = require(WDO.pluginPath + 'browser-sync').create(),
    sprites = require(WDO.pluginPath + 'postcss-sprites').default,
    updateRule = require(WDO.pluginPath + 'postcss-sprites').updateRule,
    postcssSorting = require(WDO.pluginPath + "postcss-sorting"),
    Short = require(WDO.pluginPath + "postcss-short"),
    assets = require(WDO.pluginPath + 'postcss-assets'),
    nano = require(WDO.pluginPath + 'gulp-cssnano'),
    cssMqpacker = require(WDO.pluginPath + 'css-mqpacker');



//服务器任务:以dist文件夹为基础,启动服务器;
//命令行使用gulp server启用此任务;
gulp.task('browserSync', function() {
    browserSync.init({
        server: {
            baseDir: WDO.pathSever,
            directory: true
        },
        open: false
    });
});
//通过浏览器打开本地 Web服务器代开本项目所需要文件夹
gulp.task('openbrowser', function() {
    opn(WDO.domain);
    opn(WDO.fileLabe + WDO.pathHtml);
    opn(WDO.fileLabe + WDO.pathCss);
    opn(WDO.fileLabe + WDO.pathImg);
});
//通过浏览器打开本地 Web服务器代开本项目所需要文件夹
gulp.task('imgOpen', function() {
    opn(WDO.fileLabe + WDO.pathImg);
});

//多余文件删除
gulp.task('clean', function() {
    return gulp.src(WDO.url + '/' + '.sass-cache')
        .pipe(clean({ force: true }))
        .pipe(gulp.dest(WDO.morPath + '/' + 'clean'));
});

//命令行使用gulp jpgmin启用此任务;
gulp.task('imgmin', function() {
    var jpgmin = imageminJpegRecompress({
            accurate: true, //高精度模式
            quality: "high", //图像质量:low, medium, high and veryhigh;
            method: "smallfry", //网格优化:mpe, ssim, ms-ssim and smallfry;
            min: 70, //最低质量
            loops: 0, //循环尝试次数, 默认为6;
            progressive: false, //基线优化
            subsample: "default" //子采样:default, disable;
        }),
        pngmin = imageminOptipng({
            optimizationLevel: 4
        });
    gulp.src(WDO.pathImg + '/*')
        .pipe(imagemin({
            use: [jpgmin, pngmin]
        }))
        .pipe(gulp.dest(WDO.pathImg));
});


// postcss与sass结合体
gulp.task('css', function() {
    var processors = [
        sprites({
            stylesheetPath: WDO.pathCss,
            spritePath: WDO.pathImg,
            basePath: WDO.pathImg + '/icon',
            hooks: {
                onUpdateRule: function(rule, token, image) {
                    if (WDO.isPC) {
                        var backgroundImage = postcss2.decl({
                            prop: 'background-image',
                            value: 'url(' + image.spriteUrl + ')'
                        });

                        var backgroundSize = postcss2.decl({
                            prop: 'background-size',
                            value: Math.ceil(image.spriteWidth / 1) + 'px ' + Math.ceil(image.spriteHeight / 1) + 'px '
                        });

                        var backgroundPosition = postcss2.decl({
                            prop: 'background-position',
                            value: Math.ceil(image.coords.x / 1) + 'px ' + Math.ceil(image.coords.y / 1) + 'px '
                        });

                        var minSpriteWidth = postcss2.decl({
                            prop: 'width',
                            value: Math.ceil(image.coords.width / 1) + 'px'
                        });

                        var minSpriteHeight = postcss2.decl({
                            prop: 'height',
                            value: Math.ceil(image.coords.height / 1) + 'px'
                        });
                    } else {
                        var backgroundImage = postcss2.decl({
                            prop: 'background-image',
                            value: 'url(' + image.spriteUrl + ')'
                        });

                        var backgroundSize = postcss2.decl({
                            prop: 'background-size',
                            value: Math.ceil(image.spriteWidth / 2) + 'px ' + Math.ceil(image.spriteHeight / 2) + 'px '
                        });

                        var backgroundPosition = postcss2.decl({
                            prop: 'background-position',
                            value: Math.ceil(image.coords.x / 2) + 'px ' + Math.ceil(image.coords.y / 2) + 'px '
                        });

                        var minSpriteWidth = postcss2.decl({
                            prop: 'width',
                            value: Math.ceil(image.coords.width / 2) + 'px'
                        });

                        var minSpriteHeight = postcss2.decl({
                            prop: 'height',
                            value: Math.ceil(image.coords.height / 2) + 'px'
                        });
                    }

                    rule.insertAfter(token, backgroundImage);
                    rule.insertAfter(backgroundImage, backgroundPosition);
                    rule.insertAfter(backgroundPosition, backgroundSize);
                    rule.insertAfter(minSpriteWidth, minSpriteWidth);
                    rule.insertAfter(minSpriteHeight, minSpriteHeight);
                }
            },
            filterBy: function(image) {
                if (!/\icon/.test(image.url))
                    return Promise.reject();
                return Promise.resolve();
            }
        }),
        autoprefixer({
            browsers: ['> 1%', 'last 2 versions', 'ie 6-11']
        }),
        cssgrace,
        postcssSorting,
        Short,
        cssMqpacker({
            sort: true
        })
        // stylelint()
        // ,
        //require("autorem")({
        //legacy: true,
        //baseFontSize: 10
        //}),
        //cssnext(),
        // lost()
    ];


    return gulp.src(WDO.pathSass + '/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(postcss(processors))
        .pipe(nano({ discardComments: { removeAll: true } }))
        .pipe(postcss([assets({
            loadPaths: [WDO.pathImg],
            baseUrl: WDO.relativePath,
            relative: true,
            // cachebuster: true

        })]))
        .pipe(gulp.dest(WDO.DIYPath));
});



//文件监控
gulp.task('watch', function() {
    server.listen(35729, function(err) {
        if (err)
            return console.log(err);
    });
    gulp.watch(WDO.pathSass + '/*.scss', ['css']);
    gulp.watch([WDO.pathSass + '/*.scss', WDO.pathHtml + '/*.html', WDO.pathSass + '/*.css'], function(e) {
        server.changed({
            body: {
                files: [e.path]
            }
        });
    });
    gulp.watch([WDO.pathSass + '/*.scss', WDO.pathHtml + '/*.html', WDO.pathSass + '/*.css']).on('change', browserSync.reload);
});

//默认任务
gulp.task('default', function() {
    console.log('Starting Gulp tasks, enjoy coding!');
    gulp.run('css');
    gulp.run('watch');
    gulp.run('browserSync');
    // gulp.run('openbrowser');
});
//压缩
gulp.task('min', function() {
    console.log('Starting Gulp tasks, enjoy coding!');
    gulp.run('css');
    gulp.run('imgmin');
    gulp.run('watch');
    gulp.run('imgOpen');
});
