const _address = 'https://senacserverpi.herokuapp.com/api/'
var _token = null
var _userName = null
var _userId = null

const getImageRoute = async (element, route) => {
    const response = await fetch(_address + route, { headers: { "Authorization": "Bearer " + _token } })
    const data = await response.json()
    if (data && data.image)
        element.src = data.image
}

const card = (element) => {
    const poster = document.createElement("img")
    getImageRoute(poster, "student/image/" + element.image)

    const titulo = document.createElement("p")
    titulo.innerHTML = element.name

    const divNota = document.createElement("div")
    divNota.classList.add("nota")

    const nota = document.createElement("span")
    nota.innerHTML = element.id

    divNota.appendChild(nota)

    const card = document.createElement("div")
    card.classList.add("cards")

    card.appendChild(poster)
    card.appendChild(titulo)
    card.appendChild(divNota)

    return card
}

const getDataRoute = (route) => {
    fetch(_address + route, { headers: { "Authorization": "Bearer " + _token } })
        .then(resp => resp.json()
            .then(dados => {
                if (dados) {
                    dados.sort((a, b) => a.name > b.name ? 1 : -1)
                        .forEach(element =>
                            document.querySelector("#listas").appendChild(card(element))
                        )
                }
            })
        )
}

const menu = document.querySelector('#menu')
const mcl = menu.classList
const btnClose = document.querySelector('.btnClose')
const detail = document.querySelector('#detail')

const hideMenu = () => {
    mcl.add('hide')
    mcl.remove('show')
}

const showMenu = () => {
    mcl.add('show')
    mcl.remove('hide')
}

btnMenu.addEventListener("click", e => {
    e.preventDefault()
    showMenu()
})

btnClose.addEventListener("click", e => {
    e.preventDefault()
    hideMenu()
})

const optionHomeEvent = (e) => {
    e.preventDefault()
    detail.innerHTML = `
    <ul>
      <h2>Apresentação</h2>
      <li>
        <div>
          <p>Deseja ser aluno da melhor universidade do país?</p>
          <p>Então faça o preenchimento do formulário com os dados solicitados e aguarde um retorno da nossa equipe.</p>
        </div>
      </li>
    </ul>
    <ul>
      <h2>Formulário de inscrição</h2>
      <li>
        <form>
          <label for="fname">Nome completo</label>
          <div class="inputText">
            <input type="text" id="name" autofocus><br><br>
          </div>
          <label for="lname">CPF</label>
          <div class="inputText">
            <input type="text" id="document"><br><br>
          </div>
          <label for="lname">e-mail</label>
          <div class="inputText">
            <input type="text" id="email"><br><br>
          </div>
        </form>        
        <div id="loginBase">
          <p id="confirmOk" class="button">Ok</p>
          <p id="clear" class="button">Limpar</p>
        </div>
      </li>
    </ul>
    `
    localStorage.setItem("page", "optionHome")
    hideMenu()
}

const optionListsEvent = (e) => {
    e.preventDefault()
    detail.innerHTML = ` 
    <ul>
      <h2>Comunicação com API</h2>
      <li>
        <div>
          <section id="listas" class="secao-listas">
          </section>
        </div>
      </li>
    </ul>`
    localStorage.setItem("page", "optionLists")
    getDataRoute("student")
    hideMenu()
}

const showGrid = (idSubject) => {
    fetch(`${_address}assessment/subject/${idSubject}?idstudent=${_userId}`, { headers: { "Authorization": "Bearer " + _token } })
        .then(
            data => data.json()
                .then(json => {
                    var grid = '<tr> <th class="columnDescription">Avaliação</th> <th class="columnValue">Nota</th> </tr>'
                    var media = 0
                    for (e of json) {
                        media += (e.value * e.weight)
                        grid += `<tr> <td class="columnDescription">${e.description}</td> <td class="columnValue">${e.value.toFixed(2)}</td> </tr>`
                    }
                    grid += `<tr> <th class="columnDescription">Média</th> <th class="columnValue">${media.toFixed(2)}</th> </tr>`
                    document.querySelector("#tableTag").innerHTML = grid
                })
        )
}

const optionSubject = async (id) => {
    localStorage.setItem("page", `optionSubject_${id}`)

    detail.innerHTML = ` 
    <ul>
      <h2 id="subjectTag"></h2>
      <div class="headerGrid">
        <h3 id="teacherTag"></h3>
        <img onclick="showGrid('${id}')" width=25px height=25px src="./assets/images/refresh-mini.png" alt="">
      </div>
      <li>
        <div>
          <section id="listas" class="secao-listas">
            <table id="tableTag"></table>                
          </section>
        </div>
      </li>
    </ul>`

    fetch(`${_address}subject/${id}`, { headers: { "Authorization": "Bearer " + _token } })
        .then(data => data.json()
            .then(json => {
                document.querySelector("#subjectTag").innerHTML = json[0].name
                _teacher = json[0].idteacher

                fetch(`${_address}teacher/${_teacher}`, { headers: { "Authorization": "Bearer " + _token } })
                    .then(data => data.json()
                        .then(json => {
                            document.querySelector("#teacherTag").innerHTML = json[0].name
                        })
                    )

                showGrid(id)
            })
        )

    hideMenu()
}

loginBack.addEventListener("click", e => {
    e.preventDefault()
    if (e.target.id == 'loginBack') {
        loginBack.style.width = '0px'
        loginBack.style.height = '0px'
        doLoad()
    }
})

welcome.addEventListener("click", e => {
    e.preventDefault()
    if (!_userName) {
        loginBack.style.width = '100%'
        loginBack.style.height = '100%'
        loginBack.innerHTML = `
        <div id="login">
          <div class="headerclose">
            <div id="closeLoginButton" class="btnClose menu effect colorGray">
              <img width=100% height=100% src="./assets/images/close.png" alt="">
            </div>
          </div>
          <form id="loginDetail" action="/action_page.php">
            <label for="fname">e-mail</label>
            <div class="inputText">
              <input type="text" id="loginEmail" autofocus><br><br>
            </div>
            <label for="lname">Senha</label>
            <div class="inputText">
              <input type="password" id="loginPassword"><br><br>
            </div>
          </form>        
          <div id="loginBase">
            <p id="loginOk" class="button">Ok</p>
          </div>
        </div>
        `
        closeLoginButton.addEventListener("click", e => loginBack.click())

        loginOk.addEventListener("click", e => {
            e.preventDefault()
            doLogin(loginEmail.value, loginPassword.value)
        })

    } else {
        localStorage.removeItem("token")
        localStorage.removeItem('userName')
        localStorage.removeItem('userId')
        doLoad()
    }
})

const doLoad = async () => {
    loginBack.style.width = '0px'
    loginBack.style.height = '0px'
    loginBack.innerHTML = ``

    const token = localStorage.getItem("token")
    _token = token

    let htmlMenuOptions = `<li><a id="optionHome" href="#">Apresentação</a></li> `

    if (token) {
        htmlMenuOptions += `<li><a id="optionLists" href="#">Comunicação com API</a></li> `
        const subjectFetch = await fetch(_address + 'subject', { headers: { "Authorization": "Bearer " + _token } })
        const subjectJson = await subjectFetch.json()
        if (subjectJson && subjectJson.length) {
            subjectJson.forEach((e, i) => {
                htmlMenuOptions += `<li><a id="optionSubject_${e.id}" onclick="optionSubject('${e.id}')" href="#">${e.name}</a></li> `
            })
        }
    }

    menuOptions.innerHTML = htmlMenuOptions;

    if (optionHome)
        optionHome.addEventListener("click", e => optionHomeEvent(e))

    if (token && optionLists)
        optionLists.addEventListener("click", e => optionListsEvent(e))

    _image = localStorage.getItem("image")
    _userId = localStorage.getItem("userId")
    _userName = localStorage.getItem("userName")
    _welcome = document.querySelector('#welcome')
    if (_userName) {
        _welcome.innerHTML = 'Olá ' + _userName
        getImageRoute(perfilImage, "student/image/" + _image)
    } else {
        _welcome.innerHTML = 'Fazer login'
        perfilImage.src = './assets/images/perfil.jpg'
    }

    const page = localStorage.getItem("page")
    let btn = null
    if (_userName && page)
        btn = document.querySelector('#' + page)
    else
        btn = document.querySelector('#optionHome')

    if (btn)
        btn.click();
}

const doLogin = async (email, password) => {
    const response = await fetch(_address + 'session', { method: "POST", mode: "cors", headers: { email, password } })
    const data = await response.json()
    localStorage.setItem("token", data.token)
    localStorage.setItem('userName', data.reg.name)
    localStorage.setItem('userId', data.reg.id)
    localStorage.setItem('image', data.reg.image)
    doLoad()
}

window.addEventListener('load', doLoad);