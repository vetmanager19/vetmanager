import { useState, useEffect, useMemo, useCallback } from "react";
import { ClientForm, Client } from "./components/ClientForm";
import { AuthScreen } from "./components/AuthScreen";
import { SettingsDialog } from "./components/SettingsDialog";
import { NotificationPanel } from "./components/NotificationPanel";
import { appColors, SPECIES_OPTIONS, SPECIES_COLORS } from "./utils/themes";
import * as api from "./utils/api";
import { PatientDetail } from "./components/PatientDetail";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "./components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import {
  PlusCircle,
  X,
  RefreshCw,
  User,
  Bell,
} from "lucide-react";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userSettings, setUserSettings] = useState<{ clinicName: string; email: string } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | undefined>();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<string | null>(null);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("vet_auth_token");
    if (token) {
      api.setAuthToken(token);
      loadUserSettings();
      setIsAuthenticated(true);
      loadClients();
    } else {
      setLoading(false);
    }
  }, []);

  const loadUserSettings = async () => {
    try {
      const settings = await api.getUserSettings();
      setUserSettings(settings);
    } catch (error) {
      console.error("Error loading user settings:", error);
      handleLogout(); // If can't load settings, logout
    }
  };

  const handleLogin = async (email: string, password: string) => {
    const result = await api.login(email, password);
    localStorage.setItem("vet_auth_token", result.accessToken);
    api.setAuthToken(result.accessToken);
    setUserSettings({ clinicName: result.user.clinicName, email: result.user.email });
    setIsAuthenticated(true);
    loadClients();
  };

  const handleRegister = async (email: string, password: string, clinicName: string) => {
    const result = await api.register(email, password, clinicName);
    localStorage.setItem("vet_auth_token", result.accessToken);
    api.setAuthToken(result.accessToken);
    setUserSettings({ clinicName: result.user.clinicName, email: result.user.email });
    setIsAuthenticated(true);
    loadClients();
  };

  const handleLogout = () => {
    localStorage.removeItem("vet_auth_token");
    api.setAuthToken(null);
    setIsAuthenticated(false);
    setUserSettings(null);
    setClients([]);
    setSelectedClient(null);
  };

  const handleUpdateSettings = async (settings: { clinicName: string; email: string }) => {
    await api.updateUserSettings({ clinicName: settings.clinicName });
    setUserSettings(settings);
  };

  const loadClients = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const fetchedClients = await api.getAllClients();
      setClients(fetchedClients);
      if (fetchedClients.length === 0) {
        // Could be empty or could be error - we don't show error for empty
        setLoadError(false);
      }
    } catch (error) {
      console.error("❌ Error loading clients:", error);
      setLoadError(true);
      setClients([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  // Filtrar clientes con useMemo para optimizar
  const filteredClients = useMemo(() => {
    const search = searchTerm.toLowerCase();
    return clients.filter((client) => {
      const matchesSearch = !search ||
        client.ownerName.toLowerCase().includes(search) ||
        client.petName.toLowerCase().includes(search) ||
        client.breed.toLowerCase().includes(search) ||
        client.phone.includes(searchTerm) ||
        client.email.toLowerCase().includes(search);

      const matchesSpecies = speciesFilter === "all" || client.species === speciesFilter;

      return matchesSearch && matchesSpecies;
    });
  }, [clients, searchTerm, speciesFilter]);

  const handleSaveClient = useCallback(async (client: Client) => {
    try {
      if (editingClient) {
        await api.updateClient(client);
      } else {
        await api.createClient(client);
      }
      await loadClients();
      setIsDialogOpen(false);
      setEditingClient(undefined);
    } catch (error) {
      console.error("Error saving client:", error);
      alert("Error al guardar el paciente. Por favor intenta de nuevo.");
    }
  }, [editingClient]);

  const handleEditClient = useCallback((client: Client) => {
    setEditingClient(client);
    setIsDialogOpen(true);
  }, []);

  const handleDeleteClick = useCallback((id: string) => {
    setClientToDelete(id);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(async () => {
    if (clientToDelete) {
      try {
        await api.deleteClient(clientToDelete);
        await loadClients();
        setClientToDelete(null);
        setDeleteDialogOpen(false);
        setSelectedClient(null); // Volver al menú principal después de eliminar
      } catch (error) {
        console.error("Error deleting client:", error);
        alert("Error al eliminar el paciente. Por favor intenta de nuevo.");
      }
    }
  }, [clientToDelete]);

  const handleAddNew = useCallback(() => {
    setEditingClient(undefined);
    setIsDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
    setEditingClient(undefined);
  }, []);

  const handleViewClient = useCallback((client: Client) => {
    setSelectedClient(client);
  }, []);

  const handleBackFromDetail = useCallback(() => {
    setSelectedClient(null);
  }, []);

  const handleUpdateClientFromDetail = useCallback(async (updatedClient: Client) => {
    try {
      await api.updateClient(updatedClient);
      await loadClients();
      setSelectedClient(updatedClient);
    } catch (error) {
      console.error("Error updating client:", error);
      alert("Error al actualizar el paciente. Por favor intenta de nuevo.");
    }
  }, []);

  const clearFilters = useCallback(() => {
    setSearchTerm("");
    setSpeciesFilter("all");
  }, []);

  const getSpeciesBadgeColor = useCallback((species: string) => {
    return SPECIES_COLORS[species] || appColors.secondary;
  }, []);

  // Show auth screen if not authenticated
  if (!isAuthenticated) {
    return <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />;
  }

  // Si hay un cliente seleccionado, mostrar la vista detallada
  if (selectedClient) {
    return (
      <PatientDetail
        client={selectedClient}
        onBack={handleBackFromDetail}
        onUpdate={handleUpdateClientFromDetail}
        onDelete={handleDeleteClick}
      />
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6 md:p-8" style={{ backgroundColor: appColors.background }}>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <h1 className="mb-0 text-xl sm:text-2xl md:text-3xl font-bold" style={{ color: appColors.green }}>
              🐾 {userSettings?.clinicName || "VetManager"}
            </h1>
          </div>
          <div className="flex gap-2 sm:gap-4 w-full sm:w-auto">
            <NotificationPanel />
            <Button
              variant="outline"
              onClick={() => setShowSettings(true)}
              className="border-2 flex-1 sm:flex-none"
              style={{
                backgroundColor: appColors.purple,
                borderColor: appColors.border,
                color: appColors.textOnColor,
              }}
            >
              <User className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Ajustes</span>
            </Button>
            <Button
              variant="outline"
              onClick={loadClients}
              disabled={loading}
              className="border-2 flex-1 sm:flex-none"
              style={{
                backgroundColor: appColors.green,
                borderColor: appColors.border,
                color: appColors.textOnColor,
              }}
            >
              <RefreshCw className={`w-4 h-4 sm:mr-2 ${loading ? "animate-spin" : ""}`} />
              <span className="hidden sm:inline">Recargar</span>
            </Button>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="border-2 rounded-lg p-6 sm:p-8 mb-6 sm:mb-8" style={{
          backgroundColor: appColors.cardBackground,
          borderColor: appColors.border,
        }}>
          <h2 className="mb-5 text-xl sm:text-2xl" style={{ color: appColors.textPrimary }}>Buscar Cliente</h2>
          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <div className="flex-1">
                <Input
                  type="text"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full"
                  style={{
                    backgroundColor: appColors.tertiary,
                    borderColor: appColors.border,
                    color: appColors.textOnColor,
                  }}
                />
              </div>

              <div className="w-full sm:w-48">
                <Select value={speciesFilter} onValueChange={setSpeciesFilter}>
                  <SelectTrigger 
                    className="border-2 w-full"
                    style={{
                      backgroundColor: appColors.tertiary,
                      borderColor: appColors.border,
                    }}
                  >
                    <SelectValue placeholder="Especie" />
                  </SelectTrigger>
                  <SelectContent>
                    {SPECIES_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {(searchTerm || speciesFilter !== "all") && (
                <Button
                  onClick={clearFilters}
                  className="bg-red-500 hover:bg-red-600 text-white w-full sm:w-auto"
                >
                  <X className="w-4 h-4 sm:mr-2" />
                  <span className="sm:inline">Limpiar</span>
                </Button>
              )}
            </div>

            <Button
              onClick={handleAddNew}
              className="border-2 w-full sm:w-auto"
              style={{
                backgroundColor: appColors.blue,
                borderColor: appColors.border,
                color: appColors.textOnColor,
              }}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Nuevo Paciente
            </Button>
          </div>
        </div>

        {/* Load Error Warning */}
        {loadError && (
          <div 
            className="border-2 rounded-lg p-4 mb-6 flex items-center gap-3"
            style={{
              backgroundColor: appColors.red + "15",
              borderColor: appColors.red,
            }}
          >
            <Bell className="w-5 h-5" style={{ color: appColors.red }} />
            <div>
              <p style={{ color: appColors.red }}>
                Problema al cargar datos
              </p>
              <p className="text-sm" style={{ color: appColors.textSecondary }}>
                Hubo un problema al cargar los pacientes. Esto puede deberse a una conexión lenta. 
                Intenta hacer clic en "Recargar" arriba.
              </p>
            </div>
          </div>
        )}

        {/* Patient Grid - Responsive optimizado */}
        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4">
          {loading ? (
            <div className="col-span-full text-center py-12">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: appColors.green }} />
              <p style={{ color: appColors.textSecondary }}>Cargando pacientes...</p>
              <p className="text-xs mt-2" style={{ color: appColors.textSecondary }}>
                Si tarda mucho, intenta recargar la página
              </p>
            </div>
          ) : filteredClients.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="mb-4" style={{ color: appColors.textSecondary }}>
                {clients.length === 0 
                  ? "No hay pacientes registrados. Haz clic en 'Nuevo Paciente' para comenzar." 
                  : "No se encontraron pacientes con los filtros aplicados"}
              </p>
            </div>
          ) : (
            filteredClients.map((client, index) => (
              <div
                key={client.id}
                className="border-2 rounded-lg p-3 sm:p-4 transition-all cursor-pointer group relative hover:scale-[1.02] sm:hover:scale-105 active:scale-95"
                style={{
                  backgroundColor: appColors.cardBackground,
                  borderColor: appColors.border,
                }}
                onClick={() => handleViewClient(client)}
              >
                <div className="flex flex-col items-center gap-2 sm:gap-2">
                  <div className="w-full aspect-square rounded-lg overflow-hidden" style={{ backgroundColor: appColors.secondary }}>
                    <img
                      src={client.photo}
                      alt={client.petName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="text-center text-base sm:text-lg line-clamp-1" style={{ color: appColors.textPrimary }}>{client.petName}</h3>
                  <p className="opacity-70 text-center text-sm no-underline italic line-clamp-1" style={{ color: appColors.textSecondary }}>{client.ownerName}</p>
                  <div 
                    className="mt-1 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm text-center w-fit"
                    style={{
                      backgroundColor: getSpeciesBadgeColor(client.species),
                      color: appColors.textOnColor,
                    }}
                  >
                    {client.species.charAt(0).toUpperCase() + client.species.slice(1)}
                  </div>
                  {client.breed && (
                    <p className="text-center mt-1 sm:mt-2 text-sm line-clamp-1" style={{ color: appColors.textPrimary }}>{client.breed}</p>
                  )}
                  

                </div>
              </div>
            ))
          )}
        </div>

        {/* Dialog para crear/editar */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingClient ? "Editar Paciente" : "Nuevo Paciente"}
              </DialogTitle>
            </DialogHeader>
            <ClientForm
              client={editingClient}
              onSave={handleSaveClient}
              onCancel={handleCloseDialog}
            />
          </DialogContent>
        </Dialog>

        {/* Dialog de confirmación de eliminación */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción no se puede deshacer. Se eliminará permanentemente el
                paciente de la base de datos.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleConfirmDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Settings Dialog */}
        {userSettings && (
          <SettingsDialog
            open={showSettings}
            onClose={() => setShowSettings(false)}
            userSettings={userSettings}
            onUpdateSettings={handleUpdateSettings}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}
