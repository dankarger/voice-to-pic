const textDiv = document.querySelector('#text-div');
const textElement = textDiv.querySelector('.text');

export const textGenerator = (text) => {
    textElement.classList.add('fade-in')
    textDiv.classList.add('position--top');
    const fontSize = (textDiv.clientWidth / text.length);
    textElement.style.fontSize = `${fontSize}px`;
    textElement.textContent = text;
}

export const colorText = (color) => {
    textElement.style.color = color;
}

export const textPosition = (position) => {
    if (position === ' top' || position === 'stop' || position === 'up') {
        textDiv.classList.remove('fade-in')
        textDiv.classList.add('fade-out');
        textDiv.classList.remove('position---center');
        textDiv.classList.remove('position---bottom');
        textDiv.classList.remove('fade-out');
        textDiv.classList.add('fade-in')
        textDiv.classList.add('position--top');
    }else if (position.toLowerCase() === ' center' || position.toLowerCase() === 'middle') {
        textDiv.classList.remove('fade-in')
        textDiv.classList.add('fade-out');
        textDiv.classList.remove('position---top');
        textDiv.classList.remove('position---bottom');
        textDiv.classList.remove('fade-out');
        textDiv.classList.add('fade-in')
        textDiv.classList.add('position--center');
    }
    else if (position=== ' bottom' || position === 'down') {
        textDiv.classList.remove('fade-in')
        textDiv.classList.add('fade-out');
        textDiv.classList.remove('position---top');
        textDiv.classList.remove('position---center');
        textDiv.classList.remove('fade-out');
        textDiv.classList.add('fade-in');
        textDiv.classList.add('position--bottom');
    }

}