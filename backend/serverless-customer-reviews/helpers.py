import json
import string
import logging
import random
from operator import itemgetter
<<<<<<< HEAD
from dynamo_functions import query_db, write_to_db, scan_db
=======
>>>>>>> 48eaa6e85933ffd931e79c97c7636c079c97c5a8

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def validate_query_string_parameters(event, required_values):
    query_string_parameters = get_query_string_parameters(event)
    if query_string_parameters:
        missing_values = _check_that_required_values_exist(query_string_parameters, required_values)
        if missing_values:
            return (400, f"Body does not have following required values: {missing_values}")
        return {"result": "ok"}
    else:
        return create_http_response(400, f"Event has no query string parameters!")


def get_query_string_parameters(event):
    return event["queryStringParameters"]


def validate_body_and_data(event, required_values):
    """
        Check event has a body and that the body has content.
    """
    event_body = get_body_from_event(event)
    required_values = _check_event_source(event_body, required_values)
    if event_body:
        reuired_values = _check_event_source(event_body, required_values)
        missing_values = _check_that_required_values_exist(event_body, required_values)
        if missing_values:
            return create_http_response(400, f"Body does not have following required values: {missing_values}")
        else:
            missing_values = _validate_required_data_content(event_body, required_values, missing_values)
            if missing_values:
                return create_http_response(400, f"Following data objects are empty: {missing_values}")
        return {"result": "ok"}
    else:
        return create_http_response(400, "Event body has no data!")


def _check_event_source(event_body, required_values):
    """
        Some data might come from external sources.
    """
    if "external" in event_body:
        return ["origin", "destination", "departure-time", "departure-date"]
    else:
        return required_values


def _check_that_required_values_exist(event_data, required_values):
    missing_values = []
    for needed_value in required_values:
            if needed_value not in event_data:
                missing_values.append(needed_value)
    if missing_values:
        missing_values = ", ".join(missing_values)

    return missing_values


def _validate_required_data_content(event_body, required_values, missing_values):
    for needed_value in required_values:
        if not event_body[needed_value]:
            missing_values.append(needed_value)

    return missing_values
            

def get_body_from_event(event):
    return json.loads(event['body'])


def validate_results(response):
    """
        If response has statusCode it means that it's a response and it must be returned.
    """
    if "statusCode" in response:
        return False
    else:
        return True


def create_random_short_id():
    alphabet = string.ascii_lowercase + string.digits
    return ''.join(random.choices(alphabet, k=10))


def query_data_get_result(query_id, table_name, index_name):
    """
        Query data from dynamo and return the result Items.
    """
    query_response = query_db(query_id, table_name, index_name)
    response = _check_that_result_contains_items(query_response)
    return response
    

def _check_that_result_contains_items(response, scan=False):
    logger.info(json.dumps(response))
    if response["Count"] != 0 or response["Count"] != "0":
        items = response["Items"]
        if items:
            if scan:
                return items
            else:
                return items[0]
        else: 
            return create_http_response(200, [])
    else:
        return create_http_response(200, [])


def merge_old_and_new_data(new_data, old_user_data):
    """
        Combine old and new, updated data. Overwrite existing data and leave if nothing new.
    """
    old_user_data = check_if_data_already_exist_in_old_data(new_data, old_user_data)
    old_user_data = _stringify_dicts(old_user_data)

    return old_user_data


def _check_if_data_already_exist_in_old_data(new_data, old_user_data):
    for new_key, new_value in new_data.items():
        if new_key in old_user_data:
            old_user_data = _update_if_value_is_different(old_user_data, new_key, new_value)
        else:
            old_user_data[new_key] = new_value

    return old_user_data


def _update_if_value_is_different(old_user_data, key, new_value):
    old_value = old_data[key]
    if old_value != new_value:
        old_user_data[key] = new_value

    return old_user_data


def _stringify_dicts(old_user_data):
    for key, value in old_user_data.items():
        if isinstance(value, dict) or isinstance(value, list):
            old_user_data[key] = json.dumps(value)

    return old_user_data


def sort_results(response, query_string_parameters):
    if query_string_parameters:
        if "sort" in query_string_parameters:
            sort = query_string_parameters["sort"]
            try:
                response = sorted(response, key=itemgetter(sort))
            except:
                return create_http_response(400, f'List of database objects cannot be sorted by sort value {query_string_parameters["sort"]}')
    response = sorted(response, key=itemgetter("departure-date", "departure-time"))
    return response


def combine_lists_remove_duplicates(event_passenger_user_ids, old_passenger_user_ids ):
    return (old_passenger_user_ids + list(set(event_passenger_user_ids) - set(old_passenger_user_ids)))


def check_items(wanted_values_list, target_data):
    for item in wanted_values_list:
        if item not in target_data:
            return False
    return True


def create_http_response(statuscode, body):
    if not isinstance(body, list):
        body_list = []
        body_list.append(body)
        body = body_list

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
