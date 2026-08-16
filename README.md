<p align="center">
  <img src="https://i.imgur.com/BQeIeaq.jpeg" https="400">
</p>

<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>MUKUL GOAT BOT</title>
</head>

<body>

  <p align="center">
    <video
      width="400"
      autoplay
      muted
      loop
      playsinline
      controls>
      <source
        src="https://i.imgur.com/tdxWoBB.mp4"
        type="video/mp4">
      Your browser does not support video.
    </video>
  </p>

</body>
</html>
  
👑 SIFAT GOT_BOT 👑

## Steps to Run the Bot

**Start Command**  
   Navigate to the folder where your bot files are located:
   ```bash
   node index.js
```
## 🔥 Features  

**• Auto Chat**  
Enjoy automatic and seamless conversations through natural language processing.  

**• Photo Editing**  
Edit professional quality photos using our advanced commands, no additional apps needed.  

**• Image Generation**  
Create unique images using our cutting-edge text-to-image technology.  

**• Video Downloader**  
Download HD videos from YouTube, Facebook, TikTok and other platforms.  

**• Interactive Games**  
Play 20+ fun games directly in messenger, no installation hassle!  

**• Fun Commands**  
Surprise your friends with hundreds of fun commands!  
___

## 🚀 Deployments

| **Status** | **Action** |
|-----------|------------|
| ![Replit](https://img.shields.io/badge/Replit-F26D00?style=for-the-badge&logo=replit&logoColor=white) | [![Deploy](https://img.shields.io/badge/DEPLOY-CLICK%20HERE-blue?style=for-the-badge)](https://replit.com) |
| ![Render](https://img.shields.io/badge/Render-3FE0C5?style=for-the-badge&logo=render&logoColor=black) | [![Deploy](https://img.shields.io/badge/DEPLOY-CLICK%20HERE-blue?style=for-the-badge)](https://render.com) |
| ![Railway](https://img.shields.io/badge/Railway-0B0D0E?style=for-the-badge&logo=railway&logoColor=white) | [![Deploy](https://img.shields.io/badge/DEPLOY-CLICK%20HERE-blue?style=for-the-badge)](https://railway.app) |
---


## 🔶 Render
Login to Render
Create New Web Service
Connect GitHub repository
## Build Command:
```bash
npm install
```
*Start Command*:
```bash
node index.js
```


## 👨‍💻 ABOUT THE DEVELOPER

**Name:** `SIFAT_Bby`  
**Profession:** `STUDENT & CHATBOT DEVELOPER`  
**Location:** `Sakhipur, Tangail`

## 📝 **Note**
- This is a messenger chat bot using a personal account, using an [unofficial api](https://github.com/ntkhang03/fb-chat-api/blob/master/DOCS.md) ([Origin here](https://github.com/Schmavery/facebook-chat-api)) and this may lead to facebook account being locked due to spam or other reasons. 
- So, I recommend using a clone account (one that you're willing to throw away at any time)
- ***I am not responsible for any problems that may arise from using this bot.***

## 🚧 **Requirement**
- Node.js 16.x [Download](https://nodejs.org/dist/v16.20.0) | [Home](https://nodejs.org/en/download/) | [Other versions](https://nodejs.org/en/download/releases/)
- Knowledge of **programming**, javascript, nodejs, unofficial facebook api



## 💡 **How it works?**
- The bot uses the unofficial facebook api to send and receive messages from the user.
- When having a `new event` (message, reaction, new user join, user leave chat box,...) the bot will emit an event to the `handlerEvents`.
- The `handlerEvents` will handle the event and execute the command:
  - `onStart`:
    - the handler will check if user `call a command or not`.
    - if yes, it will check if `user banned` or mode `admin box only is turned on` or not, if not, it will execute the command.
    - next, it will check the `permission` of the user.
    - next, it will check if the `countdown` of command is over or not.
    - finally, it will execute the command and `log` information to the console.

  - `onChat`:
    - the handler will run `when the user sends a message`.
    - it will check `permission` of the user.
    - the handler will `execute` the command, if it return a `function` or `async function` then it willl check `user banned` or mode `admin box only is turned on` or not, if not, it will call the function and `log` information to the console.

  - `onFirstChat`:
    - the handler will run `when get the first message` from the chat box since the bot started.
    - the way it works is like `onChat`.

  - `onReaction`:
    - the handler will run when the user `reacts` to a `message has messageID` is set in `GoatBot.onReaction` as follows:
		```javascript
		// example:	
		global.GoatBot.onReaction.set(msg.messageID, {
			messageID: msg.messageID,
			commandName,
			// ... and more
		});
		```
    - the handler will automatically add method `delete`, if this method is called, it will delete the message from the set.
    - next, it will check `permission` of the user and `execute` if the user has permission and `log` information to the console.

  - `onReply`:
    - the handler will run when the user `replies` to a `message has messageID` is set in `GoatBot.onReply` as follows:
		```javascript
		// example:
		global.GoatBot.onReply.set(msg.messageID, {
			messageID: msg.messageID,
			commandName,
			// ... and more
		});
		```
    - the handler will automatically add method `delete`, if this method is called, it will delete the message from the set.
    - next, it will check `permission` of the user and `execute` if the user has permission and `log` information to the console.  

  - `onEvent`:
    - the handler will run `when the user has a new event` type `event` (new user join, user leave chat box, change admin box,...)
		```javascript
		// example:
		global.GoatBot.onEvent.set(msg.messageID, {
			messageID: msg.messageID,
			commandName,
			// ... and more
		});
		```
		- it will loop through all `onEvent` and get the command determined by the key `commandName` and execute the `onEvent` in that command.
		- if it return a `function` or `async function` then it will call the function and `log` information to the console.

  - `handlerEvent`:
    - the handler will run `when the user has a new event` type `event` (new user join, user leave chat box, change admin box,...)
    - it will get all the eventCommand set in `GoatBot.eventCommands` (scripts placed in the `scripts/events` folder)
    - it will loop through all `eventCommands` and run the `onStart` in that command.
    - if it return a `function` or `async function` then it will call the function and `log` information to the console.


## 📚 **Support Languages in source code**
- Currently, the bot supports 2 languages:
- [x] `en: English`
- [x] `vi: Vietnamese`

- Change language in `config.json` file
- You can customize the language in the folder `languages/`, `languages/cmds/` and `languages/events/`



## ✨ **Copyright (C)**
<p align="center">
 <a href="https://github.com/ntkhang03"><img src="https://img.icons8.com/fluency/48/000000/github.png" alt="NTKhang"></a>
   <a href="https://github.com/mostakim-sagor"><img src="https://img.icons8.com/fluency/48/000000/github.png" alt="MOSTAKIM"></a>


## ✨🌟 𝐒𝐩𝐞𝐜𝐢𝐚𝐥 𝐓𝐡𝐚𝐧𝐤𝐬🌟✨

- 🚀 **NTKhang** 
- 🚀 **Neoaz ゐ**



## 📜 **License**

- ***If you violate any rules, you will be banned from using my project***
- Don't sell my source code
- Don't claim my source code as your own
- Do not monetize my source code (such as: buy and sell commands, buy and sell bots, call for donations, etc.)
- Don't remove/edit my credits (author name) in my source code

💖 **Thank You For Choosing • 
👑 SIFAT  𝐆𝐎𝐀𝐓 𝐁𝐎𝐓 𝐕𝟐👑!**  
🗓️ *Release Date:* `05/01/2026 at 12:00`  
⭐ **Please don't forget to give a star after forking! It really helps!**
