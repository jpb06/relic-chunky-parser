const fs = require('fs-extra');

const consoleUtil = require('./console.util.js');

var main = {};

main.cleanDist = async function () {
    consoleUtil.printHeader('Cleaning dist folder ...');

    await fs.emptyDir('./dist');

    console.log('Done.');
};

main.generatePackage = async function () {
    consoleUtil.printHeader('Generating package.json file ...');

    const package = JSON.parse(fs.readFileSync('./package.json').toString());

    let distPackage = {
        name: package.name,
        version: package.version,
        description: package.version,
        main: package.main,
        types: package.types,
        author: package.author,
        dependencies: package.dependencies
    };

    await fs.writeFile('./dist/package.json', JSON.stringify(distPackage, null, 2), 'utf8');

    console.log('Done.');
}

main.moveReadme = async function () {
    consoleUtil.printHeader('Copying readme.md ...');

    await fs.copyFile('./README.md', './dist/README.md');

    console.log('Done.');
}

module.exports = main;
