import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "../../hooks/useAuth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { HeartHandshake, Lock, Mail, AlertCircle, Loader2 } from "lucide-react";

// Schéma de validation Zod du formulaire de connexion
const loginFormSchema = z.object({
  email: z
    .string()
    .min(1, "L'adresse email est requise")
    .email("Format d'email invalide"),
  password: z
    .string()
    .min(6, "Le mot de passe doit comporter au moins 6 caractères"),
});

type LoginFormData = z.infer<typeof loginFormSchema>;

export const LoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Si l'utilisateur est déjà connecté, le rediriger directement
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    const result = await login(data);
    if (!result.success) {
      setServerError(result.error || "Échec de connexion");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-secondary/50 via-background to-accent/30 p-4">
      <div className="w-full max-w-md">
        {/* En-tête de marque Khawa_felkhir */}
        <div className="flex flex-col items-center mb-6 text-center">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary mb-3 shadow-inner">
            <HeartHandshake className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
            Khawa_felkhir
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Plateforme de gestion solidaire & caritative
          </p>
        </div>

        {/* Carte de connexion */}
        <Card className="border-border/60 shadow-xl backdrop-blur-sm bg-card/95">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl font-bold">Espace Administration</CardTitle>
            <CardDescription>
              Veuillez saisir vos identifiants autorisés pour accéder au portail.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              {/* Message d'erreur serveur */}
              {serverError && (
                <div className="flex items-center gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{serverError}</span>
                </div>
              )}

              {/* Champ Email */}
              <div className="space-y-1.5">
                <Label htmlFor="email" className="flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-muted-foreground" />
                  Adresse Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@khawa-felkhir.org"
                  autoComplete="email"
                  disabled={isSubmitting}
                  {...register("email")}
                  className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-xs font-medium text-destructive mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Champ Mot de passe */}
              <div className="space-y-1.5">
                <Label htmlFor="password" className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-muted-foreground" />
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••••"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  {...register("password")}
                  className={errors.password ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.password && (
                  <p className="text-xs font-medium text-destructive mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="pt-2 flex flex-col gap-3">
              <Button
                type="submit"
                className="w-full font-semibold shadow-md gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Connexion en cours...
                  </>
                ) : (
                  "Se connecter au portail"
                )}
              </Button>

              <div className="text-center text-xs text-muted-foreground">
                Accès strictement réservé aux membres du bureau et modérateurs.
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  );
};
