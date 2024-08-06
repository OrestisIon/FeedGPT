from app.models import Feed as FeedDBModel
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession


# TODO: Add Feed to Scraper queue, which adds Category and Text to Feed which is already added in the DB by then
async def add_feed(db_session: AsyncSession, feed_data: dict):
    # check if feed already exists
    feed = (await db_session.scalars(select(FeedDBModel).where(FeedDBModel.feed_url == feed_data['feed_url']))).first()
    if feed:
        return feed
    # TODO call add to scraper queue
    feed = FeedDBModel(**feed_data)
    db_session.add(feed)
    await db_session.commit()
    await db_session.refresh(feed)
    return feed

async def get_feed(db_session: AsyncSession, feed_id: int):
    feed = (await db_session.scalars(select(FeedDBModel).where(FeedDBModel.id == feed_id))).first()
    if not feed:
        raise HTTPException(status_code=404, detail="Feed not found")
    return feed

async def get_to_scrape_feeds(db_session: AsyncSession):
    return await db_session.execute(select(FeedDBModel).where(FeedDBModel.is_scrape == True))

async def get_user_feeds(db_session: AsyncSession, user_id: int):
    return await db_session.execute(select(FeedDBModel).where(FeedDBModel.user_id == user_id))