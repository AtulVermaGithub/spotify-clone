document.querySelector(".ham").addEventListener("click", () => {
    console.log("working");
    document.querySelector(".left").style.left = "0%"
})

document.querySelector(".cross").addEventListener("click", () => {
    console.log("working");
    document.querySelector(".left").style.left = "-100%"
})