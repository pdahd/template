import { jsxRenderer } from "hono/jsx-renderer";
import "./style.css";

export const renderer = jsxRenderer(({ children, title }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{title || "Vanilla Chat App"}</title>
        <script
          src="https://cdnjs.cloudflare.com/ajax/libs/markdown-it/13.0.2/markdown-it.min.js"
          integrity="sha512-ohlWmsCxOu0bph1om5eDL0jm/83eH09fvqLDhiEdiqfDeJbEvz4FSbeY0gLJSVJwQAp0laRhTXbUQG+ZUuifUQ=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        ></script>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css"
          integrity="sha512-0aPQyyeZrWj9sCA46UlmWgKOP0mUipLQ6OZXu8l4IcAmD2u31EPEy9VcIMvl7SoAaKe8bLXZhYoMaE/in+gcgA=="
          crossorigin="anonymous"
          referrerpolicy="no-referrer"
        />
        <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"></script>
        {import.meta.env.PROD ? (
          <link href="/static/style.css" rel="stylesheet" />
        ) : (
          <link href="/src/style.css" rel="stylesheet" />
        )}

        {/* 全局样式覆盖 */}
        <style>
          {`
            /* 代码块内容区背景设置为旧纸张风格 */
            pre {
              background: linear-gradient(180deg, #FAF3D5, #EED9C4) !important; /* 渐变背景 */
              color: #5A4634 !important; /* 深棕色文字，适合旧纸风格 */
              padding: 12px !important; /* 内边距 */
              border-radius: 8px !important; /* 圆角 */
              box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.15) !important; /* 轻微阴影 */
            }

            /* 防止高亮样式被覆盖 */
            code {
              background: transparent !important; /* 保持背景透明 */
            }

            /* 可选：调整代码块中某些语言元素的默认字体颜色 */
            .hljs-keyword,
            .hljs-title,
            .hljs-built_in {
              color: #D2691E !important; /* 加深关键字的可见度 */
            }
          `}
        </style>
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
});
