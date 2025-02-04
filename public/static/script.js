const models = {
  "beta": [
    "@cf/deepseek-ai/deepseek-math-7b-instruct",
    "@cf/defog/sqlcoder-7b-2",
    "@cf/fblgit/una-cybertron-7b-v2-bf16",
    "@cf/google/gemma-2b-it-lora",
    "@cf/google/gemma-7b-it-lora",
    "@cf/meta-llama/llama-2-7b-chat-hf-lora",
    "@cf/microsoft/phi-2",
    "@cf/mistral/mistral-7b-instruct-v0.2-lora",
    "@cf/openchat/openchat-3.5-0106",
    "@cf/qwen/qwen1.5-0.5b-chat",
    "@cf/qwen/qwen1.5-1.8b-chat",
    "@cf/qwen/qwen1.5-14b-chat-awq",
    "@cf/qwen/qwen1.5-7b-chat-awq",
    "@cf/thebloke/discolm-german-7b-v1-awq",
    "@cf/tiiuae/falcon-7b-instruct",
    "@cf/tinyllama/tinyllama-1.1b-chat-v1.0",
    "@hf/google/gemma-7b-it",
    "@hf/mistral/mistral-7b-instruct-v0.2",
    "@hf/nexusflow/starling-lm-7b-beta",
    "@hf/nousresearch/hermes-2-pro-mistral-7b",
    "@hf/thebloke/deepseek-coder-6.7b-base-awq",
    "@hf/thebloke/deepseek-coder-6.7b-instruct-awq",
    "@hf/thebloke/llama-2-13b-chat-awq",
    "@hf/thebloke/llamaguard-7b-awq",
    "@hf/thebloke/mistral-7b-instruct-v0.1-awq",
    "@hf/thebloke/neural-chat-7b-v3-1-awq",
    "@hf/thebloke/openhermes-2.5-mistral-7b-awq",
    "@hf/thebloke/zephyr-7b-beta-awq"
  ],
  "ga": [
    "@cf/meta/llama-2-7b-chat-fp16",
    "@cf/meta/llama-2-7b-chat-int8",
    "@cf/meta/llama-3-8b-instruct",
    "@cf/meta/llama-3-8b-instruct-awq",
    "@cf/meta/llama-3.1-8b-instruct",
    "@cf/meta/llama-3.1-8b-instruct-awq",
    "@cf/meta/llama-3.1-8b-instruct-fp8",
    "@cf/meta/llama-3.2-11b-vision-instruct",
    "@cf/meta/llama-3.2-1b-instruct",
    "@cf/meta/llama-3.2-3b-instruct",
    "@cf/meta/llama-3.3-70b-instruct-fp8-fast",
    "@cf/mistral/mistral-7b-instruct-v0.1",
    "@hf/meta-llama/meta-llama-3-8b-instruct"
  ]
};

const CHAT_MODEL_DEFAULT = "@cf/meta/llama-3.3-70b-instruct-fp8-fast";
const SYSTEM_MESSAGE_DEFAULT = "You are a helpful assistant";

const domReady = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
  } else {
    callback();
  }
};

let md;
domReady(() => {
  md = window.markdownit();
  const modelSelect = document.getElementById("model-select");
  // Set model options
  for (const model of models.ga) {
    const opt = document.createElement("option");
    opt.setAttribute("value", model);
    opt.textContent = model.split("/").at(-1);
    modelSelect.appendChild(opt);
  }
  const optGroup = document.createElement("optgroup");
  optGroup.label = "BETA";
  for (const model of models.beta) {
    const opt = document.createElement("option");
    opt.setAttribute("value", model);
    opt.textContent = model.split("/").at(-1);
    optGroup.appendChild(opt);
  }
  modelSelect.appendChild(optGroup);
  const chatSettings = retrieveChatSettings();
  if (chatSettings.model !== undefined) {
    modelSelect.value = chatSettings.model;
    updateModelDisplay(chatSettings);
  }
  if (chatSettings.systemMessage !== undefined) {
    document.getElementById("system-message").value =
      chatSettings.systemMessage;
  }
  renderPreviousMessages();
});

// Based on the message format of `{role: "user", content: "Hi"}`
function createChatMessageElement(msg) {
  const div = document.createElement("div");
  div.className = `message-${msg.role}`;
  if (msg.role === "assistant") {
    const response = document.createElement("div");
    response.className = "response";
    const html = md.render(msg.content);
    response.innerHTML = html;
    div.appendChild(response);
    highlightCode(div);
    const modelDisplay = document.createElement("p");
    modelDisplay.className = "message-model";
    const settings = retrieveChatSettings();
    modelDisplay.innerText = settings.model;
    div.appendChild(modelDisplay);
  } else {
    const userMessage = document.createElement("p");
    userMessage.innerText = msg.content;
    div.appendChild(userMessage);
  }
  return div;
}

function retrieveChatSettings() {
  const settingsJSON = localStorage.getItem("chatSettings");
  if (!settingsJSON) {
    return {
      model: CHAT_MODEL_DEFAULT,
      systemMessage: SYSTEM_MESSAGE_DEFAULT,
    };
  }
  return JSON.parse(settingsJSON);
}

function storeChatSettings(settings) {
  localStorage.setItem("chatSettings", JSON.stringify(settings));
}

function retrieveMessages() {
  const msgJSON = localStorage.getItem("messages");
  if (!msgJSON) {
    return [];
  }
  return JSON.parse(msgJSON);
}

function storeMessages(msgs) {
  localStorage.setItem("messages", JSON.stringify(msgs));
}

function highlightCode(content) {
  const codeEls = [...content.querySelectorAll("pre > code")];
  for (const codeEl of codeEls) {
    hljs.highlightElement(codeEl);

    // 获取代码语言（如果 hljs 识别到了 class 里面的语言）
    const language = codeEl.className.match(/language-(\w+)/);
    const langName = language ? language[1].toUpperCase() : "TEXT";

    // 创建代码块容器
    const preEl = codeEl.parentElement;
    const codeWrapper = document.createElement("div");
    codeWrapper.style.borderRadius = "8px";
    codeWrapper.style.overflow = "hidden";
    codeWrapper.style.border = "1px solid #ddd";
    codeWrapper.style.marginBottom = "16px"; // 让多个代码块之间有间距
    codeWrapper.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.15)"; // 柔和阴影

    // 替换原来的 pre 元素
    preEl.parentNode.replaceChild(codeWrapper, preEl);
    codeWrapper.appendChild(preEl);

    // 创建标题栏
    const titleBar = document.createElement("div");
    titleBar.style.display = "flex";
    titleBar.style.justifyContent = "space-between";
    titleBar.style.alignItems = "center";
    titleBar.style.padding = "6px 12px";
    titleBar.style.fontSize = "14px";
    titleBar.style.fontWeight = "bold";
    titleBar.style.color = "#fff";
    titleBar.style.background = "linear-gradient(90deg, #F4A261, #E76F51)"; // Cloudflare 黄橙渐变

    // 创建语言标识
    const langLabel = document.createElement("span");
    langLabel.innerText = langName;
    langLabel.style.fontFamily = "monospace";
    langLabel.style.textTransform = "uppercase";

    // 创建 SVG 复制图标
    const copyButton = document.createElement("button");
    copyButton.style.background = "transparent";
    copyButton.style.border = "none";
    copyButton.style.cursor = "pointer";
    copyButton.style.padding = "0";
    copyButton.style.display = "flex";
    copyButton.style.alignItems = "center";

    const copyIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    copyIcon.setAttribute("width", "20");
    copyIcon.setAttribute("height", "20");
    copyIcon.setAttribute("viewBox", "0 0 64 64");
    copyIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    copyIcon.setAttribute("fill", "none");
    copyIcon.setAttribute("stroke", "white");
    copyIcon.setAttribute("stroke-width", "3");

    const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    rect.setAttribute("x", "11.13");
    rect.setAttribute("y", "17.72");
    rect.setAttribute("width", "33.92");
    rect.setAttribute("height", "36.85");
    rect.setAttribute("rx", "2.5");

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M19.35,14.23V13.09a3.51,3.51,0,0,1,3.33-3.66H49.54a3.51,3.51,0,0,1,3.33,3.66V42.62a3.51,3.51,0,0,1-3.33,3.66H48.39");

    copyIcon.appendChild(rect);
    copyIcon.appendChild(path);
    copyButton.appendChild(copyIcon);

    // 复制按钮鼠标悬停效果
    copyButton.addEventListener("mouseenter", function () {
      copyIcon.setAttribute("stroke", "#ffdd99"); // 悬停时变亮
    });
    copyButton.addEventListener("mouseleave", function () {
      copyIcon.setAttribute("stroke", "white"); // 恢复默认白色
    });

    // 组装标题栏
    titleBar.appendChild(langLabel);
    titleBar.appendChild(copyButton);
    codeWrapper.insertBefore(titleBar, preEl);

    // 复制功能
    copyButton.addEventListener("click", function () {
      const codeText = codeEl.innerText;
      navigator.clipboard.writeText(codeText).then(() => {
        copyIcon.setAttribute("stroke", "#66ff66"); // 复制成功时变绿色
        setTimeout(() => {
          copyIcon.setAttribute("stroke", "white"); // 1秒后恢复白色
        }, 1000);
      }).catch(err => {
        console.error("无法复制文本: ", err);
        copyIcon.setAttribute("stroke", "red"); // 复制失败时变红
        setTimeout(() => {
          copyIcon.setAttribute("stroke", "white");
        }, 1000);
      })
    });
  }
}

function renderPreviousMessages() {
  console.log("Rendering previous messages");
  const chatHistory = document.getElementById("chat-history");
  const messages = retrieveMessages();
  for (const msg of messages) {
    chatHistory.prepend(createChatMessageElement(msg));
  }
}

async function sendMessage() {
  const config = retrieveChatSettings();
  if (config.model === undefined) {
    applyChatSettingChanges();
  }
  const input = document.getElementById("message-input");
  const chatHistory = document.getElementById("chat-history");

  // Create user message element
  const userMsg = { role: "user", content: input.value };
  chatHistory.prepend(createChatMessageElement(userMsg));

  const messages = retrieveMessages();
  messages.push(userMsg);
  const payload = { messages, config };

  input.value = "";

  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  let assistantMsg = { role: "assistant", content: "" };
  const assistantMessage = createChatMessageElement(assistantMsg);
  chatHistory.prepend(assistantMessage);
  const assistantResponse = assistantMessage.firstChild;

  // Scroll to the latest message
  chatHistory.scrollTop = chatHistory.scrollHeight;

  const reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      console.log("Stream done");
      break;
    }
    assistantMsg.content += value;
    // Continually render the markdown => HTML
    // Do not wipe out the model display
    assistantResponse.innerHTML = md.render(assistantMsg.content);
  }
  // Highlight code on completion
  highlightCode(assistantMessage);
  messages.push(assistantMsg);
  storeMessages(messages);
}

function applyChatSettingChanges() {
  const chatHistory = document.getElementById("chat-history");
  chatHistory.innerHTML = "";
  storeMessages([]);
  const chatSettings = {
    model: document.getElementById("model-select").value,
    systemMessage: document.getElementById("system-message").value,
  };
  storeChatSettings(chatSettings);
  updateModelDisplay(chatSettings);
}

function getDocsUrlForModel(model) {
  const modelDisplayName = model.split("/").at(-1);
  return `https://developers.cloudflare.com/workers-ai/models/${modelDisplayName}/`;
}

function updateModelDisplay(chatSettings) {
  for (const display of [...document.getElementsByClassName("model-display")]) {
    display.innerText = chatSettings.model + " - ";
    const docsLink = document.createElement("a");
    docsLink.href = getDocsUrlForModel(chatSettings.model);
    docsLink.target = "docs";
    docsLink.innerText = "Docs";
    display.append(docsLink);
  }
}

document.getElementById("chat-form").addEventListener("submit", function (e) {
  e.preventDefault();
  sendMessage();
});

document
  .getElementById("message-input")
  .addEventListener("keydown", function (event) {
    // Check if Enter is pressed without holding Shift
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault(); // Prevent the default action (newline)
      sendMessage();
    }
  });

document
  .getElementById("apply-chat-settings")
  .addEventListener("click", function (e) {
    e.preventDefault();
    applyChatSettingChanges();
  });
