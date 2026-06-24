"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Check, Loader2, Save, Globe } from "lucide-react";
import { FaXTwitter as XIcon, FaGithub as GithubIcon, FaLinkedin as LinkedinIcon } from "react-icons/fa6";

const THEME_COLORS = [
  { name: "Purple", value: "#a855f7" },
  { name: "Blue", value: "#3b82f6" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Green", value: "#22c55e" },
  { name: "Orange", value: "#f97316" },
  { name: "Pink", value: "#ec4899" },
  { name: "Red", value: "#ef4444" },
  { name: "Yellow", value: "#eab308" },
  { name: "White", value: "#ffffff" },
];

const BACKGROUNDS = [
  { id: "dark", label: "Void", preview: "#0f0c1a" },
  { id: "midnight", label: "Midnight", preview: "linear-gradient(135deg,#0a0f1e,#0d0b1a)" },
  { id: "aurora", label: "Aurora", preview: "linear-gradient(135deg,#0d0b1a,#1a0d2e)" },
  { id: "dusk", label: "Dusk", preview: "linear-gradient(135deg,#12081e,#1a0e10)" },
  { id: "galaxy", label: "Galaxy", preview: "linear-gradient(135deg,#080612,#0d0b1a)" },
  { id: "ocean", label: "Ocean", preview: "linear-gradient(135deg,#071018,#0a1628)" },
  { id: "dawn", label: "Dawn 🌅", preview: "linear-gradient(135deg,#1a0e2e,#2e1a0e)" },
  { id: "fog", label: "Fog ☁️", preview: "linear-gradient(135deg,#e8e4f0,#f0eef8)" },
  { id: "sand", label: "Sand 🏜️", preview: "linear-gradient(135deg,#f5efe6,#ede8df)" },
  { id: "parchment", label: "Parchment 📜", preview: "linear-gradient(135deg,#faf6f0,#f5f0e8)" },
];

const FLOAT_EFFECTS = [
  { id: "none", label: "None", preview: "✦" },
  { id: "particles", label: "Particles", preview: "✦" },
  { id: "bubbles", label: "Bubbles", preview: "○" },
  { id: "net", label: "Net", preview: "⊞" },
  { id: "matrix", label: "Matrix", preview: "01" },
];

const FONTS = [
  { id: "inter", label: "Inter", style: "font-sans", preview: "Modern & Clean" },
  { id: "mono", label: "Mono", style: "font-mono", preview: "Technical & Sharp" },
  { id: "serif", label: "Serif", style: "font-serif", preview: "Classic & Elegant" },
];

const CARD_STYLES = [
  { id: "glass", label: "Glass", desc: "Frosted glass effect", preview: "bg-white/10 backdrop-blur border border-white/20" },
  { id: "solid", label: "Solid", desc: "Clean solid borders", preview: "bg-zinc-800 border border-zinc-700" },
  { id: "minimal", label: "Minimal", desc: "Borderless & airy", preview: "" },
];

export function AppearanceTab() {
  const profile = useQuery(api.profiles.current);
  const updateProfile = useMutation(api.profiles.update);

  const [themeColor, setThemeColor] = useState("#a855f7");
  const [themeBg, setThemeBg] = useState("dark");
  const [themeFont, setThemeFont] = useState("inter");
  const [themeCardStyle, setThemeCardStyle] = useState("glass");
  const [twitter, setXIcon] = useState("");
  const [github, setGithubIcon] = useState("");
  const [website, setWebsite] = useState("");
  const [linkedin, setLinkedinIcon] = useState("");
  const [themeEffect, setThemeEffect] = useState("none");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) {
      setTimeout(() => {
        setThemeColor(profile.themeColor || "#a855f7");
        setThemeBg(profile.themeBg || "dark");
        setThemeFont(profile.themeFont || "inter");
        setThemeCardStyle(profile.themeCardStyle || "glass");
        setThemeEffect(profile.themeBg && ["particles","bubbles","net","matrix"].includes(profile.themeBg) ? profile.themeBg : "none");
        if (profile.socialLinks) {
          try {
            const s = JSON.parse(profile.socialLinks);
            setXIcon(s.twitter || "");
            setGithubIcon(s.github || "");
            setWebsite(s.website || "");
            setLinkedinIcon(s.linkedin || "");
          } catch {}
        }
      }, 0);
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
        themeEffect,
        socialLinks: JSON.stringify({ twitter, github, website, linkedin }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  return (
    <div className="glass-card rounded-2xl p-8 border border-border space-y-10">

      <div>
        <h3 className="text-base font-bold text-foreground mb-1">Accent Color</h3>
        <p className="text-xs text-muted-foreground mb-4">Sets the primary color across your space.</p>
        <div className="flex flex-wrap gap-3">
          {THEME_COLORS.map(c => (
            <button
              key={c.value}
              onClick={() => setThemeColor(c.value)}
              title={c.name}
              className="relative w-9 h-9 rounded-full border-2 transition-all hover:scale-110"
              style={{
                backgroundColor: c.value,
                borderColor: themeColor === c.value ? c.value : "transparent",
                boxShadow: themeColor === c.value ? "0 0 0 3px " + c.value + "40" : "none",
              }}
            >
              {themeColor === c.value && (
                <Check className="w-4 h-4 absolute inset-0 m-auto text-white drop-shadow" />
              )}
            </button>
          ))}
          <label className="relative w-9 h-9 rounded-full border-2 border-dashed border-border flex items-center justify-center cursor-pointer hover:border-primary transition-colors overflow-hidden">
            <span className="text-xs text-muted-foreground">+</span>
            <input
              type="color"
              value={themeColor}
              onChange={e => setThemeColor(e.target.value)}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
          </label>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: themeColor }} />
          <span className="text-xs text-muted-foreground font-mono">{themeColor}</span>
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-foreground mb-1">Background</h3>
        <p className="text-xs text-muted-foreground mb-4">The canvas of your space.</p>
        <div className="grid grid-cols-2 gap-3">
          {BACKGROUNDS.map(bg => (
            <button
              key={bg.id}
              onClick={() => setThemeBg(bg.id)}
              className={"relative rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition-all hover:scale-105 " + (themeBg === bg.id ? "border-primary" : "border-border")}
            >
              <div className="w-full h-10 rounded-lg" style={{ background: bg.preview }} />
              <span className="text-xs font-medium text-foreground">{bg.label}</span>
              {themeBg === bg.id && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: themeColor }}>
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-foreground mb-1">Floating Effects</h3>
        <p className="text-xs text-muted-foreground mb-4">Animated layer that floats above your background.</p>
        <div className="grid grid-cols-5 gap-2">
          {FLOAT_EFFECTS.map(fx => (
            <button
              key={fx.id}
              onClick={() => setThemeEffect(fx.id)}
              className={"relative rounded-xl border-2 p-3 flex flex-col items-center gap-2 transition-all hover:scale-105 " + (themeEffect === fx.id ? "border-primary bg-primary/5" : "border-border")}
            >
              <span className="text-lg font-mono text-muted-foreground">{fx.preview}</span>
              <span className="text-xs font-medium text-foreground">{fx.label}</span>
              {themeEffect === fx.id && (
                <div className="absolute top-1 right-1 w-3 h-3 rounded-full flex items-center justify-center" style={{ backgroundColor: themeColor }}>
                  <Check className="w-2 h-2 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-foreground mb-1">Font Style</h3>
        <p className="text-xs text-muted-foreground mb-4">How text appears on your space.</p>
        <div className="grid grid-cols-3 gap-3">
          {FONTS.map(f => (
            <button
              key={f.id}
              onClick={() => setThemeFont(f.id)}
              className={"relative rounded-xl border-2 p-4 text-left transition-all hover:scale-105 " + (themeFont === f.id ? "border-primary bg-primary/5" : "border-border")}
            >
              <p className={"text-lg font-bold text-foreground mb-1 " + f.style}>Aa</p>
              <p className="text-xs font-medium text-foreground">{f.label}</p>
              <p className="text-xs text-muted-foreground">{f.preview}</p>
              {themeFont === f.id && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: themeColor }}>
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-foreground mb-1">Card Style</h3>
        <p className="text-xs text-muted-foreground mb-4">How your Q&A card looks.</p>
        <div className="grid grid-cols-3 gap-3">
          {CARD_STYLES.map(s => (
            <button
              key={s.id}
              onClick={() => setThemeCardStyle(s.id)}
              className={"relative rounded-xl border-2 p-4 text-left transition-all hover:scale-105 " + (themeCardStyle === s.id ? "border-primary bg-primary/5" : "border-border")}
            >
              <div className={"w-full h-8 rounded-lg mb-2 " + s.preview} />
              <p className="text-xs font-medium text-foreground">{s.label}</p>
              <p className="text-xs text-muted-foreground">{s.desc}</p>
              {themeCardStyle === s.id && (
                <div className="absolute top-2 right-2 w-4 h-4 rounded-full flex items-center justify-center" style={{ backgroundColor: themeColor }}>
                  <Check className="w-2.5 h-2.5 text-white" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-base font-bold text-foreground mb-1">Social Links</h3>
        <p className="text-xs text-muted-foreground mb-4">Show up on your space page.</p>
        <div className="space-y-3">
          {([
            { Icon: XIcon, label: "X / XIcon", value: twitter, set: setXIcon, placeholder: "@username" },
            { Icon: GithubIcon, label: "GitHub", value: github, set: setGithubIcon, placeholder: "username" },
            { Icon: LinkedinIcon, label: "LinkedIn", value: linkedin, set: setLinkedinIcon, placeholder: "username" },
            { Icon: Globe, label: "Website", value: website, set: setWebsite, placeholder: "https://yoursite.com" },
          ] as const).map(({ Icon, label, value, set, placeholder }) => (
            <div key={label} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-card border border-border flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <input
                type="text"
                value={value}
                onChange={e => (set as (v: string) => void)(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-4 py-2.5 rounded-xl bg-card border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4 border-t border-border flex items-center justify-between">
        {saved ? (
          <span className="flex items-center gap-1 text-xs text-green-500 font-medium">
            <Check className="w-3 h-3" /> Appearance saved
          </span>
        ) : <span />}
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-white text-sm font-bold hover:opacity-90 transition-all disabled:opacity-50"
          style={{ backgroundColor: themeColor }}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          Save Appearance
        </button>
      </div>
    </div>
  );
}