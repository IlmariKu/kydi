

#### Post new rides

JSON required to post new rides:

{
    "start": str, #City where journey starts
    "destination": str, #City where journey should go
    "driver-user-id": str, #user-id of the driver who is responsible for the ride
    "datetime": datetime, #Date and clock time when the ride is to go
}


#### Get existing rides 

JSON query required to get rides:

{
    "start": str, #City where journey should start
}
