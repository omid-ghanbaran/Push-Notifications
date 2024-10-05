// npx web-push generate-vapid-keys

const urlBase64ToUint8Array = (base64String) => {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }

  return outputArray;
};
const getPublicVapidKey = async () => {
  try {
    const response = await fetch("http://localhost:3000/vapid-public-key");
    const data = await response.json();
    return data.publicKey;
  } catch (error) {
    console.error("Error fetching public VAPID key:", error);
    throw new Error("Failed to fetch public VAPID key");
  }
};

const saveSubscription = async (subscription) => {
  try {
    const response = await fetch(
      "http://87.107.52.133:8081/webPush/saveWebPush",
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify(subscription),
      }
    );
    console.log(await response.json());
  } catch (error) {
    throw new Error("Failed to save subscription");
  }
};

self.addEventListener("activate", async () => {
  try {
    // const publicVapidKey = await getPublicVapidKey();
    const publicVapidKey =
      "BIUS5PfHIeddGTuSRV0lNKb_vONCeF4y27mavyx_2fEMoCHfx_Zj2cGDNbR8Ra90LpCCmy4WWXwv61CXy5LMGwU";
    const subscription = await self.registration.pushManager.subscribe({
      userVisibleOnly: true,
      // applicationServerKey: publicVapidKey,
      applicationServerKey: urlBase64ToUint8Array(publicVapidKey),
    });
    const request = await saveSubscription(subscription);
  } catch (error) {
    console.error("Error during activation:", error);
  }
});

self.addEventListener("push", (e) => {
  const data = e.data.json();
  const options = {
    body: data.body,
    icon: data.icon,
    image: data.image,
    actions: data.actions,
    data: {
      url: data.url,
    },
  };

  e.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  if (event.action === "close") {
    event.notification.close();
  }

  const url = event.notification.data.url;

  if (event.action === "open_url") {
    event.waitUntil(clients.openWindow(url));
  }
});
