if ('WebSocket' in window || 'MozWebSocket' in window) {
  if (!window.todoWS) {
    window.todoWS = new WebSocket('http://localhost:5000/todo-list-react-33431/us-central1/api/project/-MMqdnothnthntuheonth3232euhn3');
    window.todoWS.onmessage = (evt) => {
      try {
        const message = JSON.parse(evt.data);
        console.log('MESSAGE!', message);
      } catch (e) {
        console.info('[Scayla WS Error] Data is badly formatted', evt.data);
      }
    }
  }
} else {
  alert('Your browser does not support web sockets.')
}

export default window.todoWS;
