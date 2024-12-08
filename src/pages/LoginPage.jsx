import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { loginUser } from "../api";
import { ClipLoader } from "react-spinners";
import backgroundImage from "../assets/images/background.jpg";

// Fungsi untuk menghitung mundur
const calculateCountdown = (startTime) => {
  const now = new Date().getTime();
  const distance = startTime - now;
  if (distance <= 0) return null;

  const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  return `${hours > 0 ? `${hours}h ` : ""}${minutes}m ${seconds}s`;
};

function LoginPage() {
  const [nim, setNim] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [loginWindow, setLoginWindow] = useState({});
  const [isPopupOpen, setIsPopupOpen] = useState(true); // Popup kontrol
  const navigate = useNavigate();

  // Ambil waktu login dari backend
  useEffect(() => {
    const fetchLoginWindow = async () => {
      try {
        const response = await fetch("/api/v1/login-window");
        const data = await response.json();
        setLoginWindow(data);
      } catch (err) {
        console.error("Failed to fetch login window:", err);
      }
    };

    fetchLoginWindow();

    const countdownInterval = setInterval(() => {
      if (loginWindow.start) {
        const countdownTime = calculateCountdown(new Date(loginWindow.start).getTime());
        setCountdown(countdownTime);

        if (!countdownTime) {
          setIsPopupOpen(false); // Tutup popup jika waktu selesai
        }
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [loginWindow.start]);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!nim) {
      setError("NIM harus diisi.");
      return;
    }

    try {
      setLoading(true);
      const response = await loginUser(nim);

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("nim", nim);
        navigate("/vote");
      } else {
        setError("Login gagal. Token tidak diterima.");
      }
    } catch (err) {
      setError("Terjadi kesalahan: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#331064] to-violet-700 flex flex-col items-center justify-center">
      {/* Background Image Section */}
      <div
        className="text-center w-96 h-64 pt-10 rounded-t-xl shadow-2xl bg-cover bg-center text-white"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <h1 className="text-3xl font-bold">VOTE KETUA HIMAIF</h1>
        <h2 className="font-bold">Periode 2024-2025</h2>
        <p className="text-sm mt-8">
          Halooo Mahasiswa / Bapak dan Ibu Dosen Informatika Sahid Surakarta cukup masukan Nim aja yaa buat login, gunakan hak vote kalian dengan benar!
        </p>
      </div>

      {/* Popup Countdown */}
      {isPopupOpen && countdown && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold text-center mb-4">Login Dimulai Dalam:</h2>
            <p className="text-center text-2xl">{countdown}</p>
          </div>
        </div>
      )}

      {/* Login Form */}
      <div className="bg-white h-64 justify-center items-center p-6 rounded-sm shadow-2xl w-96">
        <h2 className="text-lg font-semibold text-center mb-4">USER LOGIN</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="flex items-center bg-gray-100 px-3 py-2 rounded-lg shadow-inner">
              <FaUserAlt className="text-violet-700 mr-2" />
              <input
                type="text"
                placeholder="NIM Mahasiswa"
                value={nim}
                onChange={(e) => setNim(e.target.value)}
                className="w-full bg-transparent outline-none text-gray-700"
              />
            </label>
          </div>

          {/* Show spinner if loading */}
          <button
            type="submit"
            className="w-full bg-violet-700 text-white py-2 rounded-lg hover:bg-[#331064] transition"
            disabled={loading}
          >
            {loading ? (
              <div className="flex justify-center items-center">
                <ClipLoader size={20} color={"#ffffff"} loading={loading} />
              </div>
            ) : (
              "Login"
            )}
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
