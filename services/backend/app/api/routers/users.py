from app.api.dependencies.auth import validate_is_authenticated
from app.api.dependencies.core import DBSessionDep
from app.crud.user import get_user, create_user, increment_feed_counter, decrement_feed_counter
from app.crud.miniflux_manager import get_feed, create_feed, get_all_feeds
from app.schemas.user import User,UserCreate, UserUpdate
from fastapi import APIRouter, Depends, HTTPException
from app.api.dependencies.user import CurrentClient, DefaultClient
from app.models.miniflux import Feed, DiscoveredFeed, Category, Icon,IconData, Entry, FeedRe
from app.models.user import Feed as FeedTable
from app.models.user import UserFeed as UserFeedTable
from app.models.user import User as UserTable
import miniflux
from typing import List, Optional
from app.ml.reccomender import get_recommendations, fetch_feed
from sqlalchemy import select, and_
from sqlalchemy.exc import NoResultFound, SQLAlchemyError
from urllib.parse import urlparse
import json
from datetime import datetime

def is_valid_url(url: str) -> bool:
    try:
        result = urlparse(url)
        # Check if the scheme (protocol) and netloc (domain) are present
        return all([result.scheme, result.netloc])
    except Exception:
        return False

# TODO 4: Router Get Feed Entries from MiniFluxClient

router = APIRouter(
    prefix="/api",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)




'''''''''''''''''''''''''''''''''''''''''''''' User Functions '''''''''''''''''''''''''''''''''''''''''''''

@router.post("/register", response_model=User)
async def register_user(user: UserCreate, db_session: DBSessionDep, client: DefaultClient ):
    """
    Register a new user
    """
    return await create_user(db_session, user, client)

@router.post("/users/delete",
    dependencies=[Depends(validate_is_authenticated)])
async def delete_user(db: DBSessionDep, client: DefaultClient, user: User = Depends(validate_is_authenticated) ):
    """
    Delete the current user
    """
    # Attempt to delete user from external API
    try:
        email = user.email
        duser = client.get_user_by_username(email)
        response = client.delete_user(duser['id'])
    except Exception as e:
        # Handle potential errors, e.g., user not found in external API
        raise HTTPException(status_code=400, detail=f"Failed to delete user in external API: {str(e)}")

    # Attempt to delete user from Database
    userid = user.id
    try:
        stmt = select(UserTable).where(UserTable.id == userid)
        result = await db.execute(stmt)
        db_user = result.scalars().first()
        if db_user is None:
            # If no user is found, handle accordingly (e.g., return an error message)
            raise HTTPException(status_code=404, detail="User not found")
        await db.delete(db_user)
        await db.commit()
    except Exception as e:
        await db.rollback()
        # Handle potential errors, e.g., database operation failure
        raise HTTPException(status_code=500, detail=f"Failed to delete user in database: {str(e)}")

    return {"message": "User deleted successfully"}


@router.get("/users/me", response_model=User,
    dependencies=[Depends(validate_is_authenticated)])
async def get_user(user: User = Depends(validate_is_authenticated) ):
    """
    Return the user details
    """
    return user

@router.put("/users/me")
async def update_user(user_update: UserUpdate, db: DBSessionDep, user: User = Depends(validate_is_authenticated)):
    """
    Update the current user details.
    """
    stmt = select(UserTable).where(UserTable.id == user.id)
    result = await db.execute(stmt)
    db_user = result.scalars().first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Update fields if they are not None
    if user_update.age is not None:
        db_user.age = user_update.age
    if user_update.gender is not None:
        db_user.gender = user_update.gender
    if user_update.occupation is not None:
        db_user.occupation = user_update.occupation
    if user_update.country is not None:
        db_user.country = user_update.country
    
    db.add(db_user)
    await db.commit()
    return db_user


# @router.update("/users/me", response_model=User,
#     dependencies=[Depends(validate_is_authenticated)])
# async def update_user(user: User, db: DBSessionDep):
#     """
#     Update the user details
#     """
#     return await update_user(db, user)


'''''''''''''''''''''''''''''''''''''''''''''' Machine Learning Functions'''''''''''''''''''''''''''''''''''''''''''''


@router.get("/feeds/get_recommendations", dependencies=[Depends(validate_is_authenticated)])
async def genR( db_session : DBSessionDep, user: User = Depends(validate_is_authenticated), isNew: Optional[int] = 0):
    userid = user.id
    if isNew == 0:
        stmt = select(UserTable).where(UserTable.id == userid)
        result = await db_session.execute(stmt)
        dbuser = result.scalars().first()
        if dbuser.feed_preferences:
            if (datetime.utcnow() - dbuser.preferences_updated_at).days < 6:
                return dbuser.feed_preferences
    # Construct a single query to achieve the desired result
    query = select(FeedTable).join(UserFeedTable, UserFeedTable.feed_id == FeedTable.id).where(and_(UserFeedTable.user_id == userid, FeedTable.is_scrape == True)).limit(4)
    result = await db_session.execute(query)
    feeds = result.scalars().all()
    response = []
    for feed in feeds:
        # Get recommendations for each feed
        embedding = json.loads(feed.embedding)
        title = feed.title
        feed_url = feed.feed_url
        entries = await get_recommendations(embedding, title)
        response.append({"generalTitle": title, "feed_url":feed_url, "blogs": entries})
    stmt = select(UserTable).where(UserTable.id == userid)
    result = await db_session.execute(stmt)
    dbuser = result.scalars().first()
    if dbuser:
        dbuser.feed_preferences = response
        user.preferences_updated_at = datetime.utcnow()
        await db_session.commit()
    # Call pinecone for recommendations
    return response
'''''''''''''''''''''''''''''''''''''''''''''' Feed Functions '''''''''''''''''''''''''''''''''''''''''''''

@router.get(
    "/feeds/{feed_id}",
    response_model=Feed,
    dependencies=[Depends(validate_is_authenticated)],
)
async def feed(client: CurrentClient, feed_id: int ):
    """
    Get a feed by its ID
    """
    return await get_feed(client, feed_id)

@router.post("/feeds/delete",
    dependencies=[Depends(validate_is_authenticated)])
async def delete_feed(feed_id:int, db_session: DBSessionDep, client: CurrentClient, user: User = Depends(validate_is_authenticated) ):
    """
    Delete the feed subscription for the current user.
    """
    # Attempt to delete user from external API
    userid = user.id
    try:
        my_feed_url = client.get_feed(feed_id)['feed_url']
        response = client.delete_feed(feed_id)
    except Exception as e:
        # Handle potential errors, e.g., user not found in external API
        raise HTTPException(status_code=400, detail=f"Failed to delete user in external API: {str(e)}")
    try:
        # Construct the query with an explicit join and filter conditions
        query = select(UserFeedTable).join(
            FeedTable, FeedTable.id == UserFeedTable.feed_id
        ).where(
            and_(UserFeedTable.user_id == userid, FeedTable.feed_url == my_feed_url)
        )
        # Execute the query
        result = await db_session.execute(query)
        user_feed = result.scalars().first()
        
        # If no matching user_feed is found, raise an exception
        if not user_feed:
            raise NoResultFound("No matching feed subscription found for deletion.")
        myfeedid = user_feed.feed_id
        # Delete the found user_feed entry
        await db_session.delete(user_feed)
        
        # Commit the transaction
        await db_session.commit()
        response = await decrement_feed_counter(db_session, userid, myfeedid)
        
        return {"message": "Feed subscription deleted successfully."}
    
    except NoResultFound as e:
        # Rollback in case of no result found
        await db_session.rollback()
        raise HTTPException(status_code=404, detail=str(e))


@router.get(
    "/feeds",
    response_model=List[Feed],
    dependencies=[Depends(validate_is_authenticated)],
)
async def all_feeds(client: CurrentClient ):
    """
    Register a new user
    """
    return await get_all_feeds(client)

@router.get(
    "/icons",
    response_model=IconData,
    dependencies=[Depends(validate_is_authenticated)],
)
async def fetch_icon_from_id(client: CurrentClient, icon_id: int):
    """
    Get the Icon for an Icon ID
    """
    try:
        icon = client.get_icon(icon_id)
        return icon
    except Exception as e:
        print(f"Error fetching icon. Reason: {e}")
        return []


@router.post(
    "/feeds", 
    dependencies=[Depends(validate_is_authenticated)])
async def add_feed(feed_url: str, db: DBSessionDep, client: CurrentClient, user: User = Depends(validate_is_authenticated)):
    userid = user.id
    if not is_valid_url(feed_url):
        raise HTTPException(status_code=400, detail="Invalid feed URL provided.")
    try:
        response = client.create_feed(feed_url)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error creating feed. Reason: {e.get_error_reason()}")
    try:
        # Check if the feed already exists based on unique fields, e.g., feed_url
        stmt = select(FeedTable).where(FeedTable.feed_url == feed_url)
        result = await db.execute(stmt)
        db_feed = result.scalars().first()

        if not db_feed:
            # If the feed does not exist, scrape new feed data
            scraped_feed = await fetch_feed(feed_url)
            # Create a new Feed instance with scraped data
            # Assume scraped_data contains keys that match the Feed model's columns
            db_feed = FeedTable(**scraped_feed)  # Adjusted to unpack scraped_feed dict into Feed constructor
            # Add the new Feed to the session and commit
            db.add(db_feed)
            await db.commit()
            await db.refresh(db_feed)
        feedid = db_feed.id
        # Associate the feed with the user
        user_feed = UserFeedTable(user_id=userid, feed_id=feedid)
        db.add(user_feed)
        await db.commit()
    except SQLAlchemyError as e:
        # Handle database-related errors
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"A database error occurred: {e}")
    except Exception as e:
        # Handle generic errors, potentially from feed fetching
        await db.rollback()
        raise HTTPException(status_code=500, detail=f"An unexpected error occurred while processing the feed: {e}")
    response = await increment_feed_counter(db, userid, feedid)
    return {"message": "Feed added and scraped successfully"}

@router.post(
    "/discover",
    response_model=List[DiscoveredFeed],
    dependencies=[Depends(validate_is_authenticated)],
)
async def discover_feed(client: DefaultClient, website_url: str) -> List[DiscoveredFeed]:
    try:
        discovered_feed = client.discover(website_url)
        return discovered_feed
    except Exception as e:
        print(f"Error discovering feed. Reason: {e}")
        return []

@router.get(
    "/feeds/{feed_id}/entries",
    dependencies=[Depends(validate_is_authenticated)],
)
async def get_entries(client: CurrentClient, feed_id: int, search:str | None = None, starred:bool | None = None,direction:str | None = None, status:str | None = None, offset:int| None = None, order:str | None = None, limit:int | None = None):
    try:
        entries = client.get_feed_entries(feed_id, search=search, starred=starred, direction=direction, status=status, offset=offset, order=order, limit=limit)
        return entries
    except Exception as e:
        print(f"Error fetching feed entries. Reason: {e}")
        return []
    
@router.get(
    "/entries/{entry_id}",
    response_model = bool,
    dependencies=[Depends(validate_is_authenticated)],
)
async def bookmark_entry(client: CurrentClient, entry_id: int):
    try:
        response = client.toggle_bookmark(entry_id)
        return response
    except Exception as e:
        print(f"Error fetching feed entries. Reason: {e}")
        return []
    
    
@router.get(
    "/feeds/${feed_id}/refresh",
    dependencies=[Depends(validate_is_authenticated)],
)
async def refresh(client: CurrentClient, feed_id: int):
    try:
        entries = client.refresh_feed(feed_id)
        return entries
    except Exception as e:
        print(f"Error fetching feed entries. Reason: {e}")
        return []


