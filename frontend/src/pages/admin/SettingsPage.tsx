import React, { useEffect, useState } from "react";
import {
  Building2,
  Bell,
  ShieldCheck,
  Save,
  CheckCircle2,
  AlertCircle,
  UserPlus,
  Trash2,
  Shield,
  UserCheck,
  Mail,
  Phone,
  Globe,
  MapPin,
  CreditCard,
  Share2,
  Users,
  Loader2,
  X,
} from "lucide-react";
import {
  getSettings,
  updateSettings,
  getTeamUsers,
  createTeamUser,
  updateTeamUser,
  deleteTeamUser,
} from "../../services/settings.api";
import { AssociationSettings, TeamUser, Role } from "../../types/settings";
import { useAuthStore } from "../../store/auth.store";

export const SettingsPage: React.FC = () => {
  const { user: currentUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<"general" | "notifications" | "permissions">("general");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Settings Form State
  const [settings, setSettings] = useState<AssociationSettings | null>(null);

  // Team Users State
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    role: "MODERATOR" as Role,
  });
  const [addingUser, setAddingUser] = useState(false);
  const [userModalError, setUserModalError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [settingsData, usersData] = await Promise.all([
        getSettings(),
        getTeamUsers(),
      ]);
      setSettings(settingsData);
      setTeamUsers(usersData);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Erreur de chargement des paramètres.");
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg: string) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  const handleInputChange = (field: keyof AssociationSettings, value: any) => {
    if (!settings) return;
    setSettings({
      ...settings,
      [field]: value,
    });
  };

  const handleSaveSettings = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!settings) return;

    try {
      setSaving(true);
      setErrorMessage(null);
      const updated = await updateSettings(settings);
      setSettings(updated);
      showSuccess("Paramètres enregistrés et synchronisés avec succès.");
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || "Erreur lors de l'enregistrement des paramètres."
      );
    } finally {
      setSaving(false);
    }
  };

  // User Actions
  const handleToggleUserRole = async (targetUser: TeamUser) => {
    const newRole: Role = targetUser.role === "ADMIN" ? "MODERATOR" : "ADMIN";
    try {
      await updateTeamUser(targetUser.id, { role: newRole });
      setTeamUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, role: newRole } : u))
      );
      showSuccess(`Rôle de ${targetUser.firstName} ${targetUser.lastName} modifié en ${newRole}.`);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Impossible de modifier le rôle.");
    }
  };

  const handleToggleUserStatus = async (targetUser: TeamUser) => {
    const newStatus = !targetUser.isActive;
    try {
      await updateTeamUser(targetUser.id, { isActive: newStatus });
      setTeamUsers((prev) =>
        prev.map((u) => (u.id === targetUser.id ? { ...u, isActive: newStatus } : u))
      );
      showSuccess(
        `Compte de ${targetUser.firstName} ${targetUser.lastName} ${newStatus ? "activé" : "suspendu"}.`
      );
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Impossible de modifier le statut.");
    }
  };

  const handleDeleteUser = async (targetUser: TeamUser) => {
    if (
      !window.confirm(
        `Êtes-vous certain de vouloir supprimer le compte de ${targetUser.firstName} ${targetUser.lastName} ?`
      )
    ) {
      return;
    }

    try {
      await deleteTeamUser(targetUser.id);
      setTeamUsers((prev) => prev.filter((u) => u.id !== targetUser.id));
      showSuccess(`Compte de ${targetUser.firstName} ${targetUser.lastName} supprimé.`);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || "Impossible de supprimer l'utilisateur.");
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserModalError(null);

    if (
      !userFormData.firstName ||
      !userFormData.lastName ||
      !userFormData.email ||
      !userFormData.password
    ) {
      setUserModalError("Tous les champs sont obligatoires.");
      return;
    }

    try {
      setAddingUser(true);
      const newUser = await createTeamUser(userFormData);
      setTeamUsers((prev) => [...prev, newUser]);
      setIsAddUserModalOpen(false);
      setUserFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: "MODERATOR",
      });
      showSuccess(`Collaborateur ${newUser.firstName} ${newUser.lastName} ajouté avec succès.`);
    } catch (err: any) {
      setUserModalError(err.response?.data?.message || "Erreur lors de la création du compte.");
    } finally {
      setAddingUser(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="text-muted-foreground text-sm font-medium">Chargement des paramètres de l'association...</p>
      </div>
    );
  }

  if (!settings) {
    return (
      <div className="p-8 text-center bg-card rounded-2xl border border-border">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <p className="text-foreground font-semibold">Impossible de récupérer les paramètres.</p>
        <button
          onClick={fetchData}
          className="mt-4 px-4 py-2 bg-emerald-600 text-white rounded-xl text-sm font-medium hover:bg-emerald-700"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Banner / Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-card p-6 rounded-2xl border border-border shadow-sm">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Paramètres de l'Association</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                Configuration des coordonnées officielles, des notifications en temps réel et de la gouvernance d'équipe.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSaveSettings()}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-600/20 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? "Enregistrement..." : "Enregistrer les modifications"}</span>
          </button>
        </div>
      </div>

      {/* Notifications / Alerts feedback */}
      {successMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-sm font-medium animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm font-medium animate-in fade-in">
          <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="ml-auto text-rose-400 hover:text-rose-600">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Tabs navigation */}
      <div className="flex border-b border-border bg-card rounded-xl p-1 gap-1">
        <button
          onClick={() => setActiveTab("general")}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "general"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Coordonnées & Siège</span>
        </button>

        <button
          onClick={() => setActiveTab("notifications")}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "notifications"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Alertes & Notifications</span>
        </button>

        <button
          onClick={() => setActiveTab("permissions")}
          className={`flex items-center gap-2.5 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
            activeTab === "permissions"
              ? "bg-emerald-600 text-white shadow-sm"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Permissions & Équipe ({teamUsers.length})</span>
        </button>
      </div>

      {/* TAB 1: COORDONNÉES & SIÈGE */}
      {activeTab === "general" && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* Identité légale */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-5">
            <div className="border-b border-border pb-3 flex items-center gap-2 text-foreground font-bold">
              <Building2 className="w-5 h-5 text-emerald-600" />
              <h2>Identité Légale & Statutaire</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Nom officiel de l'association *</label>
                <input
                  type="text"
                  required
                  value={settings.nom}
                  onChange={(e) => handleInputChange("nom", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Sigle officiel *</label>
                <input
                  type="text"
                  required
                  value={settings.sigle}
                  onChange={(e) => handleInputChange("sigle", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Numéro RNA / Enregistrement *</label>
                <input
                  type="text"
                  required
                  value={settings.rna}
                  onChange={(e) => handleInputChange("rna", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Matricule Fiscal *</label>
                <input
                  type="text"
                  required
                  value={settings.matriculeFiscal}
                  onChange={(e) => handleInputChange("matriculeFiscal", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Site Web Officiel</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                  <input
                    type="url"
                    value={settings.siteWeb}
                    onChange={(e) => handleInputChange("siteWeb", e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Description & Mission d'utilité publique</label>
                <textarea
                  rows={2}
                  value={settings.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Contact & Siège */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-5">
            <div className="border-b border-border pb-3 flex items-center gap-2 text-foreground font-bold">
              <MapPin className="w-5 h-5 text-emerald-600" />
              <h2>Coordonnées & Siège Social</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Adresse du siège *</label>
                <input
                  type="text"
                  required
                  value={settings.adresse}
                  onChange={(e) => handleInputChange("adresse", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Code Postal *</label>
                <input
                  type="text"
                  required
                  value={settings.codePostal}
                  onChange={(e) => handleInputChange("codePostal", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Ville *</label>
                <input
                  type="text"
                  required
                  value={settings.ville}
                  onChange={(e) => handleInputChange("ville", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Gouvernorat *</label>
                <input
                  type="text"
                  required
                  value={settings.gouvernorat}
                  onChange={(e) => handleInputChange("gouvernorat", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Email officiel de contact *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={settings.emailContact}
                    onChange={(e) => handleInputChange("emailContact", e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Téléphone principal (Fixe) *</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={settings.telephone}
                    onChange={(e) => handleInputChange("telephone", e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Téléphone d'urgence (Terrain)</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                  <input
                    type="text"
                    value={settings.telephoneUrgence || ""}
                    onChange={(e) => handleInputChange("telephoneUrgence", e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Données Bancaires pour les Dons */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-5">
            <div className="border-b border-border pb-3 flex items-center gap-2 text-foreground font-bold">
              <CreditCard className="w-5 h-5 text-emerald-600" />
              <h2>Coordonnées Bancaires & Reçus Fiscaux de Dons</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Établissement Bancaire Partenaire *</label>
                <input
                  type="text"
                  required
                  value={settings.banqueNom}
                  onChange={(e) => handleInputChange("banqueNom", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">RIB Bancaire Officiel (format IBAN) *</label>
                <input
                  type="text"
                  required
                  value={settings.ribBancaire}
                  onChange={(e) => handleInputChange("ribBancaire", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Réseaux Sociaux */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-5">
            <div className="border-b border-border pb-3 flex items-center gap-2 text-foreground font-bold">
              <Share2 className="w-5 h-5 text-emerald-600" />
              <h2>Présence en Ligne & Réseaux Sociaux</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Page Facebook</label>
                <input
                  type="url"
                  placeholder="https://facebook.com/..."
                  value={settings.facebook || ""}
                  onChange={(e) => handleInputChange("facebook", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Compte Instagram</label>
                <input
                  type="url"
                  placeholder="https://instagram.com/..."
                  value={settings.instagram || ""}
                  onChange={(e) => handleInputChange("instagram", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground">Page LinkedIn</label>
                <input
                  type="url"
                  placeholder="https://linkedin.com/company/..."
                  value={settings.linkedin || ""}
                  onChange={(e) => handleInputChange("linkedin", e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
            </div>
          </div>
        </form>
      )}

      {/* TAB 2: NOTIFICATIONS & ALERTES */}
      {activeTab === "notifications" && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-6">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground font-bold">
                <Bell className="w-5 h-5 text-emerald-600" />
                <h2>Canaux et Déclencheurs d'Alertes</h2>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-600 font-semibold px-2.5 py-1 rounded-full">
                Temps Réel
              </span>
            </div>

            <div className="max-w-md space-y-1.5">
              <label className="text-xs font-semibold text-muted-foreground">
                Adresse email de réception des notifications critiques *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
                <input
                  type="email"
                  required
                  value={settings.emailNotifications}
                  onChange={(e) => handleInputChange("emailNotifications", e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Les alertes système et les synthèses hebdomadaires seront délivrées à cette boîte de messagerie.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border">
              {/* Toggle 1 */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/80 bg-background/50 hover:bg-muted/30 transition-colors">
                <div className="space-y-0.5 max-w-xl">
                  <div className="text-sm font-semibold text-foreground">
                    Nouvelle inscription bénévole sur une action
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Envoi instantané d'un email dès qu'un bénévole s'enregistre via la vitrine publique sur un événement caritatif.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifNouvelleInscription}
                    onChange={(e) => handleInputChange("notifNouvelleInscription", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Toggle 2 */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/80 bg-background/50 hover:bg-muted/30 transition-colors">
                <div className="space-y-0.5 max-w-xl">
                  <div className="text-sm font-semibold text-foreground">
                    Nouveau message de contact reçu
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Alerte par email lors de la soumission d'une demande citoyenne ou d'un mécénat via le formulaire de contact.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifNouveauMessage}
                    onChange={(e) => handleInputChange("notifNouveauMessage", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Toggle 3 */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/80 bg-background/50 hover:bg-muted/30 transition-colors">
                <div className="space-y-0.5 max-w-xl">
                  <div className="text-sm font-semibold text-foreground">
                    Rappel avant démarrage d'événement (48h)
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Notification automatique pour préparer la logistique, la liste d'émargement et les kits de matériel.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifRappelEvenement}
                    onChange={(e) => handleInputChange("notifRappelEvenement", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Toggle 4 */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/80 bg-background/50 hover:bg-muted/30 transition-colors">
                <div className="space-y-0.5 max-w-xl">
                  <div className="text-sm font-semibold text-foreground">
                    Alerte accumulation de bénéficiaires en attente
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Notification de rappel lorsque plus de 10 dossiers d'aide familiale restent sans validation au-delà de 7 jours.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.notifSeuilBeneficiaires}
                    onChange={(e) => handleInputChange("notifSeuilBeneficiaires", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Toggle 5 */}
              <div className="flex items-center justify-between p-4 rounded-xl border border-border/80 bg-background/50 hover:bg-muted/30 transition-colors">
                <div className="space-y-0.5 max-w-xl">
                  <div className="text-sm font-semibold text-foreground">
                    Digest récapitulatif hebdomadaire (Lundi 08h00)
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Rapport d'activité consolidé par email résumant les inscriptions, les aides accordées et les nouveaux contacts.
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.emailDigestHebdomadaire}
                    onChange={(e) => handleInputChange("emailDigestHebdomadaire", e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: PERMISSIONS & ÉQUIPE */}
      {activeTab === "permissions" && (
        <div className="space-y-6">
          {/* Règles globales accordées aux modérateurs */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
            <div className="border-b border-border pb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-foreground font-bold">
                <Shield className="w-5 h-5 text-emerald-600" />
                <h2>Règles de Gouvernance & Rôles Système</h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 rounded-full">
                Politique Globale
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Les utilisateurs disposant du rôle <span className="font-semibold text-foreground">ADMIN</span> bénéficient d'un accès sans restriction. Définissez ci-dessous les autorisations concédées aux membres avec le rôle <span className="font-semibold text-foreground">MODERATOR</span> :
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl border border-border bg-background space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Validation Bénéficiaires</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.moderatorCanValidateBeneficiaires}
                      onChange={(e) =>
                        handleInputChange("moderatorCanValidateBeneficiaires", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Permet aux modérateurs de valider des dossiers de familles et d'attribuer le statut d'aide.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Publication d'Événements</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.moderatorCanPublishEvents}
                      onChange={(e) =>
                        handleInputChange("moderatorCanPublishEvents", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Permet aux modérateurs de passer les événements en statut 'Publié' sur la vitrine publique.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-border bg-background space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-foreground">Export CSV des Données</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.moderatorCanExportData}
                      onChange={(e) =>
                        handleInputChange("moderatorCanExportData", e.target.checked)
                      }
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-muted peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                  </label>
                </div>
                <p className="text-xs text-muted-foreground">
                  Autorise le téléchargement des fichiers CSV de bénéficiaires contenant des données personnelles (CIN, adresses).
                </p>
              </div>
            </div>
          </div>

          {/* Liste des Membres de l'Équipe */}
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-600" />
                <h2 className="text-lg font-bold text-foreground">Membres de l'Équipe & Gestionnaires</h2>
              </div>

              <button
                onClick={() => setIsAddUserModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
              >
                <UserPlus className="w-4 h-4" />
                <span>Inviter un collaborateur</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-xs uppercase tracking-wider">
                    <th className="py-3 px-4">Collaborateur</th>
                    <th className="py-3 px-4">Email</th>
                    <th className="py-3 px-4">Rôle</th>
                    <th className="py-3 px-4">Statut</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {teamUsers.map((member) => {
                    const isSelf = member.id === currentUser?.id;
                    return (
                      <tr key={member.id} className="hover:bg-muted/30 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-emerald-600/10 text-emerald-700 dark:text-emerald-300 font-bold flex items-center justify-center text-xs">
                              {member.firstName.charAt(0)}
                              {member.lastName.charAt(0)}
                            </div>
                            <div>
                              <div className="font-semibold text-foreground flex items-center gap-1.5">
                                <span>{member.firstName} {member.lastName}</span>
                                {isSelf && (
                                  <span className="text-[10px] bg-emerald-500/10 text-emerald-600 font-semibold px-2 py-0.5 rounded-full">
                                    Vous
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                Créé le {new Date(member.createdAt).toLocaleDateString("fr-FR")}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-xs text-muted-foreground">
                          {member.email}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              member.role === "ADMIN"
                                ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20"
                                : "bg-blue-500/10 text-blue-700 dark:text-blue-400 border border-blue-500/20"
                            }`}
                          >
                            <Shield className="w-3 h-3" />
                            {member.role === "ADMIN" ? "Administrateur" : "Modérateur"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              member.isActive
                                ? "bg-emerald-500/10 text-emerald-600"
                                : "bg-rose-500/10 text-rose-600"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                member.isActive ? "bg-emerald-500" : "bg-rose-500"
                              }`}
                            />
                            {member.isActive ? "Actif" : "Suspendu"}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleUserRole(member)}
                              title={`Basculer en ${member.role === "ADMIN" ? "Modérateur" : "Administrateur"}`}
                              className="px-2.5 py-1 bg-muted hover:bg-muted/80 text-foreground rounded-lg text-xs font-medium transition-colors"
                            >
                              Changer rôle
                            </button>

                            <button
                              onClick={() => handleToggleUserStatus(member)}
                              title={member.isActive ? "Suspendre l'accès" : "Réactiver l'accès"}
                              className={`p-1.5 rounded-lg text-xs font-medium transition-colors ${
                                member.isActive
                                  ? "text-amber-600 hover:bg-amber-500/10"
                                  : "text-emerald-600 hover:bg-emerald-500/10"
                              }`}
                            >
                              <UserCheck className="w-4 h-4" />
                            </button>

                            {!isSelf && (
                              <button
                                onClick={() => handleDeleteUser(member)}
                                title="Supprimer le collaborateur"
                                className="p-1.5 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: INVITER UN NOUVEAU MEMBRE */}
      {isAddUserModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2 text-foreground font-bold text-lg">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                <h3>Nouveau Collaborateur</h3>
              </div>
              <button
                onClick={() => setIsAddUserModalOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {userModalError && (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 rounded-xl text-rose-700 dark:text-rose-200 text-xs font-medium">
                {userModalError}
              </div>
            )}

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Prénom *</label>
                  <input
                    type="text"
                    required
                    value={userFormData.firstName}
                    onChange={(e) =>
                      setUserFormData({ ...userFormData, firstName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-muted-foreground">Nom *</label>
                  <input
                    type="text"
                    required
                    value={userFormData.lastName}
                    onChange={(e) =>
                      setUserFormData({ ...userFormData, lastName: e.target.value })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Adresse Email *</label>
                <input
                  type="email"
                  required
                  value={userFormData.email}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, email: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Mot de passe temporaire *</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  placeholder="Min. 8 caractères"
                  value={userFormData.password}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, password: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-muted-foreground">Rôle attribué *</label>
                <select
                  value={userFormData.role}
                  onChange={(e) =>
                    setUserFormData({ ...userFormData, role: e.target.value as Role })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                >
                  <option value="MODERATOR">Modérateur (Droits restreints)</option>
                  <option value="ADMIN">Administrateur (Tous les droits)</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddUserModalOpen(false)}
                  className="px-4 py-2 border border-border rounded-xl text-sm font-medium hover:bg-muted"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={addingUser}
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm disabled:opacity-50 flex items-center gap-2"
                >
                  {addingUser && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Créer le compte</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
