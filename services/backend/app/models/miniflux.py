from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
    
# Create Class for Feeds
class FeedRe(BaseModel):
    title: str
    rss_url: str
    description: str
    published: datetime
class Category(BaseModel):
    id: int
    user_id: int
    title: str
    hide_globally: bool


class Icon(BaseModel):
    feed_id: int
    icon_id: int

class IconData(BaseModel):
    id: int
    data: str
    mime_type: str

class Feed(BaseModel):
    id: int
    user_id: int
    feed_url: str
    site_url: str
    title: str
    checked_at: datetime
    next_check_at: datetime
    etag_header: Optional[str] = None
    last_modified_header: Optional[str] = None
    parsing_error_message: Optional[str] = None
    parsing_error_count: int
    scraper_rules: Optional[str] = None
    rewrite_rules: Optional[str] = None
    crawler: bool
    blocklist_rules: Optional[str] = None
    keeplist_rules: Optional[str] = None
    urlrewrite_rules: Optional[str] = None
    user_agent: Optional[str] = None
    cookie: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None
    disabled: bool
    no_media_player: bool
    ignore_http_cache: bool
    allow_self_signed_certificates: bool
    fetch_via_proxy: bool
    hide_globally: bool
    apprise_service_urls: Optional[str] = None
    category: dict
    icon: Icon
    

class Entry(BaseModel):
    id: int
    user_id: int
    feed_id: int
    status: str
    hash: str
    title: str
    url: str
    comments_url: Optional[str] = None
    published_at: datetime
    created_at: datetime
    changed_at: datetime
    content: Optional[str] = None
    author: Optional[str] = None    
    share_code: Optional[str] = None
    starred: bool
    reading_time: int
    enclosures: Optional[List[str]] = []
    tags: Optional[List[str]] = []

# create model for discover feeds
    # {
    #     "url": "http://example.org/feed.atom",
    #     "title": "Atom Feed",
    #     "type": "atom"
    # },
class DiscoveredFeed(BaseModel):
    url: str
    title: str
    type: str
    
    

