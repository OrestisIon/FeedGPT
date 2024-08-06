from pydantic import BaseModel, ConfigDict
from enum import Enum
from typing import Optional

class CategoryTitleEnum(str, Enum):
    sports = 'Sports'
    news = 'News'
    technology = 'Technology'
    entertainment = 'Entertainment'
    lifestyle = 'Lifestyle'
    business = 'Business'
    science = 'Science'
    health = 'Health'
    education = 'Education'
    politics = 'Politics'
    environment = 'Environment'
    arts_culture = 'Arts & Culture'


class UserCreate(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    username: str
    email: str
    first_name: str = ""
    last_name: str = ""
    hashed_password: str
    is_superuser: bool = False

    
class User(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    username: str
    email: str
    country: Optional[str] = None
    occupation: Optional[str] = None
    gender: Optional[str] = None    
    age: Optional[int] = None 
    first_name: str
    last_name: str
    is_superuser: bool = False

# Update User
class UserUpdate(BaseModel):
    country: Optional[str] = None
    gender: Optional[str] = None
    occupation: Optional[str] = None
    age: Optional[int] = None 
    
class UserPrivate(User):
    hashed_password: str


class FeedBase(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    feed_url: str
    text: str
    is_scrape: bool
    followers_counter: int

class Feed(FeedBase):
    id: Optional[int] = None
    

    
#     category: Category





# class CategoryBase(BaseModel):
#     model_config = ConfigDict(from_attributes=True)

#     title: str

# class CategoryBase(BaseModel):
#     title: CategoryTitleEnum

# class Category(CategoryBase):
#     id: Optional[int] = None
 

