const modal = document.getElementById('playlist-modal');
const body = document.querySelector('body');
let isModalOpen = false;

const handleStandardModalOpen = (id) => {
    modal.style.display = 'flex';
    setTimeout(()=>{
        isModalOpen = true;
    },10)
    modal.innerHTML = `
    <div class='playlist-info'>
        <img class='modal-playlist-image' src=${playlists[id].art}>
        <div class = 'playlist-details'>
            <div>
                <h1>${playlists[id].name}</h1>
                <h3>${playlists[id].author}</h3>
            </div>
            <h2 id='shuffle-btn'>Shuffle</h2>
        </div>
    </div>
    <div class='playlist-songs'></div>
    `;
    renderSongs(id);
    shuffleBtn = modal.querySelector('#shuffle-btn');
        shuffleBtn.addEventListener('click', ()=>{
            handleShuffleBtn(id)
        });
}

const handleShuffleBtn = (id) => {
    curSongs = playlists[id].songs;
    newSongs = shuffleArray(playlists[id].songs);
    playlists[id] = {...playlists[id], songs: newSongs};
    renderSongs(id);
}

//render the songs
const renderSongs = (id) => {
    songContainer = modal.querySelector('.playlist-songs');
    songContainer.innerHTML = '';
    for (let song of playlists[id].songs){
        songContainer.innerHTML += `
        <div class='song'>
            <img class='song-image' src=${song.image}>
            <div class='song-data'>
                <div class='song-details'>
                    <h3>${song.title}</h3>
                    <p>${song.artist}</p>
                    <p>${song.album}</p>
                </div>
                <p>${song.length}</p>
            </div>
        </div>
        `;
    }
}

const handleEditModalOpen = (playlist) => {
    //TODO visual for editing playlist
}

const handleOutsideModalClick = (event) => {
    if (isModalOpen){
        if (!modal.contains(event.target)){
            console.log('click outside modal - closing');
            modal.style.display = 'none';
            setTimeout(() => {
                isModalOpen = false;
            },10)
        }
    }
}

document.addEventListener('click', handleOutsideModalClick);


const createPlaylistCard = (playlist) => {
    const playlistElement = document.createElement('div');
    playlistElement.className = 'card';
    playlistElement.innerHTML = `
    <img class='playlist-image' src='${playlist.art}'>
    <h3>${playlist.name}</h3>
    <p>${playlist.author}</h3>
    <div class='playlist-actions'>
        <div class='playlist-likes'>
            <h1 class='like-btn'>${playlist.liked ? '❤️' : '🩶'}</h1>
            <p>${playlist.likeCount}</p>
        </div>
        <p class='edit-btn'>Edit</p>
        <h1 class='del-btn'>🗑️</h1>
    </div>
    `;
    playlistElement.addEventListener('click', (event)=>{
        const editMenu = playlistElement.querySelector('.playlist-actions');
        if (!editMenu.contains(event.target)){
            handleStandardModalOpen(playlist.id);
        }
    });
    return playlistElement;
}

const handleLikePlaylist = (id) => {
    //TODO
    const curLiked = playlists[id].liked;
    let nextLiked;
    if (curLiked){
        nextLiked = false;
        playlists[id].likeCount--;
    }
    else{
        nextLiked = true;
        playlists[id].likeCount++;
    }
    playlists[id] = {...playlists[id], 'liked': nextLiked}
    loadPlaylistCards();
}

const handleDeletePlaylist = (id) => {
    //TODO
    console.log('playlist delete');
    playlists.splice(id, 1);
    //update the ids of all playlists after
    for (let i = id; i < playlists.length; i++){
        playlists[i].id--;
    }
    loadPlaylistCards();
}

const handleEditPlaylist = () => {
    //TODO
    console.log('playlist edit');
}

//for the standard playlists
const generateRandomPlaylist = (playlist) => {
    const shuffledSongs = shuffleArray(songs);
    return shuffledSongs.slice(0, 14);
}

//generic pseudo-random shuffle used to create random playlists
//and to shuffle playlists
const shuffleArray = (arr) => {
    const shuffledSongs = [...arr].sort(()=>{
        return 0.5-Math.random();
    })
    return shuffledSongs;
}

//render playlist cards - first clear all of them and then render
//each
const loadPlaylistCards = () => {
    const container = document.querySelector('.playlist-cards');
    container.innerHTML = '';
    for (let playlist of playlists){
        const el = createPlaylistCard(playlist);
        container.appendChild(el);
        likeBtn = el.querySelector('.like-btn');
        delBtn = el.querySelector('.del-btn');
        editBtn = el.querySelector('.edit-btn');
        likeBtn.addEventListener('click', () => {
            handleLikePlaylist(playlist.id);
        });
        delBtn.addEventListener('click', () => {
            handleDeletePlaylist(playlist.id);
        });
        editBtn.addEventListener('click', () => {
            handleEditPlaylist(playlist.id);
        });
    }
}


//load the initial playlists at the start
document.addEventListener('DOMContentLoaded', () => {
    //give initial playlists random songs
    playlists = playlists.map((playlist) => {
        const playlistSongs = generateRandomPlaylist(playlist);
        const likeCount = Math.floor(Math.random()*100)
        return {...playlist, 'songs': playlistSongs, 'likeCount': likeCount};
    })
    loadPlaylistCards();
    featBtn = document.querySelector('.featured-btn');
    featBtn.addEventListener('click', handleFeatBtn);
})



//featured playlist
const handleFeatBtn = () => {
    randID = Math.floor(Math.random()*playlists.length)
    handleStandardModalOpen(randID);
}