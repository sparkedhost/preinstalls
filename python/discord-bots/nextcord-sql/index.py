import nextcord
from nextcord.ext import commands
from asyncmy import connect

import os
from dotenv import load_dotenv


TESTING_GUILD_ID = 1234567890  # change to example

description = """An example bot sparkedhost preinstalls

Author:
    Github [Jpuf0]
    Discord Jpuf#0001
"""

bot = commands.Bot(description=description)


@bot.event
async def on_ready():
    global con
    con = await connect(
        host="mariadb.sparkedhost.com",
        port=20012,
        user="nextcord",
        password="nextcordpass",
        database="nextcord",
    )
    cur = con.cursor()
    await cur.execute(
        """
    CREATE TABLE IF NOT EXISTS example_table(
        id SERIAL PRIMARY KEY,
        value TEXT
    )
    """
    )
    print(f"Logged in as {bot.user}")


@bot.slash_command(description="get the count", guild_ids=[TESTING_GUILD_ID])
async def get_data(interaction: nextcord.Interaction):
    cur = con.cursor()
    await cur.execute(
        """
    SELECT count(*) FROM example_table
    """
    )
    ret = await cur.fetchone()
    await interaction.send(f"The data stored in the database is: {ret[0]}")


@bot.slash_command(description="increment the count by 1", guild_ids=[TESTING_GUILD_ID])
async def inc_data(interaction: nextcord.Interaction):
    cur = con.cursor()
    await cur.execute(
        """
    INSERT INTO example_table (value) VALUES (1)
    """
    )
    await con.commit()
    await interaction.send("Set Value!")


load_dotenv()
bot.run(os.getenv("BOT_TOKEN"))
