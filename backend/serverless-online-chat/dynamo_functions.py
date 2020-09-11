import os
import json
import boto3
import logging
import datetime
from boto3.dynamodb.conditions import Key
#import pdb; pdb.set_trace()

DBNAME = os.environ["chatTable"]
INDEXNAME = os.environ["indexName"]

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def query_db(ride_id):
    dynamodb = boto3.resource("dynamodb", region_name="eu-central-1")
    table = dynamodb.Table(DBNAME)
    response = table.query(KeyConditionExpression=Key(INDEXNAME).eq(ride_id))
    logger.info(json.dumps(response))
    return response


def write_to_db(data):
    """
        Argument must be a dictionary!
        Writes data to dynamodb.
    """
    logger.info(json.dumps(data))
    dynamodb = boto3.resource("dynamodb", region_name="eu-central-1")
    table = dynamodb.Table(DBNAME)
    response = table.put_item(
        Item=data
    )
    logger.info(json.dumps(response))


def _remove_empty_values(db_object):
    return {k:v for k, v in db_object.items() if v}


def _turn_all_values_to_strings(mapped_row):
    return {str(k):str(v) for k, v in mapped_row.items()}


def _remove_whitespace(mapped_row):
    return {k.strip():v.strip() for k, v in mapped_row.items()}
