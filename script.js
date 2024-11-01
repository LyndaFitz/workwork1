axios.defaults.baseURL = 'https://api.thecatapi.com/v1/';
axios.defaults.headers.common['x-api-key'] = 'YOUR_API_KEY'; // Replace with your actual API key

async function initialLoad() {
    const response = await axios.get('breeds');
    const breeds = response.data;

    const breedSelect = document.getElementById('breedSelect');
    breeds.forEach(breed => {
        const option = document.createElement('option');
        option.value = breed.id;
        option.textContent = breed.name;
        breedSelect.appendChild(option);
    });

    // Load initial breed
    await updateCarousel(breeds[0].id);
}
//  pushing testing testing
document.getElementById('breedSelect').addEventListener('change', async function (event) {
    const selectedBreedId = event.target.value;
    await updateCarousel(selectedBreedId);
});

async function updateCarousel(breedId) {
    const response = await axios.get(`images/search?breed_id=${breedId}&limit=5`);
    const images = response.data;

    const carousel = document.getElementById('carousel');
    carousel.innerHTML = ''; // Clear previous images

    images.forEach(image => {
        const imgElement = document.createElement('img');
        imgElement.src = image.url;
        imgElement.alt = 'Cat Image';
        imgElement.onclick = () => favorite(image.id); // Toggle favorite on click
        carousel.appendChild(imgElement);
    });
}

document.getElementById('getFavouritesBtn').addEventListener('click', async () => {
    const { data: favourites } = await axios.get('favourites');
    const carousel = document.getElementById('carousel');
    carousel.innerHTML = ''; // Clear previous images

    favourites.forEach(fav => {
        const imgElement = document.createElement('img');
        imgElement.src = fav.image.url;
        imgElement.alt = 'Favorite Cat Image';
        imgElement.onclick = () => favorite(fav.image_id); // Toggle favorite on click
        carousel.appendChild(imgElement);
    });
});

async function favorite(imageId) {
    try {
        const favouritesResponse = await axios.get('favourites');
        const favoriteIds = favouritesResponse.data.map(fav => fav.image_id);
        
        if (favoriteIds.includes(imageId)) {
            await axios.delete(`favourites/${imageId}`);
        } else {
            await axios.post('favourites', { image_id: imageId });
        }
    } catch (error) {
        console.error('Error favoriting image:', error);
    }
}

initialLoad();
