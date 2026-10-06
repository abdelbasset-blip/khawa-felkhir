import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export const errorHandler = (
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (err instanceof ZodError) {
    const formattedErrors = err.errors.map((e) => ({
      field: e.path.join("."),
      message: e.message,
    }));

    res.status(400).json({
      success: false,
      message: "Données de formulaire invalides",
      errors: formattedErrors,
    });
    return;
  }

  const error = err as Error;
  console.error("[ServerError]:", error.stack || error.message);

  res.status(500).json({
    success: false,
    message: "Une erreur interne est survenue sur le serveur",
  });
};
