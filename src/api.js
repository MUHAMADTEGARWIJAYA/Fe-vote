import axios from "axios";

// Membuat instance axios dengan konfigurasi dasar
const api = axios.create({
  baseURL: "https://be-vote-beta.vercel.app", // Ganti dengan URL backend yang sesuai
  headers: {
    "Content-Type": "application/json",
  },
});

// Menambahkan token yang disimpan di localStorage ke header Authorization
api.defaults.headers.common["Authorization"] = `Bearer ${localStorage.getItem("token")}`;

// Fungsi untuk melakukan login dan menyimpan token
export const loginUser = async (nim) => {
  try {
    const response = await api.post("/api/v1/auth/login", { nim });

    // Jika login berhasil dan token ada, simpan token ke localStorage
    if (response.data.token) {
      localStorage.setItem("token", response.data.token);
      // Perbarui header Authorization
      api.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
    }

    return response.data;
  } catch (error) {
    console.error("Login failed:", error.message);
    throw error;
  }
};

// Fungsi untuk melakukan vote dengan menggunakan token yang ada
export const submitVote = async ({ nim, candidate }) => {
  try {
    const response = await api.post("/api/v1/vote", { nim, candidate });

    if (response.status === 200) {
      return response.data;
    }

    throw new Error("Vote gagal.");
  } catch (error) {
    console.error("Error during vote:", error.message);
    if (error.response?.status === 403) {
      // Jika token expired atau invalid, coba refresh token
      await refreshToken();
      return submitVote({ nim, candidate }); // Coba ulangi permintaan vote setelah token diperbarui
    }
    throw error;
  }
};


// Fungsi untuk memperbarui token (refresh token)
export const refreshToken = async () => {
  try {
    const response = await api.post("/api/v1/auth/refresh-token", {}, { withCredentials: true });
    const newAccessToken = response.data.token;

    // Simpan token baru di localStorage dan perbarui header Authorization
    localStorage.setItem("token", newAccessToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;

    return newAccessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    // Redirect ke halaman login jika refresh token gagal
    window.location.href = "/login";
    throw error;
  }
};

// Menangani token expired atau error lainnya
api.interceptors.response.use(
  (response) => response, // Jika response sukses, lanjutkan
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
      // Jika status 401 (Unauthorized), buka login window
      openLoginWindow();
      return Promise.reject(error);
    }
    // Jika token expired (misalnya status 403), coba refresh token
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken(); // Dapatkan token baru
        // Perbarui permintaan dengan token baru dan ulangi
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        return api(originalRequest); // Ulangi permintaan yang gagal
      } catch (refreshError) {
        return Promise.reject(refreshError); // Gagal refresh token
      }
    }

    return Promise.reject(error); // Untuk error lainnya, tolak promise
  }
);


// Fungsi untuk membuka jendela login
export const openLoginWindow = () => {
  try {
    // URL endpoint untuk halaman login
    const loginUrl = "/api/v1/auth/login-window";
    window.open(loginUrl, "_blank", "width=500,height=600"); // Atur ukuran popup
  } catch (error) {
    console.error("Failed to open login window:", error.message);
    throw error;
  }
};

export default api;
