import "./styles.css"
import { UI } from  "./modules/UI"
import { API } from "./modules/API"

UI.search.addEventListener('submit', async (e) => cityNameChecker(e))
UI.search.addEventListener('input', (e) => {
    e.preventDefault()
    e.target.setCustomValidity('')
}) 

async function cityNameChecker(e){
    const input = document.getElementById('input')
    input.setCustomValidity('')
    e.preventDefault()
    if(!UI.search.checkValidity()){
        return
    }
        try{
        const formData = new FormData(UI.search)
        const request = formData.get('input')
        const citiesArr = await API.getCitiesList(request)
        if(citiesArr.length !== 0){
            const cityList = UI.cityChooser(citiesArr)
            UI.replaceElement(UI.search, cityList)
            addListener(cityList)
        } else {
        throw 'No cities with that name'
        }
        } catch (err) {
            input.setCustomValidity(err)
            UI.search.reportValidity()
        }
}

const addListener = (element) => {
    element.addEventListener('submit', async (e) => {
        e.preventDefault()
        const data = new FormData(element) 
        const coord = JSON.parse(data.get('coords'))
        UI.replaceElement(element, UI.search)
        getWeather(coord, 'forecast')
       })
    const cancel = document.getElementById('cancel')
    cancel.addEventListener('click', () =>{
        UI.replaceElement(element, UI.search)
    })
}

const getWeather = async (coord) => {
    coord.type = 'weather'
    const weatherData = await API.getWeatherData(coord)
    coord.type = 'forecast'
    const forecast = await API.getWeatherData(coord)
    makeWeatherDiv(weatherData, 'weather')
    makeWeatherDiv(forecast, 'forecast')
}

const makeWeatherDiv = (data, type) => {
    if(document.getElementById(type)){
        document.getElementById(type).remove()
    }
    let div
    if(type === 'forecast'){
        div = UI.createForecast(data)
    } else if(type === 'weather'){
        div = UI.createCurrentWeather(data)    
    }
    UI.content.append(div)
}
