const listBoxes = document.querySelectorAll('.random');
let index = 1;
listBoxes.forEach(box => {
    box.style.background = `url(/svgs/${index}.svg)`;
    box.style.backgroundSize = '100% 100%';
    index++;
    if(index === 9) index = 1;
});