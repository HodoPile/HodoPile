"use strict"

const UNSPLASH_ACCESS_KEY = "SECRET"
const UNSPLASH_BASE_URL = "https://api.unsplash.com/"
const DELAY_INPUT = 1500

const eu_photos = "photos/europe"
const eu_collections = "collections/europe"

const inputTextField = document.getElementById("inp-text")
const cardsContainer = document.getElementById("cards-container")


const debounce = (fn , delay) => {
// PROBLEM: need to debounce fn calls because listener will listen to every character inputed by user
// DONE implement debounce
    let id; 
    // console.log(`input ${id}`) // at load
    return (...args) => { 
        // console.log(`prev id: ${id}`)
        if(id) clearTimeout(id);
        id = setTimeout( () => {
            fn(...args)
        }, delay);
    }
}

const handleInputChange = (e) => {
    const userInput = e.target.value
    if( userInput ) {
        getUnsplashImgURL( userInput )
    }
}

// TODO: get the id of the card to make a request to fetch location information
const handleCardClick = (e) => {
    const val = e
    console.log(val)
}

const renderResults = ( list ) => {   
    if( cardsContainer.childNodes ){
        while( cardsContainer.firstChild ){
            cardsContainer.removeChild( cardsContainer.lastChild )
        }
    }
    list.forEach( destinationObj => createCardElement( destinationObj ))
}

// TODO - retrieve location information GET /photos/:id where id is photos id
        // on photo click fetch photo information data
const createCardElement = ( destinationObj ) => {
    const {
        urls: { small }, 
        alt_description,description, 
        user: { first_name, last_name },
        tags,
        id
    } = destinationObj

    const { title } = tags[0]
    
    const card = document.createElement("div")
    card.setAttribute("id",`id:${id}`)
    card.setAttribute("class","card target w-60 bg-base-100 shadow-xl image-full")
    card.innerHTML = `
        <figure>
            <img src="${small}" alt="${alt_description}"/>
        </figure>
        <img class="icon-heart" src="../images/icons/heart_icon.png" alt="heart icon"/>
        <div class="card-body">
            <p class="card-description">${description}</p>
            <p class="credit">Photo by ${first_name} ${last_name} on Unsplash</p>
            <p>${title}</p>
        </div>
    `
    cardsContainer.appendChild( card )
}

const handleFetchError = ({ errors }) => {
    const [ errorMessage ] = errors
}

const getUnsplashImgURL = ( query ) => {
    fetch(`${ UNSPLASH_BASE_URL }/search/photos?client_id=${ UNSPLASH_ACCESS_KEY }&page=1&per_page=10&query=${ query }}`)
        .then( response => response.json())
        .then( ({ results }) => {
            renderResults( results )}
        )
        .catch( err => console.log( err ) )
}

inputTextField.addEventListener( "input", debounce( handleInputChange, DELAY_INPUT ))
cardsContainer.addEventListener("click", handleCardClick)

window.onload = ( e ) => {
    getUnsplashImgURL('africa')
};
  