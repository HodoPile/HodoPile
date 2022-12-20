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
    const id_attribute = e.target.firstElementChild.id
    const [ ,id ] = id_attribute.split(":")
    
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
        alt_description,
        description, 
        user: { first_name, last_name },
        tags,
        id
    } = destinationObj

    const { title } = tags[0]
    
    const card = document.createElement("div")
    card.setAttribute("id","virtual-card")
    card.setAttribute("class","card target w-60 bg-base-100 shadow-xl image-full")   
     card.innerHTML = `
    <div id=id:${id}>
        <figure>
            <img src="${small}" alt="${alt_description}"/>
        </figure>
        <img class="icon-heart" src="../image/" alt="heart icon"/>
        <div class="card-body">
            <p class="card-description">${description}</p>
            <p class="credit">Photo by ${first_name} ${last_name} on Unsplash</p>
            <p>${title}</p>
        </div>
    </div>
    `
    card.addEventListener( "click", handleCardClick )
    cardsContainer.appendChild( card )
}

const handleFetchError = ({ errors }) => {
    const [ errorMessage ] = errors
}

const getUnsplashImgURL = ( query ) => {
    fetch(`${ UNSPLASH_BASE_URL }/search/photos?client_id=${ UNSPLASH_ACCESS_KEY }&page=1&per_page=10&query=${ query }}`)
        .then( response => response.json())
        .then( ({ results }) => {
            renderResults( results )
        })
        .catch( err => console.log( err ) )
}

inputTextField.addEventListener( "input", debounce( handleInputChange, DELAY_INPUT ))

/* AUTHENTICATION */

const runAuth = async () => {
    const result = await fetch("http://localhost:3000/auth_config")
    const auth_configs = await result.json()
    const config = {
            ...auth_configs,
            authorizationParams: { redirect_uri: window.location.origin }
        }
    auth0.createAuth0Client( config )
        .then( async ( auth0Client ) => {
        const loginButton = document.getElementById("login");
        const logoutButton = document.getElementById("logout");
      
        loginButton.addEventListener("click", (e) => {
          e.preventDefault();
          auth0Client.loginWithRedirect();
        });
      
        if (location.search.includes("state=") && 
            (location.search.includes("code=") || 
            location.search.includes("error="))
        ) {
          await auth0Client.handleRedirectCallback();
          window.history.replaceState({}, document.title, "/");
        }
        
        logoutButton.addEventListener("click", (e) => {
          e.preventDefault();
          auth0Client.logout();
        });
      
        const isAuthenticated = await auth0Client.isAuthenticated();
        const userProfile = await auth0Client.getUser();
        /*  
            email: "hodo@user.com"
            email_verified: false
            name: "hodo@user.com"
            nickname: "hodo"
            picture: "https://s.gravatar.com/avatar/15e3d87fc8e38a8e03de36456d6a6547?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fho.png"
            sub: "auth0|639ff283d8dbda8325b0e654"
            updated_at: "2022-12-19T15:10:58.763Z"
        */
        const profileElement = document.getElementById("profile");
      
        if (isAuthenticated) {
          profileElement.style.display = "block";
          profileElement.innerHTML = `
                  <p>${userProfile.name}</p>
                  <img src="${userProfile.picture}" />
                `;
        } else {
          profileElement.style.display = "none";
        }
        })
        .catch( ( err ) => console.log( err ))
}

const getFavs = async () => {
    const result = await fetch("http://localhost:3000/user")
    const user = await result.json()
}

window.onload = ( e ) => {
    getUnsplashImgURL('africa')
    runAuth()
    getFavs()
};
