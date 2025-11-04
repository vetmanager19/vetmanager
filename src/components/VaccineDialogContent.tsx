import { useMemo } from "react";
import { Client, Vacuna } from "./ClientForm";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
import { appColors } from "../utils/themes";
import { formatDateSafely } from "../utils/dateHelpers";
import {
  getVaccinationProgress,
  isVaccineApplied,
  AppliedVaccine,
} from "../utils/vaccines";

interface VaccineDialogContentProps {
  client: Client;
  appliedVaccines: AppliedVaccine[];
  vaccinationProgress: ReturnType<typeof getVaccinationProgress> | null;
  nextSuggestedVaccine: any;
  patientAgeMonths: number;
  onDeleteVacuna: (id: string) => void;
}

export function VaccineDialogContent({
  client,
  appliedVaccines,
  vaccinationProgress,
  nextSuggestedVaccine,
  patientAgeMonths,
  onDeleteVacuna,
}: VaccineDialogContentProps) {
  return (
    <div className="space-y-4">
      {/* Progreso del esquema */}
      {vaccinationProgress && (
        <div
          className="p-4 rounded-lg border-2"
          style={{
            backgroundColor: vaccinationProgress.isComplete
              ? appColors.green + "20"
              : appColors.yellow + "20",
            borderColor: vaccinationProgress.isComplete
              ? appColors.green
              : appColors.yellow,
          }}
        >
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold" style={{ color: appColors.textPrimary }}>
              📊 Esquema de Vacunación
            </h3>
            <span style={{ color: appColors.textPrimary }}>
              {vaccinationProgress.completed}/{vaccinationProgress.total} (
              {vaccinationProgress.percentage}%)
            </span>
          </div>

          {/* Barra de progreso */}
          <div
            className="w-full h-2 rounded-full mb-3"
            style={{ backgroundColor: appColors.secondary + "40" }}
          >
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${vaccinationProgress.percentage}%`,
                backgroundColor: vaccinationProgress.isComplete
                  ? appColors.green
                  : appColors.yellow,
              }}
            />
          </div>

          {/* Siguiente vacuna sugerida o completado */}
          {vaccinationProgress.isComplete ? (
            <p className="text-sm" style={{ color: appColors.textPrimary }}>
              ✅ <strong>Esquema completo!</strong> Próximos refuerzos anuales
              según calendario.
            </p>
          ) : nextSuggestedVaccine ? (
            <p className="text-sm" style={{ color: appColors.textPrimary }}>
              📅 <strong>Siguiente sugerida:</strong> {nextSuggestedVaccine.name}
              {nextSuggestedVaccine.minAgeMonths &&
                patientAgeMonths < nextSuggestedVaccine.minAgeMonths && (
                  <span className="text-amber-600">
                    {" "}
                    (requiere ≥{nextSuggestedVaccine.minAgeMonths} meses)
                  </span>
                )}
            </p>
          ) : null}
        </div>
      )}

      {/* Lista de vacunas */}
      <div className="space-y-3 max-h-[50vh] overflow-y-auto">
        {client.vacunas.length === 0 ? (
          <div
            className="text-center py-8"
            style={{ color: appColors.textSecondary }}
          >
            <p>No hay vacunas registradas</p>
          </div>
        ) : (
          client.vacunas.map((vacuna) => (
            <div
              key={vacuna.id}
              className="bg-[#fde047] p-4 rounded-lg border-2 border-black"
            >
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-black font-bold">{vacuna.nombre}</p>
                  {vacuna.vaccineId === "polivalente-rabia" && (
                    <p className="text-xs text-black/70 mt-1">
                      ✓ Incluye: Polivalente + Rabia
                    </p>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDeleteVacuna(vacuna.id)}
                  className="h-8 w-8 p-0 hover:bg-red-100"
                >
                  <Trash2 className="w-4 h-4 text-red-600" />
                </Button>
              </div>
              <p className="text-black opacity-70">
                Aplicada: {formatDateSafely(vacuna.fecha)}
              </p>
              {vacuna.proximaDosis && (
                <p className="text-black opacity-70">
                  Refuerzo: {formatDateSafely(vacuna.proximaDosis)}
                </p>
              )}
            </div>
          ))
        )}

        {/* Mostrar Rabia como "aplicada" si se usó Polivalente con Rabia */}
        {client.species === "perro" &&
          isVaccineApplied("rabia", appliedVaccines) &&
          !client.vacunas.some((v) => v.vaccineId === "rabia") && (
            <div className="bg-gray-100 p-4 rounded-lg border-2 border-gray-300">
              <p className="text-gray-700 font-bold">Rabia</p>
              <p className="text-xs text-gray-600 mt-1">
                ✓ Ya aplicada en conjunto con Polivalente con Rabia
              </p>
            </div>
          )}
      </div>
    </div>
  );
}
