const wsUri = 'wss://echo.websocket.org/';

let output = document.querySelector('.messages');
const btnOpen = document.getElementById('btnS1');
const btnGeo = document.getElementById('btnGeo');

const inputMessage = document.querySelector('input');

let websocket;

//Событие - отправка и получение сообщений
btnS1.addEventListener('click', () => {
  if (websocket === undefined && inputMessage.value === '') {
    openConnection();
  } else if (websocket === undefined && inputMessage.value !== '') {
    openConnection();
    setTimeout(() => sendMessage(), 5000);
  } else if (websocket.readyState === 1 && inputMessage.value !== '') {
    sendMessage();
  } else if (websocket.readyState === 1 && inputMessage.value === '') {
    console.log('пустое сообщение не отправляется');
  } else if (
    websocket.readyState === 2 ||
    (websocket.readyState === 3 && inputMessage.value === '')
  ) {
    websocket = undefined;
    openConnection();
  } else if (
    websocket.readyState === 2 ||
    (websocket.readyState === 3 && inputMessage.value !== '')
  ) {
    websocket = undefined;
    openConnection();
    setTimeout(() => sendMessage(), 5000);
  }
});
//Событие - получение геолокации
btnGeo.addEventListener('click', () => {
  if (!navigator.geolocation) {
    writeToScreen('Geolocation не поддерживается вашим браузером');
  } else {
    navigator.geolocation.getCurrentPosition(success, error);
  }
});

function writeToScreen(message) {
  let pre = document.createElement('p');
  pre.style.padding = '3px 15px';
  pre.innerHTML = message;
  if (pre.textContent.includes('°')) {
    console.log('не выводим');
  } else {
    output.appendChild(pre);
  }
}

function openConnection() {
  websocket = new WebSocket(wsUri);
  websocket.onopen = function (evt) {
    writeToScreen('CONNECTED');
  };
  websocket.onclose = function (evt) {
    writeToScreen('DISCONNECTED');
  };
  websocket.onmessage = function (evt) {
    writeToScreen(
      `<span style="
			color: rgb(109, 128, 233);
			border-radius: 4px; 
			padding: 0px 30px; 
			border: 1px solid grey;
			margin: 25px 0px;">` +
        evt.data +
        '</span>'
    );
  };
  websocket.onerror = function (evt) {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
  };
}

function sendMessage() {
  const message = inputMessage.value;
  writeToScreen(
    `<span style="float: right; 
			color: rgb(272, 139, 183); 
			padding: 0px 30px;
			border: 1px solid rgb(237, 145, 145); 
			margin: -25px 0px;
			border-radius: 4px;"</span>` + message
  );
  websocket.send(message);
  inputMessage.value = '';
}

// Функция, выводящая текст об ошибке
const error = () => {
  writeToScreen('Невозможно получить ваше местоположение');
};

// Функция, срабатывающая при успешном получении геолокации
const success = (position) => {
  console.log('position', position);
  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;

  websocket.send(`Широта: ${latitude} °, Долгота: ${longitude} °`);
  writeToScreen(
    `<a href=https://www.openstreetmap.org/#map=18/${latitude}/${longitude} 
		target="_blank"
		>Геолокация</a>`
  );
};
