import boto3
import json
import logging
from datetime import datetime
from dynamo_functions import query_db, write_to_db
#import pdb; pdb.set_trace()

logger = logging.getLogger()
logger.setLevel(logging.INFO)

SHORT_USER_ID_LIMIT = 8


def handler(event, context):
    """
        Receive chat messages and write them to DB.
    """
    body = _parse_request_body(event)

    if body.get("failure_reason"):
        return _send_http_response(400, {"reason": body["failure_reason"]})

    old_ride = _db_search_existing_ride(body["ride-id"])
    chat_history_old = _get_messages_from_result(old_ride)
    chat_history = _join_new_message_to_chat_history(
        chat_history_old,
        body
    )
    existing_chatters = _get_existing_chatters(old_ride)
    body["messages"] = json.dumps(chat_history)
    body["latest-message"] = datetime.utcnow().isoformat()
    body["people-in-chat"] = _update_new_chatter(
        existing_chatters,
        body["first-name"],
        body["sender-id"]
        )
    logger.info(body)
    write_to_db(body)

    # Remove old ones from HTTP-response
    http_response = _remove_already_fetched_records(
        chat_history, get_short_user_id(body["sender-id"]))
    # For HTTP-response, only leave the new ones
    body["messages"] = json.dumps(http_response)
    return _send_http_response(200, body)


def _update_new_chatter(existing_chatters, first_name, sender_id):
    if sender_id in existing_chatters:
        return existing_chatters
    existing_chatters[get_short_user_id(sender_id)] = {
        "first-name": first_name,
        "sender-id": sender_id
        }
    return existing_chatters

def get_short_user_id(sender_id):
    return sender_id[0:SHORT_USER_ID_LIMIT]

def _parse_request_body(event):

    raw_body = event.get("body", None)
    if not raw_body:
        return {"failure_reason": "Request does not contain body"}


    parsed = _parse_json_string(raw_body)
    if not parsed:
        return {"failure_reason": "Decoding JSON-body failed!"}

    if not parsed.get("ride-id"):
        return {"failure_reason": "ride-id missing from body"}

    if not parsed.get("first-name"):
        return {"failure_reason": "first-name missing from body"}

    if not parsed.get("sender-id"):
        return {"failure_reason": "sender-id missing from body"}

    msg_type = parsed.get("type")
    if not msg_type:
        return {"failure_reason": "type is missing from body"}

    if msg_type == "text":

        if not parsed.get("content"):
            return {"failure_reason": "content (user written text) missing from body"}

        if not parsed.get("content"):
            return {"failure_reason": "content missing from body"}

    elif msg_type == "suggestion":

        if not parsed.get("origin"):
            return {"failure_reason": "origin missing from suggestion-request body"}
        if not parsed.get("destination"):
            return {"failure_reason": "destination missing from suggestion-request body"}
        if not parsed.get("time"):
            return {"failure_reason": "time missing from suggestion-request body"}

    return parsed

def _parse_json_string(raw_body):
    try:
        return json.loads(raw_body)
    except Exception as err:
        logger.error("Decoding JSON failed! %s", err)



def _remove_already_fetched_records(chat_history, short_sender_id):
    chat_history.reverse()
    included = []
    for record in chat_history:
        if record["sender-id"] == short_sender_id:
            included.reverse()
            return included + chat_history[:1]
        else:
            included.append(record)
    included.reverse()
    return included + chat_history[:1]


def _join_new_message_to_chat_history(chat_history, message):
    parsed_msg = {
        "sender-id":  get_short_user_id(message["sender-id"]),
        "type": message["type"],
        "date": datetime.utcnow().isoformat()
    }
    if message["type"] == "text":
        parsed_msg["content"] = message["content"],
    elif message["type"] == "suggestion":
        parsed_msg["origin"] = message["origin"]
        parsed_msg["destination"] = message["destination"]
        parsed_msg["time"] = message["time"]
    chat_history.append(parsed_msg)
    return chat_history


def _db_search_existing_ride(ride_id):
    response = query_db(ride_id)
    chat_history = response.get("Items")
    if chat_history:
        return chat_history[0]
    return {}


def _get_messages_from_result(db_record):
    if not db_record:
        return []
    raw_msg = db_record.get("messages", "[]")
    return json.loads(raw_msg)


def _get_existing_chatters(db_record):
    return db_record.get("people-in-chat", {})


def _send_http_response(statuscode, body):
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
