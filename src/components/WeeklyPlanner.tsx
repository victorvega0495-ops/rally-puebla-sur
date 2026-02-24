import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calculator, Target, Users, Smartphone, Download, TrendingUp, Plus, ChevronDown, ChevronUp } from "lucide-react";

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];

const dayStatuses = [
  { emoji: "📸", label: "Prueba social", desc: "foto de clienta usando producto" },
  { emoji: "👗", label: "Outfit completo", desc: "look armado de pies a cabeza" },
  { emoji: "👀", label: "Gancho de curiosidad", desc: "el misterio + reveal" },
  { emoji: "🤝", label: "Outfit colaborativo", desc: "serie de 5 estados interactivos" },
  { emoji: "🔥", label: "Reveal final", desc: "del outfit colaborativo" },
];

const strategyOptions = [
  "Módulo 2 — Reconexión",
  "Módulo 3 — Mensaje de deseo",
  "Módulo 4 — Seguimiento",
];

interface ClientRow {
  name: string;
  strategy: string;
}

interface DayData {
  targetClients: number;
  clients: ClientRow[];
}

const INITIAL_MAX_VISIBLE = 15;

const WeeklyPlanner = () => {
  const [goal, setGoal] = useState("");
  const [ticket, setTicket] = useState("");
  const [calculated, setCalculated] = useState(false);
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [responded, setResponded] = useState("");
  const [sales, setSales] = useState("");
  const [expandedDays, setExpandedDays] = useState<boolean[]>([true, true, true, true, true]);
  const [visibleCounts, setVisibleCounts] = useState<number[]>([]);

  const goalNum = parseFloat(goal) || 0;
  const ticketNum = parseFloat(ticket) || 0;
  const salesNeeded = ticketNum > 0 ? Math.ceil(goalNum / ticketNum) : 0;
  const clientsNeeded = Math.ceil(salesNeeded / 0.2);
  const clientsPerDay = Math.ceil(clientsNeeded / 5);
  const statusPerWeek = Math.ceil(clientsNeeded / 3);

  const calculate = () => {
    if (!goalNum || !ticketNum) return;
    const initialRows = Math.min(clientsPerDay, INITIAL_MAX_VISIBLE);
    setWeekData(
      days.map(() => ({
        targetClients: clientsPerDay,
        clients: Array.from({ length: clientsPerDay }, () => ({
          name: "",
          strategy: strategyOptions[0],
        })),
      }))
    );
    setVisibleCounts(days.map(() => initialRows));
    setExpandedDays([true, true, true, true, true]);
    setCalculated(true);
  };

  const updateClientRow = (dayIdx: number, rowIdx: number, field: keyof ClientRow, value: string) => {
    setWeekData(prev => {
      const next = [...prev];
      const day = { ...next[dayIdx], clients: [...next[dayIdx].clients] };
      day.clients[rowIdx] = { ...day.clients[rowIdx], [field]: value };
      next[dayIdx] = day;
      return next;
    });
  };

  const addMoreRows = (dayIdx: number) => {
    setVisibleCounts(prev => {
      const next = [...prev];
      next[dayIdx] = Math.min(next[dayIdx] + 10, weekData[dayIdx].clients.length + 10);
      return next;
    });
    // Also add more client rows if needed
    setWeekData(prev => {
      const next = [...prev];
      const day = { ...next[dayIdx], clients: [...next[dayIdx].clients] };
      const target = visibleCounts[dayIdx] + 10;
      while (day.clients.length < target) {
        day.clients.push({ name: "", strategy: strategyOptions[0] });
      }
      next[dayIdx] = day;
      return next;
    });
  };

  const toggleDay = (dayIdx: number) => {
    setExpandedDays(prev => {
      const next = [...prev];
      next[dayIdx] = !next[dayIdx];
      return next;
    });
  };

  const filledCount = (dayIdx: number) =>
    weekData[dayIdx]?.clients.filter(c => c.name.trim()).length || 0;

  const respondedNum = parseInt(responded) || 0;
  const salesNum = parseInt(sales) || 0;
  const conversionRate = respondedNum > 0 ? ((salesNum / respondedNum) * 100).toFixed(1) : "0";

  const handleDownloadPDF = async () => {
    const html2pdf = (await import("html2pdf.js")).default;

    const el = document.createElement("div");
    el.style.cssText = "width:700px;padding:40px;font-family:Helvetica,Arial,sans-serif;color:#1a1a1a;";

    const h = (tag: string, text: string, style = "") => `<${tag} style="${style}">${text}</${tag}>`;
    const hr = `<hr style="border:none;border-top:1px solid #ddd;margin:20px 0;">`;

    let html = `
      <div style="text-align:center;margin-bottom:24px;">
        ${h("h1", "Secretos de Ventas | Mi Plan Semanal", "font-size:22px;color:#9b3fa0;margin:0 0 4px;")}
        ${h("p", "Price Shoes", "font-size:12px;color:#888;margin:0;")}
      </div>
      ${hr}
    `;

    // Stats
    html += `
      <div style="display:flex;gap:16px;margin-bottom:24px;">
        ${[
          ["Meta de la semana", `$${goalNum.toLocaleString()}`],
          ["Ventas necesarias", String(salesNeeded)],
          ["Clientas a contactar", String(clientsNeeded)],
          ["Clientas por día", String(clientsPerDay)],
          ["Estados por semana", String(statusPerWeek)],
        ].map(([label, val]) => `
          <div style="flex:1;text-align:center;background:#f5f0f7;border-radius:8px;padding:12px 4px;">
            <div style="font-size:20px;font-weight:bold;color:#9b3fa0;">${val}</div>
            <div style="font-size:9px;color:#666;margin-top:4px;">${label}</div>
          </div>
        `).join("")}
      </div>
    `;

    // Per-day detailed plan
    html += h("h2", "📅 Plan de la Semana", "font-size:16px;margin-bottom:12px;");

    weekData.forEach((day, i) => {
      const status = dayStatuses[i];
      html += `
        <div style="margin-bottom:16px;border:1px solid #e5e5e5;border-radius:8px;overflow:hidden;">
          <div style="background:#9b3fa0;color:#fff;padding:10px 14px;display:flex;justify-content:space-between;align-items:center;">
            <span style="font-weight:bold;font-size:14px;">${days[i]}</span>
            <span style="background:rgba(255,255,255,0.25);padding:2px 10px;border-radius:12px;font-size:11px;">${day.targetClients} clientas</span>
          </div>
          <div style="background:#f0e6f6;padding:8px 14px;font-size:11px;">
            ${status.emoji} Estado: ${status.label} — ${status.desc}
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:11px;">
            <thead>
              <tr style="background:#faf8fc;">
                <th style="padding:6px 10px;text-align:left;width:30px;">#</th>
                <th style="padding:6px 10px;text-align:left;">Clienta</th>
                <th style="padding:6px 10px;text-align:left;">Estrategia</th>
              </tr>
            </thead>
            <tbody>
              ${day.clients.map((c, j) => `
                <tr style="border-top:1px solid #eee;">
                  <td style="padding:5px 10px;color:#999;">${j + 1}</td>
                  <td style="padding:5px 10px;">${c.name || "________________"}</td>
                  <td style="padding:5px 10px;color:#666;">${c.strategy}</td>
                </tr>
              `).join("")}
            </tbody>
          </table>
          <div style="background:#faf8fc;padding:6px 14px;font-size:10px;color:#888;text-align:right;">
            ${day.clients.filter(c => c.name.trim()).length} de ${day.targetClients} clientas planeadas
          </div>
        </div>
      `;
    });

    // Results section
    html += hr;
    html += h("h2", "📊 Mi Resultado de la Semana", "font-size:16px;margin-bottom:12px;");
    html += `
      <div style="display:flex;gap:16px;margin-bottom:12px;">
        <div style="flex:1;border:1px solid #ddd;border-radius:8px;padding:16px;">
          <div style="font-size:10px;color:#888;margin-bottom:8px;">Clientas que respondieron</div>
          <div style="border-bottom:1px solid #ccc;height:24px;"></div>
        </div>
        <div style="flex:1;border:1px solid #ddd;border-radius:8px;padding:16px;">
          <div style="font-size:10px;color:#888;margin-bottom:8px;">Ventas cerradas</div>
          <div style="border-bottom:1px solid #ccc;height:24px;"></div>
        </div>
        <div style="flex:1;border:1px solid #ddd;border-radius:8px;padding:16px;">
          <div style="font-size:10px;color:#888;margin-bottom:8px;">Tasa de conversión</div>
          <div style="border-bottom:1px solid #ccc;height:24px;"></div>
        </div>
      </div>
    `;

    html += hr;
    html += `<div style="text-align:center;font-size:10px;color:#aaa;margin-top:16px;">Secretos de Ventas — Price Shoes</div>`;

    el.innerHTML = html;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: "mi-plan-semanal.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "letter", orientation: "portrait" as const },
    };

    await html2pdf().set(opt).from(el).save();
  };

  return (
    <div className="pt-20 pb-16 min-h-screen bg-muted/30">
      <div className="max-w-3xl mx-auto px-4">
        <h1 className="text-3xl sm:text-4xl font-display font-bold mb-2 gradient-text">Mi Planeador Semanal</h1>
        <p className="text-muted-foreground mb-2">Tu plan de ventas de la semana</p>
        <p className="text-sm text-muted-foreground mb-8">Dinos tu meta y nosotros te decimos exactamente qué hacer cada día.</p>

        {/* Step 1: Inputs */}
        <div className="bg-card rounded-2xl p-6 shadow-lg border border-border mb-8">
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold mb-1">¿Cuánto quieres ganar esta semana?</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <input
                  value={goal}
                  onChange={(e) => { setGoal(e.target.value); setCalculated(false); }}
                  type="number"
                  placeholder="5,000"
                  className="w-full rounded-xl border border-input bg-background pl-7 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-1">Precio promedio de una venta</label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">$</span>
                <input
                  value={ticket}
                  onChange={(e) => { setTicket(e.target.value); setCalculated(false); }}
                  type="number"
                  placeholder="500"
                  className="w-full rounded-xl border border-input bg-background pl-7 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
            </div>
          </div>
          <Button variant="gradient" onClick={calculate} className="w-full" disabled={!goalNum || !ticketNum}>
            <Calculator className="w-4 h-4 mr-2" /> Calcular mi plan
          </Button>
        </div>

        {/* Step 2: Results */}
        {calculated && (
          <div className="animate-fade-in-up space-y-8">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { icon: Target, label: "Ventas necesarias", value: salesNeeded },
                { icon: Users, label: "Clientas a contactar", value: clientsNeeded },
                { icon: Users, label: "Clientas por día", value: clientsPerDay },
                { icon: Smartphone, label: "Estados por semana", value: statusPerWeek },
              ].map((s, i) => (
                <div key={i} className="bg-card rounded-xl p-4 border border-border text-center">
                  <s.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="text-2xl font-display font-bold gradient-text">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </div>
              ))}
            </div>

            <div className="gradient-bg rounded-2xl p-5 text-center text-primary-foreground">
              <p className="text-sm">
                Para ganar <strong>${goalNum.toLocaleString()}</strong> esta semana necesitas contactar{" "}
                <strong>{clientsNeeded} clientas</strong> — son solo <strong>{clientsPerDay} por día</strong>.
                Tú puedes 💪
              </p>
            </div>

            {/* Step 3: Detailed Weekly Plan */}
            <div>
              <div className="gradient-bg rounded-t-2xl p-4">
                <h3 className="font-display font-bold text-primary-foreground">📅 Tu plan de la semana</h3>
              </div>

              <div className="space-y-0">
                {weekData.map((day, dayIdx) => {
                  const status = dayStatuses[dayIdx];
                  const visible = visibleCounts[dayIdx] || day.clients.length;
                  const hasMore = day.clients.length > visible;
                  const filled = filledCount(dayIdx);
                  const isExpanded = expandedDays[dayIdx];

                  return (
                    <div key={dayIdx} className="bg-card border border-border border-t-0 last:rounded-b-2xl overflow-hidden">
                      {/* Day Header */}
                      <button
                        onClick={() => toggleDay(dayIdx)}
                        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-display font-bold text-base">{days[dayIdx]}</span>
                          <span className="text-xs gradient-bg text-primary-foreground px-3 py-1 rounded-full font-semibold">
                            {day.targetClients} clientas
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{filled}/{day.targetClients}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                        </div>
                      </button>

                      {/* Status Banner */}
                      <div className={cn(
                        "mx-4 mb-3 rounded-lg px-4 py-2.5 text-sm font-medium",
                        "bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 border border-primary/20"
                      )}>
                        <span className="mr-1">{status.emoji}</span>
                        Estado: <strong>{status.label}</strong> — {status.desc}
                      </div>

                      {/* Client Rows */}
                      {isExpanded && (
                        <div className="px-4 pb-4 space-y-2">
                          {day.clients.slice(0, visible).map((client, rowIdx) => (
                            <div key={rowIdx} className="flex items-center gap-2">
                              <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                                {rowIdx + 1}
                              </span>
                              <input
                                value={client.name}
                                onChange={(e) => updateClientRow(dayIdx, rowIdx, "name", e.target.value)}
                                placeholder="Nombre de la clienta..."
                                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                              />
                              <select
                                value={client.strategy}
                                onChange={(e) => updateClientRow(dayIdx, rowIdx, "strategy", e.target.value)}
                                className="rounded-lg border border-input bg-background px-2 py-2 text-xs max-w-[180px]"
                              >
                                {strategyOptions.map((s) => (
                                  <option key={s} value={s}>{s}</option>
                                ))}
                              </select>
                            </div>
                          ))}

                          {hasMore && (
                            <button
                              onClick={() => addMoreRows(dayIdx)}
                              className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline mt-2"
                            >
                              <Plus className="w-3 h-3" /> Mostrar más clientas
                            </button>
                          )}

                          {/* Mini summary */}
                          <div className="text-right pt-2 border-t border-border mt-3">
                            <span className={cn(
                              "text-xs font-semibold",
                              filled >= day.targetClients ? "text-green-600" : "text-muted-foreground"
                            )}>
                              {filled} de {day.targetClients} clientas planeadas
                              {filled >= day.targetClients && " ✅"}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Results */}
            <div className="bg-card rounded-2xl p-6 shadow-lg border border-border">
              <h3 className="font-display font-bold text-lg mb-4">📊 Mi resultado de la semana</h3>
              <div className="grid sm:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold mb-1">¿Cuántas clientas respondieron?</label>
                  <input
                    value={responded}
                    onChange={(e) => setResponded(e.target.value)}
                    type="number"
                    placeholder="0"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1">¿Cuántas ventas cerraste?</label>
                  <input
                    value={sales}
                    onChange={(e) => setSales(e.target.value)}
                    type="number"
                    placeholder="0"
                    className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>
              {respondedNum > 0 && (
                <div className="bg-muted rounded-xl p-4 text-center animate-fade-in-up">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    <span className="text-2xl font-display font-bold gradient-text">{conversionRate}%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">Tu tasa de conversión (esperado: 20%)</p>
                  <p className="text-sm font-semibold mt-2 text-primary">
                    {parseFloat(conversionRate) >= 20 ? "¡Increíble! Estás por encima del promedio 🎉" : "¡Vas por buen camino! Sigue practicando 💪"}
                  </p>
                </div>
              )}
            </div>

            <Button variant="gradient" className="w-full" onClick={handleDownloadPDF}>
              <Download className="w-4 h-4 mr-2" /> Descargar mi plan en PDF
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyPlanner;
