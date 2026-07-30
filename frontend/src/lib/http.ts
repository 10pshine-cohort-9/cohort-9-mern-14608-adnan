import ky from "ky";

const http = ky.create({
  prefix: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  credentials: "include",
});

export default http;
