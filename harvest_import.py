import os
import csv
import argparse
import logging
from datetime import datetime
from time import time

from farmOS import farmOS

### Setup

## Install farmOS.py. Ideally into a python virtualenv.
# python3 -m venv venv
# source venv/bin/activate
# pip3 install farmOS==1.0.0-beta3

## Configure hostname + username/password in this script.

## Download files to a directory, "dataset"
# Source: https://github.com/ludwa6/farmOS/tree/main/content/data/uploaded

## Run import on file(s). For example:
# python harvest_import.py -f "dataset/log_farm_harvest_weekX - week11_2022.csv"

# Allow HTTP requests.
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# Configure a file command line argument.
parser = argparse.ArgumentParser()
parser.add_argument("--file", "-f", type=str, required=True)
args = parser.parse_args()

# The path to the CSV file.
# file_path = "plantings.csv"
file_path = args.file

# farmOS server hostname. EDIT THIS!
hostname = "http://localhost"

# Create and authorize the client.
client = farmOS(hostname=hostname, scope="farm_manager", version=2)
# client.authorize()

# Alternatively hard code username and password.
username = "admin"
password = "admin"
client.authorize(username, password)


def _get_or_create_taxonomy_term(vocabulary, term_name):
    """
    Helper function to load an existing or create a new taxonomy term by name.
    :param vocabulary: The taxonomy vocabulary.
    :param term_name: The term name.
    :return: The term data or None if not found.
    """

    term_filter = client.filter('name', term_name)
    terms = list(client.resource.iterate('taxonomy_term', vocabulary, term_filter))

    # Return the first matching term.
    if (len(terms) > 0):
        return terms[0]
    # Else create a new term.
    else:
        term = {
            "attributes": {
                "name": term_name,
            },
        }
        new_term = client.term.send(vocabulary, term)
        return new_term["data"]


def _get_or_create_asset_by_name(asset_type, asset_name):
    """
    Helper function to load or create an asset by name.
    :param asset_type: The asset type to lookup, eg: plant.
    :param asset_name: The asset name to lookup.
    :return: The asset data
    """

    asset_filter = client.filter('name', asset_name)
    assets = list(client.asset.iterate(asset_type, asset_filter))

    if (len(assets) == 0):

        # Create a plant_type the same as the asset name.
        plant_type = _get_or_create_taxonomy_term('plant_type', asset_name)
        asset = {
            "attributes": {
                "name": asset_name,
            },
            "relationships": {
                "plant_type": {
                    "data": {
                        "type": "taxonomy_term--plant_type",
                        "id": plant_type["id"],
                    },
                },
            },
        }
        new_asset = client.asset.send('plant', asset)
        return new_asset["data"]
    else:
        return assets[0]


# Get hard-coded values.
# Hard-code quantity units to kg.
unit_term = _get_or_create_taxonomy_term("unit", "kg")


# Open the CSV file.
with open(file_path, newline='') as csv_file:
    # Iterate through each row of the CSV file.
    reader = csv.DictReader(csv_file, delimiter=',')
    for row in reader:

        # Required values.
        date = row['Date']
        if (date is None or len(date) == 0):
            print(f"Row {reader.line_num}: No date")
            continue

        plant_type = row['species']
        if (plant_type is None or len(plant_type) == 0):
            print(f"Row {reader.line_num}: No species")
            continue
        plant_asset = _get_or_create_asset_by_name('plant', plant_type)

        # Load log values.
        # Convert date string to timestamp.
        now = time()
        timestamp = datetime.strptime(date, '%Y-%m-%d').timestamp()

        # Log status
        raw_status = int(bool(row['Done']))
        status = "done" if raw_status == 1 else "pending"

        # Notes
        notes = row['Notes']

        # Create the transplanting log referencing the plant asset.
        log = {
            "attributes": {
                "type": "harvest",
                "timestamp": timestamp,
                "status": status,
                "name": f"Harvest {plant_type}",
                "notes": notes,
            },
            "relationships": {
                "asset": {
                    "data": [
                        {
                            "type": "asset--plant",
                            "id": plant_asset["id"],
                        }
                    ]
                },
            }
        }

        # Create a quantity for the log.
        quantity_value = row['Quantity value']
        if len(quantity_value) != 0:
            decimal = float(quantity_value.replace(",", "."))
            harvest_quantity_data = {
                "attributes": {
                    "type": "standard",
                    "measure": "weight",
                    "value": {
                        "decimal": decimal,
                    },
                },
                "relationships": {
                }
            }

            # Hard-code the quantity unit.
            # unit = row["Quantity unit"]
            # unit_term = _get_or_create_taxonomy_term("unit", unit)
            harvest_quantity_data["relationships"]["units"] = {
                "data": {
                    "type": "taxonomy_term--unit",
                    "id": unit_term["id"],
                }
            }

            # Create the quantity.
            harvest_quantity = client.resource.send('quantity', 'standard', harvest_quantity_data)

            # Add quantity to log.
            log["relationships"]["quantity"] = {
                "data": [
                    {
                        "type": "quantity--standard",
                        "id": harvest_quantity["data"]["id"],
                        "meta": {
                            "target_revision_id": harvest_quantity["data"]["attributes"]["drupal_internal__revision_id"]
                        }
                    },
                ]
            }

        new_log = client.log.send("harvest", log)

        link = "{hostname}/log/{id}".format(hostname=hostname,
                                              id=new_log["data"]["attributes"]["drupal_internal__id"])
        print(
            "Imported log for asset: {name} - {link}".format(name=plant_type,
                                                              link=link))
                                                              