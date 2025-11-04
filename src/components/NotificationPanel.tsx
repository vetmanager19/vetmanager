import { useState, useEffect, useCallback, useRef } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Bell, X, Check, Mail } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { appColors } from "../utils/themes";
import * as api from "../utils/api";
import { Notification } from "../utils/notifications";
import { formatDateSafely } from "../utils/dateHelpers";

interface NotificationPanelProps {
  onNotificationsChange?: (count: number) => void;
}

export function NotificationPanel({ onNotificationsChange }: NotificationPanelProps) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const isMountedRef = useRef(true);

  const loadNotifications = useCallback(async () => {
    // No cargar si el componente está desmontado
    if (!isMountedRef.current) return;
    
    try {
      setLoading(true);
      const data = await api.getAllNotifications();
      
      // Verificar nuevamente antes de actualizar estado
      if (!isMountedRef.current) return;
      
      setNotifications(data);
      
      // Contar notificaciones no leídas
      const unreadCount = data.filter((n: Notification) => !n.isRead).length;
      if (onNotificationsChange && isMountedRef.current) {
        onNotificationsChange(unreadCount);
      }
    } catch (error) {
      console.error("Error loading notifications:", error);
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [onNotificationsChange]);

  useEffect(() => {
    isMountedRef.current = true;
    loadNotifications();
    
    // Polling menos agresivo: cada 10 minutos (más amigable para móvil)
    const interval = setInterval(() => {
      if (isMountedRef.current) {
        loadNotifications();
      }
    }, 10 * 60 * 1000);
    
    return () => {
      isMountedRef.current = false;
      clearInterval(interval);
    };
  }, [loadNotifications]);

  const handleMarkAsRead = useCallback(async (notification: Notification) => {
    if (!isMountedRef.current) return;
    
    try {
      const updated = { ...notification, isRead: true };
      await api.updateNotification(updated);
      if (isMountedRef.current) {
        await loadNotifications();
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  }, [loadNotifications]);

  const handleMarkAllAsRead = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    try {
      const unread = notifications.filter(n => !n.isRead);
      for (const notification of unread) {
        const updated = { ...notification, isRead: true };
        await api.updateNotification(updated);
      }
      if (isMountedRef.current) {
        await loadNotifications();
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  }, [notifications, loadNotifications]);



  const handleDeleteNotification = useCallback(async (id: string) => {
    if (!isMountedRef.current) return;
    if (!confirm("¿Eliminar esta notificación?")) return;
    
    try {
      await api.deleteNotification(id);
      if (isMountedRef.current) {
        await loadNotifications();
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  }, [loadNotifications]);

  const unreadCount = notifications.filter(n => !n.isRead).length;
  const upcomingNotifications = notifications
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  return (
    <>
      <Button
        variant="outline"
        onClick={() => setOpen(true)}
        className="border-2 relative flex-1 sm:flex-none"
        style={{
          backgroundColor: appColors.yellow,
          borderColor: appColors.border,
          color: appColors.textOnColor,
        }}
      >
        <Bell className="w-4 h-4 sm:mr-2" />
        <span className="hidden sm:inline">Notificaciones</span>
        {unreadCount > 0 && (
          <Badge
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
            style={{
              backgroundColor: appColors.red,
              color: appColors.tertiary,
            }}
          >
            {unreadCount}
          </Badge>
        )}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent 
          className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col border-2"
          style={{
            backgroundColor: appColors.cardBackground,
            borderColor: appColors.border,
          }}
        >
          <DialogHeader>
            <DialogTitle style={{ color: appColors.textPrimary }}>
              Notificaciones y Recordatorios
            </DialogTitle>
            <DialogDescription style={{ color: appColors.textSecondary }}>
              Gestiona los recordatorios de vacunas y consultas programadas
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 flex-1 overflow-y-auto">
            {/* Información sobre envío automático */}
            <div 
              className="p-4 rounded-lg border-2 flex items-start gap-3"
              style={{
                backgroundColor: appColors.blue + "20",
                borderColor: appColors.blue,
              }}
            >
              <Mail className="w-5 h-5 mt-0.5" style={{ color: appColors.blue }} />
              <div>
                <p className="text-sm" style={{ color: appColors.textPrimary }}>
                  <strong>Sistema de envío automático activo</strong>
                </p>
                <p className="text-xs mt-1" style={{ color: appColors.textSecondary }}>
                  Los emails se envían automáticamente cada día a las 9:00 AM. 
                  No necesitas hacer nada manualmente.
                </p>
              </div>
            </div>

            {/* Acciones */}
            {unreadCount > 0 && (
              <div className="flex gap-2 flex-wrap">
                <Button
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  className="border-2"
                  style={{
                    backgroundColor: appColors.green,
                    borderColor: appColors.border,
                    color: appColors.textOnColor,
                  }}
                >
                  <Check className="w-4 h-4 mr-2" />
                  Marcar todas como leídas
                </Button>
              </div>
            )}

            {/* Lista de notificaciones */}
            {loading ? (
              <div className="text-center py-8" style={{ color: appColors.textSecondary }}>
                Cargando...
              </div>
            ) : upcomingNotifications.length === 0 ? (
              <div className="text-center py-8" style={{ color: appColors.textSecondary }}>
                <Bell className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>No hay notificaciones programadas</p>
              </div>
            ) : (
              <div className="space-y-3">
                {upcomingNotifications.map((notification) => {
                  const scheduledDate = new Date(notification.scheduledDate);
                  const isValidScheduledDate = !isNaN(scheduledDate.getTime());
                  const isPast = isValidScheduledDate && scheduledDate < new Date();
                  
                  return (
                    <div
                      key={notification.id}
                      className="p-4 rounded-lg border-2 relative"
                      style={{
                        backgroundColor: notification.isRead 
                          ? appColors.base 
                          : appColors.yellow + "20",
                        borderColor: isPast 
                          ? appColors.red 
                          : appColors.border,
                        opacity: notification.isSent ? 0.6 : 1,
                      }}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 style={{ color: appColors.textPrimary }}>
                              {notification.title}
                            </h4>
                            {!notification.isRead && (
                              <Badge
                                className="text-xs"
                                style={{
                                  backgroundColor: appColors.blue,
                                  color: appColors.tertiary,
                                }}
                              >
                                Nuevo
                              </Badge>
                            )}
                            {notification.isSent && (
                              <Badge
                                className="text-xs"
                                style={{
                                  backgroundColor: appColors.green,
                                  color: appColors.tertiary,
                                }}
                              >
                                <Mail className="w-3 h-3 mr-1" />
                                Enviado
                              </Badge>
                            )}
                          </div>
                          
                          <p className="text-sm mb-2" style={{ color: appColors.textSecondary }}>
                            {notification.message}
                          </p>
                          
                          <div className="flex flex-wrap gap-2 text-xs" style={{ color: appColors.textSecondary }}>
                            <span>📧 {notification.ownerEmail}</span>
                            {notification.ownerPhone && <span>📱 {notification.ownerPhone}</span>}
                            <span>
                              📅 {notification.isSent ? 'Enviado' : 'Enviar'}: {formatDateSafely(notification.isSent ? notification.sentDate : notification.scheduledDate)}
                            </span>
                          </div>
                          
                          {isPast && !notification.isSent && (
                            <p className="text-xs mt-2" style={{ color: appColors.red }}>
                              ⚠️ Esta notificación se enviará automáticamente en el siguiente ciclo (9 AM)
                            </p>
                          )}
                        </div>
                        
                        <div className="flex gap-1">
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarkAsRead(notification)}
                              className="h-8 w-8 p-0"
                            >
                              <Check className="w-4 h-4" style={{ color: appColors.green }} />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="h-8 w-8 p-0"
                          >
                            <X className="w-4 h-4" style={{ color: appColors.red }} />
                          </Button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="pt-4 border-t" style={{ borderColor: appColors.border }}>
            <Button
              onClick={() => setOpen(false)}
              className="w-full border-2"
              style={{
                backgroundColor: appColors.secondary,
                borderColor: appColors.border,
                color: appColors.textOnColor,
              }}
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
