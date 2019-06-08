/// <binding BeforeBuild='clean' AfterBuild='generatePackage, moveReadme' Clean='clean' />
const gulp = require('gulp');
const fsUtil = require('./project-apparatus/fs.util.js');

gulp.task('generatePackage', async () => {
    await fsUtil.generatePackage();
});

gulp.task('moveReadme', async () => {
    await fsUtil.moveReadme();
});

gulp.task('clean', async () => {
    await fsUtil.cleanDist();
});