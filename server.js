const fs = require('fs')
const key = fs.readFileSync('certs/privkey.pem')
const cert = fs.readFileSync('certs/cert.pem')
const credentials = { key: key, cert: cert }

const host = '0.0.0.0'
const port = 8001

const express = require('express')
const app = express()
const server = require('https').createServer(credentials, app)
// const io = require('socket.io')(server, { path: '/interview_client/socket.io' }) /// запуск на сервере
const io = require('socket.io')(server) /// локальный запуск

app.set('view engine', 'ejs')
app.use(express.static('public'))

app.get('/record', (req, res) => {
  const candidate_id = req.query.candidate_id;
  const chunk_time = req.query.chunk_time;
  res.render('record', { candidate_id: candidate_id || 'unknown id', chunk_time: chunk_time || 1000 })
})

io.on('connection', socket => {
  socket.on('recorded-chunk', (data) => {
    var fileStream = fs.createWriteStream(`./rec/${data.filename}.webm`, { flags: 'a' } );
    fileStream.write(Buffer.from(new Uint8Array(data.chunk)));
    console.log('chunk recieved');
  })
})

server.listen(port, host, () => {
  console.log(`server running at link: https://${host}:${port}`);
  console.log(`record video page: https://${host}:${port}/record`);
})