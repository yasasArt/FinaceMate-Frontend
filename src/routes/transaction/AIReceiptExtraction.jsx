import React, { useState, useRef } from 'react';
import { XCircle, FileText, Mic, Image as ImageIcon } from 'lucide-react';
import { toast } from 'react-toastify';
import axios from 'axios';

// Configure axios to send cookies
axios.defaults.withCredentials = true;

function AIReceiptExtraction({ onClose }) {
  const [activeTab, setActiveTab] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isRecording, setIsRecording] = useState(false);
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const audioRef = useRef(null);

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
  ];

  const handleTextSubmit = async () => {
    if (!textInput.trim()) {
      toast.warning('Please enter receipt description');
      return;
    }
    await submitData({ text: textInput, language: selectedLanguage });
  };

  const handleVoiceRecording = () => {
    if (!isRecording) {
      // Start recording logic
      setIsRecording(true);
      toast.info('Recording started... Click again to stop');
    } else {
      // Stop recording logic
      setIsRecording(false);
      // For demo purposes, we'll just simulate a recorded file
      setAudioFile(new Blob(['Simulated audio data'], { type: 'audio/mp3' }));
      toast.success('Recording stopped');
    }
  };

  const handleVoiceSubmit = async () => {
    if (!audioFile) {
      toast.warning('Please record or upload an audio file');
      return;
    }
    const formData = new FormData();
    formData.append('audio', audioFile);
    formData.append('language', selectedLanguage);
    await submitData(formData);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, JPG)');
      return;
    }

    setImageFile(file);
    setPreviewImage(URL.createObjectURL(file));
    toast.success('Image uploaded successfully');
  };

  const handleImageSubmit = async () => {
    if (!imageFile) {
      toast.warning('Please upload an image');
      return;
    }
    const formData = new FormData();
    formData.append('image', imageFile);
    await submitData(formData);
  };

  const submitData = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        'http://127.0.0.1:8088/api/v1/receipt/extract-receipt',
        data,
        {
          headers: {
            'Content-Type': data instanceof FormData ? 'multipart/form-data' : 'application/json',
          },
          withCredentials: true,
        }
      );
      setResult(response.data);
      toast.success('Receipt extracted successfully!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to extract receipt');
      console.error('Error extracting receipt:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'text':
        return (
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1 font-medium">Select Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1 font-medium">Receipt Description*</label>
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Enter receipt description..."
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent h-32"
                required
              />
            </div>
            <button
              onClick={handleTextSubmit}
              disabled={!textInput.trim() || isLoading}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Extract Data'}
            </button>
          </div>
        );
      case 'voice':
        return (
          <div className="space-y-4">
            <div className="flex flex-col">
              <label className="text-gray-700 mb-1 font-medium">Select Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                {languages.map((lang) => (
                  <option key={lang.code} value={lang.code}>
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleVoiceRecording}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium ${
                  isRecording
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                <Mic size={18} />
                <span>{isRecording ? 'Stop Recording' : 'Record Voice'}</span>
              </button>
              {audioFile && (
                <button
                  onClick={() => audioRef.current.play()}
                  className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg font-medium flex items-center space-x-2"
                >
                  <Mic size={18} />
                  <span>Play Recording</span>
                </button>
              )}
              <audio ref={audioRef} src={audioFile && URL.createObjectURL(audioFile)} hidden />
            </div>
            {audioFile && (
              <button
                onClick={handleVoiceSubmit}
                disabled={isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Processing...' : 'Extract Data'}
              </button>
            )}
          </div>
        );
      case 'image':
        return (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <input
                type="file"
                accept="image/jpeg, image/png, image/jpg"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload"
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center justify-center space-y-2"
              >
                <ImageIcon className="text-gray-400" size={36} />
                <p className="text-sm text-gray-600">
                  Click to upload receipt image (JPEG, PNG, JPG)
                </p>
                <span className="text-xs text-gray-500">Max file size: 5MB</span>
              </label>
            </div>
            {previewImage && (
              <div className="mt-4 space-y-4">
                <img
                  src={previewImage}
                  alt="Receipt preview"
                  className="max-w-full h-auto max-h-64 rounded-lg border border-gray-200"
                />
                <button
                  onClick={handleImageSubmit}
                  disabled={isLoading}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Processing...' : 'Extract Data'}
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
    <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-center p-4 z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800">AI Receipt Extraction</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition-colors"
          >
            <XCircle size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          <button
            onClick={() => setActiveTab('text')}
            className={`px-4 py-2 font-medium flex items-center space-x-2 ${
              activeTab === 'text'
                ? 'border-b-2 border-purple-500 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText size={18} />
            <span>Text</span>
          </button>
          <button
            onClick={() => setActiveTab('voice')}
            className={`px-4 py-2 font-medium flex items-center space-x-2 ${
              activeTab === 'voice'
                ? 'border-b-2 border-purple-500 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Mic size={18} />
            <span>Voice</span>
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`px-4 py-2 font-medium flex items-center space-x-2 ${
              activeTab === 'image'
                ? 'border-b-2 border-purple-500 text-purple-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <ImageIcon size={18} />
            <span>Image</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="mt-4">{renderTabContent()}</div>

        {/* Results */}
        {result && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-bold text-lg mb-2 text-gray-800">Extracted Data</h4>
            <div className="bg-white p-3 rounded-md border border-gray-200 overflow-x-auto">
              <pre className="text-sm whitespace-pre-wrap">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AIReceiptExtraction;