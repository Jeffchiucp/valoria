function loadValoria(){
  axios.get('/dimension/valoria').then((dimensionRes) => {
    let things = dimensionRes.data.things;
    things.forEach((thingKey) => {
      axios.get('/dimension/valoria/thing/' + thingKey).then((thingRes) => {
        let thingKind = thingRes.data.kind;
        let thingContent = thingRes.data.content;
        axios.get('/dimension/valoria/idea/' + thingKind).then((ideaRes) => {
          let ideaContent = ideaRes.data.content
          eval(ideaContent);
        })
      })
    })
  })
}

$(document).ready(() => {

  loadValoria();

});
