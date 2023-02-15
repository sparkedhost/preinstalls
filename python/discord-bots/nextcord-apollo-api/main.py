# This example requires the 'message_content' privileged intents
from pydactyl import PterodactylClient

import os
from dotenv import load_dotenv

load_dotenv()

# Check that the bot has been configured
if (
    os.getenv("BOT_TOKEN") == "TOKENGOESHERE"
    or os.getenv("PANEL_KEY") == "ptlc_LSEiZPfRJvw3oMzbmC4XEp8gt3nw4ngi5Mdb9P8VXr7"
):
    print("Please configure this bot via the .env file in the File Manager.")
    exit()

import nextcord
from nextcord.ext import commands, application_checks

bot = commands.Bot()
api = PterodactylClient(os.getenv("PANEL_URL"), os.getenv("PANEL_KEY"))


@bot.event
async def on_ready():
    print(f"Logged in as {bot.user} (ID: {bot.user.id})")
    account = api.client.account.get_account()
    print(
        f"Connected to Apollo as {account['attributes']['first_name']} {account['attributes']['last_name']} (Username: {account['attributes']['username']})"
    )


@bot.slash_command(description="Returns all servers on the panel.")
@application_checks.has_role(int(os.getenv("AUTHORIZED_ROLE")))
async def servers(interaction):
    my_servers = api.client.servers.list_servers()
    server_list = ""
    for servers in my_servers:
        for server in servers:
            server_list += f"[{server['attributes']['name']}]({os.getenv('PANEL_URL')}/server/{server['attributes']['identifier']}) (`{server['attributes']['identifier']}`)\n"
    embed = nextcord.Embed(
        title="Apollo Servers",
        description=f"Here are your servers hosted on Apollo Panel:\n\n{server_list or '**Unable to find any servers associated with this account.**'}",
        color=0xFFEA00,
    )
    await interaction.response.send_message(embed=embed)


@bot.slash_command(description="Send a power action to a server.")
@application_checks.has_role(int(os.getenv("AUTHORIZED_ROLE")))
async def power(
    interaction,
    server_id: str = nextcord.SlashOption(description="Server ID"),
    power_action: str = nextcord.SlashOption(
        description="Select a power action",
        choices={
            "Start": "start",
            "Restart": "restart",
            "Stop": "stop",
            "Kill": "kill",
        },
    ),
):
    api.client.servers.send_power_action(server_id, power_action)

    embed = nextcord.Embed(
        title="Success",
        description=f":white_check_mark: Successfully sent power action `{power_action}` to server `{server_id}`.",
        color=0x00FF04,
    )
    await interaction.response.send_message(embed=embed)


@bot.slash_command(description="Send a console command to a server.")
@application_checks.has_role(int(os.getenv("AUTHORIZED_ROLE")))
async def command(
    interaction,
    server_id: str = nextcord.SlashOption(description="Server ID"),
    command: str = nextcord.SlashOption(
        description="Command to send to the server's console"
    ),
):
    api.client.servers.send_console_command(server_id, command)

    embed = nextcord.Embed(
        title="Success",
        description=f":white_check_mark: Successfully sent command `{command}` to server `{server_id}`.",
        color=0x00FF04,
    )
    await interaction.response.send_message(embed=embed)


@bot.event
async def on_application_command_error(interaction, error):
    if isinstance(error, nextcord.ApplicationCheckFailure):
        await interaction.response.send_message(
            ":warning: You are not authorized to use this command!"
        )
    else:
        await interaction.response.send_message(
            f":x: An error occurred while processing this command. \n```py\n{error}\n```"
        )


bot.run(os.getenv("BOT_TOKEN"))
