const searchData = document.querySelector(".search-data");
const searchBtn = document.querySelector(".search-btn");
const addBtn = document.querySelector(".add-btn");
const popUpCtr = document.querySelector("#pop-up-ctr");

popUpCtr.style.display = "none";
popUpCtr.style.backgroundColor = "orangered";

searchBtn.addEventListener("click", (e) => {
  // e.preventDefault();
  searchData.style.display = "block";
});

addBtn.addEventListener("click", (e) => {
  // e.preventDefault();
  popUpCtr.style.display = "block";
});
