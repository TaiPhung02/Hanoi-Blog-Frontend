import axios from "axios";

export const uploadImage = async (img) => {
  try {
    const {
      data: { uploadURL },
    } = await axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/get-upload-url");

    await axios.put(uploadURL, img, {
      headers: { "Content-Type": "image/jpeg" },
    });

    const imgUrl = uploadURL.split("?")[0];
    return imgUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};
