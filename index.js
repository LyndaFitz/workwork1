// Axios configuration
axios.defaults.baseURL = 'https://api.thecatapi.com/v1/';
axios.defaults.headers.common['x-api-key'] = 'live_52cwP0wGS5YSawXroZqOLcAjuEx9IuvsnVlJ5UGYtEyoh01nrnujl6UcyIS8lKNx';

// Initialize the page by loading the cat breeds
async function initialLoad() {
    try {
        const response = await axios.get('breeds');
        const breeds = response.data;

        // Populate breedSelect dropdown
        const breedSelect = document.getElementById('breedSelect');
        breeds.forEach(breed => {
            const option = document.createElement('option');
            option.value = breed.id;
            option.textContent = breed.name;
            breedSelect.appendChild(option);
        });

        // Load images for the first breed
        await updateCarousel(breeds[0].id);
    } catch (error) {
        console.error("Error loading breeds:", error);
    }
}

// Event listener for breed selection change
document.getElementById('breedSelect').addEventListener('change', async function (event) {
    const selectedBreedId = event.target.value;
    if (selectedBreedId) {
        await updateCarousel(selectedBreedId);
    }
});

// Update the carousel with images based on breed selection
async function updateCarousel(breedId) {
    const carousel = document.getElementById('carousel');
    const progressBarContainer = document.getElementById('progressBarContainer');
    const progressBar = document.getElementById('progressBar');

    // Show the progress bar
    progressBarContainer.style.display = 'block';
    progressBar.style.width = '0%';

    try {
        const response = await axios.get(`images/search?breed_id=${breedId}&limit=5`, {
            onDownloadProgress: updateProgress
        });

        const images = response.data;
        carousel.innerHTML = ''; // Clear previous images

        images.forEach(image => {
            const imgElement = document.createElement('img');
            imgElement.src = image.url;
            imgElement.alt = 'Cat Image';
            imgElement.onclick = () => favorite(image.id); // Toggle favorite on click
            carousel.appendChild(imgElement);
        });

        // Update breed information
        const breedDescription = document.getElementById('breedDescription');
        const breedInfoResponse = await axios.get(`breeds/${breedId}`);
        breedDescription.textContent = breedInfoResponse.data.description;

    } catch (error) {
        console.error("Error fetching breed images:", error);
    } finally {
        // Hide progress bar after loading images
        progressBarContainer.style.display = 'none';
    }
}

// Update progress bar during the download
function updateProgress(event) {
    const progressBar = document.getElementById('progressBar');
    const percentage = Math.round((event.loaded * 100) / event.total);
    progressBar.style.width = `${percentage}%`;
}

// Toggle favorite status for a cat image
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

// Display all favorites
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

// Call the initialLoad function to load data on page load
initialLoad();


