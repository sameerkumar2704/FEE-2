const apiKey = "xgtEKyCrr7pGas3ys5kw904A7roQvor1igCO1f2Sxrk";
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
let isLoading = false;
let searchContent = "";

loader.classList.add("d-none");
not_found.style.display = "none";
error_page.style.display = "none";
result_container.classList.add("d-none");


searchBox.addEventListener("keypress", keyPress);

reload_btn.addEventListener("click", () => {
  location.reload();
});

window.addEventListener("scroll", () => {
  page++;
  if (
    window.scrollY + window.innerHeight >=
      document.documentElement.scrollHeight &&
    itemLeft &&
    !isLoading
  ) {
    LoadMore();
    spinner.classList.remove("d-none");
  }
});

function keyPress(e) {
  itemLeft = true;

  if (e.key === "Enter") {

    searchContent = e.target.value;
    if (searchContent === "") return;
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
  isLoading = true;
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
    isLoading = false;
    spinner.classList.add("d-none");
  }
}
function createImage(image) {
  const ImageHolder = document.createElement("img");
  ImageHolder.src = image;
  ImageHolder.alt = "tem";
  ImageHolder.loading = 'lazy'
  ImageHolder.classList.add("rounded");

  ImageHolder.classList.add("large");
  return ImageHolder;
}
async function appendChilds() {
  page = 1;
  if (searchContent === "") {
    not_found.style.display = "flex";
    result_container.classList.add("d-none");

    return;
  }

  let data = [];
  if (itemLeft) {
    try {
      data = await getData(searchContent);
    } catch (e) {
      not_found.style.display = "flex";
      spinner.classList.add("d-none");
      result_container.classList.add("d-none");
      grid_box.classList.add('d-none')
      itemLeft = false;
    }
  }
  if (data.length === 0) {
    not_found.style.display = "flex";
    spinner.classList.add("d-none");
    result_container.classList.add('d-none')

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

}
async function searchClick() {
  not_found.style.display = "none";

  loader.classList.remove("d-none");
  try {
    await appendChilds();
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
    empty_div.style.display = "none";
    result_container.classList.remove("d-none");
    console.log('load')
  } catch (err) {
    content_page.style.display = "none";
    error_page.style.display = "flex";
    itemLeft = false;

    throw new Error("something went wrong");
  } finally {
    console.log('done')
    loader.classList.add("d-none");

  }

}
searchBtn.addEventListener("click", (e) => {
  searchContent = searchBox.value;
  if (searchContent === "") return;
  searchClick();
  searchBox.value = "";
});
