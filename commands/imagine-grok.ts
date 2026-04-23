import { AttachmentBuilder, type ChatInputCommandInteraction } from "discord.js";
import { grok } from "../clients.js";

export async function handleImagineGrok(i: ChatInputCommandInteraction) {
  if (!grok) {
    await i.reply({
      content:
        "Grok não está configurado. Adicione a secret `GROK_API_KEY` (de https://console.x.ai) para habilitar.",
      ephemeral: true,
    });
    return;
  }

  const prompt = i.options.getString("prompt", true);
  await i.deferReply();

  const result = await grok.images.generate({
    model: "grok-2-image",
    prompt,
    response_format: "b64_json",
  });

  const b64 = result.data?.[0]?.b64_json;
  if (!b64) throw new Error("Grok não retornou imagem.");

  const buf = Buffer.from(b64, "base64");
  const file = new AttachmentBuilder(buf, { name: "grok.png" });

  await i.editReply({
    content: `**Grok grok-2-image** — \`${prompt}\``,
    files: [file],
  });
}
