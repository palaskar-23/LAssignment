// ===========================
        // CHAT WIDGET LOGIC
        // ===========================

        const API_URL = "https://588wzhpgm6.execute-api.us-east-1.amazonaws.com/bhargavfunc";

        const toggleBtn   = document.getElementById("chat-toggle-btn");
        const chatFrame   = document.getElementById("chat-frame");
        const messagesDiv = document.getElementById("chat-messages");
        const chatInput   = document.getElementById("chat-input");
        const sendBtn     = document.getElementById("chat-send-btn");

        let isOpen = false;

        // Toggle open / close
        function toggleChat() {
            isOpen = !isOpen;
            toggleBtn.classList.toggle("open", isOpen);

            if (isOpen) {
                chatFrame.style.display = "flex";
                // Trigger animation on next frame
                requestAnimationFrame(() => {
                    chatFrame.classList.add("animate-in");
                    chatFrame.style.opacity = "1";
                    chatFrame.style.transform = "translateY(0) scale(1)";
                });
                chatInput.focus();
            } else {
                chatFrame.style.opacity = "0";
                chatFrame.style.transform = "translateY(12px) scale(0.97)";
                setTimeout(() => {
                    chatFrame.style.display = "none";
                    chatFrame.classList.remove("animate-in");
                }, 240);
            }
        }

        toggleBtn.addEventListener("click", toggleChat);

        // Send via chip
        function sendChip(el) {
            chatInput.value = el.textContent;
            sendMessage();
        }

        // Send message
        async function sendMessage() {
            const query = chatInput.value.trim();
            if (!query) return;

            chatInput.value = "";

            // Remove chips after first message
            const chips = messagesDiv.querySelector(".suggestion-chips");
            if (chips) chips.remove();

            appendMessage("user", query);
            const thinkingEl = appendThinking();

            try {
                const res = await fetch(API_URL, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ message: query }),
                });
                const data = await res.json();
                thinkingEl.remove();
                appendMessage("assistant", data.reply || "Sorry, I couldn't get a response.");
            } catch (err) {
                thinkingEl.remove();
                appendMessage("assistant", "Error connecting to the server. Please try again.");
                console.error("Chat error:", err);
            }
        }

        function appendMessage(role, text) {
            const div = document.createElement("div");
            div.className = role === "user" ? "msg-user" : "msg-assistant";
            div.textContent = text;
            messagesDiv.appendChild(div);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
            return div;
        }

        function appendThinking() {
            const div = document.createElement("div");
            div.className = "msg-assistant thinking";
            for (let i = 0; i < 3; i++) {
                const dot = document.createElement("span");
                dot.className = "thinking-dot";
                div.appendChild(dot);
            }
            messagesDiv.appendChild(div);
            messagesDiv.scrollTop = messagesDiv.scrollHeight;
            return div;
        }

        // Send on button click
        sendBtn.addEventListener("click", sendMessage);

        // Send on Enter
        chatInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") sendMessage();
        });

        // ===========================
        // SMOOTH SCROLL (nav links)
        // ===========================
        document.querySelectorAll('a[href^="#"]').forEach((link) => {
            link.addEventListener("click", function (e) {
                const target = document.querySelector(this.getAttribute("href"));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: "smooth" });
                }
            });
        });