/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui'),
    Settings = require('settings'),
    _ = require('./lodash-mini'),
    fmt = require('./../shared/format'),
    data = require('./../shared/data');

function convertFnFactory(from, to) {
    var d = data.conversion_details[from];
    if (d) {
        d = d[to];
    }
    return function (input) {
        if (!d) return input;
        return (input + (d.add_to_input || 0)) * (d.mult || 1) + (d.add_to_result || 0);
    };
}

function getUnit(id) {
    if (data.units[id]) {
        data.units[id].id = id;
    }
    return data.units[id];
}

function buildMenuItemsAndUIMenu(menu, sectionTitle, min, max, steps, abbr, convert) {
    steps = _.copyArray(steps);
    menu.hasMenu = true;
    menu.showMenu = function () {
// lazily instantiate it the first time it is accessed
        if (!this.uiMenu) {
            menu.items = [];
            var step = steps.shift();
            for (var x = min; x < max; x += step) {
                if (x !== 0 || step !== 1) {
                    var menuItem = {
                        title: (step > 1 ? fmt(x) + ' to ' : '') + fmt(x + step - 1, abbr.from),
                        subtitle: (step > 1 ? fmt(convert(x)) + ' to ' : '') + fmt(convert(x + step - 1), abbr.to, step == 1)
                    };
                    if (!_.isEmpty(steps)) buildMenuItemsAndUIMenu(menuItem, sectionTitle, x, x + step, steps, abbr, convert);
                    menu.items.push(menuItem);
                }
            }
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

var menu, inited = false, startTime;

function init() {
    startTime = +new Date();
    var selected_units = Settings.option("chosen_units") || [],
        selected_units_loaded = !_.isEmpty(selected_units);

    var menu_sections = _.map(data.menu_sections, function (section) {
        var new_section = {title: section.title, items: []};
        if (!selected_units_loaded) {
            selected_units = selected_units.concat(section.default_units);
        }
        var visible_units = _.filter(section.all_units, function (unit_pair) {
            return selected_units.indexOf(unit_pair) > -1;
        });
        new_section.items = _.map(visible_units, function (unit_pair) {
            var parts = unit_pair.split('_'),
                unitFrom = getUnit(parts[0]),
                unitTo = getUnit(parts[1]);
            var item = {
                title: unitFrom.text,
                subtitle: 'to ' + unitTo.text
            };
            buildMenuItemsAndUIMenu(item,
                unitFrom.text + ' to ' + unitTo.text,
                unitFrom.min,
                unitFrom.max,
                unitFrom.steps, {
                    from: unitFrom.abbr,
                    to: unitTo.abbr
                },
                convertFnFactory(unitFrom.id, unitFrom.convertTo));
            return item;
        });
        return new_section;
    });

    if (!selected_units_loaded) {
        Settings.option("chosen_units", selected_units);
    }

    if (!inited) {
        Settings.config(
            {url: 'https://raw.githack.com/greglockwood/Imp2MetricPebble/master/settings/settings.html'},
            function (e) {
                console.log('closed configurable');

                // Show the parsed response
                console.log(JSON.stringify(e.options));

                // Show the raw response if parsing failed
                if (e.failed) {
                    console.log(e.response);
                } else {
                    init();
                }
            });
    }

    if (menu) {
        menu.hide();
    }

    menu = new UI.Menu({
        sections: menu_sections
    });
    menu.on('select', function (e) {
        menu_sections[e.sectionIndex].items[e.itemIndex].showMenu();
    });

    console.log('Took ' + (+new Date() - startTime) + 'ms to initialise.');

    menu.show();

    inited = true;
}

init();