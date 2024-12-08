import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { loginUser } from "../api";
import { ClipLoader } from "react-spinners";
import backgroundImage from "../assets/images/background.jpg";

function LoginPage() {
  const [nim, setNim] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // Timer untuk 5 menit (300 detik)
  const navigate = useNavigate();

  // Timer countdown
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer); // Bersihkan interval
  }, [timeLeft]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (timeLeft <= 0) {
      setError("Waktu login telah habis!");
      return;
    }

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

  if (timeLeft <= 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#331064] to-violet-700 text-white">
        <h1 className="text-2xl font-bold text-center">
          Waktu Login Telah Habis! <br />
          Silakan hubungi admin untuk perpanjangan waktu.
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#331064] to-violet-700 flex flex-col items-center justify-center">
      <div
        className="text-center w-96 h-64 pt-10 rounded-t-xl shadow-2xl bg-cover bg-center text-white"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <h1 className="text-3xl font-bold">VOTE KETUA HIMAIF</h1>
        <h2 className="font-bold">Periode 2024-2025</h2>
        <p className="text-sm mt-8">
          Halooo Mahasiswa / Bapak dan Ibu Dosen Informatika Sahid Surakarta cukup masukan Nim aja yaa buat login, gunakan hak vote kalian dengan benar!
        </p>
      </div>

      <div className="bg-white h-64 justify-center items-center p-6 rounded-sm shadow-2xl w-96">
        <h2 className="text-lg font-semibold text-center mb-4">USER LOGIN</h2>
        {/* Tampilkan timer */}
        <p className="text-center text-red-600 font-semibold mb-4">
          Sisa waktu login: {formatTime(timeLeft)}
        </p>
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
