import { AttachmentBuilder, type ChatInputCommandInteraction } from "discord.js";
import { gemini } from "../clients.js";

export async function handleImagineGemini(i: ChatInputCommandInteraction) {
  const prompt = i.options.getString("prompt", true);
  const hq = i.options.getBoolean("hq") ?? false;

  await i.deferReply();

  const model = hq ? "gemini-3-pro-image-preview" : "gemini-2.5-flash-image";

  const response = await gemini.models.generateContent({
    model,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  });

  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const imgPart = parts.find((p) => p.inlineData?.data);
  const b64 = imgPart?.inlineData?.data;

  if (!b64) throw new Error("Gemini não retornou imagem.");

  const buf = Buffer.from(b64, "base64");
  const file = new AttachmentBuilder(buf, { name: "gemini.png" });

  await i.editReply({
    content: `**Gemini ${model}** — \`${prompt}\``,
    files: [file],
  });
}
