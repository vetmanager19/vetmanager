import { projectId, publicAnonKey } from "./supabase/info";
import { Client } from "../components/ClientForm";

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-8fc06582`;

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

function getHeaders() {
  return {
    Authorization: `Bearer ${authToken || publicAnonKey}`,
    "Content-Type": "application/json",
  };
}

export async function getAllClients(): Promise<Client[]> {
  try {
    // Timeout más corto (15s) para mejor experiencia en móvil
    const response = await fetch(`${API_URL}/clients`, { 
      headers: getHeaders(),
      signal: AbortSignal.timeout(15000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.clients || [];
  } catch (error: any) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      console.error("❌ Request timeout - verifica tu conexión");
    } else {
      console.error("❌ Error fetching clients:", error);
    }
    return [];
  }
}

export async function getClient(id: string): Promise<Client | null> {
  try {
    const response = await fetch(`${API_URL}/clients/${id}`, { headers: getHeaders() });
    const data = await response.json();
    return data.success ? data.client : null;
  } catch (error) {
    console.error("❌ Error fetching client:", error);
    return null;
  }
}

export async function createClient(client: Client): Promise<Client | null> {
  try {
    const response = await fetch(`${API_URL}/clients`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ client }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to create client");
    }
    
    return data.client;
  } catch (error) {
    console.error("❌ Error creating client:", error);
    throw error;
  }
}

export async function updateClient(client: Client): Promise<Client | null> {
  try {
    const response = await fetch(`${API_URL}/clients/${client.id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ client }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to update client");
    }
    
    return data.client;
  } catch (error) {
    console.error("❌ Error updating client:", error);
    throw error;
  }
}

export async function deleteClient(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/clients/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("❌ Error deleting client:", error);
    return false;
  }
}

// Convert image file to base64 data URL with automatic compression for mobile
export async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (e) => {
      const img = new Image();
      
      img.onload = () => {
        // Redimensionar imágenes grandes para optimizar memoria en móvil
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        
        let width = img.width;
        let height = img.height;
        
        // Solo redimensionar si es necesario
        if (width > MAX_WIDTH || height > MAX_HEIGHT) {
          if (width > height) {
            if (width > MAX_WIDTH) {
              height = (height * MAX_WIDTH) / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width = (width * MAX_HEIGHT) / height;
              height = MAX_HEIGHT;
            }
          }
        }
        
        // Crear canvas para redimensionar
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('No se pudo obtener contexto del canvas'));
          return;
        }
        
        // Dibujar imagen redimensionada
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convertir a base64 con compresión (calidad 0.85 para balance)
        const compressedBase64 = canvas.toDataURL(file.type || 'image/jpeg', 0.85);
        resolve(compressedBase64);
      };
      
      img.onerror = () => {
        reject(new Error('Error al cargar la imagen'));
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.onerror = () => {
      reject(new Error('Error al leer el archivo'));
    };
    
    reader.readAsDataURL(file);
  });
}

// Auth functions
export async function login(email: string, password: string): Promise<{ accessToken: string; user: any }> {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Mensaje más claro para credenciales inválidas
      if (response.status === 401 || data.message?.includes("Invalid login credentials")) {
        throw new Error("Email o contraseña incorrectos. Si no tienes cuenta, regístrate primero en la pestaña 'Registrarse'.");
      }
      throw new Error(data.message || "Error al iniciar sesión. Verifica tus credenciales.");
    }

    return data;
  } catch (error: any) {
    console.error("❌ Login error:", error);
    throw error;
  }
}

export async function register(email: string, password: string, clinicName: string): Promise<{ accessToken: string; user: any }> {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ email, password, clinicName }),
    });

    const data = await response.json();

    if (!response.ok) {
      // Handle specific error messages
      let errorMessage = "Error al registrarse";
      if (data.message) {
        if (data.message.includes("already been registered") || data.message.includes("email_exists")) {
          errorMessage = "Este email ya está registrado. Por favor inicia sesión.";
        } else {
          errorMessage = data.message;
        }
      }
      throw new Error(errorMessage);
    }

    return data;
  } catch (error: any) {
    console.error("❌ Register error:", error);
    throw new Error(error.message || "Error al registrarse");
  }
}

export async function getUserSettings(): Promise<{ clinicName: string; email: string }> {
  try {
    const response = await fetch(`${API_URL}/auth/settings`, {
      headers: getHeaders(),
    });

    if (!response.ok) {
      throw new Error("Error al obtener configuración");
    }

    return await response.json();
  } catch (error) {
    console.error("❌ Get settings error:", error);
    throw error;
  }
}

export async function updateUserSettings(settings: { clinicName: string }): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/auth/settings`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify(settings),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar configuración");
    }
  } catch (error) {
    console.error("❌ Update settings error:", error);
    throw error;
  }
}

// Notification functions
export async function getAllNotifications(): Promise<any[]> {
  try {
    // Timeout más corto (10s) para notificaciones
    const response = await fetch(`${API_URL}/notifications`, { 
      headers: getHeaders(),
      signal: AbortSignal.timeout(10000)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.notifications || [];
  } catch (error: any) {
    if (error.name === 'TimeoutError' || error.name === 'AbortError') {
      console.error("❌ Notifications request timeout");
    } else {
      console.error("❌ Error fetching notifications:", error);
    }
    return [];
  }
}

export async function createNotification(notification: any): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/notifications`, {
      method: "POST",
      headers: getHeaders(),
      body: JSON.stringify({ notification }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to create notification");
    }
    
    return data.notification;
  } catch (error) {
    console.error("❌ Error creating notification:", error);
    throw error;
  }
}

export async function updateNotification(notification: any): Promise<any> {
  try {
    const response = await fetch(`${API_URL}/notifications/${notification.id}`, {
      method: "PUT",
      headers: getHeaders(),
      body: JSON.stringify({ notification }),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to update notification");
    }
    
    return data.notification;
  } catch (error) {
    console.error("❌ Error updating notification:", error);
    throw error;
  }
}

export async function deleteNotification(id: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/notifications/${id}`, {
      method: "DELETE",
      headers: getHeaders(),
    });
    
    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error("❌ Error deleting notification:", error);
    return false;
  }
}

export async function sendPendingNotifications(): Promise<{ sentCount: number; totalPending: number }> {
  try {
    const response = await fetch(`${API_URL}/notifications/send-pending`, {
      method: "POST",
      headers: getHeaders(),
    });
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || "Failed to send notifications");
    }
    
    return { sentCount: data.sentCount, totalPending: data.totalPending };
  } catch (error) {
    console.error("❌ Error sending pending notifications:", error);
    throw error;
  }
}
