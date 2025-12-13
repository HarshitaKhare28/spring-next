"""
Simple MongoDB data seeder for the Spring Boot backend.
Creates sample `hotels` and `reviews` collections.

Usage:
    - Install dependencies (PowerShell):
            python -m venv .venv
            . ./.venv/Scripts/Activate.ps1
            pip install -r requirements.txt
    - Run:
            python seed_db.py --uri mongodb://localhost:27017 --db springnext --hotels 20 --reviews 100

The script reads from env var `MONGODB_URI` if `--uri` not provided.
"""

import os
import argparse
import random
from datetime import datetime, timezone
from faker import Faker
from pymongo import MongoClient
from dateutil import tz

fake = Faker()

def generate_hotel(hotel_id):
    return {
        "hotelId": hotel_id,
        "name": fake.company() + " Hotel",
        "city": fake.city(),
        "country": fake.country(),
        "description": fake.paragraph(nb_sentences=3),
        "price_per_night": round(random.uniform(40, 450), 2),
        "stars": random.choice([2,3,4,5]),
        "amenities": random.sample(["wifi","parking","pool","gym","spa","restaurant","bar"], k=random.randint(2,5)),
        "createdAt": datetime.now(timezone.utc)
    }


def generate_review(hotel_id):
    return {
        # follow the backend Review fields: hotelId (Long), userName, rating, text, createdAt
        "hotelId": hotel_id,
        "userName": fake.name(),
        "rating": random.randint(1,5),
        "text": fake.sentence(nb_words=20),
        "createdAt": datetime.now(timezone.utc)
    }


def main():
    parser = argparse.ArgumentParser(description="Seed MongoDB with hotels and reviews")
    parser.add_argument("--uri", default=os.environ.get("MONGODB_URI", "mongodb://localhost:27017"), help="MongoDB URI")
    parser.add_argument("--db", default=os.environ.get("MONGODB_DATABASE", "springnext"), help="Database name")
    parser.add_argument("--hotels", type=int, default=10, help="Number of hotels to create")
    parser.add_argument("--reviews", type=int, default=50, help="Total number of reviews to create (distributed across hotels)")
    parser.add_argument("--drop", action="store_true", help="Drop existing hotels and reviews collections before seeding")
    args = parser.parse_args()

    client = MongoClient(args.uri)
    db = client[args.db]

    hotels_coll = db.get_collection("hotels")
    reviews_coll = db.get_collection("reviews")

    if args.drop:
        print("Dropping existing collections 'hotels' and 'reviews'...")
        hotels_coll.drop()
        reviews_coll.drop()

    hotels = []
    for i in range(1, args.hotels + 1):
        h = generate_hotel(i)
        hotels.append(h)

    if hotels:
        print(f"Inserting {len(hotels)} hotels...")
        hotels_coll.insert_many(hotels)

    reviews = []
    for _ in range(args.reviews):
        hotel_id = random.randint(1, args.hotels)
        r = generate_review(hotel_id)
        reviews.append(r)

    if reviews:
        print(f"Inserting {len(reviews)} reviews...")
        reviews_coll.insert_many(reviews)

    print("Done. Inserted hotels and reviews into {}/{}".format(args.uri, args.db))

if __name__ == '__main__':
    main()
