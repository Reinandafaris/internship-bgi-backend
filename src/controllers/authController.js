import supabase from "../utils/supabaseClient.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  const { fullname, email, password, phone } = req.body;

  if (!email || !password || !fullname) {
    return res.status(400).json({
      error: "Nama lengkap, email, dan password wajib diisi.",
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const { data, error } = await supabase
      .from("users")
      .insert({
        fullname,
        email,
        password_hash: hashedPassword,
        phone,
      })
      .select("id, fullname, email, created_at")
      .single();

    if (error) {
      if (error.code === "23505") {
        return res
          .status(409)
          .json({ error: "Email sudah terdaftar." });
      }
      throw error;
    }

    res
      .status(201)
      .json({ message: "Registrasi berhasil!", user: data });
  } catch (error) {
    res.status(500).json({
      error: "Terjadi kesalahan pada server.",
      details: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email dan password wajib diisi." });
  }

  try {
    const { data: user, error } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (error || !user) {
      return res
        .status(404)
        .json({ error: "Pengguna tidak ditemukan." });
    }

    const isPasswordMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Password salah." });
    }

    const payload = {
      id: user.id,
      email: user.email,
      role: "user",
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    delete user.password_hash;

    res.status(200).json({
      message: "Login berhasil!",
      user,
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: "Terjadi kesalahan pada server.",
      details: error.message,
    });
  }
};
