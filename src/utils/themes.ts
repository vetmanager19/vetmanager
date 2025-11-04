// Constantes de especies para evitar duplicación
export const SPECIES_OPTIONS = [
  { value: "all", label: "Todas las especies" },
  { value: "perro", label: "Perro" },
  { value: "gato", label: "Gato" },
  { value: "ave", label: "Ave" },
  { value: "conejo", label: "Conejo" },
  { value: "hamster", label: "Hámster" },
  { value: "reptil", label: "Reptil" },
  { value: "otro", label: "Otro" },
] as const;

export const SPECIES_LIST = SPECIES_OPTIONS.filter(s => s.value !== "all");

// Colores por especie
export const SPECIES_COLORS: Record<string, string> = {
  perro: "#5d80c2",    // Azul
  gato: "#8378b8",     // Púrpura
  ave: "#3ba37d",      // Verde
  conejo: "#e6afa5",   // Rosa
  hamster: "#dfd255",  // Amarillo
  reptil: "#eb6766",   // Rojo
  otro: "#9C9C9C",     // Gris
};

// Paleta de colores única para VetManager
export const appColors = {
  // Colores base
  base: "#1E1E1E",           // Negro/gris oscuro - Fondo principal
  secondary: "#9C9C9C",      // Gris medio - Elementos secundarios
  tertiary: "#ffffff",       // Blanco - Texto principal
  
  // Colores de contraste para secciones
  yellow: "#dfd255",         // Amarillo/dorado
  blue: "#5d80c2",          // Azul
  green: "#3ba37d",         // Verde
  purple: "#8378b8",        // Púrpura
  red: "#eb6766",           // Rojo/coral
  pink: "#e6afa5",          // Rosa pastel
  
  // Backgrounds
  background: "#1E1E1E",
  cardBackground: "#2a2a2a",
  
  // Bordes
  border: "#9C9C9C",
  borderDark: "#1E1E1E",
  
  // Textos
  textPrimary: "#ffffff",
  textSecondary: "#9C9C9C",
  textOnColor: "#1E1E1E",    // Texto sobre colores de contraste
};

// Asignación de colores a secciones específicas
export const sectionColors = {
  photo: appColors.blue,
  basicInfo: appColors.yellow,
  contactInfo: appColors.green,
  medicalHistory: appColors.purple,
  consultas: appColors.pink,
  vaccines: appColors.red,
  deworming: appColors.blue,
  importantData: appColors.yellow,
};
