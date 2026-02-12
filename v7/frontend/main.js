import './style.css'

// Fetch news from the backend and display it
async function fetchNews() {
  const newsContainer = document.getElementById('news-container');
  newsContainer.innerHTML = '<p>Loading news...</p>'; // Show loading state

  try {
    const response = await fetch('http://localhost:3007/api/news');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data.items && data.items.length > 0) {
      newsContainer.innerHTML = ''; // Clear loading message
      data.items.forEach(item => {
        const newsItem = document.createElement('div');
        newsItem.className = 'news-item';
        newsItem.innerHTML = `
          <h3><a href="${item.link}" target="_blank">${item.title}</a></h3>
          <p>${item.description}</p>
          <p><strong>State:</strong> ${item.state || 'N/A'}</p>
          <p class="source-date">${item.source} - ${new Date(item.pubDate).toLocaleDateString()}</p>
        `;
        newsItem.style.border = '1px solid #ccc';
        newsItem.style.padding = '10px';
        newsItem.style.marginBottom = '10px';
        newsContainer.appendChild(newsItem);
      });
    } else {
      newsContainer.innerHTML = '<p>No news items found.</p>';
    }
  } catch (error) {
    console.error('Error fetching news:', error);
    newsContainer.innerHTML = `<p>Error loading news: ${error.message}</p>`;
  }
}

fetchNews();
