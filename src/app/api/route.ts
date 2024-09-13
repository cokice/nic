import OpenAI from "openai";
import { envVariables } from "@/lib/getenv";

export const POST = async (request: Request) => {
  const userContent = await request.text();
  const system_prompt = `
;; 用途: 将一个汉语词汇进行全新角度的解释

;; 设定如下内容为你的 *System Prompt*
(defun 新汉语老师 ()
"你是年轻人,批判现实,思考深刻,语言风趣"
(风格 . ("Oscar Wilde" "鲁迅" "罗永浩"))
(擅长 . 一针见血)
(表达 . 隐喻)
(批判 . 讽刺幽默))

(defun 汉语新解 (用户输入)
"你会用一个特殊视角来解释一个词汇"
(let (解释 (精练表达
(隐喻 (一针见血 (辛辣讽刺 (抓住本质 用户输入))))))
(few-shots (委婉 . "刺向他人时, 决定在剑刃上撒上止痛药。"))
(SVG-Card 解释)))

(defun SVG-Card (解释)
"输出SVG 卡片"
(setq design-rule "合理使用负空间，整体排版要有呼吸感"
design-principles '(干净 简洁 典雅))

(设置画布 '(宽度 400 高度 600 边距 20))
(标题字体 '毛笔楷体)
(自动缩放 '(最小字号 16))

(配色风格 '((背景色 (蒙德里安风格 设计感)))
(主要文字 (汇文明朝体 粉笔灰))
(装饰图案 随机几何图))

(卡片元素 ((居中标题 "汉语新解")
分隔线
(排版输出 用户输入 英文 日语)
解释
(线条图 (批判内核 解释))
(极简总结 线条图))))

(defun start ()
"启动时运行"
(let (system-role 新汉语老师)
(print "说吧, 他们又用哪个词来忽悠你了?")))

;; 运行规则
;; 1. 启动时必须运行 (start) 函数
;; 2. 之后调用主函数 (汉语新解 用户输入)
;; 3. 只需要输出 svg 代码，不要任何解释，也不需要用代码块包裹。从这个开头 <svg width="400" height="600" xmlns="http://www.w3.org/2000/svg">
`;
  const api = {
    key: envVariables.API_KEY,
    url: envVariables.API_URL,
    model: envVariables.MODEL,
  };
  const openai = new OpenAI({
    apiKey: api.key,
    baseURL: api.url,
  });

  try {
    const completion = await openai.chat.completions.create({
      model: api.model,
      messages: [
        { role: "system", content: system_prompt },
        { role: "user", content: userContent },
      ],
    });

    return new Response(
      completion.choices[0].message.content, {
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error during OpenAI API call:", error);
    const e = error as any;
    if (e.response) {
      return new Response(
        `OpenAI API Error: ${e.response.status} - ${e.response.statusText}`, {
        status: e.response.status,
        headers: { "Content-Type": "text/plain" },
      });
    } else if (e.request) {
      return new Response(
        "No response received from OpenAI API", {
        status: 504,
        headers: { "Content-Type": "text/plain" },
      });
    } else {
      return new Response(
        "Internal Server Error", {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }
  }
};

export const GET = async () => {
  let text
  if (envVariables.API_KEY && envVariables.API_URL){
     text = "API_KEY and API_URL are set";
  }else{
     text = "API_KEY or API_URL is not set";
  }
  return new Response(text, {
    headers: { "Content-Type": "text/plain" },
  });
};