import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { loginUser } from "../api";

// Import gambar dari folder internal
import backgroundImage from "../assets/images/background.jpg";

function LoginPage() {
  const [nim, setNim] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      if (!nim) {
        setError("NIM harus diisi.");
        return;
      }

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
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#331064] to-violet-700  flex flex-col items-center justify-center">
      {/* Background Image Section */}
      <div
        className="text-center w-96 h-64 pt-10 rounded-t-xl shadow-2xl bg-cover bg-center text-white"
        style={{
          backgroundImage: `url(${backgroundImage})`,
        }}
      >
        <h1 className="text-3xl font-bold">VOTE KETUA HIMAIF</h1>
        <h2 className=" font-bold">Periode 2024-2025</h2>
        <p className="text-sm mt-8">
          Halooo Mahasiswa / Bapak dan Ibu Dosen Informatika Sahid Surakarta cukup masukan Nim aja yaa buat login, gunakan hak vote kalian dengan benar!
        </p>
      </div>

      {/* Login Form */}
      <div className="bg-white h-64 justify-center items-center p-6 rounded-sm shadow-2xl w-96">
        <h2 className="text-lg font-semibold text-center mb-4">USER LOGIN</h2>
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="flex items-center bg-gray-100 px-3 py-2 rounded-lg shadow-inner">
              {/* React Icon */}
              <FaUserAlt className="text-violet-700  mr-2" />
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
          >
            Login
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
