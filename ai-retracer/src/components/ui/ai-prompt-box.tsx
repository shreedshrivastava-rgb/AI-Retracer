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
    background-color: #1F2023;
    border: 1px solid #444444;
    border-radius: 24px;
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    box-shadow: 0 8px 30px rgba(0,0,0,0.24);
    transition: all 0.3s ease;
    width: 100%;
    color: #ffffff;
  }

  .prompt-container:focus-within {
    border-color: #666666;
  }

  .prompt-textarea {
    width: 100%;
    background: transparent;
    border: none;
    outline: none;
    color: #f3f4f6;
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
    color: #9ca3af;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px;
    border-radius: 9999px;
    transition: all 0.2s;
  }

  .prompt-icon-btn:hover {
    background-color: rgba(255, 255, 255, 0.05);
    color: #d1d5db;
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
    color: #9ca3af;
    cursor: pointer;
  }

  .prompt-toggle-btn.active-search {
    background-color: rgba(30, 174, 219, 0.15);
    border-color: #1EAEDB;
    color: #1EAEDB;
  }

  .prompt-toggle-btn.active-think {
    background-color: rgba(139, 92, 246, 0.15);
    border-color: #8B5CF6;
    color: #8B5CF6;
  }

  .prompt-toggle-btn.active-canvas {
    background-color: rgba(249, 115, 22, 0.15);
    border-color: #F97316;
    color: #F97316;
  }

  .prompt-divider {
    width: 1px;
    height: 16px;
    background-color: #444444;
    margin: 0 4px;
  }

  .prompt-submit-btn {
    background-color: #ffffff;
    color: #1F2023;
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
    background-color: #e5e7eb;
    transform: scale(1.05);
  }

  .prompt-submit-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    background-color: #374151;
    color: #9ca3af;
  }

  .prompt-recording-btn {
    background: transparent;
    color: #ef4444;
  }

  .hidden-file-input {
    display: none;
  }
`;

// Inject styles into document only on client side
if (typeof document !== "undefined") {
  const styleId = "prompt-box-styles";
  if (!document.getElementById(styleId)) {
    const styleSheet = document.createElement("style");
    styleSheet.id = styleId;
    styleSheet.innerText = customCSS;
    document.head.appendChild(styleSheet);
  }
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
    className="z-50 overflow-hidden rounded-md border border-[#333333] bg-[#1F2023] px-3 py-1.5 text-sm text-white shadow-md animate-in fade-in-0 zoom-in-95"
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
    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
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
      className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-[90vw] md:max-w-[800px] translate-x-[-50%] translate-y-[-50%] gap-4 border border-[#333333] bg-[#1F2023] p-0 shadow-xl rounded-2xl"
      {...props}
    >
      {children}
      <DialogPrimitive.Close className="absolute right-4 top-4 z-10 rounded-full bg-[#2E3033]/80 p-2 hover:bg-[#2E3033] transition-all">
        <X className="h-5 w-5 text-gray-200 hover:text-white" />
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
    className="text-lg font-semibold leading-none tracking-tight text-gray-100"
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
  const uploadInputRef = React.useRef<HTMLInputElement>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 240)}px`;
    }
  }, [input]);

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
      <div className="prompt-container" ref={ref}>
        {/* Attachment Preview (Simplified) */}
        {files.length > 0 && (
          <div style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
            {files.map((f, i) => (
              <div key={i} style={{ position: "relative", backgroundColor: "#333", padding: "4px 8px", borderRadius: "8px", fontSize: "12px" }}>
                {f.name}
                <button onClick={() => setFiles([])} style={{ background: "none", border: "none", color: "white", marginLeft: "4px", cursor: "pointer" }}>×</button>
              </div>
            ))}
          </div>
        )}

        <textarea
          ref={textareaRef}
          className="prompt-textarea"
          placeholder={showSearch ? "Search the web..." : showThink ? "Think deeply..." : placeholder}
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
            <button
              className="prompt-submit-btn"
              onClick={handleSubmit}
              disabled={!hasContent || isLoading}
            >
              {isLoading ? (
                <div style={{ width: "16px", height: "16px", border: "2px solid #333", borderTopColor: "transparent", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
              ) : hasContent ? (
                <ArrowUp size={18} />
              ) : (
                <Mic size={18} />
              )}
            </button>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});

PromptInputBox.displayName = "PromptInputBox";
