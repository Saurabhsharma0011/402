'use client';

import { useState, useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';

interface Robot {
  id: string;
  name: string;
  image: string;
  purpose: string;
  tasks: string[];
  personality: string;
  capabilities: string[];
  color: string;
  createdAt: string;
}

export default function XRobotApp() {
  const { user } = usePrivy();
  const [currentStep, setCurrentStep] = useState(1);
  const [savedRobots, setSavedRobots] = useState<Robot[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  
  // Robot Configuration State
  const [robotName, setRobotName] = useState('');
  const [robotPurpose, setRobotPurpose] = useState('');
  const [selectedImage, setSelectedImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [personality, setPersonality] = useState('friendly');
  const [tasks, setTasks] = useState<string[]>([]);
  const [currentTask, setCurrentTask] = useState('');
  const [capabilities, setCapabilities] = useState<string[]>([]);
  const [robotColor, setRobotColor] = useState('#00ff41');

  const personalities = [
    { id: 'friendly', name: 'Friendly', desc: 'Warm and approachable', emoji: '😊' },
    { id: 'professional', name: 'Professional', desc: 'Serious and efficient', emoji: '💼' },
    { id: 'creative', name: 'Creative', desc: 'Innovative and artistic', emoji: '🎨' },
    { id: 'analytical', name: 'Analytical', desc: 'Logical and precise', emoji: '🧮' },
    { id: 'energetic', name: 'Energetic', desc: 'Dynamic and enthusiastic', emoji: '⚡' },
    { id: 'calm', name: 'Calm', desc: 'Peaceful and patient', emoji: '🧘' },
  ];

  const capabilityOptions = [
    { id: 'data-analysis', name: 'Data Analysis', icon: '📊' },
    { id: 'automation', name: 'Task Automation', icon: '⚙️' },
    { id: 'communication', name: 'Communication', icon: '💬' },
    { id: 'research', name: 'Research', icon: '🔬' },
    { id: 'monitoring', name: 'Monitoring', icon: '👁️' },
    { id: 'trading', name: 'Trading', icon: '💹' },
    { id: 'content', name: 'Content Creation', icon: '✍️' },
    { id: 'security', name: 'Security', icon: '🔒' },
  ];

  const colors = [
    { name: 'Green', value: '#00ff41' },
    { name: 'Blue', value: '#00d4ff' },
    { name: 'Purple', value: '#b624ff' },
    { name: 'Pink', value: '#ff2e97' },
    { name: 'Orange', value: '#ff6b2e' },
    { name: 'Yellow', value: '#ffd700' },
  ];

  // Load saved robots from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('x402robots');
    if (stored) {
      setSavedRobots(JSON.parse(stored));
    }
  }, []);

  const addTask = () => {
    if (currentTask.trim()) {
      setTasks([...tasks, currentTask.trim()]);
      setCurrentTask('');
    }
  };

  const removeTask = (index: number) => {
    setTasks(tasks.filter((_, i) => i !== index));
  };

  const toggleCapability = (capId: string) => {
    if (capabilities.includes(capId)) {
      setCapabilities(capabilities.filter(c => c !== capId));
    } else {
      setCapabilities([...capabilities, capId]);
    }
  };

  const saveRobot = () => {
    if (!robotName.trim()) {
      alert('❌ Please give your robot a name!');
      return;
    }

    const newRobot: Robot = {
      id: Date.now().toString(),
      name: robotName,
      image: selectedImage,
      purpose: robotPurpose,
      tasks,
      personality,
      capabilities,
      color: robotColor,
      createdAt: new Date().toISOString(),
    };

    const updated = [...savedRobots, newRobot];
    setSavedRobots(updated);
    localStorage.setItem('x402robots', JSON.stringify(updated));

    // Reset form
    setIsEditing(true);
  };

  const deleteRobot = (id: string) => {
    if (confirm('Are you sure you want to delete this robot?')) {
      const updated = savedRobots.filter(r => r.id !== id);
      setSavedRobots(updated);
      localStorage.setItem('x402robots', JSON.stringify(updated));
    }
  };

  const resetForm = () => {
    setRobotName('');
    setRobotPurpose('');
    setSelectedImage('🤖');
    setPersonality('friendly');
    setTasks([]);
    setCurrentTask('');
    setCapabilities([]);
    setRobotColor('#00ff41');
    setIsEditing(false);
  };

  const nextStep = () => {
    if (currentStep === 1 && !robotName.trim()) {
      alert('Please enter a robot name');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="h-full flex flex-col overflow-auto p-6">
      <div className="max-w-4xl mx-auto w-full space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-mono font-bold text-green-400 mb-2">x402robot Builder</h2>
          <p className="text-green-400/60 text-sm">Create your own custom AI robot assistant</p>
        </div>

        {/* Toggle View */}
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => { setIsEditing(false); setCurrentStep(1); }}
            className={`px-6 py-3 rounded font-mono transition-all ${
              !isEditing
                ? 'bg-green-400 text-black border-2 border-green-400'
                : 'bg-black text-green-400 border-2 border-green-400/30 hover:border-green-400/50'
            }`}
          >
            ➕ Create New Robot
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className={`px-6 py-3 rounded font-mono transition-all ${
              isEditing
                ? 'bg-green-400 text-black border-2 border-green-400'
                : 'bg-black text-green-400 border-2 border-green-400/30 hover:border-green-400/50'
            }`}
          >
            🤖 My Robots ({savedRobots.length})
          </button>
        </div>

        {!isEditing ? (
          <>
            {/* Progress Bar */}
            <div className="bg-black border-2 border-green-400/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-green-400 font-mono text-sm">Step {currentStep} of 4</span>
                <span className="text-green-400/60 font-mono text-xs">
                  {currentStep === 1 && 'Basic Info'}
                  {currentStep === 2 && 'Appearance'}
                  {currentStep === 3 && 'Capabilities'}
                  {currentStep === 4 && 'Tasks & Purpose'}
                </span>
              </div>
              <div className="h-2 bg-green-400/20 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-green-400 transition-all duration-300"
                  style={{ width: `${(currentStep / 4) * 100}%` }}
                />
              </div>
            </div>

            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="bg-black border-2 border-green-400/50 rounded-lg p-6 space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🤖</div>
                  <h3 className="text-2xl font-mono font-bold text-green-400 mb-2">
                    Name Your Robot
                  </h3>
                  <p className="text-green-400/60 text-sm">
                    Give your robot a unique identity
                  </p>
                </div>

                <div>
                  <label className="block text-green-400 font-mono text-sm mb-2">Robot Name *</label>
                  <input
                    type="text"
                    value={robotName}
                    onChange={(e) => setRobotName(e.target.value)}
                    placeholder="e.g., DataBot3000, TradeAssist, NewsScout..."
                    maxLength={30}
                    className="w-full bg-black border-2 border-green-400/30 rounded px-4 py-3 text-green-400 
                             font-mono text-lg focus:border-green-400 focus:outline-none"
                  />
                  <div className="text-green-400/60 text-xs mt-1 font-mono text-right">
                    {robotName.length}/30 characters
                  </div>
                </div>

                <div>
                  <label className="block text-green-400 font-mono text-sm mb-2">Personality</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {personalities.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setPersonality(p.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          personality === p.id
                            ? 'bg-green-400/20 border-green-400'
                            : 'bg-black border-green-400/30 hover:border-green-400/50'
                        }`}
                      >
                        <div className="text-3xl mb-2">{p.emoji}</div>
                        <div className="text-green-400 font-mono text-sm font-bold">{p.name}</div>
                        <div className="text-green-400/60 font-mono text-xs mt-1">{p.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Appearance */}
            {currentStep === 2 && (
              <div className="bg-black border-2 border-green-400/50 rounded-lg p-6 space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {imagePreview ? (
                      <img src={imagePreview} alt="Robot" className="w-32 h-32 mx-auto rounded-full object-cover border-4" style={{ borderColor: robotColor }} />
                    ) : (
                      <div className="w-32 h-32 mx-auto rounded-full bg-green-400/10 border-4 border-green-400/30 flex items-center justify-center text-green-400/60 text-sm font-mono">
                        No Image
                      </div>
                    )}
                  </div>
                  <h3 className="text-2xl font-mono font-bold text-green-400 mb-2">
                    Upload Robot Image
                  </h3>
                  <p className="text-green-400/60 text-sm">
                    Upload a custom image for your robot
                  </p>
                </div>

                <div>
                  <label className="block text-green-400 font-mono text-sm mb-3">Upload Image</label>
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            const result = reader.result as string;
                            setSelectedImage(result);
                            setImagePreview(result);
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="hidden"
                      id="robot-image-upload"
                    />
                    <label
                      htmlFor="robot-image-upload"
                      className="block w-full bg-black border-2 border-green-400/30 hover:border-green-400 rounded-lg p-6 cursor-pointer transition-all text-center"
                    >
                      <div className="text-4xl mb-2">📁</div>
                      <div className="text-green-400 font-mono text-sm">
                        {imagePreview ? 'Change Image' : 'Click to Upload Image'}
                      </div>
                      <div className="text-green-400/60 font-mono text-xs mt-1">
                        PNG, JPG, GIF (Max 5MB)
                      </div>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-green-400 font-mono text-sm mb-3">Theme Color</label>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                    {colors.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setRobotColor(color.value)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          robotColor === color.value
                            ? 'border-white scale-105'
                            : 'border-green-400/30 hover:border-green-400/50'
                        }`}
                        style={{ backgroundColor: color.value + '20' }}
                      >
                        <div 
                          className="w-8 h-8 rounded-full mx-auto mb-2"
                          style={{ backgroundColor: color.value }}
                        />
                        <div className="text-green-400 font-mono text-xs">{color.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Preview */}
                <div className="bg-green-400/10 border-2 border-green-400/30 rounded-lg p-6 text-center">
                  <div className="text-green-400/60 font-mono text-xs mb-3">PREVIEW</div>
                  <div className="text-8xl mb-4" style={{ color: robotColor }}>{selectedImage}</div>
                  <div className="text-green-400 font-mono text-xl font-bold">
                    {robotName || 'Your Robot'}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Capabilities */}
            {currentStep === 3 && (
              <div className="bg-black border-2 border-green-400/50 rounded-lg p-6 space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">⚡</div>
                  <h3 className="text-2xl font-mono font-bold text-green-400 mb-2">
                    Robot Capabilities
                  </h3>
                  <p className="text-green-400/60 text-sm">
                    Select what your robot can do (choose multiple)
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {capabilityOptions.map((cap) => (
                    <button
                      key={cap.id}
                      onClick={() => toggleCapability(cap.id)}
                      className={`p-4 rounded-lg border-2 transition-all ${
                        capabilities.includes(cap.id)
                          ? 'bg-green-400/20 border-green-400'
                          : 'bg-black border-green-400/30 hover:border-green-400/50'
                      }`}
                    >
                      <div className="text-4xl mb-2">{cap.icon}</div>
                      <div className="text-green-400 font-mono text-sm font-bold">{cap.name}</div>
                      {capabilities.includes(cap.id) && (
                        <div className="text-green-400 text-2xl mt-2">✓</div>
                      )}
                    </button>
                  ))}
                </div>

                {capabilities.length > 0 && (
                  <div className="bg-green-400/10 border border-green-400/30 rounded-lg p-4">
                    <div className="text-green-400 font-mono text-sm mb-2">
                      Selected Capabilities: {capabilities.length}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {capabilities.map((capId) => {
                        const cap = capabilityOptions.find(c => c.id === capId);
                        return (
                          <span key={capId} className="bg-green-400/20 border border-green-400/50 rounded px-3 py-1 text-green-400 font-mono text-xs">
                            {cap?.icon} {cap?.name}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 4: Tasks & Purpose */}
            {currentStep === 4 && (
              <div className="bg-black border-2 border-green-400/50 rounded-lg p-6 space-y-6">
                <div className="text-center">
                  <div className="text-6xl mb-4">🎯</div>
                  <h3 className="text-2xl font-mono font-bold text-green-400 mb-2">
                    Define Purpose & Tasks
                  </h3>
                  <p className="text-green-400/60 text-sm">
                    What will your robot do for you?
                  </p>
                </div>

                <div>
                  <label className="block text-green-400 font-mono text-sm mb-2">Main Purpose</label>
                  <textarea
                    value={robotPurpose}
                    onChange={(e) => setRobotPurpose(e.target.value)}
                    placeholder="Describe the main purpose of your robot... e.g., 'Monitor Solana token prices and send alerts when conditions are met'"
                    rows={4}
                    maxLength={500}
                    className="w-full bg-black border-2 border-green-400/30 rounded px-4 py-3 text-green-400 
                             font-mono text-sm focus:border-green-400 focus:outline-none resize-none"
                  />
                  <div className="text-green-400/60 text-xs mt-1 font-mono text-right">
                    {robotPurpose.length}/500 characters
                  </div>
                </div>

                <div>
                  <label className="block text-green-400 font-mono text-sm mb-2">Tasks</label>
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={currentTask}
                      onChange={(e) => setCurrentTask(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTask()}
                      placeholder="Add a specific task..."
                      className="flex-1 bg-black border-2 border-green-400/30 rounded px-4 py-2 text-green-400 
                               font-mono text-sm focus:border-green-400 focus:outline-none"
                    />
                    <button
                      onClick={addTask}
                      className="bg-green-400 hover:bg-green-500 text-black font-mono px-6 py-2 rounded 
                               font-bold transition-all"
                    >
                      Add
                    </button>
                  </div>

                  {tasks.length > 0 && (
                    <div className="space-y-2">
                      {tasks.map((task, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-green-400/10 border border-green-400/30 
                                   rounded px-4 py-2"
                        >
                          <span className="text-green-400 font-mono text-sm">
                            {index + 1}. {task}
                          </span>
                          <button
                            onClick={() => removeTask(index)}
                            className="text-red-400 hover:text-red-300 font-mono text-xs"
                          >
                            ✕ Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Final Preview */}
                <div className="bg-gradient-to-br from-green-400/10 to-purple-500/10 border-2 border-green-400/50 rounded-lg p-6">
                  <div className="text-green-400 font-mono text-sm mb-4 text-center">
                    🤖 FINAL ROBOT PREVIEW
                  </div>
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-8xl" style={{ color: robotColor }}>{selectedImage}</div>
                    <div className="text-center">
                      <div className="text-green-400 font-mono text-2xl font-bold mb-1">
                        {robotName}
                      </div>
                      <div className="text-green-400/60 font-mono text-sm">
                        {personalities.find(p => p.id === personality)?.name} • {capabilities.length} capabilities
                      </div>
                    </div>
                    {robotPurpose && (
                      <div className="text-green-400/80 font-mono text-sm text-center max-w-md">
                        "{robotPurpose}"
                      </div>
                    )}
                    {tasks.length > 0 && (
                      <div className="text-green-400/60 font-mono text-xs">
                        {tasks.length} task{tasks.length !== 1 ? 's' : ''} configured
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-4 justify-between">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-black border-2 border-green-400/30 text-green-400 font-mono rounded 
                         hover:border-green-400/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                ← Previous
              </button>

              {currentStep < 4 ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-green-400 hover:bg-green-500 text-black font-mono rounded 
                           font-bold transition-all"
                >
                  Next →
                </button>
              ) : (
                <button
                  onClick={saveRobot}
                  className="px-8 py-3 bg-green-400 hover:bg-green-500 text-black font-mono rounded 
                           font-bold transition-all shadow-[0_0_20px_rgba(0,255,65,0.5)]"
                >
                  🚀 Create Robot
                </button>
              )}
            </div>
          </>
        ) : (
          /* Saved Robots View */
          <div className="space-y-4">
            {savedRobots.length === 0 ? (
              <div className="bg-black border-2 border-green-400/30 rounded-lg p-12 text-center">
                <div className="text-6xl mb-4">🤖</div>
                <div className="text-green-400 font-mono text-xl mb-2">No robots yet</div>
                <div className="text-green-400/60 font-mono text-sm mb-6">
                  Create your first robot to get started!
                </div>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-6 py-3 bg-green-400 text-black font-mono rounded font-bold 
                           hover:bg-green-500 transition-all"
                >
                  ➕ Create Robot
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {savedRobots.map((robot) => (
                  <div
                    key={robot.id}
                    className="bg-black border-2 border-green-400/50 rounded-lg p-6 hover:border-green-400 
                             transition-all hover:shadow-[0_0_20px_rgba(0,255,65,0.3)]"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full overflow-hidden border-4" style={{ borderColor: robot.color }}>
                          {robot.image ? (
                            <img src={robot.image} alt={robot.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full bg-green-400/10 flex items-center justify-center text-green-400/60 text-xs">
                              No Image
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="text-green-400 font-mono text-xl font-bold">{robot.name}</div>
                          <div className="text-green-400/60 font-mono text-xs">
                            {personalities.find(p => p.id === robot.personality)?.name}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => deleteRobot(robot.id)}
                        className="text-red-400 hover:text-red-300 font-mono text-sm transition-colors"
                      >
                        🗑️
                      </button>
                    </div>

                    {robot.purpose && (
                      <div className="bg-green-400/10 border border-green-400/30 rounded p-3 mb-3">
                        <div className="text-green-400/60 font-mono text-xs mb-1">PURPOSE</div>
                        <div className="text-green-400 font-mono text-sm">{robot.purpose}</div>
                      </div>
                    )}

                    {robot.capabilities.length > 0 && (
                      <div className="mb-3">
                        <div className="text-green-400/60 font-mono text-xs mb-2">CAPABILITIES</div>
                        <div className="flex flex-wrap gap-2">
                          {robot.capabilities.map((capId) => {
                            const cap = capabilityOptions.find(c => c.id === capId);
                            return (
                              <span
                                key={capId}
                                className="bg-green-400/20 border border-green-400/50 rounded px-2 py-1 
                                         text-green-400 font-mono text-xs"
                              >
                                {cap?.icon}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {robot.tasks.length > 0 && (
                      <div>
                        <div className="text-green-400/60 font-mono text-xs mb-2">
                          TASKS ({robot.tasks.length})
                        </div>
                        <div className="space-y-1">
                          {robot.tasks.slice(0, 3).map((task, i) => (
                            <div key={i} className="text-green-400 font-mono text-xs">
                              • {task}
                            </div>
                          ))}
                          {robot.tasks.length > 3 && (
                            <div className="text-green-400/60 font-mono text-xs">
                              +{robot.tasks.length - 3} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    <div className="text-green-400/40 font-mono text-xs mt-4 text-right">
                      Created: {new Date(robot.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
