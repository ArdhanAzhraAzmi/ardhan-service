"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Menu, X, User, LogOut, Settings } from "lucide-react";
import Image from "next/image";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const updateUser = () => {
      setRole(localStorage.getItem("userRole"));
      setEmail(localStorage.getItem("userEmail"));
      setIsLoading(false);
    };

    updateUser();

    window.addEventListener("storage", updateUser);
    return () => window.removeEventListener("storage", updateUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    setRole(null);
    setEmail(null);
    router.push("/");
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownOpen && !(event.target as Element).closest('.dropdown-container')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex-shrink-0">
              <Image
                src="/logoku.png"
                alt="Ardhan Service Logo"
                width={90}
                height={90}
                className="object-contain max-h-full max-w-full"
              />
            </div>
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="#tentang"
              className={`px-1 py-2 text-sm font-medium ${
                pathname === "/#tentang"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              } transition-colors`}
            >
              Tentang Kami
            </Link>
            <Link
              href="#layanan"
              className={`px-1 py-2 text-sm font-medium ${
                pathname === "/#layanan"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              } transition-colors`}
            >
              Layanan
            </Link>
            <Link
              href="#kontak"
              className={`px-1 py-2 text-sm font-medium ${
                pathname === "/#kontak"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-700 hover:text-blue-600"
              } transition-colors`}
            >
              Kontak
            </Link>

            {!isLoading &&
              (!role ? (
                <Link
                  href="/login-user"
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                >
                  Masuk/Daftar
                </Link>
              ) : (
                <div className="relative dropdown-container">
                  <button
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center space-x-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors focus:outline-none"
                  >
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                      <User className="h-4 w-4" />
                    </div>
                    <span className="hidden lg:inline-block">
                      {email?.split("@")[0]}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-20 divide-y divide-gray-100">
                      <div className="px-4 py-3 text-xs text-gray-500">
                        Masuk sebagai
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {email}
                        </div>
                      </div>
                      <div className="py-1">
                        <Link
                          href="/pesanan"
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          🛒 <span className="ml-3">Pesanan</span>
                        </Link>
                        <Link
                          href="/settings"
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          <Settings className="h-4 w-4 mr-3 text-gray-400" />
                          Pengaturan
                        </Link>
                      </div>
                      <div className="py-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors"
                        >
                          <LogOut className="h-4 w-4 mr-3 text-red-400" />
                          Keluar
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
          </div>

          <div className="md:hidden flex items-center">
            {!isLoading && role && (
              <div className="relative mr-3">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600"
                >
                  <User className="h-4 w-4" />
                </button>
              </div>
            )}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden bg-white shadow-lg rounded-b-lg`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link
            href="#tentang"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === "/#tentang"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            Tentang Kami
          </Link>
          <Link
            href="#layanan"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === "/#layanan"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            Layanan
          </Link>
          <Link
            href="#kontak"
            className={`block px-3 py-2 rounded-md text-base font-medium ${
              pathname === "/#kontak"
                ? "bg-blue-50 text-blue-600"
                : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
            }`}
          >
            Kontak
          </Link>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          {!isLoading &&
            (!role ? (
              <div className="px-5">
                <Link
                  href="/login-user"
                  className="w-full flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-md shadow-sm hover:from-blue-700 hover:to-indigo-700 transition-all duration-300"
                >
                  Masuk/Daftar
                </Link>
              </div>
            ) : (
              <>
                <div className="flex items-center px-5">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <User className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <div className="text-sm font-medium text-gray-700">
                      {email}
                    </div>
                  </div>
                </div>
                <div className="mt-3 px-2 space-y-1">
                  <Link
                    href="/pesanan"
                    className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    Pesanan
                  </Link>
                  <Link
                    href="/settings"
                    className="block w-full px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50 transition-colors text-left"
                  >
                    Pengaturan
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full px-3 py-2 rounded-md text-base font-medium text-red-600 hover:bg-gray-50 transition-colors text-left"
                  >
                    Keluar
                  </button>
                </div>
              </>
            ))}
        </div>
      </div>
    </nav>
  );
}
