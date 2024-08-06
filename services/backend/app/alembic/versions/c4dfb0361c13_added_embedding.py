"""added embedding

Revision ID: c4dfb0361c13
Revises: a38855a97e57
Create Date: 2024-03-13 04:50:43.846620+11:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c4dfb0361c13'
down_revision = 'a38855a97e57'
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