

# 🚀 Airbnb-Pro: Full-Stack Marketplace 3.0

<p align="center">
  <img src="https://capsule-render.vercel.app/render?type=soft&color=ff385c&height=200&section=header&text=Airbnb%20Clone%202.0&fontSize=70&animation=fadeIn&fontAlignY=38" alt="Header"/>
</p>

<p align="center">
  <a href="https://nodejs.org/"><img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="NodeJS"></a>
  <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind"></a>
</p>

---

## 📽️ Live Project Demo
<div align="center">
  <div style="position: relative; padding: 10px; border-radius: 20px; background: linear-gradient(45deg, #FF385C, #bd1e59); max-width: 850px;">
    <div style="border-radius: 15px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.3);">
      <video src="PASTE_YOUR_VIDEO_URL_HERE" 
             muted 
             autoplay 
             loop 
             style="width: 100%; display: block;">
      </video>
    </div>
  </div>
  <p align="center">
    <i><b>Auto-playing Preview:</b> Featuring Secure Auth, MongoDB Sessions, and Tailwind UI.</i>
  </p>
</div>

---

## 🌟 Project Overview
This is a high-performance **Airbnb Clone** built using the **MEN Stack** (MongoDB, Express, Node.js). Unlike standard clones, this version focuses heavily on **server-side data integrity** and **persistent user states**.

> **The Difference:** We utilize `connect-mongo` to store session data. This means if the server restarts or the user refreshes, they remain logged in. Data is never lost, and the experience is seamless.

---

## ✨ Key Features

* **⚡ Real-time Session Persistence:** User login states are stored in **MongoDB**, not just local memory.
* **🛡️ Advanced Validation:** Powered by `express-validator`, ensuring every listing and user entry is sanitized and secure.
* **🎨 Designer UI:** A pixel-perfect frontend built with **EJS** and **Tailwind CSS** for a modern, responsive feel.
* **🔐 Robust Authentication:** Full Signup/Login/Logout flow with hashed password security.
* **📂 Full CRUD Operations:** Create, Read, Update, and Delete listings with real-time database updates via **Mongoose**.

---

## 🛠 Tech Stack

| Component | Technology Used |
| :--- | :--- |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Atlas) |
| **ODM** | Mongoose |
| **Frontend** | EJS, Tailwind CSS |
| **Validation** | Express-Validator |
| **Session Mgmt** | Express-Session + Connect-Mongo |

---

## 🚀 Installation & Setup

Follow these steps to get the project running locally:

1. **Clone the repository**
   ```bash
   git clone [https://github.com/cherryyob/Airbnb-Clone-FullStack-Node-MongoDB.git](https://github.com/cherryyob/Airbnb-Clone-FullStack-Node-MongoDB.git)
