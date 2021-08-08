// $('.icon-menu').click(function(event) {
//     $(this).toogleClass('active');
//     $('menu__body').toogleClass('active');
//     $('body').toogleClass('lock');
// })

function ibg() {
    let ibg = document.querySelectorAll(".ibg");
    for (let i = 0; i < ibg.length; i++) {
        if(ibg[i].querySelector('img')) {
            ibg[i].style.backgroundImage = 'url('+ibg[i].querySelector('img').getAttribute('src')+')';
        }
    }
}


// const headerMenu = document.getElementsByClassName('header__menu')
// console.log(headerMenu)
// headerMenu.addEventListener('click', (event) => {
//     console.log('handleBurger')

// })


ibg()