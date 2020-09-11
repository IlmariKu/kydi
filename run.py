#!/usr/bin/env python3

import os
import datetime
import sys
import subprocess

def error_check_menu_number(select, options_list):
    try:
        selected = int(select)
        if len(options_list) >= selected:
            return selected
        print(str(select) + " is not in the list to be selected")
    except ValueError:
        print(select + " is not a number")
    return None

def get_possible_commands():
    return [""] + list(commands.keys())

def get_passed_arguments():
    if len(sys.argv) > 1:
        arguments = sys.argv[1:]
        if arguments[0] not in options:
            print(arguments[0] + " is not an option!")
            sys.exit(1)
        return arguments

def make_user_select_from_menu():
    for c, option in enumerate(options):
        if option == "":
            continue
        print(str(c) + ") " + translations[option] + " (" + option + ")")
    print("Select operation: ")
    selection = error_check_menu_number(input(), options)
    return selection

commands = {
    "build_frontend": "npm i",
    "start_frontend": "echo 'SELAIN-URL: localhost:8080' && npm start",
    "build_customer_reviews_dev": 'ndt deploy-serverless backend customer-reviews',
    "build_online_chat_dev": 'ndt deploy-serverless backend online-chat',
    "build_requested_rides_dev": 'ndt deploy-serverless backend requested-rides',
    "build_ride_database_dev": 'ndt deploy-serverless backend ride-database',
    "build_users_dev": 'ndt deploy-serverless backend users',
    "build_customer_reviews_prod": 'ndt deploy-serverless backend customer-reviews',
    "build_online_chat_prod": 'ndt deploy-serverless backend online-chat',
    "build_requested_rides_prod": 'ndt deploy-serverless backend requested-rides',
    "build_ride_database_prod": 'ndt deploy-serverless backend ride-database',
    "build_users_dev": 'ndt deploy-serverless backend users',
    "test_ride_database": "cd backend/serverless-ride-database && python3 -m unittest"
}

translations = {
    "build_frontend": "Build local frontend",
    "start_frontend": "Start frontend (browser-URL: localhost:8080)",
    "build_customer_reviews_dev": 'DEV Deploy customer-reviews',
    "build_online_chat_dev": 'DEV Deploy online-chat',
    "build_requested_rides_dev": 'DEV Deploy requested rides',
    "build_ride_database_dev": 'DEV Deploy rides',
    "build_users_dev": 'PROD Deploy users',
    "build_customer_reviews_prod": 'PROD Deploy customer-reviews',
    "build_online_chat_prod": 'PROD Deploy online-chat',
    "build_requested_rides_prod": 'PROD Deploy requested rides',
    "build_ride_database_prod": 'PROD Deploy rides',
    "build_users_prod": 'PROD Deploy users',
    "test_ride_database": "TEST rides"
}


options = get_possible_commands()
arguments = get_passed_arguments()


keyboardinterrupt = False

if arguments:
    command_name = arguments[0]
    selection = command_name
else:
    try:
        number = make_user_select_from_menu()
        selection = options[number]

    except KeyboardInterrupt:
        selection = None
        keyboardinterrupt = True

# Environment
my_env = os.environ.copy()
env_mode = "dev"
if "_prod" in selection:
    env_mode = "prod"

my_env["DEV_MODE"] = env_mode
my_env["PATH"] = "/usr/sbin:/sbin:" + my_env["PATH"]

response = subprocess.run(
    commands[selection],
    shell=True,
    cwd=os.getcwd(),
    executable="/bin/sh",
    env=my_env
)
