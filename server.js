const express = require("express");
const webPush = require("web-push");
const cors = require("cors");
const app = express();
const port = 5500;
let notificationData = {};
const vapidKeys = {
  publicKey:
    "BIUS5PfHIeddGTuSRV0lNKb_vONCeF4y27mavyx_2fEMoCHfx_Zj2cGDNbR8Ra90LpCCmy4WWXwv61CXy5LMGwU",
  privateKey: "NadMYX4grhPUm9C9KFXXNQ5BLCjzz3S6rBgYQ70Xnng",
};


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.listen(port);

webPush.setVapidDetails(
  "mailto:omid.ghanbaran@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey
);


app.post("/api/getMessage", (req, res) => {
  notificationData = req.body;
  res.send("پیام ثبت گردید");
});

app.post("/api/notifySubscribers", async (req, res) => {
  try {
    await notifyAllSubscribers();
    res.send("پیام ارسال گردید");
  } catch (error) {
    res.status(500).send("خطا در ارسال پیام");
  }
});


const sendNotif = (subscription, dataToSend) => {
  return webPush
    .sendNotification(subscription, dataToSend)
    .then((response) => console.log("Notification sent successfully."))
    .catch((error) => console.error("Error sending notification:", error));
};

const getAllSubscriptions = async () => {
  const response = await fetch(
    "http://87.107.52.133:8081/webPush/getAllWebPush"
  );
  const data = await response.json();
  return data.data;
};

const notifyAllSubscribers = async () => {
  try {
    const subscriptions = await getAllSubscriptions();
    const payload = JSON.stringify({
      title: notificationData.title || "NEWSHANIK",
      body: notificationData.text || "NEWSHANIK",
      icon:
        notificationData.icon ||
        "https://newshanik.ir/newSite/template/img/newshanik-logo.png",
      image:
        notificationData.image ||
        "https://cdn.newshanik.ir/videos/ourProduct/ourProduct-03.jpg",
      url: notificationData.url || "https://newshanik.ir/productlist/27",
      actions: notificationData.actions || [
        {
          action: "open_url",
          title: "مشاهده",
          // icon: "https://cdn.newshanik.ir//videos/HRM/icon_eye-1.gif",
        },
        {
          action: "close",
          title: "بستن",
          // icon: "https://newshanik.ir/newSite/template/img/newshanik-logo.png",
        },
      ],
    });
    subscriptions.forEach((subscription) => {
      sendNotif(subscription, payload);
    });
  } catch (error) {
    console.error("Error In Send Notification:", error);
  }
};
