import "./styles.css"
import { UI } from  "./modules/UI"
import { API } from "./modules/API"
import { weatherUpdater } from "./modules/WeatherUpdater"


UI.search.addEventListener('submit', async (e) => {
        e.preventDefault()
        const input = document.getElementById('input')
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
})

const addListener = (element) => {
    element.addEventListener('submit', (e) => {
        e.preventDefault()
        const data = new FormData(element) 
        const coord = JSON.parse(data.get('coords'))
        UI.replaceElement(element, UI.search)
        getWeather(coord)
    })
    const cancel = document.getElementById('cancel')
    cancel.addEventListener('click', () =>{
        UI.replaceElement(element, UI.search)
    })
}

const getWeather = async (coord) => {
    const weatherData = await API.getWeatherData(coord)
    weatherUpdater.updateWeather(weatherData)
}

UI.weatherUIElements.forEach((f) => weatherUpdater.addSub(f))