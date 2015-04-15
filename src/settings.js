var data = config_data;
var chosen_units = data.menu_sections[0].default_units.concat(data.menu_sections[1].default_units);

var setOptions = function() {
    var options = window.location.hash;
    if (!options) {
        return {};
    }
    var options = JSON.parse(decodeURIComponent(options.substr(1)));
    if (!options) {
        return {};
    }
    if (options.chosen_units)
        chosen_units = options.chosen_units;
    return options;
};

setOptions();

document.addEventListener('DOMContentLoaded', function () {
    var entries = document.getElementsByClassName('entries')[0];
    for (var i = 0, len = data.menu_sections.length; i < len; i++) {
        var menu_section = data.menu_sections[i];
        var h2 = document.createElement('h2');
        h2.textContent = menu_section.title;
        entries.appendChild(h2);
        var ul = document.createElement('ul');
        ul.className = "units";
        ul.section = i;
        for (var j = 0, jlen = menu_section.all_units.length; j < jlen; j++) {
            var unit_pair = menu_section.units[j],
                parts = unit_pair.split('_'),
                from = data.units[parts[0]],
                to = data.units[parts[1]];
            var li = document.createElement('li');
            var cb = document.createElement('input');
            cb.type = "checkbox";
            cb.name = unit_pair;
            if (chosen_units.indexOf(unit_pair) > -1)
                cb.setAttribute('checked', true);
            var label = document.createElement('label');
            label.appendChild(cb);
            label.innerHTML += from.text + ' to ' + to.text;
            li.appendChild(label);
            ul.appendChild(li);
        }
        entries.appendChild(ul);
    }
});

document.addEventListener('change', function () {
    var checkboxes = document.getElementsByTagName('input');
    chosen_units = [];
    for (var i = 0, len = checkboxes.length; i < len; i++) {
        if (checkboxes[i].checked)
            chosen_units.push(checkboxes[i].name);
    }
});

document.getElementById('save').addEventListener('click', function () {
    var options = {chosen_units: chosen_units};
    document.location = 'pebblejs://close#' + encodeURIComponent(JSON.stringify(options));
});