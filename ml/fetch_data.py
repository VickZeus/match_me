
import os
from dotenv import load_dotenv
from supabase import create_client

load_dotenv(".env.local")

SUPABASE_URL = os.getenv("NEXT_PUBLIC_SUPABASE_URL")
SUPABASE_KEY = os.getenv("SECRET_ACCESS_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase credentials are missing!")

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)


def fetch_scores():

    all_records = []
    page_size = 1000
    start = 0

    while True:
        response = (
            supabase
            .table("user_scores")
            .select("username, quizname, score, created_at")
            .range(start, start + page_size - 1)
            .execute()
        )

        records = response.data

        if not records:
            break

        all_records.extend(records)

        if len(records) < page_size:
            break

        start += page_size

    print("Total records fetched:", len(all_records))
    return all_records


if __name__ == "__main__":
    records = fetch_scores()
    print("\nFirst 5 records:")
    for record in records[:5]:
        print(record)
