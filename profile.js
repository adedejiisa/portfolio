const token = localStorage.getItem("token");
const currentUserId = localStorage.getItem("userId");


const openEditContainer = document.getElementById("openEditContainer");
const closeEditContainer = document.getElementById("closeEditContainer");
const overlay = document.getElementById("overlay");
const editContainer = document.getElementById("editContainer");
openEditContainer.addEventListener("click", () => {
    editContainer.style.display = "block";
    overlay.classList.remove("hidden");
});
closeEditContainer.addEventListener("click", () => {
    editContainer.style.display = "none";
    overlay.classList.add("hidden");
});
overlay.addEventListener("click", () => {
    editContainer.style.display = "none";
    overlay.classList.add("hidden");
});

    // Convert hashtags in text to clickable links
function linkifyHashtags(text) {
  if (!text) return "";
  return text.replace(/#(\w+)/g, (match, tag) => {
    return `<a href="/hashtag.html?tag=${tag}" class="hashtag-link">#${tag}</a>`;
  });
}


   //HELPER
document.addEventListener("DOMContentLoaded", async () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("userId");

    const token = localStorage.getItem("token");

    let url;

    // Decide which profile to load
    if (userId) {
      // Someone else's profile
      url = `https://afrisocial-backend.onrender.com/api/users/${userId}`;
    } else {
      // My profile
      url = `https://afrisocial-backend.onrender.com/api/users/me`;
    }

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to load profile");

    const user = await res.json();

     // PROFILE PICTURE
    const profilePic = document.getElementById("profilePic");
   profilePic.src = user.profilePicture || "/uploads/images/africa.png";

     // PROFILE PREVIEW (for edit modal)
const profilePreview = document.getElementById("profilePreview");
if (profilePreview) {
  profilePreview.src = user.profilePicture || "/uploads/images/africa.png";
} 
      
  } catch (err) {
    console.error("Failed to load profile:", err);
  }
});

// ================= PROFILE PICTURE & EDIT PROFILE =================
const profileImage = document.getElementById("profileImage");
const profilePreview = document.getElementById("profilePreview");
const saveBtn = document.getElementById("saveProfileBtn");
const baseUrl = "https://afrisocial-backend.onrender.com";

// Show preview when user selects a new image
profileImage.addEventListener("change", function () {
  const file = this.files[0];
  if (file) {
    profilePreview.src = URL.createObjectURL(file);
  }
});

// Handle form submission
saveBtn.addEventListener("click", async (e) => {
  e.preventDefault();

  const fullName = document.getElementById("editFullName").value.trim();
  const username = document.getElementById("editUsername").value.trim();
  const bio = document.getElementById("editBio").value.trim();
  const country = document.getElementById("editCountry").value;
  const profilePicFile = profileImage.files[0];

  if (!fullName || !username) {
    alert("Full name and username are required!");
    return;
  }

  const formData = new FormData();
  formData.append("fullName", fullName);
  formData.append("username", username);
  formData.append("bio", bio);
  formData.append("country", country);

  if (profilePicFile) {
    formData.append("profilePicture", profilePicFile); // must match backend
  }

  try {
    const response = await fetch(`${baseUrl}/api/users/update-profile`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: formData
    });

    const data = await response.json();

    if (!response.ok) {
      alert(data.message || "Update failed");
      return;
    }

    alert("Profile updated successfully!");

    if (data.user.profilePicture) {
      document.querySelectorAll("img[data-user-profile]").forEach(img => {
        img.src = data.user.profilePicture;
      });
    }
  } catch (err) {
    console.error("Profile update error:", err);
    alert("Something went wrong while updating profile.");
  }
});

const openFollowingTab = document.getElementById("openFollowingTab");
const closeFollowingTab = document.getElementById("closeFollowingTab");
const followingTab = document.getElementById("followingTab");
openFollowingTab.addEventListener("click", () => {
    followingTab.style.display = "block";
    overlay.classList.remove("hidden");
});
closeFollowingTab.addEventListener("click", () => {
    followingTab.style.display = "none";
    overlay.classList.add("hidden");
});
overlay.addEventListener("click", () => {
    followingTab.style.display = "none";
    overlay.classList.add("hidden");
});


const openFollowersTab = document.getElementById("openFollowersTab");
const closeFollowersTab = document.getElementById("closeFollowersTab");
const followersTab = document.getElementById("followersTab");
openFollowersTab.addEventListener("click", () => {
    followersTab.style.display = "block";
    overlay.classList.remove("hidden");
});
closeFollowersTab.addEventListener("click", () => {
    followersTab.style.display = "none";
    overlay.classList.add("hidden");
});
overlay.addEventListener("click", () => {
    followersTab.style.display = "none";
    overlay.classList.add("hidden");
});



const openPublicViewSettings = document.getElementById("openPublicViewSettings");
const closePublicViewSettings = document.getElementById("closePublicViewSettings");
const publicViewSettings = document.getElementById("publicViewSettings");
openPublicViewSettings.addEventListener("click", () => {
    publicViewSettings.style.display = "block";
    overlay.classList.remove("hidden");
});
closePublicViewSettings.addEventListener("click", () => {
    publicViewSettings.style.display = "none";
    overlay.classList.add("hidden");
});
overlay.addEventListener("click", () => {
    publicViewSettings.style.display = "none";
    overlay.classList.add("hidden");
});


// PROFILE PAGE 
function getLoggedInUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.userId;
  } catch {
    return null;
  }
}

// Get URL query parameters
const params = new URLSearchParams(window.location.search);
const profileUserId = params.get("userId"); // public profile link
const myFallbackId = localStorage.getItem("userId"); // user own ID from session/token


// Decide which profile to load
if (profileUserId && profileUserId !== myFallbackId) {
  // Viewing another user’s profile
  loadPublicProfile(profileUserId);
} else if (myFallbackId) {
  // Viewing own profile
  loadMyProfile(myFallbackId);
} else {
  console.error("No user ID found to load profile");
}

// ---------------- FUNCTIONS ----------------

async function loadMyProfile() {
  try {
    if (!token) {
      alert("Please login");
      window.location.href = "/login.html";
      return;
    }

    const res = await fetch("https://afrisocial-backend.onrender.com/api/users/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    fillProfileUI(data);
    loadProfileLikesStars(data._id);
    //hideFollowButton(); // You can't follow yourself

    // Hide message button ( you can't message yourself)
    const messageBtn = document.getElementById("messageBtn");
    if (messageBtn) messageBtn.style.display = "none";

    loadProfilePosts(data._id);

    loadFollowers(data._id);
    loadFollowing(data._id);

  } catch (err) {
    console.error(err);
    showProfileError();
  }
}

async function loadPublicProfile(userId) {
  try {
    const res = await fetch(`https://afrisocial-backend.onrender.com/api/users/${userId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : ""
      }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    fillProfileUI(data);
    loadProfileLikesStars(data._id);

     // MESSAGE BUTTON
    const messageBtn = document.getElementById("messageBtn");

if (messageBtn) {
  messageBtn.addEventListener("click", async (e) => {
    e.preventDefault(); // STOP browser auto navigation

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        "https://afrisocial-backend.onrender.com/api/messages/createConversation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            receiverId: data._id // profile user's ID
          })
        }
      );

      if (!res.ok) {
        const err = await res.json();
        console.error("Conversation error:", err);
        return;
      }

      const conversation = await res.json();


      // ONLY redirect after conversation exists
      window.location.href =
        `/message.html?conversationId=${conversation._id}`;

    } catch (error) {
      console.error("Message button failed:", error);
    }
  });
}

loadProfilePosts(profileUserId);

loadFollowers(data._id);
loadFollowing(data._id);

const loggedInUserId = getLoggedInUserId();

if (loggedInUserId && loggedInUserId !== data._id) {
  setupFollowButton(data._id, data.isFollowing);
} else {
  const btn = document.getElementById("followBtn");
  if (btn) btn.style.display = "none";
}

  } catch (err) {
    console.error(err);
    showProfileError();
  }
}



//============= likes and stars count =================
async function loadProfileLikesStars(userId) {
  if (!userId) return;

  try {
    const res = await fetch(`${baseUrl}/api/users/${userId}/likes-stars`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to fetch likes & stars");

    const data = await res.json();
    const likesEl = document.getElementById("likesCount");
    const starsEl = document.getElementById("starsCount");

    if (likesEl) likesEl.innerText = data.likes ?? 0;
    if (starsEl) starsEl.innerText = data.stars ?? 0;
  } catch (err) {
    console.error("Error loading likes & stars:", err);
  }
}


// ---------------- UI HELPERS ----------------

function fillProfileUI(data) {
  document.getElementById("fullName").innerText = data.fullName;
  document.getElementById("username").innerText = "@" + data.username;
  document.getElementById("bio").innerText = data.bio || "No bio yet";
  document.getElementById("profilePic").src =
    data.profilePicture || "/uploads/images/africa.png";

  document.getElementById("country").innerText =
    getCountryFlagEmoji(data.country);

  document.getElementById("joined").innerText =
    "Joined " + new Date(data.createdAt).toDateString();

  document.getElementById("followersCount").innerText =
    data.followersCount ?? 0;

  document.getElementById("followingCount").innerText =
    data.followingCount ?? 0;
    
 const badge = document.getElementById("verifiedBadge");

if (badge && data.isVerified === true) {
  badge.style.display = "inline-block";
  }
}

function showProfileError() {
  document.getElementById("profileError").innerText =
    "Failed to load profile";
}

function hideFollowButton() {
  const btn = document.getElementById("followBtn");
  if (btn) btn.style.display = "none";
}

function getCountryFlagEmoji(code) {
  return code
    ?.toUpperCase()
    .replace(/./g, c =>
      String.fromCodePoint(127397 + c.charCodeAt())
    );
}
// Helpers
function getFlagEmoji(countryCode) {
  if (!countryCode) return "";
  return countryCode
    .toUpperCase()
    .replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt()));
}

function setupFollowButton(userId, isFollowing) {
  const btn = document.getElementById("followBtn");
  if (!btn) return;

  btn.style.display = "inline-block"; // FORCE SHOW

  let following = isFollowing;

  render();

  btn.onclick = async () => {
    const token = localStorage.getItem("token");

    await fetch(`https://afrisocial-backend.onrender.com/api/users/follow/${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    following = !following;
    render();
  };

  function render() {
    if (following) {
      btn.innerText = "Following";
      btn.classList.add("following");
    } else {
      btn.innerText = "Follow";
      btn.classList.remove("following");
    }
  }
}

//HIDE EDIT BUTTON IF VIEWER IS NOT ACCOUNT OWNER
const hamburgerIcon = document.getElementById("hamburgerIcon");

  if (profileUserId && profileUserId !== currentUserId) {
    openEditContainer.style.visibility = "hidden";
  } else {
    openEditContainer.style.display = "block";
  }

  //SHOW OPTION BUTTON IF VIEWER IS NOT ACCOUNT OWNER
  if (profileUserId && profileUserId !== currentUserId) {
    openPublicViewSettings.style.display = "block";
  } else {
    openPublicViewSettings.style.visibility = "hidden";
  }

  //HIDE HAMBURGER ICON IF VIEWER IS NOT ACCOUNT OWNER
  if (profileUserId && profileUserId !== currentUserId) {
    hamburgerIcon.style.visibility = "hidden";
  } else {
    hamburgerIcon.style.display = "block";
  }


  // PROFILE TAB SELECTOR
  document.querySelectorAll(".tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab + "Tab").classList.add("active");
  });
});

// HELPER
const defaultAvatar = "/uploads/images/africa.png";

function getProfilePic(user) {
  if (!user) return defaultAvatar;

  const pic = user.profilePicture;

  if (!pic || pic.trim() === "") {
    return defaultAvatar;
  }

  // If already full URL (Cloudinary)
  if (pic.startsWith("http")) {
    return pic;
  }

  // If local upload path
  return `${baseUrl}${pic}`;
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - new Date(date)) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

// Helper to get correct media URL
function getMediaUrl(path) {
  if (!path) return "";
  // If starts with http(s), return as-is (Cloudinary)
  if (path.startsWith("http")) return path;
  // Otherwise, prepend  baseUrl for local uploads
  return `${baseUrl}${path}`;
}

// POSTS TAB
const postsTab = document.getElementById("postsTab");

function renderPost(post, container) {
  const user = post.user || {};

  const div = document.createElement("div");
  div.className = "post";
  div.dataset.postId = post._id;

  let mediaHtml = "";

  if (post.images?.length) {
    mediaHtml += `<div class="image-slider-wrapper"><div class="image-slider">`;
    post.images.forEach(img => {
  mediaHtml += `<img src="${getMediaUrl(img)}" class="post-media slide">`;
  });
    mediaHtml += `</div></div>`;
  }

  if (post.video) {
    mediaHtml += `
      <div class="video-wrapper">
        <video class="post-media video"
          src="${getMediaUrl(post.video)}"
          muted autoplay loop playsinline>
        </video>
        <button class="mute-btn">🔇</button>
      </div>`;
  }

  div.innerHTML = `
    <div class="post-header">
     <img src="${user.profilePicture || '/uploads/images/africa.png'}" class="profile-pic">
      <div>
        <strong class="full-name">${user.fullName} ${user.isVerified ? `
    <svg class="verified-icon" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#1DA1F2"/>
      <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"/>
    </svg>
  ` : ""} ${getCountryFlagEmoji(user.country)}
  <small>${timeAgo(post.createdAt)}</small>
  </strong>
      </div>
    </div>

    <p class="text-body">${linkifyHashtags(post.text)}</p>
    <div class="post-media-container">${mediaHtml}</div>

    <div class="post-actions">
      <button class="action-btn love-btn ${(post.likes || []).includes(currentUserId) ? "liked" : ""}">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-heart-icon lucide-heart"><path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5"/></svg>
      <span class="count">${post.likes.length}</span>
      </button>

      <button class="action-btn comment-btn">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square-icon lucide-message-square"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/></svg>
      <span class="count">${post.commentCount || 0}</span>
      </button>

      <button class="action-btn star-btn ${(post.stars || []).includes(currentUserId) ? "starred" : ""}">
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-star-icon lucide-star"><path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"/></svg>
      <span class="count">${post.stars.length}</span>
      </button>
       ${post.video ? `<span class="view-count">views ${post.views || 0}</span>` : ""}
    </div>
  `;

  container.appendChild(div);
}

async function loadProfilePosts(userId) {
  if (!userId) {
    console.error("loadProfilePosts called with undefined userId");
    return;
  }

  try {
    const res = await fetch(`${baseUrl}/api/posts/user/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("Failed to load posts:", data);
      return;
    }

    postsTab.innerHTML = "";

    if (!data.posts.length) {
      postsTab.innerHTML = "<p>No posts yet</p>";
      return;
    }

    data.posts.forEach(post => {
      renderPost(post, postsTab);
    });

    initImageSliders();
    initVideoControls();
  } catch (err) {
    console.error("Profile post load error:", err);
  }
}

// ======= VIDEO VIEW TRACKING =======
const viewedVideos = new Set();

// ======= IMAGE SLIDER =======
function initImageSliders() {
  document.querySelectorAll(".image-slider-wrapper").forEach(wrapper => {
    const slider = wrapper.querySelector(".image-slider");
    const slides = slider.querySelectorAll(".slide");
    let current = 0;

    // Show first slide
    slides.forEach((s, i) => s.style.display = i === 0 ? "block" : "none");

    // Create counter if more than 1 image
    let counter = null;
    if (slides.length > 1) {
      counter = document.createElement("div");
      counter.className = "image-counter";
      counter.textContent = `${current + 1} / ${slides.length}`;
      wrapper.appendChild(counter);
    }

    // Swipe / click functionality
    let startX = 0;
    let endX = 0;

    wrapper.addEventListener("touchstart", e => startX = e.touches[0].clientX);
    wrapper.addEventListener("touchmove", e => endX = e.touches[0].clientX);
    wrapper.addEventListener("touchend", () => {
      if (slides.length < 2) return;
      if (startX - endX > 50) changeSlide(1);    // swipe left → next
      else if (endX - startX > 50) changeSlide(-1); // swipe right → prev
    });

    // Click to next slide (desktop fallback)
    slider.addEventListener("click", () => {
      if (slides.length > 1) changeSlide(1);
    });

    function changeSlide(dir) {
      slides[current].style.display = "none";
      current = (current + dir + slides.length) % slides.length;
      slides[current].style.display = "block";
      if (counter) counter.textContent = `${current + 1} / ${slides.length}`;
    }
  });
}

// ======= VIDEO CONTROLS + VIEWS =======
function initVideoControls() {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const video = entry.target;
      const postId = video.closest(".post").dataset.postId;
      const viewCountEl = video.closest(".post").querySelector(".view-count");

      if (entry.isIntersecting) {
        video.play().catch(() => {});
        if (!viewedVideos.has(postId)) {
          video._viewTimer = setTimeout(async () => {
            viewedVideos.add(postId);
            const newViews = await sendVideoView(postId);
            if (viewCountEl) viewCountEl.textContent = `Views ${newViews}`;
          }, 2000); // 2s minimum watch
        }
      } else {
        video.pause();
        clearTimeout(video._viewTimer);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll(".video-wrapper").forEach(wrapper => {
    const video = wrapper.querySelector("video");
    const muteBtn = wrapper.querySelector(".mute-btn");
    video.addEventListener("click", () => {
      video.paused ? video.play() : video.pause();
    });
    muteBtn.addEventListener("click", () => {
      video.muted = !video.muted;
      muteBtn.textContent = video.muted ? "🔇" : "🔊";
    });
    observer.observe(video);
  });
}

// ======= SEND VIEW =======
async function sendVideoView(postId) {
  try {
    const res = await fetch(`${baseUrl}/api/posts/${postId}/view`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    if (!res.ok) throw new Error("Failed to send view");
    const data = await res.json();
    return data.views;
  } catch {
    return null;
  }
}


// ================== LIKE & STAR ==================
document.addEventListener("click", async e => {
  const post = e.target.closest(".post");
  if (!post) return;
  const postId = post.dataset.postId;

  // LIKE
  if (e.target.closest(".love-btn")) {
    const btn = e.target.closest(".love-btn");
    const res = await fetch(`https://afrisocial-backend.onrender.com/api/posts/${postId}/like`, {
      method: "POST",
      headers: { Authorization: token ? `Bearer ${token}` : "" }
    });
    const data = await res.json();
    btn.querySelector(".count").textContent = data.likes.length;
    btn.classList.toggle("liked", data.liked);
  }

  // STAR
  if (e.target.closest(".star-btn")) {
    const btn = e.target.closest(".star-btn");
    const res = await fetch(`https://afrisocial-backend.onrender.com/api/posts/${postId}/star`, {
      method: "POST",
      headers: { Authorization: token ? `Bearer ${token}` : "" }
    });
    const data = await res.json();
    btn.querySelector(".count").textContent = data.stars.length;
    btn.classList.toggle("starred", data.starred);
  }

  // COMMENT MODAL
  if (e.target.closest(".comment-btn")) {
    openCommentModal(postId, post);
  }
});

// ================== COMMENT MODAL ==================
const commentModal = document.getElementById("commentModal");
const commentList = document.getElementById("commentList");
const commentInput = document.getElementById("commentInput");
const sendCommentBtn = document.getElementById("sendCommentBtn");
const closeCommentModal = document.getElementById("closeCommentModal");
let activePostId = null;
let activeCommentBtn = null;

function openCommentModal(postId, postEl = null) {
  activePostId = postId;
  activeCommentBtn = postEl ? postEl.querySelector(".comment-btn") : null;
  commentModal.style.display = "flex";
  commentList.innerHTML = "";
  loadComments(postId);
}

closeCommentModal.onclick = () => {
  commentModal.style.display = "none";
};

// ================== RENDER COMMENTS ==================
function renderComment(comment) {
  const div = document.createElement("div");
  div.className = "comment";
  div.dataset.id = comment._id;
  div.innerHTML = `
    <div class="comment-user">
    <a href="/profile.html?userId=${comment.user._id}">
      <img src="${comment.user.profilePicture || '/uploads/images/africa.png'}">
</a>
      <strong>${comment.user.fullName} ${comment.user.isVerified ? `
    <svg class="verified-icon" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#1DA1F2"/>
      <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"/>
    </svg>
  ` : ""} ${getFlagEmoji(comment.user.country)}</strong>
    </div>
    <p class="comment-text">${linkifyHashtags(comment.text)}</p>
    <div class="comment-actions">
      <span class="comment-like ${comment.likes.includes(currentUserId) ? "liked" : ""}">
        ❤️ <span class="like-count">${comment.likes.length}</span>
      </span>
      <span class="reply-btn">Reply</span>
      <small>${timeAgo(comment.createdAt)}</small>
    </div>
    <div class="replies"></div>
  `;
  commentList.appendChild(div);
}

// ==================== LOAD COMMENTS ====================
async function loadComments(postId) {
  const res = await fetch(`https://afrisocial-backend.onrender.com/api/comments/${postId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });

  const comments = await res.json();
  commentList.innerHTML = "";

  // First render ONLY main comments
  comments
    .filter(c => !c.parentComment)
    .forEach(c => renderComment(c));

  // Then render replies under their parent
  comments
    .filter(c => c.parentComment)
    .forEach(reply => {
      const parentEl = commentList.querySelector(
        `[data-id="${reply.parentComment}"]`
      );

      if (parentEl) {
        const replyDiv = document.createElement("div");
        replyDiv.className = "reply";
        replyDiv.dataset.id = reply._id;
        replyDiv.innerHTML = `
          <div class="reply-user">
            <img src="${reply.user.profilePicture || '/uploads/images/africa.png'}">
            <strong>
              ${reply.user.fullName}
              ${reply.user.isVerified ? `
                <svg class="verified-icon" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="#1DA1F2"/>
                  <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"/>
                </svg>
              ` : ""}
              ${getFlagEmoji(reply.user.country)}
            </strong>
            </div>
            <div class="reply-area">
            <p class="reply-text">${linkifyHashtags(reply.text)}</p><small>${timeAgo(reply.createdAt)}</small>
            </div>
        `;

        parentEl.querySelector(".replies").appendChild(replyDiv);
      }
    });
}


// ================== SEND COMMENT ==================
sendCommentBtn.onclick = async () => {
  const text = commentInput.value.trim();
  if (!text) return;
  const res = await fetch(`https://afrisocial-backend.onrender.com/api/comments/${activePostId}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  });
  const comment = await res.json();
  renderComment(comment);
  commentInput.value = "";
  if (activeCommentBtn) activeCommentBtn.querySelector(".count").textContent++;
};

// ================== COMMENT LIKE & REPLY ==================
document.addEventListener("click", async e => {
  // LIKE COMMENT
  if (e.target.closest(".comment-like")) {
    const likeBtn = e.target.closest(".comment-like");
    const commentEl = likeBtn.closest(".comment");
    const res = await fetch(`https://afrisocial-backend.onrender.com/api/comments/like/${commentEl.dataset.id}`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    likeBtn.querySelector(".like-count").textContent = data.likes.length;
    likeBtn.classList.toggle("liked", data.liked);
  }

  // REPLY INPUT
  if (e.target.closest(".reply-btn")) {
    const commentEl = e.target.closest(".comment");
    if (commentEl.querySelector(".reply-input")) return;
    const box = document.createElement("div");
    box.className = "reply-input";
    box.innerHTML = `
      <input placeholder="Write a reply...">
      <button class="send-reply">Reply</button>
    `;
    commentEl.appendChild(box);
  } 

  // SEND REPLY
  if (e.target.classList.contains("send-reply")) {
    const replyBox = e.target.closest(".reply-input");
    const text = replyBox.querySelector("input").value.trim();
    if (!text) return;
    const commentEl = replyBox.closest(".comment");
    const res = await fetch(`https://afrisocial-backend.onrender.com/api/comments/reply/${commentEl.dataset.id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ text })
    });
    const reply = await res.json();
    const replyDiv = document.createElement("div");
    replyDiv.className = "reply";
    replyDiv.dataset.id = reply._id;
    replyDiv.innerHTML = `
    <div class="reply-user">
      <img src="${reply.user.profilePicture || '/uploads/images/africa.png'}">
      <strong>${reply.user.fullName} ${reply.user.isVerified ? `
    <svg class="verified-icon" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#1DA1F2"/>
      <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"/>
    </svg>
  ` : ""} ${getFlagEmoji(reply.user.country)}</strong>
    </div>
      <p class="reply-text">${reply.text}</p>
    `;
    commentEl.querySelector(".replies").appendChild(replyDiv);
    replyBox.remove();
  }
});


//FOLLOWERS LIST TAB
async function loadFollowers(userId) {
  try {
    const res = await fetch(`${baseUrl}/api/users/${userId}/followers`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();


    renderUserList(
      data.followers || data.user?.followers || data,
      document.getElementById("followersList")
    );
  } catch (err) {
    console.error("Failed to load followers", err);
  }
}


// FOLLOWING LIST TAB
async function loadFollowing(userId) {
  try {
    const res = await fetch(`${baseUrl}/api/users/${userId}/following`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();


    renderUserList(
      data.following || data.user?.following || data,
      document.getElementById("followingList")
    );
  } catch (err) {
    console.error("Failed to load following", err);
  }
}


function renderUserList(users, container) {
  container.innerHTML = "";

  users.forEach(user => {
    const div = document.createElement("div");
    div.className = "user-row";

    div.innerHTML = `
    <img src="${user.profilePicture || '/uploads/images/africa.png'}" class="user-avatar">

      <div class="user-info" onclick="window.location.href='/profile.html?userId=${user._id}'">
        <strong>${user.fullName}</strong>
        <span>@${user.username} ${user.isVerified ? `
    <svg class="verified-icon" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="10" fill="#1DA1F2"/>
      <path d="M9 12l2 2 4-4" stroke="white" stroke-width="2" fill="none"/>
    </svg>
  ` : ""} ${getFlagEmoji(user.country)}</span>
      </div>

      ${
        user._id !== currentUserId
          ? `<button 
               class="follow-btn ${user.isFollowing ? "following" : ""}"
               data-user-id="${user._id}"
               data-following="${user.isFollowing}">
               ${user.isFollowing ? "Following" : "Follow"}
             </button>`
          : ""
      }
    `;

    // Click profile
    div.querySelector(".user-info").onclick = () => {
      window.location.href = `/profile.html?userId=${user._id}`;
    };

    container.appendChild(div);
  });
}


document.addEventListener("click", async (e) => {
  const btn = e.target.closest(".follow-btn");
  if (!btn) return;

  e.stopPropagation(); // prevent profile click

  const userId = btn.dataset.userId;
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Login required");
    return;
  }

  try {
    const res = await fetch(`${baseUrl}/api/users/follow/${userId}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message);

    // UPDATE MEMORY
    btn.dataset.following = data.following;

    // UPDATE UI
    btn.textContent = data.following ? "Following" : "Follow";
    btn.classList.toggle("following", data.following);

  } catch (err) {
    console.error("Follow failed:", err);
  }
});


// UREAD MESSAGE BADGE 
async function loadUnreadMessages() {
  const res = await fetch(
    "https://afrisocial-backend.onrender.com/api/messages/unread-count",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    }
  );

  const data = await res.json();
  const badge = document.getElementById("messageBadge");

  if (data.count > 0) {
    badge.innerText = data.count;
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}
document.getElementById("messageIcon").addEventListener("click", () => {
  document.getElementById("messageBadge").style.display = "none";
  window.location.href = "/message.html";
});

// Call on page load
loadUnreadMessages();


const notificationBox = document.getElementById("notificationBox");
// UNREAD NOTIFICATION BADGE
const notificationBtn = document.getElementById("notificationBtn");
const notificationBadge = document.getElementById("notificationBadge");

if (notificationBtn && notificationBadge && notificationBox) {

  async function loadNotificationBadge() {
  try {
    const res = await fetch("https://afrisocial-backend.onrender.com/api/notifications/unread-count", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
      }
    });

    const data = await res.json();
    setNotificationCount(data.count);
  } catch (err) {
    console.error("Failed to load notification badge", err);
  }
}

const notificationBadge = document.getElementById("notificationBadge");

function setNotificationCount(count) {
  if (!notificationBadge) return;

  if (count > 0) {
    notificationBadge.textContent = count;
    notificationBadge.style.display = "inline-block";
  } else {
    notificationBadge.style.display = "none";
  }
} 
  loadNotificationBadge();
  
  notificationBtn.addEventListener("click", async () => {
    notificationBox.classList.toggle("show");
    if (notificationBox.classList.contains("show")) {
      await fetch("https://afrisocial-backend.onrender.com/api/notifications/mark-read", {
        method: "POST",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setNotificationCount(0);
      loadNotifications();
    }
  });

}






document.querySelector(".vybze-nav").classList.add("active");






















































