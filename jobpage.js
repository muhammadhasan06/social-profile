   // DOM Elements
        const postsContainer = document.getElementById('postsContainer');
        const postInput = document.getElementById('postInput');
        const imageUrlInput = document.getElementById('imageUrlInput');
        const postBtn = document.getElementById('postBtn');
        const searchInput = document.getElementById('searchInput');
        const filterBtns = document.querySelectorAll('.filter-btn');
        const themeToggle = document.getElementById('themeToggle');
        const editModal = document.getElementById('editModal');
        const editPostInput = document.getElementById('editPostInput');
        const editImageUrlInput = document.getElementById('editImageUrlInput');
        const cancelEdit = document.getElementById('cancelEdit');
        const saveEdit = document.getElementById('saveEdit');
        const deleteModal = document.getElementById('deleteModal');
        const cancelDelete = document.getElementById('cancelDelete');
        const confirmDelete = document.getElementById('confirmDelete');

        // Load posts from localStorage or use sample posts
        let posts = JSON.parse(localStorage.getItem('posts')) || [
            {
                id: 1,
                user: "John Doe",
                text: "Just finished my morning run! Feeling energized for the day ahead. 🏃‍♂️",
                time: "2 hours ago",
                likes: 15,
                liked: false,
                imageUrl: "",
                reactions: { '😂': 0, '👍': 0, '😢': 0, '🔥': 0 },
                userReaction: null
            },
            {
                id: 2,
                user: "Sarah Smith",
                text: "Beautiful sunset at the beach today. Nature always has a way of calming the soul. 🌅",
                time: "5 hours ago",
                likes: 42,
                liked: true,
                imageUrl: "",
                reactions: { '😂': 0, '👍': 0, '😢': 0, '🔥': 0 },
                userReaction: null
            },
            {
                id: 3,
                user: "Mike Johnson",
                text: "Working on a new project that I'm really excited about! Can't wait to share more details soon. 💼",
                time: "1 day ago",
                likes: 28,
                liked: false,
                imageUrl: "",
                reactions: { '😂': 0, '👍': 0, '😢': 0, '🔥': 0 },
                userReaction: null
            },
            {
                id: 4,
                user: "Emily Chen",
                text: "Tried a new recipe today - homemade pasta from scratch! It turned out better than expected. 🍝",
                time: "1 day ago",
                likes: 36,
                liked: false,
                imageUrl: "",
                reactions: { '😂': 0, '👍': 0, '😢': 0, '🔥': 0 },
                userReaction: null
            }
        ];

        // State variables
        let currentFilter = 'latest';
        let postToEdit = null;
        let postToDelete = null;

        // Initialize the app
        function init() {
            renderPosts();
            setupEventListeners();
            loadTheme();
        }

        // Set up event listeners
        function setupEventListeners() {
            postBtn.addEventListener('click', createPost);
            searchInput.addEventListener('input', filterPosts);
            
            for (let i = 0; i < filterBtns.length; i++) {
                filterBtns[i].addEventListener('click', function() {
                    for (let j = 0; j < filterBtns.length; j++) {
                        filterBtns[j].classList.remove('active');
                    }
                    this.classList.add('active');
                    currentFilter = this.dataset.filter;
                    renderPosts();
                });
            }
            
            themeToggle.addEventListener('click', toggleTheme);
            cancelEdit.addEventListener('click', function() { editModal.style.display = 'none'; });
            saveEdit.addEventListener('click', saveEditedPost);
            cancelDelete.addEventListener('click', function() { deleteModal.style.display = 'none'; });
            confirmDelete.addEventListener('click', deletePostConfirmed);
        }

        // Create a new post
        function createPost() {
            const text = postInput.value.trim();
            const imageUrl = imageUrlInput.value.trim();
            
            if (!text && !imageUrl) {
                alert('Please enter some text or an image URL');
                return;
            }
            
            const newPost = {
                id: Date.now(),
                user: "You", // In a real app, this would be the logged-in user
                text: text,
                imageUrl: imageUrl,
                time: 'Just now',
                likes: 0,
                liked: false,
                reactions: { '😂': 0, '👍': 0, '😢': 0, '🔥': 0 },
                userReaction: null
            };
            
            posts.unshift(newPost);
            savePosts();
            renderPosts();
            
            // Clear inputs
            postInput.value = '';
            imageUrlInput.value = '';
        }

        // Render posts based on current filter and search
        function renderPosts() {
            let filteredPosts = [];
            
            // Copy posts array
            for (let i = 0; i < posts.length; i++) {
                filteredPosts.push(posts[i]);
            }
            
            // Apply search filter
            const searchTerm = searchInput.value.toLowerCase();
            if (searchTerm) {
                let tempPosts = [];
                for (let i = 0; i < filteredPosts.length; i++) {
                    if (filteredPosts[i].text.toLowerCase().includes(searchTerm) || 
                        filteredPosts[i].user.toLowerCase().includes(searchTerm)) {
                        tempPosts.push(filteredPosts[i]);
                    }
                }
                filteredPosts = tempPosts;
            }
            
            // Apply sort filter
            switch(currentFilter) {
                case 'latest':
                    // Already sorted by latest due to unshift in createPost
                    break;
                case 'oldest':
                    filteredPosts.sort(function(a, b) { return a.id - b.id; });
                    break;
                case 'most-liked':
                    filteredPosts.sort(function(a, b) { return b.likes - a.likes; });
                    break;
            }
            
            // Clear container
            postsContainer.innerHTML = '';
            
            // Render each post
            if (filteredPosts.length === 0) {
                postsContainer.innerHTML = '<div class="no-results">No posts found matching your search.</div>';
                return;
            }
            
            for (let i = 0; i < filteredPosts.length; i++) {
                const postElement = createPostElement(filteredPosts[i]);
                postsContainer.appendChild(postElement);
            }
        }

        // Create a post element
        function createPostElement(post) {
            const postDiv = document.createElement('div');
            postDiv.className = 'post';
            postDiv.dataset.id = post.id;
            
            // Get user initial for avatar
            const userInitial = post.user.charAt(0);
            
            postDiv.innerHTML = `
                <div class="post-header">
                    <div class="post-avatar">${userInitial}</div>
                    <div>
                        <div class="post-user">${post.user}</div>
                        <div class="post-time">${post.time}</div>
                    </div>
                </div>
                <div class="post-content">${post.text}</div>
                ${post.imageUrl ? `<img src="${post.imageUrl}" class="post-image" alt="Post image">` : ''}
                <div class="post-actions">
                    <button class="like-btn ${post.liked ? 'liked' : ''}">
                        ❤️ <span class="like-count">${post.likes}</span>
                    </button>
                    <div>
                        <button class="edit-btn">✏️</button>
                        <button class="delete-btn">🗑️</button>
                    </div>
                </div>
                <div class="reactions">
                    <button class="reaction-btn" data-reaction="😂">😂 <span>${post.reactions['😂']}</span></button>
                    <button class="reaction-btn" data-reaction="👍">👍 <span>${post.reactions['👍']}</span></button>
                    <button class="reaction-btn" data-reaction="😢">😢 <span>${post.reactions['😢']}</span></button>
                    <button class="reaction-btn" data-reaction="🔥">🔥 <span>${post.reactions['🔥']}</span></button>
                </div>
            `;
            
            // Add event listeners to buttons
            const likeBtn = postDiv.querySelector('.like-btn');
            likeBtn.addEventListener('click', function() { toggleLike(post.id); });
            
            const deleteBtn = postDiv.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', function() { confirmDeletePost(post.id); });
            
            const editBtn = postDiv.querySelector('.edit-btn');
            editBtn.addEventListener('click', function() { openEditModal(post.id); });
            
            const reactionBtns = postDiv.querySelectorAll('.reaction-btn');
            for (let i = 0; i < reactionBtns.length; i++) {
                reactionBtns[i].addEventListener('click', function() { 
                    addReaction(post.id, this.dataset.reaction); 
                });
            }
            
            return postDiv;
        }

        // Toggle like on a post
        function toggleLike(postId) {
            for (let i = 0; i < posts.length; i++) {
                if (posts[i].id === postId) {
                    if (posts[i].liked) {
                        // Unlike the post
                        posts[i].liked = false;
                        posts[i].likes--;
                    } else {
                        // Like the post
                        posts[i].liked = true;
                        posts[i].likes++;
                    }
                    break;
                }
            }
            
            savePosts();
            renderPosts();
        }

        // Add reaction to a post
        function addReaction(postId, reaction) {
            for (let i = 0; i < posts.length; i++) {
                if (posts[i].id === postId) {
                    // If user already had a reaction, remove it
                    if (posts[i].userReaction && posts[i].userReaction !== reaction) {
                        posts[i].reactions[posts[i].userReaction]--;
                    }
                    
                    // Toggle reaction if clicking the same one
                    if (posts[i].userReaction === reaction) {
                        posts[i].userReaction = null;
                        posts[i].reactions[reaction]--;
                    } else {
                        posts[i].userReaction = reaction;
                        posts[i].reactions[reaction]++;
                    }
                    
                    break;
                }
            }
            
            savePosts();
            renderPosts();
        }

        // Open edit modal
        function openEditModal(postId) {
            for (let i = 0; i < posts.length; i++) {
                if (posts[i].id === postId) {
                    postToEdit = postId;
                    editPostInput.value = posts[i].text;
                    editImageUrlInput.value = posts[i].imageUrl || '';
                    editModal.style.display = 'flex';
                    break;
                }
            }
        }

        // Save edited post
        function saveEditedPost() {
            if (postToEdit) {
                for (let i = 0; i < posts.length; i++) {
                    if (posts[i].id === postToEdit) {
                        posts[i].text = editPostInput.value;
                        posts[i].imageUrl = editImageUrlInput.value;
                        savePosts();
                        renderPosts();
                        editModal.style.display = 'none';
                        postToEdit = null;
                        break;
                    }
                }
            }
        }

        // Confirm delete post
        function confirmDeletePost(postId) {
            postToDelete = postId;
            deleteModal.style.display = 'flex';
        }

        // Delete post
        function deletePostConfirmed() {
            if (postToDelete) {
                for (let i = 0; i < posts.length; i++) {
                    if (posts[i].id === postToDelete) {
                        posts.splice(i, 1);
                        break;
                    }
                }
                savePosts();
                renderPosts();
                deleteModal.style.display = 'none';
                postToDelete = null;
            }
        }

        // Filter posts based on search
        function filterPosts() {
            renderPosts();
        }

        // Toggle dark/light mode
        function toggleTheme() {
            document.body.classList.toggle('dark-mode');
            themeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
            localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
        }

        // Load theme from localStorage
        function loadTheme() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.body.classList.add('dark-mode');
                themeToggle.textContent = '☀️';
            }
        }

        // Save posts to localStorage
        function savePosts() {
            localStorage.setItem('posts', JSON.stringify(posts));
        }

        // Initialize the app
        init();