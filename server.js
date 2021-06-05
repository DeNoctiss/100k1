const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 5555;

let admin = {id: null, nick: null, type: null, team: null};
let team1 = [];
let team2 = [];
let music = ['1.mp3','2.mp3','3.mp3','4.mp3','5.mp3','6.mp3']


app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.get('/admin', (req, res) => {
	res.sendFile(__dirname + '/admin.html');
});

io.on('connection', (socket) => {
	

	socket.on('enter', (obj, id_) => {
		client = {id: socket.id, nick: 'Anonim', type: 'client', team: 0};
		if(obj.type == 'admin'){
			admin = {id: socket.id, nick: obj.nick, type: obj.type, team: 0};
		} else {
			client.id = socket.id;
			client.nick = obj.nick;
			client.team = obj.team;
			if(client.team ==  1){
				team1.push(client);
			} else {
				team2.push(client);
			}
		}
		io.emit('new connection', admin, team1, team2);
	});

	socket.on('disconnect', () => {
		if(socket.id == admin.id){
			admin = {id: null, nick: null, type: null, team: null};
		}
		for(let i=0; i<team1.length; i++){
			if(socket.id == team1[i].id){
				team1.splice(i,1);
			}
		}
		for(let i=0; i<team2.length; i++){
			if(socket.id == team2[i].id){
				team2.splice(i,1);
			}
		}

		io.emit('new connection', admin, team1, team2);
	});

	socket.on('change button', (str, socId) =>{
		io.emit('change button', str, socId);
	});

	socket.on('get question', (question,round) =>{
		io.emit('get question', question, round);
	});

	socket.on('get answer', (id, answer, value, fond) =>{
		io.emit('get answer', id, answer, value, fond);
	});

	socket.on('change wrong', (id) => {
		io.emit('change wrong', id);
	});

	socket.on('reset fond', (fond) => {
		io.emit('reset fond', fond);
	});

	socket.on('changeTeamName', (name, id) => {
		io.emit('changeTeamName', name, id);
	});

	socket.on('change score', (score, id) => {
		io.emit('change score', score, id);
	});

	socket.on('team answer', (id) => {
		io.emit('team answer', id);
	});

	socket.on('load final', () =>{
		io.emit('load final');
	});

	socket.on('final answer',(answer,id) =>{
		io.emit('final answer',answer,id);
	});
});

http.listen(port, () => {
	console.log(`Socket.IO server running at http://localhost:${port}/`);
});