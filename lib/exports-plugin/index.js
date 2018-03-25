'use strict';

var glob = require("glob");
var path = require('path');
var fs = require('fs');
var uglifyJs = require('uglify-js');

function mkdir(dirpath, dirname) {
    //判断是否是第一次调用  
    if (typeof dirname === "undefined") {
        if (fs.existsSync(dirpath)) {
            return;
        } else {
            mkdir(dirpath, path.dirname(dirpath));
        }
    } else {
        //判断第二个参数是否正常，避免调用时传入错误参数  
        if (dirname !== path.dirname(dirpath)) {
            mkdir(dirpath);
            return;
        }
        if (fs.existsSync(dirname)) {
            fs.mkdirSync(dirpath);
        } else {
            mkdir(dirname, path.dirname(dirname));
            fs.mkdirSync(dirpath);
        }
    }
}

function exportsPlugin(_ref) {
    var rootDir = _ref.rootDir;

    this.rootDir = rootDir;
}

function outputLibs(rootDir, files) {
    var nodeModulesDir = path.join(path.resolve(rootDir), 'node_modules');

    var filePath = '',
        fileContent = '',
        outputDir = '',
        outputPath = '',
        originalFileContent;
    for (var i = 0; i < files.length; i++) {
        filePath = path.join(path.resolve(rootDir), files[i]).replace(/\\/g, '\\\\');
        fileContent = 'var djexports = ' + 'require("' + filePath + '")\n';
        fileContent += 'module.exports = djexports;';
        outputDir = path.join(nodeModulesDir, 'djexports-' + path.basename(path.dirname(fileContent)));
        mkdir(outputDir);
        outputPath = path.join(outputDir, 'index.js');
        originalFileContent = '';
        if (fs.existsSync(outputPath)) {
            originalFileContent = fs.readFileSync(outputPath, 'utf8');
        }
        if (originalFileContent != fileContent) {
            if (fs.existsSync(outputPath)) {
                fs.unlinkSync(outputPath);
            }
            fs.writeFileSync(outputPath, fileContent, { encoding: 'utf8' });
        }
    }
}

exportsPlugin.prototype.apply = function (compiler) {
    var rootDir = this.rootDir;
    compiler.plugin("compile", function (params) {
        var files = glob.sync('**/djexports.js', {
            cwd: rootDir
        });
        outputLibs(rootDir, files);
    });
};

module.exports = exportsPlugin;