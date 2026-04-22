"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { useSupport } from "../hooks/useSupport";
import { SupportTicket } from "../api/support.api";
import Button from "@/ui/Button";
import { Input } from "@/ui/Input";
import Modal from "@/components/shared/Modal";

export default function SupportTicketsTab() {
    const t = useTranslations("support.tickets");
    const tButtons = useTranslations("buttons");
    const { tickets, isLoadingTickets, createTicket, addTicketResponse, deleteTicket } = useSupport();

    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [responseMessage, setResponseMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [newTicket, setNewTicket] = useState({
        subject: "",
        category: "technical",
        priority: "medium" as any,
        description: ""
    });

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createTicket(newTicket);
            setIsCreateModalOpen(false);
            setNewTicket({ subject: "", category: "technical", priority: "medium", description: "" });
        } catch (err) {
            console.error(err);
        }
    };

    const handleRespond = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTicket || !responseMessage.trim()) return;

        setIsSubmitting(true);
        try {
            await addTicketResponse({ id: selectedTicket._id, message: responseMessage });
            setResponseMessage("");
            const updated = tickets.find(t => t._id === selectedTicket._id);
            if (updated) setSelectedTicket(updated);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm(t("confirmDelete"))) return;
        try {
            await deleteTicket(id);
            if (selectedTicket?._id === id) setSelectedTicket(null);
        } catch (err) {
            console.error(err);
        }
    };

    if (isLoadingTickets) {
        return <div className="p-10 text-center animate-pulse text-slate-400">bx-loader-alt...</div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">{t("title")}</h3>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                    <i className="bx bx-plus mr-2"></i>
                    {t("createButton")}
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Tickets List */}
                <div className="lg:col-span-1 space-y-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                    {tickets.length === 0 ? (
                        <div className="p-8 text-center text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                            <i className="bx bx-comment-dots text-4xl mb-2"></i>
                            <p>{t("noTickets")}</p>
                        </div>
                    ) : (
                        tickets.map((ticket) => (
                            <div
                                key={ticket._id}
                                onClick={() => setSelectedTicket(ticket)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer shadow-sm relative group
                                    ${selectedTicket?._id === ticket._id
                                        ? "bg-slate-900 text-white border-slate-950 scale-[1.02]"
                                        : "bg-white text-slate-600 border-slate-100 hover:border-slate-200"
                                    }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full
                                        ${ticket.status === 'open' ? 'bg-emerald-500 text-white' :
                                            ticket.status === 'in_progress' ? 'bg-amber-500 text-white' :
                                                'bg-slate-400 text-white'}`}>
                                        {t(`status.${ticket.status}`)}
                                    </span>
                                    {ticket.status === 'open' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); handleDelete(ticket._id); }}
                                            className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                                        >
                                            <i className="bx bx-trash text-lg"></i>
                                        </button>
                                    )}
                                </div>
                                <h4 className="font-bold truncate">{ticket.subject}</h4>
                                <p className="text-xs mt-1 opacity-60 truncate">{ticket.category}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Ticket Details */}
                <div className="lg:col-span-2">
                    {selectedTicket ? (
                        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm flex flex-col h-[600px]">
                            <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-900">{selectedTicket.subject}</h3>
                                        <div className="flex gap-2 mt-1">
                                            <span className="text-xs text-slate-500">{selectedTicket.category}</span>
                                            <span className="text-xs text-slate-300">•</span>
                                            <span className="text-xs text-slate-500">{new Date(selectedTicket.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold
                                        ${selectedTicket.priority === 'high' ? 'bg-red-50 text-red-500' :
                                            selectedTicket.priority === 'medium' ? 'bg-amber-50 text-amber-500' :
                                                'bg-blue-50 text-blue-500'}`}>
                                        {t(`priority.${selectedTicket.priority}`)}
                                    </span>
                                </div>
                                <p className="text-slate-600 bg-white p-4 rounded-xl border border-slate-100">{selectedTicket.description}</p>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/30">
                                {selectedTicket.responses.map((resp, idx) => (
                                    <div
                                        key={idx}
                                        className={`flex ${resp.userType === 'station' ? 'justify-end' : 'justify-start'}`}
                                    >
                                        <div className={`max-w-[80%] p-4 rounded-2xl shadow-sm
                                            ${resp.userType === 'station'
                                                ? 'bg-primary text-white rounded-tr-none'
                                                : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none'}`}>
                                            <p className="text-sm">{resp.message}</p>
                                            <span className={`text-[10px] block mt-1 opacity-60 text-right`}>
                                                {new Date(resp.createdAt).toLocaleTimeString()}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {selectedTicket.status !== 'closed' && (
                                <form onSubmit={handleRespond} className="p-6 border-t border-slate-100">
                                    <div className="flex gap-3">
                                        <Input
                                            placeholder={t("responsePlaceholder")}
                                            value={responseMessage}
                                            onChange={(e) => setResponseMessage(e.target.value)}
                                            className="!mb-0 flex-1"
                                        />
                                        <Button disabled={isSubmitting || !responseMessage.trim()}>
                                            {tButtons("send")}
                                        </Button>
                                    </div>
                                </form>
                            )}
                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400 p-10 bg-white rounded-2xl border border-dashed border-slate-100">
                            <i className="bx bx-message-dots text-5xl mb-4"></i>
                            <p>{t("selectPrompt")}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Ticket Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title={t("createTitle")}
            >
                <form onSubmit={handleCreateTicket} className="space-y-4 p-4">
                    <Input
                        label={t("form.subject")}
                        value={newTicket.subject}
                        onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
                        required
                    />
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase px-1">{t("form.category")}</label>
                            <select
                                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                value={newTicket.category}
                                onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                            >
                                <option value="technical">Technical</option>
                                <option value="financial">Financial</option>
                                <option value="other">Other</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <label className="text-xs font-bold text-slate-500 uppercase px-1">{t("form.priority")}</label>
                            <select
                                className="w-full h-11 px-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                                value={newTicket.priority}
                                onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as any })}
                            >
                                <option value="low">Low</option>
                                <option value="medium">Medium</option>
                                <option value="high">High</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-500 uppercase px-1">{t("form.description")}</label>
                        <textarea
                            className="w-full p-4 rounded-xl bg-slate-50 border border-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm min-h-[120px]"
                            value={newTicket.description}
                            onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                            required
                        />
                    </div>
                    <div className="flex gap-3 justify-end pt-4">
                        <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
                            {tButtons("cancel")}
                        </Button>
                        <Button type="submit">
                            {tButtons("save")}
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
