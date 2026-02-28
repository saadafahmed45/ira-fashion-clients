const collectionApi = async () => {
  try {
    const res = await fetch("https://ira-fashion-server.onrender.com/collections", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch collections");
    }

    return res.json();
  } catch (error) {
    console.error(error);
    return [];
  }
};

export default collectionApi;