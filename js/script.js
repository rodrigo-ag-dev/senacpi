const _address = 'https://senacserverpi.herokuapp.com/api/'
//const _address = 'http://127.0.0.1:3333/api/'
var _token = null
var _userName = null
var _userId = null
var _curso = null
var _cursoDescricao = null
var _semestre = null

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
  fetch(_address + route,
    { headers: { "Authorization": "Bearer " + _token } }
  ).then(resp => resp.json()
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
        <form id="inscricaoForm">
          <label for="campoNome">Nome completo</label>
          <div class="inputText">
            <input type="text" id="campoNome"><br><br>
          </div>
          <label for="campoFone">Fone</label>
          <div class="inputText">
            <input type="text" id="campoFone"><br><br>
          </div>
          <label for="campoEmail">e-mail</label>
          <div class="inputText">
            <input type="text" id="campoEmail"><br><br>
          </div>
          <label for="campoDocumentos">Envie cópias digitáis dos seguintes documentos</label>
          <p>Foto 3x4, CPF, RG, Histórico escolares</p>
          <div class="headerGrid">
            <div class="inputText flex1 margin0">
              <input type="text" id="campoDocumentos" readonly><br><br>
            </div>
            <button id="anexarButton" type="button">...</button>
          </div>
        </form>        
        <div id="formBase">
          <button id="confirmForm" type="button">Ok</button>
          <button id="clearForm" type="button">Limpar</button>
        </div>
      </li>
    </ul>
    `

  const eForm = document.querySelector('#inscricaoForm')
  const eClear = document.querySelector('#clearForm')
  const eConfirm = document.querySelector('#confirmForm')
  const eAttach = document.querySelector('#anexarButton')

  eAttach.addEventListener("click", e => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = _ => {
      let files = Array.from(input.files);
      console.log(files);
    };
    input.click();
  })

  eClear.addEventListener("click", e => {
    e.preventDefault()
    for (e of eForm) {
      e.value = ''
      e.classList.remove('inputError')
    }
    eForm[0].focus()
  })

  eConfirm.addEventListener("click", e => {
    e.preventDefault()
    var camposVazio = ''
    const labels = document.getElementsByTagName('LABEL');
    for (l of labels) {
      if (l.htmlFor != '') {
        const e = document.getElementById(l.htmlFor);
        if (e.value == '')
          e.classList.add('inputError')
        else
          e.classList.remove('inputError')
      }
    }
    if (camposVazio)
      console.log(camposVazio)
    //eClear.click()
  })

  eForm[0].focus()
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
    </ul>
    <ul>
      <div class="headerGrid">
        <h2>Histórico de disciplinas</h2>
        <img id="iconHistorico" onclick="viewCursoHistorico('${_curso}','${_semestre + 1}')" width=25px height=25px src="./assets/images/expandir.png" alt="Expandir ou contrair disciplinas para o próximo semestre">
      </div>
      <li>
        <div>
          <section id="listas" class="secao-listas">
            <table id="tableProximoSemestre"></table>
          </section>
        </div>
      </li>
      <li>
        <div>
          <section id="listas" class="secao-listas">
            <table id="tableAnteriorSemestre"></table>
          </section>
        </div>
      </li>
    </ul>
  `
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

const viewCursoHistorico = (id, semestre) => {
  const iHistorico = document.querySelector('#iconHistorico')
  const tProximoSemestre = document.querySelector('#tableProximoSemestre')
  const tAnteriorSemestre = document.querySelector('#tableAnteriorSemestre')
  if (iHistorico.tag == 1) {
    iHistorico.tag = 0
    iHistorico.src = "./assets/images/expandir.png"
    tProximoSemestre.innerHTML = null
    tAnteriorSemestre.innerHTML = null
  } else {
    iHistorico.tag = 1
    iHistorico.src = "./assets/images/contrair.png"

    fetch(`${_address}curso/disciplina/${id}?semestre=${semestre}`,
      { headers: { "Authorization": "Bearer " + _token } }
    ).then(
      data => data.json()
        .then(json => {
          var grid = `<tr><th class="columnDescription">${semestre}º - semestre</th></tr>`
          for (e of json)
            grid += `<tr><td class="columnDescription">${e.descricao}</td></tr>`
          tProximoSemestre.innerHTML = grid
        })
    )

    fetch(`${_address}avaliacao/historico/${id}?codigo_aluno=${_userId}&semestreanteriores=${semestre}`,
      { headers: { "Authorization": "Bearer " + _token } }
    ).then(
      data => data.json()
        .then(json => {
          var semestre = 0
          var grid = `<tr>
                        <th class="columnDescription">Semestres anteriores</th>
                        <th class="columnValue">Nota</th>
                      </tr>`

          for (e of json) {
            if (semestre != e.semestre) {
              semestre = e.semestre
              grid += `<tr>
                         <th class="columnDescription">${semestre}º - Semestre</th>
                         <th class="columnValue"></th>
                       </tr>`
            }
            grid += `<tr> 
                       <td class="columnDescription">${e.descricao}</td>
                       <td class="columnValue">${e.nota ? e.nota.toFixed(2) : '0.00'}</td>
                     </tr>`
          }
          tAnteriorSemestre.innerHTML = grid
        })
    )
  }
}

const viewPDF = (id) => {
  const pdfDiv = document.querySelector('#pdfDiv')
  const pdfViewer = document.querySelector('#pdfViewer')
  const loaderPDF = document.querySelector('#loaderPDF')
  if (pdfViewer) {
    loaderPDF.classList.remove('loader')
    iconMaterial.src = "./assets/images/expandir.png"
    pdfDiv.removeChild(pdfViewer)
  } else {
    loaderPDF.classList.add('loader')
    iconMaterial.src = "./assets/images/contrair.png"

    var obj = document.createElement('object')
    obj.id = 'pdfViewer'
    obj.type = 'application/pdf'
    obj.style = 'background-Color: #333333'
    pdfDiv.appendChild(obj)
    pdfDiv.focus()

    fetch(`${_address}material/disciplina/${id}`,
      { headers: { "Authorization": "Bearer " + _token } }
    ).then(
      data => data.json()
        .then(json => {
          obj.data = 'data:application/pdf;base64,'.concat(json[0].content)
          loaderPDF.classList.remove('loader')
        })
        .catch(e => loaderPDF.classList.remove('loader'))
    )
  }
}

const viewFazerAvaliacao = (id) => {
  const iFazerAvaliacao = document.querySelector('#iconFazerAvaliacao')
  const tFazerAvaliacao = document.querySelector('#tableFazerAvaliaxao')

  if (iFazerAvaliacao.tag == 1) {
    iFazerAvaliacao.tag = 0
    iFazerAvaliacao.src = "./assets/images/expandir.png"
    tFazerAvaliacao.innerHTML = null
  } else {
    iFazerAvaliacao.tag = 1
    iFazerAvaliacao.src = "./assets/images/contrair.png"

    fetch(`${_address}avaliacao/disciplina/${id}?codigo_aluno=${_userId}`,
      { headers: { "Authorization": "Bearer " + _token } }
    ).then(
      data => data.json()
        .then(json => {
          var grid = '<tr> <th class="columnDescription">Tipos de avaliações</th> <th class="columnValueLeft">Situação</th> </tr>'
          for (e of json) {
            situacao = e.nota ? "Avaliado" : e.entregue ? "Entregue" : "Aguardando"
            grid += `<tr> <td class="columnDescription">${e.descricao}</td> <td class="columnValueLeft">${situacao}</td> </tr>`
          }
          tFazerAvaliacao.innerHTML = grid
        })
    )
  }
}

const viewAvaliacao = (id, atualizar) => {
  const iAvaliacao = document.querySelector('#iconAvaliacao')
  const aAvaliacao = document.querySelector('#atualizaAvaliacao')
  const tAvaliacao = document.querySelector('#tableAvaliacao')

  if (iAvaliacao.tag == 1 && !atualizar) {
    iAvaliacao.tag = 0
    iAvaliacao.src = "./assets/images/expandir.png"
    tAvaliacao.innerHTML = null
    aAvaliacao.style.display = "none"
  } else {
    iAvaliacao.tag = 1
    iAvaliacao.src = "./assets/images/contrair.png"
    aAvaliacao.style.display = null
    fetch(`${_address}avaliacao/disciplina/${id}?codigo_aluno=${_userId}`,
      { headers: { "Authorization": "Bearer " + _token } }
    ).then(
      data => data.json()
        .then(json => {
          var grid = '<tr> <th class="columnDescription">Avaliação</th> <th class="columnValue">Nota</th> </tr>'
          var media = 0
          for (e of json) {
            media += (e.nota * e.peso)
            grid += `<tr> <td class="columnDescription">${e.descricao}</td> <td class="columnValue">${e.nota.toFixed(2)}</td> </tr>`
          }
          grid += `<tr> <th class="columnDescription">Média</th> <th class="columnValue">${media.toFixed(2)}</th> </tr>`
          tAvaliacao.innerHTML = grid
        })
    )
  }
}

const viewAtendimento = (id, atualizar) => {
  const iAtendimento = document.querySelector('#iconAtendimento')
  const aAtendimento = document.querySelector('#atualizaAtendimento')
  const tAtendimento = document.querySelector('#tableAtentimento')

  if (iAtendimento.tag == 1 && !atualizar) {
    iAtendimento.tag = 0
    iAtendimento.src = "./assets/images/expandir.png"
    tAtendimento.innerHTML = null
    aAtendimento.style.display = "none"
  } else {
    iAtendimento.tag = 1
    iAtendimento.src = "./assets/images/contrair.png"
    aAtendimento.style.display = null
    fetch(`${_address}avaliacao/disciplina/${id}?codigo_aluno=${_userId}`,
      { headers: { "Authorization": "Bearer " + _token } }
    ).then(
      data => data.json()
        .then(json => {
          var grid = '<tr> <th class="columnDescription">Solicitar atendimento relacionado a</th> <th class="columnValueLeft">Situação</th> </tr>'
          for (e of json)
            grid += `<tr> <td class="columnDescription">${e.descricao}</td> <td class="columnValueLeft">Sem solicitações</td> </tr>`
          grid += `<tr> <td class="columnDescription">Outros assuntos</td> <td class="columnValueLeft">Aguardando retorno</td> </tr>`
          tAtendimento.innerHTML = grid
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
        <div class="headerGrid">
          <div id="loaderPDF"></div>
          <img id="iconMaterial" onclick="viewPDF('${id}')" width=25px height=25px src="./assets/images/expandir.png" alt="Expandir ou contrair área de estudo">
        </div>
      </div>
      <li><div id="pdfDiv"></div></li>
    </ul>
    <ul>
      <div class="headerGrid">
        <h2>Fazer avaliações</h2>
        <div class="headerGrid">
          <img id="iconFazerAvaliacao" onclick="viewFazerAvaliacao('${id}')" width=25px height=25px src="./assets/images/expandir.png" alt="Expandir ou contrair área de avaliação">
        </div>
      </div>
      <li>
        <div>
          <section id="listas" class="secao-listas">
            <table id="tableFazerAvaliaxao"></table>
          </section>
        </div>
      </li>
    </ul>
    <ul>
      <div class="headerGrid">
        <h2>Acompanhar avaliações</h2>
        <div class="headerGrid">
          <img id="atualizaAvaliacao" onclick="viewAvaliacao('${id}', true)" width=25px height=25px src="./assets/images/refresh.png" alt="Atualizar notas das avaliações">
          <img id="iconAvaliacao" onclick="viewAvaliacao('${id}')" width=25px height=25px src="./assets/images/expandir.png" alt="Expandir ou contrair notas das avaliações">
        </div>
      </div>
      <li>
        <div>
          <section id="listas" class="secao-listas">
            <table id="tableAvaliacao"></table>
          </section>
        </div>
      </li>
    </ul>
    <ul>
      <div class="headerGrid">
        <h2>Solicitar atendimento</h2>
        <div class="headerGrid">
          <img id="atualizaAtendimento" onclick="viewAtendimento('${id}', true)" width=25px height=25px src="./assets/images/refresh.png" alt="Atualizar solicitação de atendimento">
          <img id="iconAtendimento" onclick="viewAtendimento('${id}')" width=25px height=25px src="./assets/images/expandir.png" alt="Expandir ou contrair solicitação de atendimento">
        </div>
      </div>
      <li>
        <div>
          <section id="listasRequestService" class="secao-listas">
            <table id="tableAtentimento"></table>
          </section>
        </div>
      </li>
    </ul>
    `
  document.querySelector("#iconAvaliacao").tag = 0
  document.querySelector('#iconAtendimento').tag = 0
  document.querySelector('#atualizaAvaliacao').style.display = "none"
  document.querySelector('#atualizaAtendimento').style.display = "none"

  fetch(`${_address}disciplina/${id}`,
    { headers: { "Authorization": "Bearer " + _token } }
  ).then(data => data.json()
    .then(json => {
      document.querySelector("#subjectTag").innerHTML = json[0].descricao
      _teacher = json[0].codigo_professor

      fetch(`${_address}professor/${_teacher}`,
        { headers: { "Authorization": "Bearer " + _token } }
      ).then(data => data.json()
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
            <button type="button"  id="loginOk">Ok</button>
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
    cursoLocal.innerHTML = null
    cursoDescricao.innerHTML = null

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

  _image = localStorage.getItem("image")
  _userId = localStorage.getItem("userId")
  _userName = localStorage.getItem("userName")
  _welcome = document.querySelector('#welcome')

  if (token) {
    const fetchAluno = await fetch(_address + 'aluno/' + _userId, { headers: { "Authorization": "Bearer " + _token } })
    const jsonAluno = await fetchAluno.json()
    _curso = jsonAluno[0].codigo_curso
    _semestre = jsonAluno[0].semestre

    const fetchCurso = await fetch(_address + 'curso/' + _curso, { headers: { "Authorization": "Bearer " + _token } })
    const jsonCurso = await fetchCurso.json()
    cursoLocal.innerHTML = 'São Paulo - SP - Brasil'
    cursoDescricao.innerHTML = jsonCurso[0].descricao

    const fetchDisciplina = await fetch(_address + 'curso/disciplina/' + _curso + '?semestre=' + _semestre, { headers: { "Authorization": "Bearer " + _token } })
    const jsonDisciplina = await fetchDisciplina.json()

    htmlMenuOptions += `<br /><div class="divider"></div><br />`
    if (jsonDisciplina && jsonDisciplina.length) {
      jsonDisciplina.forEach((e, i) => {
        htmlMenuOptions += `<li><a id="optionSubject_${e.codigo_disciplina}" onclick="optionSubject('${e.codigo_disciplina}')" href="#">${e.descricao}</a></li> `
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
    localStorage.setItem('token', data.token)
    localStorage.setItem('userName', data.reg.nome)
    localStorage.setItem('userId', data.reg.codigo)
    localStorage.setItem('image', data.reg.imagem)
    doLoad()
  }
}

window.addEventListener('load', doLoad);