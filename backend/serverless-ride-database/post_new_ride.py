import json
import logging
import datetime
import uuid
from helpers import create_random_short_id, create_http_response, write_to_db, query_db

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """
        Parse ride data from event and write it to database.
    """
    body = json.loads(event.get('body', {}))
    if not body:
        return create_http_response(400, "Body missing from request!")

    required_values = ["destination", "origin", "departure-time", "departure-date"]
    if "external" not in body:
        required_values.append("user-id")

    new_body = _check_for_required_values(body, required_values)
    missing = []
    for missing_value in set(new_body.keys()).symmetric_difference(set(required_values)):
        missing.append(missing_value)
    if missing:
        return create_http_response(400, str(missing) + " missing from body!")

    body = _generate_ride_id(body)
    body = _lowercase_origin_and_destination(body)
    write_to_db("rideTable", body)
    return create_http_response(200, {"ride-id": body['ride-id']})

def _check_for_required_values(body, required_values):
    new_body = {}
    for required in required_values:
        if required in body:
            new_body[required] = body[required].lower()
    return new_body

def _lowercase_origin_and_destination(body):
    if body.get("origin"):
        body["origin"] = body["origin"].lower()
    if body.get("destination"):
        body["destination"] = body["destination"].lower()
    return body

def _generate_ride_id(body):
    body["ride-id"] = create_random_short_id()
    body["posted-on"] = datetime.datetime.utcnow().isoformat()
    return body
