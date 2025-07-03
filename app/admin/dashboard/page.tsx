"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Edit,
  Plus,
  LogOut,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Eye,
  Users,
  Search,
  ChevronDown,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

type Layanan = {
  id: number;
  nama: string;
  deskripsi: string;
  harga: number;
  gambar: string;
};

type Pesanan = {
  id: number;
  layanan_id: number;
  nama_layanan: string;
  user_email: string;
  alamat: string;
  catatan: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
};

type Users = {
  id: number;
  nama: string;
  email: string;
  created_at: string;
};

export default function AdminDashboardPage() {
  const [activeTab, setActiveTab] = useState<"layanan" | "pesanan" | "pengguna">("layanan");
  const router = useRouter();

  // Common state
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Layanan state
  const [layanan, setLayanan] = useState<Layanan[]>([]);
  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    harga: "" as number | string,
    gambar: null as File | null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);

  // Layanan edit modal
  const [editLayananData, setEditLayananData] = useState<Layanan | null>(null);
  const [showLayananEditModal, setShowLayananEditModal] = useState(false);
  const [editPreviewImage, setEditPreviewImage] = useState<string | null>(null);
  const editFileInputRef = useRef<HTMLInputElement>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Pesanan state
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPesanan, setSelectedPesanan] = useState<Pesanan | null>(null);
  const [showPesananDetailModal, setShowPesananDetailModal] = useState(false);

  // Pengguna state
  const [pengguna, setPengguna] = useState<Pengguna[]>([]);
  const [isDeletingUser, setIsDeletingUser] = useState<number | null>(null);
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [selectedLayanan, setSelectedLayanan] = useState<Layanan | null>(null);
  const [showLayananDetailModal, setShowLayananDetailModal] = useState(false);

  // Fetch data based on active tab
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    setError(null);

    const fetchData = async () => {
      try {
        if (activeTab === "layanan") {
          const res = await fetch("/api/layanan");
          if (!res.ok) throw new Error(`Failed to fetch layanan: ${res.statusText}`);
          const data = await res.json();
          setLayanan(data);
        } else if (activeTab === "pesanan") {
          const res = await fetch("/api/pemesanan");
          if (!res.ok) throw new Error(`Failed to fetch pesanan: ${res.statusText}`);
          const data = await res.json();
          setPesanan(data);
        } else if (activeTab === "pengguna") {
          const res = await fetch("/api/users");
          if (!res.ok) throw new Error(`Failed to fetch pengguna: ${res.statusText}`);
          const data = await res.json();
          setPengguna(data);
        }
      } catch (err: any) {
        setError(err.message || "Failed to load data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, router]);

  // Layanan functions
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "harga" ? (value === "" ? "" : Number(value)) : value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData((prev) => ({ ...prev, gambar: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTambahLayanan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.gambar) {
      setError("Silakan pilih gambar layanan.");
      return;
    }

    setIsAdding(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama", formData.nama);
      formDataToSend.append("deskripsi", formData.deskripsi);
      formDataToSend.append("harga", formData.harga.toString());
      formDataToSend.append("gambar", formData.gambar);

      const res = await fetch("/api/layanan", {
        method: "POST",
        body: formDataToSend,
      });

      if (!res.ok) throw new Error("Gagal menambahkan layanan");

      const updated = await fetch("/api/layanan");
      const data = await updated.json();
      setLayanan(data);
      setFormData({
        nama: "",
        deskripsi: "",
        harga: "",
        gambar: null,
      });
      setPreviewImage(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteLayanan = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus layanan ini?")) return;

    setIsDeleting(id);
    try {
      const res = await fetch(`/api/layanan/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Gagal menghapus layanan");
      setLayanan((prev) => prev.filter((item) => item.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeleting(null);
    }
  };

  const handleViewLayananDetails = (layanan: Layanan) => {
    setSelectedLayanan(layanan);
    setShowLayananDetailModal(true);
  };

  const handleOpenLayananEditModal = (layanan: Layanan) => {
    setEditLayananData(layanan);
    setEditPreviewImage(layanan.gambar);
    setShowLayananEditModal(true);
  };

  const handleEditInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEditLayananData((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        [name]: name === "harga" ? (value === "" ? "" : Number(value)) : value,
      };
    });
  };

  const handleEditImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditLayananData((prev) => ({ ...prev!, gambar: file as any }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpdateLayanan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editLayananData) return;

    setIsUpdating(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama", editLayananData.nama);
      formDataToSend.append("deskripsi", editLayananData.deskripsi);
      formDataToSend.append("harga", editLayananData.harga.toString());

      if (editLayananData.gambar instanceof File) {
        formDataToSend.append("gambar", editLayananData.gambar);
      } else {
        formDataToSend.append("gambar_url_existing", editLayananData.gambar);
      }

      const res = await fetch(`/api/layanan/${editLayananData.id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!res.ok) throw new Error("Gagal memperbarui layanan");

      const updated = await fetch("/api/layanan");
      const data = await updated.json();
      setLayanan(data);
      setShowLayananEditModal(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Pesanan functions
  const handleUpdateStatus = async (
    id: number,
    status: "approved" | "rejected"
  ) => {
    try {
      const res = await fetch(`/api/pemesanan/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error("Gagal memperbarui status");
      setPesanan((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status } : p))
      );
    } catch (err: any) {
      setError(err.message);
    }
  };

  const filteredPesanan = pesanan.filter(
    (p) =>
      p.nama_layanan.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPengguna = pengguna.filter(
    (user) =>
      user.nama.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const handleViewPesananDetails = (pesanan: Pesanan) => {
    setSelectedPesanan(pesanan);
    setShowPesananDetailModal(true);
  };

  // Pengguna functions
  const handleDeleteUser = async (id: number) => {
    if (!confirm("Yakin ingin menghapus pengguna ini?")) return;
    setIsDeletingUser(id);

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Gagal menghapus pengguna");
      setPengguna((prev) => prev.filter((u) => u.id !== id));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsDeletingUser(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/");
  };

   return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 font-sans antialiased text-gray-100">
      {/* Futuristic Header */}
      <header className="bg-gray-800/50 backdrop-blur-lg border-b border-gray-700/50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-2 rounded-lg">
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
              Dashboard
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white py-2 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-red-500/20"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      {/* Holographic Tabs */}
      <div className="max-w-7xl mx-auto px-4 pt-6">
        <div className="flex space-x-1 bg-gray-800/50 rounded-xl p-1 backdrop-blur-sm border border-gray-700/50 shadow-inner">
          {(["layanan", "pesanan", "pengguna"] as const).map((tab) => (
            <button
              key={tab}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-300 ${
                activeTab === tab
                  ? "bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-400 shadow-lg"
                  : "text-gray-400 hover:text-white hover:bg-gray-700/50"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "layanan" && "Manajemen Layanan"}
              {tab === "pesanan" && "Manajemen Pesanan"}
              {tab === "pengguna" && "Manajemen Pengguna"}
            </button>
          ))}
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Notification Panel */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border-l-4 border-red-500 rounded-lg backdrop-blur-sm animate-pulse">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <XCircle className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-100">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="ml-auto -mx-1.5 -my-1.5 text-red-400 rounded-lg p-1.5 hover:text-red-300"
              >
                <XCircle className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}

        {activeTab === "layanan" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Add Service Card - Glass Morphism */}
            <div className="lg:col-span-1">
              <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-6 py-4 border-b border-gray-700/50">
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Plus className="text-blue-400" size={20} />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
                      Tambah Layanan Baru
                    </span>
                  </h2>
                </div>
                <div className="p-6">
                  <form onSubmit={handleTambahLayanan} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nama Layanan
                      </label>
                      <input
                        type="text"
                        name="nama"
                        value={formData.nama}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300"
                        placeholder="Nama layanan"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Deskripsi
                      </label>
                      <textarea
                        name="deskripsi"
                        value={formData.deskripsi}
                        onChange={handleInputChange}
                        required
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300"
                        placeholder="Deskripsi layanan"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Harga (Rp)
                      </label>
                      <input
                        type="number"
                        name="harga"
                        value={formData.harga}
                        onChange={handleInputChange}
                        required
                        min="0"
                        className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300"
                        placeholder="Harga layanan"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Gambar Layanan
                      </label>
                      <div
                        className="border-2 border-dashed border-gray-600/50 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500/50 transition-all duration-300 bg-gray-700/30"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {previewImage ? (
                          <div className="relative group overflow-hidden rounded-md">
                            <img
                              src={previewImage}
                              alt="Preview"
                              className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <ImageIcon className="w-8 h-8 text-white animate-pulse" />
                            </div>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center justify-center py-4">
                            <div className="p-3 bg-gray-700/50 rounded-full mb-2">
                              <ImageIcon className="w-6 h-6 text-blue-400" />
                            </div>
                            <p className="text-sm text-gray-300">
                              Klik untuk upload gambar
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              Format: JPG, PNG (Max 2MB)
                            </p>
                          </div>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                          required
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={isAdding}
                      className="w-full flex justify-center items-center py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-blue-500/20 mt-2"
                    >
                      {isAdding ? (
                        <>
                          <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                          Menambahkan...
                        </>
                      ) : (
                        <>
                          <Plus className="mr-2" size={18} />
                          Tambah Layanan
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Services List - Card Grid */}
            <div className="lg:col-span-2">
              <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-6 py-4 border-b border-gray-700/50 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-white">
                    Daftar Layanan ({layanan.length})
                  </h2>
                </div>
                <div className="p-6">
                  {isLoading ? (
                    <div className="flex justify-center py-12">
                      <Loader2 className="animate-spin h-10 w-10 text-blue-400" />
                    </div>
                  ) : layanan.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="mx-auto w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                        <ImageIcon className="w-8 h-8 text-blue-400" />
                      </div>
                      <h3 className="text-lg font-medium text-white">
                        Belum ada layanan
                      </h3>
                      <p className="mt-2 text-gray-400">
                        Tambahkan layanan baru menggunakan form di samping
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {layanan.map((item) => (
                        <div
                          key={item.id}
                          className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/30 hover:border-blue-500/50 transition-all duration-300 group"
                        >
                          <div className="flex items-start gap-4">
                            <div className="relative overflow-hidden rounded-lg w-20 h-20 flex-shrink-0">
                              <img
                                src={item.gambar}
                                alt={item.nama}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="text-lg font-semibold text-white truncate">
                                {item.nama}
                              </h3>
                              <p className="text-sm text-gray-400 line-clamp-2">
                                {item.deskripsi}
                              </p>
                              <p className="mt-2 text-lg font-bold text-blue-400">
                                Rp {item.harga.toLocaleString("id-ID")}
                              </p>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 mt-4">
                            <button
                              onClick={() => handleViewLayananDetails(item)}
                              className="p-2 bg-gray-600/50 hover:bg-gray-500/50 rounded-lg transition-colors duration-300 text-blue-400 hover:text-blue-300"
                              title="Lihat Detail"
                            >
                              <Eye size={18} />
                            </button>
                            <button
                              onClick={() => handleOpenLayananEditModal(item)}
                              className="p-2 bg-gray-600/50 hover:bg-gray-500/50 rounded-lg transition-colors duration-300 text-indigo-400 hover:text-indigo-300"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteLayanan(item.id)}
                              disabled={isDeleting === item.id}
                              className="p-2 bg-gray-600/50 hover:bg-gray-500/50 rounded-lg transition-colors duration-300 text-red-400 hover:text-red-300"
                              title="Hapus"
                            >
                              {isDeleting === item.id ? (
                                <Loader2 className="animate-spin h-4 w-4" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : activeTab === "pesanan" ? (
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-6 py-4 border-b border-gray-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="text-lg font-bold text-white">
                Daftar Pesanan ({pesanan.length})
              </h2>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Cari pesanan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 w-full md:w-64 transition-all duration-300"
                />
              </div>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin h-10 w-10 text-blue-400" />
                </div>
              ) : filteredPesanan.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                    <ImageIcon className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">
                    {searchTerm ? "Pesanan tidak ditemukan" : "Belum ada pesanan"}
                  </h3>
                  <p className="mt-2 text-gray-400">
                    {searchTerm ? "Coba dengan kata kunci lain" : "Semua pesanan akan muncul di sini"}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredPesanan.map((p) => (
                    <div
                      key={p.id}
                      className={`p-4 rounded-lg border transition-all duration-300 hover:shadow-lg ${
                        p.status === "approved"
                          ? "bg-green-900/20 border-green-700/50 hover:shadow-green-500/10"
                          : p.status === "rejected"
                          ? "bg-red-900/20 border-red-700/50 hover:shadow-red-500/10"
                          : "bg-gray-700/30 border-gray-600/50 hover:shadow-blue-500/10"
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Layanan</p>
                          <p className="font-medium text-white">{p.nama_layanan}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Pelanggan</p>
                          <p className="font-medium text-white">{p.user_email}</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Status</p>
                          <div className="flex items-center gap-2">
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                p.status === "approved"
                                  ? "bg-green-900/50 text-green-300"
                                  : p.status === "rejected"
                                  ? "bg-red-900/50 text-red-300"
                                  : "bg-yellow-900/50 text-yellow-300"
                              }`}
                            >
                              {p.status === "approved"
                                ? "Disetujui"
                                : p.status === "rejected"
                                ? "Ditolak"
                                : "Menunggu"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(p.created_at).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex justify-between items-end">
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">Alamat</p>
                          <p className="font-medium text-white">{p.alamat}</p>
                        </div>
                        <button
                          onClick={() => handleViewPesananDetails(p)}
                          className="flex items-center gap-1.5 bg-gray-600/50 hover:bg-gray-500/50 text-white px-3.5 py-1.5 rounded-lg text-sm transition-all duration-300"
                        >
                          <Eye size={14} />
                          <span>Detail</span>
                        </button>
                      </div>

                      {p.status === "pending" && (
                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleUpdateStatus(p.id, "approved")}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-green-600/80 hover:bg-green-500 text-white px-3.5 py-2 rounded-lg text-sm transition-all duration-300"
                          >
                            <CheckCircle2 size={14} />
                            <span>Setujui</span>
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(p.id, "rejected")}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-red-600/80 hover:bg-red-500 text-white px-3.5 py-2 rounded-lg text-sm transition-all duration-300"
                          >
                            <XCircle size={14} />
                            <span>Tolak</span>
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-gray-800/50 backdrop-blur-md rounded-xl shadow-2xl border border-gray-700/50 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 px-6 py-4 border-b border-gray-700/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Users className="text-blue-400" size={20} />
                <h2 className="text-lg font-bold text-white">
                  Daftar Pengguna ({pengguna.length})
                </h2>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-3 text-gray-400">
                  <Search className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  placeholder="Cari pengguna..."
                  value={userSearchTerm}
                  onChange={(e) => setUserSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2.5 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 w-full md:w-64 transition-all duration-300"
                />
              </div>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="animate-spin h-10 w-10 text-blue-400" />
                </div>
              ) : filteredPengguna.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-blue-400" />
                  </div>
                  <h3 className="text-lg font-medium text-white">
                    {userSearchTerm ? "Pengguna tidak ditemukan" : "Belum ada pengguna"}
                  </h3>
                  <p className="mt-2 text-gray-400">
                    {userSearchTerm ? "Coba dengan kata kunci lain" : "Semua pengguna akan muncul di sini"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700/50">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          ID
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Nama
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Bergabung
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700/50">
                      {filteredPengguna.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-700/30 transition-colors duration-300">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {user.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">
                              {user.nama}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              disabled={isDeletingUser === user.id}
                              className="p-2 bg-gray-600/50 hover:bg-red-500/30 rounded-lg transition-colors duration-300 text-red-400 hover:text-red-300"
                              title="Hapus"
                            >
                              {isDeletingUser === user.id ? (
                                <Loader2 className="animate-spin h-4 w-4" />
                              ) : (
                                <Trash2 size={18} />
                              )}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Futuristic Modals */}
      {/* Layanan Detail Modal */}
      {showLayananDetailModal && selectedLayanan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700/50 w-full max-w-md mx-auto transform transition-all duration-300 scale-95 hover:scale-100">
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-xl font-bold text-white">
                Detail Layanan
              </h3>
            </div>
            <div className="p-6">
              {selectedLayanan.gambar && (
                <div className="relative overflow-hidden rounded-xl mb-6 h-48">
                  <img
                    src={selectedLayanan.gambar}
                    alt={selectedLayanan.nama}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-400">Nama</p>
                  <p className="text-lg font-semibold text-white">
                    {selectedLayanan.nama}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Deskripsi</p>
                  <p className="text-gray-300">{selectedLayanan.deskripsi}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Harga</p>
                  <p className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-300">
                    Rp {selectedLayanan.harga.toLocaleString("id-ID")}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-700/50 border-t border-gray-700/50 flex justify-end">
              <button
                onClick={() => setShowLayananDetailModal(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Layanan Edit Modal */}
      {showLayananEditModal && editLayananData && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700/50 w-full max-w-md mx-auto my-8 transform transition-all duration-300 scale-95 hover:scale-100">
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-xl font-bold text-white">
                Edit Layanan: {editLayananData.nama}
              </h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleUpdateLayanan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nama Layanan
                  </label>
                  <input
                    type="text"
                    name="nama"
                    value={editLayananData.nama}
                    onChange={handleEditInputChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    name="deskripsi"
                    value={editLayananData.deskripsi}
                    onChange={handleEditInputChange}
                    required
                    rows={3}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Harga (Rp)
                  </label>
                  <input
                    type="number"
                    name="harga"
                    value={editLayananData.harga}
                    onChange={handleEditInputChange}
                    required
                    min="0"
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Gambar Layanan
                  </label>
                  <div
                    className="border-2 border-dashed border-gray-600/50 rounded-lg p-4 text-center cursor-pointer hover:border-blue-500/50 transition-all duration-300 bg-gray-700/30"
                    onClick={() => editFileInputRef.current?.click()}
                  >
                    {editPreviewImage ? (
                      <div className="relative group overflow-hidden rounded-md">
                        <img
                          src={editPreviewImage}
                          alt="Preview"
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <ImageIcon className="w-8 h-8 text-white animate-pulse" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-4">
                        <div className="p-3 bg-gray-700/50 rounded-full mb-2">
                          <ImageIcon className="w-6 h-6 text-blue-400" />
                        </div>
                        <p className="text-sm text-gray-300">
                          Klik untuk upload gambar baru
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Format: JPG, PNG (Max 2MB)
                        </p>
                      </div>
                    )}
                    <input
                      type="file"
                      ref={editFileInputRef}
                      onChange={handleEditImageChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowLayananEditModal(false)}
                    className="bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-blue-500/20"
                  >
                    {isUpdating ? (
                      <>
                        <Loader2 className="animate-spin h-5 w-5" />
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan Perubahan"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Pesanan Detail Modal */}
      {showPesananDetailModal && selectedPesanan && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700/50 w-full max-w-lg mx-auto">
            <div className="p-6 border-b border-gray-700/50">
              <h3 className="text-xl font-bold text-white">
                Detail Pesanan
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-400">Layanan</p>
                  <p className="text-lg font-semibold text-white">
                    {selectedPesanan.nama_layanan}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Email Pelanggan
                  </p>
                  <p className="text-gray-300">{selectedPesanan.user_email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Alamat</p>
                  <p className="text-gray-300">{selectedPesanan.alamat}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Catatan</p>
                  <p className="text-gray-300">
                    {selectedPesanan.catatan || "-"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">Status</p>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedPesanan.status === "approved"
                        ? "bg-green-900/50 text-green-300"
                        : selectedPesanan.status === "rejected"
                        ? "bg-red-900/50 text-red-300"
                        : "bg-yellow-900/50 text-yellow-300"
                    }`}
                  >
                    {selectedPesanan.status === "approved"
                      ? "Disetujui"
                      : selectedPesanan.status === "rejected"
                      ? "Ditolak"
                      : "Menunggu"}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-400">
                    Waktu Pemesanan
                  </p>
                  <p className="text-gray-300">
                    {new Date(selectedPesanan.created_at).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            <div className="p-4 bg-gray-700/50 border-t border-gray-700/50 flex justify-end">
              <button
                onClick={() => setShowPesananDetailModal(false)}
                className="bg-gray-600 hover:bg-gray-500 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-300"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Futuristic Footer */}
      <footer className="mt-12 py-8 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Ardhan Computer. All rights reserved.
          </div>
          <div className="mt-2 flex justify-center space-x-4">
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-50" />
            <div className="text-xs text-gray-600">Powered by Next.js</div>
            <div className="h-px w-8 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
          </div>
        </div>
      </footer>
    </div>
  );
}