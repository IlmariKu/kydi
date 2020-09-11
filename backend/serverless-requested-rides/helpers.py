import json
import string
import logging
import random
from operator import itemgetter

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
    if event_body:
        reuired_values = _check_event_source(event_body, required_values)
        missing_values = _check_that_required_values_exist(event_body, required_values)
        if missing_values:
            return create_http_response(400, f"Body does not have following required values: {missing_values}")
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


def get_body_from_event(event):
    return json.loads(event['body'])


def check_validation_results(response):
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
    if response["Count"] != 0 or response["Count"] != "0":
        items = response["Items"]
        if scan:
            return items
        else:
            return items[0]
    else:
        return create_http_response(400, "No results for query!")


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


def scan_table_get_results(table_name, scan=False):
    scan_result = scan_db(table_name)
    result = _check_that_result_contains_items(scan_result, scan=scan)
    return result


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



def query_db(query_id, table_name, index_name):
    """
        Get rides from DB with specific queries. 
        Following arguments are accepted: datetime, from, to.
    """
    table_name = _get_table_name(table_name)
    index_name = _get_index_name(index_name)
    dynamodb = boto3.resource("dynamodb", region_name="eu-central-1")
    table = dynamodb.Table(table_name)
    response = table.query(KeyConditionExpression=Key(index_name).eq(query_id))
    #logger.info(json.dumps(response))
    return response


def scan_db(table_name):
    """
        Get all rides from DB. 
        Following arguments are accepted: datetime, from, to.
    """
    table_name = _get_table_name(table_name)
    dynamodb = boto3.resource("dynamodb", region_name="eu-central-1")
    table = dynamodb.Table(table_name)
    response = table.scan()
    #logger.info(json.dumps(response))
    return response


def write_to_db(table_name, write_object):
    """
        Argument must be a dictionary!
        Writes data to dynamodb.
    """
    table_name = _get_table_name(table_name)
    dynamodb = boto3.resource("dynamodb", region_name="eu-central-1")
    table = dynamodb.Table(table_name)
    write_object = _turn_all_values_to_strings(write_object)
    response = table.put_item(
        Item=write_object
    )
    #logger.info(json.dumps(response))


def _get_table_name(table_name):
    """
        Get table name from env variables.
    """
    return os.environ[table_name]


def _get_index_name(index_name):
    """
        Get dynamodb table index from env variables.
    """
    return os.environ[index_name]


def _remove_empty_values(db_object):
    return {k:v for k, v in db_object.items() if v}


def _turn_all_values_to_strings(db_object):
    return {str(k):str(v) for k, v in db_object.items()}


def _remove_whitespace(db_object):
    return {k.strip():v.strip() for k, v in db_object.items()}


def query_database_items(query_string_parameters, db_objects):
    matching_objects = []
    if isinstance(db_objects, list):
        for db_object in db_objects:
            matching_objects = _compare_object_to_query_parameters(db_object, query_string_parameters, matching_objects)
    else:
        matching_objects = _compare_object_to_query_parameters(db_objects, query_string_parameters, matching_objects)

    if not matching_objects:
        return create_http_response(200, [])

    return create_http_response(200, matching_objects)


def _compare_object_to_query_parameters(db_object, query_string_parameters, matching_objects):
    shared_items = {key: query_string_parameters[key].lower() for key in query_string_parameters if key in db_object and query_string_parameters[key].lower() == db_object[key].lower()}
    if len(shared_items) == len(query_string_parameters):
        matching_objects.append(db_object)

    return matching_objects
