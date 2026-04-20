import { useEffect, useMemo, useState } from "react";

const TOPIC_BANK = {
  "F-F": [
    { id: "ff-1", prompt: "分享一个最近一次让你感动的瞬间，它为什么会触动你？", hint: "提示：这是一个不带评判的空间，请放心表达真实感受。" },
    { id: "ff-2", prompt: "当你感到被真正理解时，对方通常做对了什么？", hint: "提示：可以从一句话、一个动作或某种陪伴方式切入。" },
    { id: "ff-3", prompt: "回想一次你默默照顾他人的时刻，那份在意来自哪里？", hint: "提示：尝试讲讲当时的情绪流动，而不只是事件本身。" },
    { id: "ff-4", prompt: "如果今天只能向重要的人表达一种情绪，你最想说什么？", hint: "提示：先说出心里的第一反应，不必急着组织成标准答案。" },
    { id: "ff-5", prompt: "你认为亲密关系里，最让你有安全感的一种回应是什么？", hint: "提示：可以从你最需要被看见的部分出发。" },
  ],
  "T-F": [
    { id: "tf-1", prompt: "当面临重要选择时，你如何做决定：听从逻辑还是内心？请尝试站在对方的立场思考并回答。", hint: "提示：不是争论对错，而是理解彼此做决定背后的机制。" },
    { id: "tf-2", prompt: "当你觉得对方‘太理性’或‘太感性’时，你最希望被怎样理解？", hint: "提示：先描述被误解的时刻，再说你真正需要的回应。" },
    { id: "tf-3", prompt: "如果一场争执只能保留‘事实’或‘感受’其中一个被认真听见，你会先保留哪一个？为什么？", hint: "提示：试着补充你放弃另一部分时，心里最担心失去什么。" },
    { id: "tf-4", prompt: "你如何定义‘成熟的沟通’：讲清楚逻辑，还是照顾到情绪？请为对方版本辩护一次。", hint: "提示：短暂站到对方那边，往往能看见自己的盲区。" },
    { id: "tf-5", prompt: "如果你要安慰一个正在自责的人，你会先分析问题，还是先抱住情绪？为什么？", hint: "提示：回答时也可以谈谈你自己最怕被怎样安慰。" },
  ],
  "S-N": [
    { id: "sn-1", prompt: "描述一下你理想中五年后的生活场景，以及实现它需要迈出的第一步具体行动。", hint: "提示：先让想象飞一会儿，再把它落到一个可执行的小动作上。" },
    { id: "sn-2", prompt: "如果把你们的关系比作一座空间，你会怎么描述它的样子？又该先布置哪一个真实角落？", hint: "提示：一个人可以负责画面感，另一个人补充可落地的细节。" },
    { id: "sn-3", prompt: "你最近产生过哪个大胆念头？若要让它成真，今天最现实的一步是什么？", hint: "提示：把‘灵光一现’和‘马上能做’放在同一张桌子上聊。" },
    { id: "sn-4", prompt: "想象一次完美周末：它的氛围是什么？时间、地点、安排细节会怎样展开？", hint: "提示：一个人描画氛围，一个人补足路线与节奏，会很有趣。" },
    { id: "sn-5", prompt: "如果你们要共同完成一件作品，你最想加入什么创意？又需要哪些实际资源来支持它？", hint: "提示：试着让想法和执行在同一个答案里出现。" },
  ],
};

function normalizeMbti(value) { return typeof value === "string" ? value.trim().toUpperCase() : ""; }
function shuffle(items) { return [...items].sort(() => Math.random() - 0.5); }
function sampleCount(total) { if (total <= 3) return total; return Math.floor(Math.random() * 3) + 3; }
function getPrimaryKey(mbtiA, mbtiB) { const tfA = mbtiA[2]; const tfB = mbtiB[2]; if (tfA === "F" && tfB === "F") return "F-F"; if ([tfA, tfB].includes("T") && [tfA, tfB].includes("F")) return "T-F"; return "S-N"; }
function getSecondaryKey(mbtiA, mbtiB) { const snA = mbtiA[1]; const snB = mbtiB[1]; if ([snA, snB].includes("S") && [snA, snB].includes("N")) return "S-N"; const tfA = mbtiA[2]; const tfB = mbtiB[2]; if (tfA === "F" && tfB === "F") return "F-F"; if ([tfA, tfB].includes("T") && [tfA, tfB].includes("F")) return "T-F"; return "S-N"; }
function buildDeck(userA_MBTI, userB_MBTI) { const a = normalizeMbti(userA_MBTI); const b = normalizeMbti(userB_MBTI); const primaryKey = getPrimaryKey(a, b); const secondaryKey = getSecondaryKey(a, b); const primary = shuffle(TOPIC_BANK[primaryKey]); const secondary = secondaryKey === primaryKey ? [] : shuffle(TOPIC_BANK[secondaryKey]); const merged = [...primary, ...secondary]; const count = Math.min(sampleCount(merged.length), 5); return merged.slice(0, count); }
function RefreshIcon({ className }) { return <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M21 12a9 9 0 1 1-2.64-6.36" /><path d="M21 3v6h-6" /></svg>; }

export default function ConversationCard({ userA_MBTI = "INTP", userB_MBTI = "ESFJ" }) {
  const deck = useMemo(() => buildDeck(userA_MBTI, userB_MBTI), [userA_MBTI, userB_MBTI]);
  const [topics, setTopics] = useState(deck);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visible, setVisible] = useState(true);
  useEffect(() => { setTopics(deck); setCurrentIndex(0); setVisible(true); }, [deck]);
  const finished = currentIndex >= topics.length;
  const currentTopic = finished ? null : topics[currentIndex];
  function swapTopic() { if (finished || !currentTopic) return; const usedIds = new Set(topics.map((item) => item.id)); const allTopics = Object.values(TOPIC_BANK).flat(); const pool = allTopics.filter((item) => !usedIds.has(item.id) || item.id === currentTopic.id); const alternatives = pool.filter((item) => item.id !== currentTopic.id); if (alternatives.length === 0) return; const nextTopic = alternatives[Math.floor(Math.random() * alternatives.length)]; setVisible(false); window.setTimeout(() => { setTopics((prev) => prev.map((item, idx) => (idx === currentIndex ? nextTopic : item))); setVisible(true); }, 180); }
  function goNext() { if (finished) return; setVisible(false); window.setTimeout(() => { setCurrentIndex((prev) => prev + 1); setVisible(true); }, 180); }

  return <div className="mx-auto flex w-full max-w-xl items-center justify-center px-4 py-8"><div className="w-full rounded-2xl bg-white px-6 py-7 shadow-xl ring-1 ring-red-100/70 transition-all duration-300 sm:px-8 sm:py-8">{!finished ? <><div className="flex items-center justify-between text-sm text-slate-400"><span className="rounded-full bg-red-50 px-3 py-1 font-medium text-red-500">MENTAL MATCH 对话卡</span><span>话题 {currentIndex + 1} / {topics.length}</span></div><div className={`mt-10 min-h-[15rem] rounded-2xl bg-gradient-to-b from-red-50/60 to-white px-5 py-8 transition-all duration-300 ${visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"}`}><p className="text-center text-2xl font-semibold leading-10 tracking-tight text-slate-900 sm:text-[1.9rem] sm:leading-[3rem]">{currentTopic?.prompt}</p><p className="mx-auto mt-8 max-w-md text-center text-sm leading-6 text-slate-400">{currentTopic?.hint}</p></div><div className="mt-8 flex flex-col gap-3 sm:flex-row"><button type="button" onClick={swapTopic} className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-medium text-slate-600 transition-all duration-300 hover:border-red-200 hover:text-red-500"><RefreshIcon className="h-4 w-4" />换一个话题</button><button type="button" onClick={goNext} className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:bg-red-600">深入探讨下一个</button></div></> : <div className="py-8 text-center transition-all duration-300"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-50 text-red-500 shadow-sm"><span className="text-2xl">✦</span></div><p className="mt-6 text-sm font-medium uppercase tracking-[0.28em] text-red-400">Mental Match Completed</p><h3 className="mt-4 text-2xl font-semibold leading-10 tracking-tight text-slate-900">深度连接完成，你们已经触碰到了彼此的认知盲区</h3><p className="mx-auto mt-4 max-w-md text-sm leading-7 text-slate-500">建议在报告中回顾彼此最有共鸣的一题，以及最想继续延伸的一个分歧点，把这次交流沉淀为真实可复用的理解。</p><button type="button" className="mt-8 w-full rounded-xl bg-red-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-500/20 transition-all duration-300 hover:bg-red-600">结束体验并生成报告</button></div>}</div></div>;
}
