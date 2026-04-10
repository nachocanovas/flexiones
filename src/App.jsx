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
  {
    name: "Flexiones", short: "FLEX", color1: "#e8ff47", color2: "rgba(232,255,71,0.06)", border: "rgba(232,255,71,0.3)", timerColor: "#e8ff47",
    glow: "conic-gradient(from 200deg,#e8ff47,#47ffb8,#e8ff47 60%,transparent 60%)",
    warmup: [
      { icon: "🙆", title: "Rotación de hombros", desc: "10 círculos hacia delante y 10 hacia atrás. Activa el manguito rotador y prepara la articulación." },
      { icon: "🤸", title: "Apertura de pecho", desc: "Entrelaza los dedos detrás, saca pecho y mantén 20 segundos. Abre la musculatura pectoral." },
      { icon: "👐", title: "Muñecas y antebrazos", desc: "Estira cada muñeca 15 segundos hacia arriba y hacia abajo. Protege las articulaciones en la bajada." },
      { icon: "🏋️", title: "Flexiones lentas x5", desc: "5 repeticiones muy lentas: 3 seg bajando, 1 seg abajo, 3 seg subiendo. Sin cargar, solo activar." },
    ],
  },
  {
    name: "Sentadillas", short: "SENT", color1: "#ff8c47", color2: "rgba(255,140,71,0.06)", border: "rgba(255,140,71,0.3)", timerColor: "#ff8c47",
    glow: "conic-gradient(from 200deg,#ff8c47,#ffb847,#ff8c47 60%,transparent 60%)",
    warmup: [
      { icon: "🦵", title: "Rotación de cadera", desc: "10 círculos amplios con cada cadera. Activa la articulación coxofemoral y lubrica el movimiento." },
      { icon: "🧘", title: "Movilidad de tobillo", desc: "Apoya la punta del pie en la pared, empuja la rodilla hacia ella 10 veces por lado." },
      { icon: "🔥", title: "Sentadilla asistida x5", desc: "Agárrate a algo firme y baja lentamente 5 veces. Activa cuádriceps y glúteos de forma progresiva." },
      { icon: "🏃", title: "Zancadas dinámicas", desc: "4 pasos de zancada controlada por pierna. Activan los flexores de cadera y mejoran el rango." },
    ],
  },
  {
    name: "Abdominales", short: "ABS", color1: "#b847ff", color2: "rgba(184,71,255,0.06)", border: "rgba(184,71,255,0.3)", timerColor: "#b847ff",
    glow: "conic-gradient(from 200deg,#b847ff,#ff47e8,#b847ff 60%,transparent 60%)",
    warmup: [
      { icon: "🌀", title: "Respiración diafragmática", desc: "3 respiraciones profundas y lentas. Inhala inflando el vientre, exhala vaciándolo todo." },
      { icon: "🐱", title: "Gato-vaca x10", desc: "En cuadrupedia, arquea y redondea la espalda lentamente. Moviliza toda la columna lumbar." },
      { icon: "🦋", title: "Rodillas al pecho", desc: "Tumbado boca arriba, lleva ambas rodillas al pecho y abraza las espinillas. Mantén 20 segundos." },
      { icon: "⚡", title: "Plancha 20 seg", desc: "Posición de plancha, cuerpo recto, core activado. Mantén 20 segundos antes de empezar las series." },
    ],
  },
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
const MONTH_NAMES = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

const REST_SECONDS = 180;

// ── WARMUP WIZARD ──────────────────────────────────────────────
function WarmupModal({ exerciseIdx, onClose }) {
  const [step, setStep] = useState(0);
  const ex = EXERCISES[exerciseIdx];
  const total = ex.warmup.length;
  const w = ex.warmup[step];
  const isLast = step === total - 1;
  const pct = (step / total) * 100;

  const next = () => {
    if (!isLast) setStep(s => s + 1);
    else onClose();
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
      <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 28, padding: "36px 28px", width: 320, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ textAlign: "left" }}>
            <p style={{ fontSize: 11, color: "#555", letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 2 }}>Calentamiento</p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: ex.color1, lineHeight: 1 }}>{ex.name}</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: "#f0ede8", lineHeight: 1 }}>{step + 1}/{total}</p>
            <p style={{ fontSize: 10, color: "#555" }}>pasos</p>
          </div>
        </div>

        <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 100, height: 4, overflow: "hidden", marginBottom: 32 }}>
          <div style={{ height: "100%", width: `${isLast ? 100 : pct}%`, background: ex.color1, borderRadius: 100, transition: "width .4s ease" }} />
        </div>

        <div style={{ transition: "opacity .3s" }}>
          <div style={{ fontSize: 64, marginBottom: 20, lineHeight: 1 }}>{w.icon}</div>
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, letterSpacing: ".05em", color: "#f0ede8", marginBottom: 12, lineHeight: 1.1 }}>{w.title}</p>
          <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6, minHeight: 64 }}>{w.desc}</p>
        </div>

        <button onClick={next} style={{
          marginTop: 32, width: "100%", padding: 18, border: isLast ? "none" : `1px solid ${ex.border}`,
          borderRadius: 16, fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: ".12em", cursor: "pointer",
          background: isLast ? `linear-gradient(135deg,${ex.color1},${ex.color1}cc)` : ex.color2,
          color: isLast ? (exerciseIdx === 0 ? "#0a0a0f" : "#f0ede8") : ex.color1,
          transition: "transform .2s",
        }}>
          {isLast ? "✓ ¡LISTO, A ENTRENAR!" : "✓ OK, SIGUIENTE"}
        </button>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#444", fontSize: 12, cursor: "pointer", marginTop: 14, fontFamily: "'DM Sans', sans-serif" }}>
          Saltar calentamiento
        </button>
      </div>
    </div>
  );
}

// ── TIMER MODAL ────────────────────────────────────────────────
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
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
      <div style={{ background: "#111118", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 26, padding: "32px 26px", width: 290, textAlign: "center" }}>
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
          <button onClick={toggle} style={{
            flex: 2, padding: 13, border: "none", borderRadius: 11, fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 16, letterSpacing: ".1em", cursor: "pointer",
            background: done ? "linear-gradient(135deg,#47ffb8,#00d4a0)" : running ? "rgba(255,255,255,0.08)" : `linear-gradient(135deg,${color},${color}99)`,
            color: !running && !done && color === "#e8ff47" ? "#0a0a0f" : "#f0ede8",
          }}>
            {done ? "REPETIR" : running ? "PAUSAR" : "INICIAR"}
          </button>
          <button onClick={reset} style={{ flex: 1, padding: 13, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 11, color: "#666", cursor: "pointer", fontSize: 12 }}>Reset</button>
        </div>
        <button onClick={onClose} style={{ marginTop: 12, background: "none", border: "none", color: "#444", fontSize: 12, cursor: "pointer" }}>Cerrar</button>
      </div>
    </div>
  );
}

// ── STATS COMPONENTS ───────────────────────────────────────────
function StatsAll({ exStats, totalDone, todayEx, cmdone, pmtotal, prevMonth, currentMonth, cmS, cmE }) {
  const mdiff = cmdone - pmtotal;
  const mdiffpct = pmtotal > 0 ? Math.round(mdiff / pmtotal * 100) : 0;

  const ProjRow = ({ e, i, numerator, denominator }) => {
    const pct = denominator > 0 ? Math.round(numerator / denominator * 100) : 0;
    return (
      <div style={{ display: "flex", alignItems: "center", padding: "11px 0", borderBottom: i < 2 ? "1px solid rgba(255,255,255,0.05)" : "none" }}>
        <div style={{ width: 9, height: 9, borderRadius: 2, background: e.color1, flexShrink: 0, marginRight: 12 }} />
        <span style={{ flex: 1, fontSize: 13, color: "#888" }}>{e.name}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 70, height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: e.color1, borderRadius: 100 }} />
          </div>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: e.color1, minWidth: 60, textAlign: "right" }}>{numerator.toLocaleString()}</span>
        </div>
      </div>
    );
  };

  return (
    <>
      <p style={{ fontSize: 11, color: "#555", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 12 }}>Reps hechas hasta hoy</p>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, marginBottom: 4, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <span style={{ fontSize: 13, color: "#888" }}>Total</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, color: "#f0ede8" }}>{totalDone.toLocaleString()}</span>
        </div>
        {EXERCISES.map((e, i) => <ProjRow key={i} e={e} i={i} numerator={exStats.doneReps[i]} denominator={totalDone} />)}
      </div>

      <p style={{ fontSize: 11, color: "#555", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 12 }}>Reps restantes hasta el 31 dic</p>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, marginBottom: 4, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <span style={{ fontSize: 13, color: "#888" }}>Total</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, color: "#47ffb8" }}>{getTotalRemaining(TODAY).toLocaleString()}</span>
        </div>
        {EXERCISES.map((e, i) => <ProjRow key={i} e={e} i={i} numerator={exStats.remainingReps[i]} denominator={getTotalRemaining(TODAY)} />)}
      </div>

      <p style={{ fontSize: 11, color: "#555", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 12 }}>Total del año completo</p>
      <div style={{ background: "rgba(71,255,184,0.03)", border: "1px solid rgba(71,255,184,0.12)", borderRadius: 16, padding: "14px 18px", marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 12, marginBottom: 4, borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
          <span style={{ fontSize: 13, color: "#888" }}>Total 365 días</span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, color: "#47ffb8" }}>{TOTAL_ALL.toLocaleString()}</span>
        </div>
        {EXERCISES.map((e, i) => <ProjRow key={i} e={e} i={i} numerator={exStats.totalReps[i]} denominator={TOTAL_ALL} />)}
        <div style={{ marginTop: 14, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 10, color: "#555", whiteSpace: "nowrap" }}>1 ene</span>
            <div style={{ flex: 1, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
              <div style={{ width: `${(TODAY / 365 * 100).toFixed(1)}%`, height: "100%", background: `linear-gradient(90deg,${todayEx.color1},#47ffb8)`, borderRadius: 100 }} />
            </div>
            <span style={{ fontSize: 10, color: "#47ffb8", whiteSpace: "nowrap" }}>31 dic</span>
          </div>
          <p style={{ fontSize: 11, color: "#47ffb8", marginTop: 8, textAlign: "center" }}>Vas al 100% — quedan {365 - TODAY} días ✓</p>
        </div>
      </div>

      <p style={{ fontSize: 11, color: "#555", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 12 }}>Comparativa mensual</p>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 22, marginBottom: 20 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 10, padding: 14, border: "1px solid rgba(255,255,255,0.06)" }}>
            <p style={{ fontSize: 10, color: "#444", marginBottom: 5, textTransform: "uppercase" }}>{MONTH_NAMES[prevMonth]}</p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: "#666", lineHeight: 1 }}>{pmtotal.toLocaleString()}</p>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 24, fontSize: 10, color: "#333", fontWeight: 600 }}>VS</div>
          <div style={{ flex: 1, background: todayEx.color2, borderRadius: 10, padding: 14, border: `1px solid ${todayEx.border}` }}>
            <p style={{ fontSize: 10, color: todayEx.color1, marginBottom: 5, textTransform: "uppercase" }}>{MONTH_NAMES[currentMonth]}</p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: todayEx.color1, lineHeight: 1 }}>{cmdone.toLocaleString()}</p>
          </div>
        </div>
        <div style={{ height: 5, borderRadius: 100, overflow: "hidden", display: "flex", gap: 2, marginBottom: 10 }}>
          <div style={{ flex: pmtotal, background: "rgba(255,255,255,0.15)", borderRadius: "100px 0 0 100px" }} />
          <div style={{ flex: cmdone, background: todayEx.color1, borderRadius: "0 100px 100px 0" }} />
        </div>
        <p style={{ fontSize: 12, color: cmdone >= pmtotal ? "#47ffb8" : "#ff8c47", textAlign: "center" }}>
          {cmdone >= pmtotal
            ? `↑ +${(cmdone - pmtotal).toLocaleString()} más que ${MONTH_NAMES[prevMonth].toLowerCase()} (${mdiffpct > 0 ? "+" : ""}${mdiffpct}%)`
            : `Llevas ${Math.min(TODAY - cmS + 1, cmE - cmS + 1)} de ${cmE - cmS + 1} días de ${MONTH_NAMES[currentMonth].toLowerCase()}`}
        </p>
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: ".1em" }}>Mapa del año</p>
          <div style={{ display: "flex", gap: 8 }}>
            {EXERCISES.map(e => <span key={e.name} style={{ fontSize: 10, color: e.color1, display: "flex", alignItems: "center", gap: 3 }}><span style={{ width: 7, height: 7, borderRadius: 1, background: e.color1, display: "inline-block" }} />{e.short}</span>)}
          </div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {Array.from({ length: 365 }, (_, i) => i + 1).map(d => {
            const e = getExercise(d);
            return <div key={d} style={{ width: 7, height: 7, borderRadius: 1, background: d <= TODAY ? e.color1 : "rgba(255,255,255,0.05)", display: "inline-block", margin: 1 }} />;
          })}
        </div>
        <p style={{ fontSize: 10, color: "#444", marginTop: 10, textAlign: "center" }}>{TODAY} días completados · {365 - TODAY} restantes</p>
      </div>
    </>
  );
}

function StatsExercise({ idx, exStats }) {
  const e = EXERCISES[idx];
  const done = exStats.doneReps[idx];
  const total = exStats.totalReps[idx];
  const remaining = exStats.remainingReps[idx];
  const days = exStats.counts[idx];
  const pct = total > 0 ? Math.round(done / total * 100) : 0;

  return (
    <>
      <div style={{ background: e.color2, border: `1px solid ${e.border}`, borderRadius: 18, padding: 22, marginBottom: 20 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
          <div>
            <p style={{ fontSize: 11, color: e.color1, opacity: 0.7, letterSpacing: ".15em", textTransform: "uppercase", marginBottom: 4 }}>{e.name}</p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, color: e.color1, lineHeight: 1 }}>{done.toLocaleString()}</p>
            <p style={{ fontSize: 12, color: e.color1, opacity: 0.6, marginTop: 3 }}>reps hechas</p>
          </div>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: e.color1, opacity: 0.5, lineHeight: 1 }}>{pct}%</p>
            <p style={{ fontSize: 11, color: e.color1, opacity: 0.4, marginTop: 2 }}>del año</p>
          </div>
        </div>
        <div style={{ height: 6, background: "rgba(0,0,0,0.2)", borderRadius: 100, overflow: "hidden", marginBottom: 16 }}>
          <div style={{ height: "100%", width: `${pct}%`, background: e.color1, borderRadius: 100, transition: "width .8s ease" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div><p style={{ fontSize: 11, color: e.color1, opacity: 0.5 }}>Días entrenados</p><p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: e.color1 }}>{days}</p></div>
          <div style={{ textAlign: "center" }}><p style={{ fontSize: 11, color: e.color1, opacity: 0.5 }}>Quedan</p><p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: e.color1 }}>{remaining.toLocaleString()}</p></div>
          <div style={{ textAlign: "right" }}><p style={{ fontSize: 11, color: e.color1, opacity: 0.5 }}>Total año</p><p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: e.color1 }}>{total.toLocaleString()}</p></div>
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 22, marginBottom: 20 }}>
        <p style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: ".1em", marginBottom: 16 }}>Ritmo de {e.name.toLowerCase()}</p>
        <div style={{ display: "flex" }}>
          {[
            { label: "Media por día", val: days > 0 ? Math.round(done / days) : 0 },
            { label: "Media días totales", val: TODAY > 0 ? Math.round(done / TODAY) : 0 },
            { label: "Media días rest.", val: (365 - TODAY) > 0 ? Math.round(remaining / (365 - TODAY)) : 0 },
          ].map((s, i) => (
            <div key={i} style={{ flex: 1, textAlign: "center", padding: "0 8px", borderRight: i < 2 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: e.color1, lineHeight: 1 }}>{s.val}</p>
              <p style={{ fontSize: 10, color: "#444", marginTop: 4 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, padding: 22 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: ".1em" }}>Días de {e.name.toLowerCase()}</p>
          <span style={{ fontSize: 10, color: e.color1 }}>{days} completados</span>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
          {Array.from({ length: 365 }, (_, i) => i + 1).map(d => {
            const isThis = getExerciseIdx(d) === idx;
            const done2 = d <= TODAY;
            return <div key={d} style={{ width: 7, height: 7, borderRadius: 1, background: isThis && done2 ? e.color1 : isThis ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.02)", display: "inline-block", margin: 1 }} />;
          })}
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 10, justifyContent: "center" }}>
          <span style={{ fontSize: 10, color: e.color1, display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: 1, background: e.color1, display: "inline-block" }} />Completado</span>
          <span style={{ fontSize: 10, color: "#555", display: "flex", alignItems: "center", gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: 1, background: "rgba(255,255,255,0.08)", display: "inline-block" }} />Pendiente</span>
        </div>
      </div>
    </>
  );
}

// ── MAIN APP ───────────────────────────────────────────────────
export default function App() {
  const [currentDay, setCurrentDay] = useState(TODAY);
  const [activeTab, setActiveTab] = useState("hoy");
  const [seriesCount, setSeriesCount] = useState(3);
  const [statsFilter, setStatsFilter] = useState("all");
  const [showTimer, setShowTimer] = useState(false);
  const [showWarmup, setShowWarmup] = useState(false);

  const todayEx = getExercise(TODAY);
  const viewEx = getExercise(currentDay);
  const series = getSeries(currentDay, seriesCount);
  const totalDone = getTotalDone(TODAY);
  const progressPct = (totalDone / TOTAL_ALL * 100).toFixed(1);
  const quote = MOTIVATIONAL[TODAY % MOTIVATIONAL.length];
  const exStats = getExerciseStats(TODAY);

  const currentMonth = NOW.getMonth();
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const [cmS, cmE] = getMonthDayRange(currentMonth, YEAR);
  const cmdone = getPushupsInRange(cmS, Math.min(cmE, TODAY));
  const [pmS, pmE] = getMonthDayRange(prevMonth, currentMonth === 0 ? YEAR - 1 : YEAR);
  const pmtotal = getPushupsInRange(pmS, pmE);

  const subFilters = [
    { key: "all", label: "Todos", color: null },
    { key: "0", label: "Flexiones", color: EXERCISES[0].color1 },
    { key: "1", label: "Sentadillas", color: EXERCISES[1].color1 },
    { key: "2", label: "Abdominales", color: EXERCISES[2].color1 },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#f0ede8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Bebas+Neue&display=swap');
        *{box-sizing:border-box;margin:0;padding:0;}
        .tab-btn{background:none;border:none;color:#555;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:500;letter-spacing:.08em;text-transform:uppercase;cursor:pointer;padding:8px 13px;border-radius:20px;transition:all .2s;}
        .series-card{border-radius:14px;padding:14px;flex:1;text-align:center;border:1px solid rgba(255,255,255,0.08);background:rgba(255,255,255,0.04);}
        .sc-btn{background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);color:#f0ede8;width:34px;height:34px;border-radius:8px;cursor:pointer;font-size:17px;}
        .sub-btn{background:none;border:1px solid rgba(255,255,255,0.1);color:#555;font-family:'DM Sans',sans-serif;font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;cursor:pointer;padding:8px 14px;border-radius:20px;transition:all .2s;white-space:nowrap;}
        @keyframes slideUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        .slide-up{animation:slideUp .3s ease forwards;}
        ::-webkit-scrollbar{width:0;}
      `}</style>

      {showTimer && <TimerModal color={todayEx.timerColor} onClose={() => setShowTimer(false)} />}
      {showWarmup && <WarmupModal exerciseIdx={getExerciseIdx(TODAY)} onClose={() => setShowWarmup(false)} />}

      <div style={{ maxWidth: 430, margin: "0 auto", padding: "0 0 60px" }}>

        {/* Header */}
        <div style={{ padding: "52px 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <p style={{ fontSize: 11, letterSpacing: ".2em", textTransform: "uppercase", color: "#555", marginBottom: 4 }}>Reto 365</p>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 38, letterSpacing: ".05em", lineHeight: 1, color: "#f0ede8" }}>RETO 365</h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, color: "#555", letterSpacing: ".1em", textTransform: "uppercase" }}>Racha</p>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, color: todayEx.color1 }}>{TODAY}<span style={{ fontSize: 15, marginLeft: 2 }}>🔥</span></p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "#444", fontStyle: "italic" }}>"{quote}"</p>
        </div>

        {/* Hero ring */}
        <div style={{ padding: "24px 20px 20px", display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ background: todayEx.glow, borderRadius: "50%", padding: 3, width: 120, height: 120, flexShrink: 0 }}>
            <div style={{ background: "#0a0a0f", borderRadius: "50%", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: todayEx.color1, lineHeight: 1 }}>{TODAY}</span>
              <span style={{ fontSize: 10, color: "#666", letterSpacing: ".1em", textTransform: "uppercase" }}>{todayEx.short} hoy</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 7 }}>
              <span style={{ fontSize: 10, color: "#555", letterSpacing: ".1em", textTransform: "uppercase" }}>Día del año</span>
              <span style={{ fontSize: 10, padding: "3px 9px", borderRadius: 10, background: todayEx.color2, border: `1px solid ${todayEx.border}`, color: todayEx.color1 }}>{todayEx.name}</span>
            </div>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "#f0ede8", lineHeight: 1 }}>{TODAY}<span style={{ fontSize: 18, color: "#444" }}>/365</span></p>
            <div style={{ background: "rgba(255,255,255,0.07)", borderRadius: 100, height: 5, overflow: "hidden", marginTop: 9 }}>
              <div style={{ height: "100%", borderRadius: 100, width: `${(TODAY / 365 * 100).toFixed(1)}%`, background: todayEx.color1 }} />
            </div>
            <p style={{ fontSize: 11, color: "#444", marginTop: 5 }}>{progressPct}% completado</p>
          </div>
        </div>

        {/* 3-day strip */}
        <div style={{ padding: "0 20px 20px" }}>
          <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "10px 14px", display: "flex", gap: 8 }}>
            {[TODAY - 1, TODAY, TODAY + 1].filter(d => d >= 1 && d <= 365).map(d => {
              const e = getExercise(d), isToday = d === TODAY;
              return (
                <div key={d} style={{ flex: 1, textAlign: "center", padding: "10px 4px", borderRadius: 10, background: isToday ? e.color2 : "transparent", border: `1px solid ${isToday ? e.border : "transparent"}` }}>
                  <p style={{ fontSize: 9, color: isToday ? e.color1 : "#444", textTransform: "uppercase", letterSpacing: ".07em", marginBottom: 2 }}>{d === TODAY ? "HOY" : d === TODAY - 1 ? "AYER" : "MAÑANA"}</p>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: isToday ? e.color1 : "#555", lineHeight: 1 }}>{d}</p>
                  <p style={{ fontSize: 9, color: isToday ? e.color1 : "#444", marginTop: 2 }}>{e.name}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, padding: "0 20px 20px" }}>
          {[["hoy", "Hoy"], ["stats", "Stats"], ["historial", "Historial"]].map(([k, l]) => (
            <button key={k} className="tab-btn" onClick={() => setActiveTab(k)} style={activeTab === k ? { background: todayEx.color1, color: "#0a0a0f" } : {}}>{l}</button>
          ))}
        </div>

        <div className="slide-up">

          {/* ── TAB HOY ── */}
          {activeTab === "hoy" && (
            <div style={{ padding: "0 20px" }}>
              {/* Series */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <p style={{ fontSize: 11, color: "#555", letterSpacing: ".12em", textTransform: "uppercase" }}>Series recomendadas</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 11, color: "#555" }}>Series:</span>
                  <button className="sc-btn" onClick={() => setSeriesCount(c => Math.max(2, c - 1))}>−</button>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: todayEx.color1, minWidth: 20, textAlign: "center" }}>{seriesCount}</span>
                  <button className="sc-btn" onClick={() => setSeriesCount(c => Math.min(6, c + 1))}>+</button>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginBottom: 16, flexWrap: "wrap" }}>
                {series.map((s, i) => (
                  <div key={i} className="series-card" style={i === 0 ? { borderColor: viewEx.border, background: viewEx.color2 } : i === 1 ? { borderColor: "rgba(71,255,184,0.2)", background: "rgba(71,255,184,0.04)" } : {}}>
                    <p style={{ fontSize: 10, color: i === 0 ? viewEx.color1 : i === 1 ? "#47ffb8" : "#444", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 5 }}>Serie {i + 1}</p>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: seriesCount > 4 ? 30 : 40, color: i === 0 ? viewEx.color1 : i === 1 ? "#47ffb8" : "#888", lineHeight: 1 }}>{s}</p>
                    <p style={{ fontSize: 10, color: "#444", marginTop: 4 }}>reps</p>
                  </div>
                ))}
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "12px 16px", marginBottom: 16, border: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
                <div><span style={{ fontSize: 11, color: "#555" }}>TOTAL </span><span style={{ fontSize: 11, color: "#47ffb8" }}>{series.join("+")} = {series.reduce((a, b) => a + b, 0)}</span></div>
                <div><span style={{ fontSize: 11, color: "#555" }}>DESCANSO </span><span style={{ fontSize: 11, color: todayEx.color1 }}>3 min</span></div>
              </div>

              <button onClick={() => setShowTimer(true)} style={{ width: "100%", padding: 15, background: viewEx.color2, border: `1px solid ${viewEx.border}`, borderRadius: 14, fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: ".1em", color: viewEx.color1, cursor: "pointer", marginBottom: 24 }}>
                ⏱ TEMPORIZADOR DE DESCANSO
              </button>

              {/* Warmup block */}
              <div style={{ background: todayEx.color2, border: `1px solid ${todayEx.border}`, borderRadius: 18, padding: 20, marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <div>
                    <p style={{ fontSize: 11, color: todayEx.color1, letterSpacing: ".15em", textTransform: "uppercase", opacity: 0.7, marginBottom: 3 }}>Antes de empezar</p>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: todayEx.color1, lineHeight: 1 }}>CALENTAMIENTO</p>
                  </div>
                  <span style={{ fontSize: 36 }}>🧘</span>
                </div>
                <p style={{ fontSize: 13, color: todayEx.color1, opacity: 0.6, marginBottom: 16, lineHeight: 1.5 }}>4 pasos guiados · 2-3 min · específico para {todayEx.name.toLowerCase()}</p>
                <button onClick={() => setShowWarmup(true)} style={{ width: "100%", padding: 15, background: todayEx.color1, border: "none", borderRadius: 12, fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: ".1em", color: getExerciseIdx(TODAY) === 0 ? "#0a0a0f" : "#f0ede8", cursor: "pointer" }}>
                  EMPEZAR CALENTAMIENTO
                </button>
              </div>

              <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: 16, border: "1px solid rgba(255,255,255,0.07)" }}>
                <p style={{ fontSize: 11, color: "#555", letterSpacing: ".1em", textTransform: "uppercase", marginBottom: 12 }}>Ver otro día</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <button onClick={() => setCurrentDay(d => Math.max(1, d - 1))} style={{ background: "rgba(255,255,255,0.07)", border: "none", color: "#f0ede8", width: 36, height: 36, borderRadius: 8, cursor: "pointer", fontSize: 16 }}>‹</button>
                  <div style={{ flex: 1, textAlign: "center" }}>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: "#f0ede8" }}>Día {currentDay}</span>
                    <span style={{ fontSize: 11, color: "#555", display: "block" }}>{currentDay} {getExercise(currentDay).name} · {getSeries(currentDay, seriesCount).join("+")}</span>
                  </div>
                  <button onClick={() => setCurrentDay(d => Math.min(365, d + 1))} style={{ background: "rgba(255,255,255,0.07)", border: "none", color: "#f0ede8", width: 36, height: 36, borderRadius: 8, cursor: "pointer", fontSize: 16 }}>›</button>
                </div>
              </div>
            </div>
          )}

          {/* ── TAB STATS ── */}
          {activeTab === "stats" && (
            <div style={{ padding: "0 20px" }}>
              {/* Submenú filtro */}
              <div style={{ display: "flex", gap: 6, overflowX: "auto", paddingBottom: 4, marginBottom: 20 }}>
                {subFilters.map(f => {
                  const isActive = statsFilter === f.key;
                  const activeColor = f.color || "#f0ede8";
                  return (
                    <button key={f.key} className="sub-btn" onClick={() => setStatsFilter(f.key)} style={isActive ? { background: f.color ? `${f.color}22` : "rgba(255,255,255,0.08)", borderColor: activeColor, color: activeColor } : {}}>
                      {f.color && <span style={{ width: 7, height: 7, borderRadius: 1, background: f.color, display: "inline-block", marginRight: 5, verticalAlign: "middle" }} />}
                      {f.label}
                    </button>
                  );
                })}
              </div>

              {statsFilter === "all"
                ? <StatsAll exStats={exStats} totalDone={totalDone} todayEx={todayEx} cmdone={cmdone} pmtotal={pmtotal} prevMonth={prevMonth} currentMonth={currentMonth} cmS={cmS} cmE={cmE} />
                : <StatsExercise idx={parseInt(statsFilter)} exStats={exStats} />
              }
            </div>
          )}

          {/* ── TAB HISTORIAL ── */}
          {activeTab === "historial" && (
            <div style={{ padding: "0 20px" }}>
              <p style={{ fontSize: 11, color: "#555", letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 16 }}>Últimos 14 días</p>
              {Array.from({ length: Math.min(14, TODAY) }, (_, i) => {
                const d = TODAY - i, e = getExercise(d), s = getSeries(d, seriesCount);
                return (
                  <div key={d} style={{ display: "flex", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", gap: 14 }}>
                    <div style={{ width: 9, height: 9, borderRadius: 2, background: e.color1, flexShrink: 0 }} />
                    <div style={{ width: 32, textAlign: "center" }}>
                      <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 21, color: e.color1, lineHeight: 1 }}>{d}</p>
                      <p style={{ fontSize: 9, color: "#444" }}>día</p>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: "#f0ede8" }}>{d} {e.name}</p>
                      <p style={{ fontSize: 11, color: "#444", marginTop: 2 }}>{s.join("+")} reps</p>
                    </div>
                    <div style={{ width: 26, height: 26, borderRadius: "50%", background: e.color2, border: `1px solid ${e.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: e.color1 }}>✓</div>
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
