# 📋 Ejemplos Visuales - Sistema de Vacunación

## 🐶 EJEMPLO COMPLETO: Perro "Max" (4 meses)

### **Día 0 - Primera Vacuna**
```
Usuario: Agrega "Puppy" con fecha 01/01/2024

Sistema ejecuta:
  ✓ Guarda vacuna en base de datos
  ✓ Calcula progreso: 1/6 (17%)
  ✓ Detecta siguiente sugerida: Puppy Extra
  ✓ Calcula próxima dosis: 15/01/2024 (+14 días)
  ✓ Calcula notificación: 10/01/2024 (5 días antes)
  ✓ Crea notificación automática

UI muestra:
  📊 Esquema de Vacunación: 1/6 (17%)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ (barra amarilla)
  📅 Siguiente sugerida: Puppy Extra
  
  📧 Notificación creada:
     Título: "Próxima vacuna: Puppy Extra"
     Fecha: 10/01/2024
     Email a: dueño@email.com
```

### **Día 14 - Segunda Vacuna**
```
Usuario: Agrega "Puppy Extra" con fecha 15/01/2024

Sistema ejecuta:
  ✓ Guarda vacuna
  ✓ Progreso: 2/6 (33%)
  ✓ Siguiente: Polivalente
  ✓ Próxima dosis: 29/01/2024
  ✓ Notificación: 24/01/2024
  
UI muestra:
  📊 Esquema de Vacunación: 2/6 (33%)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ (barra amarilla)
  📅 Siguiente sugerida: Polivalente
```

### **Día 28 - Restricción de Edad**
```
Usuario: Intenta agregar "Rabia" con fecha 29/01/2024

Sistema detecta:
  ⚠️ Edad del paciente: 4 meses
  ⚠️ Edad requerida: ≥5 meses
  
AlertDialog muestra:
  ┌─────────────────────────────────────┐
  │ ⚠️ Restricción de Edad              │
  │                                     │
  │ Este paciente tiene 4 meses.        │
  │ La vacuna Rabia generalmente se     │
  │ aplica a partir de los 5 meses.     │
  │                                     │
  │ ¿Es un caso especial que requiere   │
  │ aplicación temprana?                │
  │                                     │
  │  [Cancelar]  [Aplicar de todos modos]│
  └─────────────────────────────────────┘
  
Usuario: Cancela y agrega "Polivalente" en su lugar

Sistema ejecuta:
  ✓ Progreso: 3/6 (50%)
  ✓ Siguiente: Bordetella
```

### **Día 42, 56, 70 - Continúa Esquema**
```
42: Bordetella  → 4/6 (67%)
56: Gardia      → 5/6 (83%)
70: Rabia       → Max ya tiene 5+ meses, sin warning

Final: 6/6 (100%) ✅ Esquema completo!
```

### **Esquema Completo - Refuerzos Anuales**
```
Sistema ejecuta:
  ✓ Detecta que Polivalente requiere refuerzo anual
  ✓ Calcula: 29/01/2024 + 365 días = 29/01/2025
  ✓ Notificación: 24/01/2025 (5 días antes)
  ✓ Crea notificación para Polivalente
  
  ✓ Detecta que Bordetella requiere refuerzo anual
  ✓ Calcula desde su fecha: 12/02/2025
  ✓ Crea notificación para Bordetella
  
  ✓ Detecta que Gardia requiere refuerzo anual
  ✓ Calcula desde su fecha: 26/02/2025
  ✓ Crea notificación para Gardia

UI muestra:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 100% (barra verde)
  ✅ Esquema completo! Próximos refuerzos según calendario.
  
  Panel de Notificaciones:
  📅 24/01/2025 - Refuerzo Polivalente
  📅 07/02/2025 - Refuerzo Bordetella
  📅 21/02/2025 - Refuerzo Gardia
```

---

## 🐱 EJEMPLO COMPLETO: Gato "Luna" (6 meses)

### **Día 0 - Primera Triple Felina**
```
Usuario: Agrega "Triple Felina" con fecha 01/02/2024

Sistema ejecuta:
  ✓ Guarda vacuna
  ✓ Progreso: 1/4 (25%)
  ✓ Siguiente: Refuerzo Triple Felina
  ✓ Próxima dosis: 15/02/2024
  ✓ Notificación: 10/02/2024
  
UI muestra:
  📊 Esquema de Vacunación: 1/4 (25%)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ (barra amarilla)
  📅 Siguiente sugerida: Refuerzo Triple Felina
```

### **Día 14 - Segunda Triple Felina (CLAVE)**
```
Usuario: Agrega "Refuerzo Triple Felina" con fecha 15/02/2024

Sistema ejecuta:
  ✓ Guarda vacuna
  ✓ Progreso: 2/4 (50%)
  ✓ Siguiente: Rabia
  ✓ 🔑 GUARDA ESTA FECHA COMO BASE: 15/02/2024
     (Para refuerzos anuales futuros)
  
UI muestra:
  📊 Esquema de Vacunación: 2/4 (50%)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ (barra amarilla)
  📅 Siguiente sugerida: Rabia
```

### **Día 28 - Rabia (Sin problemas de edad)**
```
Usuario: Agrega "Rabia" con fecha 29/02/2024

Sistema ejecuta:
  ✓ Verifica edad: 6 meses ≥ 5 meses ✓
  ✓ No muestra warning
  ✓ Guarda vacuna
  ✓ Progreso: 3/4 (75%)
  
UI muestra:
  📊 Esquema de Vacunación: 3/4 (75%)
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ (barra amarilla)
  📅 Siguiente sugerida: Leucemia
```

### **Día 42 - Leucemia (ESQUEMA COMPLETO)**
```
Usuario: Agrega "Leucemia" con fecha 14/03/2024

Sistema ejecuta:
  ✓ Guarda vacuna
  ✓ Progreso: 4/4 (100%) ✅
  ✓ Detecta ESQUEMA COMPLETO
  
  🔑 LÓGICA ESPECIAL PARA GATOS:
  
  1. Busca la 2da Triple Felina: 15/02/2024
  2. Calcula refuerzo anual: 15/02/2024 + 365 = 15/02/2025
  3. Calcula notificación: 15/02/2025 - 5 = 10/02/2025
  
  4. Crea notificaciones para TODAS las vacunas:
     ✓ Triple Felina (solo 1 dosis) - 15/02/2025
     ✓ Rabia - 15/02/2025
     ✓ Leucemia - 15/02/2025
     
     TODAS EL MISMO DÍA!

UI muestra:
  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━ 100% (barra verde)
  ✅ Esquema completo! Próximos refuerzos según calendario.
  
  Panel de Notificaciones:
  📅 10/02/2025 - Refuerzo Triple Felina
  📅 10/02/2025 - Refuerzo Rabia
  📅 10/02/2025 - Refuerzo Leucemia
  
  ⭐ TODAS el mismo día para aplicar en una sola visita
```

---

## 🔄 COMPARACIÓN VISUAL: Refuerzos Anuales

### **PERROS - Refuerzos en Fechas Distintas**
```
Esquema inicial:
┌─────────────────────────────────────┐
│ Día 0:  Puppy                       │
│ Día 14: Puppy Extra                 │
│ Día 28: Polivalente     ← Refuerzo  │
│ Día 42: Bordetella      ← Refuerzo  │
│ Día 56: Gardia          ← Refuerzo  │
│ Día 70: Rabia                       │
└─────────────────────────────────────┘

Refuerzos anuales:
┌─────────────────────────────────────┐
│ Día 393: Polivalente (28+365)       │
│ Día 407: Bordetella  (42+365)       │
│ Día 421: Gardia      (56+365)       │
└─────────────────────────────────────┘
   ↑ Fechas distintas (3 visitas)
```

### **GATOS - Refuerzos SINCRONIZADOS**
```
Esquema inicial:
┌─────────────────────────────────────┐
│ Día 0:  Triple Felina               │
│ Día 14: Refuerzo Triple ← BASE      │
│ Día 28: Rabia                       │
│ Día 42: Leucemia                    │
└─────────────────────────────────────┘
              ↑
         BASE PARA TODO

Refuerzos anuales:
┌─────────────────────────────────────┐
│ Día 379: Triple Felina (14+365)     │
│ Día 379: Rabia         (14+365)     │
│ Día 379: Leucemia      (14+365)     │
└─────────────────────────────────────┘
   ↑ TODAS el mismo día (1 visita)
```

---

## ⚠️ EJEMPLOS: Warnings y Validaciones

### **1. Warning de Edad - Perro**
```
Paciente: "Max" (4 meses)
Vacuna: Rabia

Sistema muestra:
┌───────────────────────────────────────────┐
│ ⚠️ Restricción de Edad                    │
│                                           │
│ Este paciente tiene 4 meses. La vacuna    │
│ Rabia generalmente se aplica a partir     │
│ de los 5 meses.                           │
│                                           │
│ ¿Es un caso especial que requiere         │
│ aplicación temprana?                      │
│                                           │
│  [Cancelar]  [Sí, aplicar de todos modos] │
└───────────────────────────────────────────┘

Si usuario confirma:
  ✓ Se registra como caso especial
  ✓ Se agrega a la base de datos
  ✓ Progreso se actualiza normalmente
```

### **2. Warning de Vacunas Faltantes - Gato**
```
Paciente: "Luna" (6 meses)
Historial: (vacío)
Intento: Agregar "Leucemia"

Sistema detecta:
  ⚠️ Faltan vacunas anteriores del esquema
  
Sistema muestra:
┌───────────────────────────────────────────┐
│ ⚠️ Advertencia: Faltan vacunas anteriores │
│                                           │
│ Según el esquema de vacunación, faltan:  │
│                                           │
│  • Triple Felina                          │
│  • Refuerzo Triple Felina                 │
│  • Rabia                                  │
│                                           │
│ ¿Deseas continuar registrando esta       │
│ vacuna de todos modos?                    │
│                                           │
│  [Cancelar]          [Sí, registrar]      │
└───────────────────────────────────────────┘

Si usuario confirma:
  ✓ Se registra Leucemia
  ✓ Progreso: 1/4 (pero fuera de orden)
  ✓ Siguiente sugerida sigue siendo Triple Felina
```

### **3. Polivalente con Rabia - Perro**
```
Paciente: "Rex" (6 meses)
Historial: Puppy, Puppy Extra
Agrega: Polivalente con Rabia

Sistema ejecuta:
  ✓ Registra Polivalente con Rabia
  ✓ Marca AUTOMÁTICAMENTE Rabia como aplicada
  ✓ Progreso: 3/6 (cuenta como 2 vacunas)
  ✓ Siguiente sugerida: Bordetella
  
Luego continúa esquema:
  → Bordetella
  → Gardia
  → ESQUEMA COMPLETO (sin necesidad de Rabia por separado)
  
Historial muestra:
┌───────────────────────────────────────┐
│ ✓ Puppy                               │
│ ✓ Puppy Extra                         │
│ ✓ Polivalente con Rabia               │
│   ➜ Incluye: Polivalente + Rabia      │
│ ✓ Bordetella                          │
│ ✓ Gardia                              │
│                                       │
│ 📝 Rabia                              │
│ ✓ Ya aplicada en conjunto con         │
│   Polivalente con Rabia               │
└───────────────────────────────────────┘
```

---

## 📱 EJEMPLOS: UI en Diferentes Pantallas

### **Tarjeta Compacta (Vista Principal)**
```
┌─────────────────────────────────────┐
│ Historial Vacunas            [+]    │
│                                     │
│ Esquema: 3/6                    50% │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━       │
│ 📅 Siguiente: Bordetella            │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Puppy                           │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Puppy Extra                     │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Polivalente                     │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### **Diálogo Completo (Al hacer click)**
```
┌──────────────────────────────────────────┐
│ Historial de Vacunas              [X]   │
├──────────────────────────────────────────┤
│                                          │
│ ┌────────────────────────────────────┐   │
│ │ 📊 Esquema de Vacunación           │   │
│ │                                    │   │
│ │ 3/6 (50%)                          │   │
│ │ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │   │
│ │                                    │   │
│ │ 📅 Siguiente sugerida: Bordetella  │   │
│ └────────────────────────────────────┘   │
│                                          │
│ ┌────────────────────────────────────┐   │
│ │ Puppy                         [🗑] │   │
│ │ Aplicada: 01/01/2024               │   │
│ └────────────────────────────────────┘   │
│                                          │
│ ┌────────────────────────────────────┐   │
│ │ Puppy Extra                   [🗑] │   │
│ │ Aplicada: 15/01/2024               │   │
│ └────────────────────────────────────┘   │
│                                          │
│ ┌────────────────────────────────────┐   │
│ │ Polivalente                   [🗑] │   │
│ │ Aplicada: 29/01/2024               │   │
│ │ Refuerzo: 29/01/2025               │   │
│ └────────────────────────────────────┘   │
│                                          │
│           [Cerrar]                       │
└──────────────────────────────────────────┘
```

### **Diálogo Agregar Vacuna**
```
┌──────────────────────────────────────────┐
│ Nueva Vacuna                      [X]   │
├──────────────────────────────────────────┤
│                                          │
│ ┌────────────────────────────────────┐   │
│ │ ⭐ Siguiente sugerida: Bordetella  │   │
│ └────────────────────────────────────┘   │
│                                          │
│ Vacuna:                                  │
│ ┌────────────────────────────────────┐   │
│ │ Selecciona una vacuna         [▼] │   │
│ └────────────────────────────────────┘   │
│   ┌─ Puppy            ✓ Ya aplicada     │
│   ├─ Puppy Extra      ✓ Ya aplicada     │
│   ├─ Polivalente      ✓ Ya aplicada     │
│   ├─ Polivalente con Rabia (+5 meses)   │
│   ├─ Bordetella       [SUGERIDA] ←      │
│   ├─ Gardia                              │
│   └─ Rabia            (+5 meses)         │
│                                          │
│ Fecha de Aplicación:                     │
│ ┌────────────────────────────────────┐   │
│ │ [12/02/2024]                       │   │
│ └────────────────────────────────────┘   │
│                                          │
│ ┌────────────────────────────────────┐   │
│ │ 📧 Notificación automática:        │   │
│ │ Se enviará un recordatorio 5 días  │   │
│ │ antes de la próxima dosis.         │   │
│ └────────────────────────────────────┘   │
│                                          │
│         [Cancelar]    [Guardar]          │
└──────────────────────────────────────────┘
```

---

## 🎯 RESUMEN DE EJEMPLOS

**Perros:**
- 6 vacunas en orden estricto
- Refuerzos individuales en fechas distintas
- Opción de combo (Polivalente con Rabia)
- 3 visitas anuales de refuerzo

**Gatos:**
- 4 vacunas en orden estricto
- 2 dosis de Triple Felina seguidas
- Refuerzos TODOS sincronizados desde 2da Triple
- 1 visita anual para aplicar todo

**Ambos:**
- Restricción de Rabia ≥5 meses
- Warnings informativos (no bloquean)
- Notificaciones automáticas
- Progreso visual en tiempo real
- UI idéntica y profesional
