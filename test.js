import { getAuth, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

let auth = getAuth();
let logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
    signOut(auth)
        .then(() => {
            Swal.fire({
                title: "Logged Out!",
                text: "You have successfully logged out.",
                icon: "success",
                timer: 800,
                showConfirmButton: false
            })
            setTimeout(() => {
                window.location.href = "./index.html";
            }, 1000);
        })
        .catch((error) => {
            Swal.fire({
                title: "Error!",
                text: error.message,
                icon: "error"
            });
        });
});



const firebaseConfig = {
    apiKey: "AIzaSyBOHN6vJAzmOt_wWxdVi7scF6PnnUTSnrM",
    authDomain: "post-app-557c1.firebaseapp.com",
    projectId: "post-app-557c1",
    storageBucket: "post-app-557c1.firebasestorage.app",
    messagingSenderId: "25685760108",
    appId: "1:25685760108:web:c235b22da7a83f7d20e049",
    measurementId: "G-NQYFDEGXQP"
};