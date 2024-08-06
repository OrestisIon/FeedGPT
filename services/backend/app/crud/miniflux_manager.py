# load API key using dotenv
from dotenv import load_dotenv
import os
from typing import List
from fastapi.encoders import jsonable_encoder
from app.models.miniflux import Feed, DiscoveredFeed, Category, Icon, Entry
from typing import Dict
import miniflux
from app.config import settings


async def get_icon_by_feed_id(client: miniflux.Client, feed_id: int) -> List[Icon]:
    try:
        feeds_data = client.get_icon_by_feed_id(int)  # This returns a list of dictionaries
        # feeds = [Feed(**feed) for feed in feeds_data]  # Parse each dict into a Feed model instance
        return feeds_data
    except Exception as e:
        print(f"Error fetching feed Icon. Reason: {e}")
        return []
    
async def get_all_feeds(client: miniflux.Client) -> List[Feed]:
    try:
        feeds_data = client.get_feeds()  # This returns a list of dictionaries
        # feeds = [Feed(**feed) for feed in feeds_data]  # Parse each dict into a Feed model instance
        return feeds_data
    except Exception as e:
        print(f"Error fetching feeds. Reason: {e}")
        return []
    
async def get_feed(client: miniflux.Client, feed_id: int) -> Feed:
    try:
        feed_data = client.get_feed(feed_id)
        return feed_data
    except Exception as e:
        print(f"Error fetching feed. Reason: {e}")
        return None

# Description: Creates a new feed.
# Arguments: feed_url (feed URL), category_id (optional category ID).
# Returns: Feed ID.
async def create_feed(client: miniflux.Client, url: str, category_id: int = None, **kwargs) -> Feed:
    try:
        feed_data = client.create_feed(url, category_id, **kwargs)
        # add the feed to the database
        return feed_data
    except Exception as e:
        print(f"Error creating feed. Reason: {e}")
        return None
    
# Description: Updates a feed.
# Arguments: feed_id (feed ID), plus optional parameters for update.
# Returns: Updated feed details.
async def update_feed(client: miniflux.Client, feed_id: int, feed: Feed) -> Feed:
    try:
        feed_data = jsonable_encoder(feed)
        updated_feed = client.update_feed(feed_id, feed_data)
        return updated_feed
    except Exception as e:
        print(f"Error updating feed. Reason: {e}")
        return None
    
async def delete_feed(client: miniflux.Client, feed_id: int) -> Feed:
    try:
        deleted_feed = client.delete_feed(feed_id)
        return deleted_feed
    except Exception as e:
        print(f"Error deleting feed. Reason: {e}")
        return None 
    
async def refresh_feed(client: miniflux.Client, feed_id: int) -> Feed:
    try:
        refreshed_feed = client.refresh_feed(feed_id)
        return refreshed_feed
    except Exception as e:
        print(f"Error refreshing feed. Reason: {e}")
        return None

async def get_feed_entries(client: miniflux.Client, feed_id: int, **kwargs ) -> List[Entry]:
    try:
        feed_entries = client.get_feed_entries(feed_id, **kwargs)
        entries = feed_entries.get("entries")
        if entries is None:
            return []
        return entries
    except Exception as e:
        print(f"Error fetching feed entries. Reason: {e}")
        return []
    
async def toggle_bookmark(client: miniflux.Client,  entry_id: int ) -> bool:
    try:
        isSuccess = client.toggle_bookmark(entry_id)
        return isSuccess
    except Exception as e:
        print(f"Error bookmarking. Reason: {e}")
        return []
    
async def get_category_feeds(client: miniflux.Client, category_id: int) -> List[Feed]:
    try:
        category_feeds = client.get_category_feeds(category_id)
        return category_feeds
    except Exception as e:
        print(f"Error fetching category feeds. Reason: {e}")
        return []
    

    
async def create_category(client: miniflux.Client, title: str) -> Category:
    try:
        category_data = client.create_category(title)
        return category_data
    except Exception as e:
        print(f"Error creating category. Reason: {e}")
        return None

# def (client, feed_id, category_id):
# # Authentication using username/password
# client = miniflux.Client(URL, "my_username", "my_secret_password")

# # Authentication using an API token
# client = miniflux.Client(URL, api_key="My Secret Token")

# # Get all feeds
# feeds = client.get_feeds()

# async def get_client(usr, pswd):
#     #  Error checking for the user and password
#     if usr is None or pswd is None:
#         raise ValueError("Username and password cannot be None")
#     try:
#         client = miniflux.Client(URL, usr, pswd)
#         return client
#     except Exception as e:
#         print(f"Error fetching authenticating user. Reason: {e}")
        
# # Refresh a feed
# client.refresh_feed(123)

# # Discover subscriptions from a website
# subscriptions = client.discover("https://example.org")

# # Create a new feed, with a personalized user agent and with the crawler enabled
# feed_id = client.create_feed("http://example.org/feed.xml", 42, crawler=True, user_agent="GoogleBot")

# # Fetch 10 starred entries
# entries = client.get_entries(starred=True, limit=10)

# # Fetch last 5 feed entries
# feed_entries = client.get_feed_entries(123, direction='desc', order='published_at', limit=5)

# # Update a feed category
# client.update_feed(123, category_id=456)

# # main
# # parameters username and password
# if __name__ == "__main__":
#     client = get_client("my_username", "my_secret_password")
#     feeds = get_feeds(client)
#     print(feeds)