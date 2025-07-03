"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import Head from "next/head";
import { Mail, Phone, MapPin, Send, CheckCircle2 } from "lucide-react";

export default function ContactPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitSuccess(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        message: ""
      });
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 font-sans antialiased text-gray-800">
      <Head>
        <title>Kontak Kami | Ardhan Service Computer</title>
        <meta
          name="description"
          content="Hubungi tim profesional kami untuk layanan perbaikan komputer terbaik"
        />
      </Head>

      <Navbar />

      {/* Hero Section */}
      <header className="relative bg-gray-900 h-96 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/contact-hero.jpg')] bg-cover bg-center opacity-50"></div>
        <div className="relative z-10 h-full flex items-center">
          <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
              Hubungi <span className="text-blue-400">Kami</span>
            </h1>
            <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200">
              Tim profesional kami siap membantu Anda dengan semua kebutuhan perbaikan komputer
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Contact Info Section */}
        <section className="mb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Mail className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Email Kami</h3>
              <p className="text-gray-600 mb-4">Kirim pertanyaan Anda melalui email</p>
              <a 
                href="mailto:ardhanazmi03@gmail.com" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ardhanazmi03@gmail.com
              </a>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <Phone className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Telepon Kami</h3>
              <p className="text-gray-600 mb-4">Hubungi kami untuk konsultasi cepat</p>
              <a 
                href="tel:+6285156929136" 
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                +62 851-5692-9136
              </a>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-6">
                <MapPin className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Lokasi Kami</h3>
              <p className="text-gray-600 mb-4">Kunjungi workshop kami</p>
              <p className="text-gray-800">
                Jl. Kelud Raya No. 123, Bekasi, Jawa Barat
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="mb-20">
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              <div className="p-8 md:p-12 lg:p-16">
                <div className="mb-10">
                  <div className="flex items-center mb-6">
                    <div className="w-12 h-1 bg-blue-500 mr-4"></div>
                    <h2 className="text-2xl font-semibold text-gray-700">
                      Kirim Pesan
                    </h2>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 leading-tight">
                    Punya Pertanyaan? <span className="text-blue-600">Hubungi Kami</span>
                  </h3>
                  <p className="text-lg text-gray-600 leading-relaxed">
                    Tim support kami akan menghubungi Anda dalam waktu 24 jam. 
                    Atau kunjungi workshop kami untuk layanan langsung.
                  </p>
                </div>

                {submitSuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <CheckCircle2 className="h-12 w-12 text-green-500" />
                    </div>
                    <h4 className="text-xl font-bold text-green-800 mb-2">
                      Pesan Terkirim!
                    </h4>
                    <p className="text-green-600">
                      Terima kasih telah menghubungi kami. Kami akan segera merespons pesan Anda.
                    </p>
                    <button
                      onClick={() => setSubmitSuccess(false)}
                      className="mt-6 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Kirim Pesan Lain
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Nama Lengkap
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Masukkan nama Anda"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="email@contoh.com"
                        />
                      </div>

                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                          Nomor Telepon
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                          placeholder="0812-3456-7890"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Pesan Anda
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        placeholder="Tulis pesan Anda di sini..."
                      ></textarea>
                    </div>

                    <div>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full flex justify-center items-center px-6 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-md hover:shadow-lg"
                      >
                        {isSubmitting ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Mengirim...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-5 w-5" />
                            Kirim Pesan
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="hidden lg:block bg-[url('/contact-map.jpg')] bg-cover bg-center relative">
                <div className="absolute inset-0 bg-gradient-to-t from-blue-600/80 to-blue-400/80 flex items-end p-12">
                  <div>
                    <h3 className="text-2xl font-bold text-white mb-4">Jam Operasional</h3>
                    <ul className="space-y-3 text-white">
                      <li className="flex justify-between">
                        <span>Senin - Jumat</span>
                        <span>08:00 - 17:00</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Sabtu</span>
                        <span>09:00 - 15:00</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Minggu</span>
                        <span>Libur</span>
                      </li>
                    </ul>
                    <div className="mt-8">
                      <button
                        onClick={() => router.push("/layanan")}
                        className="px-6 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Lihat Layanan Kami
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="mb-20">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.317239755586!2d106.8456823152949!3d-6.352966563736864!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69ec1a9a9b9a1b%3A0x9b9b9b9b9b9b9b9b!2sJl.%20Kelud%20Raya%20No.123%2C%20Bekasi%2C%20Jawa%20Barat!5e0!3m2!1sen!2sid!4v1620000000000!5m2!1sen!2sid"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              className="w-full h-96"
            ></iframe>
          </div>
        </section>
      </main>

      {/* CTA Section */}
      <section className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6">
            Siap Memperbaiki Komputer Anda?
          </h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Hubungi kami sekarang untuk konsultasi gratis atau buat janji temu dengan teknisi kami.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => router.push("/")}
              className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-all duration-300"
            >
              Lihat Layanan
            </button>
            <a
              href="tel:+6285156929136"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-all duration-300"
            >
              Telepon Sekarang
            </a>
          </div>
        </div>
      </section>

      {/* Footer (same as homepage) */}
      <footer className="bg-gray-900 text-gray-300 pt-16 pb-8">
        {/* ... (same footer content as your homepage) ... */}
      </footer>
    </div>
  );
}