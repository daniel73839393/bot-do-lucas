import { REST, Routes, SlashCommandBuilder } from "discord.js";

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

if (!token || !clientId) {
  console.error(
    "Faltam DISCORD_BOT_TOKEN e/ou DISCORD_CLIENT_ID nas Secrets."
  );
  process.exit(1);
}

const commands = [
  new SlashCommandBuilder()
    .setName("imagine")
    .setDescription("Gera imagem com OpenAI (gpt-image-1)")
    .addStringOption((o) =>
      o
        .setName("prompt")
        .setDescription("Descrição da imagem")
        .setRequired(true)
    )
    .addStringOption((o) =>
      o
        .setName("size")
        .setDescription("Tamanho")
        .addChoices(
          { name: "1024x1024 (quadrado)", value: "1024x1024" },
          { name: "1536x1024 (paisagem)", value: "1536x1024" },
          { name: "1024x1536 (retrato)", value: "1024x1536" }
        )
    ),

  new SlashCommandBuilder()
    .setName("imagine-gemini")
    .setDescription("Gera imagem com Gemini (nano banana)")
    .addStringOption((o) =>
      o
        .setName("prompt")
        .setDescription("Descrição da imagem")
        .setRequired(true)
    )
    .addBooleanOption((o) =>
      o
        .setName("hq")
        .setDescription("Usar modelo HQ (nano banana pro, mais lento)")
    ),

  new SlashCommandBuilder()
    .setName("imagine-grok")
    .setDescription("Gera imagem com Grok (requer GROK_API_KEY)")
    .addStringOption((o) =>
      o
        .setName("prompt")
        .setDescription("Descrição da imagem")
        .setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("search")
    .setDescription("Pesquisa usando GPT (OpenAI) e responde em embed")
    .addStringOption((o) =>
      o.setName("query").setDescription("O que você quer saber").setRequired(true)
    ),

  new SlashCommandBuilder()
    .setName("embed")
    .setDescription("Cria embed personalizado manualmente")
    .addStringOption((o) =>
      o.setName("titulo").setDescription("Título do embed").setRequired(true)
    )
    .addStringOption((o) =>
      o
        .setName("descricao")
        .setDescription("Descrição (suporta markdown)")
        .setRequired(true)
    )
    .addStringOption((o) =>
      o.setName("cor").setDescription("Cor hex, ex: #5865F2 ou 5865F2")
    )
    .addStringOption((o) =>
      o.setName("imagem").setDescription("URL de imagem grande")
    )
    .addStringOption((o) =>
      o.setName("thumbnail").setDescription("URL da thumbnail (canto superior)")
    )
    .addStringOption((o) =>
      o.setName("rodape").setDescription("Texto do rodapé")
    )
    .addStringOption((o) =>
      o.setName("url").setDescription("URL clicável no título")
    ),

  new SlashCommandBuilder()
    .setName("embedai")
    .setDescription("IA gera embed completo (cor, imagens, título, descrição)")
    .addStringOption((o) =>
      o
        .setName("tema")
        .setDescription("Tema/assunto do embed")
        .setRequired(true)
    ),
].map((c) => c.toJSON());

const rest = new REST({ version: "10" }).setToken(token);

console.log(`Registrando ${commands.length} comandos globais...`);
const data = (await rest.put(Routes.applicationCommands(clientId), {
  body: commands,
})) as unknown[];
console.log(`OK — ${data.length} comandos registrados.`);
console.log(
  "Aviso: comandos globais podem demorar até 1h para aparecer em todos os servidores. Para testar rápido, adicione GUILD_ID e use registro por servidor."
);
