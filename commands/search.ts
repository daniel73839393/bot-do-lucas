import { EmbedBuilder, type ChatInputCommandInteraction } from "discord.js";
import { openai } from "../clients.js";

export async function handleSearch(i: ChatInputCommandInteraction) {
  const query = i.options.getString("query", true);
  await i.deferReply();

  const completion = await openai.chat.completions.create({
    model: "gpt-5.4",
    max_completion_tokens: 1500,
    messages: [
      {
        role: "system",
        content:
          "Você é um assistente de pesquisa. Responda de forma clara, factual e organizada em português. Quando relevante, use marcadores. Seja objetivo.",
      },
      { role: "user", content: query },
    ],
  });

  const answer =
    completion.choices[0]?.message?.content?.trim() ?? "Sem resposta.";

  const trimmed = answer.length > 4000 ? answer.slice(0, 3997) + "..." : answer;

  const embed = new EmbedBuilder()
    .setColor(0x5865f2)
    .setTitle("Resultado da pesquisa")
    .setDescription(trimmed)
    .addFields({ name: "Pergunta", value: query.slice(0, 1024) })
    .setFooter({ text: "GPT-5.4 via Replit AI Integrations" })
    .setTimestamp();

  await i.editReply({ embeds: [embed] });
}
