import { Router } from "express";
import {
  getBeneficiaires,
  getBeneficiaireById,
  createBeneficiaire,
  updateBeneficiaire,
  deleteBeneficiaire,
  exportCsv,
} from "../controllers/beneficiaire.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

// Toutes les routes bénéficiaires requièrent d'être authentifié en tant qu'admin
router.use(requireAuth);

router.get("/export/csv", exportCsv);
router.get("/", getBeneficiaires);
router.get("/:id", getBeneficiaireById);
router.post("/", createBeneficiaire);
router.put("/:id", updateBeneficiaire);
router.delete("/:id", deleteBeneficiaire);

export default router;
