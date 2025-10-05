import supabase from "../utils/supabaseClient.js";

export const getAllOrders = async (req, res) => {
  try {
    const { data, error } = await supabase.from("orders").select("*");
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data pesanan.",
      details: error.message,
    });
  }
};

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    if (!data)
      return res
        .status(404)
        .json({ error: "Pesanan tidak ditemukan." });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil detail pesanan.",
      details: error.message,
    });
  }
};

export const createOrder = async (req, res) => {
  const {
    full_name,
    email,
    phone,
    quantity,
    pickup_time,
    notes,
    product_name,
    shipping_method,
    notification_methods: [],
  } = req.body;

  if (!full_name || !email || !product_name) {
    return res
      .status(400)
      .json({ error: "Nama, email, dan produk wajib diisi." });
  }

  try {
    const { data, error } = await supabase
      .from("orders")
      .insert({
        full_name,
        email,
        phone,
        quantity,
        pickup_time,
        notes,
        product_name,
        shipping_method,
        notification_methods: [],
      })
      .select()
      .single();

    if (error) throw error;
    res
      .status(201)
      .json({ message: "Pesanan berhasil dibuat!", order: data });
  } catch (error) {
    res.status(500).json({
      error: "Gagal membuat pesanan.",
      details: error.message,
    });
  }
};

export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const {
    full_name,
    email,
    phone,
    quantity,
    pickup_time,
    notes,
    product_name,
    shipping_method,
    notification_methods: [],
  } = req.body;

  try {
    const { data, error } = await supabase
      .from("orders")
      .update({
        full_name,
        email,
        phone,
        quantity,
        pickup_time,
        notes,
        product_name,
        shipping_method,
        notification_methods: [],
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data)
      return res
        .status(404)
        .json({ error: "Pesanan tidak ditemukan untuk diperbarui." });
    res
      .status(200)
      .json({ message: "Pesanan berhasil diperbarui!", order: data });
  } catch (error) {
    res.status(500).json({
      error: "Gagal memperbarui pesanan.",
      details: error.message,
    });
  }
};

export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from("orders")
      .delete()
      .eq("id", id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: "Gagal menghapus pesanan.",
      details: error.message,
    });
  }
};
