import { useState, useEffect } from "react";
import "./register.css";
import { useLocation } from "react-router-dom";

let chatGPTResponse = "";
let geminiResponse = "";
let perplexityResponse = "";

const Home = () => {
  const location = useLocation();
  const username = location.state || "there";

  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [responses, setResponses] = useState({
    chatGPT: null,
    gemini: null,
    perplexity: null,
  });
  const [activeTab, setActiveTab] = useState("chatGPT");

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleNewConvo = () => {
    setResponses({ chatGPT: null, gemini: null, perplexity: null });
    setActiveTab("chatGPT");
    setMessage("Starting a new conversation!");
  };

  const handleSend = async (e) => {
    e.preventDefault();
    const trimmed = inputValue.trim();

    if (!trimmed) return;

    setLoading(true);
    setMessage("Fetching responses from all 3 AI models...");

    try {
      const response = await fetch("/home", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: trimmed }),
      });

      //console.log(response, " This is the response object via fetch");
      //console.log("Response status:", response.status);
      
      //this is the data collected from the backend (/home endpoint)
      const data = await response.json();
      //console.log(data, " This is the data object via await response.json()");
      
      chatGPTResponse = data.data.ChatGPT;
      geminiResponse = data.data.Gemini;
      perplexityResponse = data.data.Perplexity;

      //console.log(chatGPTResponse, " This is chatGPTResponse variable");
      //console.log(geminiResponse, " This is geminiResponse variable");
      //console.log(perplexityResponse, " This is perplexityResponse variable");

      if(response.ok) {
        setResponses(data.data);
        //console.log("Responses updated:", data.data);
        setMessage("✅ All responses received!");
        setInputValue("");
      } else {
        setMessage("❌ Error fetching responses. Try again.");
      }
    }

    catch (err) {
      console.error("Error:", err);
      setMessage("❌ Connection error. Make sure backend is running.");
    }
     finally {
      setLoading(false);
    }
  };

  const renderResponse = (aiName) => {

    if (loading) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Fetching response from {aiName}...</p>
          </div>
        </div>
      );
    }

    //console.log("Rendering response for AI: ", aiName);
    const response = responses[aiName];
    //console.log("All the responses: ", responses);
    //console.log("Current response for ", aiName, ": ", response);

    if (!responses[aiName]) {
      //console.log("Received response is ", response);
      return (
        <div className="flex items-center justify-center h-full">
          <p className="text-gray-400">No response yet. Ask a question!</p>
        </div>
      );
    }
    //console.log("Rendering response for ", aiName, ": ", response); 

    return (
      <div className="prose max-w-none text-gray-800 whitespace-pre-wrap response-scroll">
        {response}
      </div>
    );
  };

  return (
    <div className="bg-gray-50 flex flex-col relative min-h-screen font-sans">
      {/* Toast Notification */}
      <div
        className={`fixed top-5 right-5 z-50 p-4 bg-indigo-100 text-indigo-800 rounded-lg shadow-xl border border-indigo-300 transition-opacity duration-300 ${
          message ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex justify-between items-center">
          <p className="text-sm font-medium">{message}</p>
          <button
            onClick={() => setMessage(null)}
            className="ml-4 text-indigo-600 hover:text-indigo-800 font-bold text-lg leading-none"
          >
            &times;
          </button>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-white shadow-md p-4 flex justify-between items-center border-b border-gray-200">
        <h1 className="text-3xl font-bold text-purple-700">DotLay</h1>

        <div className="flex items-center space-x-4">
          <button
            onClick={handleNewConvo}
            className="px-3 py-1.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition duration-150 shadow-md"
          >
            New Convo
          </button>

          <div className="flex items-center space-x-2 p-1.5 rounded-full bg-gray-100 cursor-pointer hover:bg-gray-200 transition duration-150">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-500 text-white text-sm font-semibold">
              {username.charAt(0).toUpperCase()}
            </div>
            <span className="hidden sm:inline text-gray-800 text-sm font-medium pr-1">
              {username}
            </span>
          </div>
        </div>
      </header>

      {/* Main Section */}
      <main className="flex-grow flex flex-col p-8">
        <div className="text-center mb-6">
          <p className="text-3xl sm:text-4xl font-light text-gray-700 tracking-tight">
            Hello <span>{username}.</span>
          </p>
          <p className="mt-2 text-gray-500 text-lg">
            Ask a question and see responses from ChatGPT, Gemini, and Perplexity in parallel.
          </p>
        </div>

        {/* -------------------------------------------------------Tabs Navigation----------------------------------------------------------------*/}
        
        <div className="flex gap-2 mb-6 max-w-5xl mx-auto w-full border-b border-gray-300">
          {["chatGPT", "gemini", "perplexity"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-semibold transition duration-150 ${
                activeTab === tab
                  ? "text-indigo-600 border-b-2 border-indigo-600"
                  : "text-gray-600 hover:text-indigo-600"
              }`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Response Container */}
          <div className="response-container w-full max-w-5xl mx-auto bg-white p-6 rounded-xl shadow-inner border border-gray-100 mb-6 flex flex-col overflow-hidden">
            {renderResponse(activeTab)}
          </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-white border-t border-gray-200 p-4 sticky bottom-0">
        <div className="max-w-5xl mx-auto">
          <form onSubmit={handleSend} className="flex space-x-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Ask all 3 AIs a question..."
              disabled={loading}
              className="flex-grow p-4 border border-gray-300 text-gray-800 rounded-3xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 shadow-md outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || loading}
              className="p-4 h-full bg-indigo-600 text-white rounded-3xl shadow-lg hover:bg-indigo-700 transition duration-150 disabled:bg-indigo-300 disabled:cursor-not-allowed"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 transform rotate-90"
              >
                <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 00.149.736l3.32 1.328a1 1 0 00.74-.066L10 18l5.965 1.551a1 1 0 00.74.066l3.32-1.328a1 1 0 00.15-.736l-7-14z" />
              </svg>
            </button>
          </form>
        </div>
      </footer>
    </div>
  );
};

export default Home;