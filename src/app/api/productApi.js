 export const productApiUrl = "https://ira-fashion-server.onrender.com/products";

async function productApi() {
  const res = await fetch(productApiUrl, {
next:{
  revalidate:5,
}
  });

  return res.json();
}
export default productApi;