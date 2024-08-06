"""your message here

Revision ID: 0ba51bb05177
Revises: 29a07ed0dc8d
Create Date: 2024-03-08 22:30:11.557829+11:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '0ba51bb05177'
down_revision = '29a07ed0dc8d'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('feeds',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('title', sa.String(), nullable=False),
    sa.Column('feed_url', sa.String(), nullable=False),
    sa.Column('is_scrape', sa.Boolean(), nullable=False),
    sa.Column('token_n', sa.Integer(), nullable=False),
    sa.Column('followers_counter', sa.Integer(), nullable=False),
    sa.Column('embedding', pgvector.sqlalchemy.Vector(dim=512), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('feed_url')
    )
    op.create_index(op.f('ix_feeds_id'), 'feeds', ['id'], unique=False)
    op.create_index(op.f('ix_feeds_title'), 'feeds', ['title'], unique=False)
    op.create_table('user',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('username', sa.String(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('first_name', sa.String(), nullable=False),
    sa.Column('last_name', sa.String(), nullable=False),
    sa.Column('hashed_password', sa.String(), nullable=False),
    sa.Column('is_superuser', sa.Boolean(), nullable=False),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_email'), 'user', ['email'], unique=True)
    op.create_index(op.f('ix_user_id'), 'user', ['id'], unique=False)
    op.create_index(op.f('ix_user_username'), 'user', ['username'], unique=True)
    op.create_table('user_feed',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('feed_id', sa.Integer(), nullable=False),
    sa.Column('date_added', sa.DateTime(), nullable=True),
    sa.ForeignKeyConstraint(['feed_id'], ['feeds.id'], ),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], ),
    sa.PrimaryKeyConstraint('user_id', 'feed_id')
    )
    op.create_index(op.f('ix_user_feed_date_added'), 'user_feed', ['date_added'], unique=False)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_index(op.f('ix_user_feed_date_added'), table_name='user_feed')
    op.drop_table('user_feed')
    op.drop_index(op.f('ix_user_username'), table_name='user')
    op.drop_index(op.f('ix_user_id'), table_name='user')
    op.drop_index(op.f('ix_user_email'), table_name='user')
    op.drop_table('user')
    op.drop_index(op.f('ix_feeds_title'), table_name='feeds')
    op.drop_index(op.f('ix_feeds_id'), table_name='feeds')
    op.drop_table('feeds')
    # ### end Alembic commands ###
