import { createApp } from "./app";
import { env } from "./config/env";
import { prisma } from "./config/prisma";

const startServer = async (): Promise<void> => {
  try {
    // Vérification de la connexion à la base de données PostgreSQL
    await prisma.$connect();
    console.log("✅ Connexion à PostgreSQL établie avec succès via Prisma.");

    const app = createApp();

    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Serveur Khawa démarré sur http://localhost:${env.PORT}`);
      console.log(`📡 Environnement : ${env.NODE_ENV}`);
    });

    // Arrêt gracieux (Graceful Shutdown)
    const shutdown = async (signal: string) => {
      console.log(`\n🛑 Signal ${signal} reçu. Arrêt du serveur en cours...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log("🔒 Déconnexion de la base de données terminée.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (error) {
    console.error("❌ Échec critique au démarrage du serveur :", error);
    await prisma.$disconnect();
    process.exit(1);
  }
};

startServer();
