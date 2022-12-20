"use strict"

const DELAY_INPUT = 1500
const UNSPLASH_ACCESS_KEY = "SECRET"
const UNSPLASH_BASE_URL = "https://api.unsplash.com/"
const eu_photos = "photos/europe"
const eu_collections = "collections/europe"
const inputTextField = document.getElementById("inp-text")
const cardsContainer = document.getElementById("cards-container")

/* FETCH REQUESTs */
const getFullCardInfo = async (card_id) => {
    const result = await fetch(`${UNSPLASH_BASE_URL}/photos/${card_id}/?client_id=${ UNSPLASH_ACCESS_KEY }`)
    const data = await result.json()  // gets location information (lat/lon, tags, similar collections, etc)
    return data
}
const getUnsplashImgURL = ( query ) => {
    fetch(`${ UNSPLASH_BASE_URL }/search/photos?client_id=${ UNSPLASH_ACCESS_KEY }&page=1&per_page=10&query=${ query }}`)
        .then( response => response.json())
        .then( ({ results }) => {
            renderResults( results )
        })
        .catch( err => console.log( err ) )
}    
const updateOneUser = async ( data ) => {
    // update users favorites cards array - add new favorited location
    const SERVER = "http://localhost:3000/user"
    const OPTIONS = {
        method: "PUT",
        body: JSON.stringify( data ),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      }
    const result = await fetch(SERVER,OPTIONS)
    const msg = await result.json() // ackhowledge: true if successful
    console.log(msg)
}
const updateOneCard = async ( data ) => {
    // const result = await fetch("")
    const SERVER = "http://localhost:3000/favorites"
    const OPTIONS = {
        method: "PUT",
        body: JSON.stringify( data ),
        headers: {"Content-type": "application/json; charset=UTF-8"}
      }
    const result = await fetch(SERVER,OPTIONS)
    const msg = await result.json() // ackhowledge: true if successful
}

/* Auth0 Client */
const getAuthConfiguration = async () => {
    const result = await fetch("http://localhost:3000/auth_config")
    const auth_configs = await result.json()
    return auth_configs
}
const handleUserAuthCredentials = async (client) => {
    
    const loginButton = document.getElementById("login");
    const logoutButton = document.getElementById("logout");

    loginButton.addEventListener("click", (e) => {
        e.preventDefault();
        client.loginWithRedirect();
    });
    
    if (location.search.includes("state=") && 
        (location.search.includes("code=") || 
        location.search.includes("error="))
    ){
    await client.handleRedirectCallback();
    window.history.replaceState({}, document.title, "/");
    }
    
    logoutButton.addEventListener("click", (e) => {
    e.preventDefault();
    client.logout();
    });
}
const handleGetProfile = async (client) => {
    const isAuthenticated = await client.isAuthenticated()
    const userProfile = await client.getUser()
    const profileElement = document.getElementById("profile")
    if (isAuthenticated) {
        profileElement.style.display = "block"
        profileElement.innerHTML = `
                <p>${userProfile.name}</p>
                <img src="${userProfile.picture}" />
            `
    } else profileElement.style.display = "none"
}
const handleGetUsersFavorites = async (client) => {
    const isAuthenticated = client.isAuthenticated()
    let favorited = []
    if(isAuthenticated){
        const result = await fetch("http://localhost:3000/user")
        const user = await result.json()
        const { favorited:usersFavorited } = user[0]
        favorited = [ ...usersFavorited ]
    }

    // handle rendering of cards

}
const getAuthClient = async () => {
    const auth_configs = await getAuthConfiguration()
    const config = {
        ...auth_configs, 
        authorizationParams: { redirect_uri: window.location.origin }
    }
    return (
        auth0
            .createAuth0Client( config )
            .then( async auth0Client => auth0Client)
            .catch( (err) => console.log(err) )
    )
}
const auth0Client = getAuthClient()
auth0Client
    .then( async client => {
        await handleUserAuthCredentials( client )
        await handleGetProfile( client )
        await handleGetUsersFavorites( client )
    })
    .catch( err => console.log(err) )
const handleHeartClick = async (e) => { 
    auth0Client
        .then( async client => {
            const isAuthenticated = await client.isAuthenticated()
            if( isAuthenticated ){
                const userProfile = await client.getUser()
                const { sub, updated_at, ...rest } = userProfile
                const [ , card_id ] = e.target.id.split(":")
                const [ , sub_id ] = sub.split("|") 
                
                const card_data = await getFullCardInfo( card_id )
                const { alt_description, description, tags, urls: { raw: img_url }  } = card_data
                let selected_tags = tags.filter( tag => tag.type == "search" )
                const CARD_DATA = { card_id, sub_id, alt_description, description, selected_tags, img_url}
                const USER_DATA = { sub_id, card_id, ...rest }

                updateOneCard( CARD_DATA )
                updateOneUser( USER_DATA )
            }
        })
        .catch( err => console.log(err) )
}

/* UI */
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
    if( userInput ) getUnsplashImgURL( userInput )
}
const handleCardClick = async (e) => {
// DONE: get the id of the card to make a request to fetch location information
    const id_attribute = e.target.id
    const [ , id ] = id_attribute.split(":")
    const card_data = await getFullCardInfo( id )
    return card_data
}
const renderResults = ( list ) => {   
    if( cardsContainer.childNodes ){
        while( cardsContainer.firstChild ){
            cardsContainer.removeChild( cardsContainer.lastChild )
        }
    }
    
    list.forEach( destinationObj => createCardElement( destinationObj ))
    const heartIcons = document.querySelectorAll(".icon-heart")
    heartIcons.forEach( icon => {
        icon.addEventListener("click", handleHeartClick)
    })

}
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
    card.setAttribute("id",`cardID:${id}`)
    card.setAttribute("class","card target w-60 bg-base-100 shadow-xl image-full")
    card.innerHTML = `
    <div id=id:${id}>
        <figure>
            <img src="${small}" alt="${alt_description}"/>
        </figure>
        <img id="hearts-cardID:${id}" class="icon-heart" src="../images/icons/heart_icon.png" alt="heart icon"/>
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

inputTextField.addEventListener( "input", debounce( handleInputChange, DELAY_INPUT ))
window.onload = () => {
    getUnsplashImgURL('africa')
    // runAuth()
};


// const runAuth = async () => {
    // const auth_configs = await getAuthConfiguration()
    // const config = {
    //     ...auth_configs, 
    //     authorizationParams: { redirect_uri: window.location.origin }
    // }
//     auth0
//         .createAuth0Client( config )
//         .then( async (auth0Client) => {
//             await handleUserAuthCredentials( auth0Client )
//             await handleGetProfile( auth0Client )
//             await handleGetUsersFavorites( auth0Client )
//             // await handleAddToUsersFavorites( auth0Client )
//         })
//         .catch( ( err ) => console.log( err ))
// }
/*  
    email: "hodo@user.com"
    email_verified: false
    name: "hodo@user.com"
    nickname: "hodo"
    picture: "https://s.gravatar.com/avatar/15e3d87fc8e38a8e03de36456d6a6547?s=480&r=pg&d=https%3A%2F%2Fcdn.auth0.com%2Favatars%2Fho.png"
    sub: "auth0|639ff283d8dbda8325b0e654"
    updated_at: "2022-12-19T15:10:58.763Z"
*/
// const isAuthenticated = await auth0Client.isAuthenticated();
// const userProfile = await auth0Client.getUser(); 
// const profileElement = document.getElementById("profile");

// if (isAuthenticated) {
//   profileElement.style.display = "block";
//   profileElement.innerHTML = `
//           <p>${userProfile.name}</p>
//           <img src="${userProfile.picture}" />
//         `;
// } else {
//   profileElement.style.display = "none";
// }