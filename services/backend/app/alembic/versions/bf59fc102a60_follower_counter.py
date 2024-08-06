"""follower counter

Revision ID: bf59fc102a60
Revises: 32e53038ed71
Create Date: 2024-04-15 00:36:21.911382+10:00

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'bf59fc102a60'
down_revision = '32e53038ed71'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('user', sa.Column('age', sa.Integer(), nullable=True))
    op.add_column('user', sa.Column('country', sa.String(), nullable=True))
    op.add_column('user', sa.Column('occupation', sa.String(), nullable=True))
    op.alter_column('user', 'first_name',
               existing_type=sa.VARCHAR(),
               nullable=True)
    op.alter_column('user', 'last_name',
               existing_type=sa.VARCHAR(),
               nullable=True)
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.alter_column('user', 'last_name',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.alter_column('user', 'first_name',
               existing_type=sa.VARCHAR(),
               nullable=False)
    op.drop_column('user', 'occupation')
    op.drop_column('user', 'country')
    op.drop_column('user', 'age')
    # ### end Alembic commands ###