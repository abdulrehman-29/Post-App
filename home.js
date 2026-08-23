import {
  auth,
  db,
  signOut,
  collection,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDocs,
  serverTimestamp
} from "./firebase.js";

let postTitle = document.getElementById("postTitle");
let postInput = document.getElementById("postInput");
let postBtn = document.getElementById("postBtn");
let feedContainer = document.getElementById("feedContainer");
let logoutBtn = document.getElementById("logoutBtn");

loadPosts();

postBtn.addEventListener("click", async function () {
  let user = auth.currentUser;

  let title = postTitle.value.trim();
  let description = postInput.value.trim();

  if (title.length < 3 || description.length < 10) {
    Swal.fire("Error", "Sahi detail likhein!", "error");
    return;
  }

  let authorId = "";
  let userEmail = "User";
  let userName = "Anonymous";

  if (user) {
    authorId = user.uid;
    userEmail = user.email;
    userName = user.displayName || user.email;
  }

  try {
    await addDoc(collection(db, "posts"), {
      title: title,
      description: description,
      authorId: authorId,
      userEmail: userEmail,
      userName: userName,
      createdAt: serverTimestamp()
    });

    postTitle.value = "";
    postInput.value = "";

    Swal.fire("Success", "Post share ho gayi!", "success");

    loadPosts();
  } catch (error) {
    Swal.fire("Error", error.message, "error");
  }
});

async function loadPosts() {
  try {
    let postsData = await getDocs(collection(db, "posts"));

    feedContainer.innerHTML = "";

    let user = auth.currentUser;

    postsData.forEach(function (docSnap) {
      let post = docSnap.data();
      let postId = docSnap.id;

      let isOwner = false;
      if (user && user.uid === post.authorId) {
        isOwner = true;
      }

      let actionsHtml = "";
      if (isOwner) {
        actionsHtml = `
          <div class="post-actions">
            <button class="action-btn edit-btn" id="edit-${postId}">Edit</button>
            <button class="action-btn delete-btn" id="delete-${postId}">Delete</button>
          </div>
        `;
      }

      let postCard = document.createElement("div");
      postCard.className = "post-card";

      postCard.innerHTML = `
        <div class="post-header">
          <div class="user-info">
            <div class="avatar"><i class="fa-solid fa-user"></i></div>
            <div class="user-name">${post.userName || post.userEmail}</div>
          </div>
        </div>
        <h3 class="post-title" id="title-${postId}">${post.title}</h3>
        <div class="post-content" id="content-${postId}">${post.description}</div>
        ${actionsHtml}
      `;

      feedContainer.appendChild(postCard);

      if (isOwner) {
        let deleteBtn = document.getElementById(`delete-${postId}`);
        let editBtn = document.getElementById(`edit-${postId}`);

        deleteBtn.onclick = async function () {
          let confirmResult = await Swal.fire({
            title: "Delete?",
            icon: "warning",
            showCancelButton: true
          });

          if (confirmResult.isConfirmed) {
            await deleteDoc(doc(db, "posts", postId));
            Swal.fire("Deleted!", "", "success");
            loadPosts();
          }
        };

        editBtn.onclick = async function () {
          let currentTitle = document.getElementById(`title-${postId}`).innerText;
          let currentDesc = document.getElementById(`content-${postId}`).innerText;

          let result = await Swal.fire({
            title: "Edit Post",
            html: `
              <input id="swal-title" class="swal2-input" value="${currentTitle}">
              <textarea id="swal-desc" class="swal2-textarea">${currentDesc}</textarea>
            `,
            showCancelButton: true,
            preConfirm: function () {
              let newTitle = document.getElementById("swal-title").value.trim();
              let newDesc = document.getElementById("swal-desc").value.trim();
              return {
                title: newTitle,
                description: newDesc
              };
            }
          });

          let formValues = result.value;

          if (formValues && formValues.title && formValues.description) {
            await updateDoc(doc(db, "posts", postId), {
              title: formValues.title,
              description: formValues.description
            });
            Swal.fire("Updated!", "", "success");
            loadPosts();
          }
        };
      }
    });
  } catch (error) {
    feedContainer.innerHTML = error.message;
  }
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", function () {
    signOut(auth)
      .then(function () {
        Swal.fire({
          title: "Logged Out!",
          text: "You have successfully logged out.",
          icon: "success",
          timer: 800,
          showConfirmButton: false
        });

        setTimeout(function () {
          window.location.href = "./index.html";
        }, 1000);
      })
      .catch(function (error) {
        Swal.fire({
          title: "Error!",
          text: error.message,
          icon: "error"
        });
      });
  });
}