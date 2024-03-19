const inputText = document.getElementById("inputText");
const submitBtn = document.getElementById("submitBtn");
const intentResponse = document.getElementById("intentResponse");
const sentimentResponse = document.getElementById("sentimentResponse");
const emojiContainer = document.getElementById("emojiContainer");
const responseModal = new bootstrap.Modal(
  document.getElementById("responseModal")
);


// const apiUrl = "https://a813-34-145-224-124.ngrok-free.app"; 
const apiUrl = "https://rohanshaw-moodmeterv1.hf.space"; 

submitBtn.addEventListener("click", async () => {
  const text = inputText.value.trim();
  if (text) {
    try {
      const preloader = document.getElementById("preloader");
      const preloaderMessage = document.getElementById("preloaderMessage");
      preloader.style.display = "flex";
      preloaderMessage.textContent = "Fetching Intent...";

      const intentRes = await fetchIntent(text);

      preloaderMessage.textContent = "Fetching Sentiment...";
      const sentimentRes = await fetchSentiment(text);

      displayResponse(intentRes, sentimentRes);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      document.getElementById("preloader").style.display = "none";
      document.getElementById("preloaderMessage").textContent = "";
    }
  }
});

async function fetchIntent(text) {
  const response = await fetch(`${apiUrl}/api/intent/?text=${text}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (response.ok) {
    return response.text();
  } else {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
}

async function fetchSentiment(text) {
  const response = await fetch(`${apiUrl}/api/sentiment/?text=${text}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // body: JSON.stringify({ text }),
  });

  if (response.ok) {
    return response.text();
  } else {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
}

function extractTextBetweenSquareBrackets(text) {
  const regex = /\[([^\]]+)\]/;
  const match = regex.exec(text);
  
  if (match) {
      return match[1]; 
  } else {
      return "";
  }
  }

  function displayResponse(intentRes, sentimentRes) {
    intentResponse.textContent = extractTextBetweenSquareBrackets(intentRes);
    sentimentResponse.textContent = extractTextBetweenSquareBrackets(sentimentRes);
  
    const sentiment = sentimentRes.toLowerCase();
    let emoji = "";
  
    if (sentiment.includes("positive")) {
      emoji = "🙂";
    } else if (sentiment.includes("negative")) {
      emoji = "☹️";
    } else {
      emoji = "😐";
    }
  
    emojiContainer.textContent = emoji;
    responseModal.show();
  
    document.getElementById("preloader").style.display = "none";
  }

