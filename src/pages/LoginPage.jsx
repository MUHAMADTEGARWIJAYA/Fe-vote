import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaUserAlt } from "react-icons/fa";
import { loginUser } from "../api";
import { ClipLoader } from "react-spinners"; // Import spinner component

// Import gambar dari folder internal
import backgroundImage from "../assets/images/background.jpg";

function LoginPage() {
  const [nim, setNim] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // State to track loading
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
  
    if (!nim) {
      setError("NIM harus diisi.");
      return;
    }

    try {
      setLoading(true); // Set loading to true when the login starts
      const response = await loginUser(nim);
  
      if (response.token) {
        // console.log("Token diterima:", response.token); // Log token untuk verifikasi
        localStorage.setItem("token", response.token);
        localStorage.setItem("nim", nim);
        navigate("/vote");
      } else {
        setError("Login gagal. Token tidak diterima.");
      }
    } catch (err) {
      setError("Terjadi kesalahan: " + err.message);
    } finally {
      setLoading(false); // Set loading to false when the request is complete
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#331064] to-violet-700 flex flex-col items-center justify-center">
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

          {/* Show spinner if loading */}
          <button
            type="submit"
            className="w-full bg-violet-700 text-white py-2 rounded-lg hover:bg-[#331064] transition"
            disabled={loading} // Disable button while loading
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
