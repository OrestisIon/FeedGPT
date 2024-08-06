from pinecone import Pinecone
from openai import OpenAI
from app.config import settings
from sqlalchemy.ext.asyncio import AsyncSession
import feedparser
import requests
from datetime import datetime, timedelta
from uuid import uuid4
import random
import pandas as pd
import time
import requests
import tiktoken
from app.models.user import Feed
import json


key = settings.openai_api_key
client = OpenAI(api_key = key)

def get_embedding(text, model="text-embedding-3-small"):
   text = text.replace("\n", " ")
   return client.embeddings.create(input = [text], model=model, dimensions=512).data[0].embedding

def num_tokens_from_string(string: str, encoding_name: str = "cl100k_base") -> int:
    """Returns the number of tokens in a text string."""
    encoding = tiktoken.get_encoding(encoding_name)
    num_tokens = len(encoding.encode(string))
    return num_tokens

# Configure Celery
# Initialize your sentence model
model = "text-embedding-3-small"

# From here on, everything is identical to the REST-based client.




async def get_recommendations(embedding,url, num = 4) :
    pc = Pinecone(api_key=settings.pinecone_api_key)
    index = pc.Index(host = settings.pinecone_host)
    try:
        feeds = index.query(
            namespace="original",
            vector=embedding,
            top_k=num,
            include_values=False,
            include_metadata=True
        )
    except Exception as e:
        print(f"Error querying Pinecone. Reason: {e}")
        return []
    print(f"Pinecone: {feeds}")
    matches = feeds['matches']
    seen_rss_urls = set([url])  # Initialize the set with the initial entry url
    # Extract data, ensuring rss_url is unique
    extracted_data = []
    for match in matches:
        rss_url = match['metadata']['rss_url']
        if rss_url not in seen_rss_urls:
            seen_rss_urls.add(rss_url)
            extracted_data.append({
                'rss_url': rss_url,
                'title': match['metadata']['title'],
                'published': match['metadata']['published'],
                'description': match['metadata']['description'],
                'score': match['score']
            })
    return extracted_data 

    

# @app.post("recom/by_feed")
# async def generate_and_upload_embeddings(db: AsyncSession , user):
    
#     task_id = generate_embeddings.delay(texts).id
#     # Use background tasks to check task status and upsert to Pinecone if necessary
#     background_tasks.add_task(check_and_upsert_embeddings, task_id, texts)
#     return {"message": "Task submitted", "task_id": task_id}

# @app.post("recom/by_likes")
# async def generate_and_upload_embeddings(background_tasks: BackgroundTasks, texts: list[str]):
#     task_id = generate_embeddings.delay(texts).id
#     # Use background tasks to check task status and upsert to Pinecone if necessary
#     background_tasks.add_task(check_and_upsert_embeddings, task_id, texts)
#     return {"message": "Task submitted", "task_id": task_id}


 
async def fetch_feed(url: str) :
    # Step 1: Fetch all the entries from the RSS feeds and filter them by date.
    try:
        text = ""
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.3'}
        feedparser.api._open_resource = lambda *args, **kwargs: requests.get(args[0], headers=headers, timeout=5).content
        d = feedparser.parse(url)
        
        if d['feed'].get('title') is None:
            return

        text+=   d['feed'].get('title')
        if d['feed'].get('description') is not None:
            text+=  ' ' + d['feed'].get('description')
            
        if d['feed'].get('summary') is not None:
            text+=  ' ' + d['feed'].get('summary')
            
        # Loop throught the entries until the text is larger than 500 character and smaller than 1000
        entries = d['entries']
        
        for entry in entries:
            if len(text) > 1000:
                break
            if entry.get('title') is not None:
                text += ' ' + entry.get('title')
    except Exception as e:
        print(f"Error fetching {url}. Reason: {e}")
        return
    myfeed = {
        "feed_url": url,
        "title": d['feed'].get('title'),
        "token_n": num_tokens_from_string(text),
        "is_scrape": False,
    }
    if myfeed["token_n"] > 100:
        try:
            embedding = get_embedding(text)
        except Exception as e:
            print(f"Error generating embeddings for {url}. Reason: {e}")
            return myfeed
        myfeed['embedding'] = json.dumps(embedding)
        myfeed['is_scrape'] = True  # set the feed as scraped
    return myfeed
