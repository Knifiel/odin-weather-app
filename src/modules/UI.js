import arrow from '../img/arrow.svg'
import logo from '../img/OpenWeather-Master-Logo RGB.png'

const app = document.getElementById('app')
const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'region' })
const regNames = regionNamesInEnglish

const header = document.createElement('div')
header.id = 'header'

const search = searchCitiesField()

const content = document.createElement('div')
content.id = 'content'

const credit = makeCreditDiv()

app.append(header)
header.append(credit)
header.append(search)
app.append(content)

function searchCitiesField(){
    const form = document.createElement('form')
    form.id = 'search'
    form.action = 'javascript:void(0)'

    const input = document.createElement('input')
    input.name = 'input'
    input.id = 'input'
    input.setAttribute('for', 'search')
    input.setAttribute('type', 'text')
    input.setAttribute('minlength', '1')
    input.setAttribute('pattern', "^([a-zA-Z\u0080-\u024F]+(?:. |-| |'))*[a-zA-Z\u0080-\u024F]*$")
    input.value = 'London'

    const button = document.createElement('button')
    button.type = 'submit'
    button.innerText = 'Submit'
    button.setAttribute('for', 'search')
    form.appendChild(input)
    form.appendChild(button)
    return form
}

function citiesChooser(citiesArr){
    const form = document.createElement('form')
    form.id = 'cityList'
    form.action = 'javascript:void(0)'
    const list = document.createElement('select')
    list.classList.add('citiesList')
    list.name = 'coords'
    citiesArr.forEach(city => {
        const option = document.createElement('option')
        option.innerText = `${city.name} in ${regNames.of(city.country)}${ (city.state !== undefined) ? ` of the state: ${city.state}`: ''}`
        option.value = `{"lat": "${city.lat}", "lon":"${city.lon}"}`
        list.appendChild(option)
    });

    form.appendChild(list)
    const submit = document.createElement('button')
    submit.id = 'submit'
    submit.innerText = 'Confirm'
    const cancel = document.createElement('button')
    cancel.id = 'cancel'
    cancel.type = 'button'
    cancel.innerText = 'Cancel'
    form.appendChild(submit)
    form.appendChild(cancel)
    return form
}

function replaceElement(target, newElement) {
    const parent = target.parentNode
    target.remove(),
    parent.appendChild(newElement)
}

function createForecast(data){
    const div = document.createElement('div')
    div.id = 'forecast'
    const h = document.createElement('div')
    h.classList.add('head')
    const h2 = document.createElement('h2')
    h2.textContent = "Weather forecast:"
    h.appendChild(h2)
    div.appendChild(h)
    const list = document.createElement('ul')
    div.appendChild(list)
    const headers = forecastHeader()
    list.appendChild(headers)
    data.list.forEach((forecast)=> {
        const li = document.createElement('li')
        makeWeatherElements(li, forecast)
        list.appendChild(li)
        })
    return div
}

function forecastHeader(){
    const li = document.createElement('li')
    li.classList.add('headerLi')
    const dateDiv = makeElement('div', 'date', 'Date')
    li.appendChild(dateDiv)

    const weatherDiv = makeElement('div', 'weather', "Weather")
    li.appendChild(weatherDiv)

    const cloudsDiv = makeElement('div', 'clouds', "Cloudiness")
    li.appendChild(cloudsDiv)

    const mainDiv = makeElement('div', 'main')
    
    const mainTemp = makeElement('span', 'temp', "Temperature")
    const mainFeels = makeElement('span', 'tempFeelsLike', 'Feels like')
    const mainPressure = makeElement('span', 'pressure', 'Pressure')
    const mainHumidity = makeElement('span', 'humidity', 'Humidity')

    mainDiv.appendChild(mainTemp)
    mainDiv.appendChild(mainFeels)
    mainDiv.appendChild(mainHumidity)
    mainDiv.appendChild(mainPressure)
    
    li.appendChild(mainDiv)

    const windDiv = makeElement('div', 'wind')
    const windDirection = makeElement('span', 'windDirection', "Wind direction")
    const windSpeed = makeElement('span', 'windSpeed', 'Wind speed')
    const windGust = makeElement('span', 'windGust', 'Wind gust')

    windDiv.appendChild(windDirection)
    windDiv.appendChild(windSpeed)
    windDiv.appendChild(windGust)

    li.appendChild(windDiv)

    const rainDiv = makeElement('div', 'rain')
    const rain1h = makeElement('span', 'rain1h', "Rain in 1 hour")
    const rain3h = makeElement('span', 'rain3h', "Rain in 3 hours")

    rainDiv.appendChild(rain1h)
    rainDiv.appendChild(rain3h)

    li.appendChild(rainDiv)

    const snowDiv = makeElement('div', 'snow')
    const snow1h = makeElement('span', 'snow1h', "Snow in 1 hour")
    const snow3h = makeElement('span', 'snow3h', "Snow in 3 hours")

    snowDiv.appendChild(snow1h)
    snowDiv.appendChild(snow3h)

    li.appendChild(snowDiv)

    return li
}

function createCurrentWeather(data){
    const div = document.createElement('div')
    const h = document.createElement('h2')
    h.classList.add('head')
    h.textContent = "Current weather:"
    div.appendChild(h)
    div.id = 'weather'
    makeWeatherElements(div, data)
    return div
}

function makeWeatherElements(target, weatherDataObj){
    for (const [key, value] of Object.entries(weatherDataObj)){
        const div = document.createElement('div')
        target.appendChild(div)
        switch(key){
            case 'dt':{
                const d = new Date(value * 1000)
                div.classList.add('date')
                div.innerText = `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`
                break
            }
            case 'main':{
                div.classList.add('main')
                const tempReal = makeElement('span', 'temp', value.temp)
                const feelsLike = makeElement('span', 'tempFeelsLike', value.feels_like)
                const pressure = makeElement('span', 'pressure', value.pressure)
                const humidity = makeElement('span', 'humidity', value.humidity)
                div.append(tempReal)
                div.appendChild(feelsLike)
                div.appendChild(humidity)
                div.appendChild(pressure)
                break
            }
            case 'weather':{
                div.classList.add('weatherGroups')
                value.forEach(weather => {
                    const weatherDiv = document.createElement('div')
                    weatherDiv.classList.add('weather')
                    const img = document.createElement('img')
                    img.alt = weather.description
                    img.src = `http://openweathermap.org/img/wn/${weather.icon}@2x.png`
                    const capitalizedDesc = weather.description.charAt(0).toUpperCase() + weather.description.slice(1)
                    const span = makeElement('span', 'weatherDesc', capitalizedDesc)
                    weatherDiv.appendChild(img)
                    weatherDiv.appendChild(span)
                    div.appendChild(weatherDiv)
                })
                break
            }
            case 'wind':{
                div.classList.add('wind')
                const img = document.createElement('img')
                const imgWrap = document.createElement('div')
                imgWrap.classList.add('windDirection')
                img.alt = `Wind direction is ${value.deg} degrees off north`
                img.src = arrow
                img.style.transform = `rotate(${value.deg}deg)`
                const speed = makeElement('span', 'windSpeed', value.speed)
                imgWrap.appendChild(img)
                div.appendChild(imgWrap)
                div.appendChild(speed)
                if(value.gust !== undefined){
                    const gust = makeElement('span', 'windGust', value.gust)
                    div.appendChild(gust)
                }
                break
            }
            case 'clouds':{
                div.classList.add('clouds')
                const span = makeElement('span', 'cloudiness', value.all)
                div.appendChild(span)
                break
            }
            case 'rain':{
                div.classList.add('rain')
                if(value["1h"] !== undefined){
                    const span = makeElement('span', 'rain1h', value['1h'])
                    div.appendChild(span)
                }
                if(value["3h"] !== undefined){
                    const span = makeElement('span', 'rain3h', value['3h'])
                    div.appendChild(span)
                }
                break
            }
            case 'snow':{
                div.classList.add('snow')
                if(value['1h']!== 'undefined'){
                    const span = makeElement('span', 'snow1h', value['1h'])
                    div.appendChild(span)
                }
                if(value['3h']!== 'undefined'){
                    span.classList.add('snow3h')
                    const span = makeElement('span', 'snow1h', value['1h'])
                    div.appendChild(span)
                }
                break
            }
        default:
            div.remove()
        }
    }
}

function makeElement(type, classlist, data){
    const el = document.createElement(type)
    el.classList.add(classlist)
    if(data!==undefined){
    el.innerText = data
    }
    return el
}

function makeCreditDiv(){
    const div = document.createElement('div')
    div.id = 'credit'
    const img = document.createElement('img')
    img.src = logo
    img.alt = 'Open Weather'
    const p = document.createElement('p')
    p.textContent = `Weather data provided by `
    const creditsLink = document.createElement('a')
    creditsLink.href = 'https://openweathermap.org/'
    creditsLink.textContent = 'Open Weather'
    p.appendChild(creditsLink)
    div.appendChild(img)
    div.appendChild(p)
    return div
}

export const UI = {
    header: header,
    content: content,
    search: search,
    createForecast: (data) => createForecast(data),
    cityChooser: (citiesArr) => citiesChooser(citiesArr),
    replaceElement: (target, newElement) => replaceElement(target, newElement),
    createCurrentWeather: (data) => createCurrentWeather(data),
}
