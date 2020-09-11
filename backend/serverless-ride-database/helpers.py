import json
import string
import logging
import random
import boto3
import os
from boto3.dynamodb.conditions import Key
from operator import itemgetter

logger = logging.getLogger()
logger.setLevel(logging.INFO)

TABLE_NAME = os.environ.get("rideTable")
INDEX_NAME = os.environ.get("rideIndex")

def create_random_short_id():
    alphabet = string.ascii_lowercase + string.digits
    return ''.join(random.choices(alphabet, k=10))

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

    def _create_cors_headers():
        return {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': "true",
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token"
        }

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


def query_db(query_id):
    """
        Get rides from DB with specific queries.
        Following arguments are accepted: datetime, from, to.
    """
    dynamodb = boto3.resource("dynamodb", region_name="eu-central-1")
    table = dynamodb.Table(TABLE_NAME)
    response = table.query(KeyConditionExpression=Key(INDEX_NAME).eq(query_id))
    return response.get("Items", [])


def scan_db():
    dynamodb = boto3.resource("dynamodb", region_name="eu-central-1")
    table = dynamodb.Table(TABLE_NAME)
    response = table.scan()
    return response.get("Items", [])


def write_to_db(table_name, write_object):
    """
        Argument must be a dictionary!
        Writes data to dynamodb.
    """
    dynamodb = boto3.resource("dynamodb", region_name="eu-central-1")
    table = dynamodb.Table(TABLE_NAME)
    write_object = _turn_all_values_to_strings(write_object)
    response = table.put_item(
        Item=write_object
    )
    return response

def _turn_all_values_to_strings(db_object):
    return {str(k):str(v) for k, v in db_object.items()}


def _remove_whitespace(db_object):
    return {k.strip():v.strip() for k, v in db_object.items()}


def _compare_object_to_query_parameters(db_object, query_string_parameters, matching_objects):
    shared_items = {key: query_string_parameters[key] for key in query_string_parameters if key in db_object and query_string_parameters[key] == db_object[key]}
    if len(shared_items) == len(query_string_parameters):
        matching_objects.append(db_object)

    return matching_objects
