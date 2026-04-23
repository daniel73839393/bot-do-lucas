import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";

function parseHex(input: string | null): number | null {
  if (!input) return null;
  const s = input.trim().replace(/^#/, "");
  if (!/^[0-9a-fA-F]{6}$/.test(s)) return null;
  return parseInt(s, 16);
}

export async function handleEmbed(i: ChatInputCommandInteraction) {
  const title = i.options.getString("titulo", true);
  const description = i.options.getString("descricao", true);
  const hex = parseHex(i.options.getString("cor"));
  const image = i.options.getString("imagem");
  const thumbnail = i.options.getString("thumbnail");
  const footer = i.options.getString("rodape");
  const url = i.options.getString("url");

  const embed = new EmbedBuilder()
    .setTitle(title.slice(0, 256))
    .setDescription(description.slice(0, 4000));

  if (hex !== null) embed.setColor(hex);
  if (image) embed.setImage(image);
  if (thumbnail) embed.setThumbnail(thumbnail);
  if (footer) embed.setFooter({ text: footer.slice(0, 2048) });
  if (url) embed.setURL(url);

  await i.reply({ embeds: [embed] });
}
