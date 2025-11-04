import { useState, useCallback, useMemo, useEffect } from "react";
import { Client, Vacuna } from "./ClientForm";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { appColors } from "../utils/themes";
import { formatDateSafely } from "../utils/dateHelpers";
import {
  getVaccinesBySpecies,
  getMissingPreviousVaccines,
  validateVaccineApplication,
  isVaccineApplied,
  AppliedVaccine,
  VaccineConfig,
} from "../utils/vaccines";

interface AddVaccineDialogProps {
  open: boolean;
  client: Client;
  newVacuna: Vacuna;
  appliedVaccines: AppliedVaccine[];
  patientAgeMonths: number;
  nextSuggestedVaccine: VaccineConfig | null;
  onOpenChange: (open: boolean) => void;
  onVaccineChange: (vacuna: Vacuna) => void;
  onSave: () => void;
}

export function AddVaccineDialog({
  open,
  client,
  newVacuna,
  appliedVaccines,
  patientAgeMonths,
  nextSuggestedVaccine,
  onOpenChange,
  onVaccineChange,
  onSave,
}: AddVaccineDialogProps) {
  const [showAgeWarning, setShowAgeWarning] = useState(false);
  const [ageWarningMessage, setAgeWarningMessage] = useState("");
  const [showMissingWarning, setShowMissingWarning] = useState(false);
  const [missingVaccines, setMissingVaccines] = useState<VaccineConfig[]>([]);
  const [pendingVaccineId, setPendingVaccineId] = useState<string | null>(null);

  const availableVaccines = useMemo(() => {
    const vaccines = getVaccinesBySpecies(client.species);
    
    return vaccines.map((vaccine) => {
      const applied = isVaccineApplied(vaccine.id, appliedVaccines);
      const validation = validateVaccineApplication(
        vaccine.id,
        patientAgeMonths,
        client.species
      );
      const isSuggested = nextSuggestedVaccine?.id === vaccine.id;

      return {
        ...vaccine,
        isApplied: applied,
        isSuggested,
        ...validation,
      };
    });
  }, [client.species, appliedVaccines, patientAgeMonths, nextSuggestedVaccine]);

  const handleVaccineSelect = useCallback(
    (vaccineId: string) => {
      const vaccines = getVaccinesBySpecies(client.species);
      const selectedVaccine = vaccines.find((v) => v.id === vaccineId);
      
      if (!selectedVaccine) return;

      // Validar edad
      const validation = validateVaccineApplication(
        vaccineId,
        patientAgeMonths,
        client.species
      );

      if (validation.isSpecialCase && validation.warning) {
        setAgeWarningMessage(validation.warning);
        setPendingVaccineId(vaccineId);
        setShowAgeWarning(true);
        return;
      }

      // Verificar vacunas anteriores faltantes
      if (client.species === "perro" || client.species === "gato") {
        const missing = getMissingPreviousVaccines(
          client.species,
          vaccineId,
          appliedVaccines
        );

        if (missing.length > 0) {
          setMissingVaccines(missing);
          setPendingVaccineId(vaccineId);
          setShowMissingWarning(true);
          return;
        }
      }

      // Aplicar selección
      applyVaccineSelection(vaccineId, selectedVaccine);
    },
    [client.species, appliedVaccines, patientAgeMonths]
  );

  const applyVaccineSelection = useCallback(
    (vaccineId: string, selectedVaccine: VaccineConfig) => {
      onVaccineChange({
        ...newVacuna,
        vaccineId: vaccineId,
        nombre: selectedVaccine.name,
        requiresBooster: selectedVaccine.requiresAnnualBooster,
      });
    },
    [newVacuna, onVaccineChange]
  );

  const handleConfirmAgeWarning = useCallback(() => {
    if (pendingVaccineId) {
      const vaccines = getVaccinesBySpecies(client.species);
      const selectedVaccine = vaccines.find((v) => v.id === pendingVaccineId);
      if (selectedVaccine) {
        applyVaccineSelection(pendingVaccineId, selectedVaccine);
      }
    }
    setShowAgeWarning(false);
    setPendingVaccineId(null);
  }, [pendingVaccineId, client.species, applyVaccineSelection]);

  const handleConfirmMissingWarning = useCallback(() => {
    if (pendingVaccineId) {
      const vaccines = getVaccinesBySpecies(client.species);
      const selectedVaccine = vaccines.find((v) => v.id === pendingVaccineId);
      if (selectedVaccine) {
        applyVaccineSelection(pendingVaccineId, selectedVaccine);
      }
    }
    setShowMissingWarning(false);
    setPendingVaccineId(null);
  }, [pendingVaccineId, client.species, applyVaccineSelection]);

  const handleDateChange = useCallback(
    (fecha: string) => {
      onVaccineChange({
        ...newVacuna,
        fecha: fecha,
      });
    },
    [newVacuna, onVaccineChange]
  );

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="backdrop-blur-md bg-white/95 max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Vacuna</DialogTitle>
            <DialogDescription>
              Registra una nueva vacuna. El sistema creará notificaciones automáticas para la siguiente dosis.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Siguiente sugerida */}
            {nextSuggestedVaccine && (
              <div
                className="p-3 rounded-lg border-2"
                style={{
                  backgroundColor: appColors.green + "20",
                  borderColor: appColors.green,
                }}
              >
                <p className="text-sm" style={{ color: appColors.textPrimary }}>
                  ⭐ <strong>Siguiente sugerida:</strong>{" "}
                  {nextSuggestedVaccine.name}
                </p>
              </div>
            )}

            {/* Selector de vacuna */}
            <div>
              <Label>Vacuna</Label>
              <Select value={newVacuna.vaccineId} onValueChange={handleVaccineSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una vacuna" />
                </SelectTrigger>
                <SelectContent>
                  {availableVaccines.map((vaccine) => (
                    <SelectItem
                      key={vaccine.id}
                      value={vaccine.id}
                      disabled={vaccine.minAgeMonths && patientAgeMonths < vaccine.minAgeMonths && !vaccine.isSpecialCase}
                    >
                      <div className="flex items-center gap-2">
                        {vaccine.isSuggested && (
                          <Badge
                            className="text-xs"
                            style={{
                              backgroundColor: appColors.green,
                              color: appColors.tertiary,
                            }}
                          >
                            SUGERIDA
                          </Badge>
                        )}
                        <span>{vaccine.name}</span>
                        {vaccine.isApplied && (
                          <span className="text-xs text-gray-500">✓ Ya aplicada</span>
                        )}
                        {vaccine.minAgeMonths && (
                          <span className="text-xs text-gray-500">
                            (+{vaccine.minAgeMonths} meses)
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {availableVaccines.length === 0 && (
                <p className="text-sm text-amber-600 mt-1">
                  No hay vacunas predefinidas para esta especie
                </p>
              )}
            </div>

            {/* Fecha */}
            <div>
              <Label>Fecha de Aplicación</Label>
              <Input
                type="date"
                value={newVacuna.fecha}
                onChange={(e) => handleDateChange(e.target.value)}
              />
            </div>

            {/* Info de notificación automática */}
            {newVacuna.vaccineId && newVacuna.fecha && (
              <div
                className="p-3 rounded-lg border-2"
                style={{
                  backgroundColor: appColors.blue + "20",
                  borderColor: appColors.blue,
                }}
              >
                <p className="text-sm" style={{ color: appColors.textPrimary }}>
                  <strong>📧 Notificación automática:</strong>
                </p>
                <p className="text-xs mt-1" style={{ color: appColors.textSecondary }}>
                  Se enviará un recordatorio por email 5 días antes de la próxima dosis.
                </p>
              </div>
            )}

            {/* Botones */}
            <div className="flex justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={onSave}
                disabled={!newVacuna.vaccineId || !newVacuna.fecha}
                className="bg-[#22c55e] hover:bg-[#16a34a] text-black"
              >
                Guardar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Advertencia de edad */}
      <AlertDialog open={showAgeWarning} onOpenChange={setShowAgeWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Restricción de Edad</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>{ageWarningMessage}</p>
              <p className="font-semibold">
                ¿Es un caso especial que requiere aplicación temprana?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowAgeWarning(false);
              setPendingVaccineId(null);
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmAgeWarning}
              className="bg-amber-500 hover:bg-amber-600"
            >
              Sí, aplicar de todos modos
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Advertencia de vacunas faltantes */}
      <AlertDialog open={showMissingWarning} onOpenChange={setShowMissingWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>⚠️ Advertencia: Faltan vacunas anteriores</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>Según el esquema de vacunación, faltan las siguientes vacunas anteriores:</p>
              <ul className="list-disc list-inside space-y-1">
                {missingVaccines.map((v) => (
                  <li key={v.id} className="font-semibold">
                    {v.name}
                  </li>
                ))}
              </ul>
              <p className="mt-3">
                ¿Deseas continuar registrando esta vacuna de todos modos?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowMissingWarning(false);
              setPendingVaccineId(null);
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmMissingWarning}
              className="bg-amber-500 hover:bg-amber-600"
            >
              Sí, registrar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
