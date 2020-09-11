import json
import logging
import datetime
from dateutil import parser
from helpers import (
    query_db,
    scan_db,
    sort_results,
    create_http_response
)
logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """
        Get rides from db.
        Give query parameters with queryStringParameters.
    """
    logger.info(json.dumps(event))
    params = event.get("queryStringParameters")

    if params and "ride-id" in params:
        response = query_db(params["ride-id"])
        return create_http_response(200, response)

    all_results = scan_db()
    time_results = strip_old_records(all_results)
    results = sort_results(time_results, params)
    if not params:
        return create_http_response(200, results)
    origin = params.get("origin", "")
    destination = params.get("destination", "")
    results = search_routes(results, origin, destination)

    return create_http_response(200, results)

def _filter_results(results, params, origDest):
    filtered_results = []
    for ride in results:
        if params[origDest].lower() == ride[origDest].lower():
            filtered_results.append(ride)
    return filtered_results

def _search_exact_matches(params, results):
    if params and "origin" in params:
        results = _filter_results(results, params, "origin")
    if params and "destination" in params:
        results = _filter_results(results, params, "destination")

def strip_old_records(all_results):
    now = datetime.datetime.utcnow()
    fresh_rides = []
    for ride in all_results:
        departure = parser.parse(ride["departure-date"], ignoretz=True)
        if now < departure:
            fresh_rides.append(ride)
    return fresh_rides

def search_routes(results, origin, destination):

    user_results = []
    for ride in results:
        same_origin = False
        same_dest = False
        if origin.lower() == ride["origin"].lower():
            same_origin = True
            if not destination:
                user_results.append(ride)
                continue
        if destination.lower() == ride["destination"].lower():
            same_dest = True
            if not origin:
                user_results.append(ride)
                continue
        if same_origin and same_dest:
            logging.info("Full match for ride")
            user_results.append(ride)
            continue
        routes = [
            ["helsinki", "espoo", "lohja", "salo", "turku"],
            ["helsinki", "nummela", "vihti", "karkkila", "forssa", "huittinen", "pori"],
            ["helsinki", "hyvinkää", "riihimäki", "hämeenlinna", "tampere", "parkano", "jalasjärvi", "kurikka", "laihia", "seinäjoki", "vaasa"],
            ["helsinki", "mäntsälä", "lahti", "heinola", "jyväskylä", "oulu", "kemi", "keminmaa", "rovaniemi", "sodankylä", "ivalo", "inari", "utsjoki"],
            ["heinola", "mikkeli", "varkaus", "kuopio", "iisalmi", "kajaani", "kuusamo", "kemijärvi", "sodankylä"],
            ["porvoo", "loviisa", "kotka", "hamina", "vaalimaa"],
            ["rauma", "pori", "vaasa", "uusikaarlepyy", "kokkola", "kalajoki", "raahe", "liminka", "oulu"],
            ["turku", "loimaa", "tampere", "orivesi", "jämsä", "jyväskylä", "hankasalmi", "pieksämäki", "varkaus", "kuopio", "outokumpu", "joensuu"]
        ]

        for route in routes:
            ride_origin = ride["origin"].lower()
            ride_destination = ride["destination"].lower()
            if ride_origin in route and ride_destination in route:
                if origin.lower() in route and destination.lower() in route:

                    if route.index(ride_origin) > route.index(ride_destination):
                        logger.info("Reverse direction with a route")
                        route.reverse()

                    logger.info("Kyyti: %s - %s", ride_origin, ride_destination)
                    logger.info("Kyyti: %s - %s", route.index(ride_origin), route.index(ride_destination))

                    logger.info("Haku: %s - %s", origin, destination)
                    logger.info("Haku: %s - %s", route.index(origin), route.index(destination))

                    if route.index(ride_origin) <= route.index(origin) and route.index(ride_destination) <= route.index(destination):
                        logging.info("Route matched an intermediary route")
                        user_results.append(ride)

    return user_results
