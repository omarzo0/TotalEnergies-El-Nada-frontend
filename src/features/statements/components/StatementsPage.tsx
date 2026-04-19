"use client";

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import DataTable from '@/components/shared/DataTable';
import Modal from '@/components/shared/Modal';
import { useStatements } from '../hooks/useStatements';
import { Statement } from '../types/statements.types';

export default function StatementsPage() {
    const t = useTranslations('pages');
    const tTable = useTranslations('table.statements');
    const tButtons = useTranslations('buttons');
    const tModals = useTranslations('modals');

    const { statements, isLoading, error, addStatement, updateStatement, removeStatement } = useStatements();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedStatement, setSelectedStatement] = useState<Statement | null>(null);
    const [formData, setFormData] = useState({ name: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const columnLabels = [
        tTable('name'),
        tTable('createdAt')
    ];

    const rows = statements.map(s => ({
        cells: [
            s.name,
            s.createdAt ? new Date(s.createdAt).toLocaleDateString() : '-'
        ]
    }));

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        const success = await addStatement(formData.name);
        if (success) {
            setIsCreateModalOpen(false);
            setFormData({ name: '' });
        }
        setIsSubmitting(false);
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedStatement) return;
        setIsSubmitting(true);
        const success = await updateStatement(selectedStatement.name, formData.name);
        if (success) {
            setIsEditModalOpen(false);
            setSelectedStatement(null);
            setFormData({ name: '' });
        }
        setIsSubmitting(false);
    };

    const handleDelete = async () => {
        if (!selectedStatement) return;
        setIsSubmitting(true);
        const success = await removeStatement(selectedStatement.name);
        if (success) {
            setIsDeleteModalOpen(false);
            setSelectedStatement(null);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">{t('statements')}</h1>
                <button
                    onClick={() => {
                        setFormData({ name: '' });
                        setIsCreateModalOpen(true);
                    }}
                    className="btn btn-primary flex items-center gap-2"
                >
                    <i className="bx bx-plus"></i>
                    {tButtons('add')}
                </button>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 flex items-center gap-3 animate-shake">
                    <i className="bx bx-error-circle text-xl"></i>
                    <p className="text-sm font-medium">{error}</p>
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <DataTable
                        columns={columnLabels}
                        rows={rows}
                        onEdit={(index) => {
                            const statement = statements[index];
                            setSelectedStatement(statement);
                            setFormData({ name: statement.name });
                            setIsEditModalOpen(true);
                        }}
                        onDelete={(index) => {
                            setSelectedStatement(statements[index]);
                            setIsDeleteModalOpen(true);
                        }}
                    />
                )}
            </div>

            {/* Create Modal */}
            <Modal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                title={tModals('createRecordTitle')}
            >
                <form onSubmit={handleCreate} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {tTable('name')}
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsCreateModalOpen(false)}
                            className="btn btn-secondary"
                        >
                            {tButtons('cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary"
                        >
                            {isSubmitting ? tButtons('save') + '...' : tButtons('save')}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                title={tModals('editRecordTitle')}
            >
                <form onSubmit={handleEdit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {tTable('name')}
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                            required
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsEditModalOpen(false)}
                            className="btn btn-secondary"
                        >
                            {tButtons('cancel')}
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="btn btn-primary"
                        >
                            {isSubmitting ? tButtons('save') + '...' : tButtons('save')}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Delete Modal */}
            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                title={tModals('confirmDeleteTitle')}
            >
                <div className="space-y-4">
                    <p className="text-gray-600">{tModals('confirmDeleteMessage')}</p>
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="btn btn-secondary"
                        >
                            {tButtons('cancel')}
                        </button>
                        <button
                            onClick={handleDelete}
                            disabled={isSubmitting}
                            className="btn bg-red-600 hover:bg-red-700 text-white"
                        >
                            {isSubmitting ? tButtons('delete') + '...' : tButtons('delete')}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
