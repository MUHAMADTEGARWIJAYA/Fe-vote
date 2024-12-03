import { useState, useEffect } from "react";


function VotePage() {
  const [candidate, setCandidate] = useState("");
  const [error, setError] = useState("");

  const candidates = [
    {
      id: "Candidate 1",
      name: "Bayu",
      photo: "candidat1.jpeg", // Ganti dengan URL foto kandidat
      vision: "Himaif sebagai 'keluarga' yang dapat menyatukan seluruh karakter mahasiswa informatika.",
      mission:
        "1. Melanjutkan dan menyempurnakan proker yang sudah ada namun belum berjalan dengan baik. 2. Mengelola kepengurusan dan keanggotaan agar lebih aktif lagi dalam setiap kegiatan himaif.",
    },
    {
      id: "Candidate 2",
      name: "Jane Smith",
      photo: "candidat2.jpeg", // Ganti dengan URL foto kandidat
      vision:
        "Mendorong inovasi dan kreativitas mahasiswa melalui berbagai kegiatan yang berorientasi pada pengembangan keterampilan serta memperkuat komunitas untuk saling mendukung.",
      mission:
        "1. Menyediakan lebih banyak program pelatihan dalam bidang teknologi dan kewirausahaan. 2. Memperkuat komunitas mahasiswa dengan mengadakan lebih banyak acara yang melibatkan mahasiswa dari berbagai jurusan.",
    },
  ];

  const handleVote = async () => {
    if (!candidate) {
      setError("Silakan pilih kandidat sebelum mengirim suara.");
      return;
    }

    const nim = localStorage.getItem("nim"); // Ambil NIM dari localStorage
    const token = localStorage.getItem("token"); // Ambil token dari localStorage

    if (!nim) {
      setError("NIM tidak ditemukan. Silakan login kembali.");
      return;
    }

    try {
      const response = await fetch("https://be-vote-beta-vercel.app/api/v1/auth/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ nim, candidate }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Gagal mengirim suara.");
      }

      setError(""); // Hapus error jika berhasil
      alert("Voting berhasil!");
    } catch (error) {
      setError(error.message);
    }
  };

  const [images, setImages] = useState({});

  useEffect(() => {
    const loadImages = async () => {
      const importedImages = import.meta.glob('../assets/images/*.{png,jpg,jpeg,svg}');
      const imageEntries = await Promise.all(
        Object.entries(importedImages).map(async ([path, importFunc]) => {
          const module = await importFunc();
          const fileName = path.replace('../assets/images/', ''); // Sesuaikan nama file
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
        <p className="text-white pt-10">Click <span className="text-green-500">Choose Candidate</span> lalu click <span className="text-green-500">Submit</span> yaaaaaaaaa heheh</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        {candidates.map((c, index) => (
          <div
            key={c.id}
            className="p-4 w-96 border bg-violet-600 rounded-lg shadow-md flex flex-col items-center border-gray-300"
          >
            {/* Tulisan Candidate */}
            <h1 className="text-2xl font-bold text-white mb-4">{`Candidate ${index + 1}`}</h1>

            <img
              src={images[c.photo]}
              alt={c.name}
              className="w-70 h-70 rounded-full mb-4 border-4 border-white shadow-lg"
            />
            <h2 className="text-xl text-white font-semibold mb-2">{c.name}</h2>
            <p
              className="text-sm text-white mb-2 break-words"
              style={{ whiteSpace: "normal", wordBreak: "break-word" }}
            >
              <strong>Visi:</strong> {c.vision}
            </p>
            <p
              className="text-sm text-white mb-4 break-words"
              style={{ whiteSpace: "normal", wordBreak: "break-word" }}
            >
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
      >
        Submit Vote
      </button>

      {/* Tombol ke Halaman Admin */}
      <button
        onClick={() => (window.location.href = "/admin")} // Ganti dengan path yang sesuai
        className="px-8 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors duration-300"
      >
        LIHAT HASIL VOTING
      </button>

      {error && <div className="mt-4 text-red-600">{error}</div>}
    </div>
  );
}

export default VotePage;
