
function ibg() {
    let ibg = document.querySelectorAll(".ibg");
    for (let i = 0; i < ibg.length; i++) {
        if(ibg[i].querySelector('img')) {
            ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
        }
    }
}

function burgeMenuHandler() {
    const headerMenu = document.getElementById('headerMenu')
    headerMenu.addEventListener('click', (event) => {

        if (event.target.nodeName
            && event.target.nodeName.toLowerCase() == 'span') {
            
            document.getElementById('iconMenu').classList.toggle('active')
            document.getElementById('iconMenuBody').classList.toggle('active')
        }
    })
}


ibg()
burgeMenuHandler()