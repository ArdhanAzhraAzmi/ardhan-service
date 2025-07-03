"use client";
import { useEffect, useState } from "react";
import { 
  Loader2, 
  ShoppingBag, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Calendar,
  MapPin,
  MessageSquare,
  Eye,
  Edit,
  Printer
} from "lucide-react";

type Pesanan = {
  id: number;
  nama_layanan: string;
  status: string;
  created_at: string;
  alamat: string;
  catatan: string;
};

export default function PesananUserPage() {
  const [pesanan, setPesanan] = useState<Pesanan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPesanan, setSelectedPesanan] = useState<Pesanan | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("userEmail")?.trim().toLowerCase();
    if (!email) return;

    const fetchPesanan = async () => {
      try {
        const res = await fetch(`/api/pemesanan/user?email=${email}`);
        const data = await res.json();
        setPesanan(data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPesanan();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const handleLihatDetail = (pesanan: Pesanan) => {
    setSelectedPesanan(pesanan);
  };

  const handleCetakInvoice = (pesanan: Pesanan) => {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${pesanan.nama_layanan}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .invoice-header { 
                text-align: center; 
                margin-bottom: 20px;
                padding-bottom: 10px;
                border-bottom: 2px solid #3b82f6;
              }
              .invoice-details { margin: 20px 0; }
              .detail-item { 
                display: flex; 
                margin-bottom: 8px;
              }
              .detail-label { 
                font-weight: bold; 
                min-width: 120px;
              }
              .footer {
                margin-top: 30px;
                text-align: center;
                font-size: 12px;
                color: #666;
              }
              @media print {
                body { padding: 0; }
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="invoice-header">
              <h1 style="color: #3b82f6;">INVOICE</h1>
              <p>No. INV-${pesanan.id.toString().padStart(5, '0')}</p>
            </div>
            
            <div class="invoice-details">
              <div class="detail-item">
                <span class="detail-label">Layanan:</span>
                <span>${pesanan.nama_layanan}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Tanggal:</span>
                <span>${new Date(pesanan.created_at).toLocaleDateString('id-ID')}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Status:</span>
                <span style="text-transform: capitalize;">${pesanan.status}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Alamat:</span>
                <span>${pesanan.alamat}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">Catatan:</span>
                <span>${pesanan.catatan || "-"}</span>
              </div>
            </div>
            
            <div class="footer">
              <p>Terima kasih telah menggunakan layanan kami</p>
              <p>Invoice ini dicetak pada ${new Date().toLocaleString()}</p>
            </div>
            
            <button 
              onclick="window.print()"
              style="
                background: #3b82f6;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                margin-top: 20px;
              "
            >
              Cetak Invoice
            </button>
            
            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
        <div className="flex items-center p-6 bg-white rounded-xl shadow-sm">
          <Loader2 className="animate-spin h-8 w-8 text-blue-600" />
          <span className="ml-3 text-gray-700 text-lg">Memuat data pesanan...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-6 min-h-screen bg-gray-50">
      {/* Modal Detail Pesanan */}
      {selectedPesanan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4 text-gray-800">Detail Pesanan</h2>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">Layanan</p>
                <p className="font-medium text-gray-800">{selectedPesanan.nama_layanan}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <div className="flex items-center">
                  {getStatusIcon(selectedPesanan.status)}
                  <span className="ml-2 capitalize text-gray-800">
                    {selectedPesanan.status}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Tanggal Pesanan</p>
                <p className="text-gray-800">
                  {new Date(selectedPesanan.created_at).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Alamat</p>
                <p className="text-gray-800">{selectedPesanan.alamat}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500 mb-1">Catatan</p>
                <p className="text-gray-800 italic">
                  {selectedPesanan.catatan || "Tidak ada catatan"}
                </p>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setSelectedPesanan(null)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center mb-8 p-5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg">
        <div className="p-2 bg-white/20 rounded-lg">
          <ShoppingBag className="h-7 w-7 text-white" />
        </div>
        <div className="ml-4">
          <h1 className="text-2xl font-bold text-white">Pesanan Anda</h1>
          <p className="text-blue-100 text-sm mt-1">
            {pesanan.length} {pesanan.length === 1 ? 'pesanan' : 'pesanan'} ditemukan
          </p>
        </div>
      </div>

      {/* Konten Utama */}
      {pesanan.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-4">
            <ShoppingBag className="h-10 w-10 text-blue-500" />
          </div>
          <h3 className="mt-3 text-xl font-semibold text-gray-800">Belum ada pesanan</h3>
          <p className="mt-2 text-gray-500 max-w-md mx-auto">
            Mulai buat pesanan pertama Anda dan kami akan menampilkannya di sini
          </p>
          <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white rounded-lg shadow-md hover:shadow-lg transition-all">
            Jelajahi Layanan
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {pesanan.map((p) => (
            <div 
              key={p.id}
              className="border border-gray-200 rounded-xl p-6 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <ShoppingBag className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-gray-800">
                        {p.nama_layanan}
                      </h2>
                      <p className="text-sm text-gray-500 flex items-center gap-1.5 mt-1">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        {new Date(p.created_at).toLocaleDateString("id-ID", {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                    p.status === 'approved' ? 'bg-green-100 text-green-800' :
                    p.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    p.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  } flex items-center`}>
                    {getStatusIcon(p.status)}
                    <span className="ml-1.5 capitalize">{p.status}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <MapPin className="h-4 w-4 text-blue-500" />
                    Alamat Pengiriman
                  </h3>
                  <p className="text-gray-700">{p.alamat}</p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider flex items-center gap-1.5 mb-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    Catatan Khusus
                  </h3>
                  <p className="text-gray-700 italic">
                    {p.catatan || "Tidak ada catatan tambahan"}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={() => handleLihatDetail(p)}
                  className="px-4 py-2 border border-blue-500 text-blue-500 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-1.5"
                >
                  <Eye className="h-4 w-4" />
                  Lihat Detail
                </button>
                
                {p.status === 'pending' && (
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-1.5">
                    <Edit className="h-4 w-4" />
                    Ubah Pesanan
                  </button>
                )}
                
                {p.status !== 'rejected' && (
                  <button
                    onClick={() => handleCetakInvoice(p)}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                  >
                    <Printer className="h-4 w-4" />
                    Cetak Invoice
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}