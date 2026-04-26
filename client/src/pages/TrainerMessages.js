import React, { useState, useEffect, useRef } from 'react';
import { trainerService } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, Search, MoreVertical, Paperclip, MessageSquare, ShieldCheck, Clock } from 'lucide-react';
import { toast } from 'react-hot-toast';
import socket from '../utils/socket';

const TrainerMessages = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchClients();
    
    socket.on('message_received', (msg) => {
      if (selectedClient && (msg.senderId === selectedClient._id || msg.receiverId === selectedClient._id)) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => socket.off('message_received');
  }, [selectedClient]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchClients = async () => {
    try {
      const res = await trainerService.getClients();
      setClients(res.data);
      if (res.data.length > 0 && !selectedClient) {
        setSelectedClient(res.data[0]);
      }
    } catch (error) {
      toast.error('Failed to load active links');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClient) {
      fetchChatHistory();
    }
  }, [selectedClient]);

  const fetchChatHistory = async () => {
    try {
      const res = await trainerService.getChatHistory(selectedClient._id);
      setMessages(res.data);
    } catch (error) {
      console.error('Chat history retrieval failed');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedClient) return;

    try {
      const msgData = {
        receiverId: selectedClient._id,
        receiverModel: 'User',
        text: newMessage
      };
      const res = await trainerService.sendMessage(msgData);
      setMessages(prev => [...prev, res.data]);
      setNewMessage('');
    } catch (error) {
      toast.error('Neural transmission failed');
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
       <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="h-[calc(100vh-160px)] flex flex-col md:flex-row gap-6 pb-4">
      {/* Sidebar - Client List */}
      <div className="w-full md:w-80 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col overflow-hidden">
        <div className="p-6 border-b border-slate-800">
           <h3 className="text-sm font-black text-white italic uppercase tracking-widest mb-4 flex items-center gap-2">
             <ShieldCheck size={16} className="text-blue-500" />
             Neural Contacts
           </h3>
           <div className="relative group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="text" 
                placeholder="Search Assets..." 
                className="w-full bg-slate-950 border border-slate-800 rounded-xl py-2 pl-9 pr-4 text-[10px] font-bold text-white uppercase tracking-widest focus:border-blue-500 outline-none transition-all"
              />
           </div>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-hide">
           {clients.map(client => (
             <button
               key={client._id}
               onClick={() => setSelectedClient(client)}
               className={`w-full flex items-center gap-3 p-3 rounded-2xl transition-all ${
                 selectedClient?._id === client._id 
                   ? 'bg-blue-600/10 border border-blue-600/20' 
                   : 'hover:bg-slate-800 border border-transparent'
               }`}
             >
               <div className="relative">
                  <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center text-slate-600">
                    <User size={20} />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full"></div>
               </div>
               <div className="text-left overflow-hidden">
                 <h4 className={`text-xs font-black uppercase italic leading-none truncate ${selectedClient?._id === client._id ? 'text-blue-400' : 'text-slate-300'}`}>
                   {client.name}
                 </h4>
                 <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase tracking-widest truncate">Sector AI-PX-{client._id.slice(-4).toUpperCase()}</p>
               </div>
             </button>
           ))}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col overflow-hidden relative">
        {selectedClient ? (
          <>
            {/* Chat Header */}
            <div className="px-6 py-4 border-b border-slate-800 bg-slate-900/50 flex justify-between items-center">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-600/10 border border-blue-600/20 rounded-xl flex items-center justify-center text-blue-500">
                    <User size={20} />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white italic uppercase tracking-widest leading-none">
                       {selectedClient.name}
                    </h3>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-[0.2em]">Neural Link Established</span>
                    </div>
                  </div>
               </div>
               <button className="text-slate-600 hover:text-white transition-colors">
                  <MoreVertical size={20} />
               </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
               {messages.length > 0 ? messages.map((msg, i) => (
                 <div key={i} className={`flex ${msg.senderId === user.id || msg.senderId === user._id ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-lg ${
                      msg.senderId === user.id || msg.senderId === user._id
                        ? 'bg-blue-600 border border-blue-500 text-white rounded-br-none'
                        : 'bg-slate-950 border border-slate-800 text-slate-300 rounded-bl-none'
                    }`}>
                       <p className="text-sm font-medium leading-relaxed">{msg.text}</p>
                       <div className={`text-[8px] font-black uppercase tracking-widest mt-2 opacity-60 flex items-center gap-1 ${
                         msg.senderId === user.id || msg.senderId === user._id ? 'justify-end' : 'justify-start'
                       }`}>
                          <Clock size={8} />
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </div>
                    </div>
                 </div>
               )) : (
                 <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-30">
                    <MessageSquare size={48} className="text-slate-700" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] italic">Start biological status transmission</p>
                 </div>
               )}
               <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="p-6 border-t border-slate-800 bg-slate-900/50">
               <form onSubmit={handleSendMessage} className="relative flex gap-3">
                  <div className="relative flex-1">
                     <input 
                       type="text" 
                       value={newMessage}
                       onChange={(e) => setNewMessage(e.target.value)}
                       placeholder="Enter directive..."
                       className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-5 pr-14 text-sm text-white placeholder-slate-600 focus:border-blue-500 outline-none transition-all shadow-inner"
                     />
                     <button type="button" className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 hover:text-blue-500 transition-colors">
                        <Paperclip size={18} />
                     </button>
                  </div>
                  <button 
                    type="submit"
                    className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-blue-600/30 active:scale-90 group"
                  >
                    <Send size={20} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
               </form>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center space-y-6">
             <div className="w-24 h-24 bg-slate-950 rounded-full border border-slate-800 flex items-center justify-center text-slate-800">
                <MessageSquare size={48} />
             </div>
             <div className="text-center">
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">No Active Link</h3>
                <p className="text-slate-500 uppercase text-[10px] font-bold tracking-[0.2em] mt-2">Select a neural contact to initiate protocol</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrainerMessages;
