/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');

var config = {
    "units": {
        "mi": {
            text: 'Miles',
            abbr: 'mi',
            convertTo: 'km',
            min: 0,
            max: 500,
            steps: [50, 10, 1]
        },
        "km": {
            text: 'Kilometres',
            abbr: 'km',
            convertTo: 'mi',
            min: 0,
            max: 500,
            steps: [50, 10, 1]
        },
        "lbs": {
            text: 'Pounds',
            abbr: 'lbs',
            convertTo: 'kg',
            min: 0,
            max: 500,
            steps: [50, 10, 1]
        },
        "kg": {
            text: 'Kilograms',
            abbr: 'kg',
            convertTo: "lbs",
            min: 0,
            max: 500,
            steps: [50, 10, 1]
        },
        "f": {
            text: 'Fahrenheit',
            abbr: 'F',
            convertTo: "c",
            min: -200,
            max: 700,
            steps: [100, 25, 5, 1]
        },
        "c": {
            text: 'Celsius',
            abbr: 'C',
            convertTo: "f",
            min: -50,
            max: 450,
            steps: [50, 10, 1]
        },
        "cal": {
            text: 'Calories',
            abbr: 'Cal',
            convertTo: "kj",
            min: 0,
            max: 4000,
            steps: [500, 100, 10, 1]
        },
        "kj": {
            text: 'Kilojoules',
            abbr: 'kJ',
            convertTo: "cal",
            min: 0,
            max: 15000,
            steps: [1000, 100, 10, 1]
        }
    },
    "conversion_details": {
        "mi": {
            "km": {
                "mult": 1.6093472
            }
        },
        "km": {
            "mi": {
                "mult": 0.621
            }
        },
        "lbs": {
            "kg": {
                "mult": 0.45359237
            }
        },
        "kg": {
            "lbs": {
                "mult": 2.20462262
            }
        },
        "f": {
            "c": {
                "mult": 0.5555555555555,
                "add_to_input": -32
            }
        },
        "cal": {
            "kj": {
                "mult": 4.184
            }
        },
        "kj": {
            "cal": {
                "mult": 0.239
            }
        }
    }
};

function convertFnFactory(from, to) {
    var d = config.conversion_details[from];
    if (d) {
        d = d[to];
    }
    return function (input) {
        if (!d) return input;
        return (input + (d.add_to_input || 0)) * (d.mult || 1);
    };
}

function getUnit(id) {
    if (config.units[id]) {
        config.units[id].id = id;
    }
    return config.units[id];
}

var menus = [{
    sectionTitle: "Imperial to Metric",
    units: [{
        from: getUnit('mi'),
        to: getUnit('km')
    }, {
        from: getUnit('lbs'),
        to: getUnit('kg')
    }, {
        from: getUnit('f'),
        to: getUnit('c')
    }, {
        from: getUnit('cal'),
        to: getUnit('kj')
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
        convertFnFactory(unit.from.id, unit.from.convertTo));
    buildMenuItemsAndUIMenu(unit.to,
        unit.to.text + ' to ' + unit.from.text,
        unit.to.min,
        unit.to.max,
        unit.to.steps, {
            from: unit.to.abbr,
            to: unit.from.abbr
        },
        convertFnFactory(unit.to.id, unit.to.convertTo));
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
