const modal = document.getElementById('playlist-modal');
const body = document.querySelector('body');
let isModalOpen = false;

const handleModalOpen = () => {
    console.log('handle modal open');
    modal.style.display = 'grid';
    setTimeout(()=>{
        isModalOpen = true;
    },10)
}

const handleOutsideModalClick = (event) => {
    console.log('outside modal click');
    if (isModalOpen){
        if (!modal.contains(event.target)){
            modal.style.display = 'none';
        }
        isModalOpen = false;
    }
}
document.addEventListener('click', handleOutsideModalClick);


const playlists = document.getElementsByClassName('card');
for (playlist of playlists){
    playlist.addEventListener('click', handleModalOpen);
}