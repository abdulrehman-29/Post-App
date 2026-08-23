import { signInWithEmailAndPassword, getAuth } from "./firebase.js";
import { db, doc, setDoc, serverTimestamp } from "./firebase.js";

let loginEmail = document.getElementById("loginEmail");
let loginPassword = document.getElementById("loginPassword");
let loginBtn = document.getElementById("loginBtn");

let auth = getAuth();

loginBtn.addEventListener("click", () => {

  if (!loginEmail.value || !loginPassword.value) {
    return Swal.fire({
      title: "Warning!",
      text: "Please fill in all fields!",
      icon: "warning",
      timer: 2000,
      showConfirmButton: false
    });
  }

  signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
    .then(async (userCredential) => {
      let user = userCredential.user;

      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        name: user.displayName || "",
        lastLogin: serverTimestamp()
      }, { merge: true });

      Swal.fire({
        title: "Success!",
        text: "Logged in successfully!",
        icon: "success",
        timer: 800,
        showConfirmButton: false
      });

      loginEmail.value = "";
      loginPassword.value = "";

      setTimeout(() => {
        window.location.href = "./test.html";
      }, 1000);
    })
    .catch((error) => {
      let message = "Something went wrong!";

      if (error.code === "auth/invalid-credential" || error.code === "auth/user-not-found" || error.code === "auth/wrong-password") {
        message = "Incorrect email or password.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address.";
      } else if (error.code === "auth/too-many-requests") {
        message = "Too many failed attempts. Try again later.";
      }

      Swal.fire({
        title: "Error!",
        text: message,
        icon: "error",
        timer: 2000,
        showConfirmButton: false
      });
    });
});