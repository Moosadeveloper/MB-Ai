const sendButton = document.getElementById("sendButton");
const chatInput = document.getElementById('chatInput');
const chatbox = document.getElementById('chatbox');

// یوزر یا اسسٹنٹ کے ٹیکسٹ میسجز ڈسپلے کرنے کا فنکشن
async function displayMessage(message, isUser) {
    const msgElem = document.createElement('div');  // نیا <div> عنصر بنائیں
    msgElem.textContent = message;                    // میسج کا ٹیکسٹ سیٹ کریں

    // اگر میسج یوزر کا ہے یا اسسٹنٹ کا، اس کے مطابق CSS کلاس لگائیں
    if (isUser) {
        msgElem.className = "chat-message user-message";      // یوزر کا میسج
    } else {
        msgElem.className = "chat-message assistant-message"; // اسسٹنٹ کا میسج
    }

    chatbox.appendChild(msgElem);                     // میسج کو چیٹ باکس میں شامل کریں
    chatbox.scrollTop = chatbox.scrollHeight;         // نیچے اسکرول کریں تاکہ نیا میسج دکھائی دے

    // اگر میسج اسسٹنٹ کا ہے تو تھوڑی تاخیر کے بعد دکھائیں (fade-in effect)
    if (!isUser) {
        msgElem.style.opacity = 0;
        await new Promise(resolve => setTimeout(resolve, 300));
        msgElem.style.opacity = 1;
    }
}

// تصویر ڈسپلے کرنے کا فنکشن
async function displayImage(imageUrl) {
    const imgElem = document.createElement('img');      // ایک <img> عنصر بنائیں
    imgElem.src = imageUrl;                               // src attribute کو API سے حاصل شدہ URL پر سیٹ کریں
    imgElem.alt = "Generated Image";                      // alt ٹیکسٹ سیٹ کریں
    imgElem.className = "chat-message assistant-image";   // اپنی مرضی کی CSS کلاس (آپ اپنی CSS میں اس کو اسٹائل کر سکتے ہیں)

    chatbox.appendChild(imgElem);                         // تصویر کو چیٹ باکس میں شامل کریں
    chatbox.scrollTop = chatbox.scrollHeight;             // چیٹ باکس کو نیچے اسکرول کریں

    // Optional: تصویر پر fade-in effect لگانے کے لیے
    imgElem.style.opacity = 0;
    await new Promise(resolve => setTimeout(resolve, 300));
    imgElem.style.opacity = 1;
}

// API کال کرنے کا فنکشن
async function callApi(apiUrl, prompt) {
    // یوزر انٹرفیس کو "Typing..." اور disable کر دیں تاکہ یوزر دوبارہ پیغام نہ بھیجے
    chatInput.value = "Typing...";
    chatInput.disabled = true;
    sendButton.disabled = true;

    const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt })
    });

    // API کال کے بعد انٹرفیس کو دوبارہ فعال کر دیں
    chatInput.value = "";
    chatInput.disabled = false;
    sendButton.disabled = false;
    chatInput.focus();

    return response.json(); // API کا JSON response واپس کریں
}

chatInput.focus();

// "Send" بٹن پر کلک کرنے کا event listener
sendButton.addEventListener('click', async () => {
    const message = chatInput.value.trim();
    if (!message) return;

    // یوزر کا میسج چیٹ باکس میں دکھائیں
    displayMessage(message, true);
    chatInput.value = '';

    // اگر میسج "/image" سے شروع ہو رہا ہے، تو image-generation API استعمال ہوگی؛ ورنہ چیٹ API
    const apiUrl = message.startsWith('/image') ?
        'https://backend.buildpicoapps.com/aero/run/image-generation-api?pk=v1-Z0FBQUFBQm5HUEtMSjJkakVjcF9IQ0M0VFhRQ0FmSnNDSHNYTlJSblE0UXo1Q3RBcjFPcl9YYy1OZUhteDZWekxHdWRLM1M1alNZTkJMWEhNOWd4S1NPSDBTWC12M0U2UGc9PQ==' :
        'https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm5HUEtMSjJkakVjcF9IQ0M0VFhRQ0FmSnNDSHNYTlJSblE0UXo1Q3RBcjFPcl9YYy1OZUhteDZWekxHdWRLM1M1alNZTkJMWEhNOWd4S1NPSDBTWC12M0U2UGc9PQ==';

    try {
        // API کال کریں اور response حاصل کریں
        const data = await callApi(apiUrl, message);
        if (data.status === 'success') {
            // اگر یوزر کا میسج "/image" سے شروع ہوتا ہے تو تصویر کو display کریں
            if (message.startsWith('/image')) {
                // فرض کریں API response میں image URL data.imageUrl property میں ہے
                displayImage(data.imageUrl);
            } else {
                // ورنہ صرف ٹیکسٹ میسج ڈسپلے کریں
                displayMessage(data.text, false);
            }
        } else {
            displayMessage('An error occurred. Please try again.', false);
        }
    } catch (error) {
        console.error('Error:', error);
        displayMessage('An error occurred. Please try again.', false);
    }
});
chatInput.addEventListener('keydown', async (event) => {
  if (event.key === 'Enter' && !event.shiftKey) {  // Shift + Enter نئی لائن ڈالے گا، صرف Enter پیغام بھیجے گا
      event.preventDefault();  // Enter بٹن کے ڈیفالٹ بیہیویئر کو روکے گا
      sendButton.click();  // "Send" بٹن کو کلک کرنے کی طرح ایکشن لے گا
  }
});


const toggleButton = document.getElementById("toggle-btn");
const sidebar = document.getElementById("sidebar");
const logo = document.getElementById("logo");
const profile = document.getElementById("profile");
const txtr = document.getElementById("remove-1");
const txtr1 = document.getElementById("remove-2");
const txtr2 = document.getElementById("remove-3");
const txtr3 = document.getElementById("remove-4");
const txtr4 = document.getElementById("remove-5");
const txtr5 = document.getElementById("remove-6");
const txtr6 = document.getElementById("remove-7");

function toggleSidebar() {
  sidebar.classList.toggle("close");
  toggleButton.classList.toggle("rotate");

  closeAllSubMenus();

  // اگر سائیڈبار بند ہو تو لوگو اور پروفائل چھپائیں
  if (sidebar.classList.contains("close")) {
    logo.style.display = "none";
    profile.style.display = "none";
    txtr.style.display = "none";
    txtr1.style.display = "none";
    txtr2.style.display = "none";
    txtr3.style.display = "none";
    txtr4.style.display = "none";
    txtr5.style.display = "none";
    txtr6.style.display = "none";
    
  } else {
    logo.style.display = "block";
    profile.style.display = "block";
    txtr.style.display = "block";
    txtr1.style.display = "block";
    txtr2.style.display = "block";
    txtr3.style.display = "block";
    txtr4.style.display = "block";
    txtr5.style.display = "block";
    txtr6.style.display = "block";
  }
}
function toggleSubMenu(button) {
  if (!button.nextElementSibling.classList.contains("show")) {
    closeAllSubMenus();
  }

  button.nextElementSibling.classList.toggle("show");
  button.classList.toggle("rotate");

  if (sidebar.classList.contains("close")) {
    sidebar.classList.toggle("close");
    toggleButton.classList.toggle("rotate");
  }
}

function closeAllSubMenus() {
  Array.from(sidebar.getElementsByClassName("show")).forEach((ul) => {
    ul.classList.remove("show");
    ul.previousElementSibling.classList.remove("rotate");
  });
}


// document.addEventListener("contextmenu", (event) => event.preventDefault()); // Right-click Block  

// document.addEventListener("keydown", (event) => {  
//     if (event.ctrlKey && (event.key === "u" || event.key === "U")) {  
//         event.preventDefault();  // CTRL + U Block (View Source)  
//     }  
//     if (event.ctrlKey && event.shiftKey && (event.key === "i" || event.key === "I")) {  
//         event.preventDefault();  // CTRL + SHIFT + I Block (Inspect Element)  
//     }  
//     if (event.ctrlKey && event.shiftKey && (event.key === "c" || event.key === "C")) {  
//         event.preventDefault();  // CTRL + SHIFT + C Block (Element Selector)  
//     }  
//     if (event.ctrlKey && event.shiftKey && (event.key === "j" || event.key === "J")) {  
//         event.preventDefault();  // CTRL + SHIFT + J Block (Console)  
//     }  
//     if (event.key === "F12") {  
//         event.preventDefault();  // F12 Block (DevTools)  
//     }  
// });

// setInterval(() => {
//     if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
//         document.body.innerHTML = "<h1>Access Denied</h1>";  
//         setTimeout(() => { window.close(); }, 1000); // Tab بند کر دے گا  
//     }
// }, 1000);
