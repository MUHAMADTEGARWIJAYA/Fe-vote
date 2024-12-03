export const loginUser = async (nim) => {
  try {
    const response = await fetch("https://be-vote-beta.vercel.app/api/v1/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nim }), // Kirim NIM sebagai body JSON
    });

    if (!response.ok) {
      throw new Error("Login failed. Check your NIM.");
    }

    const data = await response.json();

    // Pastikan token disertakan dalam response dan simpan di localStorage
    if (data.token) {
      localStorage.setItem("token", data.token); // Menyimpan token di localStorage
    }

    return data;
  } catch (error) {
    console.error("Error during login:", error.message);
    throw error;
  }
};

  
export const submitVote = async (candidateId, token) => {
  try {
    const response = await fetch("https://be-vote-beta.vercel.app/api/v1/auth/vote/vote", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // Kirim token dalam header Authorization
      },
      body: JSON.stringify({ candidateId }), // Kirim candidateId untuk memilih kandidat
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      const errorMessage = errorResponse.message || "Vote gagal. Pastikan Anda belum memberikan suara.";
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error during vote:", error.message);
    throw error; // Mengembalikan error untuk ditangani lebih lanjut
  }
};

  