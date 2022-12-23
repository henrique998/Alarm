// import { v4 as uuid } from 'uuid'

import './styles/global.scss'
import './styles/main.scss'

const modal = document.querySelector<HTMLDivElement>('[data-element="modal"]')
const openModalButton = document.querySelector<HTMLButtonElement>('[data-element="open-modal-button"]')
const closeModalButton = document.querySelector<HTMLButtonElement>('[data-element="close-modal-button"]')
const stopAlarmButton = document.querySelector<HTMLButtonElement>('[data-element="stop-alarm-button"]')

const selectHour = document.querySelector<HTMLSelectElement>('[data-element="select-hour"]')
const selectMinutes = document.querySelector<HTMLSelectElement>('[data-element="select-minutes"]')
const selectTimeCourse = document.querySelector<HTMLSelectElement>('[data-element="select-time-course"]')

const currentTimeExhibitor = document.querySelector<HTMLTitleElement>('[data-element="current-time-exhibitor"]')
const alarmList = document.querySelector('ul')

const form = document.querySelector<HTMLFormElement>('form')
const input = form!.querySelector('input')

let timeSelected: string
// const alarmsArr: any[] = []

function openModal() {
    modal?.classList.add('show')
}

function closeModal() {
    modal?.classList.remove('show')
}

openModalButton?.addEventListener('click', openModal)
closeModalButton?.addEventListener('click', closeModal)

function generateTimeUnitNumbers(limit: number, select: HTMLSelectElement) {
    for (let i = 0; i <= limit; i++) {
        select!.innerHTML += `
            <option value=${i}>
                ${String(i).padStart(2, '0')}
            </option>
        `
    }
}

const audio = new Audio('/ringtone.mp3')
const timeCourseSelected = selectTimeCourse?.value

function setCurrentTime() {
    const now = new Date()

    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')

    currentTimeExhibitor!.innerText = `${hours}:${minutes}`

    if (timeSelected === `${hours}:${minutes} ${timeCourseSelected}`) {
        audio.play()
        audio.loop = true

        stopAlarmButton!.removeAttribute('disabled')
    }
}

generateTimeUnitNumbers(23, selectHour!)
generateTimeUnitNumbers(59, selectMinutes!)

const alarmInterval = setInterval(setCurrentTime, 1000)

form?.addEventListener('submit', e => {
    e.preventDefault()

    const alarmLabel = input!.value

    const hourSelected = selectHour!.value
    const minutesSelected = selectMinutes!.value

    const hourEdited = `${hourSelected.padStart(2, '0')}`
    const minutesEdited = `${minutesSelected.padStart(2, '0')}`

    timeSelected = `${hourEdited}:${minutesEdited} ${timeCourseSelected}`

    const newAlarm = `
        <li class="item">
            <div class="content">
                <h2>
                    ${hourEdited}:${minutesEdited}

                    <strong>${timeCourseSelected}</strong>
                </h2>

                <p>${alarmLabel}</p>
            </div>

            <button>
                <i class="ph-trash-fill"></i>
            </button>
        </li>
    `
    alarmList!.innerHTML += newAlarm

    input!.value = ''
    selectHour!.value = ''
    selectMinutes!.value = ''
    selectTimeCourse!.value = ''

    closeModal()
})

function stopAlarm() {
    audio.pause()
    clearInterval(alarmInterval)
    stopAlarmButton!.toggleAttribute('disabled')
}

stopAlarmButton?.addEventListener('click', stopAlarm)
