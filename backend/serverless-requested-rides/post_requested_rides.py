import boto3
import json
import logging
import datetime
import random
import string
from dynamo_functions import write_to_db
from helpers import create_random_short_id, create_http_response

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """
        Parse ride data from event and write it to database.
    """
    logging.info(json.dumps(event))
    body = _parse_event(event)
    logger.info(json.dumps(body))
    write_to_db(body, "requestedRidesTable")

    response = create_http_response(200, f"Uploaded new requested ride to database with requested ride id {event_body['requested-ride-id']}")

    logger.info(response)

    return response


def _parse_event(event):
    """
        Get wanted data from AWS API Gateway event.
    """
    event_body = json.loads(event['body'])
    random_id = create_random_short_id()
    event_body["requested-ride-id"] = random_id
    event_body["completion"] = "False"
    event_body["posted-on"] = datetime.datetime.utcnow().isoformat()
    return event_body
