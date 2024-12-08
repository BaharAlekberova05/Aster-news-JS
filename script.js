const API = "https://all-api.bitcode.az/api";
const weatherAPI = "http://api.weatherapi.com/v1/current.json?key=";
const weatherAPIKey = "353a505ce06f4094b79114102240612";
const city = "Baku";
const weatherLocation = document.querySelector("#weather-location");
const weatherCondition = document.querySelector("#weather-condition");
const weatherIcon = document.querySelector("#weather-icon");
const weatherDeg = document.querySelector("#weather-deg");
const categoriesEl = document.querySelectorAll(".category");
const newsContent = document.querySelector("#news-content");
const creatorsContent = document.querySelector("#creators-content");
const searchInput = document.querySelector("#search-input");


const getCategories = async function () {
  const categoryArray = await (await fetch(API + `${"/news/category"}`)).json();

  categoryArray.forEach((category, index) => {
    if (categoriesEl[index]) {
      categoriesEl[index].innerHTML = category.name;
    }
  });
};
getCategories();

const getNews = async function (searchInputValue) {
  const res = await (await fetch(API + `${"/news"}`)).json();
  const data = await res.data;

  newsContent.innerHTML = "";
  creatorsContent.innerHTML = "";

  const searchedNews = searchInputValue
    ? data.filter((item) => item.category.slug === searchInputValue)
    : data;

  const limitedAuthors = data.slice(0, 5);

  searchedNews.forEach((item) => {
    newsContent.innerHTML += uiNewsItem(item);
  });

  if (searchedNews.length === 0) {
    newsContent.innerHTML = "<p>No news found for this category.</p>";
  }

  limitedAuthors.forEach((item) => {
    creatorsContent.innerHTML += uiCreatorItem(item);
  });
};
getNews();

const uiNewsItem = (item) => {
  return `
    <!-- NEWS DIV -->
<div
  class="pt-[17px] pb-[13px] pl-[23px] pr-[17px] rounded-[4px] bg-white flex flex-col justify-between shadow-lg "
>
  <div class="flex">
    <div class="flex flex-col mr-[22px]">
      <a
        href="./news.html"
        class="w-[182px] font-medium text-lg text-amber-black mb-[9px]"
        >${item.title}</a
      >
      <span class="w-[179px] text-[14px] leading-6 opacity-60 text-amber-black"
        >${item.description}
      </span>
    </div>

    <div>
      <img src="${item.photo}" class="size-full object-cover"/>
    </div>
  </div>

  <div class="mt-[20px] flex">
    <span class="text-[14px] leading-6 text-amber-black opacity-40 mr-[9px]"
      >${item.author.agency}</span
    >
    <span class="text-[14px] leading-6 text-amber-black opacity-40 mr-[9px]">
      &centerdot;</span
    >
    <span class="text-[14px] leading-6 text-amber-black opacity-40 mr-[30px]"
      >${moment(item.published_date).format("DD-MM-YYYY")}</span
    >

    <img src="./images/share.svg" />
    <span class="text-[12px] text-[#0768B5] leading-6 ml-2 mr-6">Share</span>

    <img src="./images/read-later.svg" />
    <span class="text-[12px] text-[#0768B5] leading-6 ml-2">Read Later</span>
  </div>
</div>
    `;
};

const uiCreatorItem = (item) => {
  return `
    <!-- A CREATOR -->
      <div
      class="w-[142px] h-[185px] flex flex-col gap-[6px] items-center py-3 rounded-[4px] bg-white shadow-lg"
      >
        <div class="size-[70px]">
            <img
            src="${item.author.photo}"
            class="size-full object-cover rounded-full"
            />
        </div>
        <span
            class="text-amber-black text-[16px] leading-6 text-center font-medium h-[40px] overflow-hidden"
            >${item.author.fullname}</span
        >
        <span
            class="text-[14px] text-amber-black leading-5 opacity-40"
            >${item.author.agency}</span
        >
        <button
            class="w-[116px] bg-[#2F9FF8] rounded-[4px] text-white text-center text-[15px] leading-4 py-[7px]"
        >
            Follow
        </button>
      </div>
    `;
};

const searchNews = function (e) {
  if (e.key === "Enter") {
    let searchInputValue = searchInput.value.trim().toLowerCase();
    searchInput.value = "";

    getNews(searchInputValue);
  }
};

searchInput.addEventListener("keydown", searchNews);

categoriesEl.forEach((categoryEl) => {
  categoryEl.addEventListener("click", () => {
    const categoryName = categoryEl.innerHTML.trim().toLocaleLowerCase();
    searchInput.value = categoryName;
    getNews(categoryName);
  });
});

// ! hava durum API
const getWeather = async function () {
  const weather = await (
    await fetch(`${weatherAPI}${weatherAPIKey}&q=${city}`)
  ).json();

  weatherLocation.innerHTML = `${weather.location.name}, ${weather.location.country}`;
  weatherCondition.innerHTML = `${weather.current.condition.text}`;
  weatherDeg.innerHTML = `${weather.current.temp_c}`;
  weatherIcon.src = `${weather.current.condition.icon}`;
};

getWeather();
