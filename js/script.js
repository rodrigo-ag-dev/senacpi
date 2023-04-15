const _address = 'https://senacserverpi.herokuapp.com/api/'
var _token = null
var _userName = null
var _userId = null

window.mobileCheck = () => {
  let check = false;
  ((a) => {
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4)))
      check = true;
  })(navigator.userAgent || navigator.vendor || window.opera);
  return check;
};

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

const optionListsEvent = (e) => {
  e.preventDefault()
  detail.innerHTML = ` 
    <ul>
      <h2>Equipe de desenvolvimento</h2>
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

const viewRequestService = (idSubject, refresh) => {
  if (iconRequestService.tag == 1 && !refresh) {
    iconRequestService.tag = 0
    iconRequestService.src = "./assets/images/expandir.png"
    document.querySelector("#tableTagRequestService").innerHTML = null
    refreshRequestService.style.display = "none"
  } else {
    iconRequestService.tag = 1
    iconRequestService.src = "./assets/images/contrair.png"
    refreshRequestService.style.display = null
    fetch(`${_address}assessment/subject/${idSubject}?idstudent=${_userId}`, { headers: { "Authorization": "Bearer " + _token } })
      .then(
        data => data.json()
          .then(json => {
            var grid = '<tr> <th class="columnDescription">Solicitar atendimento relacionado a</th> <th class="columnValueLeft">Situação</th> </tr>'
            for (e of json) 
              grid += `<tr> <td class="columnDescription">${e.description}</td> <td class="columnValueLeft">Sem solicitações</td> </tr>`
            grid += `<tr> <td class="columnDescription">Outros assuntos</td> <td class="columnValueLeft">Aguardando retorno</td> </tr>`
            document.querySelector("#tableTagRequestService").innerHTML = grid
            tableTagRequestService.focus()
          })
      )
  }
}

const viewAssessment = (idSubject, refresh) => {
  if (iconAssessment.tag == 1 && !refresh) {
    iconAssessment.tag = 0
    iconAssessment.src = "./assets/images/expandir.png"
    document.querySelector("#tableTag").innerHTML = null
    refreshAssessment.style.display = "none"
  } else {
    iconAssessment.tag = 1
    iconAssessment.src = "./assets/images/contrair.png"
    refreshAssessment.style.display = null
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
            tableTag.focus()
          })
      )
  }
}

const viewPDF = (idSubject) => {
  const pdfDiv = document.querySelector('#pdfDiv')
  const pdfViewer = document.querySelector('#pdfViewer')
  if (pdfViewer) {
    iconMaterial.src = "./assets/images/expandir.png"
    const obj = document.querySelector('#pdfViewer')
    pdfDiv.removeChild(obj)
  } else {
    fetch(`${_address}courseware/subject/${idSubject}`, { headers: { "Authorization": "Bearer " + _token } })
      .then(
        data => data.json()
          .then(json => {
            iconMaterial.src = "./assets/images/contrair.png"
            const obj = document.createElement('object')
            obj.id = 'pdfViewer'
            obj.type = 'application/pdf'
            obj.data = 'data:application/pdf;base64,'.concat(json[0].content)
            pdfDiv.appendChild(obj)
            pdfDiv.focus()
          })
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
        <img id="iconMaterial" onclick="viewPDF('${id}')" width=25px height=25px src="./assets/images/expandir.png" alt="">
      </div>
      <li><div id="pdfDiv"></div></li>
    </ul>
    <ul>
      <div class="headerGrid">
        <h2>Acompanhar avaliações</h2>
        <div class="headerGrid">
          <img id="refreshAssessment" onclick="viewAssessment('${id}', true)" width=25px height=25px src="./assets/images/refresh.png" alt="">
          <img id="iconAssessment" onclick="viewAssessment('${id}')" width=25px height=25px src="./assets/images/expandir.png" alt="">
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
          <img id="refreshRequestService" onclick="viewRequestService('${id}', true)" width=25px height=25px src="./assets/images/refresh.png" alt="">
          <img id="iconRequestService" onclick="viewRequestService('${id}')" width=25px height=25px src="./assets/images/expandir.png" alt="">
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
  console.log(window.mobileCheck())
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
    const subjectFetch = await fetch(_address + 'subject', { headers: { "Authorization": "Bearer " + _token } })
    const subjectJson = await subjectFetch.json()
    htmlMenuOptions += `<br /><div class="divider"></div><br />`
    if (subjectJson && subjectJson.length) {
      subjectJson.forEach((e, i) => {
        htmlMenuOptions += `<li><a id="optionSubject_${e.id}" onclick="optionSubject('${e.id}')" href="#">${e.name}</a></li> `
      })
    }
    htmlMenuOptions += `<br /><div class="divider"></div><br />`
    htmlMenuOptions += `<li><a id="optionLists" href="#">Equipe de desenvolvimento</a></li> `
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
  if (response.status == 401) {
    const data = await response.json()
    document.querySelector('#errorMessage').innerHTML = data.error
    setTimeout(() => document.querySelector('#errorMessage').innerHTML = null, 5000)
  } else {
    const data = await response.json()
    localStorage.setItem("token", data.token)
    localStorage.setItem('userName', data.reg.name)
    localStorage.setItem('userId', data.reg.id)
    localStorage.setItem('image', data.reg.image)
    doLoad()
  }
}


window.addEventListener('load', doLoad);