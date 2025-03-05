// Load Profile Data Based on URL Handle
document.addEventListener('DOMContentLoaded', function() {
    const urlParams = new URLSearchParams(window.location.search);
    const profileHandle = urlParams.get('handle') || localStorage.getItem('userHandle') || null;

    // Display current handle
    const currentHandleDisplay = document.getElementById('currentHandle');
    if (profileHandle) {
        currentHandleDisplay.textContent = `Handle: ${profileHandle}`;
    } else {
        currentHandleDisplay.textContent = 'Handle: None set';
    }

    // Load existing profile data if viewing a specific handle
    if (profileHandle) {
        loadProfileData(profileHandle);
    }

    // Handle Input and Save
    document.getElementById('saveHandleBtn').addEventListener('click', function() {
        const handleInput = document.getElementById('handleInput');
        const handle = handleInput.value.trim();

        if (!handle) {
            alert('Please enter a handle.');
            return;
        }
        if (!handle.startsWith('$')) {
            alert('Handle must start with $.');
            return;
        }
        if (handle.length < 2) {
            alert('Handle must be at least 2 characters long (including $).');
            return;
        }

        // Save handle and redirect
        localStorage.setItem('userHandle', handle);
        currentHandleDisplay.textContent = `Handle: ${handle}`;
        handleInput.value = ''; // Clear input
        window.location.href = `index.html?handle=${handle}`;
    });

    // Logo Upload Preview
    document.getElementById('logoUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }
        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            alert('File size must be less than 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            const preview = document.getElementById('logoPreview');
            preview.innerHTML = ''; // Clear previous preview
            preview.appendChild(img);
            // Save to localStorage (keyed by handle or 'self' if no handle)
            const saveKey = profileHandle || localStorage.getItem('userHandle') || 'self';
            localStorage.setItem(`logo_${saveKey}`, event.target.result);
        };
        reader.readAsDataURL(file);
    });

    // Screenshot Upload Preview
    document.getElementById('screenshotUpload').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            alert('File size must be less than 5MB.');
            return;
        }

        const reader = new FileReader();
        reader.onload = function(event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            const preview = document.getElementById('screenshotPreview');
            preview.innerHTML = ''; // Clear previous preview
            preview.appendChild(img);
        };
        reader.readAsDataURL(file);
    });

    // Verification Button
    document.getElementById('verifyBtn').addEventListener('click', function() {
        const screenshot = document.getElementById('screenshotUpload').files[0];
        const status = document.getElementById('verifyStatus');
        const saveKey = profileHandle || localStorage.getItem('userHandle') || 'self';

        if (!screenshot) {
            status.textContent = 'Status: Please upload a screenshot';
            return;
        }

        status.textContent = 'Status: Verification pending (manual review)';
        // Simulate verification (replace with backend call later)
        setTimeout(() => {
            status.textContent = 'Status: Verified!';
            document.getElementById('connectedSite').textContent = 'ognetwork';
            localStorage.setItem(`verified_${saveKey}`, 'ognetwork');
        }, 2000); // 2-second delay for simulation
    });

    // Public Key Generator Link
    document.getElementById('generateKeyLink').addEventListener('click', function(e) {
        e.preventDefault();
        // Placeholder: Replace with real generator URL or function
        alert('Public key generator coming soon! For now, use a random string like "xyz123".');
        // Example inline generator (uncomment to use):
        // const randomKey = Math.random().toString(36).substring(2, 15);
        // alert(`Your public key: ${randomKey}`);
    });
});

// Function to Load Profile Data
function loadProfileData(handle) {
    // Load logo
    const savedLogo = localStorage.getItem(`logo_${handle}`);
    if (savedLogo) {
        const img = document.createElement('img');
        img.src = savedLogo;
        document.getElementById('logoPreview').appendChild(img);
    }

    // Load verification status
    const savedSite = localStorage.getItem(`verified_${handle}`);
    if (savedSite) {
        document.getElementById('connectedSite').textContent = savedSite;
        document.getElementById('verifyStatus').textContent = 'Status: Verified!';
        // Disable verification inputs if already verified
        document.getElementById('screenshotUpload').disabled = true;
        document.getElementById('verifyBtn').disabled = true;
    }

    // If this isn't the user's own profile, disable editing
    const userHandle = localStorage.getItem('userHandle');
    if (handle !== userHandle) {
        document.getElementById('handleInput').disabled = true;
        document.getElementById('saveHandleBtn').disabled = true;
        document.getElementById('logoUpload').disabled = true;
        document.getElementById('screenshotUpload').disabled = true;
        document.getElementById('verifyBtn').disabled = true;
    }
}
