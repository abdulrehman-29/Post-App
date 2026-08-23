import { createUserWithEmailAndPassword, getAuth, updateProfile } from "./firebase.js";
import { db, doc, setDoc, serverTimestamp } from "./firebase.js";

let signupEmail = document.getElementById("signupEmail");
let signupPassword = document.getElementById("signupPassword");
let signupBtn = document.getElementById("signupBtn");
let fullname = document.getElementById("fullname");

let auth = getAuth();

signupBtn.addEventListener("click", () => {
  let email = signupEmail.value;
  let password = signupPassword.value;
  let name = fullname.value.trim();

  if (!name || !email || !password) {
    return Swal.fire("Warning", "Please fill in all fields!", "warning");
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      let user = userCredential.user;

      await updateProfile(user, {
        displayName: name
      });

      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        password: password,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp()
      });

      Swal.fire({
        title: "Success!",
        text: "Account created successfully!",
        icon: "success",
        timer: 800,
        showConfirmButton: false
      });

      signupEmail.value = "";
      signupPassword.value = "";
      fullname.value = "";

      setTimeout(() => {
        window.location.href = "./index.html";
      }, 1000);
    })
    .catch((error) => {
      let message = "Something went wrong!";

      if (error.code === "auth/email-already-in-use") {
        message = "This email is already registered.";
      } else if (error.code === "auth/invalid-email") {
        message = "Invalid email address.";
      } else if (error.code === "auth/weak-password") {
        message = "Password must be at least 6 characters.";
      }

      Swal.fire("Error", message, "error");
    });
});