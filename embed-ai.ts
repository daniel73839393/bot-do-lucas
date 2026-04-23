import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";
import { openai } from "../clients.js";

interface AiEmbed {
  title: string;
  description: string;
  hex: string;
  image?: string | null;
  thumbnail?: string | null;
  footer?: string | null;
}

export async function handleEmbedAi(i: ChatInputCommandInteraction) {
  const topic = i.options.getString("tema", true);
  await i.deferReply();

  const completion = await openai.chat.completions.create({
    model: "gpt-5.4",
    max_completion_tokens: 1500,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content:
          "Você gera embeds para Discord. Responda SOMENTE JSON com este formato: " +
          `{"title": string (max 240 chars), "description": string (max 3500 chars, em português, informativo e bem formatado), "hex": string (cor hex de 6 chars sem #, escolhida pelo tema), "image": string|null (URL pública .png/.jpg de imagem ilustrativa do tema, ou null), "thumbnail": string|null (URL pública de ícone/logo relacionado, ou null), "footer": string|null (frase curta de rodapé)}.` +
          " Não inclua texto fora do JSON. Não invente URLs que não existem — se não tiver certeza, use null.",
      },
      { role: "user", content: `Tema do embed: ${topic}` },
    ],
  });

  const raw = completion.choices[0]?.message?.content?.trim() ?? "{}";
  let data: AiEmbed;
  try {
    data = JSON.parse(raw) as AiEmbed;
  } catch {
    throw new Error("IA retornou JSON inválido.");
  }

  const hex = /^[0-9a-fA-F]{6}$/.test(data.hex ?? "")
    ? parseInt(data.hex, 16)
    : 0x5865f2;

  const embed = new EmbedBuilder()
    .setTitle((data.title || topic).slice(0, 256))
    .setDescription((data.description || " ").slice(0, 4000))
    .setColor(hex)
    .setTimestamp();

  if (data.image && /^https?:\/\//.test(data.image)) embed.setImage(data.image);
  if (data.thumbnail && /^https?:\/\//.test(data.thumbnail))
    embed.setThumbnail(data.thumbnail);
  embed.setFooter({
    text: (data.footer ?? "Gerado por IA").slice(0, 2048),
  });

  await i.editReply({ embeds: [embed] });
}
