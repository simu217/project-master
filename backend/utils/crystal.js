const axios = require("axios");
const cheerio = require("cheerio");

const preview = async (crystal, userId) => {
  const { url } = crystal;
  if (!url) return res.status(400).json({ message: "URL required" });

  try {
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/119.0.0.0 Safari/537.36",
      },
      timeout: 8000,
    });

    const $ = cheerio.load(response.data);

    const getMeta = (name) =>
      $(`meta[property='og:${name}']`).attr("content") ||
      $(`meta[name='${name}']`).attr("content");

    const preview = {
      title: getMeta("title") || $("title").text() || "No title",
      description: getMeta("description") || "No description available",
      image: getMeta("image"),
      url: url,
    };

    return { ...crystal, addedBy: userId, meta: preview };
  } catch (err) {
    return {
      ...crystal,
      addedBy: userId,
      meta: {
        title: "Unknown",
        description: "Unknown",
        url: url,
      },
    };
  }
};

module.exports = { preview };
