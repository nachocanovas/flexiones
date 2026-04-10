import { useState, useEffect, useRef } from "react";

const DAY_OF_YEAR = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const TODAY = DAY_OF_YEAR();
const NOW = new Date();
const YEAR = NOW.getFullYear();
const TOTAL_ALL = 365 * 366 / 2;
const START_DAY = 100;

const EXERCISES = [
  { name: "Flexiones", short: "FLEX", color1: "#e8ff47", color2: "rgba(232,255,71,0.06)", border: "rgba(232,255,71,0.3)", timerColor: "#e8ff47",
    glow: "conic-gradient(from 200deg,#e8ff47,#47ffb8,#e8ff47 60%,transparent 60%)",
    warmup: [
      { icon: "🙆", title: "Rotación de hombros", desc: "10 círculos hacia delante y 10 hacia atrás. Activa el manguito rotador." },
      { icon: "🤸", title: "Apertura de pecho", desc: "Entrelaza los dedos detrás, saca pecho y mantén 20 segundos. Abre la musculatura pectoral." },
      { icon: "👐", title: "Muñecas y antebrazos", desc: "Estira cada muñeca 15 segundos. Esencial para proteger articulaciones en la bajada." },
      { icon: "🏋️", title: "Flexiones lentas x5", desc: "5 repeticiones muy lentas (3 seg bajada, 3 seg subida). Activan el movimiento sin cargar." },
    ]
  },
  { name: "Sentadillas", short: "SENT", color1: "#ff8c47", color2: "rgba(255,140,71,0.06)", border: "rgba(255,140,71,0.3)", timerColor: "#ff8c47",
    glow: "conic-gradient(from 200deg,#ff8c47,#ffb847,#ff8c47 60%,transparent 60%)",
    warmup: [
      { icon: "🦵", title: "Rotación de cadera", desc: "10 círculos con cada cadera. Activa la articulación coxofemoral." },
      { icon: "🧘", title: "Movilidad de tobillo", desc: "Apoya la punta del pie en la pared, empuja la rodilla hacia ella 10 veces por lado." },
      { icon: "🔥", title: "Sentadilla asistida", desc: "Agárrate a algo y baja lentamente 5 veces. Activa cuádriceps y glúteos progresivamente." },
      { icon: "🏃", title: "Zancadas dinámicas", desc: "4 pasos de zancada por pierna. Activan los flexores de cadera y mejoran el rango." },
    ]
  },
  { name: "Abdominales", short: "ABS", color1: "#b847ff", color2: "rgba(184,71,255,0.06)", border: "rgba(184,71,255,0.3)", timerColor: "#b847ff",
    glow: "conic-gradient(from 200deg,#b847ff,#ff47e8,#b847ff 60%,transparent 60%)",
    warmup: [
      { icon: "🌀", title: "Respiración diafragmática", desc: "3 respiraciones profundas activando el core. Inhala inflando el vientre, exhala vaciándolo todo." },
      { icon: "🐱", title: "Gato-vaca x10", desc: "En cuadrupedia, arquea y redondea la espalda lentamente. Moviliza toda la columna lumbar." },
      { icon: "🦋", title: "Rodillas al pecho", desc: "Tumbado, lleva ambas rodillas al pecho y mantén 20 segundos. Activa la zona lumbar." },
      { icon: "⚡", title: "Plancha 20 seg", desc: "Mantén posición de plancha 20 segundos activando el core. Calentamiento perfecto para el trabajo abdominal." },
    ]
  },
];

const MILESTONES = [
  { reps: 1000,  label: "1K Reps",    icon: "🥉" },
  { reps: 5000,  label: "5K Reps",    icon: "🥈" },
  { reps: 10000, label: "10K Reps",   icon: "🥇" },
  { reps: 25000, label: "25K Reps",   icon: "🏆" },
  { reps: 50000, label: "50K Reps",   icon: "🔥" },
  { reps: 66795, label: "¡Reto 365!", icon: "👑" },
];

const getExerciseIdx = (day) => {
  if (day < START_DAY) return 0;
  const o = day - START_DAY;
  if (o % 2 === 0) return 0;
  return (Math.floor(o / 2) % 2) === 0 ? 1 : 2;
};
const getExercise = (day) => EXERCISES[getExerciseIdx(day)];
const getTotalDone = (d) => d * (d + 1) / 2;
const getTotalRemaining = (d) => TOTAL_ALL - getTotalDone(d);

const getMilestoneDay = (reps) => { for (let d = 1; d <= 365; d++) { if (getTotalDone(d) >= reps) return d; } return null; };
const getDayDate = (day) => new Date(YEAR, 0, day).toLocaleDateString("es-ES", { day: "numeric", month: "short" });

const getExerciseStats = (upToDay) => {
  const doneReps = [0, 0, 0], totalReps = [0, 0, 0], counts = [0, 0, 0];
  for (let d = 1; d <= 365; d++) {
    const i = getExerciseIdx(d);
    totalReps[i] += d;
    if (d <= upToDay) { doneReps[i] += d; counts[i]++; }
  }
  return { doneReps, totalReps, remainingReps: totalReps.map((t, i) => t - doneReps[i]), counts };
};

const getSeries = (total, count) => {
  const ratios = { 2: [0.55, 0.45], 3: [0.40, 0.33, 0.27], 4: [0.32, 0.27, 0.23, 0.18], 5: [0.28, 0.23, 0.20, 0.16, 0.13], 6: [0.24, 0.20, 0.17, 0.14, 0.13, 0.12] };
  const r = ratios[count] || ratios[3];
  const arr = r.map((x, i) => i < r.length - 1 ? Math.round(total * x) : 0);
  arr[arr.length - 1] = total - arr.slice(0, -1).reduce((a, b) => a + b, 0);
  return arr;
};

const getMonthDayRange = (month, year) => {
  const ys = new Date(year, 0, 0);
  const toDoy = (d) => Math.floor((d - ys + (ys.getTimezoneOffset() - d.getTimezoneOffset()) * 60000) / 86400000);
  return [toDoy(new Date(year, month, 1)), toDoy(new Date(year, month + 1, 0))];
};
const getPushupsInRange = (from, to) => getTotalDone(Math.max(0, to)) - getTotalDone(Math.max(0, from - 1));

const MOTIVATIONAL = [
  "Cada rep cuenta. Cada día importa.",
  "El dolor de hoy es la fuerza de mañana.",
  "No pares cuando estés cansado. Para cuando hayas terminado.",
  "Tu único competidor eres tú de ayer.",
  "La constancia supera al talento.",
  "Un día más. Una rep más. Siempre adelante.",
];
const MONTH_NAMES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

const REST_SECONDS = 180;

function WarmupModal({ exerciseIdx, onClose }) {
  const ex = EXERCISES[exerciseIdx];
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)" }}>
      <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 26, padding: "30px 24px", width: 320, maxHeight: "85vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, color: "#555", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 2 }}>Calentamiento</p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: ex.color1, lineHeight: 1 }}>{ex.name}</p>
          </div>
          <span style={{ fontSize: 28 }}>{["💪","🦵","🔥"][exerciseIdx]}</span>
        </div>
        {ex.warmup.map((w, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "10px 0", borderBottom: i < ex.warmup.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
            <span style={{ fontSize: 22, flexShrink: 0 }}>{w.icon}</span>
            <div>
              <p style={{ fontSize: 13, fontWeight: 500, color: "#f0ede8", marginBottom: 3 }}>{w.title}</p>
              <p style={{ fontSize: 12, color: "#666", lineHeight: 1.5 }}>{w.desc}</p>
            </div>
          </div>
        ))}
        <p style={{ fontSize: 11, color: "#555", marginTop: 14, textAlign: "center" }}>2-3 min en total antes de empezar</p>
        <button onClick={onClose} style={{ marginTop: 16, width: "100%", padding: 13, border: "none", borderRadius: 11, fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: ".1em", cursor: "pointer", background: `linear-gradient(135deg,${ex.color1},${ex.color1}cc)`, color: exerciseIdx === 0 ? "#0a0a0f" : "#f0ede8" }}>
          ¡LISTO, A ENTRENAR!
        </button>
      </div>
    </div>
  );
}

function TimerModal({ color, onClose }) {
  const [seconds, setSeconds] = useState(REST_SECONDS);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running && seconds > 0) {
      intervalRef.current = setInterval(() => setSeconds(s => s - 1), 1000);
    } else {
      clearInterval(intervalRef.current);
      if (seconds === 0) setRunning(false);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, seconds]);

  const toggle = () => { if (seconds === 0) { setSeconds(REST_SECONDS); return; } setRunning(r => !r); };
  const reset = () => { setRunning(false); setSeconds(REST_SECONDS); };
  const done = seconds === 0;
  const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
  const secs = String(seconds % 60).padStart(2, "0");
  const r = 50, circ = 2 * Math.PI * r;
  const offset = circ - ((REST_SECONDS - seconds) / REST_SECONDS) * circ;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.88)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(6px)" }}>
      <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 26, padding: "32px 26px", width: 280, textAlign: "center" }}>
        <p style={{ fontSize: 11, color: "#555", letterSpacing: ".2em", textTransform: "uppercase", marginBottom: 22 }}>Descanso entre series</p>
        <div style={{ position: "relative", width: 120, height: 120, margin: "0 auto 22px" }}>
          <svg width="120" height="120" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="60" cy="60" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
            <circle cx="60" cy="60" r={r} fill="none" stroke={done ? "#47ffb8" : color} strokeWidth="5"
              strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {done ? <span style={{ fontSize: 32 }}>💪</span> : <>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#f0ede8", lineHeight: 1 }}>{mins}:{secs}</span>
              <span style={{ fontSize: 10, color: "#444", marginTop: 2 }}>restantes</span>
            </>}
          </div>
        </div>
        {done && <p style={{ fontSize: 13, color: "#47ffb8", marginBottom: 14 }}>¡A por la siguiente serie!</p>}
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={toggle} style={{ flex: 2, padding: 12, border: "none", borderRadius: 11, fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: ".1em", cursor: "pointer", background: done ? "linear-gradient(135deg,#47ffb8,#00d4a0)" : running ? "rgba(255,255,255,0.08)" : `linear-gradient(135deg,${color},${color}99)`, color: (!running && !done && color === "#e8ff47") ? "#0a0a0f" : "#f0ede8" }}>
            {done ? "REPETIR" : running ? "PAUSAR" : "INICIAR"}
          </button>
          <button onClick={reset} style={{ flex: 1, padding: 12, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 11, color: "#666", cursor: "pointer", fontSize: 12 }}>Reset</button>
        </div>
        <button onClick={onClose} style={{ marginTop: 12, background: "none", border: "none", color: "#444", fontSize: 12, cursor: "pointer" }}>Cerrar</button>
      </div>
    </div>
  );
}

function CurveChart({ todayEx }) {
  const W = 340, H = 130, pad = { t: 10, r: 12, b: 22, l: 36 };
  const iW = W - pad.l - pad.r, iH = H - pad.t - pad.b;
  const xScale = (d) => pad.l + ((d - 1) / 364) * iW;
  const yScale = (r) => pad.t + iH - (r / 365) * iH;

  let fullPath = "", donePath = "";
  for (let d = 1; d <= 365; d++) {
    const x = xScale(d), y = yScale(d);
    fullPath += d === 1 ? `M${x},${y}` : `L${x},${y}`;
    if (d <= TODAY) donePath += d === 1 ? `M${x},${y}` : `L${x},${y}`;
  }
  let fillPath = donePath + `L${xScale(TODAY)},${pad.t + iH} L${xScale(1)},${pad.t + iH} Z`;

  const yLabels = [0, 100, 200, 300, 365].map(r =>
    `<text key="${r}" x="${pad.l - 5}" y="${yScale(r) + 4}" textAnchor="end" fontSize="9" fill="#444">${r}</text>`
  );
  const monthTicks = [0, 2, 4, 6, 8, 10].map(m => {
    const [ms] = getMonthDayRange(m, YEAR);
    return <text key={m} x={xScale(Math.min(ms, 365))} y={H - 4} textAnchor="middle" fontSize="9" fill="#444">{MONTH_NAMES[m].slice(0, 3)}</text>;
  });

  return (
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <defs>
        <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={todayEx.color1} stopOpacity="0.25" />
          <stop offset="100%" stopColor={todayEx.color1} stopOpacity="0" />
        </linearGradient>
      </defs>
      <line x1={pad.l} y1={pad.t} x2={pad.l} y2={pad.t + iH} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      <line x1={pad.l} y1={pad.t + iH} x2={pad.l + iW} y2={pad.t + iH} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
      {[0, 100, 200, 300, 365].map(r => (
        <text key={r} x={pad.l - 5} y={yScale(r) + 4} textAnchor="end" fontSize="9" fill="#444">{r}</text>
      ))}
      {monthTicks}
      <path d={fillPath} fill="url(#fillGrad)" />
      <path d={fullPath} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1.5" />
      <path d={donePath} fill="none" stroke={todayEx.color1} strokeWidth="2" />
      {MILESTONES.map((m) => {
        const d = getMilestoneDay(m.reps);
        if (!d) return null;
        const unlocked = d <= TODAY;
        return <circle key={m.reps} cx={xScale(d)} cy={yScale(d)} r="3" fill={unlocked ? "#47ffb8" : "rgba(255,255,255,0.15)"} />;
      })}
      <circle cx={xScale(TODAY)} cy={yScale(TODAY)} r="5" fill={todayEx.color1} />
      <circle cx={xScale(TODAY)} cy={yScale(TODAY)} r="9" fill={todayEx.color1} opacity="0.2" />
      <line x1={xScale(TODAY)} y1={yScale(TODAY)} x2={xScale(TODAY)} y2={pad.t + iH} stroke={todayEx.color1} strokeWidth="1" strokeDasharray="3,2" opacity="0.4" />
      <text x={xScale(TODAY) + 6} y={yScale(TODAY) - 5} fontSize="9" fill={todayEx.color1}>Día {TODAY}</text>
    </svg>
  );
}

export default function App() {
  const [currentDay, setCurrentDay] = useState(TODAY);
  const [activeTab, setActiveTab] = useState("hoy");
  const [seriesCount, setSeriesCount] = useState(3);
  const [showTimer, setShowTimer] = useState(false);
  const [showWarmup, setShowWarmup] = useState(false);

  const todayEx = getExercise(TODAY);
  const viewEx = getExercise(currentDay);
  const series = getSeries(currentDay, seriesCount);
  const totalDone = getTotalDone(TODAY);
  const progressPct = (totalDone / TOTAL_ALL * 100).toFixed(1);
  const quote = MOTIVATIONAL[TODAY % MOTIVATIONAL.length];
  const exStats = getExerciseStats(TODAY);
  const unlockedMilestones = MILESTONES.filter(m => totalDone >= m.reps);
  const nextMilestone = MILESTONES.find(m => totalDone < m.reps);

  const currentMonth = NOW.getMonth();
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const [cmS, cmE] = getMonthDayRange(currentMonth, YEAR);
  const cmdone = getPushupsInRange(cmS, Math.min(cmE, TODAY));
  const [pmS, pmE] = getMonthDayRange(prevMonth, currentMonth === 0 ? YEAR - 1 : YEAR);
  const pmtotal = getPushupsInRange(pmS, pmE);
  const mdiff = cmdone - pmtotal;
  const mdiffpct = pmtotal > 0 ? Math.round(mdiff / pmtotal * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#f0ede8", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Bebas+Neue&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .tab-btn{background:none;border:none;color:#555;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;padding:7px 11px;border-radius:20px;transition:all .2s;}
        .series-card{border-radius:14px;padding:12px;flex:1;text-align:center;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);}
        .stat-card{background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.07);border-radius:16px;padding:16px;}
        .sc-btn{background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);color:#f0ede8;width:32px;height:32px;border-radius:8px;cursor:pointer;font-size:17px;}
        .ex-row{display:flex;align-items:center;padding:11px 0;border-bottom:1px solid rgba(255,255,255,0.05);}
        .ex-row:last-child{border-bottom:none;}
        @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .slide-up{animation:slideUp .3s ease forwards;}
        @keyframes badgePop{0%{transform:scale(0.5);opacity:0}70%{transform:scale(1.1)}100%{transform:scale(1);opacity:1}}
        .badge-pop{animation:badgePop .5s ease forwards;}
        ::-webkit-scrollbar{width:0;}
      `}</style>

      {showTimer && <TimerModal color={todayEx.timerColor} onClose={() => setShowTimer(false)} />}
      {showWarmup && <WarmupModal exerciseIdx={getExerciseIdx(TODAY)} onClose={() => setShowWarmup(false)} />}

      <div style={{ maxWidth: 430, margin: "0 auto", padding: "0 0 40px" }}>

        {/* Header */}
        <div style={{ padding: "26px 18px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 5 }}>
            <div>
              <p style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#555", marginBottom: 2 }}>Reto 365</p>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: ".05em", lineHeight: 1, color: "#f0ede8" }}>RETO 365</h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, color: "#555", letterSpacing: ".1em", textTransform: "uppercase" }}>Racha</p>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: todayEx.color1 }}>{TODAY}<span style={{ fontSize: 14, marginLeft: 2 }}>🔥</span></p>
            </div>
          </div>
          <p style={{ fontSize: 12, color: "#444", fontStyle: "italic" }}>"{quote}"</p>
        </div>

        {/* Hero ring */}
        <div style={{ padding: "18px 18px 12px", display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ background: todayEx.glow, borderRadius: "50%", padding: 3, width: 112, height: 112, flexShrink: 0 }}>
            <div style={{ background: "#0a0a0f", borderRadius: "50%", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, color: todayEx.color1, lineHeight: 1 }}>{TODAY}</span>
              <span style={{ fontSize: 10, color: "#666", letterSpacing: ".1em", textTransform: "uppercase" }}>{todayEx.short} hoy</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
              <span style={{ fontSize: 10, color: "#555", letterSpacing: ".1em", textTransform: "uppercase" }}>Día del año</span>
              <span style={{ fontSize: 10, padding: "2px 7px", borderRadius: 10, background: todayEx.color2, border: `1px solid ${todayEx.border}`, color: todayEx.color1 }}>{todayEx.name}</span>
            </div>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, color: "#f0ede8", lineHeight: 1 }}>{TODAY}<span style={{ fontSize: 16, color: "#444" }}>/365</span></p>
            <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 100, height: 5, overflow: "hidden", marginTop: 7 }}>
              <div style={{ height: "100%", borderRadius: 100, width: `${(TODAY / 365 * 100)}%`, background: todayEx.color1 }} />
            </div>
            <p style={{ fontSize: 10, color: "#444", marginTop: 4 }}>{progressPct}% completado</p>
          </div>
        </div>

        {/* 3-day strip */}
        <div style={{ padding: "0 14px 12px" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "8px 12px", display: "flex", gap: 6 }}>
            {[TODAY - 1, TODAY, TODAY + 1].filter(d => d >= 1 && d <= 365).map(d => {
              const e = getExercise(d), isToday = d === TODAY;
              return (
                <div key={d} style={{ flex: 1, textAlign: "center", padding: "7px 3px", borderRadius: 9, background: isToday ? e.color2 : "transparent", border: `1px solid ${isToday ? e.border : "transparent"}` }}>
                  <p style={{ fontSize: 9, color: isToday ? e.color1 : "#444", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 1 }}>{d === TODAY ? "HOY" : d === TODAY - 1 ? "AYER" : "MAÑANA"}</p>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: isToday ? e.color1 : "#555", lineHeight: 1 }}>{d}</p>
                  <p style={{ fontSize: 9, color: isToday ? e.color1 : "#444", marginTop: 1 }}>{e.name}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Milestones */}
        {unlockedMilestones.length > 0 && (
          <div style={{ padding: "0 14px 12px" }}>
            <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 2 }}>
              {unlockedMilestones.map((m, idx) => {
                const d = getMilestoneDay(m.reps);
                return (
                  <div key={m.reps} className="badge-pop" style={{ animationDelay: `${idx * 0.1}s`, flexShrink: 0, background: "rgba(71,255,184,0.07)", border: "1px solid rgba(71,255,184,0.25)", borderRadius: 12, padding: "8px 12px", textAlign: "center", minWidth: 72 }}>
                    <p style={{ fontSize: 18, marginBottom: 2 }}>{m.icon}</p>
                    <p style={{ fontSize: 11, fontWeight: 500, color: "#47ffb8" }}>{m.label}</p>
                    <p style={{ fontSize: 9, color: "#444", marginTop: 1 }}>{getDayDate(d)}</p>
                  </div>
                );
              })}
              {nextMilestone && (
                <div style={{ flexShrink: 0, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "8px 12px", textAlign: "center", minWidth: 72, opacity: 0.5 }}>
                  <p style={{ fontSize: 18, marginBottom: 2 }}>🔒</p>
                  <p style={{ fontSize: 11, color: "#555" }}>{nextMilestone.label}</p>
                  <p style={{ fontSize: 9, color: "#333", marginTop: 1 }}>{(nextMilestone.reps - totalDone).toLocaleString()} reps</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, padding: "0 14px 12px" }}>
          {[["hoy", "Hoy"], ["stats", "Stats"], ["historial", "Historial"]].map(([k, l]) => (
            <button key={k} className="tab-btn" onClick={() => setActiveTab(k)} style={activeTab === k ? { background: todayEx.color1, color: "#0a0a0f" } : {}}>{l}</button>
          ))}
        </div>

        <div className="slide-up">

          {/* TAB HOY */}
          {activeTab === "hoy" && (
            <div style={{ padding: "0 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                <p style={{ fontSize: 11, color: "#555", letterSpacing: ".12em", textTransform: "uppercase" }}>Series recomendadas</p>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                  <span style={{ fontSize: 11, color: "#555" }}>Series:</span>
                  <button className="sc-btn" onClick={() => setSeriesCount(c => Math.max(2, c - 1))}>−</button>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: todayEx.color1, minWidth: 18, textAlign: "center" }}>{seriesCount}</span>
                  <button className="sc-btn" onClick={() => setSeriesCount(c => Math.min(6, c + 1))}>+</button>
                </div>
              </div>
              <div style={{ display: "flex", gap: 5, marginBottom: 12, flexWrap: "wrap" }}>
                {series.map((s, i) => (
                  <div key={i} className="series-card" style={i === 0 ? { borderColor: viewEx.border, background: viewEx.color2 } : i === 1 ? { borderColor: "rgba(71,255,184,0.2)", background: "rgba(71,255,184,0.04)" } : {}}>
                    <p style={{ fontSize: 9, color: i === 0 ? viewEx.color1 : i === 1 ? "#47ffb8" : "#444", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 3 }}>Serie {i + 1}</p>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: seriesCount > 4 ? 28 : 36, color: i === 0 ? viewEx.color1 : i === 1 ? "#47ffb8" : "#888", lineHeight: 1 }}>{s}</p>
                    <p style={{ fontSize: 9, color: "#444", marginTop: 2 }}>reps</p>
                  </div>
                ))}
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 11, padding: "9px 13px", marginBottom: 10, border: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
                <div><span style={{ fontSize: 11, color: "#555" }}>TOTAL </span><span style={{ fontSize: 11, color: "#47ffb8" }}>{series.join("+")}={series.reduce((a, b) => a + b, 0)}</span></div>
                <div><span style={{ fontSize: 11, color: "#555" }}>DESCANSO </span><span style={{ fontSize: 11, color: todayEx.color1 }}>3 min</span></div>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <button onClick={() => setShowWarmup(true)} style={{ flex: 1, padding: 13, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: ".08em", color: "#f0ede8", cursor: "pointer" }}>🧘 CALENTAR</button>
                <button onClick={() => setShowTimer(true)} style={{ flex: 1, padding: 13, background: viewEx.color2, border: `1px solid ${viewEx.border}`, borderRadius: 12, fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: ".08em", color: viewEx.color1, cursor: "pointer" }}>⏱ DESCANSO</button>
              </div>
              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 13, padding: 13, border: "1px solid rgba(255,255,255,0.07)" }}>
                <p style={{ fontSize: 11, color: "#555", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 9 }}>Ver otro día</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <button onClick={() => setCurrentDay(d => Math.max(1, d - 1))} style={{ background: "rgba(255,255,255,0.07)", border: "none", color: "#f0ede8", width: 32, height: 32, borderRadius: 7, cursor: "pointer", fontSize: 15 }}>‹</button>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "#f0ede8" }}>Día {currentDay}</span>
                    <span style={{ fontSize: 10, color: "#555", display: "block" }}>{currentDay} {getExercise(currentDay).name} · {getSeries(currentDay, seriesCount).join("+")}</span>
                  </div>
                  <button onClick={() => setCurrentDay(d => Math.min(365, d + 1))} style={{ background: "rgba(255,255,255,0.07)", border: "none", color: "#f0ede8", width: 32, height: 32, borderRadius: 7, cursor: "pointer", fontSize: 15 }}>›</button>
                </div>
              </div>
            </div>
          )}

          {/* TAB STATS */}
          {activeTab === "stats" && (
            <div style={{ padding: "0 14px" }}>
              <p style={{ fontSize: 11, color: "#555", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 9 }}>Resumen global</p>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 9, marginBottom: 12 }}>
                {[
                  { label: "Reps hechas", val: totalDone.toLocaleString(), color: todayEx.color1, sub: "todas las disciplinas" },
                  { label: "Reps restantes", val: getTotalRemaining(TODAY).toLocaleString(), color: "#47ffb8", sub: "hasta el 31 dic" },
                  { label: "Total año", val: TOTAL_ALL.toLocaleString(), color: "#f0ede8", sub: "todas las disciplinas" },
                  { label: "Media diaria", val: Math.round(totalDone / TODAY), color: "#ff8c47", sub: "hasta hoy" },
                ].map((s, i) => (
                  <div key={i} className="stat-card">
                    <p style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 5 }}>{s.label}</p>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: s.color, lineHeight: 1 }}>{s.val}</p>
                    <p style={{ fontSize: 10, color: "#444", marginTop: 2 }}>{s.sub}</p>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 11, color: "#555", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 9 }}>Por ejercicio</p>
              <div className="stat-card" style={{ marginBottom: 12, padding: "6px 14px" }}>
                {EXERCISES.map((e, i) => {
                  const done = exStats.doneReps[i], total = exStats.totalReps[i], pct = total > 0 ? Math.round(done / total * 100) : 0;
                  return (
                    <div key={i} className="ex-row">
                      <div style={{ width: 9, height: 9, borderRadius: 2, background: e.color1, flexShrink: 0, marginRight: 11 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 500, color: "#f0ede8" }}>{e.name}</span>
                          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, color: e.color1 }}>{done.toLocaleString()}<span style={{ fontSize: 10, color: "#444" }}> / {total.toLocaleString()}</span></span>
                        </div>
                        <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden", marginBottom: 3 }}>
                          <div style={{ height: "100%", width: `${pct}%`, background: e.color1, borderRadius: 100 }} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 9, color: "#444" }}>{exStats.counts[i]} días · quedan {exStats.remainingReps[i].toLocaleString()}</span>
                          <span style={{ fontSize: 9, color: e.color1 }}>{pct}%</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <p style={{ fontSize: 11, color: "#555", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 9 }}>Curva anual de reps</p>
              <div className="stat-card" style={{ marginBottom: 12 }}>
                <CurveChart todayEx={todayEx} />
                <div style={{ display: "flex", gap: 12, marginTop: 8, justifyContent: "center" }}>
                  <span style={{ fontSize: 10, color: todayEx.color1, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 16, height: 2, background: todayEx.color1, display: "inline-block", borderRadius: 2 }} />Recorrido hecho</span>
                  <span style={{ fontSize: 10, color: "#444", display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 16, height: 2, background: "rgba(255,255,255,0.15)", display: "inline-block", borderRadius: 2 }} />Resto del año</span>
                  <span style={{ fontSize: 10, color: "#47ffb8", display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 6, height: 6, background: "#47ffb8", borderRadius: "50%", display: "inline-block" }} />Hitos</span>
                </div>
              </div>

              <div className="stat-card" style={{ marginBottom: 12, background: "rgba(71,255,184,0.03)", borderColor: "rgba(71,255,184,0.15)" }}>
                <p style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>Proyección fin de año</p>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
                  <div><p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: "#47ffb8", lineHeight: 1 }}>{TOTAL_ALL.toLocaleString()}</p><p style={{ fontSize: 10, color: "#444", marginTop: 2 }}>reps el 31 dic</p></div>
                  <div style={{ textAlign: "right" }}><p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#f0ede8" }}>{365 - TODAY} días</p><p style={{ fontSize: 10, color: "#444" }}>restantes</p></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <span style={{ fontSize: 10, color: "#555", whiteSpace: "nowrap" }}>1 ene</span>
                  <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
                    <div style={{ width: `${(TODAY / 365 * 100)}%`, height: "100%", background: `linear-gradient(90deg,${todayEx.color1},#47ffb8)`, borderRadius: 100 }} />
                  </div>
                  <span style={{ fontSize: 10, color: "#47ffb8", whiteSpace: "nowrap" }}>31 dic</span>
                </div>
                <p style={{ fontSize: 11, color: "#47ffb8", marginTop: 7, textAlign: "center" }}>Vas al 100% del reto ✓</p>
              </div>

              <div className="stat-card" style={{ marginBottom: 12 }}>
                <p style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 10 }}>Comparativa mensual</p>
                <div style={{ display: "flex", gap: 7, marginBottom: 9 }}>
                  <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 11, border: "1px solid rgba(255,255,255,0.06)" }}>
                    <p style={{ fontSize: 10, color: "#444", marginBottom: 3, textTransform: "uppercase" }}>{MONTH_NAMES[prevMonth]}</p>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: "#666", lineHeight: 1 }}>{pmtotal.toLocaleString()}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 22, fontSize: 10, color: "#333", fontWeight: 600 }}>VS</div>
                  <div style={{ flex: 1, background: todayEx.color2, borderRadius: 10, padding: 11, border: `1px solid ${todayEx.border}` }}>
                    <p style={{ fontSize: 10, color: todayEx.color1, marginBottom: 3, textTransform: "uppercase" }}>{MONTH_NAMES[currentMonth]}</p>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: todayEx.color1, lineHeight: 1 }}>{cmdone.toLocaleString()}</p>
                  </div>
                </div>
                <div style={{ height: 5, borderRadius: 100, overflow: "hidden", display: "flex", gap: 2, marginBottom: 7 }}>
                  <div style={{ flex: pmtotal, background: "rgba(255,255,255,0.15)", borderRadius: "100px 0 0 100px" }} />
                  <div style={{ flex: cmdone, background: todayEx.color1, borderRadius: "0 100px 100px 0" }} />
                </div>
                <p style={{ fontSize: 11, color: cmdone >= pmtotal ? "#47ffb8" : "#ff8c47", textAlign: "center" }}>
                  {cmdone >= pmtotal ? `↑ +${(cmdone - pmtotal).toLocaleString()} más que ${MONTH_NAMES[prevMonth].toLowerCase()} (${mdiffpct > 0 ? "+" : ""}${mdiffpct}%)` : `Llevas ${Math.min(TODAY - cmS + 1, cmE - cmS + 1)} de ${cmE - cmS + 1} días de ${MONTH_NAMES[currentMonth].toLowerCase()}`}
                </p>
              </div>

              <div className="stat-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 9 }}>
                  <p style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: ".1em" }}>Mapa del año</p>
                  <div style={{ display: "flex", gap: 7 }}>
                    {EXERCISES.map(e => <span key={e.name} style={{ fontSize: 10, color: e.color1, display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 7, height: 7, borderRadius: 1, background: e.color1, display: "inline-block" }} />{e.short}</span>)}
                  </div>
                </div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {Array.from({ length: 365 }, (_, i) => i + 1).map(d => {
                    const e = getExercise(d);
                    return <div key={d} style={{ width: 7, height: 7, borderRadius: 1, background: d <= TODAY ? e.color1 : "rgba(255,255,255,0.05)", display: "inline-block", margin: 1 }} />;
                  })}
                </div>
                <p style={{ fontSize: 10, color: "#444", marginTop: 8, textAlign: "center" }}>{TODAY} días completados · {365 - TODAY} restantes</p>
              </div>
            </div>
          )}

          {/* TAB HISTORIAL */}
          {activeTab === "historial" && (
            <div style={{ padding: "0 14px" }}>
              <p style={{ fontSize: 11, color: "#555", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 12 }}>Últimos 14 días</p>
              {Array.from({ length: Math.min(14, TODAY) }, (_, i) => {
                const d = TODAY - i, e = getExercise(d), s = getSeries(d, seriesCount);
                return (
                  <div key={d} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", gap: 11 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 2, background: e.color1, flexShrink: 0 }} />
                    <div style={{ width: 28, textAlign: "center" }}>
                      <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 19, color: e.color1, lineHeight: 1 }}>{d}</p>
                      <p style={{ fontSize: 9, color: "#444" }}>día</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, color: "#f0ede8" }}>{d} {e.name}</p>
                      <p style={{ fontSize: 10, color: "#444", marginTop: 1 }}>{s.join("+")} reps</p>
                    </div>
                    <div style={{ width: 23, height: 23, borderRadius: "50%", background: e.color2, border: `1px solid ${e.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: e.color1 }}>✓</div>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
