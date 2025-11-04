// Utilidades para manejo seguro de fechas

/**
 * Formatea una fecha de manera segura, manejando valores inválidos
 * @param dateString - String de fecha en formato ISO o cualquier formato válido
 * @param locale - Locale para formato (por defecto "es-ES")
 * @param fallback - Texto a mostrar si la fecha es inválida (por defecto "Fecha no disponible")
 * @returns Fecha formateada o texto de fallback
 */
export function formatDateSafely(
  dateString: string | undefined | null,
  locale: string = "es-ES",
  fallback: string = "Fecha no disponible"
): string {
  // Verificar que dateString existe y no está vacío
  if (!dateString || dateString.trim() === "") {
    return fallback;
  }

  try {
    const date = new Date(dateString);
    
    // Verificar que la fecha es válida
    if (isNaN(date.getTime())) {
      console.warn("⚠️ Fecha inválida al formatear:", dateString);
      return fallback;
    }

    return date.toLocaleDateString(locale);
  } catch (error) {
    console.error("❌ Error formateando fecha:", dateString, error);
    return fallback;
  }
}

/**
 * Verifica si una fecha es válida
 * @param dateString - String de fecha a verificar
 * @returns true si la fecha es válida, false si no
 */
export function isValidDate(dateString: string | undefined | null): boolean {
  if (!dateString || dateString.trim() === "") {
    return false;
  }

  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

/**
 * Convierte una fecha a formato ISO (YYYY-MM-DD) de manera segura
 * @param dateString - String de fecha
 * @returns Fecha en formato ISO o string vacío si es inválida
 */
export function toISODateSafely(dateString: string | undefined | null): string {
  if (!dateString || dateString.trim() === "") {
    return "";
  }

  try {
    const date = new Date(dateString);
    
    if (isNaN(date.getTime())) {
      return "";
    }

    return date.toISOString().split('T')[0];
  } catch (error) {
    console.error("❌ Error convirtiendo a ISO:", dateString, error);
    return "";
  }
}

/**
 * Calcula edad a partir de fecha de nacimiento
 * @param birthDateString - Fecha de nacimiento
 * @returns Edad en años o null si la fecha es inválida
 */
export function calculateAge(birthDateString: string | undefined | null): number | null {
  if (!isValidDate(birthDateString)) {
    return null;
  }

  const birthDate = new Date(birthDateString!);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}
