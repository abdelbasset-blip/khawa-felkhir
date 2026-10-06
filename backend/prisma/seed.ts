import { Role } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma as prismaInstance } from "../src/config/prisma";

// Casting souple pour synchroniser l'IDE instantanément sans redémarrage du serveur TS
const prisma = prismaInstance as any;

async function main() {
  const adminEmail = "admin@khawa-felkhir.org";
  const defaultPassword = "AdminPassword123!";

  console.log("🌱 Début du peuplement de la base de données (Seed)...");

  // 1. Administrateur
  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(defaultPassword, salt);

    const admin = await prisma.user.create({
      data: {
        email: adminEmail,
        passwordHash,
        firstName: "Admin",
        lastName: "Khawa",
        role: Role.ADMIN,
        isActive: true,
      },
    });
    console.log(`✅ Compte admin créé : ${admin.email}`);
  }

  // 1.b Modérateur de test
  const modEmail = "moderateur@khawa-felkhir.org";
  const existingMod = await prisma.user.findUnique({
    where: { email: modEmail },
  });

  if (!existingMod) {
    const salt = await bcrypt.genSalt(10);
    const modPasswordHash = await bcrypt.hash("Moderateur123!", salt);
    await prisma.user.create({
      data: {
        email: modEmail,
        passwordHash: modPasswordHash,
        firstName: "Sarra",
        lastName: "Trabelsi",
        role: Role.MODERATOR,
        isActive: true,
      },
    });
    console.log(`✅ Compte modérateur créé : ${modEmail}`);
  }

  // 1.c Paramètres de l'Association
  await prisma.associationSetting.upsert({
    where: { id: "default" },
    update: {},
    create: {
      id: "default",
      nom: "Association Khawa Felkhir",
      sigle: "KFK",
      description: "Organisation caritative citoyenne dédiée au soutien des familles démunies, à l'accès aux soins et à la réussite scolaire.",
      matriculeFiscal: "1489203/M/A/000",
      rna: "2021R04821APSF1",
      emailContact: "contact@khawa-felkhir.org",
      emailNotifications: "alertes@khawa-felkhir.org",
      telephone: "+216 71 890 123",
      telephoneUrgence: "+216 98 123 456",
      adresse: "12 Rue de la Solidarité, 1002 Tunis",
      ville: "Tunis",
      gouvernorat: "Tunis",
      codePostal: "1002",
      siteWeb: "https://khawa-felkhir.org",
      ribBancaire: "TN59 1000 6035 1834 5678 9012",
      banqueNom: "Banque Nationale de Solidarité (Agence Centrale)",
      facebook: "https://facebook.com/khawafelkhir",
      instagram: "https://instagram.com/khawafelkhir",
      linkedin: "https://linkedin.com/company/khawa-felkhir",
      notifNouvelleInscription: true,
      notifNouveauMessage: true,
      notifRappelEvenement: true,
      notifSeuilBeneficiaires: true,
      emailDigestHebdomadaire: false,
      moderatorCanValidateBeneficiaires: true,
      moderatorCanPublishEvents: false,
      moderatorCanExportData: false,
    },
  });
  console.log("✅ Paramètres de l'Association initialisés.");

  // 2. Échantillon de Bénéficiaires
  const sampleBeneficiaires = [
    {
      nom: "Benali",
      prenom: "Mohamed",
      cin: "08472911",
      telephone: "98 123 456",
      adresse: "Cité El Amal, Rue 14",
      ville: "Tunis",
      situationFamiliale: "Marié(e)",
      nbEnfants: 4,
      typeAide: "alimentaire" as const,
      statut: "aide" as const,
      notes: "Famille nécessiteuse avec enfants en bas âge. Panier ramadan remis.",
    },
    {
      nom: "Trabelsi",
      prenom: "Fatma",
      cin: "09128374",
      telephone: "21 789 012",
      adresse: "Quartier Ennour, Bloc B",
      ville: "Kasserine",
      situationFamiliale: "Veuf/Veuve",
      nbEnfants: 3,
      typeAide: "medical" as const,
      statut: "valide" as const,
      notes: "Nécessite des médicaments chroniques (diabète et tension).",
    },
    {
      nom: "Gharbi",
      prenom: "Kamel",
      cin: "07564821",
      telephone: "55 654 321",
      adresse: "Hay Ezzouhour, Rue des Oliviers",
      ville: "Sidi Bouzid",
      situationFamiliale: "Marié(e)",
      nbEnfants: 2,
      typeAide: "scolaire" as const,
      statut: "en_attente" as const,
      notes: "Demande de cartables et fournitures pour le collège.",
    },
    {
      nom: "Mejri",
      prenom: "Amina",
      cin: "11048592",
      telephone: "94 321 987",
      adresse: "Avenue Habib Bourguiba, N° 45",
      ville: "Jendouba",
      situationFamiliale: "Divorcé(e)",
      nbEnfants: 1,
      typeAide: "vestimentaire" as const,
      statut: "aide" as const,
      notes: "Vêtements d'hiver et couvertures distribués lors de la vague de froid.",
    },
    {
      nom: "Hammami",
      prenom: "Rachid",
      cin: "06284910",
      telephone: "29 444 555",
      adresse: "Douar Hicher, Rue 7",
      ville: "Manouba",
      situationFamiliale: "Marié(e)",
      nbEnfants: 5,
      typeAide: "financier" as const,
      statut: "valide" as const,
      notes: "Aide ponctuelle pour facture de loyer impayée.",
    },
    {
      nom: "Cherif",
      prenom: "Salma",
      cin: "12394850",
      telephone: "50 111 222",
      adresse: "Cité Essalam, Villa 12",
      ville: "Ariana",
      situationFamiliale: "Célibataire",
      nbEnfants: 0,
      typeAide: "medical" as const,
      statut: "en_attente" as const,
      notes: "Demande de prise en charge pour consultation spécialisée.",
    },
    {
      nom: "Bouazizi",
      prenom: "Tarek",
      cin: "05839201",
      telephone: "97 888 999",
      adresse: "Route de Gabès Km 3",
      ville: "Gafsa",
      situationFamiliale: "Marié(e)",
      nbEnfants: 3,
      typeAide: "alimentaire" as const,
      statut: "aide" as const,
      notes: "Colis alimentaire trimestriel attribué.",
    },
  ];

  for (const b of sampleBeneficiaires) {
    await prisma.beneficiaire.upsert({
      where: { cin: b.cin },
      update: {},
      create: b,
    });
  }

  console.log(`✅ ${sampleBeneficiaires.length} bénéficiaires vérifiés/insérés avec succès.`);

  // 3. Échantillon d'Événements Caritatifs
  const sampleEvenements = [
    {
      titre: "Distribution Colis Hivernal 2026",
      description: "Campagne annuelle de solidarité d'hiver apportant des colis de denrées alimentaires, couvertures chaudes et chauffages d'appoint aux familles nécessiteuses des zones rurales montagneuses.",
      type: "distribution_vetements" as const,
      dateDebut: new Date("2026-10-12T08:00:00Z"),
      dateFin: new Date("2026-10-15T18:00:00Z"),
      lieu: "Kasserine & Régions Nord-Ouest",
      capaciteMax: 200,
      imageCouverture: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80",
      galerie: [
        "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=800&auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=800&auto=format&fit=crop&q=80"
      ],
      budget: 20000,
      statut: "publie" as const,
    },
    {
      titre: "Caravane Médicale Ophtalmologique & Pédiatrique",
      description: "Journée de consultations gratuites, dépistage visuel pour écoliers et distribution de lunettes correctrices et médicaments en partenariat avec des médecins bénévoles.",
      type: "aide_medicale" as const,
      dateDebut: new Date("2026-10-25T09:00:00Z"),
      dateFin: new Date("2026-10-25T17:00:00Z"),
      lieu: "Centre de Santé Sidi Bouzid",
      capaciteMax: 350,
      imageCouverture: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&auto=format&fit=crop&q=80",
      galerie: [],
      budget: 10000,
      statut: "publie" as const,
    },
    {
      titre: "Soutien Scolaire & Rénovation École 'El Nour'",
      description: "Chantier solidaire pour réhabiliter les salles de classe, installer une bibliothèque et distribuer des manuels scolaires aux élèves méritants.",
      type: "soutien_scolaire" as const,
      dateDebut: new Date("2026-11-08T08:30:00Z"),
      dateFin: new Date("2026-11-10T16:00:00Z"),
      lieu: "Zaghouan (Zone Rurale)",
      capaciteMax: 80,
      imageCouverture: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80",
      galerie: [],
      budget: 30000,
      statut: "brouillon" as const,
    },
    {
      titre: "Collecte Grand Ramadan & Paniers Solidaires",
      description: "Grande collecte citoyenne dans les supermarchés partenaires pour confectionner 1000 couffins de denrées essentielles pour le mois sacré.",
      type: "distribution_alimentaire" as const,
      dateDebut: new Date("2026-11-20T10:00:00Z"),
      dateFin: new Date("2026-11-25T20:00:00Z"),
      lieu: "Grand Tunis & Sousse",
      capaciteMax: 500,
      imageCouverture: "https://images.unsplash.com/photo-1532629345422-7515f3d16bb9?w=800&auto=format&fit=crop&q=80",
      galerie: [],
      budget: 45000,
      statut: "publie" as const,
    },
    // Phase 5 — Actions "en cours" et "passées" pour alimenter les onglets de la vitrine
    {
      titre: "Rentrée Solidaire : 500 Cartables pour nos Écoliers",
      description: "## Une rentrée digne pour chaque enfant\n\nDistribution de **cartables complets** (fournitures, tabliers, manuels) aux enfants des familles suivies par l'association.\n\n- Écoles primaires rurales\n- Kits adaptés par niveau\n- Accompagnement des parents\n\n> Chaque enfant mérite de commencer l'année avec confiance.",
      type: "soutien_scolaire" as const,
      dateDebut: new Date("2026-10-01T08:00:00Z"),
      dateFin: new Date("2026-10-20T18:00:00Z"),
      lieu: "Siliana & Le Kef",
      capaciteMax: 60,
      imageCouverture: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&auto=format&fit=crop&q=80",
      galerie: [
        "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&auto=format&fit=crop&q=80",
      ],
      budget: 15000,
      statut: "publie" as const,
    },
    {
      titre: "Iftar Collectif du Ramadan 2026",
      description: "Pendant tout le mois sacré, nos bénévoles ont servi **chaque soir** des repas chauds aux personnes isolées, aux travailleurs et aux familles en difficulté.",
      type: "evenement_religieux" as const,
      dateDebut: new Date("2026-02-18T17:00:00Z"),
      dateFin: new Date("2026-03-19T21:00:00Z"),
      lieu: "Médina de Tunis",
      capaciteMax: 120,
      imageCouverture: "https://images.unsplash.com/photo-1532375810709-75b1da00537c?w=800&auto=format&fit=crop&q=80",
      galerie: [],
      budget: 25000,
      statut: "termine" as const,
    },
    {
      titre: "Grande Collecte de Dons de Printemps",
      description: "Collecte de vêtements, produits d'hygiène et denrées non périssables au profit des familles de la région du Nord-Ouest.",
      type: "collecte_dons" as const,
      dateDebut: new Date("2026-04-10T09:00:00Z"),
      dateFin: new Date("2026-04-12T18:00:00Z"),
      lieu: "Ariana & La Marsa",
      capaciteMax: 90,
      imageCouverture: "https://images.unsplash.com/photo-1593113630400-ea4288922497?w=800&auto=format&fit=crop&q=80",
      galerie: [],
      budget: 8000,
      statut: "termine" as const,
    },
  ];

  for (const e of sampleEvenements) {
    const existing = await prisma.evenement.findFirst({
      where: { titre: e.titre }
    });
    if (!existing) {
      await prisma.evenement.create({ data: e });
    }
  }

  console.log(`✅ ${sampleEvenements.length} événements caritatifs vérifiés/insérés avec succès.`);

  // 4. Inscriptions de démonstration (barres de progression des places)
  const demoInscriptions: Record<string, number> = {
    "Distribution Colis Hivernal 2026": 132,
    "Caravane Médicale Ophtalmologique & Pédiatrique": 87,
    "Rentrée Solidaire : 500 Cartables pour nos Écoliers": 51,
    "Iftar Collectif du Ramadan 2026": 120,
    "Grande Collecte de Dons de Printemps": 64,
  };

  for (const [titre, count] of Object.entries(demoInscriptions)) {
    const evt = await prisma.evenement.findFirst({ where: { titre } });
    if (!evt) continue;
    await prisma.inscription.createMany({
      data: Array.from({ length: count }, (_, i) => ({
        evenementId: evt.id,
        nom: `Bénévole ${i + 1}`,
        email: `benevole${i + 1}@demo.khawa-felkhir.org`,
      })),
      skipDuplicates: true, // idempotent grâce à la contrainte unique (evenementId, email)
    });
  }

  console.log("✅ Inscriptions de démonstration vérifiées/insérées.");
}

main()
  .catch((e) => {
    console.error("❌ Erreur pendant le seeding :", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
