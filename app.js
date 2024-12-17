const API_KEY =
  "live_XazgZmeTNGkI0B99WbNNpkMSWuV3whVtvpPIBH1yk9xyg5dV3dhMiHknquShCxA3"; // This is my API Key
const BASE_URL = "https://api.thecatapi.com/v1";

// DOM Elements
const randomBtn = document.getElementById("randomBtn");
const breedSelect = document.getElementById("breedSelect");
const gallery = document.getElementById("gallery");
const favorites = document.getElementById("favorites");

// Initialize Axios instance
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    live_XazgZmeTNGkI0B99WbNNpkMSWuV3whVtvpPIBH1yk9xyg5dV3dhMiHknquShCxA3:
      API_KEY,
  },
});

// Fetch Breeds and Populate Select Menu
async function fetchBreeds() {
  const response = await fetch(`${BASE_URL}/breeds`, {
    headers: {
      live_XazgZmeTNGkI0B99WbNNpkMSWuV3whVtvpPIBH1yk9xyg5dV3dhMiHknquShCxA3:
        API_KEY,
    },
  });
  const breeds = await response.json();

  breeds.forEach((breed) => {
    const option = document.createElement("option");
    option.value = breed.id;
    option.textContent = breed.name;
    breedSelect.appendChild(option);
  });
}

// Fetch Random Cat Images
async function fetchRandomCats() {
  const response = await axiosInstance.get("/images/search", {
    params: { limit: 6 },
  });
  displayImages(response.data, gallery, "Add to Favorites", addToFavorites);
}

// Fetch Cats by Breed
async function fetchCatsByBreed(breedId) {
  const response = await axiosInstance.get("/images/search", {
    params: { breed_id: breedId, limit: 6 },
  });
  displayImages(response.data, gallery, "Add to Favorites", addToFavorites);
}

// Display Images in Gallery
function displayImages(images, container, buttonText, buttonCallback) {
  container.innerHTML = ""; // Clear previous content

  images.forEach((image) => {
    const imgContainer = document.createElement("div");
    const img = document.createElement("img");
    const btn = document.createElement("button");

    img.src = image.url;
    btn.textContent = buttonText;
    btn.onclick = () => buttonCallback(image);

    imgContainer.appendChild(img);
    imgContainer.appendChild(btn);
    container.appendChild(imgContainer);
  });
}

// Add to Favorites (POST)
async function addToFavorites(image) {
  const response = await axiosInstance.post("/favourites", {
    image_id: image.id,
  });
  if (response.data.message === "SUCCESS") {
    loadFavorites();
  }
}

// Load Favorites (GET)
async function loadFavorites() {
  const response = await axiosInstance.get("/favourites");
  displayImages(
    response.data.map((fav) => fav.image),
    favorites,
    "Remove from Favorites",
    removeFromFavorites
  );
}

// Remove from Favorites (DELETE)
async function removeFromFavorites(image) {
  const response = await axiosInstance.get("/favourites");
  const favorite = response.data.find((fav) => fav.image_id === image.id);

  if (favorite) {
    await axiosInstance.delete(`/favourites/${favorite.id}`);
    loadFavorites();
  }
}

// Event Listeners
randomBtn.addEventListener("click", fetchRandomCats);
breedSelect.addEventListener("change", (e) => {
  const breedId = e.target.value;
  if (breedId) fetchCatsByBreed(breedId);
});

// Initial Load
fetchBreeds();
loadFavorites();
