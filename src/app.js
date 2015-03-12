/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');

var menus = [{
    sectionTitle: "Imperial to Metric",
    units: [{
        from: {
            text: 'Miles',
            abbr: 'mi',
            convert: function (mi) {
                return mi * 1.6093472;
            },
            min: 0,
            max: 500,
            steps: [50, 10, 1]
        },
        to: {
            text: 'Kilometres',
            abbr: 'km',
            convert: function (km) {
                return km * 0.621;
            },
            min: 0,
            max: 500,
            steps: [50, 10, 1]
        }
    }, {
        from: {
            text: 'Pounds',
            abbr: 'lbs',
            convert: function (lb) {
                return lb * 0.45359237;
            },
            min: 0,
            max: 500,
            steps: [50, 10, 1]
        },
        to: {
            text: 'Kilograms',
            abbr: 'kg',
            convert: function (kg) {
                return kg * 2.20462262;
            },
            min: 0,
            max: 500,
            steps: [50, 10, 1]
        }
    }, {
        from: {
            text: 'Fahrenheit',
            abbr: 'F',
            convert: function (f) {
                return (5 / 9) * (f - 32);
            },
            min: -200,
            max: 700,
            steps: [100, 25, 5, 1]
        },
        to: {
            text: 'Celsius',
            abbr: 'C',
            convert: function (c) {
                return (9 / 5) * c + 32;
            },
            min: -50,
            max: 450,
            steps: [50, 10, 1]
        }
    }, {
        from: {
            text: 'Calories',
            abbr: 'Cal',
            convert: function (c) {
                return c * 4.184;
            },
            min: 0,
            max: 4000,
            steps: [500, 100, 10, 1]
        },
        to: {
            text: 'Kilojoules',
            abbr: 'kJ',
            convert: function (kj) {
                return kj * 0.239;
            },
            min: 0,
            max: 15000,
            steps: [1000, 100, 10, 1]
        }
    }]
}];

var _ = {
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
    pluck: function (arr, prop) {
        return _.map(arr, function (i) { return i[prop]; });
    },
    copyArray: function (arr) {
        return [].concat(arr);
    },
    isEmpty: function (coll) {
        return _.has(coll, 'length') && coll.length === 0;
    },
    indexOf: function (coll, item) {
        return binaryIndexOf.call(coll, item);
    }
};

function fmt(num, units) {
    if (num === Math.floor(num)) return '' + num + (units ? ' ' + units : '');
    return '' + num.toFixed(2) + (units ? ' ' + units : '');
}

/**
 * Performs a binary search on the host array. This method can either be
 * injected into Array.prototype or called with a specified scope like this:
 * binaryIndexOf.call(someArray, searchElement);
 *
 * @param {*} searchElement The item to search for within the array.
 * @return {Number} The index of the element which defaults to -1 when not found.
 */
function binaryIndexOf(searchElement) {
    'use strict';
 
    var minIndex = 0;
    var maxIndex = this.length - 1;
    var currentIndex;
    var currentElement;
 
    while (minIndex < maxIndex) {
        currentIndex = (minIndex + maxIndex) >>> 1;
        currentElement = this[currentIndex];
 
        if (currentElement < searchElement) {
            minIndex = currentIndex + 1;
        }
        else {
            maxIndex = currentIndex;
        }
    }
 
    return maxIndex;
}

function buildMenuItemsAndUIMenuForBothDirections(unit) {
    console.log('unit = ', JSON.stringify(unit));
    _.each(['from', 'to'], function (dir) {
        var oppDir = dir === 'from' ? 'to' : dir;
        console.log('unit[', dir, '] = ', JSON.stringify(unit[dir]));
        var menu = unit[dir],
            sectionTitle = unit[dir].text + ' to ' + unit[oppDir].text,
            min = unit[dir].min,
            max = unit[dir].max,
            steps = unit[dir].steps,
            abbr = {
                from: unit[dir].abbr,
                to: unit[oppDir].abbr
            }, 
            convert = unit[dir].convert;
        buildMenuItemsAndUIMenu(menu, sectionTitle, min, max, steps, abbr, convert, unit[oppDir]);
    });
    _.each(['from', 'to'], function (dir) {
        var oppDir = dir === 'from' ? 'to' : dir;
        populateCorrespondingIndexes(unit, dir, unit[oppDir].items);
    });
}

function populateCorrespondingIndexes(unit, dir, correspondingItems, specificItem) {
    var otherMins = _.pluck(correspondingItems, 'min');
    if (_.isEmpty(correspondingItems)) {
        return;
    }
    var itemsColl = unit[dir].items;
    if (specificItem) {
        itemsColl = [specificItem];
    }
    _.each(itemsColl, function (item) {
        var min = item.min;
        var index = binaryIndexOf.call(otherMins, min);
        if (otherMins[index] > min) {
            index--;
            if (min > otherMins[index]) { // && min < (otherMins[index+1] || 0)) {
                populateCorrespondingIndexes(unit, dir, correspondingItems[index].items || [], item);
            }
        }
        if (!item.correspondingIndexes) {
            item.correspondingIndexes = [index];
        } else {
            item.correspondingIndexes.push(index);
            item.correspondingIndexes.sort();
        }
        console.log('item[' + dir + '].min = ' + min + ', corresponding index = ' + index + ' in ' + JSON.stringify(otherMins) + ', corresponding indexes = ' + JSON.stringify(item.correspondingIndexes));
    }); 
}

function buildMenuItemsAndUIMenu(menu, sectionTitle, min, max, steps, abbr, convert, oppMenu) {
    steps = _.copyArray(steps);
    menu.items = [];
    var step = steps.shift();
    for (var x = min; x < max; x += step) {
        if (x !== 0 || step !== 1) {
            var menuItem = {
                title: (step > 1 ? fmt(x) + ' to ' : '') + fmt(x + step - 1, abbr.from),
                subtitle: (step > 1 ? fmt(convert(x)) + ' to ' : '') + fmt(convert(x + step - 1), abbr.to),
                min: x
            };
            if (!_.isEmpty(steps)) buildMenuItemsAndUIMenu(menuItem, sectionTitle, x, x + step, steps, abbr, convert, oppMenu);
            menu.items.push(menuItem);
        }
    }
    menu.hasMenu = true;
    menu.showMenu = function () {
        // lazily instantiate it the first time it is accessed
        if (!this.uiMenu) {
            this.uiMenu = new UI.Menu({
                sections: [{
                    title: sectionTitle,
                    items: menu.items
                }]
            });
            this.uiMenu.on('select', function (e) {
                if (menu.items[e.itemIndex].hasMenu) {
                    menu.items[e.itemIndex].showMenu();
                }
            });
            this.uiMenu.on('longSelect', function (e) {
                var correspondingIndexes = _.copyArray(e.menuItem.correspondingIndexes || []);
                var correspondingMenuItem = oppMenu;
                while (_.size(correspondingIndexes) > 0) {
                    correspondingMenuItem = correspondingMenuItem.items[correspondingIndexes.shift()];
                }
                if (correspondingMenuItem) {
                    correspondingMenuItem.showMenu();
                }
            });
        }
        this.uiMenu.show();
    };
}

_.each(menus[0].units, buildMenuItemsAndUIMenuForBothDirections);

var menu = new UI.Menu({
    sections: [{
        title: 'Imperial to Metric',
        items: _.map(menus[0].units, function (unit) {
            return {
                title: unit.from.text,
                subtitle: 'to ' + unit.to.text
            };
        })
    }, {
        title: 'Metric to Imperial',
        items: _.map(menus[0].units, function (unit) {
            return {
                title: unit.to.text,
                subtitle: 'to ' + unit.from.text
            };
        })
    }]
});
menu.on('select', function (e) {
    var direction = e.sectionIndex === 0 ? 'from' : 'to';
    menus[0].units[e.itemIndex][direction].showMenu();
});
menu.show();

console.log(JSON.stringify(menu));
