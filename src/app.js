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
                return (9 / 5) * (c + 32);
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
    copyArray: function (arr) {
        return [].concat(arr);
    },
    isEmpty: function (coll) {
        return _.has(coll, 'length') && coll.length === 0;
    }
};

function fmt(num, units) {
    if (num === Math.floor(num)) return '' + num + (units ? ' ' + units : '');
    return '' + num.toFixed(2) + (units ? ' ' + units : '');
}

function buildMenuItemsAndUIMenu(menu, sectionTitle, min, max, steps, abbr, convert) {
    steps = _.copyArray(steps);
    menu.items = [];
    var step = steps.shift();
    for (var x = min; x < max; x += step) {
        if (x !== 0 || step !== 1) {
            var menuItem = {
                title: (step > 1 ? fmt(x) + ' to ' : '') + fmt(x + step - 1, abbr.from),
                subtitle: (step > 1 ? fmt(convert(x)) + ' to ' : '') + fmt(convert(x + step - 1), abbr.to)
            };
            if (!_.isEmpty(steps)) buildMenuItemsAndUIMenu(menuItem, sectionTitle, x, x + step, steps, abbr, convert);
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
        }
        this.uiMenu.show();
    };
}
_.each(menus[0].units, function (unit) {
    buildMenuItemsAndUIMenu(unit.from,
    unit.from.text + ' to ' + unit.to.text,
    unit.from.min,
    unit.from.max,
    unit.from.steps, {
        from: unit.from.abbr,
        to: unit.to.abbr
    },
    unit.from.convert);
    buildMenuItemsAndUIMenu(unit.to,
    unit.to.text + ' to ' + unit.from.text,
    unit.to.min,
    unit.to.max,
    unit.to.steps, {
        from: unit.to.abbr,
        to: unit.from.abbr
    },
    unit.to.convert);
});

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
