const gulp = require('gulp');
const less = require('gulp-less');                      // less编译
const browsersync = require('browser-sync').create();   // 获取browsersync,自动刷新
const mincss = require("gulp-minify-css");              // css压缩
const uglify = require('gulp-uglify');                  // js压缩
const minhtml = require("gulp-minify-html");            // html压缩
const minimg = require('gulp-imagemin');                // img压缩
const del = require('del');                             // 删除dist目录下文件
const plumber = require('gulp-plumber');                // 出现异常不终止监听
const autoprefixer = require('gulp-autoprefixer');      // css添加浏览器前缀
const babel = require('gulp-babel');                    // es6转es5
const concat = require("gulp-concat");                  // 文件合并
const base64 = require('gulp-base64');                  // 小图片base64优化
const changed = require('gulp-changed');                // 文件缓存

// 删除dist目录下的所以文件
gulp.task('delete', (cb) => {
    return del(['dist/*'], cb)
})

// 删除src目录下的css文件夹内容
gulp.task('deletecss', (cb) => {
    return del('src/css/*', cb)
})

// less编译压缩
gulp.task('less', () => {
    gulp.src(['src/less/**/*.less'])
        .pipe(plumber())
        .pipe(changed("dist"))
        .pipe(less())
        .pipe(gulp.dest('src/css'))
        .pipe(autoprefixer())
        .pipe(base64())
        .pipe(mincss())
        .pipe(gulp.dest('dist/css'))
        .pipe(browsersync.stream())
})

// js编译
gulp.task('js', () => {
    gulp.src('src/js/**/*.js')
        .pipe(plumber())
        .pipe(babel({
            presets: ['es2015']
        }))
        .pipe(changed("dist/js"))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(browsersync.stream())
})

// html编译
gulp.task('html', () => {
    gulp.src('src/**/*.html')
        .pipe(plumber())
        .pipe(changed("dist"))
        .pipe(minhtml())
        .pipe(gulp.dest('dist'))
        .pipe(browsersync.stream())
});

// img编译
gulp.task('img', () => {
    gulp.src("src/img/**/*.{png,jpg,jpeg,gif}")
        .pipe(plumber())
        .pipe(changed("dist"))
        .pipe(minimg())
        .pipe(gulp.dest('dist/img'))
    gulp.src("src/favicon.ico")
        .pipe(plumber())
        .pipe(changed("dist"))
        .pipe(minimg())
        .pipe(gulp.dest('dist'))
})

// 第三方工具
gulp.task('lib', () => {
    gulp.src('src/lib/**')
        .pipe(gulp.dest('dist/lib'))
})

// 启用热加载服务
gulp.task('serve', ['delete', 'deletecss'], () => {
    // 需要监听的方法(重要)
    gulp.start('js', 'html', 'less', 'img', 'lib')
    browsersync.init({
        port: 5566,
        server: {
            baseDir: ['dist']
        }
    });
    // 当指定的less文件发生改变时（参数一），调用指定模块（参数二）
    gulp.watch('src/js/**', ['js'])
    gulp.watch('src/components/**', ['js'])
    gulp.watch('src/img/*.*', ['img'])
    gulp.watch('src/img/**', ['img'])
    gulp.watch('src/*.html', ['html'])
    gulp.watch('src/views/**', ['html'])
    gulp.watch('src/less/**', ['less'])
    gulp.watch('src/lib/*', ['lib'])
});

// 运行gulp后会默认执行default中的所有任务
gulp.task('default', ['serve'])






