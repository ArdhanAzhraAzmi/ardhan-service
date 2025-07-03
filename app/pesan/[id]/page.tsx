"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Home, Loader2 } from "lucide-react";
import Link from "next/link";

export default function FormPesanPage() {
  const params = useParams();
  const router = useRouter();
  const layananId = params.id;

  const [layanan, setLayanan] = useState<any>(null);
  const [formData, setFormData] = useState({
    alamat: "",
    catatan: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Fetch service details
  useEffect(() => {
    const fetchLayanan = async () => {
      try {
        const res = await fetch(`/api/layanan/${layananId}`);
        if (!res.ok) throw new Error("Gagal memuat layanan");
        const data = await res.json();
        setLayanan(data);
      } catch (err) {
        console.error("Error loading service:", err);
        setError("Gagal memuat detail layanan");
      }
    };

    fetchLayanan();
  }, [layananId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      alert("Silakan login kembali.");
      return router.push("/login-user");
    }

    try {
      const res = await fetch("/api/pemesanan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          layanan_id: layanan.id,
          nama_layanan: layanan.nama,
          user_email: userEmail,
          alamat: formData.alamat,
          catatan: formData.catatan,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Gagal membuat pesanan");
      }

      setIsSuccess(true);
      // Auto redirect after 3 seconds
      setTimeout(() => router.push("/"), 3000);
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat memproses pesanan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (!layanan) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
      </div>
    );
  }

  
  if (isSuccess) {
    return (
      <div className="max-w-md mx-auto mt-20 bg-white p-8 rounded-lg shadow-md text-center">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h2 className="text-2xl font-bold mb-2">Pesanan Berhasil!</h2>
        <p className="text-gray-600 mb-6">
          Pesanan untuk {layanan.nama} telah berhasil dibuat. Kami akan segera
          menghubungi Anda.
        </p>
        <div className="flex flex-col space-y-3">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
          >
            <Home size={18} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  //Form Pesanan

  return (
    <div className="max-w-lg mx-auto my-10 bg-white p-6 shadow-lg rounded-lg">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 transition duration-200"
        >
          <ArrowLeft size={18} className="mr-1" />
          Kembali
        </button>
      </div>

      <div className="flex items-start mb-6">
        <div className="mr-4">
          <img
            src={layanan.gambar}
            alt={layanan.nama}
            className="w-20 h-20 object-cover rounded-lg shadow-md"
          />
        </div>
        <div>
          <h2 className="text-xl font-bold text-gray-800">Pesan Layanan</h2>
          <p className="text-lg font-semibold text-blue-600">{layanan.nama}</p>
          <p className="text-gray-600">
            Rp {layanan.harga.toLocaleString("id-ID")}
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="alamat"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Alamat Lengkap
          </label>
          <input
            type="text"
            id="alamat"
            name="alamat"
            value={formData.alamat}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border text-black border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            placeholder="Contoh: Jl. Contoh No. 123, Kota"
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Mohon masukkan alamat lengkap termasuk nomor rumah dan RT/RW
          </p>
        </div>

        <div>
          <label
            htmlFor="catatan"
            className="block text-sm text-black font-medium text-gray-700 mb-1"
          >
            Catatan Tambahan (Opsional)
          </label>
          <textarea
            id="catatan"
            name="catatan"
            value={formData.catatan}
            onChange={handleInputChange}
            className="w-full px-4 py-2 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
            rows={4}
            placeholder="Contoh: Laptop tidak bisa menyala, ada bunyi beep saat dinyalakan"
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex justify-center items-center py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                Memproses...
              </>
            ) : (
              "Konfirmasi Pesanan"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
