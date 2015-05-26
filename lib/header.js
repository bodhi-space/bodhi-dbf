// Generated by CoffeeScript 1.9.2
(function() {
  var Header, fs,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  fs = require('fs');

  Header = (function() {
    function Header(filename) {
      this.filename = filename;
      this.parseFieldSubRecord = bind(this.parseFieldSubRecord, this);
      this.parseDate = bind(this.parseDate, this);
      return this;
    }

    Header.prototype.parse = function(callback) {
      return fs.readFile(this.filename, (function(_this) {
        return function(err, buffer) {
          var i;
          if (err) {
            throw err;
          }
          _this.type = (buffer.slice(0, 1)).toString('utf-8');
          _this.dateUpdated = _this.parseDate(buffer.slice(1, 4));
          _this.numberOfRecords = _this.convertBinaryToInteger(buffer.slice(4, 8));
          _this.start = _this.convertBinaryToInteger(buffer.slice(8, 10));
          _this.recordLength = _this.convertBinaryToInteger(buffer.slice(10, 12));
          _this.fields = ((function() {
            var j, ref, results;
            results = [];
            for (i = j = 32, ref = this.start - 32; j <= ref; i = j += 32) {
              results.push(buffer.slice(i, i + 32));
            }
            return results;
          }).call(_this)).map(_this.parseFieldSubRecord);
          return callback(_this);
        };
      })(this));
    };

    Header.prototype.parseDate = function(buffer) {
      var day, month, year;
      console.log(this.convertBinaryToInteger(buffer.slice(0, 1)));
      year = 1900 + this.convertBinaryToInteger(buffer.slice(0, 1));
      month = (this.convertBinaryToInteger(buffer.slice(1, 2))) - 1;
      day = this.convertBinaryToInteger(buffer.slice(2, 3));
      return new Date(year, month, day);
    };

    Header.prototype.parseFieldSubRecord = function(buffer) {
      var header;
      return header = {
        name: ((buffer.slice(0, 11)).toString('utf-8')).replace(/[\u0000]+$/, ''),
        type: (buffer.slice(11, 12)).toString('utf-8'),
        displacement: this.convertBinaryToInteger(buffer.slice(12, 16)),
        length: this.convertBinaryToInteger(buffer.slice(16, 17)),
        decimalPlaces: this.convertBinaryToInteger(buffer.slice(17, 18))
      };
    };

    Header.prototype.convertBinaryToInteger = function(buffer) {
      return buffer.readInt32LE(0, true);
    };

    return Header;

  })();

  module.exports = Header;

}).call(this);