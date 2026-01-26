/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef, useEffect } from 'react';
import { FaPlus, FaTrash, FaEye, FaTimes, FaSave, FaUpload } from 'react-icons/fa';
import styles from '@/styles/pages/admin/AdminPage.module.css';
import formStyles from '@/styles/components/admin/TourForm.module.css';

// Extended Tour type with all fields from legacy admin
interface TourFull {
  _id: string;
  title: string;
  title_de: string;
  category: string;
  category_de: string;
  travelType: string;
  travelType_de: string;
  price: number;
  priceEUR?: number;
  description: string;
  description_de: string;
  transportation: string;
  transportation_de: string;
  location: string;
  location_de: string;
  details: string;
  details_de: string;
  description2: string;
  description2_de: string;
  daysAndDurations: string;
  daysAndDurations_de: string;
  pickup: string;
  pickup_de: string;
  briefing: string;
  briefing_de: string;
  trip: string;
  trip_de: string;
  program: string;
  program_de: string;
  foodAndBeverages: string;
  foodAndBeverages_de: string;
  whatToTake: string;
  whatToTake_de: string;
  pickupLocation: string;
  pickupLocation_de: string;
  vanLocation: string;
  vanLocation_de: string;
  location1: string;
  location1_de: string;
  location2: string;
  location2_de: string;
  location3: string;
  location3_de: string;
  location4: string;
  location4_de: string;
  location5: string;
  location5_de: string;
  location6: string;
  location6_de: string;
  image1: string;
  image2: string;
  image3: string;
  image4: string;
  isActive: boolean;
  onSale: boolean;
  discount: number;
  createdAt: string;
  updatedAt: string;
}

const durationOptions = ['1 day', '2 days', '3 days', '1 week', '2 weeks'];

const categoryColors: Record<string, string> = {
  adventure: '#f97316',
  cultural: '#8b5cf6',
  luxury: '#ef4444',
  family: '#22c55e',
  romantic: '#ec4899',
  historical: '#3b82f6',
  default: '#6b7280',
};

const emptyTour: Omit<TourFull, '_id' | 'createdAt' | 'updatedAt'> = {
  title: '',
  title_de: '',
  category: '',
  category_de: '',
  travelType: '1 day',
  travelType_de: '1 Tag',
  price: 0,
  description: '',
  description_de: '',
  transportation: '',
  transportation_de: '',
  location: '',
  location_de: '',
  details: '',
  details_de: '',
  description2: '',
  description2_de: '',
  daysAndDurations: '',
  daysAndDurations_de: '',
  pickup: '',
  pickup_de: '',
  briefing: '',
  briefing_de: '',
  trip: '',
  trip_de: '',
  program: '',
  program_de: '',
  foodAndBeverages: '',
  foodAndBeverages_de: '',
  whatToTake: '',
  whatToTake_de: '',
  pickupLocation: '',
  pickupLocation_de: '',
  vanLocation: '',
  vanLocation_de: '',
  location1: '',
  location1_de: '',
  location2: '',
  location2_de: '',
  location3: '',
  location3_de: '',
  location4: '',
  location4_de: '',
  location5: '',
  location5_de: '',
  location6: '',
  location6_de: '',
  image1: '',
  image2: '',
  image3: '',
  image4: '',
  isActive: true,
  onSale: false,
  discount: 0,
};

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function truncate(str: string, len: number) {
  return str.length > len ? str.slice(0, len) + '...' : str;
}

function getCategoryColor(category: string) {
  const key = category.toLowerCase();
  return categoryColors[key] || categoryColors.default;
}

export function ToursAdminPage() {
  const [tours, setTours] = useState<TourFull[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [_showForm, setShowForm] = useState(true);
  const [editingTour, setEditingTour] = useState<TourFull | null>(null);
  const [formData, setFormData] = useState(emptyTour);
  const [viewModal, setViewModal] = useState<TourFull | null>(null);
  const [deleteModal, setDeleteModal] = useState<TourFull | null>(null);
  const [saleModal, setSaleModal] = useState<{ tour: TourFull; discount: number } | null>(null);
  const [translationTourId, setTranslationTourId] = useState('');
  const [showTranslationForm, setShowTranslationForm] = useState(false);
  const [translationFormData, setTranslationFormData] = useState<Record<string, string>>({});
  const [imagePreview, setImagePreview] = useState<(string | null)[]>([null, null, null, null]);
  const fileInputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Filter tours based on search
  const filteredTours = tours.filter(
    (t) =>
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFormChange = (field: string, value: string | number | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageChange = async (index: number, file: File | null) => {
    if (file) {
      try {
        // Create form data for upload
        const formData = new FormData();
        formData.append('files', file);

        // Upload the file
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json().catch(() => ({}));
          throw new Error(
            `Upload failed: ${errorData.message || uploadResponse.statusText || 'Unknown error'}`
          );
        }

        const uploadResult = await uploadResponse.json();
        const uploadedUrl = uploadResult.data.urls[0];

        // Update preview
        setImagePreview((prev) => {
          const newPreviews = [...prev];
          newPreviews[index] = uploadedUrl;
          return newPreviews;
        });

        // Save URL to form data
        handleFormChange(`image${index + 1}`, uploadedUrl);

        console.log(`Image ${index + 1} uploaded successfully:`, uploadedUrl);
      } catch (error) {
        console.error('Upload failed:', error);
        alert(`Failed to upload image ${index + 1}. Please try again.`);
      }
    } else {
      // Clear the image
      setImagePreview((prev) => {
        const newPreviews = [...prev];
        newPreviews[index] = null;
        return newPreviews;
      });
      handleFormChange(`image${index + 1}`, '');
    }
  };

  const clearForm = () => {
    setFormData(emptyTour);
    setEditingTour(null);
    setImagePreview([null, null, null, null]);
  };

  // Fetch tours from API on mount
  const fetchTours = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/tours?isActive=false&limit=100');
      const result = await response.json();
      if (result.success && result.data?.tours) {
        // Map API response to TourFull type
        const apiTours = result.data.tours.map((tour: Record<string, unknown>) => ({
          ...tour,
          _id: (tour._id as string) || (tour.id as string),
        }));
        setTours(apiTours);
      }
    } catch (error) {
      console.error('Error fetching tours:', error);
      // Keep mock data on error
    } finally {
      setIsLoading(false);
    }
  };

  // Load tours on component mount
  useEffect(() => {
    fetchTours();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editingTour ? `/api/tours/${editingTour._id}` : '/api/tours';
      const method = editingTour ? 'PUT' : 'POST';

      // Prepare data for API
      const tourData = {
        title: formData.title,
        title_de: formData.title_de || undefined,
        price: Number(formData.price),
        travelType: formData.travelType,
        travelType_de: formData.travelType_de || undefined,
        category: formData.category,
        category_de: formData.category_de || undefined,
        description: formData.description,
        description_de: formData.description_de || undefined,
        transportation: formData.transportation || undefined,
        transportation_de: formData.transportation_de || undefined,
        location: formData.location || undefined,
        location_de: formData.location_de || undefined,
        details: formData.details || undefined,
        details_de: formData.details_de || undefined,
        description2: formData.description2 || undefined,
        description2_de: formData.description2_de || undefined,
        daysAndDurations: formData.daysAndDurations || undefined,
        daysAndDurations_de: formData.daysAndDurations_de || undefined,
        pickup: formData.pickup || undefined,
        pickup_de: formData.pickup_de || undefined,
        briefing: formData.briefing || undefined,
        briefing_de: formData.briefing_de || undefined,
        trip: formData.trip || undefined,
        trip_de: formData.trip_de || undefined,
        program: formData.program || undefined,
        program_de: formData.program_de || undefined,
        foodAndBeverages: formData.foodAndBeverages || undefined,
        foodAndBeverages_de: formData.foodAndBeverages_de || undefined,
        whatToTake: formData.whatToTake || undefined,
        whatToTake_de: formData.whatToTake_de || undefined,
        pickupLocation: formData.pickupLocation || undefined,
        pickupLocation_de: formData.pickupLocation_de || undefined,
        vanLocation: formData.vanLocation || undefined,
        vanLocation_de: formData.vanLocation_de || undefined,
        location1: formData.location1 || undefined,
        location1_de: formData.location1_de || undefined,
        location2: formData.location2 || undefined,
        location2_de: formData.location2_de || undefined,
        location3: formData.location3 || undefined,
        location3_de: formData.location3_de || undefined,
        location4: formData.location4 || undefined,
        location4_de: formData.location4_de || undefined,
        location5: formData.location5 || undefined,
        location5_de: formData.location5_de || undefined,
        location6: formData.location6 || undefined,
        location6_de: formData.location6_de || undefined,
        image1: formData.image1 || undefined,
        image2: formData.image2 || undefined,
        image3: formData.image3 || undefined,
        image4: formData.image4 || undefined,
        isActive: formData.isActive,
        onSale: formData.onSale,
        discount: Number(formData.discount) || 0,
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourData),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh tours list
        await fetchTours();
        clearForm();
        alert(editingTour ? 'Tour updated successfully!' : 'Tour created successfully!');
      } else {
        // Show error message
        const errorMsg = result.errors
          ? result.errors
              .map((e: { field: string; message: string }) => `${e.field}: ${e.message}`)
              .join('\n')
          : result.error || 'Failed to save tour';
        alert('Error: ' + errorMsg);
      }
    } catch (error) {
      console.error('Error saving tour:', error);
      alert('Error saving tour. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const startEdit = (tour: TourFull) => {
    setEditingTour(tour);
    setFormData({ ...tour });
    setImagePreview([tour.image1, tour.image2, tour.image3, tour.image4]);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async () => {
    if (deleteModal) {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/tours/${deleteModal._id}`, {
          method: 'DELETE',
        });
        const result = await response.json();

        if (result.success) {
          setTours((prev) => prev.filter((t) => t._id !== deleteModal._id));
          setDeleteModal(null);
          alert('Tour deleted successfully!');
        } else {
          alert('Error: ' + (result.error || 'Failed to delete tour'));
        }
      } catch (error) {
        console.error('Error deleting tour:', error);
        alert('Error deleting tour. Check console for details.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const toggleActive = async (tourId: string) => {
    const tour = tours.find((t) => t._id === tourId);
    if (!tour) return;

    try {
      const response = await fetch(`/api/tours/${tourId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !tour.isActive }),
      });
      const result = await response.json();

      if (result.success) {
        setTours((prev) =>
          prev.map((t) => (t._id === tourId ? { ...t, isActive: !t.isActive } : t))
        );
      } else {
        alert('Error: ' + (result.error || 'Failed to update tour status'));
      }
    } catch (error) {
      console.error('Error toggling tour status:', error);
    }
  };

  const handleSaleToggle = async (tour: TourFull) => {
    if (tour.onSale) {
      // Turn off sale via API
      try {
        const response = await fetch(`/api/tours/${tour._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ onSale: false, discount: 0 }),
        });
        const result = await response.json();

        if (result.success) {
          setTours((prev) =>
            prev.map((t) => (t._id === tour._id ? { ...t, onSale: false, discount: 0 } : t))
          );
        } else {
          alert('Error: ' + (result.error || 'Failed to update sale status'));
        }
      } catch (error) {
        console.error('Error toggling sale:', error);
      }
    } else {
      // Open modal to set discount
      setSaleModal({ tour, discount: 10 });
    }
  };

  const confirmSale = async () => {
    if (saleModal) {
      try {
        const response = await fetch(`/api/tours/${saleModal.tour._id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ onSale: true, discount: saleModal.discount }),
        });
        const result = await response.json();

        if (result.success) {
          setTours((prev) =>
            prev.map((t) =>
              t._id === saleModal.tour._id
                ? { ...t, onSale: true, discount: saleModal.discount }
                : t
            )
          );
          setSaleModal(null);
        } else {
          alert('Error: ' + (result.error || 'Failed to set sale'));
        }
      } catch (error) {
        console.error('Error setting sale:', error);
      }
    }
  };

  const handleTranslationSelect = (tourId: string) => {
    setTranslationTourId(tourId);
    if (tourId) {
      const tour = tours.find((t) => t._id === tourId);
      if (tour) {
        // Populate form with existing German translations (or empty strings)
        setTranslationFormData({
          title_de: tour.title_de || '',
          category_de: tour.category_de || '',
          travelType_de: tour.travelType_de || '',
          priceEUR: tour.priceEUR != null ? String(tour.priceEUR) : '',
          description_de: tour.description_de || '',
          description2_de: tour.description2_de || '',
          transportation_de: tour.transportation_de || '',
          location_de: tour.location_de || '',
          details_de: tour.details_de || '',
          daysAndDurations_de: tour.daysAndDurations_de || '',
          pickup_de: tour.pickup_de || '',
          briefing_de: tour.briefing_de || '',
          trip_de: tour.trip_de || '',
          program_de: tour.program_de || '',
          foodAndBeverages_de: tour.foodAndBeverages_de || '',
          whatToTake_de: tour.whatToTake_de || '',
          pickupLocation_de: tour.pickupLocation_de || '',
          vanLocation_de: tour.vanLocation_de || '',
          location1_de: tour.location1_de || '',
          location2_de: tour.location2_de || '',
          location3_de: tour.location3_de || '',
          location4_de: tour.location4_de || '',
          location5_de: tour.location5_de || '',
          location6_de: tour.location6_de || '',
        });
        setShowTranslationForm(true);
      }
    } else {
      setShowTranslationForm(false);
      setTranslationFormData({});
    }
  };

  const handleTranslationFieldChange = (field: string, value: string) => {
    setTranslationFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveTranslation = async () => {
    if (!translationTourId) {
      alert('Please select a tour first');
      return;
    }

    setIsLoading(true);
    try {
      // Prepare only German translation fields
      const translationData: Record<string, string | number | null> = {};
      
      // Always include priceEUR in the update if it exists in form data (even if empty)
      if ('priceEUR' in translationFormData) {
        const priceEURValue = translationFormData.priceEUR;
        if (priceEURValue === '' || priceEURValue === null || priceEURValue === undefined) {
          translationData.priceEUR = null;
        } else {
          const numValue = parseFloat(String(priceEURValue));
          if (!isNaN(numValue) && numValue > 0) {
            translationData.priceEUR = numValue;
          } else {
            // If invalid or 0, set to null to clear the field
            translationData.priceEUR = null;
          }
        }
      }
      
      // Process all other German translation fields
      Object.keys(translationFormData).forEach((key) => {
        const value = translationFormData[key];
        // Skip priceEUR as it's already handled above
        if (key === 'priceEUR') {
          return;
        }
        if (key.endsWith('_de') && value) {
          if (typeof value === 'string' && value.trim()) {
            translationData[key] = value.trim();
          }
        }
      });

      const response = await fetch(`/api/tours/${translationTourId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(translationData),
      });

      const result = await response.json();

      if (result.success) {
        // Refresh tours list
        await fetchTours();
        alert('German translations saved successfully!');
        // Optionally clear the form
        setShowTranslationForm(false);
        setTranslationTourId('');
        setTranslationFormData({});
      } else {
        const errorMsg = result.error || 'Failed to save translations';
        alert('Error: ' + errorMsg);
      }
    } catch (error) {
      console.error('Error saving translations:', error);
      alert('Error saving translations. Check console for details.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedTranslationTour = tours.find((t) => t._id === translationTourId);

  return (
    <div className={styles.page}>
      {/* Header */}

      {/* Add/Edit Tour Form */}
      <div className={styles.card} style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #fc914a 0%, #ebc519 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FaPlus color="#000" />
            </div>
            <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>
              {editingTour ? 'Edit Tour' : 'Add New Tour'}
            </span>
          </div>
          <button className={styles.secondaryButton} onClick={clearForm}>
            <FaTimes /> Clear
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Basic Information Section */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem',
              }}
            >
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Tour Title *</label>
                <input
                  type="text"
                  className={formStyles.input}
                  value={formData.title}
                  onChange={(e) => handleFormChange('title', e.target.value)}
                  placeholder="Enter tour title"
                  maxLength={100}
                  required
                />
              </div>
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Category *</label>
                <select
                  className={formStyles.select}
                  value={formData.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  required
                >
                  <option value="">Select category</option>
                  <option value="Adventure">Adventure</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Historical">Historical</option>
                  <option value="Beach">Beach</option>
                  <option value="Desert">Desert</option>
                  <option value="Cruise">Cruise</option>
                  <option value="Luxury">Luxury</option>
                  <option value="Family">Family</option>
                  <option value="Romantic">Romantic</option>
                </select>
              </div>
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Duration *</label>
                <select
                  className={formStyles.select}
                  value={formData.travelType}
                  onChange={(e) => handleFormChange('travelType', e.target.value)}
                  required
                >
                  {durationOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt.charAt(0).toUpperCase() + opt.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Price ($) *</label>
                <input
                  type="number"
                  className={formStyles.input}
                  value={formData.price}
                  onChange={(e) => handleFormChange('price', parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>
          </div>

          {/* Tour Details Section */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                paddingBottom: '0.75rem',
                borderBottom: '2px solid hsl(var(--primary) / 0.2)',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#fff',
                }}
              >
                2
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'hsl(var(--foreground))',
                }}
              >
                Tour Details
              </h3>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
              }}
            >
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Description *</label>
                <textarea
                  className={formStyles.textarea}
                  value={formData.description}
                  onChange={(e) => handleFormChange('description', e.target.value)}
                  placeholder="Brief tour description for listings and previews..."
                  maxLength={2000}
                  required
                  style={{ minHeight: '100px' }}
                />
              </div>
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Additional Description (Optional)</label>
                <textarea
                  className={formStyles.textarea}
                  value={formData.description2}
                  onChange={(e) => handleFormChange('description2', e.target.value)}
                  placeholder="Extended tour description for detailed pages..."
                  style={{ minHeight: '100px' }}
                />
              </div>
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Location (Optional)</label>
                <input
                  type="text"
                  className={formStyles.input}
                  value={formData.location}
                  onChange={(e) => handleFormChange('location', e.target.value)}
                  placeholder="e.g., Paris, France or Multiple Destinations"
                />
              </div>
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Transportation (Optional)</label>
                <textarea
                  className={formStyles.textarea}
                  value={formData.transportation}
                  onChange={(e) => handleFormChange('transportation', e.target.value)}
                  placeholder="Transportation details, included services..."
                  style={{ minHeight: '80px' }}
                />
              </div>
            </div>
          </div>

          {/* Itinerary & Logistics Section */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                paddingBottom: '0.75rem',
                borderBottom: '2px solid hsl(var(--primary) / 0.2)',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#fff',
                }}
              >
                3
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'hsl(var(--foreground))',
                }}
              >
                Itinerary & Logistics
              </h3>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
              }}
            >
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Pickup Information (Optional)</label>
                <textarea
                  className={formStyles.textarea}
                  value={formData.pickup}
                  onChange={(e) => handleFormChange('pickup', e.target.value)}
                  placeholder="Hotel pickup times, meeting points, transportation details..."
                  style={{ minHeight: '80px' }}
                />
              </div>
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Welcome Briefing (Optional)</label>
                <textarea
                  className={formStyles.textarea}
                  value={formData.briefing}
                  onChange={(e) => handleFormChange('briefing', e.target.value)}
                  placeholder="Welcome meeting details, briefing schedule..."
                  style={{ minHeight: '80px' }}
                />
              </div>
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Daily Program (Optional)</label>
                <textarea
                  className={formStyles.textarea}
                  value={formData.program}
                  onChange={(e) => handleFormChange('program', e.target.value)}
                  placeholder="Daily schedule, activities, timings..."
                  style={{ minHeight: '80px' }}
                />
              </div>
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Trip Highlights (Optional)</label>
                <textarea
                  className={formStyles.textarea}
                  value={formData.trip}
                  onChange={(e) => handleFormChange('trip', e.target.value)}
                  placeholder="Key experiences, highlights of the tour..."
                  style={{ minHeight: '80px' }}
                />
              </div>
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Food & Beverages (Optional)</label>
                <textarea
                  className={formStyles.textarea}
                  value={formData.foodAndBeverages}
                  onChange={(e) => handleFormChange('foodAndBeverages', e.target.value)}
                  placeholder="Meals included, dining options, dietary considerations..."
                  style={{ minHeight: '80px' }}
                />
              </div>
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>What to Bring (Optional)</label>
                <textarea
                  className={formStyles.textarea}
                  value={formData.whatToTake}
                  onChange={(e) => handleFormChange('whatToTake', e.target.value)}
                  placeholder="Recommended clothing, gear, documents..."
                  style={{ minHeight: '80px' }}
                />
              </div>
            </div>
          </div>

          {/* Media Section */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                paddingBottom: '0.75rem',
                borderBottom: '2px solid hsl(var(--primary) / 0.2)',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#fff',
                }}
              >
                4
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'hsl(var(--foreground))',
                }}
              >
                Media & Images
              </h3>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '1.5rem',
              }}
            >
              {[1, 2, 3, 4].map((num, idx) => (
                <div key={num} className={formStyles.formGroup}>
                  <label className={formStyles.label}>Tour Image {num} (Optional)</label>
                  <div
                    style={{
                      border: '2px dashed hsl(var(--border))',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      textAlign: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      background: 'hsl(var(--muted) / 0.2)',
                      minHeight: '120px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                    }}
                    onClick={() => fileInputRefs[idx].current?.click()}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'hsl(var(--primary))';
                      e.currentTarget.style.background = 'hsl(var(--primary) / 0.05)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'hsl(var(--border))';
                      e.currentTarget.style.background = 'hsl(var(--muted) / 0.2)';
                    }}
                  >
                    <input
                      ref={fileInputRefs[idx]}
                      type="file"
                      accept="image/*"
                      style={{ display: 'none' }}
                      onChange={(e) => handleImageChange(idx, e.target.files?.[0] || null)}
                    />
                    {imagePreview[idx] ? (
                      <div style={{ width: '100%', position: 'relative' }}>
                        <img
                          src={imagePreview[idx]!}
                          alt={`Preview ${num}`}
                          style={{
                            width: '100%',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginBottom: '0.5rem',
                          }}
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleImageChange(idx, null);
                          }}
                          style={{
                            position: 'absolute',
                            top: '4px',
                            right: '4px',
                            background: 'rgba(239, 68, 68, 0.9)',
                            border: 'none',
                            borderRadius: '50%',
                            width: '20px',
                            height: '20px',
                            color: 'white',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <>
                        <FaUpload
                          style={{
                            fontSize: '2rem',
                            color: 'hsl(var(--muted-foreground))',
                            marginBottom: '0.5rem',
                          }}
                        />
                        <p
                          style={{
                            margin: '0',
                            fontSize: '0.875rem',
                            color: 'hsl(var(--muted-foreground))',
                            fontWeight: '500',
                          }}
                        >
                          Click to upload image
                        </p>
                        <p
                          style={{
                            margin: '0.25rem 0 0',
                            fontSize: '0.75rem',
                            color: 'hsl(var(--muted-foreground))',
                          }}
                        >
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Locations Section */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                marginBottom: '1.5rem',
                paddingBottom: '0.75rem',
                borderBottom: '2px solid hsl(var(--primary) / 0.2)',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                  fontWeight: 'bold',
                  color: '#fff',
                }}
              >
                5
              </div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  color: 'hsl(var(--foreground))',
                }}
              >
                Locations & Stops
              </h3>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '1.5rem',
              }}
            >
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Pickup Location (Optional)</label>
                <input
                  type="text"
                  className={formStyles.input}
                  value={formData.pickupLocation}
                  onChange={(e) => handleFormChange('pickupLocation', e.target.value)}
                  placeholder="e.g., Hotel lobby, Airport terminal"
                />
              </div>
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Van/Bus Meeting Point (Optional)</label>
                <input
                  type="text"
                  className={formStyles.input}
                  value={formData.vanLocation}
                  onChange={(e) => handleFormChange('vanLocation', e.target.value)}
                  placeholder="e.g., Near main entrance, Parking lot A"
                />
              </div>
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <div key={num} className={formStyles.formGroup}>
                  <label className={formStyles.label}>Tour Stop {num} (Optional)</label>
                  <input
                    type="text"
                    className={formStyles.input}
                    value={formData[`location${num}` as keyof typeof formData] as string}
                    onChange={(e) => handleFormChange(`location${num}`, e.target.value)}
                    placeholder={`e.g., Eiffel Tower, Louvre Museum, Montmartre`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Form Buttons */}
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="submit" className={styles.primaryButton} disabled={isLoading}>
              <FaSave /> {isLoading ? 'Saving...' : editingTour ? 'Update Tour' : 'Add Tour'}
            </button>
            <button type="button" className={styles.secondaryButton}>
              <FaEye /> Preview
            </button>
          </div>
        </form>
      </div>

      {/* German Translation Section */}
      <div className={styles.card} style={{ marginBottom: '2rem' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            marginBottom: '1.5rem',
          }}
        >
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.25rem',
            }}
          >
            🌍
          </div>
          <span style={{ fontSize: '1.25rem', fontWeight: 600 }}>Manage German Translations</span>
        </div>

        <div className={formStyles.formGroup} style={{ maxWidth: '400px', marginBottom: '1.5rem' }}>
          <label className={formStyles.label}>Select Tour to Translate</label>
          <select
            className={formStyles.select}
            value={translationTourId}
            onChange={(e) => handleTranslationSelect(e.target.value)}
          >
            <option value="">Choose a tour...</option>
            {tours.map((t) => (
              <option key={t._id} value={t._id}>
                {t.title} ({t.category})
              </option>
            ))}
          </select>
        </div>

        {showTranslationForm && selectedTranslationTour && (
          <div>
            <div
              style={{
                padding: '1rem',
                background: 'hsl(var(--muted) / 0.3)',
                borderRadius: '8px',
                marginBottom: '1.5rem',
              }}
            >
              <p style={{ margin: 0, fontSize: '0.875rem', color: 'hsl(var(--muted-foreground))' }}>
                <strong>Translating:</strong> {selectedTranslationTour.title} ({selectedTranslationTour.category})
              </p>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))' }}>
                Fill in the German translations below. English values are shown as reference.
              </p>
            </div>

            {/* Basic Information */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600 }}>Basic Information</h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem',
                }}
              >
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>
                    Tour Title (German) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className={formStyles.input}
                    value={translationFormData.title_de || ''}
                    onChange={(e) => handleTranslationFieldChange('title_de', e.target.value)}
                    placeholder="Tour-Titel auf Deutsch"
                    required
                  />
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.25rem 0 0' }}>
                    EN: {selectedTranslationTour.title}
                  </p>
                </div>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>
                    Category (German) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="text"
                    className={formStyles.input}
                    value={translationFormData.category_de || ''}
                    onChange={(e) => handleTranslationFieldChange('category_de', e.target.value)}
                    placeholder="Kategorie auf Deutsch"
                    required
                  />
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.25rem 0 0' }}>
                    EN: {selectedTranslationTour.category}
                  </p>
                </div>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Duration (German)</label>
                  <input
                    type="text"
                    className={formStyles.input}
                    value={translationFormData.travelType_de || ''}
                    onChange={(e) => handleTranslationFieldChange('travelType_de', e.target.value)}
                    placeholder="z.B., 1 Tag, 2 Tage, 1 Woche"
                  />
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.25rem 0 0' }}>
                    EN: {selectedTranslationTour.travelType}
                  </p>
                </div>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Price (EUR)</label>
                  <input
                    type="number"
                    className={formStyles.input}
                    value={translationFormData.priceEUR || ''}
                    onChange={(e) => handleTranslationFieldChange('priceEUR', e.target.value)}
                    placeholder="Preis in Euro"
                    step="0.01"
                    min="0"
                  />
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.25rem 0 0' }}>
                    USD: ${selectedTranslationTour.price}
                  </p>
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600 }}>Descriptions</h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1rem',
                }}
              >
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>
                    Description (German) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <textarea
                    className={formStyles.textarea}
                    value={translationFormData.description_de || ''}
                    onChange={(e) => handleTranslationFieldChange('description_de', e.target.value)}
                    placeholder="Beschreibung auf Deutsch..."
                    required
                    style={{ minHeight: '120px' }}
                  />
                  <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.25rem 0 0' }}>
                    EN: {truncate(selectedTranslationTour.description, 100)}
                  </p>
                </div>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Additional Description (German)</label>
                  <textarea
                    className={formStyles.textarea}
                    value={translationFormData.description2_de || ''}
                    onChange={(e) => handleTranslationFieldChange('description2_de', e.target.value)}
                    placeholder="Zusätzliche Beschreibung auf Deutsch..."
                    style={{ minHeight: '120px' }}
                  />
                  {selectedTranslationTour.description2 && (
                    <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.25rem 0 0' }}>
                      EN: {truncate(selectedTranslationTour.description2, 100)}
                    </p>
                  )}
                </div>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Details (German)</label>
                  <textarea
                    className={formStyles.textarea}
                    value={translationFormData.details_de || ''}
                    onChange={(e) => handleTranslationFieldChange('details_de', e.target.value)}
                    placeholder="Details auf Deutsch..."
                    style={{ minHeight: '120px' }}
                  />
                  {selectedTranslationTour.details && (
                    <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.25rem 0 0' }}>
                      EN: {truncate(selectedTranslationTour.details, 100)}
                    </p>
                  )}
                </div>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Transportation (German)</label>
                  <textarea
                    className={formStyles.textarea}
                    value={translationFormData.transportation_de || ''}
                    onChange={(e) => handleTranslationFieldChange('transportation_de', e.target.value)}
                    placeholder="Transport auf Deutsch..."
                    style={{ minHeight: '120px' }}
                  />
                  {selectedTranslationTour.transportation && (
                    <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.25rem 0 0' }}>
                      EN: {truncate(selectedTranslationTour.transportation, 100)}
                    </p>
                  )}
                </div>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Location (German)</label>
                  <input
                    type="text"
                    className={formStyles.input}
                    value={translationFormData.location_de || ''}
                    onChange={(e) => handleTranslationFieldChange('location_de', e.target.value)}
                    placeholder="Standort auf Deutsch"
                  />
                  {selectedTranslationTour.location && (
                    <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.25rem 0 0' }}>
                      EN: {selectedTranslationTour.location}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Itinerary & Logistics */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600 }}>Itinerary & Logistics</h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                  gap: '1rem',
                }}
              >
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Pickup Information (German)</label>
                  <textarea
                    className={formStyles.textarea}
                    value={translationFormData.pickup_de || ''}
                    onChange={(e) => handleTranslationFieldChange('pickup_de', e.target.value)}
                    placeholder="Abholinformationen auf Deutsch..."
                    style={{ minHeight: '100px' }}
                  />
                  {selectedTranslationTour.pickup && (
                    <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.25rem 0 0' }}>
                      EN: {truncate(selectedTranslationTour.pickup, 80)}
                    </p>
                  )}
                </div>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Welcome Briefing (German)</label>
                  <textarea
                    className={formStyles.textarea}
                    value={translationFormData.briefing_de || ''}
                    onChange={(e) => handleTranslationFieldChange('briefing_de', e.target.value)}
                    placeholder="Willkommensbriefing auf Deutsch..."
                    style={{ minHeight: '100px' }}
                  />
                  {selectedTranslationTour.briefing && (
                    <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.25rem 0 0' }}>
                      EN: {truncate(selectedTranslationTour.briefing, 80)}
                    </p>
                  )}
                </div>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Daily Program (German)</label>
                  <textarea
                    className={formStyles.textarea}
                    value={translationFormData.program_de || ''}
                    onChange={(e) => handleTranslationFieldChange('program_de', e.target.value)}
                    placeholder="Tagesprogramm auf Deutsch..."
                    style={{ minHeight: '100px' }}
                  />
                  {selectedTranslationTour.program && (
                    <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.25rem 0 0' }}>
                      EN: {truncate(selectedTranslationTour.program, 80)}
                    </p>
                  )}
                </div>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Trip Highlights (German)</label>
                  <textarea
                    className={formStyles.textarea}
                    value={translationFormData.trip_de || ''}
                    onChange={(e) => handleTranslationFieldChange('trip_de', e.target.value)}
                    placeholder="Reisehighlights auf Deutsch..."
                    style={{ minHeight: '100px' }}
                  />
                  {selectedTranslationTour.trip && (
                    <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.25rem 0 0' }}>
                      EN: {truncate(selectedTranslationTour.trip, 80)}
                    </p>
                  )}
                </div>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Food & Beverages (German)</label>
                  <textarea
                    className={formStyles.textarea}
                    value={translationFormData.foodAndBeverages_de || ''}
                    onChange={(e) => handleTranslationFieldChange('foodAndBeverages_de', e.target.value)}
                    placeholder="Essen & Getränke auf Deutsch..."
                    style={{ minHeight: '100px' }}
                  />
                  {selectedTranslationTour.foodAndBeverages && (
                    <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.25rem 0 0' }}>
                      EN: {truncate(selectedTranslationTour.foodAndBeverages, 80)}
                    </p>
                  )}
                </div>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>What to Bring (German)</label>
                  <textarea
                    className={formStyles.textarea}
                    value={translationFormData.whatToTake_de || ''}
                    onChange={(e) => handleTranslationFieldChange('whatToTake_de', e.target.value)}
                    placeholder="Was mitzubringen ist auf Deutsch..."
                    style={{ minHeight: '100px' }}
                  />
                  {selectedTranslationTour.whatToTake && (
                    <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.25rem 0 0' }}>
                      EN: {truncate(selectedTranslationTour.whatToTake, 80)}
                    </p>
                  )}
                </div>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Days & Durations (German)</label>
                  <textarea
                    className={formStyles.textarea}
                    value={translationFormData.daysAndDurations_de || ''}
                    onChange={(e) => handleTranslationFieldChange('daysAndDurations_de', e.target.value)}
                    placeholder="Tage & Dauer auf Deutsch..."
                    style={{ minHeight: '100px' }}
                  />
                  {selectedTranslationTour.daysAndDurations && (
                    <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.25rem 0 0' }}>
                      EN: {truncate(selectedTranslationTour.daysAndDurations, 80)}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Locations */}
            <div style={{ marginBottom: '2rem' }}>
              <h4 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600 }}>Locations & Stops</h4>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                  gap: '1rem',
                }}
              >
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Pickup Location (German)</label>
                  <input
                    type="text"
                    className={formStyles.input}
                    value={translationFormData.pickupLocation_de || ''}
                    onChange={(e) => handleTranslationFieldChange('pickupLocation_de', e.target.value)}
                    placeholder="Abholort auf Deutsch"
                  />
                  {selectedTranslationTour.pickupLocation && (
                    <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.25rem 0 0' }}>
                      EN: {selectedTranslationTour.pickupLocation}
                    </p>
                  )}
                </div>
                <div className={formStyles.formGroup}>
                  <label className={formStyles.label}>Van/Bus Meeting Point (German)</label>
                  <input
                    type="text"
                    className={formStyles.input}
                    value={translationFormData.vanLocation_de || ''}
                    onChange={(e) => handleTranslationFieldChange('vanLocation_de', e.target.value)}
                    placeholder="Van/Bus Treffpunkt auf Deutsch"
                  />
                  {selectedTranslationTour.vanLocation && (
                    <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.25rem 0 0' }}>
                      EN: {selectedTranslationTour.vanLocation}
                    </p>
                  )}
                </div>
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <div key={num} className={formStyles.formGroup}>
                    <label className={formStyles.label}>Tour Stop {num} (German)</label>
                    <input
                      type="text"
                      className={formStyles.input}
                      value={translationFormData[`location${num}_de`] || ''}
                      onChange={(e) => handleTranslationFieldChange(`location${num}_de`, e.target.value)}
                      placeholder={`Tour-Stopp ${num} auf Deutsch`}
                    />
                    {selectedTranslationTour[`location${num}` as keyof typeof selectedTranslationTour] && (
                      <p style={{ fontSize: '0.75rem', color: 'hsl(var(--muted-foreground))', margin: '0.25rem 0 0' }}>
                        EN: {selectedTranslationTour[`location${num}` as keyof typeof selectedTranslationTour] as string}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button
                type="button"
                className={styles.primaryButton}
                onClick={handleSaveTranslation}
                disabled={isLoading}
              >
                <FaSave /> {isLoading ? 'Saving...' : 'Save German Translation'}
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => {
                  setShowTranslationForm(false);
                  setTranslationTourId('');
                  setTranslationFormData({});
                }}
              >
                <FaTrash /> Clear Form
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tours Table */}
      <div className={styles.card}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>All Tours</h2>
          <input
            type="text"
            className={formStyles.input}
            style={{ maxWidth: 300 }}
            placeholder="Search tours..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '0.875rem',
            }}
          >
            <thead>
              <tr style={{ borderBottom: '2px solid hsl(var(--border))' }}>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Image</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Title</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Category</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Duration</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Price</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Sale Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTours.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>📭</div>
                    <p style={{ margin: 0, color: 'hsl(var(--muted-foreground))' }}>
                      No tours found. Create your first tour above!
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTours.map((tour) => (
                  <tr
                    key={tour._id}
                    style={{
                      borderBottom: '1px solid hsl(var(--border))',
                      transition: 'background 0.2s',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.background = 'hsl(var(--muted) / 0.3)')
                    }
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '0.75rem' }}>
                      <div
                        style={{
                          width: 60,
                          height: 40,
                          borderRadius: '4px',
                          overflow: 'hidden',
                          background: 'hsl(var(--muted))',
                        }}
                      >
                        {tour.image1 ? (
                          <img
                            src={tour.image1}
                            alt={tour.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'hsl(var(--muted-foreground))',
                              fontSize: '0.75rem',
                            }}
                          >
                            No img
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div>
                        <strong>{tour.title}</strong>
                        <div
                          style={{
                            fontSize: '0.75rem',
                            color: 'hsl(var(--muted-foreground))',
                            maxWidth: 200,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {truncate(tour.description, 50)}
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <span
                        style={{
                          padding: '0.25rem 0.75rem',
                          borderRadius: '9999px',
                          fontSize: '0.75rem',
                          fontWeight: 500,
                          color: '#fff',
                          background: getCategoryColor(tour.category),
                        }}
                      >
                        {tour.category}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>{tour.travelType}</td>
                    <td style={{ padding: '0.75rem', fontWeight: 600 }}>${tour.price}</td>
                    <td style={{ padding: '0.75rem' }}>
                      {tour.onSale ? (
                        <span
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#fff',
                            background: '#ef4444',
                          }}
                        >
                          {tour.discount}% Off
                        </span>
                      ) : (
                        <span
                          style={{
                            padding: '0.25rem 0.5rem',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            color: 'hsl(var(--muted-foreground))',
                            background: 'hsl(var(--muted))',
                          }}
                        >
                          Not on Sale
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      {tour.isActive ? (
                        <span style={{ color: '#22c55e', fontWeight: 500 }}>✅ Active</span>
                      ) : (
                        <span style={{ color: '#ef4444', fontWeight: 500 }}>❌ Inactive</span>
                      )}
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => setViewModal(tour)}
                          style={{
                            padding: '0.5rem',
                            border: 'none',
                            borderRadius: '4px',
                            background: 'hsl(var(--muted))',
                            cursor: 'pointer',
                          }}
                          title="View"
                        >
                          👁
                        </button>
                        <button
                          onClick={() => handleSaleToggle(tour)}
                          style={{
                            padding: '0.5rem',
                            border: 'none',
                            borderRadius: '4px',
                            background: tour.onSale ? '#fef3c7' : 'hsl(var(--muted))',
                            cursor: 'pointer',
                          }}
                          title="Toggle Sale"
                        >
                          🏷️
                        </button>
                        <button
                          onClick={() => toggleActive(tour._id)}
                          style={{
                            padding: '0.5rem',
                            border: 'none',
                            borderRadius: '4px',
                            background: 'hsl(var(--muted))',
                            cursor: 'pointer',
                          }}
                          title="Toggle Status"
                        >
                          {tour.isActive ? '🔽' : '🔼'}
                        </button>
                        <button
                          onClick={() => startEdit(tour)}
                          style={{
                            padding: '0.5rem',
                            border: 'none',
                            borderRadius: '4px',
                            background: 'hsl(var(--muted))',
                            cursor: 'pointer',
                          }}
                          title="Edit"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => setDeleteModal(tour)}
                          style={{
                            padding: '0.5rem',
                            border: 'none',
                            borderRadius: '4px',
                            background: '#fee2e2',
                            cursor: 'pointer',
                          }}
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Tour Modal */}
      {viewModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '1rem',
          }}
          onClick={() => setViewModal(null)}
        >
          <div
            style={{
              background: 'hsl(var(--card))',
              borderRadius: '12px',
              maxWidth: 900,
              width: '100%',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '1.5rem',
                borderBottom: '1px solid hsl(var(--border))',
              }}
            >
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600 }}>Tour Details</h3>
              <button
                onClick={() => setViewModal(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer',
                  color: 'hsl(var(--muted-foreground))',
                }}
              >
                ×
              </button>
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '300px 1fr',
                gap: '1.5rem',
                padding: '1.5rem',
              }}
            >
              {/* Left Column */}
              <div>
                <div
                  style={{
                    width: '100%',
                    height: 200,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    background: 'hsl(var(--muted))',
                    marginBottom: '1rem',
                  }}
                >
                  {viewModal.image1 && (
                    <img
                      src={viewModal.image1}
                      alt={viewModal.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                </div>
                <div
                  style={{
                    padding: '1rem',
                    background: 'hsl(var(--muted) / 0.3)',
                    borderRadius: '8px',
                  }}
                >
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e' }}>
                      ${viewModal.price}
                    </span>
                  </div>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
                    <strong>Duration:</strong> {viewModal.travelType}
                  </p>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
                    <strong>Category:</strong>{' '}
                    <span
                      style={{
                        padding: '0.125rem 0.5rem',
                        borderRadius: '4px',
                        background: getCategoryColor(viewModal.category),
                        color: '#fff',
                        fontSize: '0.75rem',
                      }}
                    >
                      {viewModal.category}
                    </span>
                  </p>
                  <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
                    <strong>Status:</strong>{' '}
                    {viewModal.isActive ? (
                      <span style={{ color: '#22c55e' }}>Active</span>
                    ) : (
                      <span style={{ color: '#ef4444' }}>Inactive</span>
                    )}
                  </p>
                  {viewModal.location && (
                    <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
                      <strong>Location:</strong> {viewModal.location}
                    </p>
                  )}
                  {viewModal.transportation && (
                    <p style={{ margin: '0.5rem 0', fontSize: '0.875rem' }}>
                      <strong>Transportation:</strong> {viewModal.transportation}
                    </p>
                  )}
                </div>
              </div>
              {/* Right Column */}
              <div>
                <h2 style={{ margin: '0 0 1rem', fontSize: '1.5rem' }}>{viewModal.title}</h2>
                <p style={{ margin: '0 0 1rem', lineHeight: 1.6 }}>{viewModal.description}</p>
                {viewModal.description2 && (
                  <>
                    <h4 style={{ margin: '1rem 0 0.5rem', fontWeight: 600 }}>
                      Additional Description
                    </h4>
                    <p style={{ margin: 0, lineHeight: 1.6 }}>{viewModal.description2}</p>
                  </>
                )}
                {viewModal.details && (
                  <>
                    <h4 style={{ margin: '1rem 0 0.5rem', fontWeight: 600 }}>Details</h4>
                    <p style={{ margin: 0, lineHeight: 1.6 }}>{viewModal.details}</p>
                  </>
                )}
                {viewModal.daysAndDurations && (
                  <>
                    <h4 style={{ margin: '1rem 0 0.5rem', fontWeight: 600 }}>Days & Durations</h4>
                    <p style={{ margin: 0, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                      {viewModal.daysAndDurations}
                    </p>
                  </>
                )}
                {viewModal.pickup && (
                  <>
                    <h4 style={{ margin: '1rem 0 0.5rem', fontWeight: 600 }}>Pickup Information</h4>
                    <p style={{ margin: 0, lineHeight: 1.6 }}>{viewModal.pickup}</p>
                  </>
                )}
                {viewModal.briefing && (
                  <>
                    <h4 style={{ margin: '1rem 0 0.5rem', fontWeight: 600 }}>Briefing</h4>
                    <p style={{ margin: 0, lineHeight: 1.6 }}>{viewModal.briefing}</p>
                  </>
                )}
                {viewModal.trip && (
                  <>
                    <h4 style={{ margin: '1rem 0 0.5rem', fontWeight: 600 }}>Trip Details</h4>
                    <p style={{ margin: 0, lineHeight: 1.6 }}>{viewModal.trip}</p>
                  </>
                )}
                {viewModal.program && (
                  <>
                    <h4 style={{ margin: '1rem 0 0.5rem', fontWeight: 600 }}>Program</h4>
                    <p style={{ margin: 0, lineHeight: 1.6 }}>{viewModal.program}</p>
                  </>
                )}
                {viewModal.foodAndBeverages && (
                  <>
                    <h4 style={{ margin: '1rem 0 0.5rem', fontWeight: 600 }}>Food & Beverages</h4>
                    <p style={{ margin: 0, lineHeight: 1.6 }}>{viewModal.foodAndBeverages}</p>
                  </>
                )}
                {viewModal.whatToTake && (
                  <>
                    <h4 style={{ margin: '1rem 0 0.5rem', fontWeight: 600 }}>What to Take</h4>
                    <p style={{ margin: 0, lineHeight: 1.6 }}>{viewModal.whatToTake}</p>
                  </>
                )}
                <div
                  style={{
                    marginTop: '1.5rem',
                    paddingTop: '1rem',
                    borderTop: '1px solid hsl(var(--border))',
                    fontSize: '0.75rem',
                    color: 'hsl(var(--muted-foreground))',
                  }}
                >
                  <p style={{ margin: '0.25rem 0' }}>Created: {formatDate(viewModal.createdAt)}</p>
                  <p style={{ margin: '0.25rem 0' }}>Updated: {formatDate(viewModal.updatedAt)}</p>
                </div>
              </div>
            </div>
            <div
              style={{
                padding: '1rem 1.5rem',
                borderTop: '1px solid hsl(var(--border))',
                display: 'flex',
                justifyContent: 'flex-end',
              }}
            >
              <button className={styles.secondaryButton} onClick={() => setViewModal(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setDeleteModal(null)}
        >
          <div
            style={{
              background: 'hsl(var(--card))',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: 400,
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 1rem' }}>Delete Tour</h3>
            <p>
              Are you sure you want to delete <strong>{deleteModal.title}</strong>? This action
              cannot be undone.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'flex-end',
                marginTop: '1.5rem',
              }}
            >
              <button className={styles.secondaryButton} onClick={() => setDeleteModal(null)}>
                Cancel
              </button>
              <button className={styles.dangerButton} onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sale Discount Modal */}
      {saleModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setSaleModal(null)}
        >
          <div
            style={{
              background: 'hsl(var(--card))',
              borderRadius: '12px',
              padding: '2rem',
              maxWidth: 400,
              width: '90%',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 1rem' }}>Set Sale Discount</h3>
            <p style={{ marginBottom: '1rem' }}>
              Enter discount percentage for <strong>{saleModal.tour.title}</strong>
            </p>
            <div className={formStyles.formGroup}>
              <label className={formStyles.label}>Discount (%)</label>
              <input
                type="number"
                className={formStyles.input}
                value={saleModal.discount}
                onChange={(e) =>
                  setSaleModal((prev) =>
                    prev ? { ...prev, discount: parseInt(e.target.value) || 0 } : null
                  )
                }
                min="1"
                max="99"
              />
            </div>
            <div
              style={{
                display: 'flex',
                gap: '0.75rem',
                justifyContent: 'flex-end',
                marginTop: '1.5rem',
              }}
            >
              <button className={styles.secondaryButton} onClick={() => setSaleModal(null)}>
                Cancel
              </button>
              <button className={styles.primaryButton} onClick={confirmSale}>
                Apply Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
