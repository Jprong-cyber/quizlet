let url = location.href.split("/");
let gameCode = url[url.length - 1];
let terms = [];
let definitions = [];

function parseQuestions() {
  let q = questions.termIdToTermsMap;
  let qKeys = Object.keys(q);
  terms = [];
  definitions = [];
  for(let x=0;x<qKeys.length;x++) {
    terms.push(q[qKeys[x]].word);
    definitions.push(q[qKeys[x]].definition);
  }
  setInterval(getCorrect, 0);
}
function getCorrect() { // Classes changed on me, so...
  //let currentQ = document.getElementsByClassName("FormattedText notranslate TermText StudentPrompt-promptText lang-en")[0].children[0].textContent;
  let currentQ =document.getElementsByClassName("FormattedText notranslate NewStudentPrompt-text lang-et")[0].children[0].textContent;
  //let questions = document.getElementsByClassName("StudentTermGroup-terms")[0].children;
  let questions = document.getElementsByClassName("NewStudentAnswerOptions")[0].children;
  let txt = [];
  for(let x=0;x<questions.length;x++) {
    txt.push(questions[x].children[0].children[0].children[0].textContent);
  }
  flipped = false;
  if(terms.indexOf(currentQ) === -1) {
    termsQ = terms
    terms = definitions
    definitions = termsQ
  }
  int = txt.indexOf(definitions[terms.indexOf(currentQ)]);
  for(let x=0;x<questions.length;x++) {
    questions[x].children[0].style.color = null;
  }
  try {
    questions[int].children[0].style.color = "dodgerblue";
    questions[int].children[0].click();
  }catch(err){}
}

fetch(`https://quizlet.com/webapi/3.2/game-instances?filters={"gameCode":${gameCode},"isInProgress":true,"isDeleted":false}&perPage=500`)
    .then((response) => response.json())
    .then((data) => {
      let gameId = data.responses[0].models.gameInstance[0].itemId;
      fetch(`https://quizlet.com/${gameId}/`)
          .then(e => e.text())
          .then(stuff => {
            console.log(stuff);
            let split = stuff.split("<script");
            split = split[split.length - 6];
            split = split.split("/script>")[0];
            split = split.split("QLoad(")[0];
            split = "window.questions" + split.split(`(function(){window.Quizlet["setPageData"]`)[1] + "parseQuestions()";
            let src = document.createElement("script");
            src.textContent = split;
            document.body.appendChild(src);
          })
    })
