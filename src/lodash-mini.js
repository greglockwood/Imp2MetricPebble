module.exports = {
    has: function (obj, prop) {
        return obj.hasOwnProperty(prop);
    },
    each: function (coll, iter, context) {
        for (var i = 0, len = coll.length; i < len; i++) {
            iter.call(context || coll[i], coll[i], i);
        }
    },
    map: function (arr, iter, context) {
        var newArr = new Array(arr.length);
        for (var i = 0, len = arr.length; i < len; i++) {
            newArr[i] = iter.call(context || arr[i], arr[i], i);
        }
        return newArr;
    },
    copyArray: function (arr) {
        return [].concat(arr);
    },
    isEmpty: function (coll) {
        return _.has(coll, 'length') && coll.length === 0;
    }
};