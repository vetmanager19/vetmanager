# 🔄 Flujo Completo del Sistema de Notificaciones

## 📧 ¿De Dónde Salen los Emails?

```
┌─────────────────────────────────────────────────────────────┐
│                    ORIGEN DE LOS EMAILS                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Email que usas en GitHub:  tuemail@gmail.com              │
│  ├─ Solo para iniciar sesión en GitHub                     │
│  └─ NO se usa para enviar notificaciones                   │
│                                                             │
│  Email de las notificaciones:  onboarding@resend.dev       │
│  ├─ Configurado en el código del backend                   │
│  ├─ Provisto por Resend (servicio de emails)              │
│  └─ Este es el que ven tus clientes como remitente        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**En resumen:** El correo de GitHub es solo TU login. Los emails a clientes salen de Resend.

---

## 🔄 Flujo Completo: Desde Registro hasta Email

### 1️⃣ Registro de Vacuna (En la App)

```
Veterinario registra vacuna con refuerzo
├─ Paciente: "Max"
├─ Dueño: "Juan Pérez"
├─ Email: "juan@ejemplo.com" ← IMPORTANTE
├─ Vacuna: "Polivalente"
├─ Fecha: "2024-11-04"
└─ Refuerzo: "2025-11-04" (automático: +1 año)
       ↓
Sistema crea NOTIFICACIÓN automáticamente
├─ scheduledDate: "2025-10-28" (7 días antes)
├─ isSent: false
├─ ownerEmail: "juan@ejemplo.com"
└─ Guardada en Supabase KV Store
```

---

### 2️⃣ GitHub Actions Despierta (Automático)

```
⏰ Cada día a las 9:00 AM (Mexico)
       ↓
GitHub Actions ejecuta:
├─ Archivo: .github/workflows/daily-notifications.yml
├─ Servidor: Ubuntu Linux (GitHub)
└─ Comando: curl POST a Supabase
       ↓
┌──────────────────────────────────────────┐
│  GitHub Actions                          │
│  ┌────────────────────────────────────┐  │
│  │  🤖 Ejecutando workflow...         │  │
│  │  📤 POST /process-notifications    │  │
│  │  ⏳ Esperando respuesta...         │  │
│  └────────────────────────────────────┘  │
└──────────────────────────────────────────┘
```

---

### 3️⃣ Backend Procesa (Supabase Edge Function)

```
POST /process-notifications recibido
       ↓
Backend busca en base de datos:
├─ Obtiene TODAS las notificaciones
├─ Filtra: scheduledDate <= HOY
└─ Filtra: isSent == false
       ↓
Resultado: 3 notificaciones pendientes
├─ Notificación 1: Max (Polivalente)
├─ Notificación 2: Luna (Triple Felina)
└─ Notificación 3: Bobby (Rabia)
       ↓
Para CADA notificación:
       ↓
```

---

### 4️⃣ Envío de Email (Resend API)

```
┌────────────────────────────────────────────┐
│  Notificación 1: Max (Polivalente)        │
├────────────────────────────────────────────┤
│                                            │
│  1. Backend construye email HTML:          │
│     ├─ Header verde con logo              │
│     ├─ Saludo: "Hola Juan Pérez"         │
│     ├─ Mensaje: "Max necesita refuerzo"  │
│     └─ Footer con info                    │
│                                            │
│  2. Backend llama a Resend API:            │
│     POST https://api.resend.com/emails     │
│     {                                      │
│       from: "VetManager <onboarding@..>", │
│       to: "juan@ejemplo.com",             │
│       subject: "Refuerzo de Polivalente", │
│       html: "<div>...</div>"              │
│     }                                      │
│                                            │
│  3. Resend envía el email:                 │
│     juan@ejemplo.com ← 📧 recibe email    │
│                                            │
│  4. Backend registra en logs:              │
│     ✅ Email enviado a juan@ejemplo.com   │
│                                            │
└────────────────────────────────────────────┘
       ↓
Se repite para las otras 2 notificaciones
       ↓
```

---

### 5️⃣ Resultado Final

```
Backend responde a GitHub Actions:
{
  "success": true,
  "sentCount": 3,
  "skippedCount": 0,
  "errorCount": 0,
  "message": "Emails sent successfully"
}
       ↓
GitHub Actions registra en logs:
┌────────────────────────────────┐
│  ✅ Notifications processed!   │
│  📊 Statistics:                │
│    ✉️  Sent: 3                │
│    ⏭️  Skipped: 0             │
│    ❌ Errors: 0               │
└────────────────────────────────┘
       ↓
Workflow termina exitosamente ✅
       ↓
GitHub Actions duerme hasta mañana 😴
```

---

## 📱 Lo que Ve el Cliente (Juan Pérez)

```
📧 Email recibido en: juan@ejemplo.com

┌─────────────────────────────────────────────┐
│  De: VetManager <onboarding@resend.dev>    │
│  Para: juan@ejemplo.com                     │
│  Asunto: 🐾 Refuerzo de Polivalente        │
├─────────────────────────────────────────────┤
│                                             │
│  [HEADER VERDE CON GRADIENTE]              │
│  🐾 Refuerzo de Polivalente                │
│                                             │
│  Hola Juan Pérez,                           │
│                                             │
│  Max necesita su refuerzo anual de          │
│  Polivalente el 04/11/2025                  │
│                                             │
│  Por favor contacta a tu veterinaria para   │
│  agendar la cita lo antes posible.          │
│                                             │
│  [BOX AMARILLO CON INFO]                    │
│  📋 Información del recordatorio:           │
│  • Paciente: Max                            │
│  • Tipo: Vacuna                             │
│  • Vacuna: Polivalente                      │
│  • Fecha recomendada: 04/11/2025           │
│                                             │
│  [FOOTER GRIS]                              │
│  Este es un recordatorio automático...      │
│                                             │
└─────────────────────────────────────────────┘
```

---

## 🔑 Componentes del Sistema

```
┌──────────────────────────────────────────────────────────┐
│                     ARQUITECTURA                         │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  1. FRONTEND (App React)                                │
│     ├─ Corre en navegador del veterinario              │
│     ├─ Registra pacientes y vacunas                    │
│     └─ Crea notificaciones en BD                       │
│                                                          │
│  2. BACKEND (Supabase Edge Function)                    │
│     ├─ Corre en servidores de Supabase                 │
│     ├─ Procesa notificaciones                          │
│     ├─ Envía emails via Resend                         │
│     └─ Endpoint: /process-notifications                 │
│                                                          │
│  3. BASE DE DATOS (Supabase KV Store)                   │
│     ├─ Guarda notificaciones                           │
│     ├─ Guarda clientes                                 │
│     └─ Formato: user_{id}_notification_{id}            │
│                                                          │
│  4. RESEND (Servicio de Emails)                         │
│     ├─ API para enviar emails                          │
│     ├─ Maneja deliverability                           │
│     └─ Email origen: onboarding@resend.dev             │
│                                                          │
│  5. GITHUB ACTIONS (Automatización)                     │
│     ├─ Cron job diario (9 AM)                          │
│     ├─ Llama al backend                                │
│     ├─ Registra logs                                   │
│     └─ Gratis e ilimitado (repo público)               │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

---

## 🎯 Puntos Clave

### ✅ Lo que SÍ necesitas hacer:

1. **Crear cuenta en GitHub** (cualquier email)
2. **Subir tu código a GitHub** (crear repositorio)
3. **Habilitar Actions** (Settings → Actions)
4. **Ejecutar workflow manualmente 1 vez** (para probar)

### ✅ Lo que el sistema hace SOLO:

1. **Ejecutarse cada día a las 9 AM**
2. **Buscar notificaciones pendientes**
3. **Enviar emails a clientes**
4. **Registrar estadísticas**

### ❌ Lo que NO necesitas hacer:

1. ❌ Configurar servidor de emails
2. ❌ Abrir la app todos los días
3. ❌ Enviar emails manualmente
4. ❌ Pagar por el servicio (es gratis)

---

## 💰 Costos Desglosados

```
┌────────────────────────────────────────────┐
│  SERVICIO          PLAN         COSTO      │
├────────────────────────────────────────────┤
│  GitHub Actions    Público      $0 ✅      │
│  Resend API        3K/mes       $0 ✅      │
│  Supabase          Gratis       $0 ✅      │
├────────────────────────────────────────────┤
│  TOTAL MENSUAL:                 $0 🎉      │
└────────────────────────────────────────────┘
```

---

## 🎓 Resumen Ultra-Simple

**Piénsalo así:**

1. **Tú** registras vacunas en la app
2. **La app** guarda notificaciones programadas
3. **GitHub** "despierta" cada día a las 9 AM
4. **GitHub** le dice a tu servidor "envía los emails"
5. **Tu servidor** busca las pendientes y las envía
6. **Resend** entrega los emails a tus clientes
7. **Tus clientes** reciben el recordatorio

**Tu trabajo:** Solo registrar vacunas. El resto es automático. ✨

---

**¿Dudas?** Lee `GITHUB_ACTIONS_SETUP.md` para instrucciones paso a paso.
