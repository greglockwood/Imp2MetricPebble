var config_data = {
    "units": {
        "mi": {
            "text": "Miles",
            "abbr": "mi",
            "convertTo": "km",
            "min": 0,
            "max": 500,
            "steps": [50, 10, 1]
        },
        "km": {
            "text": "Kilometres",
            "abbr": "km",
            "convertTo": "mi",
            "min": 0,
            "max": 500,
            "steps": [50, 10, 1]
        },
        "lbs": {
            "text": "Pounds",
            "abbr": "lbs",
            "convertTo": "kg",
            "min": 0,
            "max": 500,
            "steps": [50, 10, 1]
        },
        "kg": {
            "text": "Kilograms",
            "abbr": "kg",
            "convertTo": "lbs",
            "min": 0,
            "max": 500,
            "steps": [50, 10, 1]
        },
        "f": {
            "text": "Fahrenheit",
            "abbr": "F",
            "convertTo": "c",
            "min": -200,
            "max": 700,
            "steps": [100, 25, 5, 1]
        },
        "c": {
            "text": "Celsius",
            "abbr": "C",
            "convertTo": "f",
            "min": -50,
            "max": 450,
            "steps": [50, 10, 1]
        },
        "cal": {
            "text": "Calories",
            "abbr": "Cal",
            "convertTo": "kj",
            "min": 0,
            "max": 4000,
            "steps": [500, 100, 10, 1]
        },
        "kj": {
            "text": "Kilojoules",
            "abbr": "kJ",
            "convertTo": "cal",
            "min": 0,
            "max": 15000,
            "steps": [1000, 100, 10, 1]
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
    },
    "menu_sections": [
        {
            "title": "Imperial to Metric",
            "units": [ "mi_km", "lbs_kg", "f_c", "cal_kj" ]
        },
        {
            "title": "Metric to Imperial",
            "units": [ "km_mi", "kg_lbs", "c_f", "kj_cal" ]
        }
    ]
};

if (module) {
    module.exports = config_data;
}