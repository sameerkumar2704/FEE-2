const apiKey = "oHnT7mKzRlhIPFjjwII_W-aOo0IS2ptcZ3CBt2PfJ8w";
const searchBox = document.getElementById("search-box");
const searchBtn = document.getElementById("search-btn");
const grid_box = document.getElementById("grid-box");
const empty_div = document.getElementById("empty");
const loader = document.getElementById("loader");
const not_found = document.getElementById("no-result-found");
const content_page = document.getElementById("content-page");
const error_page = document.getElementById("error-page");
const reload_btn = document.getElementById("reload-btn");
const result_container = document.getElementById("result-container");
const spinner = document.getElementById("spinner");
let page = 1;
let itemLeft = true;
let searchContent = "";

loader.style.display = "none";
not_found.style.display = "none";
error_page.style.display = "none";
result_container.classList.add("d-none");

searchBox.addEventListener("keypress", keyPress);
reload_btn.addEventListener("click", () => {
  location.reload();
});
window.addEventListener("scroll", (e) => {
  page++;
  if (
    window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight &&
    itemLeft
  ) {
    LoadMore();
    spinner.classList.remove("d-none");
  }
});
function keyPress(e) {
  itemLeft = true;
  if (e.key === "Enter") {
    searchContent = e.target.value;
    searchClick();
    e.target.value = "";
  }
}
async function getData(query) {
  const url = `https://api.unsplash.com/search/photos?page=${page}&query=${query}&per_page=12&client_id=${apiKey}`;
  let data = await fetch(url);
  data = await data.json();
  console.log(data.results);
  return data.results;
}
async function LoadMore() {
  if (!itemLeft) return;
  try {
    const data = await getData(searchContent);
    const img = data.map((curr) => createImage(curr.urls.small));
    if (data.length === 0) itemLeft = false;

    img.forEach((element, index) => {
      if (index % 2 === 0) element.classList.add("large");
      if (index % 2 !== 0) element.classList.add("mid");
      grid_box.appendChild(element);
    });
  } catch (e) {
    itemLeft = false;
  } finally {
    spinner.classList.add("d-none");
  }
}
function createImage(image) {
  const ImageHolder = document.createElement("img");
  ImageHolder.src = image;
  ImageHolder.alt = "tem";
  ImageHolder.classList.add("rounded");

  ImageHolder.classList.add("large");
  return ImageHolder;
}
async function appendChilds() {
  page = 1;
  if (searchBox.value === "") {
    not_found.style.display = "flex";
    result_container.classList.remove("d-none");

    return;
  }

  let data = [];
  if (itemLeft) {
    try {
      data = await getData(searchContent);
    } catch (e) {
      not_found.style.display = "flex";
      spinner.classList.add("d-none");
      itemLeft = false;
    }
  }
  if (data.length === 0) {
    not_found.style.display = "flex";
    spinner.classList.add("d-none");
    result_container.classList.add("d-none");
    itemLeft = false;

    return;
  }

  const img = data.map((curr) => createImage(curr.urls.small));
  grid_box.innerHTML = "";
  img.forEach((element, index) => {
    if (index % 2 === 0) element.classList.add("large");
    if (index % 2 !== 0) element.classList.add("mid");
    grid_box.appendChild(element);
  });

  result_container.classList.remove("d-none");

}
async function searchClick() {
  not_found.style.display = "none";

  loader.style.display = "flex";
  try {
    await appendChilds();
    empty_div.style.display = "none";

    loader.style.display = "none";
  } catch (err) {
    console.log(exception);
    content_page.style.display = "none";
    error_page.style.display = "flex";

    loader.style.display = "none";
    itemLeft = false;

    throw new Error("something went wrong");
  }
}
searchBtn.addEventListener("click", (e) => {
  searchContent = searchBox.value;
  searchClick();
  searchBox.value = "";
});
