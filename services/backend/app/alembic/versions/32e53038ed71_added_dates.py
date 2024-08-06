"""added dates

Revision ID: 32e53038ed71
Revises: e1cf3a02b4d0
Create Date: 2024-03-13 13:04:27.347058+11:00

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '32e53038ed71'
down_revision = 'e1cf3a02b4d0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('feed_preferences', postgresql.JSON(astext_type=sa.Text()), nullable=True))
    op.add_column('user', sa.Column('preferences_updated_at', sa.DateTime(), nullable=True))
    op.add_column('user', sa.Column('last_login', sa.DateTime(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('user', 'last_login')
    op.drop_column('user', 'preferences_updated_at')
    op.drop_column('user', 'feed_preferences')
    # ### end Alembic commands ###