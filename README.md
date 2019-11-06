# gulp-replace-each [![Build Status](https://travis-ci.com/Mefistosss/gulp-replace-each.svg?branch=master)](https://travis-ci.com/Mefistosss/gulp-replace-each)

## Install

```
$ npm install --save gulp-replace-each
```

## Usage

### testFile.js
```js
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
}
```

### gulpfile.js
```js
const gulp = require('gulp');
const replaceEach = require('gulp-replace-each');

const KEYWORDS = [
    '(Test)',
    '(saySomething)',
].map((value) => { return new RegExp(value, 'g'); });

gulp.task('replace-all', () => {
    return gulp.task(['testFile.js'])
        .pipe(replaceEach(
            KEYWORDS /* array or just RegExp object */,
            (arrayIndex, value, _1) => { // the first argument is array index, other arguments are arguments from string replace function callback
            let result = _1;

            if (arrayIndex === 1) {
                result += 'Funny';
            } else {
                result += '1';
            }

            return result;
        }))
        .pipe(gulp.dest('dist'))
});
```

### dist/testFile.js
```js
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
}

```