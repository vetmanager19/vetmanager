import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";
import * as kv from "./kv_store.tsx";

const app = new Hono();

// Middleware
app.use("*", cors());
app.use("*", logger(console.log));

// Supabase client
const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// Auth middleware
async function authMiddleware(c: any, next: any) {
  const authHeader = c.req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = authHeader.split(" ")[1];
  const { data: { user }, error } = await supabase.auth.getUser(token);

  if (error || !user) {
    return c.json({ error: "Invalid token" }, 401);
  }

  c.set("user", user);
  await next();
}

// Routes
app.get("/make-server-8fc06582/", (c) => {
  return c.json({ message: "VetManager API Server" });
});

// AUTH ROUTES
app.post("/make-server-8fc06582/auth/register", async (c) => {
  try {
    const { email, password, clinicName } = await c.req.json();

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { clinicName },
      email_confirm: true, // Auto-confirm since email server not configured
    });

    if (error) {
      console.error("❌ Registration error:", error);
      return c.json({ message: error.message }, 400);
    }

    // Create a client with anon key to sign in (not service role key)
    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    // Sign in the user to get a session
    const { data: signInData, error: signInError } = await anonClient.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error("❌ Sign in after registration error:", signInError);
      return c.json({ message: "User created but could not sign in automatically. Please log in." }, 500);
    }

    return c.json({
      accessToken: signInData.session.access_token,
      user: {
        id: signInData.user.id,
        email: signInData.user.email,
        clinicName: clinicName,
      },
    });
  } catch (error) {
    console.error("❌ Registration error:", error);
    return c.json({ message: "Error during registration" }, 500);
  }
});

app.post("/make-server-8fc06582/auth/login", async (c) => {
  try {
    const { email, password } = await c.req.json();

    // Create a client with anon key to sign in (not service role key)
    const anonClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!
    );

    const { data, error } = await anonClient.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("❌ Login error:", error);
      return c.json({ message: error.message }, 401);
    }

    // Get user metadata
    const clinicName = data.user.user_metadata?.clinicName || "Mi Veterinaria";

    return c.json({
      accessToken: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
        clinicName: clinicName,
      },
    });
  } catch (error) {
    console.error("❌ Login error:", error);
    return c.json({ message: "Error during login" }, 500);
  }
});

app.get("/make-server-8fc06582/auth/settings", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const clinicName = user.user_metadata?.clinicName || "Mi Veterinaria";

    return c.json({
      email: user.email,
      clinicName: clinicName,
    });
  } catch (error) {
    console.error("❌ Get settings error:", error);
    return c.json({ error: "Error getting settings" }, 500);
  }
});

app.put("/make-server-8fc06582/auth/settings", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const { clinicName } = await c.req.json();

    // Update user metadata
    const { error } = await supabase.auth.admin.updateUserById(user.id, {
      user_metadata: { clinicName },
    });

    if (error) {
      console.error("Update settings error:", error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error("Update settings error:", error);
    return c.json({ error: "Error updating settings" }, 500);
  }
});

// CLIENT ROUTES (Protected)
app.get("/make-server-8fc06582/clients", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const prefix = `user_${user.id}_client_`;
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Database query timeout")), 25000)
    );
    
    const clients = await Promise.race([
      kv.getByPrefix(prefix),
      timeoutPromise
    ]) as any[];
    
    return c.json({
      success: true,
      clients: clients || [],
    });
  } catch (error) {
    console.error("❌ Error fetching clients:", error);
    return c.json({
      success: true,
      clients: [],
    });
  }
});

app.get("/make-server-8fc06582/clients/:id", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const id = c.req.param("id");
    const key = `user_${user.id}_client_${id}`;
    const client = await kv.get(key);
    
    if (!client) {
      return c.json({
        success: false,
        error: "Client not found",
      }, 404);
    }
    
    return c.json({ success: true, client });
  } catch (error) {
    console.error("❌ Error fetching client:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.post("/make-server-8fc06582/clients", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const { client } = await c.req.json();
    const key = `user_${user.id}_client_${client.id}`;
    
    await kv.set(key, client);
    
    return c.json({ success: true, client });
  } catch (error) {
    console.error("❌ Error creating client:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/make-server-8fc06582/clients/:id", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const id = c.req.param("id");
    const { client } = await c.req.json();
    const key = `user_${user.id}_client_${id}`;
    
    await kv.set(key, client);
    
    return c.json({ success: true, client });
  } catch (error) {
    console.error("❌ Error updating client:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-8fc06582/clients/:id", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const id = c.req.param("id");
    const key = `user_${user.id}_client_${id}`;
    
    await kv.del(key);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("❌ Error deleting client:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// NOTIFICATION ROUTES
app.get("/make-server-8fc06582/notifications", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const prefix = `user_${user.id}_notification_`;
    
    const notifications = await kv.getByPrefix(prefix) as any[];
    
    // Filtrar notificaciones no enviadas y ordenar por fecha
    const sortedNotifications = (notifications || [])
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());
    
    return c.json({
      success: true,
      notifications: sortedNotifications,
    });
  } catch (error) {
    console.error("❌ Error fetching notifications:", error);
    return c.json({
      success: true,
      notifications: [],
    });
  }
});

app.post("/make-server-8fc06582/notifications", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const { notification } = await c.req.json();
    const key = `user_${user.id}_notification_${notification.id}`;
    
    await kv.set(key, notification);
    
    return c.json({ success: true, notification });
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.put("/make-server-8fc06582/notifications/:id", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const id = c.req.param("id");
    const { notification } = await c.req.json();
    const key = `user_${user.id}_notification_${id}`;
    
    await kv.set(key, notification);
    
    return c.json({ success: true, notification });
  } catch (error) {
    console.error("❌ Error updating notification:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

app.delete("/make-server-8fc06582/notifications/:id", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const id = c.req.param("id");
    const key = `user_${user.id}_notification_${id}`;
    
    await kv.del(key);
    
    return c.json({ success: true });
  } catch (error) {
    console.error("❌ Error deleting notification:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// Send pending notifications (manual - para uso interno)
app.post("/make-server-8fc06582/notifications/send-pending", authMiddleware, async (c) => {
  try {
    const user = c.get("user");
    const prefix = `user_${user.id}_notification_`;
    
    const notifications = await kv.getByPrefix(prefix) as any[];
    const today = new Date().toISOString().split('T')[0];
    
    // Filtrar notificaciones que deben enviarse hoy y no se han enviado
    const pendingNotifications = (notifications || []).filter(n => {
      const scheduledDate = n.scheduledDate.split('T')[0];
      return !n.isSent && scheduledDate <= today;
    });
    
    let sentCount = 0;
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      return c.json({ 
        success: false, 
        error: "Resend API key not configured" 
      }, 500);
    }
    
    // Enviar cada notificación pendiente
    for (const notification of pendingNotifications) {
      try {
        // Validar que tenga email
        if (!notification.ownerEmail || notification.ownerEmail.trim() === '') {
          console.warn(`⚠️ Notificación ${notification.id} sin email, saltando...`);
          continue;
        }

        // Enviar email usando Resend con template mejorado
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'VetManager <onboarding@resend.dev>',
            to: notification.ownerEmail,
            subject: notification.title,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
                  <tr>
                    <td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                        <!-- Header -->
                        <tr>
                          <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 20px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px;">🐾 ${notification.title}</h1>
                          </td>
                        </tr>
                        
                        <!-- Body -->
                        <tr>
                          <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #1E1E1E; line-height: 1.6;">
                              Hola <strong>${notification.ownerName}</strong>,
                            </p>
                            
                            <div style="background-color: #f8fafc; border-left: 4px solid #22c55e; padding: 20px; margin: 20px 0; border-radius: 4px;">
                              <p style="margin: 0; font-size: 16px; color: #1E1E1E; line-height: 1.6;">
                                ${notification.message}
                              </p>
                            </div>
                            
                            <p style="margin: 20px 0 0 0; font-size: 16px; color: #1E1E1E; line-height: 1.6;">
                              Por favor contacta a tu veterinaria para <strong>agendar la cita</strong> lo antes posible.
                            </p>
                            
                            <!-- Info adicional -->
                            <div style="margin-top: 30px; padding: 20px; background-color: #fffbeb; border-radius: 4px; border: 1px solid #fbbf24;">
                              <p style="margin: 0 0 10px 0; font-size: 14px; color: #92400e;">
                                <strong>📋 Información del recordatorio:</strong>
                              </p>
                              <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
                                <strong>Paciente:</strong> ${notification.petName}<br>
                                <strong>Tipo:</strong> ${notification.type === 'vaccine_reminder' ? 'Vacuna' : 'Recordatorio'}<br>
                                ${notification.metadata?.vaccineName ? `<strong>Vacuna:</strong> ${notification.metadata.vaccineName}<br>` : ''}
                                ${notification.metadata?.boosterDate ? `<strong>Fecha recomendada:</strong> ${notification.metadata.boosterDate}` : ''}
                              </p>
                            </div>
                          </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                          <td style="background-color: #1E1E1E; padding: 30px; text-align: center;">
                            <p style="margin: 0 0 10px 0; color: #9C9C9C; font-size: 14px;">
                              Este es un recordatorio automático generado por VetManager
                            </p>
                            <p style="margin: 0; color: #9C9C9C; font-size: 12px;">
                              No respondas a este correo. Para cualquier duda, contacta directamente a tu veterinaria.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
              </html>
            `,
          }),
        });
        
        const emailData = await emailResponse.json();
        
        if (emailResponse.ok) {
          console.log(`✅ Email enviado exitosamente para ${notification.petName} (${notification.ownerEmail})`);
          
          // Marcar como enviada
          const updatedNotification = {
            ...notification,
            isSent: true,
            sentDate: new Date().toISOString(),
          };
          
          const key = `user_${user.id}_notification_${notification.id}`;
          await kv.set(key, updatedNotification);
          sentCount++;
        } else {
          console.error(`❌ Error enviando email para ${notification.id}:`, emailData);
        }
      } catch (emailError) {
        console.error(`❌ Error sending email for notification ${notification.id}:`, emailError);
      }
    }
    
    return c.json({ 
      success: true, 
      sentCount,
      totalPending: pendingNotifications.length 
    });
  } catch (error) {
    console.error("❌ Error sending pending notifications:", error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

// ⚡ CRON ROUTE - Process ALL notifications (NO AUTH required, called by GitHub Actions)
app.post("/make-server-8fc06582/process-notifications", async (c) => {
  try {
    console.log("🔄 [CRON] Starting automated notification processing...");
    
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    
    if (!resendApiKey) {
      console.error("❌ [CRON] Resend API key not configured");
      return c.json({ 
        success: false, 
        error: "Resend API key not configured" 
      }, 500);
    }
    
    console.log("📊 [CRON] Fetching all notifications from all users...");
    
    // Obtener TODAS las claves que empiezan con 'user_'
    // Esto incluye tanto clientes como notificaciones
    const allData = await kv.getByPrefix('user_') as any[];
    
    // Filtrar solo las notificaciones (no clientes)
    const notifications = allData.filter(item => 
      item && 
      typeof item === 'object' && 
      'type' in item && 
      'scheduledDate' in item &&
      'isSent' in item &&
      'ownerEmail' in item
    );
    
    console.log(`📊 [CRON] Total notifications found: ${notifications.length}`);
    
    const today = new Date().toISOString().split('T')[0];
    
    // Filtrar notificaciones que deben enviarse hoy y no se han enviado
    const pendingNotifications = notifications.filter(n => {
      const scheduledDate = n.scheduledDate.split('T')[0];
      return !n.isSent && scheduledDate <= today;
    });
    
    console.log(`📧 [CRON] Pending notifications to send today: ${pendingNotifications.length}`);
    
    let sentCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const sentIds: string[] = [];
    
    // Enviar cada notificación pendiente
    for (const notification of pendingNotifications) {
      try {
        // Validar que tenga email
        if (!notification.ownerEmail || notification.ownerEmail.trim() === '') {
          console.warn(`⚠️ [CRON] Notification ${notification.id} has no email, skipping...`);
          skippedCount++;
          continue;
        }

        console.log(`📤 [CRON] Sending email to ${notification.ownerEmail} for ${notification.petName}...`);

        // Enviar email usando Resend con template mejorado
        const emailResponse = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from: 'VetManager <onboarding@resend.dev>',
            to: notification.ownerEmail,
            subject: notification.title,
            html: `
              <!DOCTYPE html>
              <html>
              <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
              </head>
              <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
                <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f5f5f5; padding: 20px;">
                  <tr>
                    <td align="center">
                      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); overflow: hidden;">
                        <!-- Header -->
                        <tr>
                          <td style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 40px 20px; text-align: center;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px;">🐾 ${notification.title}</h1>
                          </td>
                        </tr>
                        
                        <!-- Body -->
                        <tr>
                          <td style="padding: 40px 30px;">
                            <p style="margin: 0 0 20px 0; font-size: 16px; color: #1E1E1E; line-height: 1.6;">
                              Hola <strong>${notification.ownerName}</strong>,
                            </p>
                            
                            <div style="background-color: #f8fafc; border-left: 4px solid #22c55e; padding: 20px; margin: 20px 0; border-radius: 4px;">
                              <p style="margin: 0; font-size: 16px; color: #1E1E1E; line-height: 1.6;">
                                ${notification.message}
                              </p>
                            </div>
                            
                            <p style="margin: 20px 0 0 0; font-size: 16px; color: #1E1E1E; line-height: 1.6;">
                              Por favor contacta a tu veterinaria para <strong>agendar la cita</strong> lo antes posible.
                            </p>
                            
                            <!-- Info adicional -->
                            <div style="margin-top: 30px; padding: 20px; background-color: #fffbeb; border-radius: 4px; border: 1px solid #fbbf24;">
                              <p style="margin: 0 0 10px 0; font-size: 14px; color: #92400e;">
                                <strong>📋 Información del recordatorio:</strong>
                              </p>
                              <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
                                <strong>Paciente:</strong> ${notification.petName}<br>
                                <strong>Tipo:</strong> ${notification.type === 'vaccine_reminder' ? 'Vacuna' : 'Recordatorio'}<br>
                                ${notification.metadata?.vaccineName ? `<strong>Vacuna:</strong> ${notification.metadata.vaccineName}<br>` : ''}
                                ${notification.metadata?.boosterDate ? `<strong>Fecha recomendada:</strong> ${notification.metadata.boosterDate}` : ''}
                              </p>
                            </div>
                          </td>
                        </tr>
                        
                        <!-- Footer -->
                        <tr>
                          <td style="background-color: #1E1E1E; padding: 30px; text-align: center;">
                            <p style="margin: 0 0 10px 0; color: #9C9C9C; font-size: 14px;">
                              Este es un recordatorio automático generado por VetManager
                            </p>
                            <p style="margin: 0; color: #9C9C9C; font-size: 12px;">
                              No respondas a este correo. Para cualquier duda, contacta directamente a tu veterinaria.
                            </p>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </body>
              </html>
            `,
          }),
        });
        
        const emailData = await emailResponse.json();
        
        if (emailResponse.ok) {
          console.log(`✅ [CRON] Email sent successfully to ${notification.ownerEmail}`);
          sentIds.push(notification.id);
          sentCount++;
        } else {
          console.error(`❌ [CRON] Error sending email for ${notification.id}:`, emailData);
          errorCount++;
        }
      } catch (emailError) {
        console.error(`❌ [CRON] Exception sending email for notification ${notification.id}:`, emailError);
        errorCount++;
      }
    }
    
    console.log(`✅ [CRON] Processing complete: ${sentCount} sent, ${skippedCount} skipped, ${errorCount} errors`);
    console.log(`📋 [CRON] Sent notification IDs: ${sentIds.join(', ')}`);
    
    // Nota: Las notificaciones NO se marcan como enviadas en la BD porque no tenemos
    // una forma eficiente de encontrar las keys en el KV store sin iterar sobre todas.
    // Los emails SÍ se envían correctamente. Para marcar como enviadas, el usuario
    // puede usar la función manual "Enviar pendientes" que tiene auth y userId.
    
    return c.json({ 
      success: true, 
      sentCount,
      skippedCount,
      errorCount,
      totalPending: pendingNotifications.length,
      sentIds,
      message: `Emails sent successfully: ${sentCount}/${pendingNotifications.length}. Use manual "Send pending" to mark as sent in DB.`
    });
  } catch (error) {
    console.error("❌ [CRON] Error processing notifications:", error);
    return c.json({ 
      success: false, 
      error: error.message 
    }, 500);
  }
});

Deno.serve(app.fetch);
