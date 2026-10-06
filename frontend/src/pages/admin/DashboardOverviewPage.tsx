import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Users,
  CalendarHeart,
  Coins,
  HandHeart,
  TrendingUp,
  MapPin,
  Calendar,
  Clock,
  ArrowUpRight,
  PlusCircle,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  Gift,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { motion } from "framer-motion";

// Données mensuelles d'aides distribuées (12 mois)
const monthlyAidsData = [
  { month: "Nov", budget: 14200, familles: 180 },
  { month: "Déc", budget: 22400, familles: 290 },
  { month: "Jan", budget: 19500, familles: 240 },
  { month: "Fév", budget: 18000, familles: 210 },
  { month: "Mar", budget: 35000, familles: 420 }, // Période Ramadan
  { month: "Avr", budget: 48500, familles: 580 }, // Aïd el-Fitr
  { month: "Mai", budget: 24000, familles: 310 },
  { month: "Juin", budget: 21500, familles: 270 },
  { month: "Juil", budget: 19800, familles: 230 },
  { month: "Août", budget: 32000, familles: 390 }, // Rentrée scolaire
  { month: "Sep", budget: 41200, familles: 490 },
  { month: "Oct", budget: 48500, familles: 540 },
];

// Répartition par type d'événement
const eventTypeData = [
  { name: "Paniers Alimentaires", value: 42, color: "#059669" }, // Emerald 600
  { name: "Caravanes Médicales", value: 26, color: "#0284c7" },  // Sky 600
  { name: "Rentrée Scolaire", value: 18, color: "#d97706" },     // Amber 600
  { name: "Urgences & Hiver", value: 14, color: "#e11d48" },     // Rose 600
];

// Prochains événements caritatifs programmés
const upcomingEvents = [
  {
    id: "evt-1",
    title: "Distribution Colis Hivernal 2026",
    category: "Urgences & Hiver",
    date: "12 Oct 2026",
    location: "Kasserine & Régions Nord-Ouest",
    progress: 85,
    collected: "17,000 DT",
    target: "20,000 DT",
    status: "CONFIRMED",
    volunteers: 34,
  },
  {
    id: "evt-2",
    title: "Caravane Médicale Ophtalmologique",
    category: "Santé & Médical",
    date: "25 Oct 2026",
    location: "Centre de Santé Sidi Bouzid",
    progress: 60,
    collected: "6,000 DT",
    target: "10,000 DT",
    status: "IN_PROGRESS",
    volunteers: 18,
  },
  {
    id: "evt-3",
    title: "Rénovation École Rurale 'El Nour'",
    category: "Éducation & Jeunesse",
    date: "08 Nov 2026",
    location: "Zaghouan",
    progress: 40,
    collected: "12,000 DT",
    target: "30,000 DT",
    status: "IN_PROGRESS",
    volunteers: 25,
  },
];

// Notifications & Journal d'activités récentes
const recentActivities = [
  {
    id: "act-1",
    type: "BENEFICIARY",
    title: "Nouveau bénéficiaire validé",
    description: "Famille Trabelsi (5 personnes) ajoutée au registre prioritaire.",
    timestamp: "Il y a 14 min",
    icon: CheckCircle2,
    badgeColor: "text-emerald-500 bg-emerald-500/10",
  },
  {
    id: "act-2",
    type: "DONATION",
    title: "Don en ligne reçu",
    description: "+1,500 DT versés via virement pour la Caravane Médicale.",
    timestamp: "Il y a 45 min",
    icon: Gift,
    badgeColor: "text-amber-500 bg-amber-500/10",
  },
  {
    id: "act-3",
    type: "ALERT",
    title: "Stock de couvertures critique",
    description: "Plus que 45 unités disponibles pour l'action Hiver.",
    timestamp: "Il y a 2h",
    icon: AlertTriangle,
    badgeColor: "text-rose-500 bg-rose-500/10",
  },
  {
    id: "act-4",
    type: "VOLUNTEER",
    title: "3 nouveaux bénévoles",
    description: "Inscriptions approuvées pour l'antenne Grand Tunis.",
    timestamp: "Il y a 5h",
    icon: Users,
    badgeColor: "text-sky-500 bg-sky-500/10",
  },
];

export const DashboardOverviewPage: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState<"budget" | "familles">("budget");

  // 4 Cartes KPI principales
  const kpis = [
    {
      title: "Bénéficiaires Total",
      value: "1,428",
      subtext: "Familles prises en charge",
      trend: "+12.4%",
      isPositive: true,
      icon: Users,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-emerald-500/10 border-emerald-500/20",
    },
    {
      title: "Événements Actifs",
      value: "6",
      subtext: "3 actions terrain ce mois",
      trend: "+2 lancés",
      isPositive: true,
      icon: CalendarHeart,
      color: "text-sky-600 dark:text-sky-400",
      bg: "bg-sky-500/10 border-sky-500/20",
    },
    {
      title: "Dons & Fonds Reçus",
      value: "48,500 DT",
      subtext: "Objectif annuel à 78%",
      trend: "+18.2%",
      isPositive: true,
      icon: Coins,
      color: "text-amber-600 dark:text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
    {
      title: "Bénévoles Actifs",
      value: "124",
      subtext: "Mobilisés sur tout le territoire",
      trend: "+8 ce mois",
      isPositive: true,
      icon: HandHeart,
      color: "text-rose-600 dark:text-rose-400",
      bg: "bg-rose-500/10 border-rose-500/20",
    },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Header du Dashboard avec Titre & Actions rapides */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Tableau de Bord
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Aperçu en temps réel de l'activité caritative de <strong className="text-foreground">Khawa_felkhir</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="outline" size="sm" className="gap-2 text-xs font-semibold shadow-sm">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            Exporter Rapport
          </Button>
          <Button size="sm" className="gap-2 text-xs font-semibold shadow-md">
            <PlusCircle className="w-3.5 h-3.5" />
            Nouvelle Action
          </Button>
        </div>
      </div>

      {/* 2. Grille des 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, index) => (
          <motion.div
            key={kpi.title}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ y: -3 }}
          >
            <Card className="border border-border/70 shadow-sm hover:shadow-md transition-all relative overflow-hidden bg-card/95">
              <CardContent className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    {kpi.title}
                  </span>
                  <div className={`h-10 w-10 rounded-xl ${kpi.bg} ${kpi.color} flex items-center justify-center shrink-0 border`}>
                    <kpi.icon className="w-5 h-5" />
                  </div>
                </div>

                <div className="mt-3">
                  <div className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                    {kpi.value}
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="inline-flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                      <TrendingUp className="w-3 h-3 mr-0.5" />
                      {kpi.trend}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">{kpi.subtext}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* 3. Section Graphiques (Évolution Mensuelle + Répartition Donut) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Graphique 1 : Évolution mensuelle des aides distribuées (Area Chart Recharts) */}
        <Card className="lg:col-span-2 border-border/80 shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-2 gap-2">
            <div>
              <CardTitle className="text-lg font-bold">Évolution Mensuelle des Aides</CardTitle>
              <CardDescription>
                Montant total des dons mobilisés et aides distribuées sur les 12 derniers mois.
              </CardDescription>
            </div>
            {/* Bascule de métrique */}
            <div className="flex items-center gap-1 bg-muted p-1 rounded-xl self-start sm:self-auto">
              <button
                onClick={() => setActiveMetric("budget")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeMetric === "budget"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Budget (DT)
              </button>
              <button
                onClick={() => setActiveMetric("familles")}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  activeMetric === "familles"
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Familles
              </button>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyAidsData}
                  margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorBudget" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                    </linearGradient>
                    <linearGradient id="colorFamilles" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.15} />
                  <XAxis
                    dataKey="month"
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "currentColor", opacity: 0.6, fontSize: 12 }}
                  />
                  <YAxis
                    tickLine={false}
                    axisLine={false}
                    tick={{ fill: "currentColor", opacity: 0.6, fontSize: 12 }}
                    tickFormatter={(val) =>
                      activeMetric === "budget" ? `${val / 1000}k` : `${val}`
                    }
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-xl border border-border bg-card p-3 shadow-xl text-xs">
                            <p className="font-bold text-foreground mb-1">{label} 2026</p>
                            <p className="text-primary font-semibold">
                              {activeMetric === "budget"
                                ? `Aide mobilisée : ${payload[0].value?.toLocaleString()} DT`
                                : `Familles aidées : ${payload[0].value} foyers`}
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey={activeMetric}
                    stroke={activeMetric === "budget" ? "#059669" : "#0284c7"}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill={activeMetric === "budget" ? "url(#colorBudget)" : "url(#colorFamilles)"}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Graphique 2 : Répartition par type d'événement (Donut PieChart) */}
        <Card className="border-border/80 shadow-sm flex flex-col justify-between">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold">Répartition des Actions</CardTitle>
            <CardDescription>Par domaine d'intervention caritative.</CardDescription>
          </CardHeader>

          <CardContent className="flex-1 flex flex-col justify-center">
            <div className="h-[210px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={eventTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {eventTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: any) => [`${value}% des actions`, "Proportion"]}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      borderColor: "hsl(var(--border))",
                      borderRadius: "0.75rem",
                      fontSize: "0.75rem",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    formatter={(val) => <span className="text-xs text-foreground font-medium">{val}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
              {/* Centre de la Donut */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                <span className="text-xs text-muted-foreground font-semibold">Total</span>
                <span className="text-xl font-extrabold text-foreground">100%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Section Inférieure : "Prochains Événements" + "Notifications Récentes" */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste : Prochains Événements (2 colonnes) */}
        <Card className="lg:col-span-2 border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-bold">Prochaines Actions Caritatives</CardTitle>
              <CardDescription>Campagnes planifiées avec suivi de budget et bénévoles.</CardDescription>
            </div>
            <Button variant="ghost" size="sm" className="text-xs text-primary font-semibold gap-1">
              Voir tout <ArrowUpRight className="w-3.5 h-3.5" />
            </Button>
          </CardHeader>

          <CardContent className="space-y-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 rounded-xl border border-border/60 bg-card/60 hover:bg-muted/40 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-bold text-sm text-foreground truncate">{event.title}</h4>
                    <Badge variant={event.status === "CONFIRMED" ? "success" : "warning"}>
                      {event.status === "CONFIRMED" ? "Confirmé" : "En cours"}
                    </Badge>
                    <span className="text-xs font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                      {event.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-primary" />
                      {event.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-amber-500" />
                      {event.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-sky-500" />
                      {event.volunteers} bénévoles
                    </span>
                  </div>
                </div>

                {/* Barre de progression budget collecté */}
                <div className="w-full sm:w-44 shrink-0 space-y-1">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-foreground">{event.collected}</span>
                    <span className="text-muted-foreground">Obj: {event.target}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full bg-primary transition-all duration-500"
                      style={{ width: `${event.progress}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-right block text-muted-foreground font-medium">
                    {event.progress}% financé
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notifications & Journal d'activités (1 colonne) */}
        <Card className="border-border/80 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle className="text-lg font-bold">Activité Récente</CardTitle>
              <CardDescription>Flux en direct des opérations.</CardDescription>
            </div>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>

          <CardContent className="space-y-4">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div
                  className={`h-8 w-8 rounded-xl ${act.badgeColor} flex items-center justify-center shrink-0 mt-0.5 border border-current/20`}
                >
                  <act.icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-foreground truncate">{act.title}</p>
                  <p className="text-muted-foreground text-[11px] line-clamp-2 mt-0.5">
                    {act.description}
                  </p>
                  <span className="text-[10px] text-muted-foreground/70 mt-1 block">
                    {act.timestamp}
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
