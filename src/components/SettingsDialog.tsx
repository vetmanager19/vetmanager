import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { appColors } from "../utils/themes";
import { Building2, Mail, User, LogOut } from "lucide-react";

interface UserSettings {
  clinicName: string;
  email: string;
}

interface SettingsDialogProps {
  open: boolean;
  onClose: () => void;
  userSettings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => Promise<void>;
  onLogout: () => void;
}

export function SettingsDialog({
  open,
  onClose,
  userSettings,
  onUpdateSettings,
  onLogout,
}: SettingsDialogProps) {
  const [clinicName, setClinicName] = useState(userSettings.clinicName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSave = async () => {
    if (!clinicName.trim()) {
      setError("El nombre de la veterinaria no puede estar vacío");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await onUpdateSettings({ ...userSettings, clinicName });
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Error al guardar configuración");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (confirm("¿Estás seguro que deseas cerrar sesión?")) {
      onLogout();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent 
        className="max-w-md border-2"
        style={{
          backgroundColor: appColors.cardBackground,
          borderColor: appColors.border,
        }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: appColors.textPrimary }}>
            Configuración de Cuenta
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Información de la Veterinaria */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Building2 className="w-5 h-5" style={{ color: appColors.green }} />
              <h3 style={{ color: appColors.textPrimary }}>
                Información de la Veterinaria
              </h3>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="clinic-name" style={{ color: appColors.textPrimary }}>
                Nombre de la Veterinaria
              </Label>
              <Input
                id="clinic-name"
                value={clinicName}
                onChange={(e) => setClinicName(e.target.value)}
                placeholder="Nombre de tu veterinaria"
                style={{
                  backgroundColor: appColors.base,
                  borderColor: appColors.border,
                  color: appColors.textPrimary,
                }}
              />
            </div>
          </div>

          <Separator style={{ backgroundColor: appColors.border }} />

          {/* Información de la Cuenta */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <User className="w-5 h-5" style={{ color: appColors.blue }} />
              <h3 style={{ color: appColors.textPrimary }}>
                Información de Cuenta
              </h3>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 rounded" style={{ backgroundColor: appColors.base }}>
                <Mail className="w-4 h-4" style={{ color: appColors.textSecondary }} />
                <span style={{ color: appColors.textPrimary }}>{userSettings.email}</span>
              </div>
              <p className="text-sm" style={{ color: appColors.textSecondary }}>
                El correo electrónico no se puede modificar
              </p>
            </div>
          </div>

          <Separator style={{ backgroundColor: appColors.border }} />

          {/* Mensajes de estado */}
          {error && (
            <div 
              className="p-3 rounded text-sm"
              style={{
                backgroundColor: appColors.red + "20",
                color: appColors.red,
                border: `1px solid ${appColors.red}`,
              }}
            >
              {error}
            </div>
          )}

          {success && (
            <div 
              className="p-3 rounded text-sm"
              style={{
                backgroundColor: appColors.green + "20",
                color: appColors.green,
                border: `1px solid ${appColors.green}`,
              }}
            >
              ✓ Configuración guardada exitosamente
            </div>
          )}

          {/* Cerrar Sesión */}
          <Button
            variant="outline"
            onClick={handleLogout}
            className="w-full border-2"
            style={{
              backgroundColor: appColors.red,
              borderColor: appColors.border,
              color: appColors.textOnColor,
            }}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={loading}
            className="border-2"
            style={{
              backgroundColor: appColors.secondary,
              borderColor: appColors.border,
              color: appColors.textOnColor,
            }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading}
            className="border-2"
            style={{
              backgroundColor: appColors.green,
              borderColor: appColors.border,
              color: appColors.textOnColor,
            }}
          >
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
