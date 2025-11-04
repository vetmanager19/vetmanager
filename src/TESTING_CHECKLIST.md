# ✅ Lista de Verificación - Sistema de Vacunación Estructurado

## 🧪 Casos de Prueba

### 1. Crear Paciente Perro Cachorro (<5 meses)
- [ ] Crear paciente perro con fecha de nacimiento reciente (ej: hace 3 meses)
- [ ] Verificar que la edad se calcula correctamente
- [ ] Ir a la tarjeta de vacunas
- [ ] Verificar que muestra "Esquema: 0/6 (0%)"

### 2. Agregar Vacunas en Orden Correcto
- [ ] Agregar Puppy → Debe mostrar badge "SUGERIDA"
- [ ] Verificar que progreso cambia a 1/6 (17%)
- [ ] Verificar que "Siguiente: Puppy Extra" aparece
- [ ] Agregar Puppy Extra → Progreso 2/6 (33%)
- [ ] Verificar que "Siguiente: Polivalente" aparece
- [ ] Intentar agregar Polivalente con Rabia → Debe mostrar restricción de edad
- [ ] Agregar solo Polivalente → Progreso 3/6 (50%)
- [ ] Agregar Bordetella → Progreso 4/6 (67%)
- [ ] Agregar Gardia → Progreso 5/6 (83%)
- [ ] Agregar Rabia → Debe mostrar warning de edad
- [ ] Confirmar "caso especial" → Progreso 6/6 (100%) ✅ Completo

### 3. Probar Polivalente con Rabia
- [ ] Crear nuevo paciente perro (>5 meses)
- [ ] Agregar Puppy, Puppy Extra
- [ ] Agregar Polivalente con Rabia (debe estar disponible)
- [ ] Verificar que progreso salta a 3/6 (cuenta Polivalente Y Rabia)
- [ ] Agregar Bordetella, Gardia
- [ ] Verificar progreso 6/6 completo (sin necesidad de agregar Rabia)
- [ ] Abrir historial de vacunas
- [ ] Verificar que aparece "Rabia - ✓ Ya aplicada en conjunto con Polivalente con Rabia"

### 4. Probar Warning de Vacunas Faltantes
- [ ] Crear nuevo paciente perro
- [ ] Intentar agregar Bordetella (sin vacunas previas)
- [ ] Debe mostrar AlertDialog: "Faltan vacunas anteriores: Puppy, Puppy Extra, Polivalente"
- [ ] Cancelar → No debe agregar
- [ ] Intentar de nuevo y confirmar → Debe agregar
- [ ] Verificar que el warning sigue apareciendo para otras vacunas faltantes

### 5. Probar Warning de Edad
- [ ] Crear paciente perro de 3 meses
- [ ] Intentar agregar Rabia
- [ ] Debe mostrar: "⚠️ Este paciente tiene 3 meses. Rabia se aplica ≥5 meses. ¿Caso especial?"
- [ ] Cancelar → No debe agregar
- [ ] Intentar de nuevo y confirmar → Debe agregar como caso especial

### 6. Verificar Notificaciones Automáticas
- [ ] Agregar una vacuna (ej: Puppy el día de hoy)
- [ ] Ir al panel de notificaciones
- [ ] Verificar que existe notificación programada para dentro de 9 días (5 días antes de los 14)
- [ ] Completar esquema
- [ ] Verificar que existen notificaciones anuales (360 días después) para vacunas con refuerzo

### 7. Verificar UI de Progreso
- [ ] En tarjeta compacta:
  - [ ] Barra de progreso visible
  - [ ] Porcentaje correcto
  - [ ] "Siguiente: [Nombre]" o "✅ Completo"
- [ ] En diálogo de historial:
  - [ ] Barra de progreso con color (amarillo en progreso, verde completo)
  - [ ] Lista completa de vacunas
  - [ ] Fechas de aplicación y refuerzo correctas
  - [ ] "Rabia aplicada en conjunto" si aplica

### 8. Verificar Badge "SUGERIDA"
- [ ] Abrir diálogo de agregar vacuna
- [ ] Verificar que la siguiente en el esquema tiene badge verde "SUGERIDA"
- [ ] Las vacunas ya aplicadas muestran "✓ Ya aplicada"
- [ ] Las vacunas con restricción de edad muestran "(+5 meses)"

### 9. Probar Edición y Eliminación
- [ ] Eliminar una vacuna del historial
- [ ] Verificar que el progreso se actualiza correctamente
- [ ] Verificar que la "siguiente sugerida" cambia apropiadamente
- [ ] Volver a agregar la vacuna eliminada

### 10. Verificar Persistencia
- [ ] Agregar varias vacunas
- [ ] Recargar la página
- [ ] Verificar que todas las vacunas persisten
- [ ] Verificar que el progreso se calcula correctamente tras recargar
- [ ] Verificar que las notificaciones persisten

### 11. Probar Sistema de Gatos 🐱
- [ ] Crear paciente gato de 3 meses
- [ ] Verificar progreso 0/4 (0%)
- [ ] Verificar que muestra las 4 vacunas del esquema
- [ ] Agregar Triple Felina → Badge "SUGERIDA", Progreso 1/4 (25%)
- [ ] Agregar Refuerzo Triple Felina → Progreso 2/4 (50%)
- [ ] Verificar que "Siguiente sugerida" es Rabia
- [ ] Intentar agregar Rabia (<5 meses) → Debe mostrar warning
- [ ] Crear gato de 6 meses y agregar Rabia → Sin warning
- [ ] Agregar Leucemia → Progreso 4/4 (100%) ✅
- [ ] Verificar mensaje "Esquema completo"

### 12. Verificar Refuerzos Anuales para Gatos
- [ ] Completar esquema de un gato
- [ ] Ir al panel de notificaciones
- [ ] Verificar que hay 3 notificaciones (Triple Felina, Rabia, Leucemia)
- [ ] Verificar que TODAS tienen la misma fecha
- [ ] Calcular manualmente: 2da Triple Felina + 365 días
- [ ] Verificar que la fecha de notificación es correcta
- [ ] Verificar que el refuerzo de Triple es SOLO 1 dosis (no 2)

### 13. Probar Casos Especiales en Gatos
- [ ] Gato con vacunas fuera de orden → Warning de vacunas faltantes
- [ ] Gato <5 meses con Rabia → Warning de edad + override funciona
- [ ] Eliminar vacuna y verificar progreso se recalcula
- [ ] Agregar todas en el mismo día → Todo funciona
- [ ] Verificar que UI es idéntica a perros

### 14. Probar con Otras Especies
- [ ] Crear paciente de otra especie (ej: ave, conejo)
- [ ] Verificar que no muestra progreso de esquema
- [ ] Verificar que permite agregar vacunas personalizadas

### 12. Verificar Responsividad
- [ ] Probar en móvil (viewport estrecho)
- [ ] Verificar que la barra de progreso se ve bien
- [ ] Verificar que los diálogos son scrolleables
- [ ] Verificar que los AlertDialog funcionan en móvil

## 🐛 Problemas Conocidos a Verificar

### ✅ RESUELTO: setShowAgeWarning not defined
- [x] Error corregido eliminando referencias innecesarias

### Pendientes de Verificar:
- [ ] Performance con muchas vacunas (>50)
- [ ] Cálculo de fechas con zonas horarias diferentes
- [ ] Eliminación de notificaciones cuando se elimina vacuna
- [ ] Qué pasa si se cambia la fecha de nacimiento después de agregar vacunas

## 📊 Métricas de Éxito

### Funcionalidad
- ✅ Esquema de 6 vacunas para perros implementado
- ✅ Validación de edad automática
- ✅ Warnings no bloquean pero informan
- ✅ Notificaciones automáticas (14 días esquema, 365 refuerzos)
- ✅ Polivalente con Rabia reemplaza Rabia correctamente
- ✅ Progreso visual con barra y porcentaje

### Performance
- ✅ Cálculos memoizados (no recalcula en cada render)
- ✅ Callbacks estables (no recrea funciones)
- ✅ Componentes separados (mejor tree shaking)
- ✅ No memory leaks (cleanup en useEffect)

### UX
- ✅ Feedback visual inmediato
- ✅ Warnings claros y accionables
- ✅ Badge "SUGERIDA" guía al usuario
- ✅ Progreso visible en tarjeta y diálogo
- ✅ Colores consistentes con la app

## 🎉 Checklist Final

Antes de marcar como "completado":
- [ ] Todos los casos de prueba pasan
- [ ] No hay errores en consola
- [ ] No hay warnings de TypeScript
- [ ] La app sigue siendo rápida y responsive
- [ ] Las notificaciones se envían correctamente
- [ ] El sistema funciona en móvil y escritorio
- [ ] Documentación actualizada
