const checkPermission = () => {
  if (!("serviceWorker" in navigator)) {
    throw new Error("No support for Service Worker");
  }
  if (!("Notification" in window)) {
    throw new Error("No support for Notification API");
  }
};

const registerSW = async () => {
  try {
    const registration = await navigator.serviceWorker.register("./sw.js");
    return registration;
  } catch (error) {
    throw new Error("Service Worker registration failed");
  }
};

const requestNotificationPermission = async () => {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission not granted");
    }
  } catch (error) {
    throw new Error("Error requesting notification permission");
  }
};

const main = async () => {
  try {
    checkPermission();
    await requestNotificationPermission();
    await registerSW();
  } catch (error) {
    alert(error);
  }
};

document.getElementById("myForm").addEventListener("submit", function (event) {
  event.preventDefault();
  const formData = new FormData(this);
  const formValues = Object.fromEntries(formData.entries());
  fetch("http://localhost:5501/api/getMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formValues),
  })
    .then((response) => response.text())
    .catch((error) => console.error("Error:", error));
});

document.getElementById("notifyButton").addEventListener("click", () => {
  fetch("http://localhost:5501/api/notifySubscribers", {
    method: "POST",
  })
    .then((response) => response.text())
    .then((data) => {
      alert("پیام با موفقیت ارسال شد");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});
