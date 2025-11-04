# 🎓 Guía Completa: Subir tu Proyecto a GitHub (Desde Cero)

## 📚 Índice
1. [Crear cuenta en GitHub](#paso-1-crear-cuenta-en-github)
2. [Instalar Git en tu computadora](#paso-2-instalar-git)
3. [Configurar Git](#paso-3-configurar-git)
4. [Crear repositorio en GitHub](#paso-4-crear-repositorio-en-github)
5. [Preparar tu proyecto local](#paso-5-preparar-tu-proyecto-local)
6. [Subir tu código a GitHub](#paso-6-subir-tu-código-a-github)
7. [Habilitar GitHub Actions](#paso-7-habilitar-github-actions)
8. [Probar el sistema](#paso-8-probar-el-sistema)

---

## Paso 1️⃣: Crear Cuenta en GitHub

### A. Ve a GitHub
1. Abre tu navegador
2. Ve a: **https://github.com**
3. Click en el botón **"Sign up"** (esquina superior derecha)

### B. Completa el registro
1. **Email:** Ingresa tu correo (puede ser cualquiera: Gmail, Outlook, etc.)
   - ⚠️ Este correo NO afecta los emails a tus clientes
   - Es solo para tu cuenta de GitHub
   
2. **Contraseña:** Crea una contraseña segura

3. **Username:** Elige un nombre de usuario
   - Ejemplo: `tu-nombre-vet`, `veterinaria-xyz`, etc.
   - Este será parte de la URL de tu proyecto

4. Click en **"Continue"**

5. Verifica tu email (GitHub te enviará un código)

6. Completa las preguntas de GitHub (puedes skip)

✅ **¡Listo! Ya tienes cuenta en GitHub.**

---

## Paso 2️⃣: Instalar Git

Git es el programa que te permite subir código a GitHub.

### Para Windows:

1. **Descarga Git:**
   - Ve a: **https://git-scm.com/download/win**
   - Se descargará automáticamente
   - Archivo: `Git-2.x.x-64-bit.exe`

2. **Instala Git:**
   - Doble click en el archivo descargado
   - **IMPORTANTE:** En todas las pantallas, deja las opciones por defecto
   - Solo da click en "Next" hasta finalizar
   - Click en "Install"
   - Click en "Finish"

3. **Verifica la instalación:**
   - Abre "Terminal" o "CMD" (búscalo en el menú inicio)
   - Escribe: `git --version`
   - Presiona Enter
   - Deberías ver algo como: `git version 2.43.0`

### Para Mac:

1. **Abre Terminal:**
   - Presiona `Cmd + Espacio`
   - Escribe "Terminal"
   - Presiona Enter

2. **Instala Git:**
   - Copia y pega este comando:
   ```bash
   git --version
   ```
   - Si no está instalado, Mac te preguntará si quieres instalarlo
   - Click en "Instalar"

### Para Linux:

```bash
sudo apt-get update
sudo apt-get install git
```

✅ **Git instalado correctamente.**

---

## Paso 3️⃣: Configurar Git

Esto solo se hace UNA vez.

### A. Abre la Terminal/CMD

**Windows:**
- Presiona `Windows + R`
- Escribe `cmd`
- Presiona Enter

**Mac/Linux:**
- Abre "Terminal"

### B. Configura tu nombre y email

Copia y pega estos comandos **UNO POR UNO** (reemplaza con tus datos):

```bash
git config --global user.name "Tu Nombre"
```

Presiona Enter, luego:

```bash
git config --global user.email "tuemail@ejemplo.com"
```

**Ejemplo:**
```bash
git config --global user.name "Juan Pérez"
git config --global user.email "juan@gmail.com"
```

### C. Verifica que funcionó

```bash
git config --global --list
```

Deberías ver tu nombre y email.

✅ **Git configurado correctamente.**

---

## Paso 4️⃣: Crear Repositorio en GitHub

Un repositorio es como una "carpeta" en GitHub donde vivirá tu código.

### A. Ve a GitHub

1. Inicia sesión en **https://github.com**
2. Verás tu página principal

### B. Crear nuevo repositorio

1. **Click en el botón "+" (esquina superior derecha)**
2. **Click en "New repository"**

### C. Configurar el repositorio

**Llena los siguientes campos:**

1. **Repository name:** 
   - Escribe: `vetmanager`
   - (Puedes usar otro nombre si prefieres)

2. **Description (opcional):**
     - Escribe: `Sistema de gestión para veterinaria`

3. **Visibility:**
   - ✅ Selecciona **"Public"** (IMPORTANTE para GitHub Actions gratis)
   - ⚠️ NO selecciones "Private" (tiene limitaciones)

4. **Initialize this repository with:**
   - ❌ NO marques nada
   - Deja todo sin marcar
   - (Vamos a subir el código desde tu computadora)

5. **Click en el botón verde "Create repository"**

### D. Copia la URL de tu repositorio

Verás una página con instrucciones. En la parte superior verás una URL como:

```
https://github.com/TU-USUARIO/vetmanager.git
```

**Copia esta URL completa.** La necesitarás después.

✅ **Repositorio creado en GitHub.**

---

## Paso 5️⃣: Preparar tu Proyecto Local

Ahora vamos a preparar tu proyecto en tu computadora.

### A. Ubica tu carpeta del proyecto

1. Abre la Terminal/CMD
2. Navega a la carpeta donde está tu proyecto VetManager

**Ejemplo en Windows:**
```bash
cd C:\Users\TuNombre\Documentos\vetmanager
```

**Ejemplo en Mac/Linux:**
```bash
cd ~/Documents/vetmanager
```

**💡 Tip:** Puedes arrastrar la carpeta a la Terminal para obtener la ruta automáticamente.

### B. Verifica que estás en la carpeta correcta

```bash
dir
```
(En Windows)

o

```bash
ls
```
(En Mac/Linux)

Deberías ver archivos como: `App.tsx`, `package.json`, carpeta `components/`, etc.

✅ **Estás en la carpeta correcta.**

---

## Paso 6️⃣: Subir tu Código a GitHub

### A. Inicializar Git en tu proyecto

```bash
git init
```

Verás un mensaje como: `Initialized empty Git repository...`

### B. Agregar todos los archivos

```bash
git add .
```

El punto (`.`) significa "agregar todo".

### C. Crear el primer commit

Un "commit" es como una "fotografía" de tu código en este momento.

```bash
git commit -m "Primer commit: VetManager con sistema de notificaciones"
```

Verás un montón de líneas indicando los archivos agregados.

### D. Crear la rama principal

```bash
git branch -M main
```

### E. Conectar con GitHub

Recuerda la URL que copiaste antes. Ahora la usaremos:

```bash
git remote add origin https://github.com/TU-USUARIO/vetmanager.git
```

**⚠️ IMPORTANTE:** Reemplaza `TU-USUARIO` con tu usuario real de GitHub.

**Ejemplo:**
```bash
git remote add origin https://github.com/juanperez/vetmanager.git
```

### F. Subir el código a GitHub

```bash
git push -u origin main
```

**¿Qué pasará?**

1. Te pedirá usuario y contraseña de GitHub
2. **IMPORTANTE:** En lugar de contraseña, necesitas un "Personal Access Token"

### G. Crear Personal Access Token (solo primera vez)

**Si Git te pide usuario/contraseña:**

1. **Ve a GitHub en tu navegador**
2. **Click en tu foto** (esquina superior derecha)
3. **Settings**
4. **Scroll hasta abajo** → **Developer settings**
5. **Personal access tokens** → **Tokens (classic)**
6. **Generate new token** → **Generate new token (classic)**
7. **Note:** Escribe "VetManager Git Access"
8. **Expiration:** Selecciona "No expiration"
9. **Select scopes:** Marca **"repo"** (primera opción)
10. **Scroll abajo** → **Generate token**
11. **COPIA el token que aparece** (empieza con `ghp_...`)
   - ⚠️ Solo se muestra UNA vez
   - Guárdalo en un lugar seguro

**Ahora, en la Terminal:**

- **Username:** Tu usuario de GitHub
- **Password:** Pega el token (NO tu contraseña de GitHub)

Presiona Enter.

### H. Espera...

Verás algo como:

```
Enumerating objects: 125, done.
Counting objects: 100% (125/125), done.
...
To https://github.com/TU-USUARIO/vetmanager.git
 * [new branch]      main -> main
```

✅ **¡Tu código está en GitHub!**

### I. Verifica en tu navegador

1. Ve a: `https://github.com/TU-USUARIO/vetmanager`
2. Verás todos tus archivos
3. Deberías ver la carpeta `.github/workflows/`

---

## Paso 7️⃣: Habilitar GitHub Actions

### A. Ve a la pestaña "Settings"

1. En tu repositorio de GitHub
2. Click en **"Settings"** (última pestaña arriba)

### B. Habilitar Actions

1. En el menú lateral izquierdo, busca **"Actions"**
2. Click en **"General"** (debajo de Actions)
3. En la sección **"Actions permissions"**, selecciona:
   ```
   🔘 Allow all actions and reusable workflows
   ```
4. **Scroll abajo** → **Click en "Save"**

✅ **GitHub Actions habilitado.**

---

## Paso 8️⃣: Probar el Sistema

### A. Ve a la pestaña "Actions"

1. En tu repositorio
2. Click en **"Actions"** (pestaña superior)

### B. Deberías ver el workflow

- Nombre: **"Daily Notification Sender"**
- Si no aparece, espera 1 minuto y refresca la página

### C. Ejecutar manualmente (primera prueba)

1. **Click en "Daily Notification Sender"**
2. **Click en el botón "Run workflow"** (lado derecho)
3. **Selecciona la rama: "main"**
4. **Click en "Run workflow"** (botón verde)

### D. Ver los resultados

1. Espera 30 segundos
2. Refresca la página (F5)
3. Verás una ejecución nueva
4. **Click en la ejecución**
5. **Click en el job "send-notifications"**
6. **Click en el paso "📧 Call notification processing endpoint"**

Verás los logs:

```
🔄 Starting automated notification processing...
📊 Response Code: 200
✅ Notifications processed successfully!

📊 Statistics:
  ✉️  Sent: 0
  ⏭️  Skipped: 0
  ❌ Errors: 0
```

**Si ves esto:** ✅ ¡Todo funciona perfectamente!

**Si ves un error:** Revisa los logs y avísame.

---

## 🎉 ¡TERMINASTE!

### Ahora tu sistema:

✅ Está en GitHub  
✅ GitHub Actions está habilitado  
✅ Se ejecutará automáticamente cada día a las 9 AM  
✅ Enviará emails a tus clientes  

### No necesitas hacer nada más

El sistema trabajará solo. Cada mañana a las 9 AM:

1. GitHub Actions se ejecuta automáticamente
2. Llama a tu servidor
3. Busca notificaciones pendientes
4. Envía los emails
5. Registra los resultados en los logs

---

## 🔧 Comandos Útiles para el Futuro

### Cuando hagas cambios a tu código:

```bash
# 1. Agregar cambios
git add .

# 2. Guardar cambios (commit)
git commit -m "Descripción de los cambios"

# 3. Subir a GitHub
git push
```

### Ver el estado de tu proyecto:

```bash
git status
```

### Ver el historial:

```bash
git log
```

---

## ❓ Preguntas Frecuentes

### ¿Cuánto cuesta GitHub?

- ✅ **$0 (GRATIS)** para repositorios públicos
- ✅ GitHub Actions también es gratis para repos públicos

### ¿Puedo hacer privado mi repositorio?

- Sí, pero GitHub Actions tiene límite de 2000 minutos/mes
- Para este proyecto alcanza, pero público es mejor

### ¿Qué pasa si cierro mi computadora?

- GitHub Actions se ejecuta en los servidores de GitHub
- NO depende de tu computadora
- Funciona 24/7 aunque tu computadora esté apagada

### ¿Cómo veo los logs de ejecuciones pasadas?

1. Actions → Daily Notification Sender
2. Verás todas las ejecuciones
3. Click en cualquiera para ver los logs

### ¿Puedo cambiar la hora de ejecución?

Sí, edita el archivo `.github/workflows/daily-notifications.yml`:

```yaml
- cron: '0 15 * * *'  # 9 AM México (15:00 UTC)
```

Para las 10 AM México (16:00 UTC):
```yaml
- cron: '0 16 * * *'
```

---

## 🆘 Si Algo Sale Mal

### Error: "Permission denied"

**Solución:** Verifica tu Personal Access Token

### Error: "Repository not found"

**Solución:** Verifica la URL del repositorio

### No veo el workflow en Actions

**Soluciones:**
1. Verifica que el archivo esté en `.github/workflows/`
2. Verifica que hiciste `git push`
3. Espera 1 minuto y refresca

### El workflow falla (ícono rojo)

**Solución:**
1. Click en la ejecución
2. Lee el error
3. Avísame el mensaje de error

---

## 📞 Contacto

Si te atoras en cualquier paso, avísame en qué parte específica y te ayudo.

---

**Última actualización:** 4 de noviembre, 2025  
**Autor:** Asistente VetManager  
**Versión:** 1.0
