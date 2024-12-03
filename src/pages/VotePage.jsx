import { useState, useEffect } from "react";
import { submitVote } from "../api"; // Pastikan import sesuai lokasi file
import { useNavigate } from "react-router-dom";

function VotePage() {
  const [candidate, setCandidate] = useState(""); // Kandidat yang dipilih
  const [error, setError] = useState(""); // Pesan error jika ada masalah
  const [successMessage, setSuccessMessage] = useState(""); // Pesan sukses setelah vote
  const [loading, setLoading] = useState(false); // Status loading saat vote dikirim
  const navigate = useNavigate();

  const candidates = [
    {
      id: "Candidate 1",
      name: "Bayu",
      photo: "/assets/candidat1.jpeg", // Pastikan path ke gambar benar
      vision: "Himaif sebagai 'keluarga' yang dapat menyatukan seluruh karakter mahasiswa informatika.",
      mission:
        "1. Melanjutkan dan menyempurnakan proker yang sudah ada namun belum berjalan dengan baik. 2. Mengelola kepengurusan dan keanggotaan agar lebih aktif lagi dalam setiap kegiatan himaif.",
    },
    {
      id: "Candidate 2",
      name: "Jane Smith",
      photo: "/assets/candidat2.jpeg", // Pastikan path ke gambar benar
      vision:
        "Mendorong inovasi dan kreativitas mahasiswa melalui berbagai kegiatan yang berorientasi pada pengembangan keterampilan serta memperkuat komunitas untuk saling mendukung.",
      mission:
        "1. Menyediakan lebih banyak program pelatihan dalam bidang teknologi dan kewirausahaan. 2. Memperkuat komunitas mahasiswa dengan mengadakan lebih banyak acara yang melibatkan mahasiswa dari berbagai jurusan.",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Anda belum login. Silakan login terlebih dahulu.");
      navigate("/login");
    }
  }, [navigate]);

  const handleVote = async () => {
    const token = localStorage.getItem("token");
    const nim = localStorage.getItem("nim"); // Ambil NIM dari localStorage (atau sumber lain)
  
    if (!nim) {
      setError("NIM tidak ditemukan. Silakan login ulang.");
      return;
    }
  
    if (!candidate) {
      setError("Silakan pilih kandidat sebelum mengirim suara.");
      return;
    }
  
    console.log("Body:", { nim, candidate });
    console.log("Header:", { Authorization: `Bearer ${token}` });
  
    setLoading(true);
  
    try {
      const response = await submitVote(
        { nim, candidate }, // Kirimkan 'nim' dan 'candidate'
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setSuccessMessage(response.message || "Voting berhasil!");
      setError("");
    } catch (error) {
      setError(error.message || "Terjadi kesalahan saat mengirim suara.");
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-[#331064] to-violet-700 pb-52">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-white">Vote for Your Candidate</h1>
        <p className="text-white pt-10">
          Klik <span className="text-green-500">Pilih Kandidat</span> lalu klik{" "}
          <span className="text-green-500">Kirim Vote</span>.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {candidates.map((c, index) => (
          <div
            key={c.id}
            className="p-4 w-96 border bg-violet-600 rounded-lg shadow-md flex flex-col items-center border-gray-300"
          >
            <h1 className="text-2xl font-bold text-white mb-4">{`Candidate ${index + 1}`}</h1>

            <img
              src={c.photo}
              alt={c.name}
              className="w-70 h-70 rounded-full mb-4 border-4 border-white shadow-lg"
            />
            <h2 className="text-xl text-white font-semibold mb-2">{c.name}</h2>
            <p className="text-sm text-white mb-2 break-words">
              <strong>Visi:</strong> {c.vision}
            </p>
            <p className="text-sm text-white mb-4 break-words">
              <strong>Misi:</strong> {c.mission}
            </p>
            <button
              onClick={() => setCandidate(c.id)}
              className={`px-6 py-2 rounded-md text-white font-semibold ${
                candidate === c.id ? "bg-green-500" : "bg-gray-500 hover:bg-green-400"
              } transition-colors duration-300`}
            >
              {candidate === c.id ? "Selected" : "Choose Candidate"}
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={handleVote}
        className="px-8 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-300 mb-4"
        disabled={loading}
      >
        {loading ? "Sending..." : "Kirim Vote"}
      </button>

      <button
        onClick={() => navigate("/admin")}
        className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300"
      >
        Lihat Hasil Voting
      </button>

      {successMessage && <div className="mt-4 text-green-600">{successMessage}</div>}
      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
}

export default VotePage;
