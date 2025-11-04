# 🚀 Guía Rápida: Activar Sistema de Notificaciones Automáticas

## ⚡ 3 Pasos para Activar el Sistema

### Paso 1: Habilitar GitHub Actions ⚙️

1. Ve a tu repositorio en GitHub
2. Click en **"Settings"** (arriba a la derecha)
3. En el menú izquierdo, click en **"Actions"** → **"General"**
4. En "Actions permissions", selecciona **"Allow all actions and reusable workflows"**
5. Click en **"Save"**

✅ **Listo!** El workflow ahora puede ejecutarse automáticamente.

---

### Paso 2: Verificar que Resend API Key esté Configurada 🔑

**Ya lo tienes configurado** según los secretos que me proporcionaste, pero para verificar:

1. Ve a [Supabase Dashboard](https://supabase.com/dashboard)
2. Selecciona tu proyecto
3. Ve a **Settings** → **Edge Functions** → **Secrets**
4. Verifica que exista: `RESEND_API_KEY`

Si necesitas crear una API key de Resend:
- Ve a [resend.com](https://resend.com)
- Regístrate o inicia sesión
- Ve a "API Keys" y crea una nueva
- Cópiala y agrégala en Supabase Secrets

✅ **Listo!** El servidor puede enviar emails.

---

### Paso 3: Probar el Sistema 🧪

#### Opción A: Esperar a mañana a las 9 AM
El sistema se ejecutará automáticamente y enviará los emails pendientes.

#### Opción B: Ejecutar Manualmente Ahora (Recomendado)

1. Ve a tu repositorio en GitHub
2. Click en **"Actions"** (en el menú superior)
3. En el menú izquierdo, selecciona **"Daily Notification Sender"**
4. Click en **"Run workflow"** (botón azul a la derecha)
5. Selecciona la rama `main` (o la que uses)
6. Click en **"Run workflow"** para confirmar

**Verás:**
```
🔄 Starting automated notification processing...
📊 Response Code: 200
✅ Notifications processed successfully!

📊 Statistics:
  ✉️  Sent: X
  ⏭️  Skipped: X
  ❌ Errors: X
```

✅ **Listo!** Los emails fueron enviados.

---

## 📅 Programación Automática

Una vez activado, el sistema funciona así:

```
┌─────────────────────────────────────────────┐
│  Todos los días a las 9:00 AM (México)      │
│  ─────────────────────────────────────────  │
│  1. GitHub Actions despierta                │
│  2. Llama a tu servidor Supabase            │
│  3. El servidor busca notificaciones del día│
│  4. Envía emails a los clientes             │
│  5. Marca notificaciones como enviadas      │
└─────────────────────────────────────────────┘
```

**NO necesitas hacer nada más.** El sistema trabaja solo.

---

## 🎯 Cómo Usar el Sistema

### 1. Registrar un Paciente con Email
```
Nombre del Cliente: Juan Pérez
Email: juan@ejemplo.com ← REQUERIDO para notificaciones
Teléfono: +52 (55) 1234-5678
```

### 2. Registrar una Vacuna que Requiera Refuerzo
```
Ejemplo: Polivalente para un perro
- El sistema automáticamente:
  ✅ Calcula fecha de refuerzo (1 año después)
  ✅ Crea notificación para 7 días antes
  ✅ Programa el envío automático
```

### 3. Ver Notificaciones Programadas
```
1. Click en botón "Notificaciones" (campana amarilla)
2. Verás todas las notificaciones:
   - Pendientes (⏳) - Se enviarán en su fecha
   - Enviadas (✓) - Ya fueron enviadas por email
```

---

## ✅ Verificación

### ¿Cómo saber si está funcionando?

#### Check 1: GitHub Actions se Ejecuta
- Ve a **Actions** en GitHub
- Deberías ver ejecuciones diarias de "Daily Notification Sender"
- Status: ✅ (verde) = Todo OK

#### Check 2: Notificaciones se Marcan como Enviadas
- En la app, abre el panel de Notificaciones
- Las notificaciones pasadas deben mostrar:
  - Badge verde: **"✓ Enviado"**
  - Fecha de envío en lugar de fecha programada

#### Check 3: Los Clientes Reciben Emails
- Pregunta a un cliente si recibió el email
- O usa tu propio email para probar

---

## 🛠️ Cambiar Hora de Envío

Si quieres que los emails se envíen a otra hora:

1. Edita `.github/workflows/daily-notifications.yml`
2. Encuentra la línea:
   ```yaml
   - cron: '0 15 * * *'  # 9:00 AM Mexico
   ```
3. Cámbiala según la hora deseada:
   ```yaml
   # 8:00 AM Mexico (14:00 UTC)
   - cron: '0 14 * * *'
   
   # 10:00 AM Mexico (16:00 UTC)
   - cron: '0 16 * * *'
   
   # 12:00 PM Mexico (18:00 UTC)
   - cron: '0 18 * * *'
   ```

**Fórmula:** Hora en México + 6 = Hora en UTC

---

## 📧 Ejemplo de Email que Reciben los Clientes

```
┌──────────────────────────────────────────────┐
│  🐾 Refuerzo de Polivalente                  │
│  ────────────────────────────────────────    │
│                                              │
│  Hola Juan Pérez,                            │
│                                              │
│  Max necesita su refuerzo anual de           │
│  Polivalente el 15/11/2025                   │
│                                              │
│  Por favor contacta a tu veterinaria para    │
│  agendar la cita lo antes posible.           │
│                                              │
│  📋 Información del recordatorio:            │
│  • Paciente: Max                             │
│  • Tipo: Vacuna                              │
│  • Vacuna: Polivalente                       │
│  • Fecha recomendada: 15/11/2025             │
│                                              │
└──────────────────────────────────────────────┘
```

---

## ❓ FAQ

### ¿Qué pasa si no hay notificaciones pendientes?
El sistema se ejecuta igual, pero no envía nada. Los logs mostrarán `Sent: 0`.

### ¿Cuánto cuesta GitHub Actions?
- **Repositorios públicos:** GRATIS ilimitado
- **Repositorios privados:** 2000 minutos gratis/mes (usamos <1 minuto/mes)

### ¿Puedo pausar el sistema temporalmente?
Sí:
1. Ve a `.github/workflows/daily-notifications.yml`
2. Comenta la línea del cron:
   ```yaml
   # - cron: '0 15 * * *'
   ```
3. Commit y push

### ¿Los emails pueden ir a spam?
Posiblemente al inicio. Para mejorar la entrega:
- Usa un dominio personalizado en Resend
- Configura SPF y DKIM records
- Pide a los clientes agregar tu email a contactos

---

## 🎉 ¡Todo Listo!

Tu sistema de notificaciones automáticas está configurado y funcionando.

**Próximos pasos:**
1. ✅ Ejecuta el workflow manualmente para probarlo
2. ✅ Registra algunos pacientes con emails válidos
3. ✅ Registra vacunas con refuerzos
4. ✅ Espera a mañana a las 9 AM y verifica que funcione

**Soporte:** Para cualquier problema, revisa `CRON_SYSTEM.md` que tiene troubleshooting detallado.
