/************************************
 * Do not modify this file directly *
 * in CloudPebble or elsewhere.     *
 * It is generated as part of the   *
 * default grunt task.              *
 * If you wish to modify it, modify *
 * the original file in /shared     *
 * folder and rerun the grunt task. *
 ************************************/
var DECIMAL_PLACES = 2;
function format(num, units, dontTruncate) {
    var suffix = '', truncate = !dontTruncate;
    if (truncate
        && (num >= 1e6
        || parseFloat((num/1e6).toFixed(DECIMAL_PLACES)) >= 1)) {
        num /= 1e6;
        suffix = ' mil';
    } else if (truncate && num >= 1e4) {
        num /= 1e3;
        suffix = ' k';
    }
    if (num === Math.floor(num)) return '' + num + suffix + (units ? ' ' + units : '');
    var fixedNum = '' + num.toFixed(DECIMAL_PLACES);
    if (fixedNum.indexOf('.') > 0) {
        var parts = fixedNum.split('.');
        fixedNum = parts[0];
        var decimalPart = parts[1].replace(/0+$/, '');
        if (decimalPart) {
            fixedNum += '.' + decimalPart;
        }
    }
    return fixedNum + suffix + (units ? ' ' + units : '');
}
module.exports = format;