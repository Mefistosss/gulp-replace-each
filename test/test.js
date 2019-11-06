'use strict';
/* eslint-env mocha */

const path = require('path');
const assert = require('assert');
const Vinyl = require('vinyl');
const gulpReplaceEach = require('../');

const KEYWORDS = [
    '(Test)',
    '(saySomething)',
].map((value) => { return new RegExp(value, 'g'); });

const fileContent =`
class Test {
    constructor() {
        this.name = 'Test';
    }

    toString() {
        console.log(this.name)
    }

    saySomething() {
        this.toString();
    }

    sayTestManyTimes(num) {
        if (!num || num < 1) {
            num = 1;
        }
        for (let i = 0; i < num; i++) {
            this.toString();
        }
    }
}`;

const resultFile1 =`
class Test1 {
    constructor() {
        this.name = 'Test1';
    }

    toString() {
        console.log(this.name)
    }

    saySomethingFunny() {
        this.toString();
    }

    sayTest1ManyTimes(num) {
        if (!num || num < 1) {
            num = 1;
        }
        for (let i = 0; i < num; i++) {
            this.toString();
        }
    }
}`;

const resultFile2 =`
class Test {
    constructor() {
        this.name = 'Test';
    }

    toString() {
        console.log(this.name)
    }

    saySomethingFunny() {
        this.toString();
    }

    sayTestManyTimes(num) {
        if (!num || num < 1) {
            num = 1;
        }
        for (let i = 0; i < num; i++) {
            this.toString();
        }
    }
}`;

describe('gulp-replace-each', () => {
    const fakeFile = {
        path: path.join(process.cwd(), 'test', 'testFile.js'),
        contents: Buffer.from(fileContent)
    };

    it('should replace array', (done) => {
        const s = gulpReplaceEach(KEYWORDS, (arrayIndex, value, _1) => {
            let result = _1;

            if (arrayIndex === 1) {
                result += 'Funny';
            } else {
                result += '1';
            }

            return result;
        });

        s.on('data', (actualFile) => {
            assert.ok(actualFile)
            assert.ok(actualFile.path);
            assert.ok(actualFile.contents);
            assert.equal(actualFile.contents.toString(), resultFile1);
            done();
        });

        s.write(new Vinyl(fakeFile));
        s.end();
    });

    it('should replace regexp', (done) => {
        const s = gulpReplaceEach(KEYWORDS[1], (arrayIndex, value, _1) => {
            return _1 + 'Funny';
        });

        s.on('data', (actualFile) => {
            assert.ok(actualFile)
            assert.ok(actualFile.path);
            assert.ok(actualFile.contents);
            assert.equal(actualFile.contents.toString(), resultFile2);
            done();
        });

        s.write(new Vinyl(fakeFile));
        s.end();
    });
});
