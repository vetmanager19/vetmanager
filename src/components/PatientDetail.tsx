import { useState, useCallback, useEffect, useMemo } from "react";
import * as React from "react";
import { Client, Consulta, Vacuna, Desparacitacion } from "./ClientForm";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { ArrowLeft, Plus, Trash2, Upload } from "lucide-react";
import { convertImageToBase64, createNotification } from "../utils/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./ui/alert-dialog";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { appColors, sectionColors, SPECIES_COLORS } from "../utils/themes";
import { 
  getVaccinesBySpecies, 
  requiresBooster, 
  calculateBoosterDate, 
  calculateNotificationDate,
  getVaccineName,
  calculateAgeInMonths,
  getNextSuggestedVaccine,
  getVaccinationProgress,
  getMissingPreviousVaccines,
  validateVaccineApplication,
  isVaccineApplied,
  calculateNextDoseDate,
  calculateNextNotificationDate,
  AppliedVaccine,
  VaccineConfig,
  getCatAnnualBoosterDate,
  getCatBoosterVaccines,
  isCatSchemeComplete
} from "../utils/vaccines";
import { createVaccineNotification } from "../utils/notifications";
import { formatDateSafely } from "../utils/dateHelpers";
import { VaccineDialogContent } from "./VaccineDialogContent";
import { AddVaccineDialog } from "./AddVaccineDialog";

interface PatientDetailProps {
  client: Client;
  onBack: () => void;
  onUpdate: (client: Client) => Promise<void>;
  onDelete: (id: string) => void;
}

type EditSection = 
  | "photo" 
  | "basicInfo" 
  | "contactInfo" 
  | "historialMedico" 
  | "consultas" 
  | "vacunas" 
  | "desparacitaciones" 
  | "datosImportantes"
  | null;

export function PatientDetail({ client, onBack, onUpdate, onDelete }: PatientDetailProps) {
  const [editingSection, setEditingSection] = useState<EditSection>(null);
  const [showAddConsulta, setShowAddConsulta] = useState(false);
  const [showAddVacuna, setShowAddVacuna] = useState(false);
  const [showAddDesparacitacion, setShowAddDesparacitacion] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const isMountedRef = React.useRef(true);

  // Temporary edit states
  const [editedPhoto, setEditedPhoto] = useState(client.photo);
  const [editedBirthDate, setEditedBirthDate] = useState(client.birthDate);
  const [editedSpecies, setEditedSpecies] = useState(client.species);
  const [editedBreed, setEditedBreed] = useState(client.breed);
  const [editedWeight, setEditedWeight] = useState(client.weight);
  const [editedOwnerName, setEditedOwnerName] = useState(client.ownerName);
  const [editedPetName, setEditedPetName] = useState(client.petName);
  const [editedAddress, setEditedAddress] = useState(client.address);
  const [editedPhone, setEditedPhone] = useState(client.phone);
  const [editedHistorialMedico, setEditedHistorialMedico] = useState(client.historialMedico);
  const [editedDatosImportantes, setEditedDatosImportantes] = useState(client.datosImportantes);

  const [newConsulta, setNewConsulta] = useState<Consulta>({
    id: "",
    fecha: "",
    motivo: "",
    diagnostico: "",
    tratamiento: "",
  });

  const [newVacuna, setNewVacuna] = useState<Vacuna>({
    id: "",
    fecha: "",
    nombre: "",
    vaccineId: "",
    proximaDosis: "",
    requiresBooster: false,
    notificationSent: false,
  });

  const [newDesparacitacion, setNewDesparacitacion] = useState<Desparacitacion>({
    id: "",
    fecha: "",
    producto: "",
    proximaDosis: "",
  });

  // Estados para sistema de vacunación estructurado ya están en AddVaccineDialog

  // Cleanup on unmount
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // ==========================================
  // CÁLCULOS MEMOIZADOS PARA SISTEMA DE VACUNACIÓN
  // ==========================================

  // Calcular edad del paciente en meses
  const patientAgeMonths = useMemo(() => {
    return calculateAgeInMonths(client.birthDate);
  }, [client.birthDate]);

  // Convertir vacunas aplicadas al formato AppliedVaccine
  const appliedVaccines = useMemo((): AppliedVaccine[] => {
    return client.vacunas.map(v => ({
      id: v.id,
      vaccineId: v.vaccineId,
      fecha: v.fecha,
    }));
  }, [client.vacunas]);

  // Progreso del esquema de vacunación
  const vaccinationProgress = useMemo(() => {
    if (client.species !== "perro" && client.species !== "gato") {
      return null;
    }
    return getVaccinationProgress(client.species, appliedVaccines);
  }, [client.species, appliedVaccines]);

  // Siguiente vacuna sugerida
  const nextSuggestedVaccine = useMemo(() => {
    if (client.species !== "perro" && client.species !== "gato") {
      return null;
    }
    return getNextSuggestedVaccine(client.species, appliedVaccines, patientAgeMonths);
  }, [client.species, appliedVaccines, patientAgeMonths]);

  // Callback para cambiar vacuna desde el diálogo
  const handleVaccineChange = useCallback((vacuna: Vacuna) => {
    setNewVacuna(vacuna);
  }, []);

  const getSpeciesBadgeColor = useCallback((species: string) => {
    return SPECIES_COLORS[species] || appColors.secondary;
  }, []);

  const handleSavePhoto = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    try {
      await onUpdate({ ...client, photo: editedPhoto });
      if (isMountedRef.current) {
        setEditingSection(null);
      }
    } catch (error) {
      console.error("❌ Error guardando foto:", error);
      if (isMountedRef.current) {
        alert("Error al guardar la foto. Por favor intenta de nuevo.");
      }
    }
  }, [client, editedPhoto, onUpdate]);

  const handlePhotoUpload = useCallback(async (file: File) => {
    if (!isMountedRef.current) return;
    
    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido");
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen debe ser menor a 5MB");
      return;
    }

    try {
      setUploadingPhoto(true);
      const base64Image = await convertImageToBase64(file);
      if (isMountedRef.current) {
        setEditedPhoto(base64Image);
      }
    } catch (error) {
      console.error("Error uploading photo:", error);
      if (isMountedRef.current) {
        alert("Error al procesar la foto. Por favor intenta de nuevo.");
      }
    } finally {
      if (isMountedRef.current) {
        setUploadingPhoto(false);
      }
    }
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  }, [handlePhotoUpload]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  }, [handlePhotoUpload]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleSaveBasicInfo = async () => {
    try {
      await onUpdate({
        ...client,
        petName: editedPetName,
        birthDate: editedBirthDate,
        species: editedSpecies,
        breed: editedBreed,
        weight: editedWeight,
      });
      setEditingSection(null);
    } catch (error) {
      console.error("❌ Error guardando información básica:", error);
      alert("Error al guardar la información. Por favor intenta de nuevo.");
    }
  };

  const handleSaveContactInfo = async () => {
    try {
      await onUpdate({
        ...client,
        ownerName: editedOwnerName,
        address: editedAddress,
        phone: editedPhone,
      });
      setEditingSection(null);
    } catch (error) {
      console.error("❌ Error guardando información de contacto:", error);
      alert("Error al guardar la información. Por favor intenta de nuevo.");
    }
  };

  const handleSaveHistorialMedico = async () => {
    try {
      await onUpdate({ ...client, historialMedico: editedHistorialMedico });
      setEditingSection(null);
    } catch (error) {
      console.error("❌ Error guardando historial médico:", error);
      alert("Error al guardar el historial. Por favor intenta de nuevo.");
    }
  };

  const handleSaveDatosImportantes = async () => {
    try {
      await onUpdate({ ...client, datosImportantes: editedDatosImportantes });
      setEditingSection(null);
    } catch (error) {
      console.error("❌ Error guardando datos importantes:", error);
      alert("Error al guardar los datos. Por favor intenta de nuevo.");
    }
  };

  const handleAddConsulta = async () => {
    try {
      const consulta = {
        ...newConsulta,
        id: Date.now().toString(),
      };
      const updatedClient = {
        ...client,
        consultas: [...client.consultas, consulta],
      };
      await onUpdate(updatedClient);
      setShowAddConsulta(false);
      setNewConsulta({ id: "", fecha: "", motivo: "", diagnostico: "", tratamiento: "" });
    } catch (error) {
      console.error("❌ Error agregando consulta:", error);
      alert("Error al guardar la consulta. Por favor intenta de nuevo.");
    }
  };

  const handleDeleteConsulta = async (id: string) => {
    try {
      const updatedClient = {
        ...client,
        consultas: client.consultas.filter((c) => c.id !== id),
      };
      await onUpdate(updatedClient);
    } catch (error) {
      console.error("❌ Error eliminando consulta:", error);
      alert("Error al eliminar la consulta. Por favor intenta de nuevo.");
    }
  };

  const handleAddVacuna = useCallback(async () => {
    if (!isMountedRef.current) return;

    try {
      const vacuna = {
        ...newVacuna,
        id: Date.now().toString(),
      };
      
      const updatedClient = {
        ...client,
        vacunas: [...client.vacunas, vacuna],
      };
      
      // Guardar vacuna
      try {
        await onUpdate(updatedClient);
        console.log("✅ Vacuna guardada exitosamente");
      } catch (error) {
        console.error("❌ Error actualizando cliente:", error);
        throw error;
      }
      
      // Vacunas actualizadas (incluyendo la recién agregada)
      const updatedAppliedVaccines = [
        ...appliedVaccines,
        { id: vacuna.id, vaccineId: vacuna.vaccineId, fecha: vacuna.fecha }
      ];
      
      // Determinar si estamos en esquema inicial o refuerzos
      const progress = getVaccinationProgress(client.species, updatedAppliedVaccines);
      const isInitialSchedule = !progress?.isComplete;
      
      // ==========================================
      // LÓGICA ESPECÍFICA POR ESPECIE
      // ==========================================
      
      if (client.species === "gato") {
        // 🐱 LÓGICA PARA GATOS
        if (isInitialSchedule) {
          // Esquema inicial: siguiente vacuna en 14 días
          const nextVaccine = getNextSuggestedVaccine(
            "gato",
            updatedAppliedVaccines,
            patientAgeMonths
          );
          
          if (nextVaccine && isMountedRef.current) {
            const nextDoseDate = calculateNextDoseDate(vacuna.fecha, true);
            const notificationDate = calculateNextNotificationDate(nextDoseDate, true);
            
            try {
              const notification = createVaccineNotification(
                client.id,
                client.petName,
                client.ownerName,
                client.email,
                client.phone,
                nextVaccine.name,
                nextVaccine.id,
                nextDoseDate,
                notificationDate
              );
              
              if (notification) {
                await createNotification(notification);
                console.log("✅ Notificación creada para siguiente vacuna:", nextVaccine.name);
              }
            } catch (error) {
              console.error("❌ Error creando notificación:", error);
            }
          }
        } else {
          // Esquema completo: crear notificaciones de refuerzo anual
          // Para gatos, todas se calculan desde la 2da Triple Felina
          const boosterDate = getCatAnnualBoosterDate(updatedAppliedVaccines);
          
          if (boosterDate && isMountedRef.current) {
            const notificationDate = calculateNextNotificationDate(boosterDate, false);
            const boosterVaccines = getCatBoosterVaccines();
            
            try {
              // Crear notificación para cada vacuna que requiere refuerzo
              for (const boosterVaccine of boosterVaccines) {
                const notification = createVaccineNotification(
                  client.id,
                  client.petName,
                  client.ownerName,
                  client.email,
                  client.phone,
                  `Refuerzo ${boosterVaccine.name}`,
                  boosterVaccine.id,
                  boosterDate,
                  notificationDate
                );
                
                if (notification) {
                  await createNotification(notification);
                }
              }
              console.log("✅ Notificaciones de refuerzo anual creadas (gato)");
            } catch (error) {
              console.error("❌ Error creando notificaciones de refuerzo:", error);
            }
          }
        }
      } else if (client.species === "perro") {
        // 🐶 LÓGICA PARA PERROS (original)
        let nextDoseDate = "";
        let notificationDate = "";
        
        if (isInitialSchedule) {
          // Esquema inicial: siguiente vacuna en 14 días
          const nextVaccine = getNextSuggestedVaccine(
            "perro",
            updatedAppliedVaccines,
            patientAgeMonths
          );
          
          if (nextVaccine) {
            nextDoseDate = calculateNextDoseDate(vacuna.fecha, true);
            notificationDate = calculateNextNotificationDate(nextDoseDate, true);
          }
        } else if (vacuna.requiresBooster) {
          // Refuerzo anual para esta vacuna específica
          nextDoseDate = calculateNextDoseDate(vacuna.fecha, false);
          notificationDate = calculateNextNotificationDate(nextDoseDate, false);
        }
        
        // Crear notificación si hay fecha calculada
        if (nextDoseDate && notificationDate && isMountedRef.current) {
          try {
            const nextVaccine = isInitialSchedule 
              ? getNextSuggestedVaccine("perro", updatedAppliedVaccines, patientAgeMonths)
              : null;
            
            const notification = createVaccineNotification(
              client.id,
              client.petName,
              client.ownerName,
              client.email,
              client.phone,
              nextVaccine ? nextVaccine.name : `Refuerzo ${vacuna.nombre}`,
              nextVaccine ? nextVaccine.id : vacuna.vaccineId,
              nextDoseDate,
              notificationDate
            );
            
            if (notification) {
              await createNotification(notification);
              console.log("✅ Notificación automática creada (perro)");
            }
          } catch (error) {
            console.error("❌ Error creando notificación:", error);
          }
        }
      }
      
      // Limpiar y cerrar
      if (isMountedRef.current) {
        setShowAddVacuna(false);
        setNewVacuna({ 
          id: "", 
          fecha: "", 
          nombre: "", 
          vaccineId: "",
          proximaDosis: "",
          requiresBooster: false,
          notificationSent: false,
        });
      }
    } catch (error) {
      console.error("❌ Error en handleAddVacuna:", error);
      if (isMountedRef.current) {
        alert("Error al guardar la vacuna. Por favor intenta de nuevo.");
      }
    }
  }, [newVacuna, client, appliedVaccines, patientAgeMonths, onUpdate]);

  const handleDeleteVacuna = async (id: string) => {
    try {
      const updatedClient = {
        ...client,
        vacunas: client.vacunas.filter((v) => v.id !== id),
      };
      await onUpdate(updatedClient);
    } catch (error) {
      console.error("❌ Error eliminando vacuna:", error);
      alert("Error al eliminar la vacuna. Por favor intenta de nuevo.");
    }
  };

  const handleAddDesparacitacion = async () => {
    try {
      const desp = {
        ...newDesparacitacion,
        id: Date.now().toString(),
      };
      const updatedClient = {
        ...client,
        desparacitaciones: [...client.desparacitaciones, desp],
      };
      await onUpdate(updatedClient);
      setShowAddDesparacitacion(false);
      setNewDesparacitacion({ id: "", fecha: "", producto: "", proximaDosis: "" });
    } catch (error) {
      console.error("❌ Error agregando desparacitación:", error);
      alert("Error al guardar la desparacitación. Por favor intenta de nuevo.");
    }
  };

  const handleDeleteDesparacitacion = async (id: string) => {
    try {
      const updatedClient = {
        ...client,
        desparacitaciones: client.desparacitaciones.filter((d) => d.id !== id),
      };
      await onUpdate(updatedClient);
    } catch (error) {
      console.error("❌ Error eliminando desparacitación:", error);
      alert("Error al eliminar la desparacitación. Por favor intenta de nuevo.");
    }
  };

  const handleOpenSection = (section: EditSection) => {
    // Reset edit states when opening
    setEditedPhoto(client.photo);
    setEditedBirthDate(client.birthDate);
    setEditedSpecies(client.species);
    setEditedBreed(client.breed);
    setEditedWeight(client.weight);
    setEditedOwnerName(client.ownerName);
    setEditedPetName(client.petName);
    setEditedAddress(client.address);
    setEditedPhone(client.phone);
    setEditedHistorialMedico(client.historialMedico);
    setEditedDatosImportantes(client.datosImportantes);
    setEditingSection(section);
  };

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: appColors.background }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Button
            onClick={onBack}
            variant="outline"
            className="mb-4 border-2"
            style={{
              backgroundColor: appColors.green,
              borderColor: appColors.border,
              color: appColors.textOnColor,
            }}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Inicio
          </Button>
          
        </div>

        {/* Grid Layout - Responsive: Móvil = 1 col, Tablet = 2 cols, Desktop = 10 cols grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-10 gap-3 sm:gap-4 lg:gap-6 lg:grid-rows-8 lg:auto-rows-[minmax(120px,auto)]">
          {/* Foto - Responsive */}
          <div 
            className="md:col-span-1 lg:col-span-3 lg:row-span-2 rounded-2xl overflow-hidden cursor-pointer hover:scale-[1.02] lg:hover:scale-105 transition-transform border-2 aspect-square md:aspect-auto"
            style={{
              backgroundColor: appColors.secondary,
              borderColor: appColors.border,
            }}
            onClick={() => handleOpenSection("photo")}
          >
              {client.photo && client.photo.trim() !== "" ? (
                <img
                  src={client.photo}
                  alt={client.petName}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    console.error("Error loading patient photo");
                    e.currentTarget.src = "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400";
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <Upload className="w-12 h-12 mx-auto mb-2" />
                    <p className="text-sm">Sin foto</p>
                  </div>
                </div>
              )}
          </div>

          {/* Información Básica - Responsive */}
          <div 
            className="md:col-span-1 lg:col-span-3 lg:row-span-2 border-2 rounded-2xl p-4 sm:p-6 cursor-pointer hover:scale-[1.02] lg:hover:scale-105 transition-transform"
            style={{
              backgroundColor: sectionColors.basicInfo,
              borderColor: appColors.border,
            }}
            onClick={() => handleOpenSection("basicInfo")}
          >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <h3 className="mb-2 text-base sm:text-lg font-bold" style={{ color: appColors.textOnColor }}>Nombre</h3>
                  <p className="text-sm sm:text-base" style={{ color: appColors.textOnColor }}>{client.petName}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-base sm:text-lg font-bold" style={{ color: appColors.textOnColor }}>Fecha de nacimiento</h3>
                  <p className="text-sm sm:text-base" style={{ color: appColors.textOnColor }}>
                    {formatDateSafely(client.birthDate, "es-ES", "No especificado")}
                  </p>
                </div>
                <div>
                  <h3 className="mb-2 text-base sm:text-lg font-bold" style={{ color: appColors.textOnColor }}>Especie</h3>
                  <Badge style={{ 
                    backgroundColor: appColors.base,
                    color: appColors.textPrimary 
                  }}>
                    {client.species.charAt(0).toUpperCase() + client.species.slice(1)}
                  </Badge>
                </div>
                <div>
                  <h3 className="mb-2 font-bold" style={{ color: appColors.textOnColor }}>Raza</h3>
                  <p style={{ color: appColors.textOnColor }}>{client.breed || "No especificado"}</p>
                </div>
                <div>
                  <h3 className="mb-2 font-bold" style={{ color: appColors.textOnColor }}>Peso</h3>
                  <p style={{ color: appColors.textOnColor }}>{client.weight || "No especificado"}</p>
                </div>
              </div>
          </div>

          {/* Información de Contacto - Responsive */}
          <div 
            className="md:col-span-2 lg:col-span-4 lg:row-span-2 border-2 rounded-2xl p-4 sm:p-6 cursor-pointer hover:scale-[1.02] lg:hover:scale-105 transition-transform"
            style={{
              backgroundColor: sectionColors.contactInfo,
              borderColor: appColors.border,
            }}
            onClick={() => handleOpenSection("contactInfo")}
          >
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <div className="sm:col-span-2">
                  <h3 className="mb-2 text-base sm:text-lg font-bold" style={{ color: appColors.textOnColor }}>Dueño</h3>
                  <p className="text-sm sm:text-base" style={{ color: appColors.textOnColor }}>{client.ownerName}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-base sm:text-lg font-bold" style={{ color: appColors.textOnColor }}>Dirección</h3>
                  <p className="text-sm sm:text-base" style={{ color: appColors.textOnColor }}>{client.address || "No especificado"}</p>
                </div>
                <div>
                  <h3 className="mb-2 text-base sm:text-lg font-bold" style={{ color: appColors.textOnColor }}>Teléfono</h3>
                  <p className="text-sm sm:text-base" style={{ color: appColors.textOnColor }}>{client.phone || "No especificado"}</p>
                </div>
              </div>
          </div>

          {/* Historial Médico - Responsive (vertical en móvil OK) */}
          <div 
            className="md:col-span-2 lg:col-span-4 lg:row-span-4 border-2 rounded-2xl p-4 sm:p-6 cursor-pointer hover:scale-[1.02] lg:hover:scale-105 transition-transform flex flex-col min-h-[200px] lg:min-h-0"
            style={{
              backgroundColor: sectionColors.medicalHistory,
              borderColor: appColors.border,
            }}
            onClick={() => handleOpenSection("historialMedico")}
          >
            <h2 className="mb-3 sm:mb-4 text-base sm:text-lg font-bold" style={{ color: appColors.textOnColor }}>Historial Médico</h2>
            <p className="whitespace-pre-wrap flex-1 overflow-y-auto text-sm sm:text-base" style={{ color: appColors.textOnColor }}>
              {client.historialMedico || "Sin historial médico registrado"}
            </p>
          </div>

          {/* Datos Importantes - Responsive */}
          <div 
            className="md:col-span-2 lg:col-span-6 lg:row-span-2 border-2 rounded-2xl p-4 sm:p-6 cursor-pointer hover:scale-[1.02] lg:hover:scale-105 transition-transform"
            style={{
              backgroundColor: sectionColors.importantData,
              borderColor: appColors.border,
            }}
            onClick={() => handleOpenSection("datosImportantes")}
          >
            <h2 className="mb-3 text-[18px] font-bold" style={{ color: appColors.textOnColor }}>Datos Importantes del Paciente</h2>
            <p className="whitespace-pre-wrap line-clamp-3" style={{ color: appColors.textOnColor }}>
              {client.datosImportantes || "Sin datos importantes registrados"}
            </p>
          </div>

          {/* Historial de Vacunas - Responsive */}
          <div 
            className="md:col-span-1 lg:col-span-3 lg:row-span-2 border-2 rounded-2xl p-4 sm:p-6 cursor-pointer hover:scale-[1.02] lg:hover:scale-105 transition-transform"
            style={{
              backgroundColor: sectionColors.vaccines,
              borderColor: appColors.border,
            }}
            onClick={() => handleOpenSection("vacunas")}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[18px] font-bold" style={{ color: appColors.textOnColor }}>Historial Vacunas</h3>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddVacuna(true);
                }}
                className="border-2"
                style={{
                  backgroundColor: appColors.base,
                  borderColor: appColors.border,
                  color: appColors.textPrimary,
                }}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Progreso del esquema - Compacto */}
            {vaccinationProgress && (
              <div className="mb-3 pb-3 border-b" style={{ borderColor: appColors.border }}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs opacity-70" style={{ color: appColors.textOnColor }}>
                    Esquema: {vaccinationProgress.completed}/{vaccinationProgress.total}
                  </span>
                  <span className="text-xs font-bold" style={{ color: appColors.textOnColor }}>
                    {vaccinationProgress.percentage}%
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full" style={{ backgroundColor: appColors.base }}>
                  <div 
                    className="h-full rounded-full transition-all duration-500"
                    style={{ 
                      width: `${vaccinationProgress.percentage}%`,
                      backgroundColor: vaccinationProgress.isComplete ? appColors.green : appColors.yellow,
                    }}
                  />
                </div>
                {vaccinationProgress.isComplete && (
                  <p className="text-xs mt-1" style={{ color: appColors.textOnColor }}>
                    ✅ Completo
                  </p>
                )}
                {nextSuggestedVaccine && !vaccinationProgress.isComplete && (
                  <p className="text-xs mt-1" style={{ color: appColors.textOnColor }}>
                    📅 Siguiente: {nextSuggestedVaccine.name}
                  </p>
                )}
              </div>
            )}
            
            <div className="space-y-2 max-h-24 overflow-y-auto">
              {client.vacunas.length === 0 ? (
                <p className="opacity-70 text-sm" style={{ color: appColors.textOnColor }}>No hay vacunas</p>
              ) : (
                client.vacunas.slice(0, 3).map((vacuna) => (
                  <div key={vacuna.id} className="p-2 rounded" style={{ backgroundColor: appColors.base + "80" }}>
                    <p className="text-sm" style={{ color: appColors.textPrimary }}>{vacuna.nombre}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Historial de Desparacitaciones - Responsive */}
          <div 
            className="md:col-span-1 lg:col-span-3 lg:row-span-2 border-2 rounded-2xl p-4 sm:p-6 cursor-pointer hover:scale-[1.02] lg:hover:scale-105 transition-transform"
            style={{
              backgroundColor: sectionColors.deworming,
              borderColor: appColors.border,
            }}
            onClick={() => handleOpenSection("desparacitaciones")}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h3 className="text-base sm:text-lg font-bold" style={{ color: appColors.textOnColor }}>Desparacitaciones</h3>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddDesparacitacion(true);
                }}
                className="border-2"
                style={{
                  backgroundColor: appColors.base,
                  borderColor: appColors.border,
                  color: appColors.textPrimary,
                }}
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {client.desparacitaciones.length === 0 ? (
                <p className="opacity-70 text-sm sm:text-base" style={{ color: appColors.textOnColor }}>No hay desparacitaciones</p>
              ) : (
                client.desparacitaciones.slice(0, 3).map((desp) => (
                  <div key={desp.id} className="p-2 rounded" style={{ backgroundColor: appColors.base + "80" }}>
                    <p className="text-sm sm:text-base" style={{ color: appColors.textPrimary }}>{desp.producto}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Registro de Consultas - Responsive */}
          <div 
            className="md:col-span-2 lg:col-span-5 lg:row-span-2 border-2 rounded-2xl p-4 sm:p-6 cursor-pointer hover:scale-[1.02] lg:hover:scale-105 transition-transform"
            style={{
              backgroundColor: sectionColors.consultas,
              borderColor: appColors.border,
            }}
            onClick={() => handleOpenSection("consultas")}
          >
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-base sm:text-lg font-bold" style={{ color: appColors.textOnColor }}>Registro de Consultas</h2>
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowAddConsulta(true);
                }}
                className="border-2"
                style={{
                  backgroundColor: appColors.base,
                  borderColor: appColors.border,
                  color: appColors.textPrimary,
                }}
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              </Button>
            </div>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {client.consultas.length === 0 ? (
                <p className="opacity-70 text-sm sm:text-base" style={{ color: appColors.textOnColor }}>No hay consultas registradas</p>
              ) : (
                client.consultas.slice(0, 3).map((consulta) => (
                  <div key={consulta.id} className="p-2 rounded" style={{ backgroundColor: appColors.base + "80" }}>
                    <p className="text-sm sm:text-base" style={{ color: appColors.textPrimary }}>
                      {formatDateSafely(consulta.fecha)} - {consulta.motivo}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Eliminar Paciente - Responsive */}
          <div 
            className="md:col-span-2 lg:col-span-5 lg:row-span-2 border-2 rounded-2xl p-4 sm:p-6 cursor-pointer hover:scale-[1.02] lg:hover:scale-105 transition-transform flex flex-col items-center justify-center min-h-[120px]"
            style={{
              backgroundColor: appColors.red,
              borderColor: appColors.border,
            }}
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-10 h-10 sm:w-12 sm:h-12 mb-2 sm:mb-3" style={{ color: appColors.textOnColor }} />
            <h2 className="text-base sm:text-lg text-center font-bold" style={{ color: appColors.textOnColor }}>Eliminar Paciente</h2>
          </div>
        </div>

        {/* Dialog de confirmación de eliminación */}
        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogContent className="backdrop-blur-md bg-white/95">
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente el
                paciente "{client.petName}" de la base de datos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setShowDeleteDialog(false)}>
                Cancelar
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => {
                  onDelete(client.id);
                  setShowDeleteDialog(false);
                }}
                className="bg-red-500 hover:bg-red-600"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Edit Dialogs with backdrop blur */}
        <Dialog open={editingSection === "photo"} onOpenChange={() => setEditingSection(null)}>
          <DialogContent className="backdrop-blur-md bg-white/95 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Foto del Paciente</DialogTitle>
              <DialogDescription>
                Sube una foto desde tu dispositivo o ingresa una URL de imagen.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              {/* Preview - Mostrar primero */}
              {editedPhoto && (
                <div>
                  <Label className="mb-2 block">Vista Previa</Label>
                  <div className="w-full max-w-md mx-auto aspect-square rounded-lg overflow-hidden bg-slate-200 border-4 border-black">
                    <img
                      src={editedPhoto}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.error("Error loading preview image");
                        e.currentTarget.src = "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400";
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Upload from file with drag & drop */}
              <div>
                <Label>Subir Foto desde Archivo</Label>
                <div className="mt-2">
                  <div
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    className={`flex items-center justify-center w-full p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                      isDragging
                        ? "border-[#22c55e] bg-[#22c55e]/10"
                        : "border-gray-300 hover:border-[#22c55e]"
                    }`}
                  >
                    <label
                      htmlFor="photo-upload"
                      className="cursor-pointer w-full"
                    >
                      <div className="text-center">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600 mb-1">
                          {uploadingPhoto
                            ? "Procesando imagen..."
                            : isDragging
                            ? "Suelta la imagen aquí"
                            : "Arrastra una imagen o haz click"}
                        </p>
                        <p className="text-xs text-gray-400">JPG, PNG, GIF (máx. 5MB)</p>
                      </div>
                      <input
                        id="photo-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileInput}
                        disabled={uploadingPhoto}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">o usar URL</span>
                </div>
              </div>

              {/* URL input */}
              <div>
                <Label>URL de Foto</Label>
                <Input
                  value={editedPhoto}
                  onChange={(e) => setEditedPhoto(e.target.value)}
                  placeholder="https://..."
                  disabled={uploadingPhoto}
                />
              </div>

              {/* Actions - Botones más visibles */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setEditingSection(null);
                    setEditedPhoto(client.photo);
                  }}
                  disabled={uploadingPhoto}
                  size="lg"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleSavePhoto}
                  className="bg-[#22c55e] hover:bg-[#16a34a] text-black"
                  disabled={uploadingPhoto}
                  size="lg"
                >
                  Guardar Cambios
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={editingSection === "basicInfo"} onOpenChange={() => setEditingSection(null)}>
          <DialogContent className="backdrop-blur-md bg-white/95">
            <DialogHeader>
              <DialogTitle>Editar Información Básica</DialogTitle>
              <DialogDescription>
                Actualiza la información básica del paciente.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nombre del Paciente</Label>
                <Input
                  value={editedPetName}
                  onChange={(e) => setEditedPetName(e.target.value)}
                />
              </div>
              <div>
                <Label>Fecha de Nacimiento</Label>
                <Input
                  type="date"
                  value={editedBirthDate}
                  onChange={(e) => setEditedBirthDate(e.target.value)}
                />
              </div>
              <div>
                <Label>Especie</Label>
                <Select value={editedSpecies} onValueChange={setEditedSpecies}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="perro">Perro</SelectItem>
                    <SelectItem value="gato">Gato</SelectItem>
                    <SelectItem value="ave">Ave</SelectItem>
                    <SelectItem value="conejo">Conejo</SelectItem>
                    <SelectItem value="hamster">Hámster</SelectItem>
                    <SelectItem value="reptil">Reptil</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Raza</Label>
                <Input
                  value={editedBreed}
                  onChange={(e) => setEditedBreed(e.target.value)}
                />
              </div>
              <div>
                <Label>Peso</Label>
                <Input
                  value={editedWeight}
                  onChange={(e) => setEditedWeight(e.target.value)}
                  placeholder="ej: 25 kg"
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingSection(null)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveBasicInfo}
                  className="bg-[#22c55e] hover:bg-[#16a34a] text-black"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={editingSection === "contactInfo"} onOpenChange={() => setEditingSection(null)}>
          <DialogContent className="backdrop-blur-md bg-white/95">
            <DialogHeader>
              <DialogTitle>Editar Información de Contacto</DialogTitle>
              <DialogDescription>
                Actualiza los datos de contacto del dueño.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nombre del Dueño</Label>
                <Input
                  value={editedOwnerName}
                  onChange={(e) => setEditedOwnerName(e.target.value)}
                />
              </div>
              <div>
                <Label>Dirección</Label>
                <Input
                  value={editedAddress}
                  onChange={(e) => setEditedAddress(e.target.value)}
                />
              </div>
              <div>
                <Label>Teléfono</Label>
                <Input
                  value={editedPhone}
                  onChange={(e) => setEditedPhone(e.target.value)}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingSection(null)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveContactInfo}
                  className="bg-[#22c55e] hover:bg-[#16a34a] text-black"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={editingSection === "historialMedico"} onOpenChange={() => setEditingSection(null)}>
          <DialogContent className="backdrop-blur-md bg-white/95">
            <DialogHeader>
              <DialogTitle>Editar Historial Médico</DialogTitle>
              <DialogDescription>
                Actualiza el historial médico del paciente.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Historial Médico</Label>
                <Textarea
                  value={editedHistorialMedico}
                  onChange={(e) => setEditedHistorialMedico(e.target.value)}
                  rows={8}
                  placeholder="Condiciones médicas, cirugías previas, alergias..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingSection(null)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveHistorialMedico}
                  className="bg-[#22c55e] hover:bg-[#16a34a] text-black"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={editingSection === "consultas"} onOpenChange={() => setEditingSection(null)}>
          <DialogContent className="backdrop-blur-md bg-white/95 max-w-3xl">
            <DialogHeader>
              <DialogTitle>Registro de Consultas</DialogTitle>
              <DialogDescription>
                Consulta el historial completo de visitas veterinarias.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {client.consultas.map((consulta) => (
                <div key={consulta.id} className="bg-[#fde047] p-4 rounded-lg border-2 border-black">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-black">
                      {formatDateSafely(consulta.fecha)}
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteConsulta(consulta.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                  <p className="text-black">Motivo: {consulta.motivo}</p>
                  <p className="text-black">Diagnóstico: {consulta.diagnostico}</p>
                  <p className="text-black">Tratamiento: {consulta.tratamiento}</p>
                </div>
              ))}
            </div>
            <Button
              onClick={() => setEditingSection(null)}
              className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black"
            >
              Cerrar
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={editingSection === "vacunas"} onOpenChange={() => setEditingSection(null)}>
          <DialogContent className="backdrop-blur-md bg-white/95 max-w-3xl">
            <DialogHeader>
              <DialogTitle>Historial de Vacunas</DialogTitle>
              <DialogDescription>
                Consulta todas las vacunas aplicadas y el progreso del esquema.
              </DialogDescription>
            </DialogHeader>
            
            <VaccineDialogContent
              client={client}
              appliedVaccines={appliedVaccines}
              vaccinationProgress={vaccinationProgress}
              nextSuggestedVaccine={nextSuggestedVaccine}
              patientAgeMonths={patientAgeMonths}
              onDeleteVacuna={handleDeleteVacuna}
            />
            
            <Button
              onClick={() => setEditingSection(null)}
              className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black mt-4"
            >
              Cerrar
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={editingSection === "desparacitaciones"} onOpenChange={() => setEditingSection(null)}>
          <DialogContent className="backdrop-blur-md bg-white/95 max-w-3xl">
            <DialogHeader>
              <DialogTitle>Historial de Desparacitaciones</DialogTitle>
              <DialogDescription>
                Consulta el registro completo de desparacitaciones.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 max-h-[60vh] overflow-y-auto">
              {client.desparacitaciones.map((desp) => (
                <div key={desp.id} className="bg-[#fde047] p-4 rounded-lg border-2 border-black">
                  <div className="flex justify-between items-start mb-2">
                    <p className="text-black">{desp.producto}</p>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteDesparacitacion(desp.id)}
                      className="h-8 w-8 p-0 hover:bg-red-100"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                  <p className="text-black opacity-70">
                    Aplicada: {formatDateSafely(desp.fecha)}
                  </p>
                  {desp.proximaDosis && (
                    <p className="text-black opacity-70">
                      Próxima: {formatDateSafely(desp.proximaDosis)}
                    </p>
                  )}
                </div>
              ))}
            </div>
            <Button
              onClick={() => setEditingSection(null)}
              className="w-full bg-[#22c55e] hover:bg-[#16a34a] text-black"
            >
              Cerrar
            </Button>
          </DialogContent>
        </Dialog>

        <Dialog open={editingSection === "datosImportantes"} onOpenChange={() => setEditingSection(null)}>
          <DialogContent className="backdrop-blur-md bg-white/95">
            <DialogHeader>
              <DialogTitle>Editar Datos Importantes</DialogTitle>
              <DialogDescription>
                Actualiza información crítica del paciente.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Datos Importantes del Paciente</Label>
                <Textarea
                  value={editedDatosImportantes}
                  onChange={(e) => setEditedDatosImportantes(e.target.value)}
                  rows={8}
                  placeholder="Alergias, medicamentos actuales, comportamiento especial..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setEditingSection(null)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSaveDatosImportantes}
                  className="bg-[#22c55e] hover:bg-[#16a34a] text-black"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Consulta Dialog */}
        <Dialog open={showAddConsulta} onOpenChange={setShowAddConsulta}>
          <DialogContent className="backdrop-blur-md bg-white/95">
            <DialogHeader>
              <DialogTitle>Nueva Consulta</DialogTitle>
              <DialogDescription>
                Registra una nueva consulta veterinaria.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Fecha</Label>
                <Input
                  type="date"
                  value={newConsulta.fecha}
                  onChange={(e) =>
                    setNewConsulta({ ...newConsulta, fecha: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Motivo</Label>
                <Input
                  value={newConsulta.motivo}
                  onChange={(e) =>
                    setNewConsulta({ ...newConsulta, motivo: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Diagnóstico</Label>
                <Textarea
                  value={newConsulta.diagnostico}
                  onChange={(e) =>
                    setNewConsulta({ ...newConsulta, diagnostico: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Tratamiento</Label>
                <Textarea
                  value={newConsulta.tratamiento}
                  onChange={(e) =>
                    setNewConsulta({ ...newConsulta, tratamiento: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddConsulta(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddConsulta}
                  className="bg-[#22c55e] hover:bg-[#16a34a] text-black"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Add Vacuna Dialog - Sistema Estructurado */}
        <AddVaccineDialog
          open={showAddVacuna}
          client={client}
          newVacuna={newVacuna}
          appliedVaccines={appliedVaccines}
          patientAgeMonths={patientAgeMonths}
          nextSuggestedVaccine={nextSuggestedVaccine}
          onOpenChange={setShowAddVacuna}
          onVaccineChange={handleVaccineChange}
          onSave={handleAddVacuna}
        />

        {/* Add Desparacitación Dialog */}
        <Dialog open={showAddDesparacitacion} onOpenChange={setShowAddDesparacitacion}>
          <DialogContent className="backdrop-blur-md bg-white/95">
            <DialogHeader>
              <DialogTitle>Nueva Desparacitación</DialogTitle>
              <DialogDescription>
                Registra una nueva desparacitación aplicada al paciente.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Producto Utilizado</Label>
                <Input
                  value={newDesparacitacion.producto}
                  onChange={(e) =>
                    setNewDesparacitacion({ ...newDesparacitacion, producto: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Fecha de Aplicación</Label>
                <Input
                  type="date"
                  value={newDesparacitacion.fecha}
                  onChange={(e) =>
                    setNewDesparacitacion({ ...newDesparacitacion, fecha: e.target.value })
                  }
                />
              </div>
              <div>
                <Label>Próxima Dosis</Label>
                <Input
                  type="date"
                  value={newDesparacitacion.proximaDosis}
                  onChange={(e) =>
                    setNewDesparacitacion({ ...newDesparacitacion, proximaDosis: e.target.value })
                  }
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowAddDesparacitacion(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleAddDesparacitacion}
                  className="bg-[#22c55e] hover:bg-[#16a34a] text-black"
                >
                  Guardar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
