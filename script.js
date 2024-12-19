document.addEventListener('DOMContentLoaded', () => {
    const modeToggle = document.getElementById('mode-toggle');
    const searchButton = document.getElementById('search-button');
    const searchBar = document.getElementById('search-bar');
    const resultsSection = document.getElementById('results-section');
    const videoPlayer = document.getElementById('video-player');
    const errorMessage = document.createElement('p');
    errorMessage.style.display = 'none';
    errorMessage.style.color = 'red';
    errorMessage.innerText = 'This video is unavailable or cannot be embedded.';

    const API_KEY = 'AIzaSyBGjU4fnXO_CkgiAWZ8CDk0b3_f3s_R6QU'; // Replace with your actual API key

    // Light/Dark Mode Toggle
    modeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
    });

    // Search YouTube Videos
    searchButton.addEventListener('click', () => {
        const query = searchBar.value;
        fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&q=${query}&key=${API_KEY}`)
            .then(response => response.json())
            .then(data => {
                resultsSection.innerHTML = '';
                data.items.forEach(item => {
                    const videoId = item.id.videoId;
                    const videoTitle = item.snippet.title;
                    const videoThumbnail = item.snippet.thumbnails.high.url;

                    const videoElement = document.createElement('div');
                    videoElement.classList.add('video-result');
                    videoElement.innerHTML = `
                        <img src="${videoThumbnail}" alt="${videoTitle}">
                        <p>${videoTitle}</p>
                    `;
                    videoElement.addEventListener('click', () => {
                        // Clear any previous error messages
                        errorMessage.style.display = 'none';
                        videoPlayer.style.display = 'block';

                        // Attempt to load the video in the iframe
                        videoPlayer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
                        
                        // Check if the video is available to embed
                        videoPlayer.onload = () => {
                            // If the video loaded successfully, hide the error message
                            errorMessage.style.display = 'none';
                        };
                        
                        videoPlayer.onerror = () => {
                            // If there was an error loading the video, show the error message
                            videoPlayer.style.display = 'none';
                            errorMessage.style.display = 'block';
                        };
                    });
                    resultsSection.appendChild(videoElement);
                });
            })
            .catch(error => console.error('Error fetching YouTube API:', error));
    });

    // Append the error message to the results section
    resultsSection.appendChild(errorMessage);
});
