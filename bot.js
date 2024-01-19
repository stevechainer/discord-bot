import * as Discord from "discord.js";

const client = new Discord.Client({
  intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.DirectMessages,
  ],
  partials: [
    Discord.Partials.Channel,
    Discord.Partials.Message,
    Discord.Partials.User,
  ],
});

const token =
  "MTE5NzUzMTMxMjk1Mzc1NzcxNw.Gxl2-4.6BiyMCJh8V29aJjx-iSihi7alniQyPfOh1JH3Q";
const clientId = "1197531312953757717";
// Construct and prepare an instance of the REST module
const rest = new Discord.REST().setToken(token);

const command = {
  data: new Discord.SlashCommandBuilder()
    .setName("ping")
    .setDescription("Replies with Pong!"),
  async execute(interaction) {
    await interaction.reply("Pong!");
  },
};

const commands = [];

commands.push(command.data.toJSON());

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Discord.Routes.applicationCommands(clientId), {
      body: commands,
    });

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();

client.once(Discord.Events.ClientReady, function () {
  console.log("Ready!");
});

client.on(Discord.Events.MessageCreate, (msg) => {
  if (msg.content === "ping") {
    msg.reply("Pong!");
  }
});

client.on(Discord.Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  console.log(interaction.commandName);
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

client.login(token);
