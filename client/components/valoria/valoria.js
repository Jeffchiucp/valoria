function loadValoria(){
  axios.get('/dimension/valoria').then((valoriaRes) => {
    eval(valoriaRes.data.content);
  })
}

$(document).ready(() => {
  loadValoria();
});
