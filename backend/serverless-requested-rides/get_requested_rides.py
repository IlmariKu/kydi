import json
import logging
from dynamo_functions import query_db
from helpers import get_query_string_parameters, query_data_get_result, scan_table_get_results, sort_results, create_http_response
#import pdb; pdb.set_trace()

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """
        Get rides from db.
        Give query parameters with queryStringParameters.
    """
    logger.info(json.dumps(event))
    query_string_parameters = get_query_string_parameters(event)
    if _check_if_multiple_or_single_query(query_string_parameters):
        response = query_data_get_result(query_string_parameters["requested-ride-id"], "requestedRideTable", "requestedRideIndex")
        response = create_http_response(200, response)
    else:
        response = scan_table_get_results("requestedRideTable", scan=True)
        response = sort_results(response, query_string_parameters)
        response = create_http_response(200, response)

    logger.info(response)

    return response


def _check_if_multiple_or_single_query(query_string_parameters):
    if query_string_parameters:
        if "requested-ride-id" in query_string_parameters:
            return True
    else:
        return False
