const app = document.getElementById('app')
const regionNamesInEnglish = new Intl.DisplayNames(['en'], { type: 'region' })
const regNames = regionNamesInEnglish

const header = document.createElement('div')
header.classList.add('header')

const search = searchCitiesField()

const content = document.createElement('div')
content.id = 'content'

app.append(header)
app.append(search)
app.append(content)

const weather = (data) => {
    const div = document.createElement('div')
    div.classList.add('condition')
    const description = document.createElement('p')
    description.innerText = data.description
    
    const icon = document.createElement('img')
    icon.src = `https://openweathermap.org/img/wn/${data.icon}@2x.png`

    div.appendChild(icon)
    div.appendChild(description)
    return div
}

const makeWeatherSpan = (field, val) => {
    const span = document.createElement('span')
        switch(field){
            case 'temp':
                span.innerText = `Temperature: ${val} Celsius`
                break
            case 'feels_like':
                span.innerText = `Feels like: ${val} Celsius`
                break
            case 'pressure':
                span.innerText = `Pressure: ${val} hPa`
                break
            case 'humidity':
                span.innerText = `Humidity: ${val} %`
                break
            case 'temp_min':
                span.innerText = `Minimum temperature: ${val} Celsius`
                break
            case 'temp_max':
                span.innerText = `Maximum temperature: ${val} Celsius`
                break
            case 'sea_level':
                span.innerText = `Pressure at sea level: ${val} hPa`
                break
            case 'grnd_level':
                span.innerText = `Pressure at ground level: ${val} hPa`
                break
            case 'speed':
                span.innerText = `Wind speed: ${val} meter/second`
                break
            case 'deg':
                span.innerText = `Wind direction: ${val} degrees`
                break
            case 'gust':
                span.innerText = `Wind gust: ${val} meter/second`
                break
            case 'all':
                span.innerText = `Cloudiness: ${val} %`
                break
            case 'visibility':
                span.innerText = `Visibility: ${val} metres`
                break
            case '1h':
                span.innerText = `${field.capitalize()} volume for the last hour: ${val} mm`
                break
            case '3h':
                span.innerText = `${field.capitalize()} volume for the last 3 hours: ${val} mm`
                break
            case 'pop':
                span.innerText = `Probability of precipitation: ${val*100}%`
            }
            if(span.innerText !== ''){ 
            return span
            }
            return false
    }

const makeWeatherDiv = async(data) =>{
    if(document.getElementById('mainWeatherWrapper')){
        document.getElementById('mainWeatherWrapper').remove()
    }
    const wrapDiv = document.createElement('div')
    wrapDiv.id = 'mainWeatherWrapper'
    wrapDiv.classList.add('wrapper')
    console.log(data)
    for(const [key, value] of Object.entries(data)){
        const div = document.createElement('div')
        if(Array.isArray(value)){
            value.forEach((element) =>{
                const weatherDiv = weather(element)
                div.appendChild(weatherDiv)
            })
        }
        if(typeof value === 'string'){
            console.log('value is string')
            const div = document.createElement('div')
            div.classList.add(key)
            const span = makeWeatherSpan(key, value)
            if(span){
            div.appendChild(span)
            }
        }
        if(typeof value === 'object'){
            console.log('value is object')
            const ul = document.createElement('ul')
            for(const [elementKey, elementValue] of Object.entries(value)){
                const li = document.createElement('li')
                const span = makeWeatherSpan(elementKey, elementValue)
                if(span){
                    li.appendChild(span)
                    ul.appendChild(li)
                }
                if(ul.innerHTML!==''){
                div.appendChild(ul)
                }
            }
}
    if(div.innerHTML!==''){
        div.classList.add(key)
        wrapDiv.appendChild(div)
    }
}
content.appendChild(wrapDiv)
}

const weatherUIElements = []
weatherUIElements.push(makeWeatherDiv)

export const UI = {
    header: header,
    content: content,
    search: search,
    weatherUIElements: weatherUIElements,
    cityChooser: (citiesArr) => citiesChooser(citiesArr),
    replaceElement: (target, newElement) => replaceElement(target, newElement),
}

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

const replaceElement = (target, newElement) => {
    const parent = target.parentNode
    target.remove(),
    parent.appendChild(newElement)
}