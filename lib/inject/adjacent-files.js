var path         = require('path');
var through      = require('through2');
var throughPipes = require('through-pipes');
var gulp         = require('gulp');
var inject       = require('gulp-inject');
var slash        = require('gulp-slash');
var semiflat     = require('gulp-semiflat');

/**
 * Inject all files found in the same relative directory as the HTML file of the stream.
 * Where <code>recurse</code> is given inject all files found in the directories above, up to and including the
 * vinyl file.base or explicit <code>recurse</code> base path string.
 * Outputs a stream of HTML files with amended content.
 * @param {string} extension One or more file types to consider, pipe delimited, or '*' for all
 * @param {string|boolean} [recurse] Switch to enable recursive injection or an absolute or root relative base path
 * @param {object} [opts] Options for <code>inject</code>
 * @returns {stream.Through} A through stream that performs the operation of a gulp stream
 */
module.exports = function (extension, opts, recurse) {
  'use strict';
  var extensions = extension ? extension.split('|') : [ '*' ];
  return through.obj(function (file, encoding, done) {
    var stream = this;
    function srcStream() {

      // ensure any relative path is an ancestor of the file path
      var filePath     = path.dirname(file.path);
      var fileRecurse  = path.resolve((typeof recurse === 'string') ? recurse : filePath);
      var fileRelative = path.relative(fileRecurse, filePath);
      if (fileRelative.slice(0, 2) === '..') {
        throw new Error('encountered a file that is outside the given recurse path');
      }

      // use terms in the relative address, from none to all
      var split = fileRelative.split(/[\\\/]/g);
      for(var i = 0, glob = [ ]; i < split.length; i++) {
        extensions.forEach(function(extension) {
          var item = [ fileRecurse ]
            .concat(split.slice(0, i + 1))
            .concat('*.' + extension)
            .join('/');
          if (glob.indexOf(item) < 0) {
            glob.push(item);
          }
        });
      }
      return gulp.src(glob, { read: false })
        .pipe(semiflat(file.base))
        .pipe(slash());
    }

    // process the single file using a stream
    throughPipes(function (readable) {
      return readable
        .pipe(inject(srcStream(), opts));
    })
      .input(file)
      .output(function (file) {
        stream.push(file);
        done();
      });
  });
}