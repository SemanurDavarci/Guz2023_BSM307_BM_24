
// import etme işlemi
// express:bir back-end frameworkü,backendi yazarken daha kolay yazmamızı sağlar.
const express = require("express");
const http = require("http"); //nodeun kendi paketi,istekleri almak için bir server oluşturur.
const socketIO = require("socket.io");

const app = express();//express başlatılıyor,program başlatma işlemi.app değişkeni üzerinden expresse erişeceğiz.
const server = http.createServer(app);//createServer:localde çalışacak serverı oluşturur.
const io = socketIO(server);//socket servera bağlanıp,o server üzerinden gelen istekleri yönetiyor.

// basit db
const messages = [];

// Kullanıcıların gördüğü kodu herkesin erişebileceği bir hale getiriyor
// bu klasör dışındaki diğer dosya ve klasörler kullanıcıya gizlidir
app.use(express.static("public"));

// Socket bağlanıldığı zaman çalışır
io.on("connection", (socket) => {
  console.log("Bir kullanıcı bağlandı");
  //   console.log(socket.handshake.address); //ip gösterme kodu, buraya yazarsak kullanıcı bağlandığında da gösterir

  // eski mesajları yeni kullanıcılara dağıtır
  io.emit("oldMessages", messages);

  // mesaj gönderildiğinde çalışır
  socket.on("message", (data) => {
    const { username, message } = data;//data içerisinde mesajımız ve kullanıcı adımız olur
    messages.push(data);//her gelen mesaj messages içerisine kaydolur.
    console.log(`${socket.handshake.address} => ${username}: ${message}`);//terminale ip,kullanıcı adı ve gelen mesajı yazar.
    // gelen mesaj backende gelir bu kısımdan da diğer kullanıcılara yollanır
    io.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log("Bir kullanıcı ayrıldı");
  });
});

// localhost => 127.0.0.1:3000
const port = 3000;
server.listen(port, () => { //serverı 3000 portunda başlatır
  // fonksiyon program başlarken çalışır
  console.log(`http://localhost:${port}`); //server baladığında ekrana bu yazılır,ne yazarsak terminalde başladığında onu görürüz
});
