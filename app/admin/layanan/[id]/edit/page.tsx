"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { X, Upload, Image as ImageIcon } from "lucide-react";

export default function EditModal() {
  const router = useRouter();
  const { id } = useParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    nama: "",
    deskripsi: "",
    harga: "" as number | string,
    gambar: "" as string | File,
  });
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLayanan = async () => {
      try {
        const res = await fetch(`/api/layanan/${id}`);
        const data = await res.json();
        setFormData({
          nama: data.nama,
          deskripsi: data.deskripsi,
          harga: data.harga,
          gambar: data.gambar,
        });
        setPreviewImage(data.gambar);
      } catch (err) {
        setError("Failed to load service data");
      } finally {
        setLoading(false);
      }
    };
    fetchLayanan();
  }, [id]);

  const handleChange = (
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, gambar: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama", formData.nama);
      formDataToSend.append("deskripsi", formData.deskripsi);
      formDataToSend.append("harga", formData.harga.toString());
      if (typeof formData.gambar !== "string") {
        formDataToSend.append("gambar", formData.gambar);
      }

      const res = await fetch(`/api/layanan/${id}`, {
        method: "PUT",
        body: formDataToSend,
      });

      if (!res.ok) throw new Error(await res.text());

      router.push("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save changes");
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => router.push("/admin/dashboard");

  if (loading)
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-gray-200">
          <div className="animate-pulse flex flex-col space-y-4">
            <div className="h-8 bg-gray-100 rounded w-3/4"></div>
            <div className="h-4 bg-gray-100 rounded w-full"></div>
            <div className="h-4 bg-gray-100 rounded w-5/6"></div>
            <div className="h-10 bg-gray-100 rounded"></div>
          </div>
        </div>
      </div>
    );

  return (
    <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl relative overflow-hidden border border-gray-200">
        <div className="absolute top-4 right-4">
          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Edit Service
          </h2>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 rounded">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Service Image
                </label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-blue-500 transition-colors bg-gray-50"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {previewImage ? (
                    <div className="relative group">
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="bg-white p-2 rounded-full">
                          <Upload className="w-5 h-5 text-gray-700" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8">
                      <ImageIcon className="w-10 h-10 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500">
                        Click to upload image
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        JPG, PNG (Max 2MB)
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleImageChange}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-6">
                <div>
                  <label
                    htmlFor="nama"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Service Name
                  </label>
                  <input
                    id="nama"
                    name="nama"
                    type="text"
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                    placeholder="Service name"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="harga"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Price (Rp)
                  </label>
                  <input
                    id="harga"
                    name="harga"
                    type="number"
                    value={formData.harga}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                    placeholder="Price"
                    required
                    min="0"
                  />
                </div>
              </div>
            </div>

            <div>
              <label
                htmlFor="deskripsi"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Description
              </label>
              <textarea
                id="deskripsi"
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleChange}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 bg-white"
                placeholder="Service description"
                required
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center min-w-24 disabled:opacity-70"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
