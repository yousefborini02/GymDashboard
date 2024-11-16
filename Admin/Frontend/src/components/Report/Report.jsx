////////////////ok ok ok ok ok ok /////////////
import React, { useState, useEffect } from "react";
import { Search, Check, X, Trash2, ChevronDown, ChevronUp, Plus, MapPin, Edit, X as CloseIcon, Users } from "lucide-react";
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from "axios";

const ToggleSwitch = ({ isOn, onToggle, label }) => (
  <div className="flex items-center gap-2">
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        className="sr-only peer"
        checked={isOn}
        onChange={onToggle}
      />
      <div className={`w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 
        peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer 
        ${isOn ? 'bg-green-600' : 'bg-red-600'} 
        peer-checked:after:translate-x-full peer-checked:after:border-white 
        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
        after:bg-white after:border-gray-300 after:border after:rounded-full 
        after:h-5 after:w-5 after:transition-all`}
      />
    </label>
    <span className="text-sm font-medium text-gray-300">
      {label}
    </span>
  </div>
);

const Report = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [expandedReports, setExpandedReports] = useState({});

  // New state for gym section form
  const [showGymForm, setShowGymForm] = useState(false);
  const [gymFormData, setGymFormData] = useState({
    description: "",
    images: [],
    workingHours: [
      { day: "Sunday", openTime: "", closeTime: "" },
      { day: "Monday", openTime: "", closeTime: "" },
      { day: "Tuesday", openTime: "", closeTime: "" },
      { day: "Wednesday", openTime: "", closeTime: "" },
      { day: "Thursday", openTime: "", closeTime: "" },
      { day: "Friday", openTime: "", closeTime: "" },
      { day: "Saturday", openTime: "", closeTime: "" },
    ],
    facebookUrl: "",
    instagramUrl: "",
    phoneNumber: "",
    city: "",
    location: {
      type: "Point",
      coordinates: [35.9106, 31.9539]
    }
  });
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [gymSections, setGymSections] = useState([]);
  const [editingSection, setEditingSection] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showVisitorsModal, setShowVisitorsModal] = useState(false);
  const [selectedSectionVisits, setSelectedSectionVisits] = useState([]);
  const [loadingVisits, setLoadingVisits] = useState(false);

  useEffect(() => {
    fetchGymSections();
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('GymToken');
    console.log('Current token:', token);
    if (token) {
      try {
        // Decode token to check its contents (this is safe as it's just base64 decoding)
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        console.log('Token payload:', tokenPayload);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  const fetchGymSections = async () => {
    try {
      const token = localStorage.getItem('GymToken');
      if (!token) {
        alert('Please login first');
        return;
      }

      console.log('Sending request with token:', token); // Debug log

      const response = await axios.get("http://localhost:4001/api/gym-sections/my-sections", {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response:', response.data); // Debug log
      setGymSections(response.data);
    } catch (error) {
      console.error("Error fetching gym sections:", error.response || error);
      alert(error.response?.data?.message || "Failed to fetch gym sections");
    }
  };

  const handleEditSection = (section) => {
    setEditingSection({
      ...section,
      isOpen: section.isOpen ?? false,
      workingHours: section.workingHours.map(wh => ({
        ...wh,
        openTime: wh.openTime,
        closeTime: wh.closeTime
      }))
    });
    setShowEditModal(true);
  };

  const handleUpdateSection = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('GymToken');
      
      if (!token) {
        alert('You must be logged in to update a gym section');
        return;
      }

      const dataToSend = {
        ...editingSection,
        images: editingSection.images.map(img => {
          return img.includes('base64,') ? img.split('base64,')[1] : img;
        })
      };

      await axios.put(
        `http://localhost:4001/api/gym-sections/${editingSection._id}`,
        dataToSend,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      alert("Gym section updated successfully!");
      setShowEditModal(false);
      setEditingSection(null);
      fetchGymSections();
    } catch (error) {
      console.error("Error updating gym section:", error);
      alert(error.response?.data?.message || "Failed to update gym section");
    }
  };

  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = reports.filter(
      (report) =>
        (report.reporter_id &&
          report.reporter_id.username &&
          report.reporter_id.username.toLowerCase().includes(term)) ||
        report.reason.toLowerCase().includes(term) ||
        report.status.toLowerCase().includes(term) ||
        (report.comment_id &&
          report.comment_id.user_id &&
          report.comment_id.user_id.username &&
          report.comment_id.user_id.username.toLowerCase().includes(term)) ||
        (report.comment_id &&
          report.comment_id.comment_text &&
          report.comment_id.comment_text.toLowerCase().includes(term))
    );
    setFilteredReports(filtered);
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:4001/api/reports/${id}`, {
        status: newStatus,
      });
      fetchReports();
    } catch (error) {
      console.error("Error updating report status:", error);
      alert("Failed to update report status. Please try again.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(
        `http://localhost:4001/api/reports/comments/${commentId}`
      );
      fetchReports();
      alert("Comment and associated reports deleted successfully.");
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    }
  };

  const toggleReportExpansion = (reportId) => {
    setExpandedReports((prev) => ({
      ...prev,
      [reportId]: !prev[reportId],
    }));
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500";
      case "reviewed":
        return "bg-blue-500";
      case "resolved":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const handleAddImageUrl = (isEditing = false) => {
    const imageUrlInput = document.getElementById('imageUrl');
    const imageUrl = imageUrlInput.value.trim();
    
    if (!imageUrl) return;

    // Basic URL validation
    try {
      new URL(imageUrl);
    } catch (e) {
      alert('Please enter a valid URL');
      return;
    }

    if (isEditing) {
      setEditingSection(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
    } else {
      setGymFormData(prev => ({
        ...prev,
        images: [...prev.images, imageUrl]
      }));
    }
    
    // Reset the input
    imageUrlInput.value = '';
  };

  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setSelectedLocation({ lat, lng });
    setGymFormData(prev => ({
      ...prev,
      location: {
        type: "Point",
        coordinates: [lng, lat]
      }
    }));
  };

  const handleWorkingHoursChange = (index, field, value) => {
    const newWorkingHours = [...gymFormData.workingHours];
    newWorkingHours[index] = {
      ...newWorkingHours[index],
      [field]: value
    };
    setGymFormData(prev => ({
      ...prev,
      workingHours: newWorkingHours
    }));
  };

  const handleSubmitGymSection = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('GymToken');
      
      if (!token) {
        alert('You must be logged in to add a gym section');
        return;
      }

      // Send the data with base64 images directly
      const response = await axios.post(
        "http://localhost:4001/api/gym-sections", 
        gymFormData,  // The images are already base64 strings
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      alert("Gym section added successfully!");
      setShowGymForm(false);
      // Reset form
      setGymFormData({
        description: "",
        images: [],
        workingHours: gymFormData.workingHours.map(wh => ({ ...wh, openTime: "", closeTime: "" })),
        facebookUrl: "",
        instagramUrl: "",
        phoneNumber: "",
        city: "",
        location: {
          type: "Point",
          coordinates: [35.9106, 31.9539]
        }
      });
      fetchGymSections(); // Refresh the list
    } catch (error) {
      console.error("Error adding gym section:", error);
      alert(error.response?.data?.message || "Failed to add gym section");
    }
  };

  // Add this new section to your return statement, before or after the reports section
  const renderGymSectionForm = () => (
    <div className="bg-gray-800 rounded-lg p-6 mb-8">
      <h2 className="text-2xl font-bold text-gray-100 mb-6">Add New Gym Section</h2>
      <form onSubmit={handleSubmitGymSection} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-300 mb-2">City</label>
            <select
              className="w-full bg-gray-700 text-white rounded-lg p-2"
              value={gymFormData.city}
              onChange={(e) => setGymFormData(prev => ({ ...prev, city: e.target.value }))}
              required
            >
              <option value="">Select City</option>
              {['Zarqa', 'Amman', 'Irbid', 'Aqaba', "Ma'an", 'Karak', 'Madaba', 'Ajloun', 'Jerash', 'Balqa', 'Tafilah'].map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">Description</label>
            <textarea
              className="w-full bg-gray-700 text-white rounded-lg p-2"
              value={gymFormData.description}
              onChange={(e) => setGymFormData(prev => ({ ...prev, description: e.target.value }))}
              required
              rows="4"
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Phone Number</label>
            <input
              type="tel"
              className="w-full bg-gray-700 text-white rounded-lg p-2"
              value={gymFormData.phoneNumber}
              onChange={(e) => setGymFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
              required
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Facebook URL</label>
            <input
              type="url"
              className="w-full bg-gray-700 text-white rounded-lg p-2"
              value={gymFormData.facebookUrl}
              onChange={(e) => setGymFormData(prev => ({ ...prev, facebookUrl: e.target.value }))}
            />
          </div>

          <div>
            <label className="block text-gray-300 mb-2">Instagram URL</label>
            <input
              type="url"
              className="w-full bg-gray-700 text-white rounded-lg p-2"
              value={gymFormData.instagramUrl}
              onChange={(e) => setGymFormData(prev => ({ ...prev, instagramUrl: e.target.value }))}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">Images</label>
            <div className="flex gap-2">
              <input
                type="url"
                id="imageUrl"
                name="imageUrl"
                placeholder="Enter image URL"
                className="flex-1 bg-gray-700 text-white rounded-lg p-2"
              />
              <button
                type="button"
                onClick={() => handleAddImageUrl(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Add Image
              </button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {gymFormData.images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`Preview ${index + 1}`}
                    className="w-20 h-20 object-cover rounded"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/80?text=Error';
                      console.warn('Preview image failed to load:', img);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setGymFormData(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index)
                      }));
                    }}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 
                               opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-4">Working Hours</label>
            <div className="space-y-4">
              {gymFormData.workingHours.map((wh, index) => (
                <div key={wh.day} className="flex items-center space-x-4">
                  <span className="text-gray-300 w-24">{wh.day}</span>
                  <input
                    type="time"
                    className="bg-gray-700 text-white rounded-lg p-2"
                    value={wh.openTime}
                    onChange={(e) => handleWorkingHoursChange(index, 'openTime', e.target.value)}
                    required
                  />
                  <span className="text-gray-300">to</span>
                  <input
                    type="time"
                    className="bg-gray-700 text-white rounded-lg p-2"
                    value={wh.closeTime}
                    onChange={(e) => handleWorkingHoursChange(index, 'closeTime', e.target.value)}
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-300 mb-2">Location</label>
            <LoadScript googleMapsApiKey="AIzaSyDM6_CMJoXRbu_cztvxTBqwrf16rI0lc5Y">
              <GoogleMap
                mapContainerClassName="w-full h-96 rounded-lg"
                center={selectedLocation || { lat: 31.9539, lng: 35.9106 }}
                zoom={13}
                onClick={handleMapClick}
              >
                {selectedLocation && (
                  <Marker position={selectedLocation} />
                )}
              </GoogleMap>
            </LoadScript>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setShowGymForm(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Add Gym Section
          </button>
        </div>
      </form>
    </div>
  );

  const renderEditModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-100">Edit Gym Section</h2>
          <div className="flex items-center gap-4">
            <ToggleSwitch
              isOn={editingSection?.isOpen}
              onToggle={() => setEditingSection(prev => ({
                ...prev,
                isOpen: !prev.isOpen
              }))}
              label={editingSection?.isOpen ? "Operating" : "Closed"}
            />
            <button
              onClick={() => setShowEditModal(false)}
              className="text-gray-400 hover:text-white"
            >
              <CloseIcon size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleUpdateSection} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-gray-300 mb-2">City</label>
              <select
                className="w-full bg-gray-700 text-white rounded-lg p-2"
                value={editingSection?.city || ""}
                onChange={(e) => setEditingSection(prev => ({ ...prev, city: e.target.value }))}
                required
              >
                <option value="">Select City</option>
                {['Zarqa', 'Amman', 'Irbid', 'Aqaba', "Ma'an", 'Karak', 'Madaba', 'Ajloun', 'Jerash', 'Balqa', 'Tafilah'].map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">Description</label>
              <textarea
                className="w-full bg-gray-700 text-white rounded-lg p-2"
                value={editingSection?.description || ""}
                onChange={(e) => setEditingSection(prev => ({ ...prev, description: e.target.value }))}
                required
                rows="4"
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Phone Number</label>
              <input
                type="tel"
                className="w-full bg-gray-700 text-white rounded-lg p-2"
                value={editingSection?.phoneNumber || ""}
                onChange={(e) => setEditingSection(prev => ({ ...prev, phoneNumber: e.target.value }))}
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Facebook URL</label>
              <input
                type="url"
                className="w-full bg-gray-700 text-white rounded-lg p-2"
                value={editingSection?.facebookUrl || ""}
                onChange={(e) => setEditingSection(prev => ({ ...prev, facebookUrl: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-gray-300 mb-2">Instagram URL</label>
              <input
                type="url"
                className="w-full bg-gray-700 text-white rounded-lg p-2"
                value={editingSection?.instagramUrl || ""}
                onChange={(e) => setEditingSection(prev => ({ ...prev, instagramUrl: e.target.value }))}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">Images</label>
              <div className="flex gap-2">
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  placeholder="Enter image URL"
                  className="flex-1 bg-gray-700 text-white rounded-lg p-2"
                />
                <button
                  type="button"
                  onClick={() => handleAddImageUrl(true)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  Add Image
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {(editingSection ? editingSection?.images : gymFormData.images).map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/80?text=Error';
                        console.warn('Preview image failed to load:', img);
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (editingSection) {
                          setEditingSection(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index)
                          }));
                        } else {
                          setGymFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== index)
                          }));
                        }
                      }}
                      className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 
                                 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-4">Working Hours</label>
              <div className="space-y-4">
                {editingSection?.workingHours.map((wh, index) => (
                  <div key={wh.day} className="flex items-center space-x-4">
                    <span className="text-gray-300 w-24">{wh.day}</span>
                    <input
                      type="time"
                      className="bg-gray-700 text-white rounded-lg p-2"
                      value={wh.openTime}
                      onChange={(e) => handleWorkingHoursChange(index, 'openTime', e.target.value)}
                      required
                    />
                    <span className="text-gray-300">to</span>
                    <input
                      type="time"
                      className="bg-gray-700 text-white rounded-lg p-2"
                      value={wh.closeTime}
                      onChange={(e) => handleWorkingHoursChange(index, 'closeTime', e.target.value)}
                      required
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-gray-300 mb-2">Location</label>
              <LoadScript googleMapsApiKey="AIzaSyDM6_CMJoXRbu_cztvxTBqwrf16rI0lc5Y">
                <GoogleMap
                  mapContainerClassName="w-full h-96 rounded-lg"
                  center={selectedLocation || { lat: 31.9539, lng: 35.9106 }}
                  zoom={13}
                  onClick={handleMapClick}
                >
                  {selectedLocation && (
                    <Marker position={selectedLocation} />
                  )}
                </GoogleMap>
              </LoadScript>
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => setShowEditModal(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Update Gym Section
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const fetchVisitors = async (gymSectionId) => {
    try {
      setLoadingVisits(true);
      const token = localStorage.getItem('GymToken');
      
      console.log('Fetching visitors for section:', gymSectionId);
      
      const response = await axios.get(
        `http://localhost:4001/api/gym-sections/${gymSectionId}/visits`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log('Visitors response:', response.data);
      setSelectedSectionVisits(response.data);
    } catch (error) {
      console.error("Error fetching visitors:", error);
      const errorMessage = error.response?.data?.message || "Failed to fetch visitors";
      alert(errorMessage);
      setSelectedSectionVisits([]); // Reset to empty array on error
    } finally {
      setLoadingVisits(false);
    }
  };

  const handleShowVisitors = async (sectionId) => {
    await fetchVisitors(sectionId);
    setShowVisitorsModal(true);
  };

  const renderVisitorsModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-100">Visitors History</h2>
          <button
            onClick={() => setShowVisitorsModal(false)}
            className="text-gray-400 hover:text-white"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        {loadingVisits ? (
          <div className="text-center text-gray-300">Loading visitors...</div>
        ) : selectedSectionVisits.length === 0 ? (
          <div className="text-center text-gray-300">No visitors found</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Visitor Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Visit Date & Time
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {selectedSectionVisits.map((visit) => (
                  <tr key={visit._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {visit.userId.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {visit.userId.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                      {new Date(visit.visitDateTime).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="bg-gray-900 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-100">Gym Sections</h1>
          <button
            onClick={() => setShowGymForm(!showGymForm)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Gym Section
          </button>
        </div>

        {showGymForm && renderGymSectionForm()}
        {showEditModal && renderEditModal()}
        {showVisitorsModal && renderVisitorsModal()}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gymSections.map((section) => (
            <div
              key={section._id}
              className="bg-gray-800 rounded-lg overflow-hidden shadow-lg relative"
            >
              <div className="absolute top-2 right-2 z-10">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold
                  ${section.isOpen ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
                  {section.isOpen ? 'Operating' : 'Closed'}
                </span>
              </div>
              {section.images.length > 0 && (
                <img
                  src={section.images[0]}
                  alt="Gym"
                  className="w-full h-48 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'; // Fallback image
                    console.warn('Image failed to load:', section.images[0]);
                  }}
                />
              )}
              <div className="p-4">
                <h3 className="text-xl font-semibold text-gray-100 mb-2">
                  {section.city}
                </h3>
                <p className="text-gray-300 mb-4 line-clamp-3">
                  {section.description}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">
                    Rating: {section.averageRating}/10
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleShowVisitors(section._id)}
                      className="px-3 py-1 bg-purple-600 text-white rounded hover:bg-purple-700 flex items-center"
                    >
                      <Users size={16} className="mr-1" />
                      Visitors
                    </button>
                    <button
                      onClick={() => handleEditSection(section)}
                      className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 flex items-center"
                    >
                      <Edit size={16} className="mr-1" />
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Report;





// import React, { useState, useEffect } from "react";
// import { Search, Check, X, Trash2, ChevronDown, ChevronUp, Plus, MapPin, Edit, X as CloseIcon, Users } from "lucide-react";
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
// import axios from "axios";

// const ToggleSwitch = ({ isOn, onToggle, label }) => (
//   <div className="flex items-center gap-2">
//     <label className="relative inline-flex items-center cursor-pointer">
//       <input
//         type="checkbox"
//         className="sr-only peer"
//         checked={isOn}
//         onChange={onToggle}
//       />
//       <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-4 
//         peer-focus:ring-[#3CB347]/20 rounded-full 
//         ${isOn ? 'bg-[#3CB347]' : 'bg-[#444]'} 
//         peer-checked:after:translate-x-full peer-checked:after:border-white 
//         after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
//         after:bg-white after:border-gray-300 after:border after:rounded-full 
//         after:h-5 after:w-5 after:transition-all`}
//       />
//     </label>
//     <span className="text-sm font-medium text-gray-300">{label}</span>
//   </div>
// );

// const Report = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [reports, setReports] = useState([]);
//   const [filteredReports, setFilteredReports] = useState([]);
//   const [expandedReports, setExpandedReports] = useState({});
//   const [showGymForm, setShowGymForm] = useState(false);
//   const [gymFormData, setGymFormData] = useState({
//     description: "",
//     images: [],
//     workingHours: [
//       { day: "Sunday", openTime: "", closeTime: "" },
//       { day: "Monday", openTime: "", closeTime: "" },
//       { day: "Tuesday", openTime: "", closeTime: "" },
//       { day: "Wednesday", openTime: "", closeTime: "" },
//       { day: "Thursday", openTime: "", closeTime: "" },
//       { day: "Friday", openTime: "", closeTime: "" },
//       { day: "Saturday", openTime: "", closeTime: "" },
//     ],
//     facebookUrl: "",
//     instagramUrl: "",
//     phoneNumber: "",
//     city: "",
//     location: {
//       type: "Point",
//       coordinates: [35.9106, 31.9539]
//     }
//   });
//   const [selectedLocation, setSelectedLocation] = useState(null);
//   const [gymSections, setGymSections] = useState([]);
//   const [editingSection, setEditingSection] = useState(null);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [showVisitorsModal, setShowVisitorsModal] = useState(false);
//   const [selectedSectionVisits, setSelectedSectionVisits] = useState([]);
//   const [loadingVisits, setLoadingVisits] = useState(false);

//   useEffect(() => {
//     fetchGymSections();
//   }, []);

//   const fetchGymSections = async () => {
//     try {
//       const token = localStorage.getItem('GymToken');
//       if (!token) {
//         alert('Please login first');
//         return;
//       }

//       const response = await axios.get("http://localhost:4001/api/gym-sections/my-sections", {
//         headers: {
//           'Authorization': `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       });
      
//       setGymSections(response.data);
//     } catch (error) {
//       console.error("Error fetching gym sections:", error);
//       alert(error.response?.data?.message || "Failed to fetch gym sections");
//     }
//   };

//   const handleEditSection = (section) => {
//     setEditingSection({
//       ...section,
//       isOpen: section.isOpen ?? false,
//       workingHours: section.workingHours.map(wh => ({
//         ...wh,
//         openTime: wh.openTime,
//         closeTime: wh.closeTime
//       }))
//     });
//     setShowEditModal(true);
//   };

//   const handleUpdateSection = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('GymToken');
      
//       if (!token) {
//         alert('You must be logged in to update a gym section');
//         return;
//       }

//       const dataToSend = {
//         ...editingSection,
//         images: editingSection.images.map(img => {
//           return img.includes('base64,') ? img.split('base64,')[1] : img;
//         })
//       };

//       await axios.put(
//         `http://localhost:4001/api/gym-sections/${editingSection._id}`,
//         dataToSend,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       alert("Gym section updated successfully!");
//       setShowEditModal(false);
//       setEditingSection(null);
//       fetchGymSections();
//     } catch (error) {
//       console.error("Error updating gym section:", error);
//       alert(error.response?.data?.message || "Failed to update gym section");
//     }
//   };

//   const handleAddImageUrl = (isEditing = false) => {
//     const imageUrlInput = document.getElementById('imageUrl');
//     const imageUrl = imageUrlInput.value.trim();
    
//     if (!imageUrl) return;

//     try {
//       new URL(imageUrl);
//     } catch (e) {
//       alert('Please enter a valid URL');
//       return;
//     }

//     if (isEditing) {
//       setEditingSection(prev => ({
//         ...prev,
//         images: [...prev.images, imageUrl]
//       }));
//     } else {
//       setGymFormData(prev => ({
//         ...prev,
//         images: [...prev.images, imageUrl]
//       }));
//     }
    
//     imageUrlInput.value = '';
//   };

//   const handleMapClick = (e) => {
//     const lat = e.latLng.lat();
//     const lng = e.latLng.lng();
//     setSelectedLocation({ lat, lng });
//     setGymFormData(prev => ({
//       ...prev,
//       location: {
//         type: "Point",
//         coordinates: [lng, lat]
//       }
//     }));
//   };

//   const handleWorkingHoursChange = (index, field, value) => {
//     const newWorkingHours = [...gymFormData.workingHours];
//     newWorkingHours[index] = {
//       ...newWorkingHours[index],
//       [field]: value
//     };
//     setGymFormData(prev => ({
//       ...prev,
//       workingHours: newWorkingHours
//     }));
//   };

//   const handleSubmitGymSection = async (e) => {
//     e.preventDefault();
//     try {
//       const token = localStorage.getItem('GymToken');
      
//       if (!token) {
//         alert('You must be logged in to add a gym section');
//         return;
//       }

//       const response = await axios.post(
//         "http://localhost:4001/api/gym-sections", 
//         gymFormData,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       alert("Gym section added successfully!");
//       setShowGymForm(false);
//       setGymFormData({
//         description: "",
//         images: [],
//         workingHours: gymFormData.workingHours.map(wh => ({ ...wh, openTime: "", closeTime: "" })),
//         facebookUrl: "",
//         instagramUrl: "",
//         phoneNumber: "",
//         city: "",
//         location: {
//           type: "Point",
//           coordinates: [35.9106, 31.9539]
//         }
//       });
//       fetchGymSections();
//     } catch (error) {
//       console.error("Error adding gym section:", error);
//       alert(error.response?.data?.message || "Failed to add gym section");
//     }
//   };

//   const fetchVisitors = async (gymSectionId) => {
//     try {
//       setLoadingVisits(true);
//       const token = localStorage.getItem('GymToken');
      
//       const response = await axios.get(
//         `http://localhost:4001/api/gym-sections/${gymSectionId}/visits`,
//         {
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );
      
//       setSelectedSectionVisits(response.data);
//     } catch (error) {
//       console.error("Error fetching visitors:", error);
//       alert(error.response?.data?.message || "Failed to fetch visitors");
//       setSelectedSectionVisits([]);
//     } finally {
//       setLoadingVisits(false);
//     }
//   };

//   const handleShowVisitors = async (sectionId) => {
//     await fetchVisitors(sectionId);
//     setShowVisitorsModal(true);
//   };

//   const renderGymSectionForm = () => (
//     <div className="bg-[#333] rounded-lg p-6 mb-8 border border-[#444]">
//       <h2 className="text-2xl font-bold text-[#3CB347] mb-6">Add New Gym Section</h2>
//       <form onSubmit={handleSubmitGymSection} className="space-y-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block text-gray-300 mb-2">City</label>
//             <select
//               className="w-full bg-[#444] text-white rounded-lg p-2 border border-[#3CB347]/20 
//                        focus:border-[#3CB347] focus:ring-1 focus:ring-[#3CB347] transition-all"
//               value={gymFormData.city}
//               onChange={(e) => setGymFormData(prev => ({ ...prev, city: e.target.value }))}
//               required
//             >
//               <option value="">Select City</option>
//               {['Zarqa', 'Amman', 'Irbid', 'Aqaba', "Ma'an", 'Karak', 'Madaba', 'Ajloun', 'Jerash', 'Balqa', 'Tafilah'].map(city => (
//                 <option key={city} value={city}>{city}</option>
//               ))}
//             </select>
//           </div>

//           <div className="md:col-span-2">
//             <label className="block text-gray-300 mb-2">Description</label>
//             <textarea
//               className="w-full bg-[#444] text-white rounded-lg p-2 border border-[#3CB347]/20 
//                        focus:border-[#3CB347] focus:ring-1 focus:ring-[#3CB347] transition-all"
//               value={gymFormData.description}
//               onChange={(e) => setGymFormData(prev => ({ ...prev, description: e.target.value }))}
//               required
//               rows="4"
//             />
//           </div>

//           {/* Contact Information */}
//           <div>
//             <label className="block text-gray-300 mb-2">Phone Number</label>
//             <input
//               type="tel"
//               className="w-full bg-[#444] text-white rounded-lg p-2 border border-[#3CB347]/20 
//                        focus:border-[#3CB347] focus:ring-1 focus:ring-[#3CB347] transition-all"
//               value={gymFormData.phoneNumber}
//               onChange={(e) => setGymFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
//               required
//             />
//           </div>

//           {/* Social Media Links */}
//           <div>
//             <label className="block text-gray-300 mb-2">Facebook URL</label>
//             <input
//               type="url"
//               className="w-full bg-[#444] text-white rounded-lg p-2 border border-[#3CB347]/20 
//                        focus:border-[#3CB347] focus:ring-1 focus:ring-[#3CB347] transition-all"
//               value={gymFormData.facebookUrl}
//               onChange={(e) => setGymFormData(prev => ({ ...prev, facebookUrl: e.target.value }))}
//             />
//           </div>

//           <div>
//             <label className="block text-gray-300 mb-2">Instagram URL</label>
//             <input
//               type="url"
//               className="w-full bg-[#444] text-white rounded-lg p-2 border border-[#3CB347]/20 
//                        focus:border-[#3CB347] focus:ring-1 focus:ring-[#3CB347] transition-all"
//               value={gymFormData.instagramUrl}
//               onChange={(e) => setGymFormData(prev => ({ ...prev, instagramUrl: e.target.value }))}
//             />
//           </div>

//           {/* Images Section */}
//           <div className="md:col-span-2">
//             <label className="block text-gray-300 mb-2">Images</label>
//             <div className="flex gap-2">
//               <input
//                 type="url"
//                 id="imageUrl"
//                 name="imageUrl"
//                 placeholder="Enter image URL"
//                 className="flex-1 bg-[#444] text-white rounded-lg p-2 border border-[#3CB347]/20 
//                          focus:border-[#3CB347] focus:ring-1 focus:ring-[#3CB347] transition-all"
//               />
//               <button
//                 type="button"
//                 onClick={() => handleAddImageUrl(false)}
//                 className="px-4 py-2 bg-[#3CB347] text-white rounded-lg hover:bg-[#3CB347]/80 
//                          transition-colors duration-200"
//               >
//                 Add Image
//               </button>
//             </div>
//             <div className="flex flex-wrap gap-2 mt-2">
//               {gymFormData.images.map((img, index) => (
//                 <div key={index} className="relative group">
//                   <img
//                     src={img}
//                     alt={`Preview ${index + 1}`}
//                     className="w-20 h-20 object-cover rounded"
//                     onError={(e) => {
//                       e.target.src = 'https://via.placeholder.com/80?text=Error';
//                     }}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => {
//                       setGymFormData(prev => ({
//                         ...prev,
//                         images: prev.images.filter((_, i) => i !== index)
//                       }));
//                     }}
//                     className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 
//                              opacity-0 group-hover:opacity-100 transition-opacity"
//                   >
//                     <X size={14} />
//                   </button>
//                 </div>
//               ))}
//             </div>
//           </div>

//         {/* Working Hours Section Continued */}
//         <div className="md:col-span-2">
//             <label className="block text-gray-300 mb-4">Working Hours</label>
//             <div className="space-y-4">
//               {gymFormData.workingHours.map((wh, index) => (
//                 <div key={wh.day} className="flex items-center space-x-4">
//                   <span className="text-gray-300 w-24">{wh.day}</span>
//                   <input
//                     type="time"
//                     className="bg-[#444] text-white rounded-lg p-2 border border-[#3CB347]/20 
//                              focus:border-[#3CB347] focus:ring-1 focus:ring-[#3CB347] transition-all"
//                     value={wh.openTime}
//                     onChange={(e) => handleWorkingHoursChange(index, 'openTime', e.target.value)}
//                     required
//                   />
//                   <span className="text-gray-300">to</span>
//                   <input
//                     type="time"
//                     className="bg-[#444] text-white rounded-lg p-2 border border-[#3CB347]/20 
//                              focus:border-[#3CB347] focus:ring-1 focus:ring-[#3CB347] transition-all"
//                     value={wh.closeTime}
//                     onChange={(e) => handleWorkingHoursChange(index, 'closeTime', e.target.value)}
//                     required
//                   />
//                 </div>
//               ))}
//             </div>
//           </div>

//           {/* Map Section */}
//           <div className="md:col-span-2">
//             <label className="block text-gray-300 mb-2">Location</label>
//             <LoadScript googleMapsApiKey="AIzaSyDM6_CMJoXRbu_cztvxTBqwrf16rI0lc5Y">
//               <GoogleMap
//                 mapContainerClassName="w-full h-96 rounded-lg"
//                 center={selectedLocation || { lat: 31.9539, lng: 35.9106 }}
//                 zoom={13}
//                 onClick={handleMapClick}
//               >
//                 {selectedLocation && (
//                   <Marker position={selectedLocation} />
//                 )}
//               </GoogleMap>
//             </LoadScript>
//           </div>
//         </div>

//         {/* Form Buttons */}
//         <div className="flex justify-end space-x-4">
//           <button
//             type="button"
//             onClick={() => setShowGymForm(false)}
//             className="px-4 py-2 bg-[#444] text-white rounded-lg hover:bg-[#333] 
//                      transition-colors duration-200"
//           >
//             Cancel
//           </button>
//           <button
//             type="submit"
//             className="px-4 py-2 bg-[#3CB347] text-white rounded-lg hover:bg-[#3CB347]/80 
//                      transition-colors duration-200"
//           >
//             Add Gym Section
//           </button>
//         </div>
//       </form>
//     </div>
//   );

//   const renderEditModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//       <div className="bg-[#333] rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#444]">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-[#3CB347]">Edit Gym Section</h2>
//           <div className="flex items-center gap-4">
//             <ToggleSwitch
//               isOn={editingSection?.isOpen}
//               onToggle={() => setEditingSection(prev => ({
//                 ...prev,
//                 isOpen: !prev.isOpen
//               }))}
//               label={editingSection?.isOpen ? "Operating" : "Closed"}
//             />
//             <button
//               onClick={() => setShowEditModal(false)}
//               className="text-gray-400 hover:text-[#3CB347] transition-colors"
//             >
//               <CloseIcon size={24} />
//             </button>
//           </div>
//         </div>

//         {/* Edit Form - Similar structure to Add Form but with editingSection data */}
//         {/* ... (Similar form structure as renderGymSectionForm but with editingSection values) */}
//       </div>
//     </div>
//   );

//   const renderVisitorsModal = () => (
//     <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
//       <div className="bg-[#333] rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-[#444]">
//         <div className="flex justify-between items-center mb-6">
//           <h2 className="text-2xl font-bold text-[#3CB347]">Visitors History</h2>
//           <button
//             onClick={() => setShowVisitorsModal(false)}
//             className="text-gray-400 hover:text-[#3CB347] transition-colors"
//           >
//             <CloseIcon size={24} />
//           </button>
//         </div>

//         {loadingVisits ? (
//           <div className="text-center text-gray-300">Loading visitors...</div>
//         ) : selectedSectionVisits.length === 0 ? (
//           <div className="text-center text-gray-300">No visitors found</div>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-[#444]">
//               <thead className="bg-[#444]">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
//                     Visitor Name
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
//                     Email
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
//                     Visit Date & Time
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-[#444]">
//                 {selectedSectionVisits.map((visit) => (
//                   <tr key={visit._id} className="hover:bg-[#444] transition-colors">
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                       {visit.userId.name}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                       {visit.userId.email}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
//                       {new Date(visit.visitDateTime).toLocaleString()}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );

//   return (
//     <div className="bg-black min-h-screen p-8">
//       <div className="max-w-6xl mx-auto">
//         <div className="flex justify-between items-center mb-8">
//           <h1 className="text-3xl font-bold text-[#3CB347]">Gym Sections</h1>
//           <button
//             onClick={() => setShowGymForm(!showGymForm)}
//             className="px-4 py-2 bg-[#3CB347] text-white rounded-lg hover:bg-[#3CB347]/80 
//                      transition-colors duration-200 flex items-center"
//           >
//             <Plus size={20} className="mr-2" />
//             Add Gym Section
//           </button>
//         </div>

//         {showGymForm && renderGymSectionForm()}
//         {showEditModal && renderEditModal()}
//         {showVisitorsModal && renderVisitorsModal()}

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {gymSections.map((section) => (
//             <div
//               key={section._id}
//               className="bg-[#333] rounded-lg overflow-hidden shadow-lg relative 
//                        border border-[#444] hover:border-[#3CB347]/50 transition-all duration-200"
//             >
//               <div className="absolute top-2 right-2 z-10">
//                 <span className={`px-2 py-1 rounded-full text-xs font-semibold
//                   ${section.isOpen ? 'bg-[#3CB347]' : 'bg-[#444]'} text-white`}>
//                   {section.isOpen ? 'Operating' : 'Closed'}
//                 </span>
//               </div>
//               {section.images.length > 0 && (
//                 <div className="relative h-48 overflow-hidden">
//                   <img
//                     src={section.images[0]}
//                     alt="Gym"
//                     className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-300"
//                     onError={(e) => {
//                       e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found';
//                     }}
//                   />
//                 </div>
//               )}
//               <div className="p-4">
//                 <h3 className="text-xl font-semibold text-[#3CB347] mb-2">
//                   {section.city}
//                 </h3>
//                 <p className="text-gray-300 mb-4 line-clamp-3">
//                   {section.description}
//                 </p>
//                 <div className="flex justify-between items-center">
//                   <span className="text-gray-400">
//                     Rating: {section.averageRating}/10
//                   </span>
//                   <div className="flex gap-2">
//                     <button
//                       onClick={() => handleShowVisitors(section._id)}
//                       className="px-3 py-1 bg-[#444] text-white rounded hover:bg-[#3CB347] 
//                                transition-colors duration-200 flex items-center"
//                     >
//                       <Users size={16} className="mr-1" />
//                       Visitors
//                     </button>
//                     <button
//                       onClick={() => handleEditSection(section)}
//                       className="px-3 py-1 bg-[#444] text-white rounded hover:bg-[#3CB347] 
//                                transition-colors duration-200 flex items-center"
//                     >
//                       <Edit size={16} className="mr-1" />
//                       Edit
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Report;
