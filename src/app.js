/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui'),
    _ = require('lodash-mini'),
    data = require('data');

var splashCard = new UI.Card({
    title: "Please Wait",
    body: "Downloading"
});
splashCard.show();

function convertFnFactory(from, to) {
    var d = data.conversion_details[from];
    if (d) {
        d = d[to];
    }
    return function (input) {
        if (!d) return input;
        return (input + (d.add_to_input || 0)) * (d.mult || 1);
    };
}

function getUnit(id) {
    if (data.units[id]) {
        data.units[id].id = id;
    }
    return data.units[id];
}

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
splashCard.hide();