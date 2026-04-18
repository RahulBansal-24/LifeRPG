import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { questAPI, postAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import CreatePostModal from '../components/CreatePostModal';
import { 
  Target, 
  Plus, 
  Star, 
  Calendar, 
  Sword, 
  CheckCircle,
  Circle,
  Trash2,
  Edit,
  Edit3,
  Filter,
  X,
  Sparkles,
  BookOpen
} from 'lucide-react';
  import { 
  getDifficultyColor, 
  getQuestTypeColor, 
  formatRelativeTime,
  generateQuestSuggestions,
  avatarOptions,
  getStatIcon
} from '../utils/helpers';
import toast from 'react-hot-toast';

const QuestsPage = () => {
  const { user, updateUser } = useAuth();
  const [quests, setQuests] = useState([]);
  const [filteredQuests, setFilteredQuests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [postEligibility, setPostEligibility] = useState({});
const [isCheckingEligibility, setIsCheckingEligibility] = useState({});
  const [filters, setFilters] = useState({
    type: 'all',
    difficulty: 'all',
    status: 'all',
  });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'main',
    difficulty: 'medium',
    selectedSkills: [],
    statsReward: {
      strength: 0,
      intelligence: 0,
      discipline: 0,
      charisma: 0
    }
  });

  const fetchQuests = async () => {
    try {
      const response = await questAPI.getQuests(filters);
      const fetchedQuests = response.data.data;
      setQuests(fetchedQuests);
      
      // Check post eligibility for completed quests
      const completedQuests = fetchedQuests.filter(quest => quest.status === 'completed');
      if (completedQuests.length > 0) {
        await checkPostEligibility(completedQuests);
      }
    } catch (error) {
      console.error('Failed to fetch quests:', error);
      toast.error('Failed to fetch quests');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuests();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [quests, filters]);

  const applyFilters = () => {
    let filtered = [...quests];

    if (filters.type !== 'all') {
      filtered = filtered.filter(quest => quest.type === filters.type);
    }

    if (filters.difficulty !== 'all') {
      filtered = filtered.filter(quest => quest.difficulty === filters.difficulty);
    }

    if (filters.status !== 'all') {
      filtered = filtered.filter(quest => quest.status === filters.status);
    }

    // Sort quests: uncompleted first, then completed
    filtered.sort((a, b) => {
      // If status is different, uncompleted comes first
      if (a.status !== b.status) {
        return a.status === 'pending' ? -1 : 1;
      }
      // If same status, maintain original order
      return 0;
    });

    setFilteredQuests(filtered);
  };

  const handleCreateQuest = async (e) => {
    e.preventDefault();
    
    try {
      const response = await questAPI.createQuest(formData);
      const newQuest = response.data.data;
      
      setQuests(prev => [newQuest, ...prev]);
      setShowCreateForm(false);
      resetForm();
      
      toast.success(`Quest "${newQuest.title}" created! 🎯`);
    } catch (error) {
      console.error('Failed to create quest:', error);
      toast.error(error.response?.data?.message || 'Failed to create quest');
    }
  };

  // Handle post creation for a quest
  const handleCreatePost = (quest) => {
    setSelectedQuest(quest);
    setShowCreatePostModal(true);
  };

  // Handle post created successfully
  const handlePostCreated = (newPost) => {
    // Update post eligibility for the quest
    setPostEligibility(prev => ({
      ...prev,
      [newPost.questId]: false
    }));
    
    setShowCreatePostModal(false);
    setSelectedQuest(null);
    toast.success('Chronicle created successfully! ');
  };

  // Handle post deleted (to re-enable post button)
  const handlePostDeleted = (questId) => {
    // Update post eligibility for the quest
    setPostEligibility(prev => ({
      ...prev,
      [questId]: true
    }));
  };

  const handleCompleteQuest = async (questId) => {
    try {
      console.log('Attempting to complete quest:', questId);
      const response = await questAPI.updateQuest(questId, { status: 'completed' });
      console.log('Quest completion response:', response.data);
      
      const { quest, userUpdate } = response.data.data;
      console.log('Quest data:', quest);
      console.log('User update data:', userUpdate);
      
      // Update quest in local state
      setQuests(prev => prev.map(q => 
        q._id === questId ? { ...q, ...quest } : q
      ));
      
      // Check post eligibility for the newly completed quest
      if (quest.status === 'completed') {
        try {
          const response = await postAPI.checkPostEligibility(questId);
          setPostEligibility(prev => ({
            ...prev,
            [questId]: response.data.data.canPost
          }));
        } catch (error) {
          console.error('Failed to check post eligibility:', error);
        }
      }
      
      // Update user if XP was awarded
      if (userUpdate) {
        console.log('Updating user context with:', userUpdate);
        updateUser(userUpdate);
        
        if (userUpdate.leveledUp) {
          toast.success(`🎉 LEVEL UP! You are now level ${userUpdate.level}!`);
        } else {
          const message = quest.type === 'main' 
            ? `Main quest completed! +${quest.xpReward} XP +1 Star! ⭐`
            : `Daily quest completed! +${quest.xpReward} XP! ⭐`;
          toast.success(message);
        }
      } else {
        toast.success('Quest completed!');
      }
    } catch (error) {
      console.error('Failed to complete quest:', error);
      console.error('Error response:', error.response);
      toast.error(error.response?.data?.message || 'Failed to complete quest');
    }
  };

  const handleDeleteQuest = async (questId) => {
    if (!confirm('Are you sure you want to delete this quest?')) return;
    
    try {
      await questAPI.deleteQuest(questId);
      setQuests(prev => prev.filter(q => q._id !== questId));
      toast.success('Quest deleted');
    } catch (error) {
      console.error('Failed to delete quest:', error);
      toast.error('Failed to delete quest');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      type: 'main',
      difficulty: 'medium',
      selectedSkills: [],
      statsReward: {
        strength: 0,
        intelligence: 0,
        discipline: 0,
        charisma: 0
      }
    });
  };

  // Check if daily quests already exist for today
  const hasDailyQuests = quests.some(quest => 
    quest.type === 'daily' && 
    new Date(quest.createdAt).toDateString() === new Date().toDateString()
  );

  // Check post eligibility for completed quests
  const checkPostEligibility = async (completedQuests) => {
    const eligibility = {};
    const loading = {};
    
    // Set loading state for all quests
    completedQuests.forEach(quest => {
      loading[quest._id] = true;
    });
    setIsCheckingEligibility(loading);
    
    for (const quest of completedQuests) {
      try {
        const response = await postAPI.checkPostEligibility(quest._id);
        eligibility[quest._id] = response.data.data.canPost;
      } catch (error) {
        console.error('Failed to check post eligibility:', error);
        eligibility[quest._id] = false;
      }
    }
    
    setPostEligibility(eligibility);
    setIsCheckingEligibility({});
  };

  const handleGenerateDailyQuests = async () => {
    try {
      const response = await questAPI.generateDailyQuests();
      const newQuests = response.data.data;
      
      setQuests(prev => [...newQuests, ...prev]);
      toast.success('Daily quests generated! 🌅');
    } catch (error) {
      console.error('Failed to generate daily quests:', error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes('already exist')) {
        toast.info('Daily quests already exist for today! 📅');
      } else {
        toast.error(error.response?.data?.message || 'Failed to generate daily quests');
      }
    }
  };

  const useSuggestion = (suggestion) => {
    setFormData({
      title: suggestion.title,
      description: suggestion.description,
      type: 'main',
      difficulty: suggestion.difficulty,
      selectedSkills: [],
      statsReward: {
        strength: 0,
        intelligence: 0,
        discipline: 0,
        charisma: 0
      }
    });
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'easy': return '🌟';
      case 'medium': return '⚡';
      case 'hard': return '🔥';
      default: return '⭐';
    }
  };

  const getSkillPoints = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 1;
      case 'medium': return 2;
      case 'hard': return 3;
      default: return 2;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" text="Loading your quests..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gaming-dark p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h1 className="font-orbitron text-4xl md:text-5xl font-bold bg-gradient-to-r from-neon-purple to-neon-pink bg-clip-text text-transparent mb-2">
            Quest Board
          </h1>
          <p className="text-gray-400 text-lg">
            Manage your adventures and complete quests to gain XP!
          </p>
        </motion.div>

        {/* Actions Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0"
        >
          {/* Filters */}
          <div className="flex items-center space-x-4">
            <Filter size={20} className="text-gray-400" />
            <select
              value={filters.type}
              onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
              className="bg-gaming-card border border-gaming-border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
            >
              <option value="all">All Types</option>
              <option value="daily">Daily</option>
              <option value="main">Main</option>
            </select>
            
            <select
              value={filters.difficulty}
              onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
              className="bg-gaming-card border border-gaming-border rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-neon-purple"
            >
              <option value="all">All Difficulties</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleGenerateDailyQuests}
              disabled={hasDailyQuests}
              className={`flex items-center space-x-2 ${
                hasDailyQuests 
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50' 
                  : 'neon-button-blue'
              }`}
            >
              <Calendar size={18} />
              <span>{hasDailyQuests ? 'Daily Generated' : 'Generate Daily'}</span>
            </button>
            
            <button
              onClick={() => {
                setShowCreateForm(true);
                resetForm();
              }}
              className="neon-button-pink flex items-center space-x-2"
            >
              <Plus size={18} />
              <span>Create Quest</span>
            </button>
          </div>
        </motion.div>

        {/* Create Quest Form */}
        {showCreateForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="gaming-card border-2 border-neon-pink"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Create New Quest</h3>
              <button
                onClick={() => {
                  setShowCreateForm(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            {/* Quest Suggestions */}
            <div className="mb-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Quick Suggestions:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {generateQuestSuggestions().map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => useSuggestion(suggestion)}
                    className="text-left p-3 bg-gaming-darker border border-gaming-border rounded-lg hover:border-neon-purple transition-colors duration-200"
                  >
                    <div className="font-semibold text-white text-sm">{suggestion.title}</div>
                    <div className="text-xs text-gray-400">{suggestion.description}</div>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`text-xs ${getDifficultyColor(suggestion.difficulty)}`}>
                        {suggestion.difficulty}
                      </span>
                      <span className="text-xs text-xp-gold">+{suggestion.xpReward} XP</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleCreateQuest} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quest Title
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-3 bg-gaming-darker border border-gaming-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink"
                    placeholder="Enter quest title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    XP Reward (Auto-calculated)
                  </label>
                  <div className="w-full px-4 py-3 bg-gaming-darker border border-gaming-border rounded-lg text-xp-gold font-bold">
                    {(() => {
                      const skillCount = formData.selectedSkills.length;
                      if (skillCount === 0) {
                        // No skills selected
                        if (formData.difficulty === 'easy') return 15;
                        if (formData.difficulty === 'medium') return 20;
                        if (formData.difficulty === 'hard') return 25;
                        return 20;
                      } else if (skillCount === 1) {
                        // One skill selected
                        if (formData.difficulty === 'easy') return 20;
                        if (formData.difficulty === 'medium') return 25;
                        if (formData.difficulty === 'hard') return 35;
                        return 25;
                      } else {
                        // Two or more skills selected
                        if (formData.difficulty === 'easy') return 25;
                        if (formData.difficulty === 'medium') return 30;
                        if (formData.difficulty === 'hard') return 40;
                        return 30;
                      }
                    })()} XP
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Based on difficulty ({formData.difficulty}) and skills selected ({formData.selectedSkills.length})
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Description
                </label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-4 py-3 bg-gaming-darker border border-gaming-border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-neon-pink resize-none"
                  rows={3}
                  placeholder="Describe your quest..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Quest Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-4 py-3 bg-gaming-darker border border-gaming-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
                  >
                    <option value="main">Main Quest</option>
                    <option value="daily">Daily Quest</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="w-full px-4 py-3 bg-gaming-darker border border-gaming-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon-pink"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Skill Selection for All Quests */}
              <div className="bg-gaming-card border border-gaming-border rounded-lg p-4 mb-4">
                <h3 className="text-lg font-semibold text-white mb-3">Skill Assignment</h3>
                <p className="text-gray-400 text-sm mb-4">
                  Choose which skills this quest will improve when completed:
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { name: 'intelligence', icon: '🧠', label: 'Intelligence' },
                    { name: 'strength', icon: '💪', label: 'Strength' },
                    { name: 'discipline', icon: '📘', label: 'Discipline' },
                    { name: 'charisma', icon: '🎭', label: 'Charisma' }
                  ].map(skill => (
                    <button
                      key={skill.name}
                      type="button"
                      onClick={() => {
                        const isSelected = formData.selectedSkills.includes(skill.name);
                        setFormData(prev => ({
                          ...prev,
                          selectedSkills: isSelected 
                            ? prev.selectedSkills.filter(s => s !== skill.name)
                            : [...prev.selectedSkills, skill.name],
                          statsReward: {
                            ...prev.statsReward,
                            [skill.name]: isSelected ? 0 : getSkillPoints(prev.difficulty)
                          }
                        }));
                      }}
                      className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                        formData.selectedSkills.includes(skill.name)
                          ? 'border-neon-purple bg-neon-purple bg-opacity-20 text-neon-purple'
                          : 'border-gaming-border bg-gaming-darker text-gray-400 hover:border-neon-purple hover:text-neon-purple'
                      }`}
                    >
                      <div className="flex flex-col items-center space-y-2">
                        <span className="text-2xl">{skill.icon}</span>
                        <span className="text-sm font-medium">{skill.label}</span>
                        {formData.selectedSkills.includes(skill.name) && (
                          <span className="text-xs text-neon-purple">
                            +{getSkillPoints(formData.difficulty)}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    resetForm();
                  }}
                  className="px-6 py-3 bg-gaming-card border border-gaming-border text-gray-300 rounded-lg hover:bg-gaming-darker transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="neon-button-pink"
                >
                  Create Quest
                </button>
              </div>
            </form>
          </motion.div>
        )}

        {/* Quests List */}
        <div className="space-y-4">
          {filteredQuests.length > 0 ? (
            filteredQuests.map((quest, index) => (
              <motion.div
                key={quest._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className={`quest-card ${quest.status === 'completed' ? 'opacity-75' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-2">
                        {quest.status === 'completed' ? (
                          <CheckCircle size={20} className="text-neon-green" />
                        ) : (
                          <Circle size={20} className="text-gray-400" />
                        )}
                        <h4 className={`font-semibold text-lg ${quest.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'}`}>
                          {quest.title}
                        </h4>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getQuestTypeColor(quest.type)} bg-opacity-20 border`}>
                          {getDifficultyIcon(quest.difficulty)} {quest.type}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(quest.difficulty)} bg-opacity-20 border`}>
                          {quest.difficulty}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-gray-400 mb-3">{quest.description}</p>
                    
                    {/* Skill Graphics */}
                    {quest.selectedSkills && quest.selectedSkills.length > 0 && (
                      <div className="flex items-center space-x-2 mb-3">
                        <span className="text-xs text-gray-500">Skills:</span>
                        <div className="flex items-center space-x-1">
                          {quest.selectedSkills.map((skill, index) => (
                            <span 
                              key={index} 
                              className="text-lg"
                              title={skill.charAt(0).toUpperCase() + skill.slice(1)}
                            >
                              {getStatIcon(skill)}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{formatRelativeTime(quest.createdAt)}</span>
                        </div>
                        <div className="flex items-center space-x-1 text-xp-gold">
                          <Star size={14} />
                          <span className="font-bold">{quest.xpReward} XP</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {quest.status === 'pending' && (
                          <button
                            onClick={() => handleCompleteQuest(quest._id)}
                            className="neon-button-green flex items-center space-x-1 text-sm"
                          >
                            <Sword size={16} />
                            <span>Complete</span>
                          </button>
                        )}
                        
                        {quest.status === 'completed' && (
                          <>
                            {isCheckingEligibility[quest._id] ? (
                              <button
                                disabled
                                className="flex items-center space-x-1 text-sm bg-gray-700 text-gray-400 px-3 py-2 rounded-lg cursor-not-allowed"
                              >
                                <BookOpen size={16} />
                                <span>Checking...</span>
                              </button>
                            ) : postEligibility[quest._id] ? (
                              <button
                                onClick={() => handleCreatePost(quest)}
                                className="neon-button-purple flex items-center space-x-1 text-sm"
                              >
                                <BookOpen size={16} />
                                <span>Create Chronicle</span>
                              </button>
                            ) : (
                              <button
                                disabled
                                className="flex items-center space-x-1 text-sm bg-gray-700 text-gray-400 px-3 py-2 rounded-lg cursor-not-allowed"
                              >
                                <BookOpen size={16} />
                                <span>Chronicle Created</span>
                              </button>
                            )}
                          </>
                        )}
                        
                        <button
                          onClick={() => handleDeleteQuest(quest._id)}
                          className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-400 hover:bg-opacity-10 rounded-lg transition-colors duration-200"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="gaming-card text-center py-12"
            >
              <Target size={64} className="text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">No Quests Found</h3>
              <p className="text-gray-400 mb-6">
                {filters.type !== 'all' || filters.status !== 'all' 
                  ? 'Try adjusting your filters or create new quests.' 
                  : 'Start your adventure by creating your first quest!'}
              </p>
              <button
                onClick={() => {
                  setShowCreateForm(true);
                  resetForm();
                }}
                className="neon-button-pink"
              >
                Create Your First Quest
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Create Post Modal */}
      {showCreatePostModal && (
        <CreatePostModal
          onClose={() => {
            setShowCreatePostModal(false);
            setSelectedQuest(null);
          }}
          onPostCreated={handlePostCreated}
          selectedQuest={selectedQuest}
        />
      )}
    </div>
  );
};

export default QuestsPage;
