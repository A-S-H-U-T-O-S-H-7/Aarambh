'use client';

import { useState, useEffect } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";
import AILoadingOverlay from "./AILoadingOverlay";

export default function AIGenerateButton({ 
  content, 
  onGenerated, 
  label = "Generate with AI",
  size = "sm",
  disabled = false  // ← ADD THIS LINE
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [requestsLeft, setRequestsLeft] = useState(20);
  
  // Load request count from localStorage
  useEffect(() => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('ai_requests');
    if (saved) {
      const { date, count } = JSON.parse(saved);
      if (date === today) {
        setRequestsLeft(20 - count);
      } else {
        localStorage.setItem('ai_requests', JSON.stringify({ date: today, count: 0 }));
        setRequestsLeft(20);
      }
    } else {
      localStorage.setItem('ai_requests', JSON.stringify({ date: new Date().toDateString(), count: 0 }));
      setRequestsLeft(20);
    }
  }, []);
  
  const incrementRequestCount = () => {
    const today = new Date().toDateString();
    const saved = localStorage.getItem('ai_requests');
    let count = 0;
    if (saved) {
      const data = JSON.parse(saved);
      if (data.date === today) {
        count = data.count + 1;
      } else {
        count = 1;
      }
    } else {
      count = 1;
    }
    localStorage.setItem('ai_requests', JSON.stringify({ date: today, count }));
    setRequestsLeft(20 - count);
  };
  
  const stripHtml = (html) => {
    if (!html) return '';
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    return tempDiv.textContent || tempDiv.innerText || '';
  };
  
  const handleGenerate = async () => {
    if (disabled) return; // ← ADD THIS LINE
    
    if (requestsLeft <= 0) {
      toast.error("Daily limit reached (20 requests). Please try again tomorrow.");
      return;
    }
    
    const cleanContent = stripHtml(content);
    
    if (!cleanContent || cleanContent.trim().length < 20) {
      toast.error("Please add at least 20 characters of content first");
      return;
    }
    
    setIsGenerating(true);
    
    try {
      const response = await fetch("/api/generate-seo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: cleanContent }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        incrementRequestCount();
        
        if (data.metatitle) onGenerated("metatitle", data.metatitle);
        if (data.metadesc) onGenerated("metadesc", data.metadesc);
        if (data.metakeywords) onGenerated("metakeywords", data.metakeywords);
        if (data.tags) {
          const tagsArray = data.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
          onGenerated("tags", tagsArray);
        }
        if (data.shortDescription) onGenerated("description", data.shortDescription);
        if (data.moral) onGenerated("moral", data.moral);
        
        toast.success(`SEO generated! ${requestsLeft - 1} requests left today`);
      } else {
        toast.error(data.error || "Failed to generate");
      }
    } catch (error) {
      console.error("Generation error:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };
  
  const sizeClasses = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
  };
  
  const isDisabled = disabled || isGenerating || requestsLeft <= 0;
  
  return (
    <>
      {isGenerating && <AILoadingOverlay />}
      <div className="relative inline-block">
        <button
          type="button"
          onClick={handleGenerate}
          disabled={isDisabled}
          className={`
            inline-flex items-center gap-1.5
            font-medium rounded-lg
            transition-all duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
            ${sizeClasses[size]}
            ${isDisabled 
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
              : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
            }
          `}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              {label}
              {requestsLeft <= 5 && !disabled && (
                <span className="ml-1 text-[10px] bg-red-500 px-1 rounded">
                  {requestsLeft}
                </span>
              )}
            </>
          )}
        </button>
      </div>
    </>
  );
}