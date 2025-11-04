# 🎯 Cómo Habilitar GitHub Actions - Guía Simple

## ❓ Pregunta: ¿El correo de GitHub afecta los emails que se envían a los clientes?

### ✅ RESPUESTA CLARA:

**NO. Son cosas completamente separadas:**

| Concepto | Propósito | Email que se usa |
|----------|-----------|------------------|
| **Cuenta de GitHub** | Iniciar sesión en GitHub y gestionar código | Cualquier email tuyo (personal, trabajo, etc.) |
| **Emails a clientes** | Enviar notificaciones de vacunas | `VetManager <onboarding@resend.dev>` (configurado en Resend) |

**Conclusión:** Puedes usar **CUALQUIER correo** para tu cuenta de GitHub. Los emails a tus clientes siempre saldrán desde la configuración de Resend, no desde tu cuenta de GitHub.

---

## 📋 Guía Paso a Paso

### Paso 1️⃣: Tener código en GitHub

**¿Ya tienes el código subido a GitHub?**
- ✅ **Sí** → Pasa al Paso 2
- ❌ **No** → Necesitas subirlo primero

**Si necesitas subirlo:**

1. **Crea una cuenta en GitHub** (si no tienes):
   - Ve a https://github.com/signup
   - Usa cualquier email
   - Completa el registro

2. **Crea un nuevo repositorio:**
   - Click en "+" (esquina superior derecha)
   - "New repository"
   - Nombre: `vetmanager` (o el que prefieras)
   - **MUY IMPORTANTE:** Elige **Público** (para tener GitHub Actions gratis ilimitado)
   - Click "Create repository"

3. **Sube tu código:**
   - Sigue las instrucciones que GitHub te muestra
   - O usa un cliente Git como GitHub Desktop

---

### Paso 2️⃣: Habilitar GitHub Actions

**A. Ve a tu repositorio en GitHub:**
```
https://github.com/TU-USUARIO/vetmanager
```

**B. Click en "Settings" (pestaña superior derecha)**

**C. En el menú lateral izquierdo:**
```
Click en "Actions" → "General"
```

**D. Busca la sección "Actions permissions" y selecciona:**
```
🔘 Allow all actions and reusable workflows
```

**E. Scroll abajo y click en "Save"**

✅ **¡Listo! GitHub Actions está habilitado.**

---

### Paso 3️⃣: Verificar que el Workflow está en GitHub

**A. En tu repositorio, navega a:**
```
.github/workflows/daily-notifications.yml
```

**B. Verifica que el archivo existe**
- Si lo ves → ✅ Perfecto
- Si no existe → Necesitas hacer commit y push del archivo

**C. El archivo debe estar en esta ruta EXACTA:**
```
.github/workflows/daily-notifications.yml
```
No en `/workflows/` sino en `/.github/workflows/`

---

### Paso 4️⃣: Probar Manualmente (Primera Vez)

**A. Ve a la pestaña "Actions" en tu repositorio:**
```
https://github.com/TU-USUARIO/vetmanager/actions
```

**B. Deberías ver "Daily Notification Sender" en la lista de workflows**

**C. Click en "Daily Notification Sender"**

**D. Click en el botón "Run workflow" (esquina superior derecha)**

**E. Selecciona la rama (probablemente "main")**

**F. Click en "Run workflow" (verde)**

**G. Espera 30 segundos y refresca la página**

**H. Verás la ejecución:**
- 🟡 **Amarillo** = Ejecutando
- ✅ **Verde** = ¡Éxito!
- ❌ **Rojo** = Error (revisa los logs)

**I. Click en la ejecución para ver los logs detallados**

Deberías ver algo como:
```
🔄 Starting automated notification processing...
📊 Response Code: 200
✅ Notifications processed successfully!

📊 Statistics:
  ✉️  Sent: 2
  ⏭️  Skipped: 0
  ❌ Errors: 0
```

---

### Paso 5️⃣: Configurar Ejecución Automática (Ya está listo)

**¡No necesitas hacer nada más!**

El workflow ya está configurado para ejecutarse **automáticamente todos los días a las 9:00 AM** (hora México).

Solo espera hasta mañana y verás que se ejecuta solo.

---

## 🔍 Verificar que Funciona

### Ver ejecuciones automáticas:
1. Ve a la pestaña "Actions"
2. Cada día a las 9 AM verás una nueva ejecución
3. No necesitas hacer nada, es completamente automático

### Recibir notificaciones si hay errores:
1. Settings → Notifications
2. Marca "Send notifications for failed workflows"
3. Así recibirás un email si algo falla

---

## 🐛 Problemas Comunes

### ❌ "Workflows aren't being run on this repository"

**Solución:**
```
Settings → Actions → General
→ Allow all actions and reusable workflows
→ Save
```

---

### ❌ "No workflows found"

**Causa:** El archivo no está en la ubicación correcta.

**Solución:**
```
1. El archivo DEBE estar en: .github/workflows/daily-notifications.yml
2. Hacer commit y push:
   git add .github/workflows/daily-notifications.yml
   git commit -m "Add workflow"
   git push
3. Refresca la página de Actions
```

---

### ❌ Workflow falla con error 500

**Posibles causas:**

**1. Revisar el API key de Resend:**
```
→ Ve a Supabase Dashboard
→ Settings → Edge Functions → Secrets
→ Verifica que RESEND_API_KEY existe y es correcto
```

**2. Ver los logs del servidor:**
```
→ Ve a Supabase Dashboard
→ Edge Functions → Logs
→ Busca errores relacionados con /process-notifications
```

---

### ℹ️ "Sent: 0" - ¿Es un error?

**No, es normal.**

Significa que no hay notificaciones pendientes para enviar ese día.

Esto ocurre cuando:
- No hay vacunas con refuerzos próximos (dentro de 7 días)
- Ya se enviaron todas las notificaciones

---

## 💰 Costos de GitHub Actions

### Repositorio Público (RECOMENDADO):
- ✅ **100% GRATIS**
- ✅ **Ejecuciones ilimitadas**
- ✅ **Sin cargos nunca**

### Repositorio Privado:
- ⚠️ 2000 minutos gratis al mes
- ⚠️ Este workflow usa ~30 segundos/día = 15 minutos/mes
- ✅ Alcanza perfectamente dentro del plan gratuito

**Recomendación:** Usa repositorio **público** para tener todo gratis sin preocupaciones.

---

## ✅ Checklist de Verificación

Marca cada punto para confirmar que todo está listo:

- [ ] Código subido a GitHub
- [ ] Settings → Actions → "Allow all actions" habilitado
- [ ] Archivo en `.github/workflows/daily-notifications.yml` (con el punto al inicio)
- [ ] Pestaña Actions muestra "Daily Notification Sender"
- [ ] Ejecución manual funciona (ícono verde ✅)
- [ ] Logs muestran "✅ Notifications processed successfully!"
- [ ] Estadísticas se muestran correctamente (Sent, Skipped, Errors)

Si todos los puntos están marcados: **¡Sistema 100% funcional!** 🎉

---

## 📞 Resumen Ultra-Rápido (30 segundos)

1. Sube código a GitHub
2. Settings → Actions → "Allow all actions"
3. Actions → "Run workflow" → Ver ícono verde ✅
4. **Listo.** Se ejecuta solo cada día a las 9 AM

---

## 🎉 Conclusión

Una vez que veas el **ícono verde ✅** en la primera ejecución manual:

✅ El sistema está completamente funcional  
✅ Se ejecutará automáticamente todos los días  
✅ No necesitas hacer nada más  
✅ Los emails se enviarán solos cada mañana  

**¡Puedes olvidarte del sistema y dejarlo trabajar!**

---

**Última actualización:** 4 de noviembre, 2025  
**Sistema:** VetManager - Notificaciones Automáticas  
**Estado:** ✅ Listo para producción
