const textBox = document.getElementById("res-text");

const checkPermission = () => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("No support for Service Worker");
  }
  if (!("Notification" in window)) {
    throw new Error("No support for Notification API");
  }
};

const requestNotificationPermission = async () => {
  if (Notification.permission === "granted") {
    console.log("Notification permission already granted.");
    return;
  }

  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission not granted");
    }
  } catch (error) {
    throw new Error("Error requesting notification permission");
  }
};

const registerSW = async () => {
  if (navigator.serviceWorker.controller) {
    console.log("Service Worker already registered.");
    return;
  }
  try {
    const registration = await navigator.serviceWorker.register("./sw.js");
    return registration;
  } catch (error) {
    throw new Error("Service Worker registration failed");
  }
};

const main = async () => {
  try {
    checkPermission();
    await requestNotificationPermission();
    await registerSW();
  } catch (error) {
    throw new Error("main run failed");
  }
};

document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(this);
  const formValues = Object.fromEntries(formData.entries());
  fetch("http://localhost:5500/api/getMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formValues),
  })
    .then((response) => {
      if (response.status == 200) {
        textBox.innerText = "پیام ثبت گردید";
        setTimeout(() => {
          textBox.innerText = "";
        }, 3000);
      }
    })
    .catch((error) => console.error("Error:", error));
});

document.getElementById("notifyButton").addEventListener("click", () => {
  fetch("http://localhost:5500/api/notifySubscribers", {
    method: "POST",
  })
    .then((response) => {
      if (response.status == 200) {
        textBox.innerText = "پیام ارسال گردید";
        setTimeout(() => {
          textBox.innerText = "";
        }, 3000);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
