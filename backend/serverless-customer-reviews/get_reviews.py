import boto3
import json
import logging
import ast
from dynamo_functions import scan_table_get_results, query_database_items
from helpers import  validate_query_string_parameters, validate_results, get_query_string_parameters, create_http_response

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """
        Query dynamo with user-id and return all profile data.
    """
    logging.info(json.dumps(event))
    query_string_parameters = get_query_string_parameters(event)
    response = scan_table_get_results("reviewTable", scan=True)
    if validate_results(response):
        if _is_user_id(query_string_parameters):
            response = query_database_items(query_string_parameters, response)
        response = create_http_response(200, response)

    logger.info(json.dumps(response))

    return response


def _is_user_id(query_string_parameters):
    """
        Query all reviews for one specific user.
    """
    if "user-id" in query_string_parameters:
        return True
    else:
        return False
    