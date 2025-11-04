import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Card } from "./ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "./ui/tabs";
import { appColors } from "../utils/themes";
import { Eye, EyeOff, PawPrint } from "lucide-react";

interface AuthScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (
    email: string,
    password: string,
    clinicName: string,
  ) => Promise<void>;
}

export function AuthScreen({
  onLogin,
  onRegister,
}: AuthScreenProps) {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirmPassword, setRegisterConfirmPassword] =
    useState("");
  const [clinicName, setClinicName] = useState("");
  const [showLoginPassword, setShowLoginPassword] =
    useState(false);
  const [showRegisterPassword, setShowRegisterPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await onLogin(loginEmail, loginPassword);
    } catch (err: any) {
      console.error("Login error:", err);
      // Mensaje más claro para el usuario
      if (
        err.message?.includes("Invalid login credentials") ||
        err.message?.includes("invalid_credentials")
      ) {
        setError(
          "❌ Email o contraseña incorrectos. Si no tienes cuenta, regístrate primero.",
        );
      } else {
        setError(err.message || "Error al iniciar sesión");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (registerPassword !== registerConfirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (registerPassword.length < 6) {
      setError(
        "La contraseña debe tener al menos 6 caracteres",
      );
      return;
    }

    if (!clinicName.trim()) {
      setError("Por favor ingresa el nombre de tu veterinaria");
      return;
    }

    setLoading(true);
    try {
      await onRegister(
        registerEmail,
        registerPassword,
        clinicName,
      );
    } catch (err: any) {
      setError(err.message || "Error al registrarse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: appColors.background }}
    >
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <PawPrint
              className="w-16 h-16"
              style={{ color: appColors.green }}
            />
          </div>
          <h1
            className="text-4xl mb-2"
            style={{ color: appColors.green }}
          >
            VetManager
          </h1>
          <p
            className="text-lg"
            style={{ color: appColors.textSecondary }}
          >
            Sistema de Gestión Veterinaria
          </p>
        </div>

        <Card
          className="p-6 border-2"
          style={{
            backgroundColor: appColors.cardBackground,
            borderColor: appColors.border,
          }}
        >
          {/* Mensaje informativo */}
          <div
            className="mb-6 p-4 rounded-lg border-2"
            style={{
              backgroundColor: appColors.blue + "15",
              borderColor: appColors.blue,
            }}
          >
            <p
              className="text-sm"
              style={{ color: appColors.textPrimary }}
            >
              <strong>👋 ¿Primera vez aquí?</strong>
              <br />
              Crea una cuenta usando la pestaña{" "}
              <strong>"Registrarse"</strong> →
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">
                Iniciar Sesión
              </TabsTrigger>
              <TabsTrigger value="register">
                Registrarse
              </TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form
                onSubmit={handleLogin}
                className="space-y-4"
              >
                <div>
                  <Label
                    htmlFor="login-email"
                    style={{ color: appColors.textPrimary }}
                  >
                    Correo Electrónico
                  </Label>
                  <Input
                    id="login-email"
                    type="email"
                    value={loginEmail}
                    onChange={(e) =>
                      setLoginEmail(e.target.value)
                    }
                    required
                    className="mt-1"
                    style={{
                      backgroundColor: appColors.base,
                      borderColor: appColors.border,
                      color: appColors.textPrimary,
                    }}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="login-password"
                    style={{ color: appColors.textPrimary }}
                  >
                    Contraseña
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="login-password"
                      type={
                        showLoginPassword ? "text" : "password"
                      }
                      value={loginPassword}
                      onChange={(e) =>
                        setLoginPassword(e.target.value)
                      }
                      required
                      style={{
                        backgroundColor: appColors.base,
                        borderColor: appColors.border,
                        color: appColors.textPrimary,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowLoginPassword(!showLoginPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: appColors.textSecondary }}
                    >
                      {showLoginPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div
                    className="p-3 rounded text-sm flex items-start gap-2"
                    style={{
                      backgroundColor: appColors.red + "20",
                      color: appColors.red,
                      border: `1px solid ${appColors.red}`,
                    }}
                  >
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full border-2"
                  style={{
                    backgroundColor: appColors.green,
                    borderColor: appColors.border,
                    color: appColors.textOnColor,
                  }}
                >
                  {loading
                    ? "Iniciando sesión..."
                    : "Iniciar Sesión"}
                </Button>

                {/* Ayuda adicional */}
                <div className="text-center pt-2">
                  <p
                    className="text-xs"
                    style={{ color: appColors.textSecondary }}
                  >
                    ¿No tienes cuenta? Usa la pestaña
                    "Registrarse" arriba ↑
                  </p>
                </div>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form
                onSubmit={handleRegister}
                className="space-y-4"
              >
                <div>
                  <Label
                    htmlFor="clinic-name"
                    style={{ color: appColors.textPrimary }}
                  >
                    Nombre de la Veterinaria
                  </Label>
                  <Input
                    id="clinic-name"
                    type="text"
                    value={clinicName}
                    onChange={(e) =>
                      setClinicName(e.target.value)
                    }
                    required
                    placeholder="Ej: Clínica Veterinaria Los Andes"
                    className="mt-1"
                    style={{
                      backgroundColor: appColors.base,
                      borderColor: appColors.border,
                      color: appColors.textPrimary,
                    }}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="register-email"
                    style={{ color: appColors.textPrimary }}
                  >
                    Correo Electrónico
                  </Label>
                  <Input
                    id="register-email"
                    type="email"
                    value={registerEmail}
                    onChange={(e) =>
                      setRegisterEmail(e.target.value)
                    }
                    required
                    className="mt-1"
                    style={{
                      backgroundColor: appColors.base,
                      borderColor: appColors.border,
                      color: appColors.textPrimary,
                    }}
                  />
                </div>

                <div>
                  <Label
                    htmlFor="register-password"
                    style={{ color: appColors.textPrimary }}
                  >
                    Contraseña
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="register-password"
                      type={
                        showRegisterPassword
                          ? "text"
                          : "password"
                      }
                      value={registerPassword}
                      onChange={(e) =>
                        setRegisterPassword(e.target.value)
                      }
                      required
                      style={{
                        backgroundColor: appColors.base,
                        borderColor: appColors.border,
                        color: appColors.textPrimary,
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowRegisterPassword(
                          !showRegisterPassword,
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                      style={{ color: appColors.textSecondary }}
                    >
                      {showRegisterPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="register-confirm-password"
                    style={{ color: appColors.textPrimary }}
                  >
                    Confirmar Contraseña
                  </Label>
                  <Input
                    id="register-confirm-password"
                    type="password"
                    value={registerConfirmPassword}
                    onChange={(e) =>
                      setRegisterConfirmPassword(e.target.value)
                    }
                    required
                    className="mt-1"
                    style={{
                      backgroundColor: appColors.base,
                      borderColor: appColors.border,
                      color: appColors.textPrimary,
                    }}
                  />
                </div>

                {error && (
                  <div
                    className="p-3 rounded text-sm flex items-start gap-2"
                    style={{
                      backgroundColor: appColors.red + "20",
                      color: appColors.red,
                      border: `1px solid ${appColors.red}`,
                    }}
                  >
                    <span>⚠️</span>
                    <span>{error}</span>
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full border-2"
                  style={{
                    backgroundColor: appColors.blue,
                    borderColor: appColors.border,
                    color: appColors.textOnColor,
                  }}
                >
                  {loading ? "Registrando..." : "Crear Cuenta"}
                </Button>

                <p
                  className="text-xs text-center"
                  style={{ color: appColors.textSecondary }}
                >
                  Mínimo 6 caracteres para la contraseña
                </p>
              </form>
            </TabsContent>
          </Tabs>
        </Card>

        <p
          className="text-center mt-4 text-sm"
          style={{ color: appColors.textSecondary }}
        >
          Tus datos están seguros y encriptados
        </p>
      </div>
    </div>
  );
}