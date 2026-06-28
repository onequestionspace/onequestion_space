"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Check, Loader2, Save, Globe } from "lucide-react";
import { FaXTwitter as XIcon, FaGithub as GithubIcon, FaLinkedin as LinkedinIcon } from "react-icons/fa6";

const ACCENT_COLORS = [
  { name: "Amber", value: "#f59e0b" },
  { name: "Orange", value: "#f97316" },
  { name: "Red", value: "#ef4444" },
  { name: "Green", value: "#22c55e" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "White", value: "#e4e4e7" },
];

const BACKGROUNDS = [
  { id: "dark", label: "Void", desc: "Pure dark", bg: "#0a0a0a" },
  { id: "darker", label: "Obsidian", desc: "Deep black", bg: "#050505" },
  { id: "midnight", label: "Midnight", desc: "Dark blue-black", bg: "#080c18" },
  { id: "sunset", label: "Ember", desc: "Dark warm brown", bg: "#0f0800" },
  { id: "ocean", label: "Deep", desc: "Dark teal-black", bg: "#04111a" },
  { id: "aurora", label: "Forest", desc: "Dark green-black", bg: "#030d08" },
  { id: "fog", label: "Chalk", desc: "Soft white", bg: "#f5f5f0" },
  { id: "parchment", label: "Paper", desc: "Warm cream", bg: "#faf6f0" },
  { id: "sand", label: "Sand", desc: "Desert tone", bg: "#f5efe6" },
  { id: "mint", label: "Sage", desc: "Soft green", bg: "#e8f5ee" },
];

const LIGHT_BGS = ["fog", "parchment", "sand", "mint"];

const FONTS = [
  { id: "inter", label: "Clean", sub: "Modern sans-serif", family: "font-sans" },
  { id: "mono", label: "Mono", sub: "Technical & raw", family: "font-mono" },
  { id: "serif", label: "Serif", sub: "Editorial & elegant", family: "font-serif" },
];

const CARD_STYLES = [
  { id: "glass", label: "Glass", sub: "Frosted & blurred" },
  { id: "solid", label: "Solid", sub: "Clean borders" },
  { id: "minimal", label: "Minimal", sub: "Borderless" },
];

export function AppearanceTab() {
  const profile = useQuery(api.profiles.current);
  const updateProfile = useMutation(api.profiles.update);

  const [themeColor, setThemeColor] = useState("#f59e0b");
  const [themeBg, setThemeBg] = useState("dark");
  const [themeFont, setThemeFont] = useState("inter");
  const [themeCardStyle, setThemeCardStyle] = useState("glass");
  const [twitter, setTwitter] = useState("");
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!profile) return;
    setThemeColor(profile.themeColor || "#f59e0b");
    setThemeBg(profile.themeBg || "dark");
    setThemeFont(profile.themeFont || "inter");
    setThemeCardStyle(profile.themeCardStyle || "glass");
    if (profile.socialLinks) {
      try {
        const s = JSON.parse(profile.socialLinks);
        setTwitter(s.twitter || "");
        setGithub(s.github || "");
        setWebsite(s.website || "");
        setLinkedin(s.linkedin || "");
      } catch {}
    }
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateProfile({
        themeColor,
        themeBg,
        themeFont,
        themeCardStyle,
        themeEffect: "none",
        socialLinks: JSON.stringify({ twitter, github, website, linkedin }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  return (
    <div className="space-y-8">

      <div>
        <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Accent Color</p>
        <p className="text-xs text-zinc-500 mb-3">Shows on buttons, rings, and highlights.</p>
        <div className="flex flex-wrap gap-2.5 mb-3">
          {ACCENT_COLORS.map(c => (
            <button key={c.value} onClick={() => setThemeColor(c.value)} title={c.name}
              className="relative w-8 h-8 rounded-full transition-all hover:scale-110"
              style={{ backgroundColor: c.value, boxShadow: themeColor === c.value ? "0 0 0 2px #000, 0 0 0 4px " + c.value : "none" }}>
              {themeColor === c.value && <Check className="w-3.5 h-3.5 absolute inset-0 m-auto text-black" />}
            </button>
          ))}
          <label className="relative w-8 h-8 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden">
            <span className="text-xs text-zinc-500">+</span>
            <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
          </label>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: themeColor }} />
          <span className="text-xs text-zinc-600 font-mono">{themeColor}</span>
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Background</p>
        <p className="text-xs text-zinc-500 mb-3">The canvas of your space.</p>
        <div className="grid grid-cols-2 gap-2">
          {BACKGROUNDS.map(bg => {
            const isLight = LIGHT_BGS.includes(bg.id);
            const isSelected = themeBg === bg.id;
            return (
              <button key={bg.id} onClick={() => setThemeBg(bg.id)}
                className={"relative rounded-xl border-2 overflow-hidden transition-all " + (isSelected ? "border-primary" : "border-white/8 hover:border-white/20")}>
                <div className="h-10 w-full relative" style={{ backgroundColor: bg.bg }}>

                </div>
                <div className="px-2.5 py-1.5 flex items-center justify-between" style={{ backgroundColor: bg.bg }}>
                  <div>
                    <p className={"text-xs font-bold " + (isLight ? "text-zinc-800" : "text-white")}>{bg.label}</p>
                    <p className={"text-[10px] " + (isLight ? "text-zinc-500" : "text-zinc-600")}>{bg.desc}</p>
                  </div>
                  {isSelected && (
                    <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: themeColor }}>
                      <Check className="w-2.5 h-2.5 text-black" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Typography</p>
        <p className="text-xs text-zinc-500 mb-3">How text feels on your space.</p>
        <div className="grid grid-cols-3 gap-2">
          {FONTS.map(f => (
            <button key={f.id} onClick={() => setThemeFont(f.id)}
              className={"relative rounded-xl border-2 p-3 text-left transition-all " + (themeFont === f.id ? "border-primary bg-primary/5" : "border-white/8 hover:border-white/20")}>
              <p className={"text-xl font-bold text-white mb-0.5 " + f.family}>Aa</p>
              <p className="text-xs font-bold text-white">{f.label}</p>
              <p className="text-[10px] text-zinc-500">{f.sub}</p>
              {themeFont === f.id && (
                <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ backgroundColor: themeColor }}>
                  <Check className="w-2 h-2 text-black" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Card Style</p>
        <p className="text-xs text-zinc-500 mb-3">How your Q&A card looks.</p>
        <div className="grid grid-cols-3 gap-2">
          {CARD_STYLES.map(s => (
            <button key={s.id} onClick={() => setThemeCardStyle(s.id)}
              className={"relative rounded-xl border-2 p-3 text-left transition-all " + (themeCardStyle === s.id ? "border-primary bg-primary/5" : "border-white/8 hover:border-white/20")}>
              <div className={"w-full h-6 rounded-lg mb-2 " + (s.id === "glass" ? "bg-white/10 border border-white/20" : s.id === "solid" ? "bg-zinc-800 border border-zinc-700" : "border border-dashed border-white/10")} />
              <p className="text-xs font-bold text-white">{s.label}</p>
              <p className="text-[10px] text-zinc-500">{s.sub}</p>
              {themeCardStyle === s.id && (
                <div className="absolute top-2 right-2 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ backgroundColor: themeColor }}>
                  <Check className="w-2 h-2 text-black" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Social Links</p>
        <p className="text-xs text-zinc-500 mb-3">Show up on your space page.</p>
        <div className="space-y-2">
          {([
            { Icon: XIcon, value: twitter, set: setTwitter, placeholder: "@username", label: "X" },
            { Icon: GithubIcon, value: github, set: setGithub, placeholder: "username", label: "GitHub" },
            { Icon: LinkedinIcon, value: linkedin, set: setLinkedin, placeholder: "username", label: "LinkedIn" },
            { Icon: Globe, value: website, set: setWebsite, placeholder: "https://...", label: "Website" },
          ] as const).map(({ Icon, value, set, placeholder, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-zinc-500" />
              </div>
              <input type="text" value={value} onChange={e => (set as (v: string) => void)(e.target.value)} placeholder={placeholder}
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-white text-xs focus:outline-none focus:border-primary/50 placeholder:text-zinc-600 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} disabled={saving}
        className="w-full py-3 rounded-xl text-black text-sm font-black flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:opacity-90"
        style={{ backgroundColor: themeColor }}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Appearance</>}
      </button>

    </div>
  );
}
