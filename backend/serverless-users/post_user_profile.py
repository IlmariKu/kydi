import boto3
import json
import logging
import ast
from dynamo_functions import write_to_db, query_db

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """
        Update user profile with new data. Makes query for existing data and combines it with new data.
    """
    logging.info(json.dumps(event))
    body = event.get("body")
    if not body:
        return _create_http_response(400, {"failure_reason": "No body in message!"})
    parsed = _json_string_to_dict(body)

    if not parsed.get("user-id"):
        return _create_http_response(400, {"failure_reason": "No user ID in body"})

    if parsed.get("failure_reason"):
        return _create_http_response(400, {"failure_reason": parsed["failure_reason"]})


    old_data = _get_old_data_items(query_db(parsed["user-id"]))
    if old_data:
        combined_data = _combine_user_data(parsed, old_data)
        write_to_db(combined_data)
        return _create_http_response(200, combined_data)
    else:
        write_to_db(parsed)
        return _create_http_response(200, parsed)



def _json_string_to_dict(event_body):
    try:
        return json.loads(event_body)
    except:
        return {"failure_reason": "Body could not be decoded"}



def _get_old_data_items(db_items):
    items = db_items.get("Items")
    if items:
        return items[0]
    return []


def _combine_user_data(body, old_user_data):
    """
        Combine old and new, updated data. Overwrite existing data and leave if nothing new.
    """
    for key, value in body.items():
        if key in old_user_data:
            if old_user_data[key] == value:
                continue
            else:
                old_user_data[key] = value
        else:
            old_user_data[key] = value

    for key, value in old_user_data.items():
        if isinstance(value, dict) or isinstance(value, list):
            old_user_data[key] = json.dumps(value)

    return old_user_data

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
