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
        },
        "ft": {
            "text": "Feet",
            "abbr": "ft",
            "convertTo": "uknmi",
            "min": 0,
            "max": 5000000,
            "steps": [500000, 50000, 10000, 2000, 500, 50, 10, 1]
        },
        "uknmi": {
            "text": "UK Nautical Miles",
            "abbr": "UK nmi",
            "convertTo": "ft",
            "min": 0,
            "max": 1000,
            "steps": [100, 10, 1]
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
                "mult": (5/9),
                "add_to_input": -32
            }
        },
        "c": {
            "f": {
                "mult": 1.8,
                "add_to_result": 32
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
        },
        "ft": {
            "uknmi": {
                "mult": 0.00016447
            }
        },
        "uknmi": {
            "ft": {
                "mult": 2315000/381
            }
        }
    },
    "menu_sections": [
        {
            "title": "Imperial to Metric",
            "all_units": ["mi_km", "lbs_kg", "f_c", "cal_kj", "ft_uknmi"],
            "default_units": ["mi_km", "lbs_kg", "f_c", "cal_kj"]
        },
        {
            "title": "Metric to Imperial",
            "all_units": ["km_mi", "kg_lbs", "c_f", "kj_cal", "uknmi_ft"],
            "default_units": ["km_mi", "kg_lbs", "c_f", "kj_cal"]
        }
    ]
};