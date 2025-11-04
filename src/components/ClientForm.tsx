import { useState, useEffect } from "react";
import { Button } from "./ui/button";
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
import { Upload } from "lucide-react";
import { convertImageToBase64 } from "../utils/api";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export interface Consulta {
  id: string;
  fecha: string;
  motivo: string;
  diagnostico: string;
  tratamiento: string;
}

export interface Vacuna {
  id: string;
  fecha: string;
  nombre: string; // Ahora será el ID de la vacuna (ej: "polivalente-rabia")
  vaccineId: string; // ID de la vacuna de la configuración
  proximaDosis: string; // Calculado automáticamente para vacunas con refuerzo
  requiresBooster: boolean; // Si requiere refuerzo anual
  notificationSent: boolean; // Si ya se envió la notificación
}

export interface Desparacitacion {
  id: string;
  fecha: string;
  producto: string;
  proximaDosis: string;
}

export interface Client {
  id: string;
  ownerName: string;
  petName: string;
  species: string;
  breed: string;
  age: string;
  birthDate: string;
  weight: string;
  phone: string;
  email: string;
  address: string;
  photo: string;
  historialMedico: string;
  consultas: Consulta[];
  vacunas: Vacuna[];
  desparacitaciones: Desparacitacion[];
  datosImportantes: string;
}

import { appColors, SPECIES_LIST } from "../utils/themes";

interface ClientFormProps {
  client?: Client;
  onSave: (client: Client) => void;
  onCancel: () => void;
}

export function ClientForm({ client, onSave, onCancel }: ClientFormProps) {
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [formData, setFormData] = useState<Client>({
    id: client?.id || "",
    ownerName: client?.ownerName || "",
    petName: client?.petName || "",
    species: client?.species || "",
    breed: client?.breed || "",
    age: client?.age || "",
    birthDate: client?.birthDate || "",
    weight: client?.weight || "",
    phone: client?.phone || "",
    email: client?.email || "",
    address: client?.address || "",
    photo: client?.photo || "",
    historialMedico: client?.historialMedico || "",
    consultas: client?.consultas || [],
    // Migrar vacunas antiguas al nuevo formato si es necesario
    vacunas: (client?.vacunas || []).map(v => ({
      ...v,
      vaccineId: v.vaccineId || v.nombre, // Retrocompatibilidad
      requiresBooster: v.requiresBooster !== undefined ? v.requiresBooster : false,
      notificationSent: v.notificationSent || false,
    })),
    desparacitaciones: client?.desparacitaciones || [],
    datosImportantes: client?.datosImportantes || "",
  });

  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clientToSave = {
      ...formData,
      id: formData.id || Date.now().toString(),
    };
    onSave(clientToSave);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpeciesChange = (value: string) => {
    setFormData((prev) => ({ ...prev, species: value }));
  };

  const handlePhotoUpload = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("La imagen debe ser menor a 5MB");
      return;
    }

    try {
      setUploadingPhoto(true);
      const base64Image = await convertImageToBase64(file);
      setFormData({ ...formData, photo: base64Image });
    } catch (error) {
      console.error("Error processing photo:", error);
      alert("Error al procesar la foto. Por favor intenta de nuevo.");
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handlePhotoUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ownerName">Nombre del Cliente *</Label>
          <Input
            id="ownerName"
            name="ownerName"
            value={formData.ownerName}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="petName">Nombre del Paciente *</Label>
          <Input
            id="petName"
            name="petName"
            value={formData.petName}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="species">Especie *</Label>
          <Select value={formData.species} onValueChange={handleSpeciesChange}>
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar especie" />
            </SelectTrigger>
            <SelectContent>
              {SPECIES_LIST.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="breed">Raza</Label>
          <Input
            id="breed"
            name="breed"
            value={formData.breed}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
          <Input
            id="birthDate"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="age">Edad</Label>
          <Input
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            placeholder="ej: 3 años"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="weight">Peso</Label>
          <Input
            id="weight"
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            placeholder="ej: 25 kg"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono (con lada)</Label>
          <Input
            id="phone"
            name="phone"
            type="text"
            value={formData.phone}
            onChange={handleChange}
            placeholder="+52 (55) 1234-5678"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="cliente@ejemplo.com"
            required
          />
        </div>
      </div>

      {/* Photo Upload Section */}
      <div className="space-y-4">
        <Label>Foto del Paciente</Label>
        
        {/* Drag & Drop Area */}
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
            htmlFor="client-photo-upload"
            className="cursor-pointer w-full"
          >
            <div className="text-center">
              <Upload className="w-10 h-10 mx-auto mb-2 text-gray-400" />
              <p className="text-sm text-gray-600 mb-1">
                {uploadingPhoto
                  ? "Procesando imagen..."
                  : isDragging
                  ? "Suelta la imagen aquí"
                  : "Arrastra una imagen o haz click para seleccionar"}
              </p>
              <p className="text-xs text-gray-400">JPG, PNG, GIF (máx. 5MB)</p>
            </div>
            <input
              id="client-photo-upload"
              type="file"
              accept="image/*"
              onChange={handleFileInput}
              disabled={uploadingPhoto}
              className="hidden"
            />
          </label>
        </div>

        {/* Preview */}
        {formData.photo && (
          <div className="mt-4">
            <Label className="mb-2 block">Vista Previa</Label>
            <div className="aspect-square w-48 rounded-lg overflow-hidden border-4 border-black mx-auto">
              <img
                src={formData.photo}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  console.error("Error loading preview");
                  e.currentTarget.src = "https://images.unsplash.com/photo-1558788353-f76d92427f16?w=400";
                }}
              />
            </div>
          </div>
        )}

        {/* Divider */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">o usar URL</span>
          </div>
        </div>

        {/* URL Input */}
        <div>
          <Label>URL de Foto</Label>
          <Input
            value={formData.photo}
            onChange={(e) =>
              setFormData({ ...formData, photo: e.target.value })
            }
            placeholder="https://ejemplo.com/foto.jpg"
            disabled={uploadingPhoto}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="historialMedico">Historial Médico</Label>
        <Textarea
          id="historialMedico"
          name="historialMedico"
          value={formData.historialMedico}
          onChange={handleChange}
          rows={4}
          placeholder="Condiciones médicas, cirugías previas, alergias..."
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="datosImportantes">Datos Importantes del Paciente</Label>
        <Textarea
          id="datosImportantes"
          name="datosImportantes"
          value={formData.datosImportantes}
          onChange={handleChange}
          rows={3}
          placeholder="Alergias, medicamentos actuales, comportamiento especial..."
        />
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" className="bg-[#22c55e] hover:bg-[#16a34a] text-black">
          {client ? "Actualizar" : "Guardar"}
        </Button>
      </div>
    </form>
  );
}
