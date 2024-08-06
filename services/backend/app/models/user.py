from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy import Enum, Column, Integer, String, Boolean
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy import DateTime
from datetime import datetime
from . import Base
from typing import Any
from sqlalchemy.dialects.postgresql import JSON
from typing import Optional


# Define the ENUM type for category titles
# category_titles = ('General','Sports', 'News', 'Technology', 'Entertainment', 'Lifestyle', 'Business', 'Science', 'Health', 'Education', 'Politics', 'Environment', 'Arts & Culture')

# Association table for many-to-many relationship between User and Feed
class UserFeed(Base):
    __tablename__ = 'user_feed'
    user_id = Column(Integer, ForeignKey('user.id'), primary_key=True)
    feed_id = Column(Integer, ForeignKey('feeds.id'), primary_key=True)
    date_added = Column(DateTime, default=datetime.utcnow, index=True)

    # relationships
    user = relationship("User", back_populates="user_feeds")
    feed = relationship("Feed", back_populates="user_feeds")

class User(Base):
    __tablename__ = "user"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    username: Mapped[str] = mapped_column(index=True)
    email: Mapped[str] = mapped_column(index=True, unique=True)
    first_name: Mapped[str] = mapped_column(nullable=True)
    last_name: Mapped[str] = mapped_column(nullable=True)
    age: Mapped[int] = mapped_column(nullable=True)
    country: Mapped[str] = mapped_column(nullable=True)
    occupation: Mapped[str] = mapped_column(nullable=True)
    gender: Mapped[str] = mapped_column(nullable=True)
    hashed_password: Mapped[str]
    feed_preferences: Mapped[Any] = mapped_column(JSON, nullable=True) 
    is_superuser: Mapped[bool] = mapped_column(default=False)
    preferences_updated_at: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    last_login: Mapped[Optional[datetime]] = mapped_column(nullable=True)
    # Define the relationship to Feed
    user_feeds = relationship("UserFeed", back_populates="user", cascade="all, delete-orphan", order_by="desc(UserFeed.date_added)")

class Feed(Base):
    __tablename__ = "feeds"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
    title: Mapped[str] = mapped_column(index=True)
    feed_url: Mapped[str] = mapped_column(unique=True)
    is_scrape: Mapped[bool] = mapped_column(default=False)
    token_n: Mapped[int] = mapped_column(default=0)
    followers_counter: Mapped[int] = mapped_column(default=0)
    embedding: Mapped[str] = mapped_column(nullable=True)
    # Define the relationship to User
    user_feeds = relationship("UserFeed", back_populates="feed")
    
    

# class Category(Base):
#     __tablename__ = "categories"

#     id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True, index=True)
#     title: Mapped[str] = mapped_column(Enum(*category_titles, name="category_titles"))


