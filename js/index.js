"use strict"

const UNSPLASH_ACCESS_KEY = "Vd8pXJDerwdrThr-HAsU9U8LHjAuWlFzi782_HYjlqU"
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

const renderResults = ( list ) => {
    
    if( cardsContainer.childNodes ){
        while( cardsContainer.firstChild ){
            cardsContainer.removeChild( cardsContainer.lastChild )
        }
    }

    list.forEach( destinationObj => createCardElement( destinationObj ))
}

// TODO - render tags on each image 
        // will allow the user to search for new locations + reload landing pg results
// TODO - check for bad/null descriptions (null, personal description of author)
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
    card.setAttribute("id","virtual-card")
    card.innerHTML = `
        <div id="photo-${id}" class="card w-60 bg-base-100 shadow-xl image-full">
            <figure>
                <img src="${small}" alt="${alt_description}"/>
            </figure>
            <div class="card-body">
                <p class="card-description">${description}</p>
                <p class="credit">Photo by ${first_name} ${last_name} on Unsplash</p>
                <p>${title}</p>
            </div>
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

// TODO randomize locations for every page refresh
window.onload = ( e ) => {
    getUnsplashImgURL('africa')
};
  