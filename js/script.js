const _address = 'https://senacserverpi.herokuapp.com/api/'
//const _address = 'http://127.0.0.1:3333/api/'
var _token = null
var _userName = null
var _userId = null

const getImageRoute = async (element, route) => {
  const response = await fetch(_address + route, { headers: { "Authorization": "Bearer " + _token } })
  const data = await response.json()
  if (data && data.imagem)
    element.src = data.imagem
}

const card = (element) => {
  const poster = document.createElement("img")
  getImageRoute(poster, "aluno/imagem/" + element.imagem)

  const titulo = document.createElement("p")
  titulo.innerHTML = element.nome

  const divNota = document.createElement("div")
  divNota.classList.add("nota")

  const nota = document.createElement("span")
  nota.innerHTML = element.codigo

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
          dados.sort((a, b) => a.nome > b.nome ? 1 : -1)
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
      <h5> </h5>
      <h2>Apresentação</h2>
      <li>
        <div>
          <p>Deseja ser aluno da melhor universidade do país?</p>
          <p>Então faça o preenchimento do formulário com os dados solicitados e aguarde um retorno da nossa equipe.</p>
        </div>
      </li>
    </ul>
    <ul>
      <h5> </h5>
      <h2>Formulário de inscrição</h2>
      <li>
        <form>
          <label for="fname">Nome completo</label>
          <div class="inputText">
            <input type="text" id="nameForm"><br><br>
          </div>
          <label for="lname">CPF</label>
          <div class="inputText">
            <input type="text" id="documentForm"><br><br>
          </div>
          <label for="lname">e-mail</label>
          <div class="inputText">
            <input type="text" id="emailForm"><br><br>
          </div>
          <label for="ldoc1">Envie cópias digitáis dos seguintes documentos</label>
          <p>Foto 3x4, CPF, RG, Histórico escolares</p>
          <div class="headerGrid">
            <div class="inputText flex1 margin0">
              <input type="text" id="docForm" readonly><br><br>
            </div>
            <p id="anexarButton" class="button">...</p>
          </div>
        </form>        
        <div id="formBase">
          <p id="confirmOk" class="button">Ok</p>
          <p id="clear" class="button">Limpar</p>
        </div>
      </li>
    </ul>
    `
  nameForm.focus()
  localStorage.setItem("page", "optionHome")
  hideMenu()
}

const rematriculaMenuEvent = (e) => {
  e.preventDefault()
  detail.innerHTML = ` 
    <ul>
      <h5> </h5>
      <h2>Rematricula</h2>
      <li>
        <div>
          <p>O semestre ainda não foi concluído, aguarde o fechamento de todas as notas.</p>
          <p>As disciplinas na qual você não obteve a média 6 ou superior e as novas disciplinas do próximo semestre, estarão disponíveis para inscrição.</p>
        </div>
      </li>
    </ul>`
  localStorage.setItem("page", "rematriculaMenu")
  hideMenu()
}

const optionListsEvent = (e) => {
  e.preventDefault()
  detail.innerHTML = ` 
    <ul>
      <br/><h2>Equipe de desenvolvimento</h2><br/>
      <li>
        <div>
          <section id="listas" class="secao-listas">
          </section>
        </div>
      </li>
    </ul>`
  localStorage.setItem("page", "optionLists")
  getDataRoute("aluno")
  hideMenu()
}

const viewDoAssessment = (id) => {
  if (iconDoAssessment.tag == 1) {
    iconDoAssessment.tag = 0
    iconDoAssessment.src = "./assets/images/expandir.png"
    document.querySelector("#tableTagDoAssessment").innerHTML = null
  } else {
    iconDoAssessment.tag = 1
    iconDoAssessment.src = "./assets/images/contrair.png"
    fetch(`${_address}avaliacao/disciplina/${id}?codigo_aluno=${_userId}`, { headers: { "Authorization": "Bearer " + _token } })
      .then(
        data => data.json()
          .then(json => {
            var grid = '<tr> <th class="columnDescription">Tipos de avaliações</th> <th class="columnValueLeft">Situação</th> </tr>'
            for (e of json) {
              situacao = e.nota ? "Avaliado" : e.entregue ? "Entregue" : "Aguardando"
              grid += `<tr> <td class="columnDescription">${e.descricao}</td> <td class="columnValueLeft">${situacao}</td> </tr>`
            }
            document.querySelector("#tableTagDoAssessment").innerHTML = grid
            tableTagDoAssessment.focus()
          })
      )
  }
}

const viewRequestService = (id, atualizar) => {
  if (iconRequestService.tag == 1 && !atualizar) {
    iconRequestService.tag = 0
    iconRequestService.src = "./assets/images/expandir.png"
    document.querySelector("#tableTagRequestService").innerHTML = null
    refreshRequestService.style.display = "none"
  } else {
    iconRequestService.tag = 1
    iconRequestService.src = "./assets/images/contrair.png"
    refreshRequestService.style.display = null
    fetch(`${_address}avaliacao/disciplina/${id}?codigo_aluno=${_userId}`, { headers: { "Authorization": "Bearer " + _token } })
      .then(
        data => data.json()
          .then(json => {
            var grid = '<tr> <th class="columnDescription">Solicitar atendimento relacionado a</th> <th class="columnValueLeft">Situação</th> </tr>'
            for (e of json)
              grid += `<tr> <td class="columnDescription">${e.descricao}</td> <td class="columnValueLeft">Sem solicitações</td> </tr>`
            grid += `<tr> <td class="columnDescription">Outros assuntos</td> <td class="columnValueLeft">Aguardando retorno</td> </tr>`
            document.querySelector("#tableTagRequestService").innerHTML = grid
            tableTagRequestService.focus()
          })
      )
  }
}

const viewAssessment = (id, atualizar) => {
  if (iconAssessment.tag == 1 && !atualizar) {
    iconAssessment.tag = 0
    iconAssessment.src = "./assets/images/expandir.png"
    document.querySelector("#tableTag").innerHTML = null
    refreshAssessment.style.display = "none"
  } else {
    iconAssessment.tag = 1
    iconAssessment.src = "./assets/images/contrair.png"
    refreshAssessment.style.display = null
    fetch(`${_address}avaliacao/disciplina/${id}?codigo_aluno=${_userId}`, { headers: { "Authorization": "Bearer " + _token } })
      .then(
        data => data.json()
          .then(json => {
            var grid = '<tr> <th class="columnDescription">Avaliação</th> <th class="columnValue">Nota</th> </tr>'
            var media = 0
            for (e of json) {
              media += (e.nota * e.peso)
              grid += `<tr> <td class="columnDescription">${e.descricao}</td> <td class="columnValue">${e.nota.toFixed(2)}</td> </tr>`
            }
            grid += `<tr> <th class="columnDescription">Média</th> <th class="columnValue">${media.toFixed(2)}</th> </tr>`
            document.querySelector("#tableTag").innerHTML = grid
            tableTag.focus()
          })
      )
  }
}

const viewPDF = (id) => {
  const pdfDiv = document.querySelector('#pdfDiv')
  const pdfViewer = document.querySelector('#pdfViewer')
  if (pdfViewer) {
    iconMaterial.src = "./assets/images/expandir.png"
    const obj = document.querySelector('#pdfViewer')
    pdfDiv.removeChild(obj)
  } else {
    iconMaterial.src = "./assets/images/contrair.png"

    var obj = document.createElement('object')
    obj.id = 'pdfViewer'
    obj.type = 'application/pdf'
    obj.style = 'background-Color: #333333'
    pdfDiv.appendChild(obj)
    pdfDiv.focus()

    fetch(`${_address}material/disciplina/${id}`, { headers: { "Authorization": "Bearer " + _token } })
      .then(
        data => data.json()
          .then(json =>
            obj.data = 'data:application/pdf;base64,'.concat(json[0].content))
      )
  }
}

const optionSubject = async (id) => {
  localStorage.setItem("page", `optionSubject_${id}`)

  detail.innerHTML = ` 
    <ul>
      <div class="headerGrid">
        <div class="headerGridRow">
          <h2 id="subjectTag">Disciplina</h2>
          <h3 id="teacherTag">Professor</h3>
        </div>
        <img id="iconMaterial" onclick="viewPDF('${id}')" width=25px height=25px src="./assets/images/expandir.png" alt="Expandir ou contrair área de estudo">
      </div>
      <li><div id="pdfDiv"></div></li>
    </ul>
    <ul>
      <div class="headerGrid">
        <h2>Fazer avaliações</h2>
        <div class="headerGrid">
          <img id="iconDoAssessment" onclick="viewDoAssessment('${id}')" width=25px height=25px src="./assets/images/expandir.png" alt="Expandir ou contrair área de avaliação">
        </div>
      </div>
      <li>
        <div>
          <section id="listas" class="secao-listas">
            <table id="tableTagDoAssessment"></table>
          </section>
        </div>
      </li>
    </ul>
    <ul>
      <div class="headerGrid">
        <h2>Acompanhar avaliações</h2>
        <div class="headerGrid">
          <img id="refreshAssessment" onclick="viewAssessment('${id}', true)" width=25px height=25px src="./assets/images/refresh.png" alt="Atualizar notas das avaliações">
          <img id="iconAssessment" onclick="viewAssessment('${id}')" width=25px height=25px src="./assets/images/expandir.png" alt="Expandir ou contrair notas das avaliações">
        </div>
      </div>
      <li>
        <div>
          <section id="listas" class="secao-listas">
            <table id="tableTag"></table>
          </section>
        </div>
      </li>
    </ul>
    <ul>
      <div class="headerGrid">
        <h2>Solicitar atendimento</h2>
        <div class="headerGrid">
          <img id="refreshRequestService" onclick="viewRequestService('${id}', true)" width=25px height=25px src="./assets/images/refresh.png" alt="Atualizar solicitação de atendimento">
          <img id="iconRequestService" onclick="viewRequestService('${id}')" width=25px height=25px src="./assets/images/expandir.png" alt="Expandir ou contrair solicitação de atendimento">
        </div>
      </div>
      <li>
        <div>
          <section id="listasRequestService" class="secao-listas">
            <table id="tableTagRequestService"></table>
          </section>
        </div>
      </li>
    </ul>
    `
  refreshAssessment.style.display = "none"
  refreshRequestService.style.display = "none"

  iconAssessment.tag = 0
  iconRequestService.tag = 0
  fetch(`${_address}disciplina/${id}`, { headers: { "Authorization": "Bearer " + _token } })
    .then(data => data.json()
      .then(json => {
        document.querySelector("#subjectTag").innerHTML = json[0].descricao
        _teacher = json[0].codigo_professor

        fetch(`${_address}professor/${_teacher}`, { headers: { "Authorization": "Bearer " + _token } })
          .then(data => data.json()
            .then(json => {
              document.querySelector("#teacherTag").innerHTML = json[0].nome
            })
          )
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
              <img width=100% height=100% src="./assets/images/close.png" alt="Fechar menu">
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
            <p id="errorMessage"></p>
          </div>
        </div>
        `
    closeLoginButton.addEventListener("click", e => loginBack.click())

    loginEmail.focus();

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
  loginBack.innerHTML = null

  const token = localStorage.getItem("token")
  _token = token

  let htmlMenuOptions = `<li><a id="optionHome" href="#">Apresentação</a></li> `

  if (token) {
    const subjectFetch = await fetch(_address + 'disciplina', { headers: { "Authorization": "Bearer " + _token } })
    const subjectJson = await subjectFetch.json()
    htmlMenuOptions += `<br /><div class="divider"></div><br />`
    if (subjectJson && subjectJson.length) {
      subjectJson.forEach((e, i) => {
        htmlMenuOptions += `<li><a id="optionSubject_${e.codigo}" onclick="optionSubject('${e.codigo}')" href="#">${e.descricao}</a></li> `
      })
    }
    htmlMenuOptions += `<br /><div class="divider"></div><br />`
    htmlMenuOptions += `<li><a id="rematriculaMenu" href="#">Rematricula</a></li> `

    htmlMenuOptions += `<br /><div class="divider"></div><br />`
    htmlMenuOptions += `<li><a id="optionLists" href="#">Equipe de desenvolvimento</a></li> `
  }

  menuOptions.innerHTML = htmlMenuOptions;

  if (optionHome)
    optionHome.addEventListener("click", e => optionHomeEvent(e))

  if (token) {
    if (optionLists)
      optionLists.addEventListener("click", e => optionListsEvent(e))

    if (rematriculaMenu)
      rematriculaMenu.addEventListener("click", e => rematriculaMenuEvent(e))
  }

  _image = localStorage.getItem("image")
  _userId = localStorage.getItem("userId")
  _userName = localStorage.getItem("userName")
  _welcome = document.querySelector('#welcome')
  if (_userName) {
    _welcome.innerHTML = 'Olá ' + _userName
    getImageRoute(perfilImage, "aluno/imagem/" + _image)
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
  if (response.status == 401) {
    const data = await response.json()
    document.querySelector('#errorMessage').innerHTML = data.error
    setTimeout(() => document.querySelector('#errorMessage').innerHTML = null, 5000)
  } else {
    const data = await response.json()
    localStorage.setItem("token", data.token)
    localStorage.setItem('userName', data.reg.nome)
    localStorage.setItem('userId', data.reg.codigo)
    localStorage.setItem('image', data.reg.imagem)
    doLoad()
  }
}


window.addEventListener('load', doLoad);