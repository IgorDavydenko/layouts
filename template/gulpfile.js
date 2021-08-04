const { src, dest } = require('gulp')

const autoprefixer = require('gulp-autoprefixer')
const browser_sync = require('browser-sync').create()
const clean_css = require('gulp-clean-css')
const del = require('del')
const fonter = require('gulp-fonter');
const fs = require('fs')
const group_media = require('gulp-group-css-media-queries')
const gulp = require('gulp')
const fileinclude = require('gulp-file-include')
const imagemin = require('gulp-imagemin')
const rename = require('gulp-rename')
const scss = require('gulp-sass')(require('sass'))
const svgSprite = require('gulp-svg-sprite')
const ttf2woff = require('gulp-ttf2woff')
const ttf2woff2 = require('gulp-ttf2woff2')
const uglify = require('gulp-uglify-es').default;
const webp = require('gulp-webp');
const webpHTML = require('gulp-webp-html')
const webp_css = require('gulp-webp-css')


const folder_dist = require('path').basename(`${__dirname}_build`)
const folder_sourse = "src"

const path = {
    build: {
        html: `${folder_dist}/`,
        css: `${folder_dist}/css/`,
        js: `${folder_dist}/js/`,
        img: `${folder_dist}/img/`,
        fonts: `${folder_dist}/fonts/`
    },
    srs: {
        html: [`${folder_sourse}/*.html`, `!${folder_sourse}/_*.html`],
        css: `${folder_sourse}/scss/style.scss`,
        js: `${folder_sourse}/js/script.js`,
        img: `${folder_sourse}/img/**/*.{jpg,png,svg,gif,ico,webp}`,
        fonts: `${folder_sourse}/fonts/*.ttf`
    },
    watch: {
        html: `${folder_sourse}/**/*.html`,
        css: `${folder_sourse}/scss/**/*.scss`,
        js: `${folder_sourse}/js/**/*.js`,
        img: `${folder_sourse}/img/**/*.{jpg,png,svg,gif,ico,webp}`
    },
    clean: `./${folder_dist}/`
}

function browserSync(params) {
    browser_sync.init({
        server: {
            baseDir: `./${folder_dist}/`
        },
        port: 3000,
        notify: false
    })
}

function html() {
    return src(path.srs.html)
            .pipe(fileinclude())
            .pipe(webpHTML())
            .pipe(dest(path.build.html))
            .pipe(browser_sync.stream())
}

function css() {
    return src(path.srs.css)
            .pipe(
                scss({
                    outputStyle: "expanded"
                })
            )
            .pipe(webp_css())
            .pipe(group_media())
            .pipe(
                autoprefixer({
                    overrideBrowserslist: ["last 5 versions"],
                    cascade: true
                })
            )
            .pipe(dest(path.build.css))
            .pipe(clean_css())
            .pipe(
                rename({
                    extname: ".min.css"
                })
            )
            .pipe(dest(path.build.css))
            .pipe(browser_sync.stream())
                            
}

function js() {
    return src(path.srs.js)
            .pipe(fileinclude())
            .pipe(dest(path.build.js))
            .pipe(uglify())
            .pipe(
                rename({
                    extname: ".min.js"
                })
            )
            .pipe(dest(path.build.js))
            .pipe(browser_sync.stream())
                            
}

function images() {
    return src(path.srs.img)
            .pipe(webp({
                quality: 70
            }))
            .pipe(dest(path.build.img))
            .pipe(src(path.srs.img))
            .pipe(
                imagemin({
                    progressive: true,
                    svgoPlugins: [{ removeViewBox: false}],
                    interlaced: true,
                    optimizationLevel: 3
                })
            )
            .pipe(dest(path.build.img))
            .pipe(browser_sync.stream())
}

function fonts(params) {
    src(path.srs.fonts)
            .pipe(ttf2woff())
            .pipe(dest(path.build.fonts))
            .pipe(browser_sync.stream())

    return src(path.srs.fonts)
                .pipe(ttf2woff2())
                .pipe(dest(path.build.fonts))
                .pipe(browser_sync.stream())
}

function fontsStyle(params) {

}

function cb() {

}

gulp.task('svgSprite', function() {
    return gulp.src(`${folder_sourse}/iconsprite/*.svg`)
                .pipe(svgSprite({
                    mode: {
                        stack: {
                          sprite: '../icons/icons.svg'
                        }
                    }
                }))
                .pipe(dest(path.build.img));
})

gulp.task('otf2ttf', function() {
    return gulp.src(`${folder_sourse}/fonts/*.otf`)
                .pipe(fonter({
                    formats: ['ttf']
                }))
                .pipe(dest(`${folder_sourse}/fonts/`));
})

function watchFiles() {
    gulp.watch([path.watch.html], html)
    gulp.watch([path.watch.css], css)
    gulp.watch([path.watch.js], js)
    gulp.watch([path.watch.img], images)
}

function clean() {
    return del(path.clean)
}

const build = gulp.series(clean,
                            gulp.parallel(js, css, images, html, fonts))

const watch = gulp.parallel(build,
                            watchFiles,
                            browserSync)

// exports.build = build
// exports.css = css
// exports.html = html
// exports.js = js
// exports.images = images
// exports.watch = watch
exports.default = watch