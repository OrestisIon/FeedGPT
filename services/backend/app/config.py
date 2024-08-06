from pydantic_settings import BaseSettings

import os

class Settings(BaseSettings):
    database_url: str
    echo_sql: bool = os.getenv('ECHO_SQL', 'True') == 'True'  # Default to 'True' if not set
    test: bool = os.getenv('TEST', 'False') == 'False'  # Default to 'False' if not set
    oauth_token_secret: str = os.getenv('OAUTH_TOKEN_SECRET')
    mini_url: str = os.getenv('MINI_URL')
    openai_api_key: str = os.getenv('OPENAI_API_KEY')
    mini_api_key: str = os.getenv('MINI_API_KEY')
    pinecone_api_key: str = os.getenv('PINECONE_API_KEY')
    pinecone_index: str = os.getenv('PINECONE_INDEX')
    pinecone_host: str = os.getenv('PINECONE_HOST')

settings = Settings()  # type: ignore
