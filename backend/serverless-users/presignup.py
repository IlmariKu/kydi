import boto3
import json
import logging
from dynamo_functions import write_to_db
#import pdb; pdb.set_trace()

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def handler(event, context):
    """"
        Write data from Cognito to Dynamo.
        Validate user data and return it to Dynamo.
    """
    logging.info(json.dumps(event))
    wanted_data = _parse_event(event)
    logger.info(json.dumps(wanted_data))
    write_to_db(wanted_data)

    return event


def _parse_event(event):
    """
        Get wanted data from AWS API Gateway event.
    """
    wanted_data = {}
    request = event["request"]
    user_attributes = request ['userAttributes']
    wanted_data["first_name"] = user_attributes["first_name"]
    wanted_data["last_name"] = user_attributes["family_name"]
    wanted_data["email"] = user_attributes["email"]
    wanted_data["user-id"] = event["userPoolId"]

    return wanted_data
