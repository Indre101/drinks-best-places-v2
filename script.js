const sreadsheetId = "1rTkF6MEuG7v43VAXdnBuQ_3KKtWaMrP03lYvzobzF6k";
const drinksUrl = `https://spreadsheets.google.com/feeds/list/${sreadsheetId}/1/public/values?alt=json`;
const placesUrl = `https://spreadsheets.google.com/feeds/list/${sreadsheetId}/2/public/values?alt=json`;
6
// const template = document.querySelector("template").content;

// CATEGORIES JUST NAME AND ITS CONTAINER
const categoryNameTemplate = document.querySelector(".categoryNameTemplate")
  .content;


const parentDrinkCategoriesAndDrinks = document.querySelector(
  ".drinkCategoriesAndDrinks"
);
const oneCategoryContainer = document.querySelector(".oneCategoryContainer");

// ONE DRINK TEMPLATE
const oneDrinkTemplate = document.querySelector(".oneDrinkTemplate").content;
// const drinksListContainer = document.querySelector(".drinksListContainer");

// PLACE LIST TEMPLATE FOR ATTACHING INSIDE DRINK CARD
let placeInfo = document.querySelector(".placeInfo").content;

// FILTERS AND SORTING OPTIONS DOM ELEMENT
const alcoholInput = document.getElementById("alcoholInput");
const nonAlco = document.getElementById("non-alcoholInput");
const drinkCategryInput = document.querySelectorAll(".drinkCategryInput");


const priceInput = document.querySelector("#priceInput");
const searchTxt = document.getElementById("search-txt");
const searchBtn = document.getElementById("search-btn");
const isAlcoInputs = document.querySelectorAll(".isAlco");
const inputsFilters = document.querySelectorAll(".inputsFilters");



let drinkObjectArray = [];
let categoryNamesArr = [];
let places = [];

// FETCH FIRST API OF DRINKS
fetch(drinksUrl)
  .then(res => {
    return res.json();
  })
  .then(dataObject => dataObject.feed.entry.forEach(createDrinkObj))

// FIRST FUNCTION  CREATES DRINK OBJECTTS WITH PLACES
const createDrinkObj = drinkObject => {
  // CREATE INITIAL DRINK OBJECT AND PUSH THE CATEGORY NAMES TO CREATE A FILTERED CATEGORY NAME ARRAY
  let drinkObjectCard = new DrinkObject(
    drinkObject.gsx$id.$t,
    drinkObject.gsx$category.$t,
    drinkObject.gsx$drinkname.$t,
    drinkObject.gsx$shortdescription.$t,
    drinkObject.gsx$alcohol.$t,
    drinkObject.gsx$image.$t
  );

  drinkObjectArray.push(drinkObjectCard);
  categoryNamesArr.push(drinkObjectCard.category);
};



// THIRD FUNCTION TO SEPARATE AND ADD DRINK CARDS TO RIGHT CATEGORIES
function addDrinks(drinks) {
  const filteredCategoriesNamesOnly = filteredCategoriesArray();

  filteredCategoriesNamesOnly.forEach(drinkObj => {
    // DRINKS PAGE
    const cloneDrinksPageTemplate = categoryNameTemplate.cloneNode(true);
    cloneDrinksPageTemplate.querySelector(
      ".categoryName"
    ).textContent = drinkObj;
    let drinksListContainer = cloneDrinksPageTemplate.querySelector(
      ".drinksListContainer"
    );

    drinks.forEach(drinkCategory => {
      if (drinkCategory.category == drinkObj) {
        appendDrinkCards(drinkCategory, drinksListContainer);
      }
    });

    parentDrinkCategoriesAndDrinks.appendChild(cloneDrinksPageTemplate);
  });

  const categoriesHeadings = document.querySelectorAll(".categoryName");


  // ASSIGN ID

  function filterByNameOrAdress(classNameOf) {
    const drinkNames = document.querySelectorAll(classNameOf);

    for (let index = 0; index < drinkNames.length; index++) {
      if (
        drinkNames[index].innerHTML
        .toLowerCase()
        .includes(searchTxt.value.toLowerCase())
      ) {
        drinkNames[index].style.display = "block";
      } else {
        drinkNames[index].style.display = "none";
      }
    }
  }

  function doc_keyUp(e) {
    // this would test for whichever key is 40 and the ctrl key at the same time
    if (e.keyCode == 13) {
      filterByNameOrAdress(".oneDrink");
      filterByNameOrAdress(".placeAdress");
    }
  }
  // register the handler
  document.addEventListener("keydown", doc_keyUp, false);




  isAlcoInputs.forEach(e => {

    e.onclick = function () {
      filter(isAlcoInputs, drinkCategryInput)
    }
  })


  drinkCategryInput.forEach(e => {

    e.onclick = function () {
      filter(drinkCategryInput, isAlcoInputs)
    }
  })





  priceInput.onmouseup = function () {

    const allTheDrinks = document.querySelectorAll(".oneDrink");

    let A = allTheDrinks.forEach(drink => {
      let placeListEachDrink = drink.querySelectorAll(".placeInfoContainer")

      drink.classList.remove("active")
      drink.classList.add("hide")


      placeListEachDrink.forEach(place => {

        place.style.display = "none";


        if (parseInt(place.querySelector(".drinkPrice").textContent) <= parseInt(priceInput.value)) {
          place.style.display = "block";
          drink.classList.remove("hide")
          drink.classList.add("active")
          console.log(placeListEachDrink)

        }


      })
    })
  }
}






function checkIfAllChecked(arr) {
  let elements = Array.from(arr);
  if (elements.every(item => item.checked != true)) {
    return true;
  } else {
    return false;
  }
}






let inputsCheckedFirst = [];
let inputesCheckedSecond = [];





function filter(inputs, otherInputs) {


  const allTheDrinks = document.querySelectorAll(".oneDrink");

  if (checkIfAllChecked(inputsFilters)) {
    allTheDrinks.forEach(drink => {
      drink.classList.remove("hide");

      drink.classList.add("active");
    })
  } else if (!checkIfAllChecked(inputs) && checkIfAllChecked(otherInputs)) {

    inputsCheckedFirst = []

    inputs.forEach(input => {

      if (input.checked) {
        inputsCheckedFirst.push(input.value.toLowerCase().split(' ').join(''))
      }
    })



    allTheDrinks.forEach(drink => {


      drink.classList.remove("active")
      drink.classList.add("hide");


      for (let index = 0; index < inputsCheckedFirst.length; index++) {

        if (drink.classList.contains(inputsCheckedFirst[index])) {
          drink.classList.remove("hide");
          drink.classList.add("active");

        }

      }

    })

  } else if (!checkIfAllChecked(inputs) && !checkIfAllChecked(otherInputs)) {

    inputsCheckedFirst = []
    inputesCheckedSecond = [];

    inputs.forEach(input => {

      if (input.checked) {
        inputsCheckedFirst.push(input.value.toLowerCase().split(' ').join(''))
      }
    })

    otherInputs.forEach(input => {

      if (input.checked) {
        inputesCheckedSecond.push(input.value.toLowerCase().split(' ').join(''))
      }
    })

    allTheDrinks.forEach(drink => {


      drink.classList.remove("active")
      drink.classList.add("hide");




      for (let index = 0; index < inputsCheckedFirst.length; index++) {

        for (let j = 0; j < inputesCheckedSecond.length; j++) {


          if (drink.classList.contains(inputsCheckedFirst[index]) && drink.classList.contains(inputesCheckedSecond[j])) {
            drink.classList.remove("hide");
            drink.classList.add("active");

          }
        }
      }

    })

  }

}
















// FILTERING THE CATEGORIES NAMES
let filteredCategoriesArray = () =>
  categoryNamesArr.filter(function (item, index) {
    return categoryNamesArr.indexOf(item) >= index;
  });

let placeArr = [];
// DRINKS OBJECT CONSTRUCTOR
function DrinkObject(
  drinkId,
  category,
  drinkName,
  shotDescription,
  alcohol,
  image
) {
  this.drinkId = drinkId;
  this.category = category;
  this.drinkName = drinkName;
  this.shotDescription = shotDescription;
  this.alcohol = alcohol;
  this.image = image;
  this.places = [];
}

const createNewPlace = place =>
  new PlaceObject(
    place.gsx$placename.$t,
    place.gsx$adddress.$t,
    place.gsx$drinkid.$t,
    place.gsx$drinkprice.$t,
    place.gsx$imageoftheplace.$t,
    place.gsx$starrate.$t,
    place.gsx$linktotheplacewebsite.$t,
    place.gsx$placedescribtion.$t
  );

// SECOND FETCH FOR PLACES
const getPlaces = () =>
  fetch(placesUrl)
  .then(res => res.json())
  .then(place => place.feed.entry.map(createNewPlace));

const addPlacesToDrinks = () => {
  for (let index = 0; index < drinkObjectArray.length; index++) {
    for (let j = 0; j < places.length; j++) {
      if (drinkObjectArray[index].drinkId == places[j].drinkId) {
        drinkObjectArray[index].places.push(places[j]);
      }
    }
  }
};




const main = () => {
  getPlaces().then(res => {
    places = res;

    addPlacesToDrinks();
    addDrinks(drinkObjectArray);
  });
};

// PLACE OBJECT CONSTRUCTOR
function PlaceObject(
  placeName,
  address,
  drinkId,
  drinkPrice,
  placeImg,
  stars,
  link,
  description
) {
  this.placeName = placeName;
  this.address = address;
  this.drinkId = drinkId;
  this.drinkPrice = drinkPrice;
  this.placeImg = placeImg;
  this.stars = stars;
  this.link = link;
  this.description = description;
}




function appendDrinkCards(drinkObject, drinkCardContainer) {
  //   // CLONE OF DRINKS TEMPLATE

  const clnDrink = oneDrinkTemplate.cloneNode(true);

  clnDrink.querySelector(".oneDrink").classList.add(`${drinkObject.category.toLowerCase().split(' ').join('') }`);
  const drinkImg = clnDrink.querySelector(
    ".drinkImg")


  if (drinkObject.alcohol == "alcohol") {
    clnDrink.querySelector(".oneDrink").classList.add("alcohol");

  } else {
    clnDrink.querySelector(".oneDrink").classList.add("nonalcohol");

  }


  drinkImg.src = `./img-icons/img/${drinkObject.image}.png`;
  clnDrink.querySelector(".drinkName").textContent = drinkObject.drinkName;

  const placeList = clnDrink.querySelector(".placeList");
  clnDrink.querySelector(".category").textContent = drinkObject.category;
  clnDrink.querySelector(".drinkName").textContent = drinkObject.drinkname;

  clnDrink.querySelector(".oneDrinkContainer").onclick = function () {
    drinkImg.classList.toggle("drinkImgHeight");
    placeList.classList.toggle("d-none");
  };

  clnDrink.querySelector(".drinkName").textContent = drinkObject.drinkName;



  // drinkObject.places.sort()

  function compare(a, b) {


    if (parseInt(a.drinkPrice) < parseInt(b.drinkPrice)) {
      return -1;
    }
    if (parseInt(a.drinkPrice) > parseInt(b.drinkPrice)) {
      return 1;
    }
    return 0;
  }

  drinkObject.places.sort(compare);

  drinkObject.places.forEach(placeObj => {
    let clnPlaceTempate = placeInfo.cloneNode(true);

    clnPlaceTempate.querySelector(".placeName").textContent =
      placeObj.placeName;
    clnPlaceTempate.querySelector(
      ".drinkPrice"
    ).textContent = `${placeObj.drinkPrice},-`;

    clnPlaceTempate.querySelector(".placeAdress").textContent =
      placeObj.address;

    clnPlaceTempate.querySelector(".stars").textContent = `☆ ${placeObj.stars}`;
    clnPlaceTempate.querySelector(".stars").style.color = "yellow";
    clnPlaceTempate.querySelector(".describtion").textContent =
      placeObj.description;
    clnPlaceTempate.querySelector(".linkToWebsite").href = placeObj.link;

    const placeDescribtion = clnPlaceTempate.querySelector(".placeDescribtion");
    const closeModalBtn = clnPlaceTempate.querySelector(".closeButton");

    clnPlaceTempate
      .querySelector(".placeInfoContainer")
      .addEventListener("click", showModal);

    function showModal() {
      placeDescribtion.classList.toggle("d-none");
    }

    placeList.appendChild(clnPlaceTempate);
  });




  drinkCardContainer.appendChild(clnDrink);
}

main();