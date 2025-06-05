const modal = document.getElementById('playlist-modal');
const body = document.querySelector('body');
let isModalOpen = false;

const handleStandardModalOpen = (playlist) => {
    modal.style.display = 'flex';
    setTimeout(()=>{
        isModalOpen = true;
    },10)
    modal.innerHTML = `
    <div class='playlist-info'>
        <img class='modal-playlist-image' src=${playlist.art}>
        <div class = 'playlist-details'>
            <div>
                <h1>${playlist.name}</h1>
                <h3>${playlist.author}</h3>
            </div>
            <h2 id='shuffle-btn'>Shuffle</h2>
        </div>
    </div>
    <div class='playlist-songs'></div>
    `;
    songContainer = modal.querySelector('.playlist-songs');
    for (let song of playlist.songs){
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
        shuffleBtn = modal.querySelector('#shuffle-btn');
        shuffleBtn.addEventListener('click', handleShuffleBtn);
    }
}

const handleShuffleBtn = () => {
    console.log('shuffle click');
}

const handleEditModalOpen = (playlist) => {
    //TODO visual for editing playlist
}

const handleOutsideModalClick = (event) => {
    if (isModalOpen){
        if (!modal.contains(event.target)){
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
        <button id='edit-btn' onclick='handleEditPlaylist()'>Edit</button>
        <h1 class='del-btn'>🗑️</h1>
    </div>
    `;
    playlistElement.addEventListener('click', (event)=>{
        const editMenu = playlistElement.querySelector('.playlist-actions');
        if (!editMenu.contains(event.target)){
            handleStandardModalOpen(playlist);
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
    return shuffledSongs.slice(0, 29);
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
        likeBtn.addEventListener('click', () => {
            handleLikePlaylist(playlist.id);
        });
        delBtn.addEventListener('click', () => {
            handleDeletePlaylist(playlist.id);
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
})