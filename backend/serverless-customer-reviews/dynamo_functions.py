import os
import json
import boto3
import logging
import datetime
from boto3.dynamodb.conditions import Key
from helpers import create_http_response

logger = logging.getLogger()
logger.setLevel(logging.INFO)


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
    logger.info(json.dumps(response))
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
    logger.info(json.dumps(response))
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
    logger.info(json.dumps(response))


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
    for db_object in db_objects:
        matching_object = _compare_object_to_query_parameters(db_object, query_string_parameters, matching_objects)

    if not matching_objects:
        return create_http_response(200, [])

    return create_http_response(200, matching_objects)


def _compare_object_to_query_parameters(db_object, query_string_parameters, matching_objects):
    shared_items = {key: query_string_parameters[key] for key in query_string_parameters if key in db_object and query_string_parameters[key] == db_object[key]}
    if len(shared_items) == len(query_string_parameters):
        matching_objects.append(db_object)

    return matching_objects


def scan_table_get_results(table_name, scan=False):
    scan_result = scan_db(table_name)
    result = _check_that_result_contains_items(scan_result, scan=scan)
    return result


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


