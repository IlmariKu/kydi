import boto3
import json
import logging
import ast
from dynamo_functions import query_db

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def handler(event, context):
    """
        Query dynamo with user-id and return all profile review data.
    """
    logging.info(json.dumps(event))
    request = _parse_request_parameters(event)
    if "failure_reason" in request:
        return _create_http_response(400, request)
    db_items = query_db(request["ride-id"])
    if db_items["Items"]:
        return _create_http_response(200, db_items["Items"][0])
    return _create_http_response(200, {"messages": []})


def _parse_request_parameters(event):

    parsed = event.get("queryStringParameters", None)
    if not parsed:
        return {"failure_reason": "Request does not contain queryStringParameters"}

    if not parsed.get("ride-id"):
        return {"failure_reason": "ride-id missing from body"}

    return parsed


def _create_http_response(statuscode, body):
    response = {
        "statusCode": statuscode,
        "body": json.dumps(body),
        "headers": _create_cors_headers()
    }

    return response


def _create_cors_headers():
    return {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': "true",
        "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
    }
