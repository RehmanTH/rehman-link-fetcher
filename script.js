document.addEventListener('DOMContentLoaded', async function() {
    // Custom field se links lena
    const links = document.querySelector('#rehman_page_links_data').value.split('\n').filter(link => link.trim() !== '');
    const defaultLink = 'https://rehmanbhaivideourlvideo.cometc';
    const linkDisplay = document.querySelector('#rehman_video_link_display');

    // Agar pehle se link saved ho
    if (localStorage.getItem('rehman_video_link')) {
        linkDisplay.textContent = localStorage.getItem('rehman_video_link');
        return;
    }

    // Fast fetching ke liye Promise.all
    const fetchPromises = links.map(async link => {
        try {
            const response = await fetch(link, { mode: 'no-cors' }); // Background mein fast chalega
            const text = await response.text();
            // Video link dhundhne ke liye regex (tumhare example ke hisaab se)
            const regex = /https?:\/\/watchadsontape\.com\/get_video\?id=[^&]+&expires=\d+&ip=[^&]+&token=[^&]+&stream=\d+/i;
            const match = text.match(regex);
            return match ? match[0] : null;
        } catch (error) {
            console.log('Error fetching:', link, error);
            return null;
        }
    });

    // Sab links ek sath fetch karna
    const results = await Promise.all(fetchPromises);
    const fetchedLink = results.find(link => link !== null); // Pehla valid link lena

    if (fetchedLink) {
        linkDisplay.textContent = fetchedLink; // Browser mein replace
        localStorage.setItem('rehman_video_link', fetchedLink); // Browser mein save
    } else {
        console.log('Koi valid video link nahi mila');
        linkDisplay.textContent = 'Link nahi mila';
    }
});