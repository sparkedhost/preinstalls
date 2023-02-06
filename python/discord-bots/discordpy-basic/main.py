# This example requires the 'members' privileged intents
import random

import os
from dotenv import load_dotenv

import discord
from discord.ext import commands

description = """An example bot coded in Python 3.x and discord.py."""

intents = discord.Intents.default()
intents.members = True
intents.message_content = True

bot = commands.Bot(command_prefix="?", description=description, intents=intents)


@bot.event
async def on_ready():
    print(f"Logged in as {bot.user} (ID: {bot.user.id})")


@bot.command()
async def hello(ctx):
    """Hello there, human!"""
    await ctx.reply(f"Hello there, {ctx.author.name}!")


@bot.command()
async def add(ctx, left: int, right: int):
    """Adds two numbers together."""
    await ctx.reply(left + right)


@bot.command(description="For when you wanna settle the score some other way")
async def choose(ctx, *choices: str):
    """Chooses between multiple choices."""
    await ctx.reply(random.choice(choices))


load_dotenv()
bot.run(os.getenv("BOT_TOKEN"))
