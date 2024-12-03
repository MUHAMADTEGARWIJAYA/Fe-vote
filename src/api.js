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
  
      return await response.json();
    } catch (error) {
      console.error("Error during login:", error.message);
      throw error;
    }
  };
  
  export const submitVote = async (candidateId, token) => {
    try {
      const response = await fetch("https://be-vote-beta.vercel.app/api/v1/vote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Kirim token dalam header Authorization
        },
        body: JSON.stringify({ candidateId }),
      });
  
      if (!response.ok) {
        throw new Error("Vote gagal. Pastikan Anda belum memberikan suara.");
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error during vote:", error.message);
      throw error;
    }
  };
  