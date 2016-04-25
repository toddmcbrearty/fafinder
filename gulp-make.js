'use strict';

require("babel-polyfill")
const gulp = require('gulp')
const git = require('gulp-git')
const glob = require('glob')
const path = require('path')
const grep = require('gulp-grep-contents')
const del = require('del')
const fs = require('fs')

gulp.task('get_repos', function () {
    console.log('getting master iconset')
    git.clone("https://github.com/FortAwesome/Font-Awesome.git", {cwd: "./fa_builds/"});
});

//grab repo icon.scss
//regex all icon names
//generate json file of names to be searched
gulp.task('clean', done => {
    del.sync('selectors')
    done();
})

gulp.task('build_json', ['clean'], done => {
    const buildJsonFile = entry => {
        var fileContent = fs.readFileSync(entry, "utf8");
        // /\.#\{\$fa-css-prefix\}-(.*):before/
        let selectors = fileContent.match(/\.#\{\$fa-css-prefix\}-(.*):before/g).toString()
        selectors = selectors.replace(/\.#\{\$fa-css-prefix\}-/g, '')
            .replace(/:before/g, '')

        //this shouldn't be here
        if (!path.existsSync('./selectors')) {
            fs.mkdirSync('./selectors',0744);
        }
        fs.writeFile('selectors/master.json', JSON.stringify(selectors.split(",")))
        console.log('written')
    }

    glob(path.join('fa_builds', 'Font-Awesome', 'scss', '_icons.scss'), (err, files) => {
        if (err) {
            done(err);
        }

        const tasks = files.map(buildJsonFile);
        // es.merge(tasks).on('end', done);
    })

})

