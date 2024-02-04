import * as Discord from "discord.js";
import { Routes } from "discord-api-types/v9";
import moment from "moment-timezone";

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
  "MTE5NzUzMTMxMjk1Mzc1NzcxNw.Gv6k0n.8p2e5W8GP8pZ6tyTDiB7y1vUVp7RMrMzupzlwU";
const clientId = "1197531312953757717";
// Construct and prepare an instance of the REST module
const rest = new Discord.REST().setToken(token);

const commands = [];

// const commands = [
//   {
//     name: "time",
//     description: "Gets the current time for a specified location",
//     options: [
//       {
//         type: "STRING",
//         name: "location",
//         description: "The location to get the time for",
//         required: true,
//         choices: [
//           { name: "London", value: "Europe/London" },
//           { name: "Auckland", value: "Pacific/Auckland" },
//         ],
//       },
//     ],
//   },
// ];

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${commands.length} application (/) commands.`
    );

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(Routes.applicationCommands(clientId), {
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
  } else if (msg.content.startsWith("@") && msg.content.endsWith("@")) {
    //Connect Time Zone
    const apiKey = "86bdb3ac0c01880cf8d0bd05045def65";
    const city = msg.content.replaceAll("@", "");

    console.log(city);
    const weatherApiUrl =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=06cde0ead7f0b9fa6f803170905d3423&units=Metric";
    console.log(weatherApiUrl);

    fetch(weatherApiUrl)
      .then((response) => response.json())
      .then((data) => {
        console.log("Weather Data:", data);
        var temp = data.main.temp.toString();
        var wind = data.wind.speed.toString();
        var wind_dir = data.wind.deg.toString();
        var humidity = data.main.humidity.toString();
        var timezone = data.timezone.toString();

        var result =
          "🕓🕓🕓Timezone🕓🕓🕓" +
          "\n" +
          timezone +
          "\n\n" +
          "⛅🌦️🌤️Weather⛅🌦️🌤️" +
          "\n" +
          "Temperature: " +
          temp +
          "(°)\n" +
          "Wind: " +
          wind +
          "(m/s)\n" +
          "Direction Of Wind: " +
          wind_dir +
          "\n" +
          "Humidity: " +
          humidity +
          "(%)\n";

        msg.reply(result);
      })
      .catch((error) => {
        msg.reply("There maybe a mistake with city name.");
        console.error("Error fetching weather data:", error);
      });
  }
});

client.on(Discord.Events.InviteCreate, async (invite) => {
  console.log(`An invite was created: ${invite.url}`);
  console.log(`Invite was created in: ${invite.guild.name}`);
  console.log(`Invite was created by: ${invite.inviter.tag}`);
  // You can add more logic here to handle the invite, like logging it to a database or sending a notification
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
