"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Plus,
  Trash2,
  Menu,
  User,
  RefreshCw,
  Brain,
  Lightbulb,
  ShieldAlert,
  Crown,
  Mic2,
  Users,
  Code,
  Palette,
  Binary,
  ArrowRight,
  Settings,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Columns,
  Activity,
  Award
} from "lucide-react"
import { cn } from "@/lib/utils"

export default function Home() {
  const [chats, setChats] = useState<{ id: number, name: string, active: boolean, results?: any }[]>([
    { id: 1, name: "Consultation 1", active: true }
  ])
  const [form, setForm] = useState({
    likes_coding: 0,
    likes_design: 0,
    math_score: 50,
    social_skill: 50,
    analytical_thinking: 50,
    creativity: 50,
    risk_tolerance: 50,
    leadership: 50,
    public_speaking: 50,
    teamwork: 50,
    structure: 50
  })
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [inputExpanded, setInputExpanded] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const activeChat = chats.find(c => c.active)

  const handleSliderChange = (name: string, value: number) => {
    setForm({ ...form, [name]: value })
  }

  const createNewChat = () => {
    const newId = chats.length ? Math.max(...chats.map(c => c.id)) + 1 : 1
    const newChat = { id: newId, name: `Consultation ${newId}`, active: true }
    setChats(chats.map(c => ({ ...c, active: false })).concat(newChat))
    setForm({
      likes_coding: 0,
      likes_design: 0,
      math_score: 50,
      social_skill: 50,
      analytical_thinking: 50,
      creativity: 50,
      risk_tolerance: 50,
      leadership: 50,
      public_speaking: 50,
      teamwork: 50,
      structure: 50
    })
    setInputExpanded(true)
  }

  const switchChat = (id: number) => {
    setChats(chats.map(c => ({ ...c, active: c.id === id })))
    setInputExpanded(!chats.find(c => c.id === id)?.results)
  }

  const deleteChat = (e: React.MouseEvent, id: number) => {
    e.stopPropagation()
    const newChats = chats.filter(c => c.id !== id)
    if (newChats.length && !newChats.find(c => c.active)) {
      newChats[0].active = true
    }
    setChats(newChats)
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://127.0.0.1:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })

      const data = await res.json()
      setChats(chats.map(c =>
        c.active ? { ...c, results: data, name: data.predictions?.[0]?.career ? `${data.predictions[0].career}` : c.name } : c
      ))
      setInputExpanded(false)
    } catch (error) {
      console.error("Prediction failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex h-screen bg-white dark:bg-[#212121] overflow-hidden text-[#ececf1] font-sans">

      {/* Sidebar - ChatGPT Style */}
      <motion.aside
        initial={false}
        animate={{ width: sidebarOpen ? 260 : 0 }}
        className="bg-[#f9f9f9] dark:bg-[#171717] shrink-0 flex flex-col transition-all duration-300 ease-in-out z-50 overflow-hidden"
      >
        <div className="flex flex-col h-full w-[260px] p-3 text-black dark:text-white">
          <button
            onClick={createNewChat}
            className="flex items-center gap-3 px-3 py-3 border border-black/10 dark:border-white/10 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-all text-sm font-medium mb-6"
          >
            <Plus size={16} />
            <span>New Analysis</span>
          </button>

          <div className="flex-1 overflow-y-auto space-y-1">
            <h6 className="text-[10px] font-bold uppercase tracking-widest text-black/30 dark:text-white/30 px-3 mb-4">Assessment Logs</h6>
            {chats.map(chat => (
              <div
                key={chat.id}
                onClick={() => switchChat(chat.id)}
                className={cn(
                  "group flex items-center gap-3 px-3 py-3 rounded-md cursor-pointer text-sm transition-all",
                  chat.active ? "bg-black/5 dark:bg-[#2a2b32] font-medium" : "text-black/60 dark:text-white/60 hover:bg-black/5 dark:hover:bg-[#2a2b32]"
                )}
              >
                <div className={cn("w-1.5 h-1.5 rounded-full", chat.active ? "bg-[#10a37f]" : "bg-black/10 dark:bg-white/10")} />
                <span className="truncate flex-1">{chat.name}</span>
                {chats.length > 1 && (
                  <button onClick={(e) => deleteChat(e, chat.id)} className="opacity-0 group-hover:opacity-100 hover:text-red-500 transition-opacity p-1">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-black/10 dark:border-white/10 mt-auto">
            <div className="flex items-center gap-3 px-3 py-3 rounded-md hover:bg-black/5 dark:hover:bg-white/5 cursor-pointer text-xs font-medium grayscale opacity-60">
              <Settings size={14} />
              <span>Account Settings</span>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full relative overflow-hidden bg-white dark:bg-[#212121]">

        {/* Header (Top Nav) */}
        <header className="h-14 flex items-center px-4 shrink-0 transition-all border-b border-black/5 dark:border-white/5 text-black/40 dark:text-white/40">
          {!sidebarOpen && (
            <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-black dark:text-white">
              <Menu size={18} />
            </button>
          )}
          <div className="flex-1 flex justify-center">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Trajectory Matrix Analysis</span>
          </div>
          {sidebarOpen && (
            <button onClick={() => setSidebarOpen(false)} className="p-2 hover:bg-black/5 dark:hover:bg-white/5 rounded-md text-black dark:text-white">
              <Menu size={18} />
            </button>
          )}
        </header>

        {/* Scrollable Workspace */}
        <div className="flex-1 overflow-y-auto flex flex-col" ref={scrollRef}>
          <div className="max-w-4xl w-full mx-auto px-6 py-10 space-y-16 flex-1">

            {!activeChat?.results && (
              <div className="h-full min-h-[50vh] flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-12 h-12 bg-[#10a37f] rounded-lg flex items-center justify-center text-white shadow-lg rotate-3">
                  <Activity size={24} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight text-black dark:text-white">Predictive Career Assessment</h1>
                <p className="text-sm text-black/50 dark:text-white/50 max-w-sm font-medium leading-relaxed">
                  Adjust the trait matrix and execute the analysis to generate a quantitative career roadmap.
                </p>
              </div>
            )}

            <AnimatePresence>
              {activeChat?.results && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-12">

                  {/* Results Section - Table Format */}
                  <div className="space-y-10">

                    {/* Table 1: Career Match Summary */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-[#10a37f]/10 flex items-center justify-center text-[#10a37f]">
                          <Award size={14} />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40">Career Match Rankings</h3>
                      </div>
                      <div className="overflow-hidden border border-black/10 dark:border-white/10 rounded-xl bg-white dark:bg-[#2a2b32]">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead className="bg-black/5 dark:bg-white/5">
                            <tr>
                              <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-black/50 dark:text-white/50">Channel</th>
                              <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-black/50 dark:text-white/50">Career Path</th>
                              <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-black/50 dark:text-white/50 text-right">Probability</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black/5 dark:divide-white/5 text-black dark:text-white">
                            {activeChat.results.predictions.slice(0, 4).map((p: any, i: number) => (
                              <tr key={i} className={cn("transition-colors", i === 0 ? "bg-[#10a37f]/5" : "hover:bg-black/[0.02] dark:hover:bg-white/[0.02]")}>
                                <td className="px-6 py-4">
                                  <span className={cn("px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase tracking-tighter", i === 0 ? "bg-[#10a37f] text-white" : "bg-black/10 dark:bg-white/10 opacity-50")}>
                                    {i === 0 ? "Optimal" : `Alt ${i}`}
                                  </span>
                                </td>
                                <td className="px-6 py-4 font-bold tracking-tight">{p.career}</td>
                                <td className="px-6 py-4 text-right tabular-nums font-mono font-bold">
                                  {p.confidence}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Table 2: Feature Influence Analysis */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded bg-teal-500/10 flex items-center justify-center text-teal-500">
                          <Binary size={14} />
                        </div>
                        <h3 className="text-xs font-bold uppercase tracking-widest text-black/40 dark:text-white/40">Factor Influence Analysis</h3>
                      </div>
                      <div className="overflow-hidden border border-black/10 dark:border-white/10 rounded-xl bg-white dark:bg-[#2a2b32]">
                        <table className="w-full text-left text-sm border-collapse">
                          <thead className="bg-black/5 dark:bg-white/5">
                            <tr>
                              <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-black/50 dark:text-white/50">Attribute Trait</th>
                              <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-black/50 dark:text-white/50">Magnitude</th>
                              <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-black/50 dark:text-white/50 text-right">Impact Value</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-black/5 dark:divide-white/5 text-black dark:text-white">
                            {activeChat.results.reasoning && activeChat.results.reasoning.map((r: any, i: number) => (
                              <tr key={i} className="hover:bg-black/[0.02] dark:hover:bg-white/[0.02] transition-colors">
                                <td className="px-6 py-4 font-medium opacity-80">{r.feature}</td>
                                <td className="px-6 py-4">
                                  <div className="w-32 bg-black/10 dark:bg-white/10 h-1 rounded-full overflow-hidden">
                                    <motion.div
                                      initial={{ width: 0 }}
                                      animate={{ width: `${Math.min(100, Math.abs(r.impact * 20))}%` }}
                                      className={cn("h-full", r.impact > 0 ? "bg-[#10a37f]" : "bg-orange-500")}
                                    />
                                  </div>
                                </td>
                                <td className={cn("px-6 py-4 text-right font-mono text-xs font-bold tabular-nums", r.impact > 0 ? "text-[#10a37f]" : "text-orange-500")}>
                                  {r.impact > 0 ? "+" : ""}{(r.impact * 10).toFixed(1)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    <div className="flex justify-center italic text-[10px] text-black/30 dark:text-white/30 tracking-[0.4em] uppercase font-bold pt-4">
                      Deterministic Engine • logistic optimization • ver. 2.0.4
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

          {/* Input & Control Section - ChatGPT Style Bar */}
          <div className="p-4 md:p-8 shrink-0 bg-white dark:bg-[#212121] border-t border-black/5 dark:border-white/5">
            <div className="max-w-4xl mx-auto space-y-4">

              {/* Expandable Parameter Matrix */}
              <AnimatePresence>
                {inputExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden border border-black/10 dark:border-white/10 rounded-2xl bg-white dark:bg-[#343541] shadow-2xl shadow-black/10 text-black dark:text-white mb-6"
                  >
                    <div className="p-8 space-y-12">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

                        {/* 1. Core Aptitude */}
                        <div className="space-y-8">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-[#10a37f] border-b border-black/5 dark:border-white/5 pb-2">Technical Matrix</h5>
                          <div className="space-y-6">
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="opacity-60 flex items-center gap-2 tracking-tight"><Code size={14} /> Coding Interest</span>
                              <button onClick={() => setForm({ ...form, likes_coding: form.likes_coding === 1 ? 0 : 1 })} className={cn("w-10 h-5 rounded-full relative transition-colors", form.likes_coding === 1 ? "bg-[#10a37f]" : "bg-black/20 dark:bg-white/20")}>
                                <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", form.likes_coding === 1 ? "left-6" : "left-1")} />
                              </button>
                            </div>
                            <div className="flex items-center justify-between text-xs font-bold">
                              <span className="opacity-60 flex items-center gap-2 tracking-tight"><Palette size={14} /> Design Affinity</span>
                              <button onClick={() => setForm({ ...form, likes_design: form.likes_design === 1 ? 0 : 1 })} className={cn("w-10 h-5 rounded-full relative transition-colors", form.likes_design === 1 ? "bg-[#10a37f]" : "bg-black/20 dark:bg-white/20")}>
                                <div className={cn("absolute top-1 w-3 h-3 bg-white rounded-full transition-all", form.likes_design === 1 ? "left-6" : "left-1")} />
                              </button>
                            </div>
                            <div className="space-y-3 pt-2">
                              <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-40"><span>Math Score</span> <span className="text-[#10a37f]">{form.math_score}</span></div>
                              <input type="range" min="0" max="100" value={form.math_score} onChange={(e) => handleSliderChange('math_score', Number(e.target.value))} className="w-full accent-[#10a37f] h-1 appearance-none bg-black/10 dark:bg-white/10 rounded-full" />
                            </div>
                          </div>
                        </div>

                        {/* 2. Cognitive Distribution */}
                        <div className="space-y-8 border-x border-black/5 dark:border-white/5 px-8">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-[#10a37f] border-b border-black/5 dark:border-white/5 pb-2">Psychological Traits</h5>
                          <div className="space-y-6">
                            {[
                              { name: 'analytical_thinking', label: 'Analytical', icon: Brain },
                              { name: 'creativity', label: 'Creativity', icon: Lightbulb },
                              { name: 'risk_tolerance', label: 'Risk Tolerance', icon: ShieldAlert }
                            ].map(t => (
                              <div key={t.name} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-40"><span>{t.label}</span> <span className="text-[#10a37f]">{form[t.name as keyof typeof form]}</span></div>
                                <input type="range" min="30" max="100" value={form[t.name as keyof typeof form]} onChange={(e) => handleSliderChange(t.name, Number(e.target.value))} className="w-full accent-[#10a37f] h-1 appearance-none bg-black/10 dark:bg-white/10 rounded-full" />
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 3. Social Integration */}
                        <div className="space-y-8">
                          <h5 className="text-[10px] font-black uppercase tracking-widest text-[#10a37f] border-b border-black/5 dark:border-white/5 pb-2">Soft Skill Spectrum</h5>
                          <div className="space-y-6">
                            {[
                              { name: 'social_skill', label: 'Social Skill' },
                              { name: 'leadership', label: 'Leadership' },
                              { name: 'public_speaking', label: 'Public Speaking' }
                            ].map(t => (
                              <div key={t.name} className="space-y-2">
                                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest opacity-40"><span>{t.label}</span> <span className="text-[#10a37f]">{form[t.name as keyof typeof form]}</span></div>
                                <input type="range" min="30" max="100" value={form[t.name as keyof typeof form]} onChange={(e) => handleSliderChange(t.name, Number(e.target.value))} className="w-full accent-[#10a37f] h-1 appearance-none bg-black/10 dark:bg-white/10 rounded-full" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Advanced Dynamic Filters */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-black/5 dark:border-white/5">
                        <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black uppercase text-[#10a37f]"><span>Collaboration Synergy</span> <span>{form.teamwork > 50 ? "Team-Oriented" : "Independent"}</span></div>
                          <input type="range" min="0" max="100" value={form.teamwork} onChange={(e) => handleSliderChange('teamwork', Number(e.target.value))} className="w-full accent-[#10a37f] h-1 appearance-none bg-black/10 dark:bg-white/10 rounded-full" />
                          <div className="flex justify-between text-[8px] opacity-20 font-bold tracking-widest uppercase"><span>Solo</span> <span>Collective</span></div>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-[10px] font-black uppercase text-[#10a37f]"><span>Workspace Linearity</span> <span>{form.structure > 50 ? "Structured" : "Fluid"}</span></div>
                          <input type="range" min="0" max="100" value={form.structure} onChange={(e) => handleSliderChange('structure', Number(e.target.value))} className="w-full accent-[#10a37f] h-1 appearance-none bg-black/10 dark:bg-white/10 rounded-full" />
                          <div className="flex justify-between text-[8px] opacity-20 font-bold tracking-widest uppercase"><span>Adaptive</span> <span>Sovereign</span></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Interaction Bar */}
              <div className="relative flex items-stretch gap-3">
                <button
                  onClick={() => setInputExpanded(!inputExpanded)}
                  className="px-4 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-[#40414f] text-black/40 dark:text-white/40 hover:bg-black/5 dark:hover:bg-white/5 transition-all flex items-center shadow-sm"
                  title={inputExpanded ? "Collapse Matrix" : "Expand Matrix"}
                >
                  {inputExpanded ? <ChevronDown size={18} /> : <Columns size={18} />}
                </button>
                <div className="flex-1 relative">
                  <div className="w-full h-12 px-5 bg-white dark:bg-[#40414f] border border-black/10 dark:border-white/5 rounded-xl flex items-center shadow-sm">
                    <span className="text-black/30 dark:text-white/30 italic text-sm font-medium select-none">
                      {inputExpanded ? "Model 2.0 awaiting trajectory parameters..." : "Matrix locked. Expand to modify traits."}
                    </span>
                    <button
                      onClick={handleSubmit}
                      disabled={loading}
                      className={cn(
                        "absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md flex items-center justify-center transition-all",
                        loading ? "bg-transparent animate-spin text-[#10a37f]" : "bg-[#10a37f] text-white hover:opacity-90 active:scale-95 shadow-lg shadow-teal-500/20"
                      )}
                    >
                      {loading ? <RefreshCw size={16} /> : <ArrowRight size={18} />}
                    </button>
                  </div>
                </div>
              </div>
              <div className="text-center mt-3">
                <p className="text-[9px] font-black uppercase tracking-[0.3em] text-black/20 dark:text-white/20">Deterministic Model Engine v2.0.4 • Optimized Logistic Core</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
