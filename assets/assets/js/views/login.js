// alert('hello');

async function afterLogin(response) {
  if (response && response.data && response.data.home_url) {
    await sleep(2000)
    $.redirect(response.data.home_url);
  } else {
    grecaptcha.reset();
  }
  // $.info(response.data);
}

function errorLogin(response){
  $.alert(response.error.message,()=>{
    if(response.error.code==403){
      location.reload()
      return
    }
  });
  grecaptcha.reset();
}

function submitForm(){
  $("#formLogin").submit();
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}