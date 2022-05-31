(function() {
  const errorMessageContainer = document.createElement("div");
  errorMessageContainer.className = "gamebundle-error";
  document.body.appendChild(errorMessageContainer);

  const devServer = new WebSocket(`${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/dev`);

  devServer.onmessage = function(payload) {
    const data = JSON.parse(payload.data);
    console.log("Payload data:", data);

    if (data.type === "reload") {
      window.location.reload();

    } else if (data.type === "error") {
      console.error(data.message);
      errorMessageContainer.innerHTML = data.message;
      errorMessageContainer.classList.add("active");

    } else {
      console.log(data);
    }
  }

  devServer.onopen = function() { console.log(String.fromCodePoint(0x2705), "Connected to dev server!"); };
  devServer.onclose = function() { console.log(String.fromCodePoint(0x274C), "Disconnected from dev server!"); };

})();