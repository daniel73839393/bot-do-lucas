import {
  Client,
  GatewayIntentBits,
  Events,
  type ChatInputCommandInteraction,
} from "discord.js";
import { handleImagine } from "./commands/imagine.js";
import { handleImagineGemini } from "./commands/imagine-gemini.js";
import { handleImagineGrok } from "./commands/imagine-grok.js";
import { handleSearch } from "./commands/search.js";
import { handleEmbed } from "./commands/embed.js";
import { handleEmbedAi } from "./commands/embed-ai.js";

const token = process.env.DISCORD_BOT_TOKEN;
if (!token) {
  console.error("DISCORD_BOT_TOKEN não definido nas Secrets.");
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (c) => {
  console.log(`Bot online como ${c.user.tag}`);
});

const handlers: Record<
  string,
  (i: ChatInputCommandInteraction) => Promise<void>
> = {
  imagine: handleImagine,
  "imagine-gemini": handleImagineGemini,
  "imagine-grok": handleImagineGrok,
  search: handleSearch,
  embed: handleEmbed,
  embedai: handleEmbedAi,
};

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const handler = handlers[interaction.commandName];
  if (!handler) return;

  try {
    await handler(interaction);
  } catch (err) {
    console.error(`Erro no comando /${interaction.commandName}:`, err);
    const msg =
      err instanceof Error ? err.message : "Erro desconhecido ao executar.";
    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(`Erro: ${msg}`).catch(() => {});
    } else {
      await interaction
        .reply({ content: `Erro: ${msg}`, ephemeral: true })
        .catch(() => {});
    }
  }
});

client.login(token);
