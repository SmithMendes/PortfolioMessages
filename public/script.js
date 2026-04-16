document.addEventListener('DOMContentLoaded', async () => {
    const messagesContainer = document.getElementById('messages-container');
    const statusMessage = document.getElementById('status-message');

    try {
        const response = await fetch('/api/messages');
        const result = await response.json();

        if (response.ok && result.success) {
            statusMessage.innerHTML = `> Connection established. Intercepted ${result.count} transmissions.`;
            
            if (result.count === 0) {
                messagesContainer.innerHTML = '<div class="empty-state">No transmissions intercepted in the database.</div>';
                return;
            }

            result.data.forEach(msg => {
                const card = document.createElement('div');
                card.className = 'message-card';
                
                const date = new Date(msg.createdAt).toLocaleString();
                
                card.innerHTML = `
                    <div class="header-info">
                        <div>
                            <span class="label">SENDER: </span>
                            <span class="value">${escapeHTML(msg.name)}</span>
                            <br>
                            <span class="label">CONTACT: </span>
                            <span class="value">${escapeHTML(msg.email)}</span>
                        </div>
                        <div>
                            <span class="label">TIMESTAMP: </span>
                            <span class="value">${date}</span>
                        </div>
                    </div>
                    <div>
                        <span class="label">PAYLOAD:</span>
                        <div class="content">${escapeHTML(msg.message)}</div>
                    </div>
                `;
                
                messagesContainer.appendChild(card);
            });
        } else {
            statusMessage.innerHTML = "> Connection failed. Target refusing connection ✖";
            messagesContainer.innerHTML = `<div class="error-state">Failed to load data: ${result.message || 'Unknown error'}</div>`;
        }
    } catch (error) {
        statusMessage.innerHTML = "> Critical error analyzing payload ✖";
        messagesContainer.innerHTML = `<div class="error-state">Network error connecting to the API.</div>`;
        console.error("Fetch error:", error);
    }
});

// Utility to prevent XSS injection
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag])
    );
}
