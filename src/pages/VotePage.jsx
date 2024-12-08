import { useState, useEffect } from "react";
import { submitVote } from "../api"; // Pastikan import sesuai lokasi file
import { useNavigate } from "react-router-dom";

function VotePage() {
  const [candidate, setCandidate] = useState(""); // Kandidat yang dipilih
  const [error, setError] = useState(""); // Pesan error jika ada masalah
  const [successMessage, setSuccessMessage] = useState(""); // Pesan sukses setelah vote
  const [loading, setLoading] = useState(false); // Status loading saat vote dikirim
  const [isModalOpen, setIsModalOpen] = useState(false); // Kontrol modal popup
  const navigate = useNavigate();

  const candidates = [
   
    {
      id: "Candidate 1",
      name: "Maulana Ikhsan Afrizalu",
      photo: "candidat2.jpeg",
      vision: "Mewujudkan himpunan mahasiswa informatika sebagai komunitas yang inklusif, inovatif, dan berdedikasi dalam memanfaatkan teknologi.",
      mission: "1. Mengutamakan Kolektivisme dalam Kepemimpinan : Mengelola himpunan secara demokratis dengan melibatkan seluruh anggota dalam pengambilan keputusan, sehingga organisasi menjadi milik bersama, bukan segelintir orang orang penting saja. 2. Mendorong Kemandirian Akademik dan Organisasi : Membangun himpunan yang mandiri secara intelektual dan organisatoris, sehingga tidak bergantung pada kekuatan eksternal yang dapat membatasi kebebasan berpikir dan bertindak",
    }, {
      id: "Candidate 2",
      name: "Bayu Widyadi Nugroho",
      photo: "candidat1.jpeg",
      vision: "Himaif sebagai 'keluarga' yang dapat menyatukan seluruh karakter mahasiswa informatika.",
      mission: "1. Melanjutkan dan menyempurnakan proker yang sudah ada namun belum berjalan dengan baik. 2. Mengelola kepengurusan dan keanggotaan agar lebih aktif lagi dalam setiap kegiatan himaif.",
    },
  ];

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Anda belum login. Silakan login terlebih dahulu.");
      navigate("/login");
    }
  }, [navigate]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleVote = async () => {
    const token = localStorage.getItem("token");
    const nim = localStorage.getItem("nim");
  
    if (!nim) {
      setError("NIM tidak ditemukan. Silakan login ulang.");
      return;
    }
  
    if (!candidate) {
      setError("Silakan pilih kandidat sebelum mengirim suara.");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await submitVote(
        { nim, candidate },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      setSuccessMessage(response.message || "Voting berhasil!");
      setError("");
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message || "Terjadi kesalahan saat mengirim suara.";
      setError(errorMessage);
      setSuccessMessage("");
    } finally {
      setLoading(false);
    }
  };

  const [images, setImages] = useState({});

  useEffect(() => {
    const loadImages = async () => {
      const importedImages = import.meta.glob('../assets/images/*.{png,jpg,jpeg}');
      const imageEntries = await Promise.all(
        Object.entries(importedImages).map(async ([path, importFunc]) => {
          const module = await importFunc();
          const fileName = path.split('/').pop();
          return [fileName, module.default];
        })
      );
      setImages(Object.fromEntries(imageEntries));
    };

    loadImages();
  }, []);

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
              src={images[c.photo]}
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
        onClick={openModal}
        className="px-8 py-3 bg-green-500 text-white font-semibold rounded-md hover:bg-green-700 transition-colors duration-300 mb-4"
        disabled={loading}
      >
        {loading ? "Sending..." : "Kirim Vote"}
      </button>

      

      {successMessage && <div className="mt-4 text-green-600">{successMessage}</div>}
      {error && <div className="mt-4 text-red-600">{error}</div>}

      {/* Modal Konfirmasi */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h2 className="text-lg font-bold mb-4">Konfirmasi Voting</h2>
            <p className="mb-6">Apakah Anda yakin ingin memberikan suara untuk kandidat ini?</p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  closeModal();
                  handleVote();
                }}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Yakin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VotePage;
