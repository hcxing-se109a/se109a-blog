const App = document.querySelector("#app");

let view = `
  <nav>
    <a class="user-name">User</a>
    <a href="#/logout">Logout</a>
  </nav>

  <main>

    <button class="modal-trigger">新增貼文</button>

    <div class="modal create">

        <div class="modal-content">
            <div class="modal-header">
                <span class="close">&times;</span>
                <h2>New Post</h2>
            </div>
            <form class="create-post-form">
              <div class="modal-body">

                  <label for="title">Title</label><br>
                  <input type="text" name="title" id="title" required><br><br>

                  <label for="content">Content</label><br>
                  <textarea name="content" id="content" cols="30" rows="5" required></textarea><br><br>

              </div>
              <div class="modal-footer">
                  <button>ACCEPT</button>
              </div>
            </form>
        </div>

    </div>

  <div class="modal edit">

    <div class="modal-content">
        <div class="modal-header">
            <span class="close close-edit">&times;</span>
            <h2>Edit Post</h2>
        </div>
        <form class="edit-post-form">
          <div class="modal-body">

              <input type="hidden" name="id" class="edit-post-id">

              <label for="title">Title</label><br>
              <input type="text" name="title" id="title" class="edit-title" required><br><br>

              <label for="content">Content</label><br>
              <textarea name="content" id="content" class="edit-content" cols="30" rows="5" required></textarea><br><br>

          </div>
          <div class="modal-footer">
              <button>ACCEPT</button>
          </div>
        </form>
    </div>

  </div>

  <div class="modal view">

    <div class="modal-content">

      <div class="modal-header">
          <span class="close close-edit">&times;</span>
          <h2>View Post</h2>
      </div>
      <form class="view-post-form">
        <div class="modal-body">
          <br>
          <h1 class="view-title"></h1>
          <br>
          <p class="view-content"></p>
          <br>
        </div>
        <div class="modal-footer">
        </div>
      </form>

    </div>

  </div>


  <div class="loader">
      <div class="circle"></div>
      <div class="circle"></div>
      <div class="circle"></div>
  </div>

</main>

 `;

const Home = async () => {
  App.innerHTML = view;

  const mainDiv = document.querySelector("main");
  const loading = document.querySelector(".loader");

  const modalTrigger = document.querySelector(".modal-trigger");

  const modalDiv = document.querySelector(".modal.create");
  const viewModal = document.querySelector(".modal.view");
  const editModal = document.querySelector(".modal.edit");

  const closeSpans = document.querySelectorAll(".close");
  const createPostForm = document.querySelector(".create-post-form");
  const editPostForm = document.querySelector(".edit-post-form");

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");
  const userName = localStorage.getItem("userName");

  const baseURL = "http://localhost:3000";

  let page = 1;
  let limit = 5;
  let totalItems;

  function setUserNameOnNav() {
    document.querySelector("nav .user-name").innerText = userName;
  }

  async function fetchData() {
    let res = await fetch(`${baseURL}/api/posts?page=${page}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    let data = (await res.json()).data;

    let posts = data.posts;
    totalItems = data.totalItems;

    return posts;
  }

  async function displayPosts() {
    let posts = await fetchData();

    let html = posts.map((post) => {
      let newPost = document.createElement("div");
      newPost.classList.add("post");
      newPost.innerHTML = `
              <span hidden class="post-id">${post._id}</span>
              <span hidden class="creator-id">${post.creator._id}</span>
              <h1>${post.title}</h1>
              <span>created by </span>
              <span class="creator-name">${post.creator.name}</span>
              <span>${new Date(post.createAt).toLocaleString("en-US")}</span>
              <p>${post.content.substr(0, 30)}...</p>


              <div class="btn-group">
                  <button class="view-post-btn">view</button>
                  <button class="edit-post-btn" style="display: ${
                    post.creator._id === userId ? "block" : "none"
                  }">edit</button>
                  <button class="delete-post-btn" style="display: ${
                    post.creator._id === userId ? "block" : "none"
                  }">delete</button>
              </div>
          `;
      mainDiv.appendChild(newPost);
    });
  }

  function showLoading() {
    loading.classList.add("show");

    setTimeout(() => {
      loading.classList.remove("show");

      setTimeout(() => {
        page++;
        displayPosts();
      }, 300);
    }, 1000);
  }

  displayPosts();
  setUserNameOnNav();

  function closeModal() {
    modalDiv.style.display = "none";
    viewModal.style.display = "none";
    editModal.style.display = "none";
    createPostForm.title.value = "";
    createPostForm.content.value = "";
  }

  async function displayViewPost(postId) {
    try {
      let res = await fetch(`${baseURL}/api/post/${postId}`, {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      let post = (await res.json()).data.post;

      viewModal.style.display = "block";

      let title = document.querySelector(".view-title");
      let content = document.querySelector(".view-content");

      title.innerText = post.title;
      content.innerText = post.content;
    } catch (error) {
      console.log(error);
    }
  }

  async function displayEditForm(postId) {
    let res = await fetch(`${baseURL}/api/post/${postId}`, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    let post = (await res.json()).data.post;

    editModal.style.display = "block";

    let title = document.querySelector(".edit-title");
    let content = document.querySelector(".edit-content");
    let id = document.querySelector(".edit-post-id");

    id.value = post._id;
    title.value = post.title;
    content.value = post.content;
  }

  window.addEventListener("scroll", () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

    let isScrollToBottom =
      scrollTop + clientHeight >= scrollHeight - 5 ? true : false;
    let isGetAllData = page >= Math.ceil(totalItems / limit) ? true : false;

    if (isScrollToBottom && !isGetAllData) {
      showLoading();
    }
  });

  modalTrigger.addEventListener("click", (e) => {
    modalDiv.style.display = "block";
  });

  closeSpans.forEach((closeSpan) => {
    closeSpan.addEventListener("click", (e) => {
      closeModal();
    });
  });

  createPostForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let title = e.target.title.value;
    let content = e.target.content.value;

    let res = await fetch(`${baseURL}/api/post`, {
      method: "POST",
      body: JSON.stringify({
        title: title,
        content: content,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });
    console.log(await res.json());

    closeModal();
    window.location.reload();
  });

  editPostForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let title = e.target.title.value;
    let content = e.target.content.value;
    let postId = e.target.id.value;

    let res = await fetch(`${baseURL}/api/post/${postId}`, {
      method: "PUT",
      body: JSON.stringify({
        title: title,
        content: content,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    });

    closeModal();
    window.location.reload();
  });

  mainDiv.addEventListener("click", async (e) => {
    if (e.target.className === "view-post-btn") {
      let postDiv = e.target.parentNode.parentNode;
      let postId = postDiv.querySelector(".post-id").innerText;
      let creatorId = postDiv.querySelector(".creator-id").innerText;

      displayViewPost(postId);
    }

    if (e.target.className === "edit-post-btn") {
      let postDiv = e.target.parentNode.parentNode;
      let postId = postDiv.querySelector(".post-id").innerText;
      let creatorId = postDiv.querySelector(".creator-id").innerText;

      if (creatorId === userId) {
        console.log("權限測試");
        displayEditForm(postId);
      }
    }

    if (e.target.className === "delete-post-btn") {
      let postDiv = e.target.parentNode.parentNode;
      let postId = postDiv.querySelector(".post-id").innerText;
      let creatorId = postDiv.querySelector(".creator-id").innerText;

      if (creatorId === userId) {
        console.log("權限測試");

        try {
          let res = await fetch(`${baseURL}/api/post/${postId}`, {
            method: "DELETE",
            headers: {
              Authorization: "Bearer " + token,
            },
          });
        } catch (error) {
          console.log(error);
        }

        postDiv.parentNode.removeChild(postDiv);
      } else {
        console.log("權限不足");
      }
    }
  });
};

export default Home;
