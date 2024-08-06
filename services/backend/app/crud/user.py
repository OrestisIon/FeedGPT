from app.models import User as UserDBModel
from app.schemas.user import UserCreate 
from fastapi import HTTPException
from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession
from passlib.context import CryptContext
import miniflux
from app.schemas.user import FeedBase
from app.models.user import User as UserTable
from app.models.user import Feed as FeedTable
from app.models.user import UserFeed as UserFeedTable
from sqlalchemy.exc import NoResultFound
from datetime import datetime

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


async def update_last_login(userid:int, db_session: AsyncSession):
    await db_session.execute(
        update(UserTable)
        .where(UserTable.id == userid)
        .values({"last_login": datetime.utcnow()})
    )
    await db_session.commit()
    
async def get_user(db_session: AsyncSession, user_id: int):
    user = (await db_session.scalars(select(UserDBModel).where(UserDBModel.id == user_id))).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

async def increment_feed_counter(db_session: AsyncSession, user_id: int, feed_id: int):
    # Increment the counter for the associated feed
    stmt = select(FeedTable).where(FeedTable.id == feed_id)
    try:
        feed = (await db_session.execute(stmt)).scalar_one()
        feed.followers_counter += 1
        await db_session.commit()
    except NoResultFound:
        await db_session.rollback()
        
async def decrement_feed_counter(db_session: AsyncSession, user_id: int, feed_id: int):
    # Decrement the counter for the associated feed
    stmt = select(FeedTable).where(FeedTable.id == feed_id)
    try:
        feed = (await db_session.execute(stmt)).scalar_one()
        feed.followers_counter -= 1
        await db_session.commit()
    except NoResultFound:
        await db_session.rollback()
                
async def get_user_by_email(db_session: AsyncSession, email: str):
    statement = select(UserDBModel).where(UserDBModel.email == email)
    result = await db_session.execute(statement)
    user = result.scalars().first()
    return user


async def create_user(
    db_session: AsyncSession, 
    user: UserCreate,
    client: miniflux.Client,
):
    hashed_password = pwd_context.hash(user.hashed_password)
    userm = UserDBModel(
        username=user.username, 
        email=user.email, 
        first_name=user.first_name, 
        last_name=user.last_name, 
        hashed_password=hashed_password, 
        is_superuser=user.is_superuser,
    )
    # Perform an action to validate the credentials, e.g., fetching the user's details
    # print(user_info)
    db_session.add(userm)
    try:
        user = client.create_user(username=user.email, password=hashed_password, is_admin=False)
    except miniflux.ClientError as e:
        await db_session.rollback()
        raise HTTPException(status_code=400, detail=f"Error creating user in miniflux. Reason: {e}")
    
    await db_session.commit()
    # refresh the user to get the id
    await db_session.refresh(userm)
    return userm


async def update_user_profile(db_session: AsyncSession, user_id: int, user: UserCreate):
    hashed_password = pwd_context.hash(user.hashed_password)
    await db_session.execute(
        update(UserDBModel)
        .where(UserDBModel.id == user_id)
        .values(
            {
                "username": user.username, 
                "email": user.email, 
                "country": user.country,
                "occupation": user.occupation,
                "age": user.age,
                "first_name": user.first_name, 
                "last_name": user.last_name, 
                "hashed_password": hashed_password,
            }
        )
    )
    await db_session.commit()
    return user