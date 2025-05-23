// Settings Sync - Apply all stored settings to the current page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Global JS Loaded: Applying settings'); // Debug log

    // Apply favicon/title changes
    const savedIcon = localStorage.getItem('favicon');
    const savedTitle = localStorage.getItem('tabTitle');
    
    // Ensure favicon is updated
    function updateFavicon(iconURL) {
        console.log('Attempting to update favicon:', iconURL); // Debug log

        // Remove existing favicon links
        const existingFavicons = document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']");
        existingFavicons.forEach(link => {
            console.log('Removing existing favicon:', link); // Debug log
            link.remove();
        });
        
        // Create new favicon link
        const faviconElement = document.createElement('link');
        faviconElement.rel = 'icon';
        faviconElement.href = iconURL;
        document.head.appendChild(faviconElement);
        
        console.log('Favicon updated successfully'); // Debug log
    }
    
    // Apply saved favicon
    if (savedIcon) {
        console.log('Saved icon found:', savedIcon); // Debug log
        try {
            updateFavicon(savedIcon);
        } catch (error) {
            console.error('Error updating favicon:', error);
        }
    } else {
        console.log('No saved icon found'); // Debug log
    }
    
    // Apply saved title
    if (savedTitle) {
        console.log('Saved title found:', savedTitle); // Debug log
        document.title = savedTitle;
    } else {
        console.log('No saved title found'); // Debug log
    }
    
    // Apply search engine preference
    const searchBackend = localStorage.getItem('searchBackend') || 'UV';
    window.currentSearchEngine = searchBackend;
    
    // Check and apply Anti-close protection
    if (localStorage.getItem('anticlose') === 'true') {
        window.addEventListener('beforeunload', function(e) {
            // Only activate if not navigating through our own site
            if (!e.target.location.href.includes("redirect")) {
                e.preventDefault();
                e.returnValue = 'Leave site? Changes you made may not be saved.';
                return e.returnValue;
            }
        });
    }
});

// Favicon and Title Change Function
window.changeFavicon = function(iconURL, pageTitle) {
    console.log('Changing favicon:', iconURL, 'Title:', pageTitle); // Debug log

    // Remove existing favicon links
    const existingFavicons = document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']");
    existingFavicons.forEach(link => link.remove());
    
    // Change favicon
    const faviconElement = document.createElement('link');
    faviconElement.rel = 'icon';
    faviconElement.href = iconURL;
    document.head.appendChild(faviconElement);
    
    // Change title
    if (pageTitle) {
        document.title = pageTitle;
    }
    
    // Save preferences
    localStorage.setItem('favicon', iconURL);
    localStorage.setItem('tabTitle', pageTitle || document.title);
    
    console.log('Favicon and title updated in localStorage'); // Debug log
};

// Additional key terminal shortcut
document.addEventListener("keydown", function(e) {
    if ((e.altKey && e.key == "t")) {
        if (document.getElementById("terminal") != null) {
            document.getElementById("terminal").remove()
            return;
        }
        if (document.getElementById("terminal") == null) {
            renderFile("/terminal.html", "50%", "50%", "terminal")
            return
        }
    }
});

// Render File Function
function renderFile(url, width, height, id) { // Renders URL in a centered iframe w/ w&h set
    let fr = document.createElement("iframe")
    fr.src = url 
    fr.width = width 
    fr.height = height
    fr.id = id
    fr.style.transform = "translate(-50%, -50%)"
    fr.style.position = "absolute"
    fr.style.top = "50%"
    fr.style.left = "50%"
    fr.style.opacity = 0.9
    document.body.appendChild(fr)
}

// Delete Item Function
function deleteItem(id) {
    document.getElementById(id).remove()
}

// Load HTML Function
function loadHTML(url, elementId) {
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response threw an error  ' + response.statusText);
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(elementId).innerHTML = data;
        })
        .catch(error => console.error('Error loading HTML:', error));
}
<link rel="stylesheet" href="css/globals.css">
