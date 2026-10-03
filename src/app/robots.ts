import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/login"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "Google-Extended",
          "ClaudeBot",
          "Claude-User",
          "Claude-SearchBot",
          "PerplexityBot",
          "Perplexity-User",
          "Amazonbot",
          "Applebot-Extended",
          "Bytespider",
          "CCBot",
          "DeepSeekBot",
          "Meta-ExternalAgent",
        ],
        disallow: "/",
      },
    ],
  };
}
