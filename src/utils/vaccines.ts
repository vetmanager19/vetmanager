// Configuración de vacunas por especie

export interface VaccineConfig {
  id: string;
  name: string;
  requiresAnnualBooster: boolean; // Si requiere refuerzo anual
  species: "perro" | "gato";
  order: number; // Orden en el esquema de vacunación
  minAgeMonths?: number; // Edad mínima en meses (ej: 5 para Rabia)
  replaces?: string[]; // IDs de vacunas que reemplaza (ej: polivalente-rabia reemplaza rabia)
  isBoosterOf?: string; // ID de la vacuna de la cual es refuerzo inmediato (ej: refuerzo-triple-felina es booster de triple-felina)
}

// Vacunas para perros - Orden estricto del esquema
export const dogVaccines: VaccineConfig[] = [
  {
    id: "puppy",
    name: "Puppy",
    requiresAnnualBooster: false,
    species: "perro",
    order: 1,
  },
  {
    id: "puppy-extra",
    name: "Puppy Extra",
    requiresAnnualBooster: false,
    species: "perro",
    order: 2,
  },
  {
    id: "polivalente",
    name: "Polivalente",
    requiresAnnualBooster: true,
    species: "perro",
    order: 3,
  },
  {
    id: "polivalente-rabia",
    name: "Polivalente con Rabia",
    requiresAnnualBooster: true,
    species: "perro",
    order: 3, // Mismo orden que polivalente (alternativa)
    minAgeMonths: 5,
    replaces: ["rabia"],
  },
  {
    id: "bordetella",
    name: "Bordetella",
    requiresAnnualBooster: true,
    species: "perro",
    order: 4,
  },
  {
    id: "gardia",
    name: "Gardia",
    requiresAnnualBooster: true,
    species: "perro",
    order: 5,
  },
  {
    id: "rabia",
    name: "Rabia",
    requiresAnnualBooster: false,
    species: "perro",
    order: 6,
    minAgeMonths: 5,
  },
];

// Vacunas para gatos - Orden estricto del esquema
export const catVaccines: VaccineConfig[] = [
  {
    id: "triple-felina",
    name: "Triple Felina",
    requiresAnnualBooster: true,
    species: "gato",
    order: 1,
  },
  {
    id: "refuerzo-triple-felina",
    name: "Refuerzo Triple Felina",
    requiresAnnualBooster: false, // Solo en esquema inicial, no se repite anualmente
    species: "gato",
    order: 2,
    isBoosterOf: "triple-felina", // Es refuerzo inmediato de la primera Triple Felina
  },
  {
    id: "rabia-gato",
    name: "Rabia",
    requiresAnnualBooster: true,
    species: "gato",
    order: 3,
    minAgeMonths: 5,
  },
  {
    id: "leucemia",
    name: "Leucemia",
    requiresAnnualBooster: true,
    species: "gato",
    order: 4,
  },
];

// Función para obtener vacunas según especie
export function getVaccinesBySpecies(species: string): VaccineConfig[] {
  if (species === "perro") {
    return dogVaccines;
  } else if (species === "gato") {
    return catVaccines;
  }
  return []; // Para otras especies no hay vacunas predefinidas por ahora
}

// Función para verificar si una vacuna requiere refuerzo
export function requiresBooster(vaccineId: string): boolean {
  const allVaccines = [...dogVaccines, ...catVaccines];
  const vaccine = allVaccines.find(v => v.id === vaccineId);
  return vaccine?.requiresAnnualBooster || false;
}

// Función para calcular fecha de próximo refuerzo (1 año después)
export function calculateBoosterDate(applicationDate: string): string {
  // Validar que la fecha no esté vacía
  if (!applicationDate || applicationDate.trim() === "") {
    return "";
  }
  
  const date = new Date(applicationDate);
  
  // Verificar que la fecha sea válida
  if (isNaN(date.getTime())) {
    console.warn("⚠️ Fecha inválida en calculateBoosterDate:", applicationDate);
    return "";
  }
  
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
}

// Función para calcular fecha de notificación (7 días antes del refuerzo)
export function calculateNotificationDate(boosterDate: string): string {
  // Validar que la fecha no esté vacía
  if (!boosterDate || boosterDate.trim() === "") {
    return "";
  }
  
  const date = new Date(boosterDate);
  
  // Verificar que la fecha sea válida
  if (isNaN(date.getTime())) {
    console.warn("⚠️ Fecha inválida en calculateNotificationDate:", boosterDate);
    return "";
  }
  
  date.setDate(date.getDate() - 7);
  return date.toISOString().split('T')[0];
}

// Función para obtener nombre de vacuna por ID
export function getVaccineName(vaccineId: string): string {
  const allVaccines = [...dogVaccines, ...catVaccines];
  const vaccine = allVaccines.find(v => v.id === vaccineId);
  return vaccine?.name || vaccineId;
}

// ==========================================
// NUEVAS FUNCIONES PARA ESQUEMA ESTRUCTURADO
// ==========================================

// Interfaz para vacunas aplicadas
export interface AppliedVaccine {
  id: string;
  vaccineId: string;
  fecha: string;
}

// Calcular edad en meses desde fecha de nacimiento
export function calculateAgeInMonths(birthDate: string): number {
  if (!birthDate || birthDate.trim() === "") {
    return 0;
  }
  
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) {
    return 0;
  }
  
  const today = new Date();
  const months = (today.getFullYear() - birth.getFullYear()) * 12 + 
                 (today.getMonth() - birth.getMonth());
  return Math.max(0, months);
}

// Obtener vacunas que reemplaza una vacuna combinada
export function getReplacedVaccines(vaccineId: string): string[] {
  const allVaccines = [...dogVaccines, ...catVaccines];
  const vaccine = allVaccines.find(v => v.id === vaccineId);
  return vaccine?.replaces || [];
}

// Verificar si una vacuna ya fue aplicada (directa o por reemplazo)
export function isVaccineApplied(vaccineId: string, appliedVaccines: AppliedVaccine[]): boolean {
  // Verificar si fue aplicada directamente
  if (appliedVaccines.some(v => v.vaccineId === vaccineId)) {
    return true;
  }
  
  // Verificar si alguna vacuna aplicada reemplaza esta
  return appliedVaccines.some(applied => {
    const replaced = getReplacedVaccines(applied.vaccineId);
    return replaced.includes(vaccineId);
  });
}

// Obtener siguiente vacuna sugerida en el esquema
export function getNextSuggestedVaccine(
  species: string,
  appliedVaccines: AppliedVaccine[],
  patientAgeMonths: number
): VaccineConfig | null {
  const vaccines = getVaccinesBySpecies(species);
  if (vaccines.length === 0) return null;
  
  // Obtener órdenes únicos aplicados
  const appliedOrders = new Set(
    appliedVaccines.map(av => {
      const vConfig = vaccines.find(v => v.id === av.vaccineId);
      return vConfig?.order;
    }).filter(Boolean)
  );
  
  // Buscar el primer orden no completado
  const allOrders = [...new Set(vaccines.map(v => v.order))].sort((a, b) => a - b);
  
  for (const order of allOrders) {
    if (!appliedOrders.has(order)) {
      // Encontrar vacunas de este orden
      const vaccinesInOrder = vaccines.filter(v => v.order === order);
      
      // Si hay múltiples opciones (ej: polivalente vs polivalente-rabia)
      // Priorizar la que cumple requisitos de edad
      for (const vaccine of vaccinesInOrder) {
        if (!vaccine.minAgeMonths || patientAgeMonths >= vaccine.minAgeMonths) {
          return vaccine;
        }
      }
      
      // Si ninguna cumple edad, retornar la primera de todas formas
      return vaccinesInOrder[0];
    }
  }
  
  return null; // Esquema completo
}

// Obtener progreso del esquema de vacunación
export function getVaccinationProgress(
  species: string,
  appliedVaccines: AppliedVaccine[]
): { completed: number; total: number; percentage: number; isComplete: boolean } {
  const vaccines = getVaccinesBySpecies(species);
  if (vaccines.length === 0) {
    return { completed: 0, total: 0, percentage: 0, isComplete: false };
  }
  
  // Total de órdenes únicos
  const uniqueOrders = [...new Set(vaccines.map(v => v.order))];
  const total = uniqueOrders.length;
  
  // Órdenes completados
  const completedOrders = uniqueOrders.filter(order => {
    const vaccinesInOrder = vaccines.filter(v => v.order === order);
    return vaccinesInOrder.some(v => isVaccineApplied(v.id, appliedVaccines));
  });
  
  const completed = completedOrders.length;
  const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  const isComplete = completed === total;
  
  return { completed, total, percentage, isComplete };
}

// Obtener vacunas anteriores faltantes
export function getMissingPreviousVaccines(
  species: string,
  selectedVaccineId: string,
  appliedVaccines: AppliedVaccine[]
): VaccineConfig[] {
  const vaccines = getVaccinesBySpecies(species);
  const selectedVaccine = vaccines.find(v => v.id === selectedVaccineId);
  
  if (!selectedVaccine) return [];
  
  const missing: VaccineConfig[] = [];
  
  // Buscar todas las vacunas con orden menor
  const previousVaccines = vaccines.filter(v => v.order < selectedVaccine.order);
  
  // Agrupar por orden y verificar si al menos una de cada orden está aplicada
  const previousOrders = [...new Set(previousVaccines.map(v => v.order))].sort((a, b) => a - b);
  
  for (const order of previousOrders) {
    const vaccinesInOrder = vaccines.filter(v => v.order === order);
    const anyApplied = vaccinesInOrder.some(v => isVaccineApplied(v.id, appliedVaccines));
    
    if (!anyApplied) {
      // Agregar la primera vacuna de ese orden como sugerencia
      const suggested = vaccinesInOrder[0];
      if (suggested) {
        missing.push(suggested);
      }
    }
  }
  
  return missing;
}

// Validar si se puede aplicar una vacuna (verificar edad)
export function validateVaccineApplication(
  vaccineId: string,
  patientAgeMonths: number,
  species: string
): { canApply: boolean; warning?: string; isSpecialCase?: boolean } {
  const vaccines = getVaccinesBySpecies(species);
  const vaccine = vaccines.find(v => v.id === vaccineId);
  
  if (!vaccine) {
    return { canApply: true };
  }
  
  if (vaccine.minAgeMonths && patientAgeMonths < vaccine.minAgeMonths) {
    return {
      canApply: true, // Permitir de todos modos
      isSpecialCase: true,
      warning: `Este paciente tiene ${patientAgeMonths} meses. La vacuna ${vaccine.name} generalmente se aplica a partir de los ${vaccine.minAgeMonths} meses.`,
    };
  }
  
  return { canApply: true };
}

// Calcular fecha de próxima dosis (14 días para esquema, 365 para refuerzos)
export function calculateNextDoseDate(
  currentDate: string,
  isInitialSchedule: boolean
): string {
  if (!currentDate || currentDate.trim() === "") {
    return "";
  }
  
  const date = new Date(currentDate);
  if (isNaN(date.getTime())) {
    return "";
  }
  
  if (isInitialSchedule) {
    // Esquema inicial: +14 días
    date.setDate(date.getDate() + 14);
  } else {
    // Refuerzo: +365 días
    date.setFullYear(date.getFullYear() + 1);
  }
  
  return date.toISOString().split('T')[0];
}

// Calcular fecha de notificación
export function calculateNextNotificationDate(
  nextDoseDate: string,
  isInitialSchedule: boolean
): string {
  if (!nextDoseDate || nextDoseDate.trim() === "") {
    return "";
  }
  
  const date = new Date(nextDoseDate);
  if (isNaN(date.getTime())) {
    return "";
  }
  
  if (isInitialSchedule) {
    // Esquema inicial: 5 días antes (notificación 9 días después de aplicación)
    date.setDate(date.getDate() - 5);
  } else {
    // Refuerzo: 5 días antes (notificación 360 días después de aplicación)
    date.setDate(date.getDate() - 5);
  }
  
  return date.toISOString().split('T')[0];
}

// ==========================================
// FUNCIONES ESPECÍFICAS PARA GATOS
// ==========================================

// Obtener fecha de la segunda Triple Felina aplicada
export function getSecondTripleFelinaDate(appliedVaccines: AppliedVaccine[]): string | null {
  // Buscar todas las Triple Felinas (puede ser "triple-felina" o "refuerzo-triple-felina")
  const tripleVaccines = appliedVaccines
    .filter(v => v.vaccineId === "triple-felina" || v.vaccineId === "refuerzo-triple-felina")
    .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
  
  // Si hay al menos 2, retornar la fecha de la segunda
  return tripleVaccines.length >= 2 ? tripleVaccines[1].fecha : null;
}

// Calcular fecha de refuerzo anual para gatos (desde la segunda Triple Felina)
export function getCatAnnualBoosterDate(appliedVaccines: AppliedVaccine[]): string | null {
  const secondTripleDate = getSecondTripleFelinaDate(appliedVaccines);
  
  if (!secondTripleDate) return null;
  
  // +365 días desde la segunda Triple Felina
  const date = new Date(secondTripleDate);
  date.setFullYear(date.getFullYear() + 1);
  return date.toISOString().split('T')[0];
}

// Obtener vacunas que requieren refuerzo anual para gatos
export function getCatBoosterVaccines(): VaccineConfig[] {
  return catVaccines.filter(v => v.requiresAnnualBooster);
}

// Verificar si un gato tiene el esquema completo
export function isCatSchemeComplete(appliedVaccines: AppliedVaccine[]): boolean {
  const progress = getVaccinationProgress("gato", appliedVaccines);
  return progress?.isComplete || false;
}
