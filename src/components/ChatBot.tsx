'use client';

import { useState } from 'react';

export default function ChatBot() {
  const [msg, setMsg] = useState('');
  const [chat, setChat] = useState<string[]>([]);

  const send = async () => {
    if (!msg) return;

    const res = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: msg }),
    });

    const data = await res.json();
    setChat([...chat, 'You: ' + msg, 'Bot: ' + data.reply]);
    setMsg('');
  };

  return (
    <div>
      <div className="h-64 p-3 overflow-auto border rounded">
        {chat.map((c, i) => (
          <p key={i}>{c}</p>
        ))}
      </div>

      <input
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        className="w-full p-2 mt-3 border rounded"
      />

      <button onClick={send} className="p-2 mt-2 text-white bg-black rounded">
        Send
      </button>
    </div>
  );
}
