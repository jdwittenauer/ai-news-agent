import argparse
import feedparser
import json
import os
import re
import time
from datetime import datetime
from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai.errors import ClientError
from supabase import create_client


INSTRUCTIONS = """\
You are acting as an AI research analyst with deep familiarity in artificial intelligence, machine learning,
and adjacent scientific domains (e.g., neuroscience, optimization, data science, robotics, computational
mathematics).

You will be given a set of abstracts from recent arXiv submissions. Your task is to:

- Read each abstract carefully and evaluate it based solely on the abstract text
- Identify the most promising papers to follow up on, such as those that are:
    - Novel in approach, problem framing, or application
    - Methodologically sound and non-trivial
    - Potentially impactful to the AI research community, either directly or by influencing adjacent fields

Stay broad in scope — AI can intersect with physics, biology, mathematics, etc. If the idea could meaningfully
advance AI or its capabilities, it qualifies.

You will be given 20 abstracts at a time to read.  Select only those that meet the above criteria.  You may
select AT MOST 5 papers from the provided set, so think carefully and choose only the best candidates.

# Important

- Do not summarize the abstracts; just focus on identifying the best ones
- Use your own judgment and domain knowledge — you are not just scoring keywords, you are assessing
  research potential
- If none meet the bar, output an empty list

# Topics To Avoid

Certain topics are not of interest and should be eliminated from selection.

- Topics related to bias, toxicity, and other similar areas
- Topics related to model safety or alignment
- Social science topics or studies related to impacts on society

# Output Format

Output a strict JSON array with no extra text using the following schema:

[
  {
    "index": "<paper index>",
    "title": "<paper title>",
    "reason": "<1-2 sentence explanation why this paper is promising>"
  },
  ...
]

# Input

Below are the article indexes, titles, and corresponding abstracts.  Each article is presented in XML
tags for clarity.

{{article_data}}

Output:"""


def get_published_date(published_str):
    date_obj = datetime.strptime(published_str[:16], "%a, %d %b %Y")
    return str(date_obj.date())

def generate_with_retry(client, **kwargs):
    max_retries = 3
    for attempt in range(max_retries):
        try:
            response = client.models.generate_content(**kwargs)
            return response
        except ClientError as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            if attempt == max_retries - 1:
                raise
            print("Waiting before retrying...")
            time.sleep(60)
            print("Retrying...")
    return None

def get_abstracts(entries):
    abstracts_list = []
    index = 0
    for entry in entries:
        title = entry.title.strip()
        abstract = entry.summary.strip().split("Abstract: ")[1]
        abstract_str = f"<index>{index}</index>\n<title>{title}</title>\n<abstract>\n{abstract}\n</abstract>\n"
        abstracts_list.append(abstract_str)
        index += 1
    return "\n".join(abstracts_list)

def clear_table(supabase):
    response = (
        supabase.table("arxiv_raw_daily")
        .delete()
        .neq("id", 0)
        .execute()
    )
    print(f"Deleted {len(response.data)} rows from the database.")

def run_batch(client, supabase, entries):
    count = 0
    response = generate_with_retry(
        client,
        model="gemini-2.0-flash-lite",
        config=types.GenerateContentConfig(
            temperature=1.0
        ),
        contents=[INSTRUCTIONS.replace("{{article_data}}", get_abstracts(entries))]
    )
    tokens = response.usage_metadata.total_token_count
    try:
        json_str = re.sub(r"^```json\s*|\s*```$", "", response.text.strip(), flags=re.DOTALL)
        response = json.loads(json_str)
        for r in response:
            entry = entries[int(r["index"])]
            supabase.table("arxiv_raw_daily").insert({
                "created_at": str(datetime.now()),
                "title": r["title"],
                "link": entry.link,
                "published_date": get_published_date(entry.published),
                "abstract": entry.summary.strip().split("Abstract: ")[1],
                "reason": r["reason"]
            }).execute()
            count += 1
        return count, tokens
    except Exception as e:
        print(f"Batch error: {e}")
        print ("Skipping batch...")
        return 0, tokens

def main():
    load_dotenv()
    arxiv_url = "https://rss.arxiv.org/rss/cs"
    db_url = os.getenv("SUPABASE_LOCAL_API_URL")
    db_key = os.getenv("SUPABASE_LOCAL_SERVICE_KEY")
    feed = feedparser.parse(arxiv_url)
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    supabase = create_client(db_url, db_key)
    parser = argparse.ArgumentParser()
    parser.add_argument("-c", "--clear", action="store_true", help="Clear the table before loading new entries")
    args = parser.parse_args()
    if args.clear:
        clear_table(supabase)
    total_count = 0
    total_tokens = 0
    batch_size = 20
    num_entries = len(feed.entries)
    print(f"Processing {num_entries} entries in batches of {batch_size}...")
    for start in range(0, num_entries, batch_size):
        end = min(start + batch_size, num_entries)
        batch_entries = feed.entries[start:end]
        print(f"Running batch {int(start/batch_size)+1}...")
        batch_count, batch_tokens = run_batch(client, supabase, batch_entries)
        total_count += batch_count
        total_tokens += batch_tokens
    print(f"Saved {total_count} papers using {num_entries//batch_size} calls and {total_tokens} tokens.")


if __name__ == "__main__":
    main()
