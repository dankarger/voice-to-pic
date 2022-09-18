import getImageSecondOption from "./api";
import {colorText, textPosition, textGenerator} from "./textGenerator";
import {convertHtmlToCanvas, clearCurrenImg, downloadFromBtn} from "./exporting";
import {continueCommandButtonFunction} from "./commandsMenu";
import {speak} from "./textToSpeech";
import stagesDescriptionConstant, {commandList, instructionsConstant} from "./constants";
import './styles/styles.scss'

const searchForm = document.querySelector("#search-form");
const searchFormatInput = document.querySelector("#firstInput");
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
const stageDescription = document.querySelector('#stage-description');
const stageDiv = document.querySelector('.stage-div');
const stageCounter = stageDiv.querySelector('.stage-counter');
const infoScreen = document.querySelector('.info-screen')
const recognitionText = document.querySelector('.recognition--text');
const userInputText = document.querySelector('.user-input');
const instructionBtnNavbar = document.querySelector('#instructions-btn-navbar');
const instructionDiv = document.querySelector('.instructions-div');
const instructionUl = instructionDiv.querySelector(".instructions-ul");
const instructionsGeneralDiv = instructionDiv.querySelector('.general-instructions-ul');
const instructionsCommandDiv = instructionDiv.querySelector('.instructions-command-div');


const isSpeechOn = true;
let stage = 0;
let currentTitle = '';

const injectCommand = () => {

    for (const command in commandList) {
        const commandText = document.createElement('p');
        commandText.classList.add('commands-p')
        commandText.textContent = `● "${command}": ${commandList[command]}`
        // infoScreen.appendChild(commandText);
        instructionsCommandDiv.appendChild(commandText)
    }
    for (const steps of instructionsConstant.steps) {
        const stepListItem = document.createElement('li');
        stepListItem.classList.add('step-item');
        stepListItem.textContent = `${steps}`
        instructionUl.appendChild(stepListItem)
    }
    for (const line of instructionsConstant.general) {
        const generalInstructionLine = document.createElement('p')
        generalInstructionLine.classList.add('general-line');
        generalInstructionLine.textContent = `${line}`;
        instructionsGeneralDiv.appendChild(generalInstructionLine)
    }

}

injectCommand();

if (SpeechRecognition) {
    console.log("browser support");
    const micBtn = searchForm.querySelector("button");
    const micIcon = searchForm.querySelector(".icon");
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    // recognition.lang = "he"  // -----------------  hebrew
    recognition.lang = "en";
    micBtn.addEventListener('click', micBtnClick);
    function micBtnClick() {
        if (micIcon.classList.contains('mic-off')) {
            recognition.start();
            // updateStageInformation()
            speak(stagesDescriptionConstant[stage]);
            stage=0
             activateStage(stage, "");
            stageCounter.textContent = `${stage}`;
        } else {

            recognition.stop();
            stage=0;
        }
    }

    recognition.addEventListener("start", startSpeechRecognition);// <=> recognition.onstart = function(){...}
    function startSpeechRecognition() {
        micIcon.classList.remove('mic-off');
        micIcon.classList.add('mic-on');
        // searchFormatInput.focus();
        console.log("Speech Recognition Active")

    }

    recognition.addEventListener("end", endSpeechRecognition);// <=> recognition.onend = function(){...}
    function endSpeechRecognition() {
        micIcon.classList.remove('mic-on');
        micIcon.classList.add('mic-off');
        // searchFormatInput.focus();
        console.log("Speech Recognition Disconnected")
    }

    recognition.addEventListener("result", resultOfSpeechRecognition);// <=> recognition.onresult = function(){...}
    async function resultOfSpeechRecognition(event) {
        recognitionText.textContent = "";
        recognitionText.classList.remove('fade-out');
        recognitionText.classList.add('fade-in')

        const currentResult = event.resultIndex
        const transcript = event.results[currentResult][0].transcript;
        updateUserInput(transcript);
        // searchFormatInput.value = transcript;
        if (transcript.toLowerCase().trim() === 'stop recording') {
            recognition.stop()
        } else if (!searchFormatInput.textContent) {
            searchFormatInput.textContent = transcript
        }

        // setTimeout(() => {
        recognitionText.textContent = transcript;
        recognitionText.classList.remove('fade-in')
        recognitionText.classList.add('.fade-out');

        await activateStage(stage, transcript)
        // searchForm.submit();
        // }, 10)
    }
} else {
    console.log("browser dont support")
}

export const activateStage = async (stage, transcript) => {
    if (transcript === ' go back') {
        // updateStageInformation();
        console.log('goback1',stage)
        if(stage > 1){
            stage -=3;
        }else {
            stage = 1
            return

        }
        console.log('goback2',stage)

        updateStageInformation();
        return
    } else if (transcript === 'erase') {
        await clearCurrenImg();

    } else if (transcript === ' continue' || transcript === 'next') {
        updateStageInformation();
    } else if (transcript === 'download' || transcript === ' download') {
        await convertHtmlToCanvas(currentTitle);
        // await activateStage(0,"")
        const micBtn = searchForm.querySelector("button");
        stage = 0
        micBtn.click()
        // activateStage(0,"")
        searchFormatInput.value = transcript

        // await activateStage(0, '')
    }
    if (stage === 0) {
        speak(stagesDescriptionConstant[stage])
        updateStageInformation()
    } else if (stage === 1) {
        getImageSecondOption(transcript);
        currentTitle = transcript;
        updateStageInformation();
        searchFormatInput.value = transcript
    } else if (stage === 2) {
        searchFormatInput.value = transcript
        textGenerator(transcript);
        updateStageInformation();
    } else if (stage === 3) {
        colorText(transcript);
        searchFormatInput.value = transcript
    } else if (stage === 4) {
        textPosition(transcript.toLowerCase());
        // updateStageInformation();

    }
}

const updateStageInformation = () => {


    stage < 4 ? stage++ : stage = 1;
    stageDescription.textContent = stagesDescriptionConstant[stage];
    speak(stagesDescriptionConstant[stage]);
    stageCounter.textContent = `${stage}`;
    console.log('dsdsdsdsd',stage)

}

const updateUserInput = (input) => {
    userInputText.classList.remove('fade-in');
    userInputText.classList.add('fade-out');
    userInputText.textContent = `user: ${input}`;
    userInputText.classList.remove('fade-out');
    userInputText.classList.add('fade-in');
}

const handleInstructionBtnNavbarClick = ()=> {
    instructionDiv.classList.toggle('visible');
}


// const clearCurrenImg = () => {
//     const title = document.querySelector('#title-id');
//     const currentImage = document.querySelector('#currentImage');
//     const imageDiv = document.querySelector('.container-img')
//     currentImage.remove();
//     imageDiv.remove();
//     textElement.textContent = '';
//     title.remove();
// }



stageDiv.addEventListener('click', () => speak(stagesDescriptionConstant[stage], true))
searchForm.addEventListener('submit', event => {
    event.preventDefault();
    console.log('Form submission cancelled.');

});

// Event Listeners

const commandContainer = document.querySelector('.commands-container');
const commandButton = commandContainer.querySelector('.continue');
const goBackButton = commandContainer.querySelector('.go-back');
commandButton.addEventListener('click',continueCommandButtonFunction);
goBackButton.addEventListener('click',continueCommandButtonFunction);

instructionBtnNavbar.addEventListener('click',handleInstructionBtnNavbarClick);
instructionDiv.addEventListener('click',handleInstructionBtnNavbarClick);