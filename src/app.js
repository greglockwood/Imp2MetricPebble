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
            steps: [50, 10, 5, 1]
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
                title: (step > 1 ? fmt(x) + ' - ' : '') + fmt(x + step - 1, abbr.from),
                subtitle: (step > 1 ? fmt(convert(x)) + ' - ' : '') + fmt(convert(x + step - 1), abbr.to)
            };
            if (!_.isEmpty(steps)) buildMenuItemsAndUIMenu(menuItem, sectionTitle, x, x + step, steps, abbr, convert);
            menu.items.push(menuItem);
        }
    }
    menu.uiMenu = new UI.Menu({
        sections: [{
            title: sectionTitle + ' (' + min + '-' + max + ')',
            items: menu.items
        }]
    });
    menu.uiMenu.on('select', function (e) {
        if (menu.items[e.itemIndex].uiMenu) {
            menu.items[e.itemIndex].uiMenu.show();
        }
    });
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
    menus[0].units[e.itemIndex][direction].uiMenu.show();
});
menu.show();