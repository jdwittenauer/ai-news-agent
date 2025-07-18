import argparse
import feedparser
import os
from datetime import datetime
from dotenv import load_dotenv
from supabase import create_client


def get_published_date(published_str):
    date_obj = datetime.strptime(published_str[:16], "%a, %d %b %Y")
    return str(date_obj.date())

def clear_table(supabase):
    response = (
        supabase.table("ai_news_raw_daily")
        .delete()
        .neq("id", 0)
        .execute()
    )
    print(f"Deleted {len(response.data)} rows from the database.")

def get_last_entry_date(supabase):
    response = (
        supabase.table("ai_news_raw_daily")
        .select("published_date")
        .order("published_date", desc=True)
        .limit(1)
        .execute()
    )
    if response.data:
        return response.data[0]["published_date"]
    else:
        return None

def load_recent_entries(feed, supabase, num_entries, last_entry_date):
    print(f"Reading entries from {feed.feed.title}...")
    i = 0
    for entry in feed.entries[:num_entries]:
        if entry.get("content", "None") != "None":
            if last_entry_date and get_published_date(entry.published) <= last_entry_date:
                continue
            _ = (
                supabase.table("ai_news_raw_daily")
                .insert([
                    {
                        "created_at": str(datetime.now()),
                        "title": entry.title,
                        "link": entry.link,
                        "published_date": get_published_date(entry.published),
                        "summary": entry.summary,
                        "content": entry.content[0]['value']
                    }
                ])
                .execute()
            )
            i += 1
    print(f"Loaded {i} rows to the database.")


def main():
    load_dotenv()
    ainews_url = "https://news.smol.ai/rss.xml"
    db_url = os.getenv("SUPABASE_LOCAL_API_URL")
    db_key = os.getenv("SUPABASE_LOCAL_SERVICE_KEY")
    feed = feedparser.parse(ainews_url)
    supabase = create_client(db_url, db_key)
    parser = argparse.ArgumentParser()
    parser.add_argument("-c", "--clear", action="store_true", help="Clear the table before loading new entries")
    parser.add_argument("-n", "--num_entries", type=int, default=10, help="Number of recent entries to load")
    args = parser.parse_args()
    if args.clear:
        clear_table(supabase)
    last_entry_date = get_last_entry_date(supabase)
    load_recent_entries(feed, supabase, args.num_entries, last_entry_date)
    print()


if __name__ == "__main__":
    main()
