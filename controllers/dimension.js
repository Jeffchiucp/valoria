const Dimension = require('../models/dimension');
const Idea = require('../models/idea');
const Thing = require('../models/thing');

module.exports = (app) => {

  app.get('/dimension/:key', (req, res) => {
    Dimension.findOne({key : req.params.key.toLowerCase()}).then((dimension) => {
      //Create main valorian dimension with code idea and thing
      if(!dimension && req.params.key.toLowerCase() == 'valoria'){
        let valoria = new Dimension();
        valoria.key = 'valoria';
        valoria.creator = 'james';
        valoria.ideas.push('code');
        valoria.things.push('code0');
        let codeIdea = new Idea();
        codeIdea.kind = 'code';
        codeIdea.creator = 'James';
        codeIdea.content = `
            //Remove Code if already exists
            if($('#' + thingKey)){
              $('#' + thingKey).remove();
            }

            //Create Code Element
            let code = document.createElement('div')
            code.classList.add('code');
            code.id = thingKey;
            $(code).css({
              width : "600px",
              height : "600px",
              border : "2px solid #c431a9",
              display : "flex",
              flexDirection : "column",
              justifyContent : "flex-start",
              alignItems : "center",
              position : "absolute",
              zIndex : "1"
            })
            $('.valoria').append(code);

            //Create Idea Input Container
            let ideaInputContainer = document.createElement('div');
            ideaInputContainer.classList.add("ideaInputContainer");
            $(ideaInputContainer).css({
              height : "5%",
              backgroundColor : "#ffffff",
              width : "100%",
              borderBottom : "2px solid #c431a9",
              display : "flex",
              justifyContent : "center",
              alignItems : "center"
            })
            $(code).append(ideaInputContainer)

            //Create Idea Input Text
            let ideaInput = document.createElement('div');
            ideaInput.classList.add('ideaInput');
            ideaInput.contentEditable = true;
            $(ideaInput).css({
              color : "black",
              fontSize : "20px",
              fontWeight : "bold",
              textAlign : "center",
              outline : "none"
            })
            ideaInput.textContent = thingContent;
            let kindOfIdea = ideaInput.textContent.toLowerCase();
            $(ideaInputContainer).append(ideaInput)

            //Create Code Editor Element
            let codeEditor = document.createElement('div');
            codeEditor.classList.add('codeEditor');
            codeEditor.id = 'defaultCodeEditor';
            $(codeEditor).css({
              width : "100%",
              height : "90%",
              outline: "none",
            })
            codeEditor.tabIndex = 0;
            $('.code').append(codeEditor);

            //Create Button Element to Run Code from Editor
            let runCodeBtn = document.createElement('div')
            runCodeBtn.classList.add('runCodeBtn');
            $(runCodeBtn).css({
              width : "100%",
              height : "10%",
              borderTop : "2px solid #c431a9",
              display : "flex",
              justifyContent : "center",
              alignItems : "center",
              cursor : "pointer",
              backgroundColor : "white"
            })
            let runCodeBtnText = document.createElement('div');
            runCodeBtnText.classList.add('runCodeBtnText');
            runCodeBtnText.textContent = "Run Code";
            $(runCodeBtnText).css({
              textAlign : "center",
              fontSize : "25px",
              fontWeight : "bold",
              color : "#000000"
            })
            $(runCodeBtn).append(runCodeBtnText);
            $('.code').append(runCodeBtn);

            //Add Ace to Editor to make all codey
            let editor = ace.edit(codeEditor.id);
            editor.session.setMode("ace/mode/javascript");
            editor.session.setTabSize(2)
            editor.resize();
            axios.get('/dimension/valoria/idea/' + thingContent).then((res) => {
              if(res.data.content){
              editor.setValue(res.data.content);
              }
            })

            //Run Code on Run Code Button Click
            runCodeBtn.onclick = function(){
              let thisCode = editor.getValue();
              axios.post('/dimension/valoria/idea/' + thingContent + '/save', {
                content : thisCode
              }).then((res) => {
                if(res.data.content){
                  editor.setValue(res.data.content);
                  eval(res.data.content);
                }
              })
            }

            //Blur and Focus for Editor
            let editingThisCode = false;
            editor.on("focus", () => {
              editingThisCode = true;
            })
            editor.on("blur", () => {
              editingThisCode = false;
            })

            //Save Code on CMD+S or CTRL+S
            $(window).keydown((e) => {
              if (e.metaKey && e.keyCode == 83 || e.ctrlKey && e.keyCode == 83) {
                e.preventDefault();
                if(editingThisCode){
                  axios.post('/dimension/valoria/idea/' + thingContent + '/save', {
                    content : editor.getValue()
                  })
                }
              }
            });

            //Change Idea on Idea Input Blur
            $(ideaInput).on('blur', (e) => {
              kindOfIdea = ideaInput.textContent.toLowerCase();
              if(kindOfIdea.length > 0 ){
                axios.get('/dimension/valoria/idea/' + kindOfIdea).then((res) => {
                  if(res.data){
                    if(res.data.err){
                      axios.post('/dimension/valoria/idea/new', {
                        content : '//Write code for ' + kindOfIdea,
                        kind : kindOfIdea
                      }).then((res) => {
                        editor.setValue(res.data.content);
                      })
                    }else{
                      editor.setValue(res.data.content);
                    }
                    axios.post('/dimension/valoria/thing/' + thingKey + '/save', {
                      content : kindOfIdea
                    }).then(() => {
                      thingContent = kindOfIdea;
                    });
                  }
                })
              }
            })
        `;
        codeIdea.dimension = 'valoria';
        codeIdea.save().then((codeIdea) => {
          let codeThing = new Thing();
          codeThing.kind = 'code';
          codeThing.key = 'code0';
          codeThing.creator = 'james';
          codeThing.content = 'New Thing';
          codeThing.dimension = 'valoria';
          codeThing.save().then((codeThing) => {
            valoria.save().then((valoria) => {
              res.send(valoria);
            })
          })
        })
      }else{
        if(!dimension){
          res.send({err : 'No dimension found'});
        }else{
          res.send(dimension);
        }
      }

    })
  })

}
