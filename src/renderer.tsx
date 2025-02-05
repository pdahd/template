import { jsxRenderer } from "hono/jsx-renderer";
import "./style.css";

export const renderer = jsxRenderer(({ children, title }) => {
  // 处理 "</think>" 逻辑的函数
  const formatModelResponse = (response: any) => {
    // 确保 response 是字符串
    const responseText = typeof response === "string" ? response : String(response);
    const thinkTag = "</think>";
    const thinkIndex = responseText.indexOf(thinkTag);

    if (thinkIndex !== -1) {
      // 拆分文本
      const reasoningPart = responseText.substring(0, thinkIndex);
      const finalResponse = responseText.substring(thinkIndex + thinkTag.length);

      // 返回带有样式的 JSX 结构
      return (
        <>
          <span
            style={{
              backgroundColor: "#FFF9C4", // 思考部分的淡黄色背景
              padding: "4px",
              borderRadius: "4px",
              display: "inline-block",
            }}
          >
            {reasoningPart}
          </span>
          {finalResponse}
        </>
      );
    }

    return responseText; // 如果没有 "</think>"，返回原始文本
  };

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || "Vanilla Chat App"}</title>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.2/markdown-it.min.js"
          integrity="sha512-ohlWmsCxOu0bph1om5eDL0jm/83eH09fvqLDhiEdiqfDeJbEvz4FSbeY0gLJSVJwQAp0laRhTXbUQG+ZUuifUQ=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        ></script>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css"
          integrity="sha512-0aPQyyeZrWj9sCA46UlmWgKOP0mUipLQ6OZXu8l4IcAmD2u31EPEy9VcIMvl7SoAaKe8bLXZhYoMaE/in+gcgA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
        {import.meta.env.PROD ? (
          <link href="/static/style.css" rel="stylesheet" />
        ) : (
          <link href="/src/style.css" rel="stylesheet" />
        )}
      </head>
      <body className="font-sans">
        {/* 在这里使用 formatModelResponse 处理内容 */}
        {formatModelResponse(children)}
      </body>
    </html>
  );
});
