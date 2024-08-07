"""added embedding

Revision ID: 3cd09210f663
Revises: c4dfb0361c13
Create Date: 2024-03-13 04:52:30.570123+11:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '3cd09210f663'
down_revision = 'c4dfb0361c13'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('feeds', sa.Column('embedding', sa.String(), nullable=False))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('feeds', 'embedding')
    # ### end Alembic commands ###
