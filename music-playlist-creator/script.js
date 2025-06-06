const modal = document.getElementById("playlist-modal");
const modalOverlay = document.querySelector(".modal-overlay");
const body = document.querySelector("body");
let isModalOpen = false;

shownPlaylists = playlists;

const handleStandardModalOpen = (id) => {
  modal.style.display = "flex";
  modalOverlay.style.display = "flex";
  setTimeout(() => {
    isModalOpen = true;
  }, 10);
  modal.innerHTML = `
    <div class='playlist-info'>
        <img class='modal-playlist-image' src=${playlists[id].art}>
        <div class = 'playlist-details'>
            <div>
                <h1>${playlists[id].name}</h1>
                <h3>${playlists[id].author}</h3>
            </div>
			<div id=shuffle-div></div>
        </div>
    </div>
    <div class='playlist-songs'></div>
    `;
  renderSongs(id);
  if (document.title === "Music Playlist Explorer") {
    shuffleContainer = document.querySelector("#shuffle-div");
    shuffleContainer.innerHTML = "<h2 id='shuffle-btn'>Shuffle</h2>";
    shuffleBtn = modal.querySelector("#shuffle-btn");
    shuffleBtn.addEventListener("click", () => {
      handleShuffleBtn(id);
    });
  }
};

const handleAddModalOpen = () => {
  modal.style.display = "flex";
  modalOverlay.style.display = "flex";
  setTimeout(() => {
    isModalOpen = true;
  }, 10);
  modal.innerHTML = `
    <form id='add-form'>
        <h1>Playlist Information</h3>
        <label for='playlist-title'> Title: </label>
        <input type='text' id='playlist-title' name='playlist-title' required>
        <label for='playlist-author'>Author:</label>
        <input type='text' id='playlist-author' name='playlist-author' required>
        <label for='playlist-image'>Image (Not Required):</label>
        <input type='text' id='playlist-image' name='playlist-image'>
        <div id='adding-songs'></div>
        <button type='submit'> Create Playlist </button>
    </form>
    <form id='add-song-form'>
        <h3>Song Information:</h3>
        <label for='song-title'> Title: </label>
        <input type='text' id='song-title' name='song-title'>
        <label for='song-author'> Artist: </label>
        <input type='text' id='song-author' name='song-author'>
        <label for='song-album'> Album: </label>
        <input type='text' id='song-album' name='song-album'>
        <label for='song-length'> Length: </label>
        <input type='text' id='song-length' name='song-length'>
        <button type='submit'>Add</button>
    </form>
    `;
  newSongs = [];
  addSong = document.querySelector("#add-song-form");
  addSong.addEventListener("submit", (event) => {
    event.preventDefault();
    const titleInput = document.querySelector("#song-title");
    const title = titleInput.value;
    const artistInput = document.querySelector("#song-author");
    const artist = artistInput.value;
    const albumInput = document.querySelector("#song-album");
    const album = albumInput.value;
    const lengthInput = document.querySelector("#song-length");
    const length = lengthInput.value;
    let newSong = {
      title: title ? title : "unknown",
      artist: artist ? artist : "unknown",
      album: album ? album : "unknown",
      length: length ? length : "unknown",
      image: "assets/img/song.png",
    };
    newSongs = [...newSongs, newSong];
    event.target.reset();
  });
  addForm = document.querySelector("#add-form");
  addForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const nameInput = document.querySelector("#playlist-title");
    const name = nameInput.value;
    const authorInput = document.querySelector("#playlist-author");
    const author = authorInput.value;
    const imageInput = document.querySelector("#playlist-image");
    const image = imageInput.value;

    const newPlaylist = {
      id: playlists.length,
      name: name,
      author: author,
      art: image ? image : "assets/img/playlist.png",
      liked: true,
      likeCount: 1,
      songs: newSongs,
    };
    playlists = [...playlists, newPlaylist];
    shownPlaylists = playlists;
    event.target.reset();
  });
};

const handleShuffleBtn = (id) => {
  curSongs = playlists[id].songs;
  newSongs = shuffleArray(playlists[id].songs);
  playlists[id] = { ...playlists[id], songs: newSongs };
  renderSongs(id);
};

//render the songs
const renderSongs = (id) => {
  songContainer = modal.querySelector(".playlist-songs");
  songContainer.innerHTML = "";
  if (!playlists[id].songs) {
    songContainer.innerHTML = `
        <h1>No Songs</h1>
        `;
    return;
  }
  for (let song of playlists[id].songs) {
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
};

const handleEditModalOpen = (playlist) => {
  //TODO visual for editing playlist
};

const handleOutsideModalClick = (event) => {
  if (isModalOpen) {
    if (!modal.contains(event.target)) {
      modal.style.display = "none";
      modalOverlay.style.display = "none";
      setTimeout(() => {
        isModalOpen = false;
      }, 10);
    }
    loadPlaylistCards();
  }
};

document.addEventListener("click", handleOutsideModalClick);

const createPlaylistCard = (playlist) => {
  const playlistElement = document.createElement("div");
  playlistElement.className = "card";
  playlistElement.innerHTML = `
    <img class='playlist-image' src='${playlist.art}'>
    <h3>${playlist.name}</h3>
    <p>${playlist.author}</h3>
    <div class='playlist-actions'>
        <div class='playlist-likes'>
            <h1 class='like-btn'>${playlist.liked ? "❤️" : "🩶"}</h1>
            <p>${playlist.likeCount}</p>
        </div>
        <p class='edit-btn'>Edit</p>
        <h1 class='del-btn'>🗑️</h1>
    </div>
    `;
  playlistElement.addEventListener("click", (event) => {
    const editMenu = playlistElement.querySelector(".playlist-actions");
    if (!editMenu.contains(event.target)) {
      handleStandardModalOpen(playlist.id);
    }
  });
  return playlistElement;
};

const handleLikePlaylist = (id) => {
  //TODO
  const curLiked = playlists[id].liked;
  let nextLiked;
  if (curLiked) {
    nextLiked = false;
    playlists[id].likeCount--;
  } else {
    nextLiked = true;
    playlists[id].likeCount++;
  }
  playlists[id] = { ...playlists[id], liked: nextLiked };
  loadPlaylistCards();
};

const handleDeletePlaylist = (id) => {
  playlists.splice(id, 1);
  //update the ids of all playlists after
  for (let i = id; i < playlists.length; i++) {
    playlists[i].id--;
  }
  loadPlaylistCards();
};

const handleEditPlaylist = () => {
  //TODO
  console.log("playlist edit");
};

//for the standard playlists
const generateRandomPlaylist = (playlist) => {
  const shuffledSongs = shuffleArray(songs);
  return shuffledSongs.slice(0, 14);
};

//generic pseudo-random shuffle used to create random playlists
//and to shuffle playlists
const shuffleArray = (arr) => {
  const shuffledSongs = [...arr].sort(() => {
    return 0.5 - Math.random();
  });
  return shuffledSongs;
};

//render playlist cards - first clear all of them and then render
//each
const loadPlaylistCards = () => {
  const container = document.querySelector(".playlist-cards");
  container.innerHTML = "";
  for (let playlist of shownPlaylists) {
    const el = createPlaylistCard(playlist);
    container.appendChild(el);
    likeBtn = el.querySelector(".like-btn");
    delBtn = el.querySelector(".del-btn");
    editBtn = el.querySelector(".edit-btn");
    likeBtn.addEventListener("click", () => {
      handleLikePlaylist(playlist.id);
    });
    delBtn.addEventListener("click", () => {
      handleDeletePlaylist(playlist.id);
    });
    editBtn.addEventListener("click", () => {
      handleEditPlaylist(playlist.id);
    });
  }
};

let timesVisitedHome = 0;
//load the initial playlists at the start
document.addEventListener("DOMContentLoaded", () => {
  //give initial playlists random songs
  playlists = playlists.map((playlist) => {
    const playlistSongs = generateRandomPlaylist(playlist);
    const likeCount = Math.floor(Math.random() * 100);
    return { ...playlist, songs: playlistSongs, likeCount: likeCount };
  });
  //give first playlist zero likes
  if (playlists) {
    playlists[0] = { ...playlists[0], likeCount: 0 };
  }
  if (document.title === "Music Playlist Explorer") {
    shownPlaylists = playlists;
    loadPlaylistCards();
    search = document.querySelector("#search-form");
    search.addEventListener("submit", handleSearch);
    clear = document.querySelector("#clear-btn");
    clear.addEventListener("click", handleClear);
    addBtn = document.querySelector("#add-btn");
    addBtn.addEventListener("click", handleAddModalOpen);
  }
  if (document.title === "Featured") {
    randID = Math.floor(Math.random() * playlists.length);
    handleStandardModalOpen(randID);
  }
});

const handleSearch = (event) => {
  event.preventDefault();
  const searchInput = document.querySelector("#search-entry");
  const searchString = searchInput.value;
  shownPlaylists = playlists.filter((playlist) => {
    if (
      playlist.name.includes(searchString) ||
      playlist.author.includes(searchString)
    ) {
      return true;
    }
    return false;
  });
  loadPlaylistCards();
};

const showThesePlaylistCards = (cards) => {
  const container = document.querySelector(".playlist-cards");
  container.innerHTML = "";
  for (let playlist of cards) {
    const el = createPlaylistCard(playlist);
    container.appendChild(el);
    likeBtn = el.querySelector(".like-btn");
    delBtn = el.querySelector(".del-btn");
    editBtn = el.querySelector(".edit-btn");
    likeBtn.addEventListener("click", () => {
      handleLikePlaylist(playlist.id);
    });
    delBtn.addEventListener("click", () => {
      handleDeletePlaylist(playlist.id);
    });
    editBtn.addEventListener("click", () => {
      handleEditPlaylist(playlist.id);
    });
  }
};

const handleClear = () => {
  shownPlaylists = playlists;
  loadPlaylistCards();
  form = document.querySelector("#search-form");
  form.reset();
};


