"""Print the club's weekly reminder from settings.ini."""
import configparser

config = configparser.ConfigParser()
config.read("settings.ini")
club = config["reminder"]["club"]
day = config["reminder"]["day"]
time = config["reminder"]["time"]

print(f"Reminder: {club} meets on {day} at {time}. Bring your own board.")
