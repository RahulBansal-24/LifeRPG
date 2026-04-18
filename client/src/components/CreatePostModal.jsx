import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { questAPI, postAPI } from '../services/api';
import { 
  X, 
  Upload, 
  Image as ImageIcon, 
  Target,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';

const CreatePostModal = ({ onClose, onPostCreated, selectedQuest }) => {
  const { user } = useAuth();
  const [completedQuests, setCompletedQuests] = useState([]);
  const [selectedQuestId, setSelectedQuestId] = useState(selectedQuest?._id || '');
  const [caption, setCaption] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(selectedQuest ? 2 : 1); // Start from step 2 if quest is pre-selected

  // Load completed quests
  useEffect(() => {
    const loadCompletedQuests = async () => {
      // Skip loading if quest is pre-selected (starting from step 2)
      if (selectedQuest) {
        return;
      }
      
      try {
        const response = await questAPI.getQuests({ status: 'completed' });
        const quests = response.data.data;
        
        // Filter quests that don't have posts yet
        const eligibleQuests = [];
        for (const quest of quests) {
          try {
            const eligibilityResponse = await postAPI.checkPostEligibility(quest._id);
            if (eligibilityResponse.data.data.canPost) {
              eligibleQuests.push(quest);
            }
          } catch (error) {
            // If error checking eligibility, assume not eligible
            continue;
          }
        }
        
        setCompletedQuests(eligibleQuests);
      } catch (error) {
        console.error('Failed to load completed quests:', error);
        toast.error('Failed to load completed quests');
      }
    };

    loadCompletedQuests();
  }, []); // Empty dependency array since we only want to load once

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      
      // Check file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Get selected quest details
  const selectedQuestData = selectedQuest || completedQuests.find(q => q._id === selectedQuestId) || null;

  // Handle next step
  const handleNext = () => {
    if (step === 1 && !selectedQuestId) {
      toast.error('Please select a quest');
      return;
    }
    if (step === 2 && (!caption.trim() || !imageFile)) {
      toast.error('Please add caption and image');
      return;
    }
    setStep(step + 1);
  };

  // Handle previous step
  const handlePrevious = () => {
    // Don't go back to step 1 if quest was pre-selected
    if (step === 2 && selectedQuest) {
      return;
    }
    setStep(step - 1);
  };

  // Handle submit
  const handleSubmit = async () => {
    // When starting from step 2 with pre-selected quest, use the pre-selected quest
    const questId = selectedQuest?._id || selectedQuestId;
    
    if (!questId || !caption.trim() || !imageFile) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      setIsLoading(true);
      
      const formData = new FormData();
      formData.append('questId', questId);
      formData.append('caption', caption);
      formData.append('image', imageFile);

      const response = await postAPI.createPost(formData);
      onPostCreated(response.data.data);
    } catch (error) {
      console.error('Failed to create post:', error);
      toast.error(error.response?.data?.message || 'Failed to create chronicle');
    } finally {
      setIsLoading(false);
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'medium': return 'text-yellow-500';
      case 'hard': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  if (!onClose) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-gaming-card border border-gaming-border rounded-xl max-w-2xl w-full max-h-[90vh] overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gaming-border">
            <h2 className="text-xl font-bold text-white">Create Chronicle</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="flex items-center justify-center p-4 border-b border-gaming-border">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    step >= s ? 'bg-neon-purple text-white' : 'bg-gray-700 text-gray-400'
                  }`}>
                    {step > s ? <CheckCircle className="w-4 h-4" /> : s}
                  </div>
                  {s < 3 && (
                    <div className={`w-12 h-1 mx-2 ${
                      step > s ? 'bg-neon-purple' : 'bg-gray-700'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {/* Step 1: Select Quest */}
            {step === 1 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-white mb-4">Select a Completed Quest</h3>
                
                {completedQuests.length === 0 ? (
                  <div className="text-center py-8">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                    <p className="text-gray-400 mb-4">No eligible completed quests found</p>
                    <p className="text-sm text-gray-500">Complete some quests first, or you may have already created chronicles for all completed quests.</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto">
                    {completedQuests.map((quest) => (
                      <div
                        key={quest._id}
                        onClick={() => setSelectedQuestId(quest._id)}
                        className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                          selectedQuestId === quest._id
                            ? 'border-neon-purple bg-gaming-darker'
                            : 'border-gaming-border hover:border-neon-purple/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-1">{quest.title}</h4>
                            <p className="text-gray-400 text-sm mb-2">{quest.description}</p>
                            <div className="flex items-center space-x-3 text-xs">
                              <span className={`font-semibold ${getDifficultyColor(quest.difficulty)}`}>
                                {quest.difficulty}
                              </span>
                              <span className="text-neon-green">+{quest.xpReward} XP</span>
                              <span className="text-gray-500">Completed {new Date(quest.completedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                          {selectedQuestId === quest._id && (
                            <CheckCircle className="w-5 h-5 text-neon-purple flex-shrink-0 ml-2" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Upload Image & Caption */}
            {step === 2 && selectedQuestData && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Quest Details</h3>
                  <div className="bg-gaming-darker border border-gaming-border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Target className="w-4 h-4 text-neon-purple" />
                      <h4 className="font-semibold text-white">{selectedQuestData.title}</h4>
                      <span className={`text-xs font-semibold ${getDifficultyColor(selectedQuestData.difficulty)}`}>
                        {selectedQuestData.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm">{selectedQuestData.description}</p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Add Image</h3>
                  <div className="border-2 border-dashed border-gaming-border rounded-lg p-8 text-center hover:border-neon-purple/50 transition-colors">
                    {imagePreview ? (
                      <div className="space-y-4">
                        <div className="max-w-md mx-auto">
                          <div className="rounded-lg overflow-hidden bg-gaming-darker">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="w-full"
                              style={{ 
                                aspectRatio: '1/1', 
                                maxHeight: '400px',
                                objectFit: 'cover',
                                objectPosition: 'center'
                              }}
                            />
                          </div>
                        </div>
                        <button
                          onClick={() => {
                            setImageFile(null);
                            setImagePreview('');
                          }}
                          className="text-red-500 hover:text-red-400 text-sm"
                        >
                          Remove image
                        </button>
                      </div>
                    ) : (
                      <div>
                        <ImageIcon className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400 mb-4">Click to upload image or drag and drop</p>
                        <label className="cursor-pointer">
                          <span className="px-4 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors">
                            Choose Image
                          </span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </label>
                        <p className="text-gray-500 text-xs mt-2">PNG, JPG, GIF up to 5MB</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-white mb-4">Add Caption</h3>
                  <textarea
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Share your experience, thoughts, or achievements..."
                    className="w-full bg-gaming-darker border border-gaming-border rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-neon-purple resize-none"
                    rows={4}
                    maxLength={500}
                  />
                  <p className="text-gray-500 text-xs mt-1">{caption.length}/500 characters</p>
                </div>
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && selectedQuestData && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-white mb-4">Review Your Chronicle</h3>
                
                <div className="bg-gaming-darker border border-gaming-border rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Target className="w-4 h-4 text-neon-purple" />
                    <h4 className="font-semibold text-white">{selectedQuestData.title}</h4>
                    <span className={`text-xs font-semibold ${getDifficultyColor(selectedQuestData.difficulty)}`}>
                      {selectedQuestData.difficulty}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mb-3">{selectedQuestData.description}</p>
                </div>

                {imagePreview && (
                  <div>
                    <h4 className="text-white font-medium mb-2">Image</h4>
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}

                <div>
                  <h4 className="text-white font-medium mb-2">Caption</h4>
                  <div className="bg-gaming-darker border border-gaming-border rounded-lg p-4">
                    <p className="text-gray-300 whitespace-pre-wrap">{caption}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gaming-border">
            <div className="flex items-center space-x-3">
              {step > 1 && (
                <button
                  onClick={handlePrevious}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Previous
                </button>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              {step < 3 ? (
                <button
                  onClick={handleNext}
                  className="px-4 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-4 py-2 bg-neon-purple text-white rounded-lg hover:bg-neon-purple/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Creating...' : 'Create Chronicle'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
};

export default CreatePostModal;
