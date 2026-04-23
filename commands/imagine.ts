import { AttachmentBuilder, type ChatInputCommandInteraction } from "discord.js";
import { openai } from "../clients.js";

export async function handleImagine(i: ChatInputCommandInteraction) {
  const prompt = i.options.getString("prompt", true);
  const size =
    (i.options.getString("size") as
      | "1024x1024"
      | "1536x1024"
      | "1024x1536"
      | null) ?? "1024x1024";

  await i.deferReply();

  const result = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size,
  });

  const b64 = result.data?.[0]?.b64_json;
  if (!b64) throw new Error("Sem imagem na resposta do OpenAI.");

  const buf = Buffer.from(b64, "base64");
  const file = new AttachmentBuilder(buf, { name: "openai.png" });

  await i.editReply({
    content: `**OpenAI gpt-image-1** — \`${prompt}\``,
    files: [file],
  });
}
