"use client";

import React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { ArrowUp, Paperclip, Square, X, StopCircle, Mic, Globe, BrainCog, FolderCode } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Robust CSS for the PromptInputBox to ensure it looks correct regardless of global Tailwind state.
 * Using Flexbox for the "sleek pill" layout.
 */
const customCSS = `
  .prompt-container {
    background-color: #fcfcfc;
    border: 1px solid #e5e7eb;
    border-radius: 24px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.06);
    transition: all 0.3s ease;
    width: 100%;
    color: #111827;
  }

  .prompt-container:focus-within {
    border-color: #d1d5db;
    box-shadow: 0 8px 30px rgba(0,0,0,0.08);
  }

  .prompt-textarea {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: #111827;
    font-size: 16px;
    resize: none;
    padding: 4px 0;
    min-height: 24px;
  }

  .prompt-textarea::placeholder {
    color: #9ca3af;
  }

  .prompt-actions-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    margin-top: 4px;
  }

  .prompt-left-actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .prompt-icon-btn {
    background: transparent;
    border: none;
    color: #6b7280;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    border-radius: 9999px;
    transition: all 0.2s;
  }

  .prompt-icon-btn:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: #374151;
  }

  .prompt-toggle-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 12px;
    font-weight: 500;
    transition: all 0.2s;
    border: 1px solid transparent;
    background: transparent;
    color: #6b7280;
    cursor: pointer;
  }

  .prompt-toggle-btn.active-search {
    background-color: rgba(30, 174, 219, 0.1);
    border-color: rgba(30, 174, 219, 0.3);
    color: #1EAEDB;
  }

  .prompt-toggle-btn.active-think {
    background-color: rgba(139, 92, 246, 0.1);
    border-color: rgba(139, 92, 246, 0.3);
    color: #8B5CF6;
  }

  .prompt-toggle-btn.active-canvas {
    background-color: rgba(249, 115, 22, 0.1);
    border-color: rgba(249, 115, 22, 0.3);
    color: #F97316;
  }

  .prompt-divider {
    width: 1px;
    height: 16px;
    background-color: #e5e7eb;
    margin: 0 4px;
  }

  .prompt-submit-btn {
    background-color: #000000;
    color: #ffffff;
    border: none;
    border-radius: 9999px;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
  }

  .prompt-submit-btn:hover {
    background-color: #374151;
    transform: scale(1.05);
  }

  .prompt-submit-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    background-color: #e5e7eb;
    color: #9ca3af;
  }

  .prompt-container.listening {
    border-color: #ef4444;
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.2);
    animation: pulse-red 2s infinite;
  }

  @keyframes pulse-red {
    0% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0.4); }
    70% { box-shadow: 0 0 0 10px rgba(239, 68, 68, 0); }
    100% { box-shadow: 0 0 0 0 rgba(239, 68, 68, 0); }
  }

  .prompt-submit-btn.prompt-recording-btn {
    background-color: #ef4444;
    color: #ffffff;
  }

  .hidden-file-input {
    display: none;
  }
`;

// Inject styles into document only on client side
if (typeof document !== "undefined") {
  const styleId = "prompt-box-styles";
  let styleSheet = document.getElementById(styleId) as HTMLStyleElement;
  if (!styleSheet) {
    styleSheet = document.createElement("style");
    styleSheet.id = styleId;
    document.head.appendChild(styleSheet);
  }
  styleSheet.innerText = customCSS;
}

// Tooltip Components
const TooltipProvider = TooltipPrimitive.Provider;
const Tooltip = TooltipPrimitive.Root;
const TooltipTrigger = TooltipPrimitive.Trigger;
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className="z-50 overflow-hidden rounded-md border border-gray-200 bg-white px-3 py-1.5 text-sm text-gray-900 shadow-md animate-in fade-in-0 zoom-in-95"
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;

// Dialog Components
const Dialog = DialogPrimitive.Root;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-[90vw] md:max-w-[800px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-gray-200 bg-white p-0 shadow-xl rounded-2xl"
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-full bg-gray-100/80 p-2 hover:bg-gray-200 transition-all">
        <X className="h-5 w-5 text-gray-600 hover:text-gray-900" />
      </DialogPrimitive.Close>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className="text-lg font-semibold leading-none tracking-tight text-gray-900"
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

// Main PromptInputBox Component
interface PromptInputBoxProps {
  onSend?: (message: string, files?: File[]) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export const PromptInputBox = React.forwardRef((props: PromptInputBoxProps, ref: React.Ref<HTMLDivElement>) => {
  const { onSend = () => {}, isLoading = false, placeholder = "Type your message here..." } = props;
  const [input, setInput] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [showSearch, setShowSearch] = React.useState(false);
  const [showThink, setShowThink] = React.useState(false);
  const [showCanvas, setShowCanvas] = React.useState(false);
  const [isListening, setIsListening] = React.useState(false);
  const uploadInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);
  const recognitionRef = React.useRef<any>(null);

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`;
    }
  }, [input]);

  // Initialize Speech Recognition
  React.useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = "en-US";

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsListening(false);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const handleVoiceInput = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      if (recognitionRef.current) {
        setIsListening(true);
        recognitionRef.current.start();
      } else {
        alert("Speech recognition is not supported in your browser.");
      }
    }
  };

  const handleToggleChange = (type: string) => {
    if (type === "search") {
      setShowSearch(!showSearch);
      setShowThink(false);
    } else if (type === "think") {
      setShowThink(!showThink);
      setShowSearch(false);
    }
  };

  const handleSubmit = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      return;
    }

    if (input.trim() || files.length > 0) {
      onSend(input, files);
      setInput("");
      setFiles([]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const hasContent = input.trim() !== "" || files.length > 0;

  return (
    <TooltipProvider>
      <div className={`prompt-container ${isListening ? "listening" : ""}`} ref={ref}>
        {/* Attachment Preview (Simplified) */}
        {files.length > 0 && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
            {files.map((f, i) => (
              <div key={i} style={{ position: "relative", backgroundColor: "#f3f4f6", padding: "4px 8px", borderRadius: "8px", fontSize: "12px", color: "#374151", border: "1px solid #e5e7eb" }}>
                {f.name}
                <button onClick={() => setFiles([])} style={{ background: "none", border: "none", color: "#6b7280", marginLeft: "4px", cursor: "pointer" }}>×</button>
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          className="prompt-textarea"
          placeholder={isListening ? "Listening..." : showSearch ? "Search the web..." : showThink ? "Think deeply..." : placeholder}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
          rows={1}
        />

        <div className="prompt-actions-row">
          <div className="prompt-left-actions">
            <Tooltip>
              <TooltipTrigger asChild>
                <button className="prompt-icon-btn" onClick={() => uploadInputRef.current?.click()}>
                  <Paperclip size={18} />
                </button>
              </TooltipTrigger>
              <TooltipContent>Attach file</TooltipContent>
            </Tooltip>
            <input
              type="file"
              ref={uploadInputRef}
              className="hidden-file-input"
              onChange={(e) => e.target.files && setFiles(Array.from(e.target.files))}
            />

            <button
              className={`prompt-toggle-btn ${showSearch ? "active-search" : ""}`}
              onClick={() => handleToggleChange("search")}
            >
              <Globe size={16} />
              {showSearch && <span>Search</span>}
            </button>

            <div className="prompt-divider" />

            <button
              className={`prompt-toggle-btn ${showThink ? "active-think" : ""}`}
              onClick={() => handleToggleChange("think")}
            >
              <BrainCog size={16} />
              {showThink && <span>Think</span>}
            </button>

            <div className="prompt-divider" />

            <button
              className={`prompt-toggle-btn ${showCanvas ? "active-canvas" : ""}`}
              onClick={() => setShowCanvas(!showCanvas)}
            >
              <FolderCode size={16} />
              {showCanvas && <span>Canvas</span>}
            </button>
          </div>

          <div className="prompt-right-actions">
            <Tooltip>
              <TooltipTrigger asChild>
                <div style={{ display: "inline-block" }}>
                  <button
                    className={`prompt-submit-btn ${isListening ? "prompt-recording-btn" : ""}`}
                    onClick={hasContent ? handleSubmit : handleVoiceInput}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div style={{ width: "16px", height: "16px", border: "2px solid #e5e7eb", borderTopColor: "#000", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
                    ) : isListening ? (
                      <StopCircle size={18} />
                    ) : hasContent ? (
                      <ArrowUp size={18} />
                    ) : (
                      <Mic size={18} />
                    )}
                  </button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                {isLoading ? "Thinking..." : isListening ? "Stop listening" : hasContent ? "Send message" : "Voice input"}
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});

PromptInputBox.displayName = "PromptInputBox";
