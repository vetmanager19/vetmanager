// Sistema de notificaciones
import { formatDateSafely } from "./dateHelpers";

export interface Notification {
  id: string;
  type: "vaccine_reminder" | "deworming_reminder" | "birthday" | "general";
  clientId: string; // ID del paciente
  petName: string;
  ownerName: string;
  ownerEmail: string;
  ownerPhone: string;
  title: string;
  message: string;
  scheduledDate: string; // Fecha en que debe enviarse
  sentDate?: string; // Fecha en que se envió
  isRead: boolean; // Si el veterinario la vio en la app
  isSent: boolean; // Si ya se envió el email
  metadata?: {
    vaccineId?: string;
    vaccineName?: string;
    boosterDate?: string;
  };
}

// Función para crear una notificación de vacuna
export function createVaccineNotification(
  clientId: string,
  petName: string,
  ownerName: string,
  ownerEmail: string,
  ownerPhone: string,
  vaccineName: string,
  vaccineId: string,
  boosterDate: string,
  notificationDate: string
): Notification | null {
  // Validar que las fechas sean válidas
  if (!boosterDate || boosterDate.trim() === "") {
    console.warn("⚠️ No se puede crear notificación: boosterDate vacío");
    return null;
  }
  
  if (!notificationDate || notificationDate.trim() === "") {
    console.warn("⚠️ No se puede crear notificación: notificationDate vacío");
    return null;
  }
  
  // Validar formato de fecha
  const boosterDateObj = new Date(boosterDate);
  if (isNaN(boosterDateObj.getTime())) {
    console.warn("⚠️ No se puede crear notificación: boosterDate inválido", boosterDate);
    return null;
  }
  
  return {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: "vaccine_reminder",
    clientId,
    petName,
    ownerName,
    ownerEmail,
    ownerPhone,
    title: `Refuerzo de ${vaccineName}`,
    message: `${petName} necesita su refuerzo anual de ${vaccineName} el ${formatDateSafely(boosterDate)}`,
    scheduledDate: notificationDate,
    isRead: false,
    isSent: false,
    metadata: {
      vaccineId,
      vaccineName,
      boosterDate,
    },
  };
}

// Función para verificar si una notificación debe enviarse hoy
export function shouldSendToday(notification: Notification): boolean {
  if (notification.isSent) return false;
  
  const today = new Date().toISOString().split('T')[0];
  const scheduledDate = notification.scheduledDate.split('T')[0];
  
  return scheduledDate <= today;
}

// Función para marcar notificación como enviada
export function markAsSent(notification: Notification): Notification {
  return {
    ...notification,
    isSent: true,
    sentDate: new Date().toISOString(),
  };
}

// Función para marcar notificación como leída
export function markAsRead(notification: Notification): Notification {
  return {
    ...notification,
    isRead: true,
  };
}
