function loadDimension(){
  axios.get('/user/current_dimension').then((dimensionRes) => {
    eval(dimensionRes.data.content);
  })
}

$(document).ready(() => {
  loadDimension();
});
