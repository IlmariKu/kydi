import unittest
import requests
import json

class TestGetRides(unittest.TestCase):

    def test_get_all_search(self):
        response = requests.get("https://daz7xbi25e.execute-api.eu-central-1.amazonaws.com/dev/get_rides")
        rides = json.loads(response.text)
        self.assertEqual(len(rides), 3)
        # TODO: Backend filters all old rides

    def test_oulu_kempele_search(self):
        response = requests.get("https://daz7xbi25e.execute-api.eu-central-1.amazonaws.com/dev/get_rides?origin=oulu&destination=kempele")
        rides = json.loads(response.text)
        self.assertEqual(len(rides), 1)
        # TODO: GET_RIDES SHOWS THE CORRECT RESULTS

    def test_ride_id_query(self):
        response = requests.get("https://daz7xbi25e.execute-api.eu-central-1.amazonaws.com/dev/get_rides?ride-id=3t54bp8puu")
        rides = json.loads(response.text)
        self.assertEqual(rides[0]["origin"], "Oulu")
        self.assertEqual(rides[0]["ride-id"], "3t54bp8puu")
        # TODO: GET_RIDES SHOWS THE CORRECT RESULTS

    def test_non_existent_ride(self):
        response = requests.get("https://daz7xbi25e.execute-api.eu-central-1.amazonaws.com/dev/get_rides?ride-id=eioleidta234")
        rides = json.loads(response.text)
        self.assertEqual(len(rides), 0)
        # TODO: GET_RIDES SHOWS THE CORRECT RESULTS

if __name__ == '__main__':
    unittest.main()
