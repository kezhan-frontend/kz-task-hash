module.exports = function(options) {
    options || (options = {});

    if(!options.distPath || !options.versionPath) {
        throw new Error('options.distPath & options.version are required!');
    }

    return function() {
        var fs = require('fs');
        var md5 = require('MD5');
        var version = {};
        var bonefs = this.fs;
        var files = bonefs.search(options.distPath+'/**/*.*');
        var distPath = bonefs.pathResolve(options.distPath);
        var path = require('path');
        var ignoreExt = {'.json': true};

        bone.log('正在计算hash值！计算文件路径: '+options.distPath+'.');

        files.forEach(function(file) {
            // filter image
            if(path.extname(file) in ignoreExt)
                return;
            var ctn = fs.readFileSync(file);
            var p = file.replace(distPath+'/', '/');

            version[p] = md5(ctn).substr(-6);
        });
        console.log('写入version.json文件: '+options.versionPath+'.');
        bonefs.writeFile(options.versionPath, JSON.stringify(version, null, 4));
    }
};