import React, { useState, useRef } from 'react';
import { XCircle, FileText, Mic, Image as ImageIcon, Loader2 } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

// Configure axios to send cookies
axios.defaults.withCredentials = true;

function AIReceiptExtraction({ onClose, onSuccess }) {
  const [activeTab, setActiveTab] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'si', name: 'Sinhala' }
  ];

  const handleTextSubmit = async () => {
    if (!textInput.trim()) {
      toast.warning('Please enter receipt description');
      return;
    }
    await submitData({ text: textInput, language: selectedLanguage }, 'text/text-translate');
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };
      
      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/mp3' });
        setAudioFile(audioBlob);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      toast.info('Recording started... Click again to stop');
    } catch (err) {
      console.error('Error accessing microphone:', err);
      toast.error('Could not access microphone. Please check permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  };

  const handleVoiceRecording = () => {
    if (!isRecording) {
      startRecording();
    } else {
      stopRecording();
    }
  };

  const handleVoiceSubmit = async () => {
    if (!audioFile) {
      toast.warning('Please record or upload an audio file');
      return;
    }
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('language_code', selectedLanguage);
    await submitData({file: audioFile, language_code: selectedLanguage}, 'speech/voice-translate');
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, JPG)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB');
      return;
    }

    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
    toast.success('Image uploaded successfully');
  };

  const handleCancelImage = () => {
    setImageFile(null);
    setPreviewImage('');
    toast.info('Image removed');
  };

  const handleImageSubmit = async () => {
    if (!imageFile) {
      toast.warning('Please upload an image');
      return;
    }
    const formData = new FormData();
    formData.append('file', imageFile);
    await submitData(formData, 'receipt/extract-receipt');
  };

  const submitData = async (data, endpoint) => {
    setIsLoading(true);
    setResult(null);
    try {
      const url = `http://127.0.0.1:8000/api/v1/${endpoint}`;
      const response = await axios.post(url, data, {
        headers: {
          'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
        },
        withCredentials: true,
      });
      console.log('Response:', response.data);
      setResult(response.data);
      toast.success('Data processed successfully!');

      if (onSuccess) {
        onSuccess(response.data);
      }
      // Close the popup after successful extraction
      if (onClose) {
        onClose();
      }

    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to process data');
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'text':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Receipt Description*</label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter receipt description..."
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm h-32"
                required
              />
            </div>
            
            <button
              onClick={handleTextSubmit}
              disabled={!textInput.trim() || isLoading}
              className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin mr-2 h-4 w-4" />
                  Processing...
                </>
              ) : 'Extract Data'}
            </button>
          </div>
        );
        
      case 'voice':
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">Select Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-4">
                <button
                  onClick={handleVoiceRecording}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    isRecording
                      ? 'bg-red-600 text-white focus:ring-red-500 hover:bg-red-700'
                      : 'bg-gray-100 text-gray-700 focus:ring-gray-500 hover:bg-gray-200'
                  }`}
                >
                  <Mic size={18} />
                  <span>{isRecording ? 'Stop Recording' : 'Record Voice'}</span>
                </button>
                
                {audioFile && (
                  <button
                    onClick={() => audioRef.current.play()}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md shadow-sm text-sm font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    <Mic size={18} />
                    <span>Play Recording</span>
                  </button>
                )}
              </div>
              
              <audio ref={audioRef} src={audioFile && URL.createObjectURL(audioFile)} hidden />
              
              {audioFile && (
                <div className="pt-2">
                  <button
                    onClick={handleVoiceSubmit}
                    disabled={isLoading}
                    className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-4 w-4" />
                        Processing...
                      </>
                    ) : 'Extract Data'}
                  </button>
                </div>
              )}
            </div>
          </div>
        );
        
      case 'image':
        return (
          <div className="space-y-6">
            {!previewImage && (
              <div className="space-y-2">
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                      <ImageIcon className="mb-3 text-gray-400" size={36} />
                      <p className="mb-2 text-sm text-gray-500">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        JPEG, PNG, JPG (MAX. 5MB)
                      </p>
                    </div>
                    <input 
                      id="image-upload" 
                      type="file" 
                      className="hidden" 
                      accept="image/jpeg, image/png, image/jpg"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
            )}
            
            {previewImage && (
              <div className="space-y-4">
                <div className="relative">
                  <div className="rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={previewImage}
                      alt="Receipt preview"
                      className="w-full h-auto object-contain max-h-64 mx-auto"
                    />
                  </div>
                  <button
                    onClick={handleCancelImage}
                    className="absolute top-2 right-2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
                    title="Remove image"
                  >
                    <XCircle size={20} className="text-red-500" />
                  </button>
                </div>
                
                <button
                  onClick={handleImageSubmit}
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-4 w-4" />
                      Processing...
                    </>
                  ) : 'Extract Data'}
                </button>
              </div>
            )}
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">AI Extraction</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 transition-colors focus:outline-none"
          >
            <XCircle size={24} />
          </button>
        </div>
        
        {/* Body */}
        <div className="p-6">
          {/* Tabs */}
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('text')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'text'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <FileText size={16} />
                <span>Text</span>
              </button>
              <button
                onClick={() => setActiveTab('voice')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'voice'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Mic size={16} />
                <span>Voice</span>
              </button>
              <button
                onClick={() => setActiveTab('image')}
                className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === 'image'
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <ImageIcon size={16} />
                <span>Image</span>
              </button>
            </nav>
          </div>
          
          {/* Tab Content */}
          <div className="mt-6">
            {renderTabContent()}
          </div>
          
          {/* Results */}
          {result && (
            <div className="mt-8">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Extracted Data</h4>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 overflow-hidden">
                <pre className="text-sm text-gray-800 whitespace-pre-wrap overflow-auto max-h-64">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIReceiptExtraction;