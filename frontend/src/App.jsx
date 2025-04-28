import { useState, useEffect } from "react";
import "prismjs/themes/prism-tomorrow.css";
import Editor from "react-simple-code-editor";
import prism from "prismjs";
import Markdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";
import axios from "axios";
import "./App.css";

function App() {
  const [code, setCode] = useState(`function sum(a, b) {
  // Add two numbers
  return a + b;
}`);
  const [review, setReview] = useState(`# Code Review\n\nYour review will appear here...`);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    prism.highlightAll();
  }, []);

  async function reviewCode() {
    if (!code.trim()) return;

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/ai/get-review", { code });
      setReview(response.data.response || "No review generated.");
    } catch (error) {
      console.error("Error reviewing code:", error);
      setReview("## Error\n\nFailed to get code review. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Code Review Assistant</h1>
        <p>Get AI-powered feedback on your code</p>
      </header>

      <main className="app-main">
        <section className="editor-section">
          <div className="editor-container">
            <div className="editor-header">
              <h2>Code Editor</h2>
              <button
                onClick={reviewCode}
                className={`review-button ${isLoading ? "loading" : ""}`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  "Get Review"
                )}
              </button>
            </div>
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(code) => prism.highlight(code, prism.languages.javascript, "javascript")}
              padding={16}
              style={{
                fontFamily: '"Fira Code", "Fira Mono", monospace',
                fontSize: 14,
                backgroundColor: "#1e1e1e",
                borderRadius: "8px",
                height: "calc(100% - 50px)",
                minHeight: "300px",
              }}
            />
          </div>
        </section>

        <section className="review-section">
          <div className="review-container">
            <div className="review-header">
              <h2>Code Review</h2>
              <div className="review-status">
                {isLoading ? "Generating review..." : "Review ready"}
              </div>
            </div>
            <div className="markdown-content">
              <Markdown rehypePlugins={[rehypeHighlight]}>{review}</Markdown>
            </div>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <p>Made with ❤️ for developers</p>
      </footer>
    </div>
  );
}

export default App;
