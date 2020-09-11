import boto3
import json
import logging
import uuid
from dynamo_functions import write_to_db
from helpers import validate_query_string_parameters, validate_results, get_body_from_event, create_random_short_id, create_http_response

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """
        Parse customer reviews and write it to database.
    """
    logging.info(json.dumps(event))
    required_values = ["review-text", "star-review", "user-id"]
    response = validate_body_and_data(event, required_values)
    if validate_results(response):
        event_body = get_body_from_event(event)
        event_body["review-id"] = create_random_short_id()
        write_to_db("reviewTable", event_body)
        response = create_http_response(200, f"New review with review id event_body['review-id'] has been added to the database.")

    logger.info(json.dumps(response))

    return response
