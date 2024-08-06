from typing import Annotated

from app import models
from app.api.dependencies.core import DBSessionDep
from app.crud.user import get_user_by_email
from app.schemas.auth import TokenData
from app.utils.auth import decode_jwt, oauth2_scheme
from fastapi import Depends, HTTPException, status
from jwt import PyJWTError
import miniflux
from app.config import settings


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)], db_session: DBSessionDep) -> models.User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_jwt(token)
        email = payload.get("sub")
        if email is None:
            print("Email not found")
            raise credentials_exception
        # permissions = payload.get("permissions")
        # if permissions is None:
        #     raise credentials_exception
        # token_data = TokenData(email=email, permissions=permissions)
        token_data = TokenData(email=email)
    except PyJWTError as e:
        raise credentials_exception
    user = await get_user_by_email(db_session, email)
    if user is None:
        print("User not found")
        raise credentials_exception
    return user


async def get_client(user: models.User = Depends(get_current_user)):
    print(f"Creating Miniflux User: {user.email}")
    return miniflux.Client(settings.mini_url, user.email, user.hashed_password)

def get_super():
    return miniflux.Client(settings.mini_url, api_key=settings.mini_api_key)

DefaultClient = Annotated[miniflux.Client, Depends(get_super)]
CurrentClient = Annotated[miniflux.Client, Depends(get_client)]
CurrentUserDep = Annotated[models.User, Depends(get_current_user)]

