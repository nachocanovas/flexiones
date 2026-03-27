import { useState, useEffect, useRef } from "react";

const DAY_OF_YEAR = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now - start + (start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000;
  return Math.floor(diff / (1000 * 60 * 60 * 24));
};

const TOTAL_YEAR_PUSHUPS = 365 * (365 + 1) / 2;

const getSeries = (total) => {
  const s1 = Math.round(total * 0.40);
  const s2 = Math.round(total * 0.33);
  const s3 = total - s1 - s2;
  return [s1, s2, s3];
};

const getTotalDone = (day) => day * (day + 1) / 2;
const getTotalRemaining = (day) => TOTAL_YEAR_PUSHUPS - getTotalDone(day);

const getMonthDayRange = (month, year) => {
  const yearStart = new Date(year, 0, 0);
  const toDoy = (d) => {
    const diff = d - yearStart + (yearStart.getTimezoneOffset() - d.getTimezoneOffset()) * 60000;
    return Math.floor(diff / 86400000);
  };
  return [toDoy(new Date(year, month, 1)), toDoy(new Date(year, month + 1, 0))];
};

const getPushupsInRange = (from, to) => {
  const t = Math.max(0, to);
  const f = Math.max(0, from - 1);
  return getTotalDone(t) - getTotalDone(f);
};

const MOTIVATIONAL = [
  "Cada rep cuenta. Cada día importa.",
  "El dolor de hoy es la fuerza de mañana.",
  "No pares cuando estés cansado. Para cuando hayas terminado.",
  "Pequeños pasos, grandes resultados.",
  "Tu único competidor eres tú de ayer.",
  "La constancia supera al talento.",
  "Un día más. Una rep más. Siempre adelante.",
];

const REST_SECONDS = 180;

function TimerModal({ onClose }) {
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

  const toggle = () => {
    if (seconds === 0) { setSeconds(REST_SECONDS); return; }
    setRunning(r => !r);
  };
  const reset = () => { setRunning(false); setSeconds(REST_SECONDS); };

  const pct = ((REST_SECONDS - seconds) / REST_SECONDS) * 100;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const done = seconds === 0;
  const r = 54;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;

  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(8px)",
    }} onClick={onClose}>
      <div onClick={e => e.stopPropagation()} style={{
        background: "#111118", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 28, padding: "40px 32px", width: 300, textAlign: "center",
        boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
      }}>
        <p style={{ fontSize: 11, color: "#555", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 28 }}>
          Descanso entre series
        </p>

        <div style={{ position: "relative", width: 140, height: 140, margin: "0 auto 28px" }}>
          <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="70" cy="70" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
            <circle cx="70" cy="70" r={r} fill="none"
              stroke={done ? "#47ffb8" : "#e8ff47"} strokeWidth="6"
              strokeDasharray={circ} strokeDashoffset={offset}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 0.9s linear, stroke 0.3s" }}
            />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            {done ? (
              <span style={{ fontSize: 36 }}>💪</span>
            ) : (
              <>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: "#f0ede8", lineHeight: 1 }}>
                  {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
                </span>
                <span style={{ fontSize: 10, color: "#444", marginTop: 2 }}>restantes</span>
              </>
            )}
          </div>
        </div>

        {done && <p style={{ fontSize: 14, color: "#47ffb8", marginBottom: 20, fontWeight: 500 }}>¡A por la siguiente serie!</p>}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={toggle} style={{
            flex: 2, padding: "14px",
            background: done ? "linear-gradient(135deg,#47ffb8,#00d4a0)" : running ? "rgba(255,255,255,0.08)" : "linear-gradient(135deg,#e8ff47,#b8ff00)",
            border: "none", borderRadius: 12,
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: "0.1em",
            color: !running && !done ? "#0a0a0f" : "#f0ede8", cursor: "pointer",
          }}>
            {done ? "REPETIR" : running ? "PAUSAR" : "INICIAR"}
          </button>
          <button onClick={reset} style={{
            flex: 1, padding: "14px", background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 12,
            color: "#666", cursor: "pointer", fontSize: 13, fontFamily: "'DM Sans', sans-serif",
          }}>Reset</button>
        </div>

        <button onClick={onClose} style={{
          marginTop: 16, background: "none", border: "none",
          color: "#444", fontSize: 12, cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
        }}>Cerrar</button>
      </div>
    </div>
  );
}

export default function App() {
  const TODAY = DAY_OF_YEAR();
  const NOW = new Date();
  const YEAR = NOW.getFullYear();
  const [currentDay, setCurrentDay] = useState(TODAY);
  const [activeTab, setActiveTab] = useState("hoy");
  const [showTimer, setShowTimer] = useState(false);

  const quote = MOTIVATIONAL[TODAY % MOTIVATIONAL.length];
  const series = getSeries(currentDay);
  const totalDone = getTotalDone(TODAY);
  const totalRemaining = getTotalRemaining(TODAY);
  const progressPct = Math.round((totalDone / TOTAL_YEAR_PUSHUPS) * 100 * 10) / 10;

  const daysLeft = 365 - TODAY;
  const endDateStr = new Date(YEAR, 11, 31).toLocaleDateString("es-ES", { day: "numeric", month: "long" });

  const currentMonth = NOW.getMonth();
  const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const prevMonthYear = currentMonth === 0 ? YEAR - 1 : YEAR;
  const MONTH_NAMES = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

  const [cmStart, cmEnd] = getMonthDayRange(currentMonth, YEAR);
  const currentMonthDone = getPushupsInRange(cmStart, Math.min(cmEnd, TODAY));
  const currentMonthTotal = getPushupsInRange(cmStart, cmEnd);
  const currentMonthDaysElapsed = Math.max(1, Math.min(TODAY - cmStart + 1, cmEnd - cmStart + 1));
  const currentMonthDaysTotal = cmEnd - cmStart + 1;

  const [pmStart, pmEnd] = getMonthDayRange(prevMonth, prevMonthYear);
  const prevMonthTotal = getPushupsInRange(pmStart, pmEnd);
  const monthDiff = currentMonthDone - prevMonthTotal;
  const monthDiffPct = prevMonthTotal > 0 ? Math.round((monthDiff / prevMonthTotal) * 100) : 0;

  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#f0ede8", position: "relative", overflow: "hidden" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .glow-ring { background: conic-gradient(from 200deg, #e8ff47, #47ffb8, #e8ff47 60%, transparent 60%); border-radius: 50%; padding: 3px; }
        .glow-ring-inner { background: #0a0a0f; border-radius: 50%; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; flex-direction: column; }
        .tab-btn { background: none; border: none; color: #555; font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; cursor: pointer; padding: 8px 14px; border-radius: 20px; transition: all 0.2s; }
        .tab-btn.active { background: #e8ff47; color: #0a0a0f; }
        .series-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 16px; flex: 1; text-align: center; transition: transform 0.2s; }
        .series-card:hover { transform: translateY(-2px); }
        .series-card.primary { border-color: rgba(232,255,71,0.3); background: rgba(232,255,71,0.06); }
        .series-card.secondary { border-color: rgba(71,255,184,0.2); background: rgba(71,255,184,0.04); }
        .stat-card { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.07); border-radius: 16px; padding: 20px; }
        .day-dot { width: 9px; height: 9px; border-radius: 2px; display: inline-block; margin: 1px; }
        .timer-btn { width: 100%; padding: 15px; background: rgba(232,255,71,0.08); border: 1px solid rgba(232,255,71,0.25); border-radius: 14px; font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 0.1em; color: #e8ff47; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; gap: 10px; }
        .timer-btn:hover { background: rgba(232,255,71,0.14); transform: translateY(-1px); }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .slide-up { animation: slideUp 0.4s ease forwards; }
        .progress-bar-track { background: rgba(255,255,255,0.07); border-radius: 100px; height: 6px; overflow: hidden; }
        .progress-bar-fill { height: 100%; background: linear-gradient(90deg,#e8ff47,#47ffb8); border-radius: 100px; transition: width 1s ease; }
        ::-webkit-scrollbar { width: 0; }
      `}</style>

      {showTimer && <TimerModal onClose={() => setShowTimer(false)} />}

      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(232,255,71,0.07) 0%, transparent 60%)" }} />

      <div style={{ maxWidth: 430, margin: "0 auto", padding: "0 0 40px", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ padding: "32px 24px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: "#555", marginBottom: 4 }}>Reto 365</p>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, letterSpacing: "0.05em", lineHeight: 1, color: "#f0ede8" }}>FLEXIONES</h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <p style={{ fontSize: 11, color: "#555", letterSpacing: "0.1em", textTransform: "uppercase" }}>Racha</p>
              <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: "#e8ff47" }}>{TODAY}<span style={{ fontSize: 16, marginLeft: 2 }}>🔥</span></p>
            </div>
          </div>
          <p style={{ fontSize: 13, color: "#444", fontStyle: "italic" }}>"{quote}"</p>
        </div>

        {/* Hero ring */}
        <div style={{ padding: "24px 24px 16px", display: "flex", alignItems: "center", gap: 20 }}>
          <div className="glow-ring" style={{ width: 130, height: 130, flexShrink: 0 }}>
            <div className="glow-ring-inner">
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 44, color: "#e8ff47", lineHeight: 1 }}>{TODAY}</span>
              <span style={{ fontSize: 11, color: "#666", letterSpacing: "0.1em", textTransform: "uppercase" }}>hoy</span>
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 11, color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 4 }}>Día del año</p>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 52, color: "#f0ede8", lineHeight: 1 }}>{TODAY}<span style={{ fontSize: 20, color: "#444" }}>/365</span></p>
            <div className="progress-bar-track" style={{ marginTop: 10 }}>
              <div className="progress-bar-fill" style={{ width: `${(TODAY / 365) * 100}%` }} />
            </div>
            <p style={{ fontSize: 11, color: "#444", marginTop: 6 }}>{progressPct}% completado</p>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 2, padding: "0 20px 16px" }}>
          {[["hoy","Hoy"],["stats","Stats"],["historial","Historial"]].map(([key, label]) => (
            <button key={key} className={`tab-btn ${activeTab === key ? "active" : ""}`} onClick={() => setActiveTab(key)}>{label}</button>
          ))}
        </div>

        {/* ── TAB HOY ── */}
        {activeTab === "hoy" && (
          <div style={{ padding: "0 20px" }} className="slide-up">
            <p style={{ fontSize: 11, color: "#555", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>Series recomendadas</p>
            <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
              {series.map((s, i) => (
                <div key={i} className={`series-card ${i === 0 ? "primary" : i === 1 ? "secondary" : ""}`}>
                  <p style={{ fontSize: 10, color: i === 0 ? "rgba(232,255,71,0.6)" : i === 1 ? "rgba(71,255,184,0.6)" : "#444", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6 }}>Serie {i + 1}</p>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, color: i === 0 ? "#e8ff47" : i === 1 ? "#47ffb8" : "#888", lineHeight: 1 }}>{s}</p>
                  <p style={{ fontSize: 10, color: "#444", marginTop: 4 }}>reps</p>
                  <p style={{ fontSize: 10, marginTop: 6, color: i === 0 ? "rgba(232,255,71,0.5)" : i === 1 ? "rgba(71,255,184,0.4)" : "#333" }}>
                    {i === 0 ? "máx energía" : i === 1 ? "ritmo medio" : "cierre"}
                  </p>
                </div>
              ))}
            </div>

            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 14, padding: "12px 16px", marginBottom: 14, border: "1px solid rgba(255,255,255,0.06)", display: "flex", justifyContent: "space-between" }}>
              <div><span style={{ fontSize: 11, color: "#555" }}>TOTAL </span><span style={{ fontSize: 11, color: "#47ffb8" }}>{series[0]} + {series[1]} + {series[2]} = {series.reduce((a, b) => a + b, 0)}</span></div>
              <div><span style={{ fontSize: 11, color: "#555" }}>DESCANSO </span><span style={{ fontSize: 11, color: "#e8ff47" }}>3 min</span></div>
            </div>

            <button className="timer-btn" onClick={() => setShowTimer(true)} style={{ marginBottom: 20 }}>
              <span style={{ fontSize: 20 }}>⏱</span>
              INICIAR TEMPORIZADOR DE DESCANSO
            </button>

            <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 16, padding: 16, border: "1px solid rgba(255,255,255,0.07)" }}>
              <p style={{ fontSize: 11, color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Ver otro día</p>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => setCurrentDay(d => Math.max(1, d - 1))} style={{ background: "rgba(255,255,255,0.07)", border: "none", color: "#f0ede8", width: 36, height: 36, borderRadius: 8, cursor: "pointer", fontSize: 18 }}>‹</button>
                <div style={{ flex: 1, textAlign: "center" }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#f0ede8" }}>Día {currentDay}</span>
                  <span style={{ fontSize: 12, color: "#555", display: "block" }}>{currentDay} flex · {getSeries(currentDay).join(" + ")}</span>
                </div>
                <button onClick={() => setCurrentDay(d => Math.min(365, d + 1))} style={{ background: "rgba(255,255,255,0.07)", border: "none", color: "#f0ede8", width: 36, height: 36, borderRadius: 8, cursor: "pointer", fontSize: 18 }}>›</button>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB STATS ── */}
        {activeTab === "stats" && (
          <div style={{ padding: "0 20px" }} className="slide-up">

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
              <div className="stat-card">
                <p style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Hechas</p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#e8ff47", lineHeight: 1 }}>{totalDone.toLocaleString()}</p>
                <p style={{ fontSize: 10, color: "#444", marginTop: 4 }}>flexiones</p>
              </div>
              <div className="stat-card">
                <p style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Quedan</p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#47ffb8", lineHeight: 1 }}>{totalRemaining.toLocaleString()}</p>
                <p style={{ fontSize: 10, color: "#444", marginTop: 4 }}>flexiones</p>
              </div>
              <div className="stat-card">
                <p style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Total año</p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#f0ede8", lineHeight: 1 }}>{TOTAL_YEAR_PUSHUPS.toLocaleString()}</p>
                <p style={{ fontSize: 10, color: "#444", marginTop: 4 }}>flexiones</p>
              </div>
              <div className="stat-card">
                <p style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Media diaria</p>
                <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: "#ff8c47", lineHeight: 1 }}>{Math.round(totalDone / TODAY)}</p>
                <p style={{ fontSize: 10, color: "#444", marginTop: 4 }}>hasta hoy</p>
              </div>
            </div>

            {/* Proyección */}
            <div className="stat-card" style={{ marginBottom: 12, background: "rgba(71,255,184,0.03)", borderColor: "rgba(71,255,184,0.15)" }}>
              <p style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>📅 Proyección fin de año</p>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 14 }}>
                <div>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 40, color: "#47ffb8", lineHeight: 1 }}>{TOTAL_YEAR_PUSHUPS.toLocaleString()}</p>
                  <p style={{ fontSize: 11, color: "#444", marginTop: 4 }}>flexiones el 31 dic</p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: "#f0ede8" }}>{daysLeft}</p>
                  <p style={{ fontSize: 11, color: "#444" }}>días restantes</p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 10, color: "#555", whiteSpace: "nowrap" }}>1 ene</span>
                <div style={{ flex: 1, height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 100, overflow: "hidden" }}>
                  <div style={{ width: `${(TODAY / 365) * 100}%`, height: "100%", background: "linear-gradient(90deg,#e8ff47,#47ffb8)", borderRadius: 100 }} />
                </div>
                <span style={{ fontSize: 10, color: "#47ffb8", whiteSpace: "nowrap" }}>31 dic</span>
              </div>
              <p style={{ fontSize: 11, color: "#47ffb8", marginTop: 10, textAlign: "center" }}>
                Vas al 100% del reto — terminas el {endDateStr} ✓
              </p>
            </div>

            {/* Comparativa mensual */}
            <div className="stat-card" style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 14 }}>📊 Comparativa mensual</p>
              <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
                <div style={{ flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 12, padding: "14px 12px", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <p style={{ fontSize: 10, color: "#444", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{MONTH_NAMES[prevMonth]}</p>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, color: "#666", lineHeight: 1 }}>{prevMonthTotal.toLocaleString()}</p>
                  <p style={{ fontSize: 10, color: "#333", marginTop: 4 }}>total mes</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28 }}>
                  <span style={{ fontSize: 10, color: "#333", fontWeight: 600 }}>VS</span>
                </div>
                <div style={{ flex: 1, background: "rgba(232,255,71,0.05)", borderRadius: 12, padding: "14px 12px", border: "1px solid rgba(232,255,71,0.15)" }}>
                  <p style={{ fontSize: 10, color: "rgba(232,255,71,0.6)", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.08em" }}>{MONTH_NAMES[currentMonth]}</p>
                  <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 30, color: "#e8ff47", lineHeight: 1 }}>{currentMonthDone.toLocaleString()}</p>
                  <p style={{ fontSize: 10, color: "#555", marginTop: 4 }}>de {currentMonthTotal.toLocaleString()}</p>
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                  <span style={{ fontSize: 10, color: "#444" }}>{MONTH_NAMES[prevMonth]}</span>
                  <span style={{ fontSize: 10, color: "#444" }}>{MONTH_NAMES[currentMonth]}</span>
                </div>
                <div style={{ display: "flex", height: 8, borderRadius: 100, overflow: "hidden", gap: 2 }}>
                  <div style={{ flex: prevMonthTotal, background: "rgba(255,255,255,0.15)", borderRadius: "100px 0 0 100px" }} />
                  <div style={{ flex: currentMonthDone, background: "linear-gradient(90deg,#e8ff47,#b8ff00)", borderRadius: "0 100px 100px 0" }} />
                </div>
              </div>

              <div style={{ textAlign: "center", paddingTop: 4 }}>
                {currentMonthDone >= prevMonthTotal ? (
                  <p style={{ fontSize: 12, color: "#47ffb8" }}>
                    ↑ +{(currentMonthDone - prevMonthTotal).toLocaleString()} más que {MONTH_NAMES[prevMonth].toLowerCase()}
                    {monthDiffPct > 0 && <span style={{ marginLeft: 6 }}>({monthDiffPct > 0 ? "+" : ""}{monthDiffPct}%)</span>}
                  </p>
                ) : (
                  <p style={{ fontSize: 12, color: "#ff8c47" }}>
                    Llevas {currentMonthDaysElapsed} de {currentMonthDaysTotal} días de {MONTH_NAMES[currentMonth].toLowerCase()}
                  </p>
                )}
              </div>
            </div>

            {/* Gráfico barras */}
            <div className="stat-card" style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Progreso por mes</p>
              <div style={{ position: "relative", height: 80 }}>
                {Array.from({ length: 12 }, (_, month) => {
                  const [mStart, mEnd] = getMonthDayRange(month, YEAR);
                  const pushups = getPushupsInRange(mStart, Math.min(mEnd, TODAY));
                  const maxVal = getPushupsInRange(...getMonthDayRange(11, YEAR));
                  const height = Math.max(mStart <= TODAY ? 4 : 0, (pushups / maxVal) * 70);
                  const isCurrent = month === currentMonth;
                  const isPast = mEnd < TODAY;
                  return (
                    <div key={month} style={{
                      position: "absolute", bottom: 0,
                      left: `${(month / 12) * 100}%`,
                      width: `${100 / 12 - 1}%`,
                      height: `${height}px`,
                      background: isCurrent ? "linear-gradient(180deg,#e8ff47,rgba(232,255,71,0.3))" : isPast ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.05)",
                      borderRadius: "3px 3px 0 0",
                      transition: "height 0.5s ease",
                    }} />
                  );
                })}
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                {["E","F","M","A","M","J","J","A","S","O","N","D"].map((m, i) => (
                  <span key={i} style={{ fontSize: 9, color: i === currentMonth ? "#e8ff47" : "#444", width: `${100 / 12}%`, textAlign: "center" }}>{m}</span>
                ))}
              </div>
            </div>

            {/* Mapa de días completo */}
            <div className="stat-card">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <p style={{ fontSize: 10, color: "#555", textTransform: "uppercase", letterSpacing: "0.1em" }}>Días completados</p>
                <p style={{ fontSize: 10, color: "#e8ff47" }}>{TODAY}/365</p>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                {Array.from({ length: 365 }, (_, i) => i + 1).map(d => (
                  <div key={d} className="day-dot" style={{ background: d <= TODAY ? "#e8ff47" : "rgba(255,255,255,0.05)" }} />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB HISTORIAL ── */}
        {activeTab === "historial" && (
          <div style={{ padding: "0 20px" }} className="slide-up">
            <p style={{ fontSize: 11, color: "#555", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 16 }}>Últimos 14 días</p>
            {Array.from({ length: Math.min(14, TODAY) }, (_, i) => {
              const d = TODAY - i;
              const s = getSeries(d);
              return (
                <div key={d} style={{ display: "flex", alignItems: "center", padding: "14px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", gap: 16 }}>
                  <div style={{ width: 36, textAlign: "center" }}>
                    <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: "#e8ff47", lineHeight: 1 }}>{d}</p>
                    <p style={{ fontSize: 9, color: "#444" }}>día</p>
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontSize: 14, fontWeight: 500, color: "#f0ede8" }}>{d} flexiones</p>
                    <p style={{ fontSize: 11, color: "#444", marginTop: 2 }}>{s[0]} + {s[1]} + {s[2]} reps</p>
                  </div>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(232,255,71,0.12)", border: "1px solid rgba(232,255,71,0.35)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, color: "#e8ff47" }}>✓</div>
                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
}
