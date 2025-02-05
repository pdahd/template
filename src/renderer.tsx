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
              background: linear-gradient(180deg, #ECF8F8, #F1FAEE) !important; /* 渐变背景 */
            }

            /* 保持代码内背景透明，避免被覆盖 */
            code {
              background: transparent !important;
            }

            /* 高亮显示的关键字颜色调整 */
            .hljs-keyword {
              color: #E63946 !important; /* 红色关键字 */
            }

            .hljs-string {
              color: #1C39BB !important; /* 紫色 */
            }

            /* 可选：标题和内置函数等高亮颜色 */
            .hljs-literal {
              color: #FF00CC !important;
            }
            
            .hljs-built_in {
              color: #008B8B !important; /* 绿色 */
            }
          `}
        </style>
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
});
