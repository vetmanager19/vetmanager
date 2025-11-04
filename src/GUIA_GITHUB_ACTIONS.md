# 📖 Guía Completa: ¿Cómo Habilitar GitHub Actions?

## ❓ Primero: ¿Qué es GitHub?

**GitHub** es una plataforma en internet donde guardas tu código. Piensa en ella como:
- 📂 **Dropbox/Google Drive** → pero para código de programación
- 🔄 **Control de versiones** → guarda historial de cambios
- 👥 **Colaboración** → trabaja en equipo

**Tu código de VetManager debe estar guardado en GitHub.**

---

## 🤔 ¿Qué es GitHub Actions?

GitHub Actions es como un **"robot asistente"** que vive en GitHub y puede:
- ⏰ Ejecutar tareas automáticamente (como una alarma)
- 🔄 Hacer cosas repetitivas por ti
- 📧 En nuestro caso: enviar emails de notificaciones cada día

```
┌─────────────────────────────────────────┐
│  GitHub Actions = Robot que trabaja    │
│  automáticamente cada día a las 9 AM    │
│                                         │
│  Robot → Llama a tu servidor            │
│       → Envía emails a clientes         │
│       → Todo automático 🤖              │
└─────────────────────────────────────────┘
```

---

## ✉️ IMPORTANTE: El Correo de GitHub vs Correo de Emails

### 🔴 NO SE CONFUNDAN:

| Concepto | Para qué sirve | Cuál es |
|----------|----------------|---------|
| **Correo de GitHub** | Solo para tu cuenta de GitHub (login) | El que tú elijas |
| **Correo de envío de notificaciones** | De dónde salen los emails a clientes | `onboarding@resend.dev` (Resend) |

**✅ Son COMPLETAMENTE INDEPENDIENTES**

- El correo que uses en GitHub puede ser **cualquiera** (Gmail, Outlook, etc.)
- Los emails a los clientes **SIEMPRE salen de Resend** (`onboarding@resend.dev`)
- GitHub solo es la plataforma donde está el código

---

## 📋 Paso a Paso: Habilitar GitHub Actions

### ✅ Pre-requisito: Tu Código Debe Estar en GitHub

**¿Tu código ya está en GitHub?**

#### Si NO está en GitHub:
1. Ve a [github.com](https://github.com)
2. Crea una cuenta (usa cualquier email)
3. Crea un nuevo repositorio
4. Sube tu código

#### Si SÍ está en GitHub:
¡Perfecto! Continúa abajo 👇

---

### 🚀 Paso 1: Ir a tu Repositorio en GitHub

1. Abre tu navegador
2. Ve a [github.com](https://github.com)
3. Inicia sesión
4. Ve a tu repositorio de VetManager

```
URL ejemplo: github.com/tu-usuario/vetmanager
```

---

### 🚀 Paso 2: Ir a Settings (Configuración)

En la página de tu repositorio:

```
┌─────────────────────────────────────────────────┐
│  < > Code   Issues   Pull requests   Actions    │
│                                                  │
│  [Settings] ← CLICK AQUÍ                        │
└─────────────────────────────────────────────────┘
```

**Ubicación:** Menú superior, última opción a la derecha

⚠️ **Nota:** Si no ves "Settings", es porque no eres el dueño del repositorio.

---

### 🚀 Paso 3: Ir a Actions en el Menú Lateral

Dentro de Settings, en el **menú izquierdo**:

```
┌─────────────────────┐
│ General             │
│ Collaborators       │
│ > Code and automation│
│   ├─ Actions ← AQUÍ │
│   ├─ Webhooks       │
│   └─ ...            │
└─────────────────────┘
```

**Click en:** `Actions` → `General`

---

### 🚀 Paso 4: Habilitar Actions

Verás una pantalla con **"Actions permissions"**:

```
○ Disable Actions
   Evitar que cualquier Action se ejecute

○ Allow all actions and reusable workflows
   Permitir todas las Actions
   [✓] SELECCIONA ESTA OPCIÓN

○ Allow [organization] actions and reusable workflows
   Solo actions específicas
```

**Selecciona:** `Allow all actions and reusable workflows`

**Después:** Click en **[Save]** abajo

✅ ¡Listo! GitHub Actions está habilitado.

---

### 🚀 Paso 5: Verificar que el Workflow Existe

1. Ve al menú superior de tu repositorio
2. Click en **"Actions"** (junto a Pull requests)

```
┌─────────────────────────────────────────────────┐
│  < > Code   Issues   [Actions] ← CLICK AQUÍ     │
└─────────────────────────────────────────────────┘
```

**Deberías ver:**
```
All workflows
└─ Daily Notification Sender
```

Si NO aparece, significa que el archivo no está en la ubicación correcta.

---

### 🚀 Paso 6: Ejecutar Manualmente (Prueba)

Para probar que funciona AHORA (sin esperar a las 9 AM):

1. En la página de Actions
2. Click en **"Daily Notification Sender"** (lado izquierdo)
3. Verás un botón **"Run workflow"** (derecha)
4. Click en **"Run workflow"**
5. Selecciona la rama: **main** (o master)
6. Click en **"Run workflow"** verde

```
┌─────────────────────────────────────────────────┐
│  Daily Notification Sender                      │
│                                                 │
│  This workflow has a workflow_dispatch event    │
│  trigger.                                       │
│                                                 │
│  [Run workflow ▼]  ← CLICK AQUÍ                │
│                                                 │
│  ┌──────────────────────────────────────┐      │
│  │ Use workflow from                    │      │
│  │ Branch: main ▼                       │      │
│  │                                      │      │
│  │ [Run workflow]  ← CLICK AQUÍ        │      │
│  └──────────────────────────────────────┘      │
└─────────────────────────────────────────────────┘
```

---

### 🚀 Paso 7: Ver los Resultados

Después de ejecutar:

1. Verás que aparece una nueva ejecución (puede tomar 5-10 segundos)
2. Click en la ejecución (tiene un nombre como "Daily Notification Sender")
3. Click en **"send-notifications"**
4. Verás los logs en tiempo real:

```
🔄 Starting automated notification processing...
📊 Response Code: 200
✅ Notifications processed successfully!

📊 Statistics:
  ✉️  Sent: 3
  ⏭️  Skipped: 1
  ❌ Errors: 0
```

✅ Si ves esto, **¡funciona perfectamente!**

---

## 🎯 ¿Qué Pasa Después?

### Automático cada día:

```
Día 1: 9:00 AM → Robot despierta → Envía emails
Día 2: 9:00 AM → Robot despierta → Envía emails
Día 3: 9:00 AM → Robot despierta → Envía emails
...
(Para siempre, sin hacer nada)
```

**NO necesitas:**
- ❌ Tener la app abierta
- ❌ Estar conectado
- ❌ Hacer nada manualmente
- ❌ Pagar nada

**El sistema trabaja solo 24/7** 🤖

---

## ❓ Preguntas Frecuentes

### 1. ¿El correo que use en GitHub afecta los emails?
**NO.** Son completamente independientes.
- Correo de GitHub = Tu cuenta
- Correo de emails = Resend (`onboarding@resend.dev`)

### 2. ¿Puedo usar cualquier correo en GitHub?
**SÍ.** Gmail, Outlook, Yahoo, cualquiera.

### 3. ¿Cuánto cuesta GitHub Actions?
**$0 (GRATIS)** para repositorios públicos.  
Repositorios privados: 2000 minutos gratis/mes (usamos <1 minuto/mes)

### 4. ¿Y si no tengo mi código en GitHub?
Necesitas subirlo. GitHub es necesario para que funcione GitHub Actions.

**Alternativas sin GitHub:**
- Usar un servicio de Cron externo (cron-job.org, EasyCron)
- Configurar un servidor propio
- Usar servicios serverless (Vercel Cron, Railway)

### 5. ¿Puedo cambiar la hora de envío?
**SÍ.** Edita el archivo `.github/workflows/daily-notifications.yml`
```yaml
- cron: '0 15 * * *'  # 9:00 AM México
# Cambiar a:
- cron: '0 14 * * *'  # 8:00 AM México
- cron: '0 16 * * *'  # 10:00 AM México
```

### 6. ¿Cómo sé si se están enviando los emails?
1. **Revisa los logs** en GitHub Actions
2. **Pregunta a un cliente** si recibió el email
3. **Usa tu propio email** para pruebas

### 7. ¿Qué pasa si GitHub está caído?
Muy raro (99.9% uptime). Si pasa:
- Los emails de ese día no se enviarán
- Al día siguiente se enviarán los atrasados

---

## 🐛 Solución de Problemas

### ❌ No veo el botón "Settings"
**Solución:** No eres dueño del repositorio. Pide acceso al dueño.

### ❌ No aparece "Daily Notification Sender" en Actions
**Solución:** El archivo no está en la ubicación correcta.
- Debe estar en: `.github/workflows/daily-notifications.yml`
- Verifica que hayas hecho push/commit del archivo

### ❌ El workflow falla
**Solución:** Revisa los logs. Posibles causas:
1. Resend API key no configurada
2. URL del endpoint incorrecta
3. Supabase caído

### ❌ Los emails no llegan
**Solución:**
1. Verifica que los logs digan "Sent: X"
2. Revisa la carpeta de spam
3. Confirma que Resend API key esté activa

---

## ✅ Checklist Final

Antes de dar por terminado, verifica:

- [ ] Código está en GitHub
- [ ] GitHub Actions habilitado (Settings → Actions)
- [ ] Workflow existe en Actions
- [ ] Ejecutaste el workflow manualmente 1 vez
- [ ] Los logs muestran "✅ Notifications processed successfully"
- [ ] Probaste con tu propio email

**Si todos están ✅, estás listo!** 🎉

---

## 📞 ¿Necesitas Ayuda?

Si algo no funciona:
1. **Revisa esta guía paso a paso**
2. **Lee los logs de GitHub Actions** (tienen info detallada)
3. **Verifica Resend API key** en Supabase
4. **Pregunta en los foros de GitHub** (comunidad muy útil)

---

## 🎓 Resumen en 1 Minuto

```
1. Ve a github.com → tu repositorio
2. Settings → Actions → General
3. Selecciona "Allow all actions"
4. Save
5. Actions → Daily Notification Sender → Run workflow
6. Verifica logs: ✅ Success
7. ¡Listo! Funciona automático desde ahora
```

**Tiempo total:** 5-10 minutos  
**Costo:** $0  
**Dificultad:** Fácil ⭐⭐☆☆☆

---

**¡Ya está todo configurado!** El sistema enviará emails automáticamente cada día a las 9 AM sin que tengas que hacer nada más. 🚀
