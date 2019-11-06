/* global module */
/* global require */
/* global Buffer */

const through = require('through2');

const plugin = (arr /* it is regexp or regexps in array */, callback) => {
    if (arr instanceof RegExp) {
        arr = [arr];
    }

    if (!Array.isArray(arr)) {
        throw new Error('The first argument \'arr\' must be Array');
    }

    return through.obj((file, enc, cb) => {
        if (!file.isNull()) {
            if (file.isBuffer()) {
                let fileContents = file.contents.toString();

                arr.forEach((re, i) => {
                    fileContents = fileContents.replace(re, (...args) => {
                        return callback(...[i].concat(args));
                    });
                });

                file.contents = Buffer.from(fileContents);
            } else if (file.isStream()) {
                const stream = through();
                stream.write();
                file.contents = file.contents.pipe(stream);
            }
        }

        return cb(null, file);
    });
};

module.exports = plugin;
