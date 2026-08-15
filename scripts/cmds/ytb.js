axios = require("axios");
const fs = require("fs");

async function downloadFile(url, fileName) {
  const response = await axios({
    url,
    method: "GET",
    responseType: "arraybuffer",
    timeout: 120000
  });
  fs.writeFileSync(fileName, Buffer.from(response.data));
  return fs.createReadStream(fileName);
}

async function getThumbnailStream(url) {
  const response = await axios.get(url, {
    responseType: "stream",
    timeout: 15000
  });
  return response.data;
}

module.exports = {
  config: {
    name: "ytb",
    version: "3.2",
    author: "Arafat",
    role: 0,
    description: { en: "🎬 YTB Audio/Video Downloader" },
    category: "media"
  },

  onStart: async ({ api, args, event, commandName }) => {

    if (!args.length)
      return api.sendMessage(
        "Usage:\n#ytb -v name\n#ytb -a name\n#ytb -v -l name\n#ytb -a -l name",
        event.threadID,
        event.messageID
      );

    const isVideo = args.includes("-v");
    const isAudio = args.includes("-a");
    const isList = args.includes("-l");

    if (!isVideo && !isAudio)
      return api.sendMessage("❌ Use -v (video) or -a (audio)", event.threadID, event.messageID);

    const keyword = args.filter(a => !a.startsWith("-")).join(" ");
    if (!keyword)
      return api.sendMessage("Please type a name.", event.threadID, event.messageID);

    try {

      const apiJson = await axios.get(
        "https://raw.githubusercontent.com/Arafat-Core/cmds/refs/heads/main/api.json"
      );

      const DOWNLOAD_BASE = apiJson.data.download;

      const searchRes = await axios.get(
        `https://yt-search-ochre.vercel.app/api/search?q=${encodeURIComponent(keyword)}&limit=6`
      );

      if (!searchRes.data.success || !searchRes.data.results.length)
        return api.sendMessage("❌ No results found.", event.threadID, event.messageID);

      const results = searchRes.data.results.slice(0, 6).map(v => ({
        id: v.videoId,
        title: v.title,
        url: v.url,
        timestamp: v.duration,
        author: { name: v.author },
        thumbnail: v.thumbnail
      }));

      if (isList) {

        let text = "╭───────────────❍\n";
        text += isVideo ? "│   🎬 𝑽𝒊𝒅𝒆𝒐 𝑳𝒊𝒔𝒕\n" : "│   🎵 𝑨𝒖𝒅𝒊𝒐 𝑳𝒊𝒔𝒕\n";
        text += "╰───────────────❍\n\n";

        for (let i = 0; i < results.length; i++) {
          const v = results[i];
          text += `╭─❍\n`;
          text += `┊  ${i + 1}. ${v.title}\n`;
          text += `┊  ⏳ ${v.timestamp}\n`;
          text += `┊  📺 ${v.author.name}\n`;
          text += `╰───────────────❍\n\n`;
        }

        text += "╭───────────────❍\n";
        text += "│   🔢 Reply with number (1–6)\n";
        text += "╰───────────────❍";

        const thumbs = await Promise.all(
          results.map(v => getThumbnailStream(v.thumbnail))
        );

        return api.sendMessage(
          { body: text, attachment: thumbs },
          event.threadID,
          (err, info) => {
            global.GoatBot.onReply.set(info.messageID, {
              commandName,
              messageID: info.messageID,
              author: event.senderID,
              results,
              isVideo,
              DOWNLOAD_BASE
            });
          },
          event.messageID
        );
      }

      const video = results[0];
      const shortUrl = `https://youtu.be/${video.id}`;

      const Arafaturl = isVideo
        ? `${DOWNLOAD_BASE}/arafatdl?url=${encodeURIComponent(shortUrl)}`
        : `${DOWNLOAD_BASE}/arafatadl?url=${encodeURIComponent(shortUrl)}`;

      const fileName = isVideo ? "video.mp4" : "audio.mp3";

      api.setMessageReaction("🌷", event.messageID, () => {}, true);

      await downloadFile(Arafaturl, fileName);

      api.sendMessage(
        {
          body:
`╭───────────────❍
│ ${isVideo ? "🎬" : "🎧"} 𝑫𝒐𝒘𝒏𝒍𝒐𝒂𝒅 𝑺𝒖𝒄𝒄𝒆𝒔𝒔
├───────────────❍
│ ${isVideo ? "🎥" : "🎵"} ${video.title}
╰───────────────❍`,
          attachment: fs.createReadStream(fileName)
        },
        event.threadID,
        () => {
          fs.unlinkSync(fileName);
          api.setMessageReaction("🎀", event.messageID, () => {}, true);
        },
        event.messageID
      );

    } catch (err) {
      console.log("YTB ERROR:", err.message);
      api.sendMessage("❌ Failed to fetch media.", event.threadID, event.messageID);
    }
  },

  onReply: async ({ event, api, Reply }) => {
    try {
      const { results, author, isVideo, DOWNLOAD_BASE } = Reply;
      if (event.senderID !== author) return;

      const choice = parseInt(event.body);
      if (isNaN(choice) || choice < 1 || choice > results.length)
        return api.sendMessage("❌ Enter valid number (1–6).", event.threadID, event.messageID);

      const video = results[choice - 1];
      const shortUrl = `https://youtu.be/${video.id}`;

      const Arafaturl = isVideo
        ? `${DOWNLOAD_BASE}/arafatdl?url=${encodeURIComponent(shortUrl)}`
        : `${DOWNLOAD_BASE}/arafatadl?url=${encodeURIC
