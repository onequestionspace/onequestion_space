"use client";

import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Check, Loader2, Save, Globe, Upload, X, Phone } from "lucide-react";
import { FaXTwitter as XIcon, FaGithub as GithubIcon, FaLinkedin as LinkedinIcon } from "react-icons/fa6";

const ACCENT_COLORS = [
  { name: "Amber", value: "#f59e0b" },
  { name: "Orange", value: "#f97316" },
  { name: "Red", value: "#ef4444" },
  { name: "Emerald", value: "#10b981" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Rose", value: "#f43f5e" },
  { name: "White", value: "#e4e4e7" },
];

const BACKGROUNDS = [
  // Dark — rich, oiled
  { id: "dark",     label: "Void",      desc: "Oiled black",       bg: "#0a0208",  preview: "linear-gradient(135deg,#0a0208 60%,#1a0a1a 100%)" },
  { id: "darker",   label: "Obsidian",  desc: "Deep black glass",  bg: "#050308",  preview: "linear-gradient(135deg,#050308 60%,#0d050d 100%)" },
  { id: "midnight", label: "Midnight",  desc: "Sapphire dark",     bg: "#05080f",  preview: "linear-gradient(135deg,#05080f 60%,#0a1020 100%)" },
  { id: "ocean",    label: "Abyss",     desc: "Deep teal glass",   bg: "#030d0f",  preview: "linear-gradient(135deg,#030d0f 60%,#041520 100%)" },
  { id: "aurora",   label: "Eclipse",   desc: "Dark emerald",      bg: "#030a05",  preview: "linear-gradient(135deg,#030a05 60%,#061208 100%)" },
  { id: "sunset",   label: "Ember",     desc: "Crimson dark",      bg: "#0d0403",  preview: "linear-gradient(135deg,#0d0403 60%,#180805 100%)" },
  { id: "galaxy",   label: "Galaxy",    desc: "Cosmic purple",     bg: "#04020d",  preview: "linear-gradient(135deg,#04020d 60%,#0a0520 100%)" },
  { id: "dusk",     label: "Dusk",      desc: "Violet night",      bg: "#0a0510",  preview: "linear-gradient(135deg,#0a0510 60%,#140820 100%)" },
  // Light — glassy
  { id: "fog",      label: "Pearl",     desc: "Soft white glass",  bg: "#f0eef8",  preview: "linear-gradient(135deg,#f0eef8 60%,#e8e4f5 100%)" },
  { id: "parchment",label: "Paper",     desc: "Warm cream glass",  bg: "#faf6f0",  preview: "linear-gradient(135deg,#faf6f0 60%,#f5ede0 100%)" },
  { id: "sand",     label: "Sand",      desc: "Desert glass",      bg: "#f5efe6",  preview: "linear-gradient(135deg,#f5efe6 60%,#ede4d5 100%)" },
  { id: "mint",      label: "Sage",      desc: "Soft green glass",  bg: "#e8f5ee",  preview: "linear-gradient(135deg,#e8f5ee 60%,#d8f0e0 100%)" },
  { id: "chalkwhite", label: "Chalk",    desc: "Real chalk texture", bg: "#f0eef8", preview: "linear-gradient(135deg,#f0eef8 60%,#e8e4f5 100%)" },
  { id: "chalkgreen", label: "Blackboard", desc: "Green chalk board", bg: "#1a2e1a", preview: "linear-gradient(135deg,#1a2e1a 60%,#152515 100%)" },
  { id: "chalkblack", label: "Slate",    desc: "Dark chalk board",   bg: "#0f0f0f", preview: "linear-gradient(135deg,#0f0f0f 60%,#1a1a1a 100%)" },
];

const EFFECTS = [
  { id: "none",     label: "Still",     desc: "Clean & quiet" },
  { id: "shapes",   label: "Shapes",    desc: "Floating geometry" },
  { id: "orbs",     label: "Orbs",      desc: "Drifting glows" },
  { id: "particles",label: "Particles", desc: "Tiny dots" },
  { id: "bubbles",  label: "Bubbles",   desc: "Rising circles" },
  { id: "net",      label: "Net",       desc: "Grid overlay" },
  { id: "matrix",   label: "Code",      desc: "Falling chars" },
  { id: "stars",    label: "Stars",     desc: "Shooting stars" },
  { id: "hex",      label: "Hex",       desc: "Hexagon grid" },
];

const LIGHT_BGS = ["fog", "parchment", "sand", "mint", "chalkwhite"];

const FONTS = [
  { id: "inter",  label: "Clean",    sub: "Modern sans-serif", family: "font-sans" },
  { id: "mono",   label: "Mono",     sub: "Technical & raw",   family: "font-mono" },
  { id: "serif",  label: "Serif",    sub: "Editorial",         family: "font-serif" },
];

const CARD_STYLES = [
  { id: "glass",   label: "Glass",   sub: "Frosted & blurred" },
  { id: "solid",   label: "Solid",   sub: "Clean borders" },
  { id: "minimal", label: "Minimal", sub: "Borderless" },
];

export function AppearanceTab() {
  const profile = useQuery(api.profiles.current);
  const updateProfile = useMutation(api.profiles.update);

  const [themeColor, setThemeColor] = useState("#f59e0b");
  const [themeBg, setThemeBg] = useState("dark");
  const [themeEffect, setThemeEffect] = useState("none");
  const [themeFont, setThemeFont] = useState("inter");
  const [themeCardStyle, setThemeCardStyle] = useState("glass");
  const [twitter, setTwitter] = useState("");
  const [github, setGithub] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [customBgUrl, setCustomBgUrl] = useState("");
  const [uploadingBg, setUploadingBg] = useState(false);
  const bgFileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!profile) return;
    setThemeColor(profile.themeColor || "#f59e0b");
    setThemeBg(profile.themeBg || "dark");
    setThemeFont(profile.themeFont || "inter");
    setThemeCardStyle(profile.themeCardStyle || "glass");
    const effect = profile.themeEffect || "none";
    if (effect.startsWith("custom:")) {
      setCustomBgUrl(effect.replace("custom:", ""));
      setThemeEffect("custom");
    } else {
      setThemeEffect(effect);
    }
    if (profile.socialLinks) {
      try {
        const s = JSON.parse(profile.socialLinks);
        setTwitter(s.twitter || "");
        setGithub(s.github || "");
        setWhatsapp(s.whatsapp || "");
        setWebsite(s.website || "");
        setLinkedin(s.linkedin || "");
      } catch {}
    }
  }, [profile]);

  const handleBgUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingBg(true);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("type", "background");
      const res = await fetch("/api/upload", { method: "POST", body: form });
      const data = await res.json();
      if (data.url) {
        setCustomBgUrl(data.url);
        setThemeEffect("custom");
      }
    } catch {}
    setUploadingBg(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const effectValue = themeEffect === "custom" && customBgUrl
        ? "custom:" + customBgUrl
        : themeEffect;
      await updateProfile({
        themeColor,
        themeBg,
        themeFont,
        themeCardStyle,
        themeEffect: effectValue,
        socialLinks: JSON.stringify({ twitter, github, website, linkedin, whatsapp }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  return (
    <div className="space-y-8">

      {/* Accent Color */}
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
          <label className="relative w-8 h-8 rounded-full border-2 border-dashed border-white/20 flex items-center justify-center cursor-pointer hover:border-white/40 transition-colors overflow-hidden">
            <span className="text-xs text-zinc-500">+</span>
            <input type="color" value={themeColor} onChange={e => setThemeColor(e.target.value)} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" />
          </label>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border border-white/10" style={{ backgroundColor: themeColor }} />
          <span className="text-xs text-zinc-600 font-mono">{themeColor}</span>
        </div>
      </div>

      {/* Background */}
      <div>
        <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Background</p>
        <p className="text-xs text-zinc-500 mb-3">The canvas of your space.</p>
        <div className="grid grid-cols-2 gap-2 mb-3">
          {BACKGROUNDS.map(bg => {
            const isLight = LIGHT_BGS.includes(bg.id);
            const isSelected = themeBg === bg.id;
            return (
              <button key={bg.id} onClick={() => setThemeBg(bg.id)}
                className={"relative rounded-xl border-2 overflow-hidden transition-all " + (isSelected ? "border-white/40" : "border-white/8 hover:border-white/20")}
                style={{ borderColor: isSelected ? themeColor : undefined }}>
                <div className="h-12 w-full relative overflow-hidden" style={{ background: bg.preview }}>
                  <div className="absolute inset-0 opacity-30" style={{ background: "radial-gradient(circle at 30% 50%, " + themeColor + "40, transparent 60%)" }} />
                  <div className="absolute inset-0 backdrop-blur-[0.5px]" style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)" }} />
                </div>
                <div className="px-2.5 py-1.5 flex items-center justify-between" style={{ background: bg.preview }}>
                  <div>
                    <p className={"text-xs font-bold " + (isLight ? "text-zinc-800" : "text-white")}>{bg.label}</p>
                    <p className={"text-[10px] " + (isLight ? "text-zinc-500" : "text-zinc-500")}>{bg.desc}</p>
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

        {/* Custom background upload */}
        <div className="rounded-xl border-2 border-dashed border-white/10 hover:border-white/20 transition-colors overflow-hidden">
          {customBgUrl ? (
            <div className="relative h-20 group">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(" + customBgUrl + ")" }} />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => bgFileRef.current?.click()} className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-medium backdrop-blur-sm">Change</button>
                <button onClick={() => { setCustomBgUrl(""); setThemeEffect("none"); }} className="px-3 py-1.5 rounded-lg bg-white/20 text-white text-xs font-medium backdrop-blur-sm">Remove</button>
              </div>
              {themeBg !== "custom" && (
                <button onClick={() => setThemeEffect("custom")}
                  className={"absolute bottom-2 right-2 px-2 py-1 rounded-lg text-[10px] font-bold transition-all " + (themeEffect === "custom" ? "bg-white text-black" : "bg-white/20 text-white backdrop-blur-sm")}>
                  {themeEffect === "custom" ? "✓ Active" : "Use this"}
                </button>
              )}
            </div>
          ) : (
            <button onClick={() => bgFileRef.current?.click()} disabled={uploadingBg}
              className="w-full py-4 flex flex-col items-center gap-1.5 text-zinc-500 hover:text-zinc-400 transition-colors">
              {uploadingBg ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
              <span className="text-xs">{uploadingBg ? "Uploading..." : "Upload custom background"}</span>
              <span className="text-[10px] text-zinc-600">JPG, PNG, WebP — max 5MB</span>
            </button>
          )}
          <input ref={bgFileRef} type="file" accept="image/*" className="hidden" onChange={handleBgUpload} />
        </div>
      </div>

      {/* Animated Effects */}
      <div>
        <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Background Effect</p>
        <p className="text-xs text-zinc-500 mb-3">Animated layer on top of your background.</p>
        <div className="grid grid-cols-3 gap-2">
          {EFFECTS.map(fx => (
            <button key={fx.id} onClick={() => setThemeEffect(fx.id)}
              className={"relative rounded-xl border-2 p-2.5 text-left transition-all " + (themeEffect === fx.id ? "border-white/40 bg-white/5" : "border-white/8 hover:border-white/20")}
              style={{ borderColor: themeEffect === fx.id ? themeColor : undefined }}>
              <p className="text-xs font-bold text-white">{fx.label}</p>
              <p className="text-[10px] text-zinc-500 mt-0.5">{fx.desc}</p>
              {themeEffect === fx.id && (
                <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: themeColor }}>
                  <Check className="w-2 h-2 text-black" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Typography */}
      <div>
        <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Typography</p>
        <p className="text-xs text-zinc-500 mb-3">How text feels on your space.</p>
        <div className="grid grid-cols-3 gap-2">
          {FONTS.map(f => (
            <button key={f.id} onClick={() => setThemeFont(f.id)}
              className={"relative rounded-xl border-2 p-3 text-left transition-all " + (themeFont === f.id ? "border-white/40 bg-white/5" : "border-white/8 hover:border-white/20")}
              style={{ borderColor: themeFont === f.id ? themeColor : undefined }}>
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

      {/* Card Style */}
      <div>
        <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Card Style</p>
        <p className="text-xs text-zinc-500 mb-3">How your Q&A card looks.</p>
        <div className="grid grid-cols-3 gap-2">
          {CARD_STYLES.map(s => (
            <button key={s.id} onClick={() => setThemeCardStyle(s.id)}
              className={"relative rounded-xl border-2 p-3 text-left transition-all " + (themeCardStyle === s.id ? "border-white/40 bg-white/5" : "border-white/8 hover:border-white/20")}
              style={{ borderColor: themeCardStyle === s.id ? themeColor : undefined }}>
              <div className={"w-full h-6 rounded-lg mb-2 " + (s.id === "glass" ? "bg-white/10 border border-white/20 backdrop-blur-sm" : s.id === "solid" ? "bg-zinc-800 border border-zinc-700" : "border border-dashed border-white/10")} />
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

      {/* Social Links */}
      <div>
        <p className="text-xs font-bold text-white uppercase tracking-widest mb-1">Social Links</p>
        <p className="text-xs text-zinc-500 mb-3">Show up on your space page.</p>
        <div className="space-y-2">
          {([
            { Icon: XIcon, value: twitter, set: setTwitter, placeholder: "@username", label: "X" },
            { Icon: GithubIcon, value: github, set: setGithub, placeholder: "username", label: "GitHub" },
            { Icon: LinkedinIcon, value: linkedin, set: setLinkedin, placeholder: "username", label: "LinkedIn" },
            { Icon: Globe, value: website, set: setWebsite, placeholder: "https://...", label: "Website" },
            { Icon: Phone, value: whatsapp, set: setWhatsapp, placeholder: "+234...", label: "WhatsApp" },
          ] as const).map(({ Icon, value, set, placeholder, label }) => (
            <div key={label} className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/8 flex items-center justify-center shrink-0">
                <Icon className="w-3.5 h-3.5 text-zinc-500" />
              </div>
              <input type="text" value={value} onChange={e => (set as (v: string) => void)(e.target.value)} placeholder={placeholder}
                className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/8 text-white text-xs focus:outline-none focus:border-white/20 placeholder:text-zinc-600 transition-colors" />
            </div>
          ))}
        </div>
      </div>

      {/* Save */}
      <button onClick={handleSave} disabled={saving}
        className="w-full py-3 rounded-xl text-black text-sm font-black flex items-center justify-center gap-2 transition-all disabled:opacity-50 hover:opacity-90"
        style={{ backgroundColor: themeColor }}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <><Check className="w-4 h-4" /> Saved!</> : <><Save className="w-4 h-4" /> Save Appearance</>}
      </button>

    </div>
  );
}
