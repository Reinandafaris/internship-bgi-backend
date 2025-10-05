import supabase from "../utils/supabaseClient.js";

export const getAllProducts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*");
    if (error) throw error;
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil data produk.",
      details: error.message,
    });
  }
};

export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error) throw error;
    if (!data)
      return res
        .status(404)
        .json({ error: "Produk tidak ditemukan." });
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengambil detail produk.",
      details: error.message,
    });
  }
};

export const createProduct = async (req, res) => {
  const { name, price, old_price, description, detail, images } =
    req.body;

  if (!name || !price) {
    return res
      .status(400)
      .json({ error: "Nama dan harga produk wajib diisi." });
  }

  try {
    const { data, error } = await supabase
      .from("products")
      .insert({
        name,
        price,
        old_price,
        description,
        detail,
        images,
      })
      .select()
      .single();

    if (error) throw error;
    res
      .status(201)
      .json({ message: "Produk berhasil dibuat!", product: data });
  } catch (error) {
    res.status(500).json({
      error: "Gagal membuat produk.",
      details: error.message,
    });
  }
};

export const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, old_price, description, details, images } =
    req.body;

  try {
    const { data, error } = await supabase
      .from("products")
      .update({
        name,
        price,
        old_price,
        description,
        details,
        images,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    if (!data)
      return res
        .status(404)
        .json({ error: "Produk tidak ditemukan untuk diperbarui." });
    res.status(200).json({
      message: "Produk berhasil diperbarui!",
      product: data,
    });
  } catch (error) {
    res.status(500).json({
      error: "Gagal memperbarui produk.",
      details: error.message,
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", id);
    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    res.status(500).json({
      error: "Gagal menghapus produk.",
      details: error.message,
    });
  }
};

export const uploadProductImage = async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "Tidak ada file gambar yang diunggah." });
  }

  try {
    const file = req.file;
    const fileName = `${Date.now()}-${file.originalname}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images") // Nama bucket di Supabase
      .upload(fileName, file.buffer, {
        contentType: file.mimetype,
      });

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(fileName);

    res.status(200).json({ imageUrl: data.publicUrl });
  } catch (error) {
    res.status(500).json({
      error: "Gagal mengunggah gambar.",
      details: error.message,
    });
  }
};
