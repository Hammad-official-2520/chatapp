let cont = document.querySelector('.container2')
let close_btn = document.querySelector('.close-btn')
let user_btn = document.querySelector('.user-btn')
let new_contact_btn = document.querySelector("#new-contact");
let disable_div = document.querySelector("#disableDiv");
let loginbtn = document.getElementById("login-btn");
loginbtn.onclick = function(){
}
let s_profile = document.querySelector('.s-p')
s_profile.addEventListener('click' , ()=>{
  document.querySelector('.user-profile').style.display = "flex"
  disable_div.style.display = "block"
})

new_contact_btn.addEventListener('click', () => {

  disable_div.style.display = "block"
  cont.style.display = "flex"
})

close_btn.addEventListener('click', () => {
  cont.style.display = "none"
  disable_div.style.display = "none"
})
let popup = document.querySelector('.popup')
let confirm_btn = document.querySelector('.confirm-btn')
let cancel_btn = document.querySelector('.cancel-btn')
const image_input = document.querySelector("#image-input");
const display_image = document.querySelector("#display-image");
image_input.addEventListener("change", function () {
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    const uploaded_image = reader.result;
    document.querySelector("#img-box").src = `${uploaded_image}`;
    user_img = `${uploaded_image}`
  });
  reader.readAsDataURL(this.files[0]);
});
let  container = document.getElementById("container");
let container2 = document.getElementById("container2");
let alredyaccount = document.getElementById("alredy-account");
alredyaccount.onclick = function(){
    container.style.display = "none"
    container2.style.display = "flex"
}
















