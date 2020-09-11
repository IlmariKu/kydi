
#### Requested rides database

Requested are kimppakyyti rides users want but which are not currently posted.

### DB Table schema. 

{
    "requested-ride-id": "jiaisadsa", #Python uuid unique value which acts as partition key for dynamo
    "user-id": "jdijffoa", # User who is requesing this ride 
    "start": "Helsinki",
    "destination": "Turku",
    "posted-datetime": "09092020", # Date-month-year when the requested was posted
    "wanted-ride-datetime": "0202020202020", # datetime when the ride should start
    "responded": "False # False if the requested is still unanswered, True if answered. Give value as string
    "valid-until": "9402024024", # Time until the request has to be answered
    "status": "True" # True if status is still online, False if not.
    "text": "Hei, mummo jäi katujyrän alle ja nyt pitäis päästä stadiin perinnönjakoon."
}