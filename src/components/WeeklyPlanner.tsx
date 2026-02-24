import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Calculator, Target, Users, Smartphone, Download, TrendingUp } from "lucide-react";

const days = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes"];
const statusPlan = ["Prueba social", "Outfit completo", "Gancho de curiosidad", "Outfit colaborativo", "El reveal"];
const strategies = ["Módulo 2", "Módulo 3", "Módulo 4"];

interface DayData {
  clients: number;
  names: string;
  strategy: string;
  statusDay: string;
}

const WeeklyPlanner = () => {
  const [goal, setGoal] = useState("");
  const [ticket, setTicket] = useState("");
  const [calculated, setCalculated] = useState(false);
  const [weekData, setWeekData] = useState<DayData[]>([]);
  const [responded, setResponded] = useState("");
  const [sales, setSales] = useState("");

  const goalNum = parseFloat(goal) || 0;
  const ticketNum = parseFloat(ticket) || 0;
  const salesNeeded = ticketNum > 0 ? Math.ceil(goalNum / ticketNum) : 0;
  const clientsNeeded = Math.ceil(salesNeeded / 0.2);
  const clientsPerDay = Math.ceil(clientsNeeded / 5);
  const statusPerWeek = Math.ceil(clientsNeeded / 3);

  const calculate = () => {
    if (!goalNum || !ticketNum) return;
    setWeekData(
      days.map((_, i) => ({
        clients: clientsPerDay,
        names: "",
        strategy: strategies[i % 3],
        statusDay: statusPlan[i],
      }))
    );
    setCalculated(true);
  };

  const respondedNum = parseInt(responded) || 0;
  const salesNum = parseInt(sales) || 0;
  const conversionRate = respondedNum > 0 ? ((salesNum / respondedNum) * 100).toFixed(1) : "0";

  const handlePrint = () => window.print();

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

            {/* Step 3: Weekly Table */}
            <div className="bg-card rounded-2xl shadow-lg border border-border overflow-hidden">
              <div className="gradient-bg p-4">
                <h3 className="font-display font-bold text-primary-foreground">📅 Tu plan de la semana</h3>
              </div>
              <div className="divide-y divide-border">
                {weekData.map((d, i) => (
                  <div key={i} className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{days[i]}</span>
                      <span className="text-xs gradient-bg text-primary-foreground px-3 py-1 rounded-full">
                        {d.clients} clientas
                      </span>
                    </div>
                    <input
                      value={d.names}
                      onChange={(e) => {
                        const n = [...weekData];
                        n[i] = { ...n[i], names: e.target.value };
                        setWeekData(n);
                      }}
                      placeholder="Nombres de clientas..."
                      className="w-full rounded-lg border border-input bg-background px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                    <div className="flex gap-2 flex-wrap">
                      <select
                        value={d.strategy}
                        onChange={(e) => {
                          const n = [...weekData];
                          n[i] = { ...n[i], strategy: e.target.value };
                          setWeekData(n);
                        }}
                        className="rounded-lg border border-input bg-background px-2 py-1 text-xs"
                      >
                        {strategies.map((s) => <option key={s}>{s}</option>)}
                      </select>
                      <span className="text-xs bg-muted px-3 py-1 rounded-lg text-muted-foreground">
                        Estado: {d.statusDay}
                      </span>
                    </div>
                  </div>
                ))}
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

            <Button variant="gradient" className="w-full" onClick={handlePrint}>
              <Download className="w-4 h-4 mr-2" /> Descargar mi plan en PDF
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyPlanner;
