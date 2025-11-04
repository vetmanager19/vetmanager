# 🚀 Cómo Habilitar GitHub Actions - Guía Visual

## ❓ Pregunta Importante: ¿El email de GitHub afecta los correos?

**RESPUESTA: NO** ❌

- 📧 **Email de tu cuenta GitHub:** Solo para iniciar sesión en GitHub (puede ser cualquiera)
- ✉️ **Email de origen de las notificaciones:** Ya está configurado como `VetManager <onboarding@resend.dev>`

**Puedes usar CUALQUIER correo para GitHub.** Los emails a tus clientes saldrán desde Resend, no desde tu cuenta de GitHub.

---

## 📋 Pasos para Habilitar GitHub Actions

### Opción 1: Si NO tienes cuenta de GitHub

#### Paso 1: Crear cuenta en GitHub (2 minutos)
```
1. Ve a https://github.com/signup
2. Ingresa cualquier email (ejemplo: tuemail@gmail.com)
3. Crea una contraseña
4. Elige un username
5. Verifica tu email
6. Listo! ✅
```

#### Paso 2: Subir tu código a GitHub
Tu aplicación necesita estar en un repositorio de GitHub para usar GitHub Actions.

**¿Ya tienes el código en GitHub?**
- ✅ Sí → Ve al Paso 3
- ❌ No → Necesitas crear un repositorio y subir el código

**Crear repositorio:**
```
1. En GitHub, click en "+" (arriba derecha)
2. Click en "New repository"
3. Nombre: "vetmanager" (o el que prefieras)
4. Descripción: "Sistema de gestión veterinaria"
5. Elige: Public (gratis) o Private (requiere plan de pago para Actions)
6. Click "Create repository"
7. Sigue las instrucciones para subir tu código
```

---

### Opción 2: Si YA tienes el código en GitHub

#### Paso 3: Habilitar GitHub Actions en tu Repositorio

**A. Ve a tu repositorio:**
```
https://github.com/TU-USUARIO/TU-REPOSITORIO
```

**B. Click en "Settings" (arriba a la derecha)**

![Settings Tab](https://docs.github.com/assets/cb-28266/images/help/repository/repo-actions-settings.png)

**C. En el menú lateral izquierdo, busca y click en "Actions"**

![Actions Menu](https://docs.github.com/assets/cb-45489/images/help/repository/actions-sidebar.png)

**D. En "Actions permissions", selecciona:**
```
⚪ Disable Actions
⚪ Allow REPOSITORY actions and reusable workflows  
🔘 Allow all actions and reusable workflows  ← SELECCIONA ESTA
```

**E. Scroll hacia abajo y click en "Save"**

✅ **Listo! GitHub Actions ya está habilitado.**

---

## 🧪 Probar que Funciona (Ejecución Manual)

### Paso 4: Ejecutar el Workflow Manualmente

**A. Ve a la pestaña "Actions" en tu repositorio**
```
https://github.com/TU-USUARIO/TU-REPOSITORIO/actions
```

**B. Verás "Daily Notification Sender" en la lista de workflows**
- Si NO aparece, es porque el archivo aún no está en la rama principal
- Asegúrate de hacer commit y push del archivo `.github/workflows/daily-notifications.yml`

**C. Click en "Daily Notification Sender"**

**D. Click en el botón azul "Run workflow"** (lado derecho)

**E. Selecciona la rama (probablemente "main")**

**F. Click en "Run workflow" (verde) para confirmar**

**G. Espera ~30 segundos y refresca la página**

**H. Verás la ejecución con un ícono:**
- 🟡 Amarillo = Ejecutando
- ✅ Verde = Exitoso
- ❌ Rojo = Error

**I. Click en la ejecución para ver los logs detallados**

---

## 📊 Ver los Resultados

En los logs verás algo como:

```
🔄 Starting automated notification processing...
📊 Response Code: 200
📄 Response Body: {...}
✅ Notifications processed successfully!

📊 Statistics:
  ✉️  Sent: 3
  ⏭️  Skipped: 1
  ❌ Errors: 0
```

**Interpretación:**
- **Sent:** Emails enviados exitosamente
- **Skipped:** Notificaciones sin email (se saltaron)
- **Errors:** Errores al enviar

---

## 🔍 Verificar que el Cron Automático Funciona

Una vez habilitado GitHub Actions:

1. **Espera hasta mañana a las 9:00 AM** (hora México)
2. **Ve a Actions en GitHub**
3. **Verás una nueva ejecución automática**
4. **El workflow se ejecutará solo TODOS los días a las 9 AM**

**No necesitas hacer nada más. Es automático.** ✅

---

## 🐛 Problemas Comunes

### ❌ Error: "Workflows aren't being run on this repository"

**Solución:**
```
Settings → Actions → General
→ Selecciona "Allow all actions and reusable workflows"
→ Save
```

---

### ❌ Error: "No workflows found"

**Causa:** El archivo `.github/workflows/daily-notifications.yml` no está en la rama principal.

**Solución:**
```
1. Verifica que el archivo exista en:
   .github/workflows/daily-notifications.yml
   
2. Haz commit:
   git add .github/workflows/daily-notifications.yml
   git commit -m "Add daily notifications workflow"
   git push origin main
   
3. Refresca la página de Actions
```

---

### ❌ Workflow falla (ícono rojo)

**Posibles causas:**

**1. Resend API Key no configurada:**
```
Solución:
→ Ve a Supabase Dashboard
→ Settings → Edge Functions → Secrets
→ Verifica que exista RESEND_API_KEY
```

**2. Endpoint del servidor tiene un error:**
```
Solución:
→ Ve a los logs del workflow
→ Lee el error específico
→ Revisa los logs en Supabase Edge Functions
```

**3. No hay notificaciones pendientes:**
```
Esto NO es un error. El workflow se ejecuta igual.
Verás: "Sent: 0"
```

---

## 💡 Tips Importantes

### ✅ Repositorio Público vs Privado

**Repositorio PÚBLICO:**
- ✅ GitHub Actions **100% GRATIS**
- ✅ Ejecuciones ilimitadas
- ✅ **RECOMENDADO para este proyecto**

**Repositorio PRIVADO:**
- ⚠️ 2000 minutos gratis/mes
- ⚠️ Nuestro workflow usa ~30 seg/día = 15 min/mes
- ✅ Alcanza perfectamente, pero no necesario

**Recomendación:** Usa repositorio PÚBLICO para aprovechar GitHub Actions gratis ilimitado.

---

### 🔔 Notificaciones de GitHub

Puedes configurar GitHub para que te envíe un email si el workflow falla:

```
Settings → Notifications → Actions
→ Marca "Send notifications for failed workflows"
```

Así sabrás si algo sale mal.

---

## ✅ Checklist Final

Después de habilitar GitHub Actions, verifica:

- [ ] Settings → Actions → "Allow all actions" está seleccionado
- [ ] Actions tab muestra "Daily Notification Sender"
- [ ] Ejecución manual funciona correctamente
- [ ] Logs muestran estadísticas (Sent: X, Skipped: X, Errors: X)
- [ ] En 24 horas verás ejecución automática a las 9 AM

---

## 🎉 ¡Listo!

Una vez que veas el ícono verde ✅ en la primera ejecución manual, tu sistema está **100% funcional y automático**.

**No necesitas hacer nada más.** Cada día a las 9 AM, GitHub Actions enviará automáticamente los emails a tus clientes.

---

## 📞 Resumen Ultra-Rápido

1. **Iniciar sesión en GitHub** (cualquier email)
2. **Settings → Actions → "Allow all actions"**
3. **Actions → "Run workflow"**
4. **Ver logs para confirmar que funciona**
5. **Olvidarte de todo y dejar que trabaje solo** ✨

---

**Fecha:** 4 de noviembre, 2025  
**Sistema:** VetManager Notifications  
**Estado:** ✅ Listo para activar
