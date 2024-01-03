const socket = io(); //socket başlatıyorum. İmportunu index.html de yaptık.

const messageData = []; //localde çalışan basit db

const form = document.querySelector("form");
const button = document.querySelector("#send-btn");
const username = document.querySelector("#username");
const message = document.querySelector("#message");
const messageList = document.querySelector("#message-list");

// formda submit işlemi çalıştığında olacak işlemler
form.addEventListener("submit", (event) => {
  event.preventDefault();//sayfa sürekli yenilenmesin diye,varsayılanı değiştirdik
  username.readOnly = true;//kullanıcının bir daha usernameini değiştirememesini sağlar.
  sendMessage();
});

socket.on("oldMessages", (data) => {
  if (messageData.length === 0) data.forEach((item) => displayMessage(item));
});

socket.on("message", (data) => {
  if (data.username !== username.value.trim()) {
    displayMessage(data);
  }
});

// mesaj gönderildiği zaman çalışır
// backend e mesajı gönderir ve ekrana yazdırma fonksiyonunu çalıştırır
function sendMessage() {
  const msg = {
    username: username.value.trim(),//trim:başında ve sonundaki gereksiz boşlukları siler. mesaj ve kullanıcı adı msg objesine atılır.
    message: message.value.trim(),
  };
  socket.emit("message", msg);//msg objeside message socketine atılır. Isımleri karıştırma,backende neyse o.

  displayMessage(msg);//ekrana yeşil ve gri mesajı koyan kısım

  message.value = "";
}

// ekrana mesajı ekleyen fonksiyon
function displayMessage(msg) {
  messageData.push(msg);//db kaydetti
  const messageType = isMe(msg.username) ? "message-me" : "message-others";//mesajı atan bensem "message-me:yeşil" değilsem "message-others:gri"
  const uName = isMe(msg.username) ? "" : `<h2>${msg.username}</h2>`;//mesajı atan bensem kullanıcı adı boş,değilsem kullanıcı adı dolu
  messageList.innerHTML += `
  <div class="message-item ${messageType}">
    ${uName}
    <p>${msg.message}</p>
  </div>`;

  scrollToBottom();//ekranın kayarken yeni mesaj geldiğinde otomatikman aşağıda kalmasını sağlar
}

// mesajı gönderen kişi kayıtlı kullanıcı ile aynı mı onu kontrol eder true false döner
function isMe(uName) {
  return uName === username.value;
}

// en aşağı scroll yapar
function scrollToBottom() {
  messageList.scrollTo(0, messageList.scrollHeight);
}
