# ⚡ Quick Start - Activar Notificaciones Automáticas

## 🚀 3 Pasos Rápidos

### 1️⃣ Habilitar GitHub Actions (1 minuto)
```
Repo → Settings → Actions → General
→ "Allow all actions"
→ Save
```

### 2️⃣ Probar Ahora (2 minutos)
```
Repo → Actions → "Daily Notification Sender"
→ "Run workflow"
→ Ver resultados en logs
```

### 3️⃣ Listo! ✅
El sistema se ejecutará automáticamente cada día a las 9:00 AM

---

## 📧 Para Probar con un Email Real

1. **Registra un cliente:**
   - Nombre: Tu Nombre
   - Email: **tu_email@gmail.com** ← USA TU EMAIL REAL
   - Llena los demás campos

2. **Registra una vacuna:**
   - Elige cualquier vacuna que requiera refuerzo anual
   - Pon fecha de hoy
   - El sistema creará notificación para 7 días antes del refuerzo anual

3. **Cambia la fecha programada manualmente (para prueba):**
   - Ve a Supabase Dashboard
   - Edge Functions → Logs
   - O espera hasta que llegue la fecha

4. **Ejecuta el workflow manualmente:**
   - GitHub → Actions → Run workflow
   - Revisa tu email!

---

## 📱 Ver Notificaciones en la App

```
Click en el botón amarillo 🔔 "Notificaciones"
Verás:
  • Notificaciones pendientes
  • Banner: "Sistema automático activo"
  • Estado de cada notificación
```

---

## 🐛 Si algo no funciona

### Email no llega?
1. ✅ Revisa spam/correo no deseado
2. ✅ Verifica que Resend API key esté configurada
3. ✅ Revisa logs de GitHub Actions

### Workflow no se ejecuta?
1. ✅ Actions debe estar habilitado
2. ✅ El archivo `.yml` debe estar en `main` branch
3. ✅ Prueba ejecución manual

### ¿Dudas?
Lee `SETUP_NOTIFICACIONES.md` para guía completa

---

## ✅ Checklist

- [ ] GitHub Actions habilitado
- [ ] Workflow ejecutado manualmente 1 vez
- [ ] Email de prueba recibido
- [ ] Documentación leída

**¡Listo para producción!** 🎉
