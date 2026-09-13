import { useState } from "react";
import "./App.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000";


function App() {

  const [code, setCode] = useState(
`def add(a, b)
    return a + b`
  );

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const reviewCode = async () => {

    if (!code.trim()) {
      setError("Please enter some Python code.");
      return;
    }

    setLoading(true);
    setResult(null);
    setError("");

    try {

      const response = await fetch(
        `${API_URL}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            code: code
          })
        }
      );

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();

      setResult(data);

    } catch (err) {

      setError(
        "Unable to connect to the backend. Make sure FastAPI is running."
      );

    } finally {

      setLoading(false);

    }
  };


  const clearCode = () => {

    setCode("");
    setResult(null);
    setError("");

  };


  return (
    <div className="app">

      {/* Header */}

      <header className="header">

        <div className="brand">

          <img
            src="/logo.jpeg"
            alt="VPro Skills"
            className="logo"
          />

          <div className="brand-text">

            <h1>AI Code Review Team</h1>

            <span>
              Multi-Agent Coding Assistant
            </span>

          </div>

        </div>

        <div className="tech-badges">

          <span>LLM</span>
          <span>LangGraph</span>
          <span>MCP</span>

        </div>

      </header>


      {/* Main */}

      <main className="main">

        <section className="hero">

          <div>

            <span className="eyebrow">
              VPRO SKILLS • AI LAB
            </span>

            <h2>
              Learn Coding with
              <strong> AI Agents</strong>
            </h2>

            <p>
              Submit your Python code and let our AI
              review it and explain the improvements
              in simple student-friendly language.
            </p>

          </div>

        </section>


        <section className="workspace">

          {/* Code Editor */}

          <div className="panel code-panel">

            <div className="panel-header">

              <div>

                <span className="panel-icon">
                  {"</>"}
                </span>

                <div>

                  <h3>Your Python Code</h3>

                  <p>
                    Write or paste your code below
                  </p>

                </div>

              </div>

              <span className="language">
                Python
              </span>

            </div>


            <div className="editor">

              <div className="editor-top">

                <div className="dots">

                  <span></span>
                  <span></span>
                  <span></span>

                </div>

                <span>
                  main.py
                </span>

              </div>

              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck="false"
                placeholder="Enter your Python code here..."
              />

            </div>


            <div className="actions">

              <button
                className="review-button"
                onClick={reviewCode}
                disabled={loading}
              >

                {loading ? (
                  <>
                    <span className="spinner"></span>
                    AI Agents Working...
                  </>
                ) : (
                  <>
                    ✨ Review My Code
                  </>
                )}

              </button>


              <button
                className="clear-button"
                onClick={clearCode}
              >
                Clear
              </button>

            </div>


            {error && (
              <div className="error-box">
                ⚠️ {error}
              </div>
            )}

          </div>


          {/* Result */}

          <div className="panel result-panel">

            <div className="panel-header">

              <div>

                <span className="panel-icon result-icon">
                  AI
                </span>

                <div>

                  <h3>AI Review</h3>

                  <p>
                    What our agents found
                  </p>

                </div>

              </div>

              {result && (
                <span className="status">
                  ✓ Completed
                </span>
              )}

            </div>


            {!result && !loading && (

              <div className="empty-state">

                <div className="empty-icon">
                  ✨
                </div>

                <h3>
                  Ready to review your code
                </h3>

                <p>
                  Enter your Python code and click
                  <strong> Review My Code</strong>.
                </p>

                <div className="flow-preview">

                  <div>

                    <span>1</span>
                    Reviewer Agent

                  </div>

                  <div className="arrow">
                    →
                  </div>

                  <div>

                    <span>2</span>
                    MCP Tool

                  </div>

                  <div className="arrow">
                    →
                  </div>

                  <div>

                    <span>3</span>
                    Teacher Agent

                  </div>

                </div>

              </div>

            )}


            {loading && (

              <div className="loading-state">

                <div className="loader-ring"></div>

                <h3>
                  AI Agents are reviewing...
                </h3>

                <p>
                  Reviewer Agent → MCP Tool → Teacher Agent
                </p>

              </div>

            )}


            {result && !loading && (

              <div className="results">

                <div className="agent-card reviewer-card">

                  <div className="agent-title">

                    <div className="agent-avatar">
                      🔍
                    </div>

                    <div>

                      <h4>
                        Code Reviewer Agent
                      </h4>

                      <span>
                        Analyzing your code
                      </span>

                    </div>

                  </div>

                  <div className="answer">
                    {result.review}
                  </div>

                </div>


                <div className="connector">

                  <span>
                    Agent Handoff
                  </span>

                  ↓

                </div>


                <div className="agent-card teacher-card">

                  <div className="agent-title">

                    <div className="agent-avatar">
                      👨‍🏫
                    </div>

                    <div>

                      <h4>
                        Code Teacher Agent
                      </h4>

                      <span>
                        Explaining for students
                      </span>

                    </div>

                  </div>

                  <div className="answer">
                    {result.answer}
                  </div>

                </div>

              </div>

            )}

          </div>

        </section>


        {/* Architecture */}

        <section className="architecture">

          <div className="section-title">

            <span>
              UNDER THE HOOD
            </span>

            <h2>
              How Your AI Team Works
            </h2>

          </div>


          <div className="architecture-flow">

            <div className="architecture-step">

              <div className="step-number">
                1
              </div>

              <h3>
                Student
              </h3>

              <p>
                Submits Python code
              </p>

            </div>


            <div className="flow-arrow">
              →
            </div>


            <div className="architecture-step">

              <div className="step-number">
                2
              </div>

              <h3>
                Reviewer Agent
              </h3>

              <p>
                Reviews the code
              </p>

            </div>


            <div className="flow-arrow">
              →
            </div>


            <div className="architecture-step">

              <div className="step-number">
                3
              </div>

              <h3>
                MCP Tool
              </h3>

              <p>
                Analyzes Python code
              </p>

            </div>


            <div className="flow-arrow">
              →
            </div>


            <div className="architecture-step">

              <div className="step-number">
                4
              </div>

              <h3>
                Teacher Agent
              </h3>

              <p>
                Explains the solution
              </p>

            </div>

          </div>

        </section>

      </main>


      {/* Footer */}

      <footer className="footer">

        <div>

          <strong>
            VPro Skills EduTech
          </strong>

          <span>
            {" • "}
          </span>

          AI & Modern Technology Training

        </div>

        <div>

          LLM • LangGraph • MCP

        </div>

      </footer>

    </div>
  );
}


export default App;