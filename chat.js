import { initializeApp } from "https://www.gstatic.com/firebasejs/9.10.0/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getFirestore,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  orderBy,
  // updateDoc,
  onSnapshot,
  // Timestamp,


} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-firestore.js";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "https://www.gstatic.com/firebasejs/9.10.0/firebase-storage.js";
const firebaseConfig = {
  apiKey: "AIzaSyAmtFMwJYIoccdpGQcbzv-qHPfWz-TfXc4",
  authDomain: "practice-2520.firebaseapp.com",
  projectId: "practice-2520",
  storageBucket: "practice-2520.appspot.com",
  messagingSenderId: "445650460439",
  appId: "1:445650460439:web:7dbcaa47b19b14dc0b6152",
  measurementId: "G-8MR83M7XBM"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const register = () => {
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const password = document.getElementById("password");
  let myFile = document.getElementById("image-input");
  let file = myFile.files[0];
  console.log(file)
  const auth = getAuth();
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(async (userCredential) => {
      let uid = userCredential.user.uid;
      const uploadFiles = (file) => {
        return new Promise((resolve, reject) => {
          const storage = getStorage();
          const auth = getAuth();
          let uid = auth.currentUser.uid;
          const storageRef = ref(storage, `users/${uid}.png`);
          const uploadTask = uploadBytesResumable(storageRef, file);
          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              console.log("Upload is " + progress + "% done");
              switch (snapshot.state) {
                case "paused":
                  console.log("Upload is paused");
                  break;
                case "running":
                  console.log("Upload is running");
                  break;
              }
            },
            (error) => {
              reject(error);
            },
            () => {
              getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
                resolve(downloadURL);
                let url = await downloadURL
                let firDoc = doc(db, "users", uid);
                await setDoc(firDoc, {
                  name: name.value,
                  email: email.value,
                  password: password.value,
                  profile: url
                });
              });
            }
          );
        });
      }; let url = await uploadFiles(file);
      swal({
        title: "Registration Successful", text: "Your registration is Successfully done!", icon: "success"
      }).then(function () {
        let container = document.getElementById("container");
        let container2 = document.getElementById("container2");
        container.style.display = "none"
        container2.style.display = "flex"
      }
      )

    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
      ///////////////////////////image alert not fix///////////////////

      if (myFile.value == "") {
        console.log(myFile)
        swal("Please Upload image!")
        return false
      }
      let nameReg = /(^[A-Za-z]{3,16})([ ]{0,1})([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})?([ ]{0,1})?([A-Za-z]{3,16})/;
      if (!nameReg.test(name.value)) {
        swal("invalid name! ")
        return false
      }
      if (errorMessage == 'Firebase: Error (auth/invalid-email).') {
        swal("Invalid email!")
        return false
      } if (errorMessage == 'Firebase: Error (auth/internal-error).') {
        swal("Password filled empty!")
        return false
      } if (errorMessage == "Firebase: Password should be at least 6 characters (auth/weak-password).") {
        swal("Password should be at least 6 characters!")
      }
      if (errorMessage == "Firebase: Error (auth/email-already-in-use).") {
        swal("Email is alredy taken!")
      }
    });
};







try {
  const btn = document.getElementById("register-btn");
  btn.addEventListener("click", register);
} catch {
  console.log("error")
}
const login = () => {
  const email = document.getElementById("l-email");
  const password = document.getElementById("l-password");
  const auth = getAuth();
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
      // const user = userCredential.user;
      swal({
        title: "Login Successful", text: "You Login Successfully!", icon: "success"
      }).then(function () {
        window.location.href = "chat.html"
      }
      );

    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
      if (errorMessage == 'Firebase: Error (auth/invalid-email).') {
        swal("This email does not exist!")
        return false
      } if (errorMessage == "Firebase: Error (auth/internal-error).") {
        swal("Password filled empty!")
      } if (errorMessage == "Firebase: Error (auth/wrong-password).") {
        swal("Wrong password!")
      }

    });
};
try {
  const loginBtn = document.getElementById("login-btn");
  loginBtn.addEventListener("click", login);
} catch {
  console.log("error")
}

window.onload = async () => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      if (!user.emailVerified) {

      }
      getUserFromDataBase(user.uid);
    } else {
      console.log("not login")
    }
  });
};

const getUserFromDataBase = async (uid) => {
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  // console.log(uid)
  let currentUser = document.querySelector(".userimg");

  if (docSnap.exists()) {
    currentUser.src = docSnap.data().profile;
    currentUser.innerHTML = `<img src="${currentUser.src}" class="cover" />`;
    getAllUsers(docSnap.data().email, uid, docSnap.data().name);
  } else {
    console.log("No such document!");
  }
};

const getAllUsers = async (email, currentId, currentName) => {
  const q = query(collection(db, "users"), where("email", "!=", email));
  const querySnapshot = await getDocs(q);
  let users = document.getElementById("users");
  querySnapshot.forEach((doc) => {
    console.log(doc.data().profile)
    users.innerHTML += `
    <div id="use" class="block active" onclick='startChat("${doc.id
      }","${doc.data().name
      }","${currentId}","${currentName}","${doc.data().profile}")'>
            <div class="imgbx">
             <img src="${doc.data().profile}" class="cover" alt="">
            </div>
            <div class="details">
              <div class="listHead">
                <h4 id="use" >${doc.data().name}</h4>
                <p class="time">9:40</p>
              </div>
              <div class="message_p">
                <p>sucess:</p>
              </div>
            </div>
          </div>
  `;
  });
};

let startChat = (id, name, currentId, currentName, profile) => {
  // let chatWith = document.getElementById("chat-with");

  let chatprofile = document.getElementById("pro");
  chatprofile.innerHTML = `
  <img class="cover2" src="${profile}" alt="">
  <h4 class="hamza" id="chat-with">${name}<br><span>online</span></h4>
  `
  // chatWith.innerHTML = name +`<span>online</span>`;
  let send = document.getElementById("send");
  let message = document.getElementById("message");
  let chatID;
  if (id < currentId) {
    chatID = `${id}${currentId}`;
  } else {
    chatID = `${currentId}${id}`;
  }
  document.getElementById("message").addEventListener("keyup", function (e) {
    if (e.keyCode === 13) {
      document.getElementById("send").click();
    }
  });

  document.getElementById("send").onclick = function () {
    document.getElementById("message").innerHTML = ''
  }
  loadAllChats(chatID, currentId, id);
  const unsubscribe = send.addEventListener("click", async () => {
    await addDoc(collection(db, "messages"),
      {
        sender_name: currentName,
        receiver_name: name,
        sender_id: currentId,
        receiver_id: id,
        chat_id: chatID,
        profile: profile,
        message: message.value,
        dateTime: new Date().toLocaleString()
      });
  }); return unsubscribe
};
// console.log(new Date().toLocaleString())
const loadAllChats = (chatID, currentId) => {
  const colRef = collection(db, "messages")
  try {
    const q = query(colRef, where("chat_id", "==", chatID),
      orderBy("dateTime", "asc")
    );
    let allMessages = document.getElementById("all-messages");
    unsubscribe = onSnapshot(q, (querySnapshot) => {
      allMessages.innerHTML = "";
      querySnapshot.forEach((doc) => {

        let className =
          doc.data().sender_id === currentId ? "my_message" : "frnd_message";
        let time = doc.data().dateTime.split(",")
        console.log(time)
        allMessages.innerHTML += `
          <div class="message ${className}  " >
          <p >${doc.data().message}<br><span class="time">${time[1]}</span></p>
          </div>
          `
      });
    });
  } catch (err) {
    console.log(err);
  }
};
window.startChat = startChat;




