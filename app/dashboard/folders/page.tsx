'use client';

import { Folder, Plus, Edit2, Trash2, FolderOpen } from 'lucide-react';
import { useState } from 'react';
import { useToast } from '@/components/ToastContainer';
import { ConfirmModal } from '@/components/ConfirmModal';

export default function FoldersPage() {
  const toast = useToast();
  const [folders, setFolders] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState<any>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('blue');
  const [newFolderDescription, setNewFolderDescription] = useState('');

  const handleCreateFolder = () => {
    if (!newFolderName.trim()) {
      toast.warning('Please enter a folder name');
      return;
    }
    
    const newFolder = {
      id: Date.now().toString(),
      name: newFolderName,
      description: newFolderDescription,
      color: newFolderColor,
      createdAt: new Date().toISOString(),
      _count: { contents: 0 }
    };
    
    setFolders([...folders, newFolder]);
    setNewFolderName('');
    setNewFolderDescription('');
    setNewFolderColor('blue');
    setShowCreateModal(false);
    toast.success(`Folder "${newFolderName}" created successfully!`);
  };

  const handleEditFolder = () => {
    if (!newFolderName.trim()) {
      toast.warning('Please enter a folder name');
      return;
    }
    
    setFolders(folders.map(f => 
      f.id === selectedFolder.id 
        ? { ...f, name: newFolderName, description: newFolderDescription, color: newFolderColor }
        : f
    ));
    
    toast.success(`Folder "${newFolderName}" updated successfully!`);
    setShowEditModal(false);
    setSelectedFolder(null);
    setNewFolderName('');
    setNewFolderDescription('');
    setNewFolderColor('blue');
  };

  const openEditModal = (folder: any) => {
    setSelectedFolder(folder);
    setNewFolderName(folder.name);
    setNewFolderDescription(folder.description || '');
    setNewFolderColor(folder.color);
    setShowEditModal(true);
  };

  const handleDeleteFolder = () => {
    if (selectedFolder) {
      setFolders(folders.filter(f => f.id !== selectedFolder.id));
      toast.success(`Folder "${selectedFolder.name}" deleted successfully!`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Folders</h1>
          <p className="text-gray-600 mt-1">
            Organize your content with folders
          </p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Folder
        </button>
      </div>

      {/* Folders Grid */}
      {folders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12">
          <div className="text-center">
            <FolderOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No folders yet
            </h3>
            <p className="text-gray-600 mb-6">
              Create folders to organize your content
            </p>
            <button 
              onClick={() => setShowCreateModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 cursor-pointer transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Your First Folder
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-lg transition-shadow cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`p-3 rounded-lg ${
                    folder.color === 'blue'
                      ? 'bg-blue-100'
                      : folder.color === 'green'
                      ? 'bg-green-100'
                      : folder.color === 'purple'
                      ? 'bg-purple-100'
                      : folder.color === 'orange'
                      ? 'bg-orange-100'
                      : folder.color === 'pink'
                      ? 'bg-pink-100'
                      : 'bg-gray-100'
                  }`}
                >
                  <Folder
                    className={`w-6 h-6 ${
                      folder.color === 'blue'
                        ? 'text-blue-600'
                        : folder.color === 'green'
                        ? 'text-green-600'
                        : folder.color === 'purple'
                        ? 'text-purple-600'
                        : folder.color === 'orange'
                        ? 'text-orange-600'
                        : folder.color === 'pink'
                        ? 'text-pink-600'
                        : 'text-gray-600'
                    }`}
                  />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(folder);
                    }}
                    className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <Edit2 className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedFolder(folder);
                      setShowDeleteModal(true);
                    }}
                    className="p-1 hover:bg-gray-100 rounded cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </button>
                </div>
              </div>
              
              <h3 className="font-semibold text-lg mb-2">{folder.name}</h3>
              
              {folder.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {folder.description}
                </p>
              )}
              
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{folder._count?.contents || 0} items</span>
                <span>
                  {new Date(folder.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Folder Colors Legend */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-3">Organize with Colors</h3>
        <div className="flex flex-wrap gap-4">
          {[
            { name: 'Blue', color: 'blue', bg: 'bg-blue-100', text: 'text-blue-600' },
            { name: 'Green', color: 'green', bg: 'bg-green-100', text: 'text-green-600' },
            { name: 'Purple', color: 'purple', bg: 'bg-purple-100', text: 'text-purple-600' },
            { name: 'Orange', color: 'orange', bg: 'bg-orange-100', text: 'text-orange-600' },
            { name: 'Pink', color: 'pink', bg: 'bg-pink-100', text: 'text-pink-600' },
            { name: 'Gray', color: 'gray', bg: 'bg-gray-100', text: 'text-gray-600' },
          ].map((color) => (
            <div key={color.name} className="flex items-center gap-2">
              <div className={`p-2 rounded ${color.bg}`}>
                <Folder className={`w-4 h-4 ${color.text}`} />
              </div>
              <span className="text-sm text-gray-600">{color.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Create Folder Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">Create New Folder</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g., Blog Posts, Social Media"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newFolderDescription}
                  onChange={(e) => setNewFolderDescription(e.target.value)}
                  placeholder="What will you store here?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Folder Color
                </label>
                <div className="flex gap-3">
                  {['blue', 'green', 'purple', 'orange', 'pink', 'gray'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewFolderColor(color)}
                      className={`w-10 h-10 rounded-lg cursor-pointer transition-all ${
                        newFolderColor === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''
                      } ${
                        color === 'blue' ? 'bg-blue-500' :
                        color === 'green' ? 'bg-green-500' :
                        color === 'purple' ? 'bg-purple-500' :
                        color === 'orange' ? 'bg-orange-500' :
                        color === 'pink' ? 'bg-pink-500' :
                        'bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateFolder}
                disabled={!newFolderName.trim()}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Create Folder
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Folder Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowEditModal(false)}>
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-2xl font-bold mb-6">Edit Folder</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Folder Name
                </label>
                <input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g., Blog Posts, Social Media"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={newFolderDescription}
                  onChange={(e) => setNewFolderDescription(e.target.value)}
                  placeholder="What will you store here?"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Folder Color
                </label>
                <div className="flex gap-3">
                  {['blue', 'green', 'purple', 'orange', 'pink', 'gray'].map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewFolderColor(color)}
                      className={`w-10 h-10 rounded-lg cursor-pointer transition-all ${
                        newFolderColor === color ? 'ring-2 ring-offset-2 ring-blue-500 scale-110' : ''
                      } ${
                        color === 'blue' ? 'bg-blue-500' :
                        color === 'green' ? 'bg-green-500' :
                        color === 'purple' ? 'bg-purple-500' :
                        color === 'orange' ? 'bg-orange-500' :
                        color === 'pink' ? 'bg-pink-500' :
                        'bg-gray-500'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedFolder(null);
                  setNewFolderName('');
                  setNewFolderDescription('');
                  setNewFolderColor('blue');
                }}
                className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEditFolder}
                disabled={!newFolderName.trim()}
                className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 font-semibold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedFolder(null);
        }}
        onConfirm={handleDeleteFolder}
        title="Delete Folder?"
        message={`Are you sure you want to delete "${selectedFolder?.name}"? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="red"
      />
    </div>
  );
}
