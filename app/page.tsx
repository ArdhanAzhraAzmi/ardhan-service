"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Head from "next/head";

type Layanan = {
  id: number;
  nama: string;
  deskripsi: string;
  harga: number;
  gambar: string;
};

export default function HomePage() {
  const [layanan, setLayanan] = useState<Layanan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchLayanan = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/layanan");
        if (!res.ok) {
          throw new Error(`Failed to fetch services: ${res.statusText}`);
        }
        const data = await res.json();
        setLayanan(data);
      } catch (err: any) {
        setError(err.message || "Gagal memuat layanan.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLayanan();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans antialiased text-gray-800">
      <Head>
        <title>
          Ardhan Service Computer | Solusi Servis Komputer Terpercaya
        </title>
        <meta
          name="description"
          content="Layanan servis komputer profesional dengan kualitas terbaik dan harga terjangkau"
        />
      </Head>

      <Navbar />

      {/* Modern Hero Section with Image Background */}
      <header className="relative h-screen max-h-[800px] overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src="/header.jpg" // Replace with your actual image path
            alt="Computer repair service"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 text-white leading-tight">
              <span className="block">Perbaikan Komputer</span>
              <span className="block text-blue-400">Profesional</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200 mb-10">
              Solusi cepat dan terpercaya untuk semua masalah komputer Anda. Teknisi ahli siap membantu 24/7.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button
                onClick={() =>
                  document
                    .getElementById("layanan")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105"
              >
                Lihat Layanan Kami
              </button>
              <button
                onClick={() => router.push("/kontak")}
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
              >
                Hubungi Kami
              </button>
            </div>
          </div>
        </div>

        {/* Scrolling Indicator */}
        <div className="absolute bottom-10 left-0 right-0 flex justify-center z-10">
          <button
            onClick={() =>
              document
                .getElementById("about")
                ?.scrollIntoView({ behavior: "smooth" })
            }
            className="animate-bounce p-2 rounded-full bg-white/20 backdrop-blur-sm"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              ></path>
            </svg>
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* About Us Section */}
        <section id="about" className="mb-20">
          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 lg:p-16 relative overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-100 rounded-full opacity-10"></div>
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-100 rounded-full opacity-10"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col md:flex-row gap-12 items-center">
                <div className="md:w-1/2">
                  <img 
                    src="/teknisi.jpg" 
                    alt="Technician working" 
                    className="rounded-2xl shadow-lg w-full h-auto"
                  />
                </div>
                <div className="md:w-1/2">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-1 bg-blue-500 mr-4"></div>
                    <h2 className="text-2xl font-semibold text-gray-700">
                      Tentang Kami
                    </h2>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                    Solusi Teknologi <span className="text-blue-600">Terbaik</span> untuk Bisnis & Rumah
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed mb-8">
                    Ardhan Service Computer telah melayani pelanggan sejak 2010 dengan komitmen untuk memberikan solusi terbaik bagi semua masalah teknologi Anda. Tim ahli kami memiliki sertifikasi profesional dan pengalaman luas di bidang perbaikan komputer.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="font-medium">Garansi 30 Hari</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="font-medium">Teknisi Bersertifikat</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="font-medium">Diagnosa Gratis</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                      <span className="font-medium">Layanan Darurat</span>
                    </div>
                  </div>
                  <button
                    onClick={() => router.push("/tentang")}
                    className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
                  >
                    Pelajari Lebih Lanjut
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="layanan" className="mb-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Layanan <span className="text-blue-600">Profesional</span> Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Berbagai solusi komprehensif untuk semua kebutuhan perawatan dan perbaikan perangkat teknologi Anda
            </p>
          </div>

          {/* Error Display */}
          {error && (
            <div className="max-w-2xl mx-auto mb-10">
              <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      Gagal memuat data
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>{error}</p>
                    </div>
                    <div className="mt-4">
                      <button
                        onClick={() => setError(null)}
                        className="text-sm font-medium text-red-700 hover:text-red-600 focus:outline-none"
                      >
                        Tutup
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-8 w-8 text-blue-500"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span className="text-lg font-medium text-gray-600">
                  Memuat daftar layanan...
                </span>
              </div>
            </div>
          ) : layanan.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">
                Belum ada layanan tersedia
              </h3>
              <p className="mt-1 text-gray-500">Silakan coba lagi nanti.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {layanan.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ease-in-out transform hover:-translate-y-2 group"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={item.gambar}
                      alt={item.nama}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="inline-block bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                        Rp {item.harga.toLocaleString("id-ID")}
                      </span>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                      {item.nama}
                    </h3>
                    <p className="text-gray-600 mb-6 line-clamp-3">
                      {item.deskripsi}
                    </p>
                    <button
                      onClick={() => {
                        const role = localStorage.getItem("userRole");
                        if (role === "user") {
                          router.push(`/pesan/${item.id}`);
                        } else {
                          alert("Silakan login terlebih dahulu untuk memesan.");
                          router.push("/login-user");
                        }
                      }}
                      className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-3 px-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-md hover:shadow-lg"
                    >
                      Pesan Sekarang
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section className="mb-20">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-12 text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0 bg-[url('/pattern-white.svg')] bg-[length:100px_100px]"></div>
            </div>
            <div className="relative z-10">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">5+</div>
                  <div className="text-lg opacity-90">Tahun Pengalaman</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">5K+</div>
                  <div className="text-lg opacity-90">Pelanggan Puas</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">98%</div>
                  <div className="text-lg opacity-90">Kepuasan Pelanggan</div>
                </div>
                <div>
                  <div className="text-4xl md:text-5xl font-bold mb-2">24/7</div>
                  <div className="text-lg opacity-90">Layanan Darurat</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="mb-20">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              Apa Kata <span className="text-blue-600">Pelanggan</span> Kami
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Testimoni dari pelanggan yang telah menggunakan layanan kami
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Windah Basudara",
                role: "Youtuber",
                avatar: "/avatar-1.jpg",
                content: "Layanan sangat cepat dan profesional. Komputer saya yang rusak parah bisa diperbaiki dalam waktu 2 hari saja. Sangat direkomendasikan!",
                rating: 5
              },
              {
                name: "Haraldarkan",
                role: "Pembalap",
                avatar: "/avatar-2.jpg",
                content: "Teknisinya sangat ahli dan ramah. Harga transparan tanpa ada biaya tambahan yang tidak jelas. Akan pakai layanan ini lagi.",
                rating: 5
              },
              {
                name: "Rudi Hermawan",
                role: "Mahasiswa",
                avatar: "/avatar-3.jpg",
                content: "Laptop saya terkena virus berat, tapi tim Ardhan bisa membersihkannya tanpa harus install ulang. Data saya semua aman. Terima kasih!",
                rating: 4
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-2xl shadow-lg">
                <div className="flex items-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-600 mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name} 
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="mb-20">
          <div className="bg-gray-900 rounded-3xl p-12 text-white overflow-hidden relative">
            <img 
              src="/cta.jpg" 
              alt="CTA Background" 
              className="absolute inset-0 w-full h-full object-cover opacity-20"
            />
            <div className="relative z-10">
              <div className="max-w-3xl mx-auto text-center">
                <h2 className="text-2xl md:text-3xl font-bold mb-6">
                  Siap Memperbaiki Masalah Komputer Anda?
                </h2>
                <p className="text-lg mb-8 opacity-90 max-w-2xl mx-auto">
                  Hubungi kami sekarang untuk konsultasi gratis atau buat janji temu dengan teknisi kami.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                  <button
                    onClick={() => router.push("/kontak")}
                    className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
                  >
                    Hubungi Kami
                  </button>
                  <button
                    onClick={() => router.push("/faq")}
                    className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
                  >
                    Tanya Jawab
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer Section */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">
                <span className="text-blue-400">Ardhan</span> Service
              </h3>
              <p className="mb-4">
                Solusi servis komputer profesional dengan kualitas terbaik dan harga terjangkau.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.597 0-2.917-.01-3.96-.058-.976-.045-1.505-.207-1.858-.344-.466-.182-.8-.398-1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.058-1.055.058-1.37.058-4.041v-.08c0-2.597.01-2.917.058-3.96.045-.976.207-1.505.344-1.858.182-.466.399-.8.748-1.15.35-.35.683-.566 1.15-.748.353-.137.882-.3 1.857-.344 1.023-.047 1.351-.058 3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <span className="sr-only">WhatsApp</span>
                  <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Layanan</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Perbaikan Hardware
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Instalasi Software
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Pembersihan Virus
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Upgrade Komputer
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Data Recovery
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Perusahaan</h3>
              <ul className="space-y-2">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tentang Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Tim Kami
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Testimoni
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Karir
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">Kontak</h3>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 mt-0.5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Jl Kelud Kota Bekasi</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>085156929136</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>ardhanazmi03@gmail.com</span>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Ardhan Service Computer. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Kebijakan Privasi
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Syarat Layanan
              </a>
              <a href="#" className="text-sm text-gray-400 hover:text-white transition-colors">
                Peta Situs
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}