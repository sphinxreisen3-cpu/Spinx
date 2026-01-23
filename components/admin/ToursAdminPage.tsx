/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef } from 'react';
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
  image1: '/images/tours/sample1.jpg',
  image2: '',
  image3: '',
  image4: '',
  isActive: true,
  onSale: false,
  discount: 0,
};

// Mock data
const initialTours: TourFull[] = [
  {
    _id: '1',
    title: 'Paris Adventure',
    title_de: 'Paris Abenteuer',
    category: 'Cultural',
    category_de: 'Kulturell',
    travelType: '1 week',
    travelType_de: '1 Woche',
    price: 1299,
    description:
      'Explore the city of lights with guided tours to the Eiffel Tower, Louvre, and more.',
    description_de:
      'Entdecken Sie die Stadt der Lichter mit Führungen zum Eiffelturm, Louvre und mehr.',
    transportation: 'Premium coach and Metro passes included',
    transportation_de: 'Premium-Bus und Metro-Pässe inklusive',
    location: 'Paris, France',
    location_de: 'Paris, Frankreich',
    details: 'Small group tours with professional guides',
    details_de: 'Kleingruppentouren mit professionellen Guides',
    description2: 'Perfect for couples and solo travelers',
    description2_de: 'Perfekt für Paare und Alleinreisende',
    daysAndDurations:
      'Day 1: Arrival, Day 2-3: Louvre & Montmartre, Day 4-5: Versailles, Day 6-7: Free time',
    daysAndDurations_de:
      'Tag 1: Ankunft, Tag 2-3: Louvre & Montmartre, Tag 4-5: Versailles, Tag 6-7: Freizeit',
    pickup: 'Hotel pickup at 8:00 AM',
    pickup_de: 'Abholung vom Hotel um 8:00 Uhr',
    briefing: 'Welcome briefing at 6:00 PM on Day 1',
    briefing_de: 'Willkommensbriefing um 18:00 Uhr am Tag 1',
    trip: 'All-inclusive cultural experience',
    trip_de: 'All-inclusive Kulturerlebnis',
    program: 'Morning tours, afternoon free time, evening activities',
    program_de: 'Vormittagstouren, Nachmittag Freizeit, Abendaktivitäten',
    foodAndBeverages: 'Daily breakfast, 3 gourmet dinners',
    foodAndBeverages_de: 'Tägliches Frühstück, 3 Gourmet-Abendessen',
    whatToTake: 'Comfortable shoes, camera, light jacket',
    whatToTake_de: 'Bequeme Schuhe, Kamera, leichte Jacke',
    pickupLocation: 'Hotel lobby',
    pickupLocation_de: 'Hotellobby',
    vanLocation: 'Near Louvre entrance',
    vanLocation_de: 'In der Nähe des Louvre-Eingangs',
    location1: 'Eiffel Tower',
    location1_de: 'Eiffelturm',
    location2: 'Louvre Museum',
    location2_de: 'Louvre Museum',
    location3: 'Montmartre',
    location3_de: 'Montmartre',
    location4: 'Versailles',
    location4_de: 'Versailles',
    location5: 'Seine River',
    location5_de: 'Seine Fluss',
    location6: 'Champs-Élysées',
    location6_de: 'Champs-Élysées',
    image1: '/images/tours/paris.jpg',
    image2: '/images/tours/paris2.jpg',
    image3: '/images/tours/paris3.jpg',
    image4: '/images/tours/paris4.jpg',
    isActive: true,
    onSale: false,
    discount: 0,
    createdAt: '2026-01-01T10:00:00.000Z',
    updatedAt: '2026-01-15T14:30:00.000Z',
  },
  {
    _id: '2',
    title: 'Safari Experience',
    title_de: 'Safari Erlebnis',
    category: 'Adventure',
    category_de: 'Abenteuer',
    travelType: '1 week',
    travelType_de: '1 Woche',
    price: 2499,
    description: 'Wildlife adventure in Africa with expert guides and luxury lodges.',
    description_de: 'Wildtierabenteuer in Afrika mit Expertenführern und Luxus-Lodges.',
    transportation: '4x4 Safari vehicles',
    transportation_de: '4x4 Safari-Fahrzeuge',
    location: 'Kenya & Tanzania',
    location_de: 'Kenia & Tansania',
    details: 'Witness the great migration',
    details_de: 'Erleben Sie die große Migration',
    description2: 'Includes all park fees and permits',
    description2_de: 'Alle Parkgebühren und Genehmigungen inklusive',
    daysAndDurations: 'Day 1-2: Nairobi, Day 3-5: Masai Mara, Day 6-7: Serengeti',
    daysAndDurations_de: 'Tag 1-2: Nairobi, Tag 3-5: Masai Mara, Tag 6-7: Serengeti',
    pickup: 'Airport pickup included',
    pickup_de: 'Flughafentransfer inklusive',
    briefing: 'Safari briefing on arrival day',
    briefing_de: 'Safari-Briefing am Ankunftstag',
    trip: 'Once-in-a-lifetime wildlife experience',
    trip_de: 'Einmaliges Wildtiererlebnis',
    program: 'Early morning and evening game drives',
    program_de: 'Frühmorgendliche und abendliche Pirschfahrten',
    foodAndBeverages: 'Full board with bush dinners',
    foodAndBeverages_de: 'Vollpension mit Bush-Dinner',
    whatToTake: 'Binoculars, neutral colored clothing, sunscreen',
    whatToTake_de: 'Fernglas, neutral farbene Kleidung, Sonnenschutz',
    pickupLocation: 'Jomo Kenyatta Airport',
    pickupLocation_de: 'Jomo Kenyatta Flughafen',
    vanLocation: 'Safari camp meeting point',
    vanLocation_de: 'Safari-Camp Treffpunkt',
    location1: 'Nairobi',
    location1_de: 'Nairobi',
    location2: 'Masai Mara',
    location2_de: 'Masai Mara',
    location3: 'Serengeti',
    location3_de: 'Serengeti',
    location4: 'Ngorongoro',
    location4_de: 'Ngorongoro',
    location5: '',
    location5_de: '',
    location6: '',
    location6_de: '',
    image1: '/images/tours/safari.jpg',
    image2: '/images/tours/safari2.jpg',
    image3: '',
    image4: '',
    isActive: true,
    onSale: true,
    discount: 20,
    createdAt: '2026-01-05T09:00:00.000Z',
    updatedAt: '2026-01-18T11:00:00.000Z',
  },
  {
    _id: '3',
    title: 'Egyptian Pyramids Tour',
    title_de: 'Ägyptische Pyramiden Tour',
    category: 'Historical',
    category_de: 'Historisch',
    travelType: '3 days',
    travelType_de: '3 Tage',
    price: 599,
    description: 'Explore ancient wonders with expert Egyptologists.',
    description_de: 'Erkunden Sie antike Wunder mit Expertenägyptologen.',
    transportation: 'Air-conditioned coach',
    transportation_de: 'Klimatisierter Bus',
    location: 'Cairo & Giza, Egypt',
    location_de: 'Kairo & Gizeh, Ägypten',
    details: 'Skip-the-line access to all sites',
    details_de: 'Ohne Anstehen Zugang zu allen Sehenswürdigkeiten',
    description2: 'Hotel accommodation included',
    description2_de: 'Hotelunterkunft inklusive',
    daysAndDurations: 'Day 1: Cairo Museum, Day 2: Pyramids & Sphinx, Day 3: Memphis & Saqqara',
    daysAndDurations_de: 'Tag 1: Kairo Museum, Tag 2: Pyramiden & Sphinx, Tag 3: Memphis & Saqqara',
    pickup: 'Hotel pickup at 7:00 AM',
    pickup_de: 'Abholung vom Hotel um 7:00 Uhr',
    briefing: 'Evening briefing at hotel',
    briefing_de: 'Abendbriefing im Hotel',
    trip: 'Journey through ancient history',
    trip_de: 'Reise durch die antike Geschichte',
    program: 'Full day tours with lunch breaks',
    program_de: 'Ganztägige Touren mit Mittagspausen',
    foodAndBeverages: 'Breakfast and lunch included',
    foodAndBeverages_de: 'Frühstück und Mittagessen inklusive',
    whatToTake: 'Sun hat, water bottle, comfortable shoes',
    whatToTake_de: 'Sonnenhut, Wasserflasche, bequeme Schuhe',
    pickupLocation: 'Cairo hotels',
    pickupLocation_de: 'Kairoer Hotels',
    vanLocation: 'Giza entrance',
    vanLocation_de: 'Gizeh Eingang',
    location1: 'Giza Pyramids',
    location1_de: 'Pyramiden von Gizeh',
    location2: 'Sphinx',
    location2_de: 'Sphinx',
    location3: 'Cairo Museum',
    location3_de: 'Kairo Museum',
    location4: 'Memphis',
    location4_de: 'Memphis',
    location5: 'Saqqara',
    location5_de: 'Saqqara',
    location6: '',
    location6_de: '',
    image1: '/images/tours/pyramids.jpg',
    image2: '/images/tours/sphinx.jpg',
    image3: '/images/tours/cairo.jpg',
    image4: '',
    isActive: false,
    onSale: false,
    discount: 0,
    createdAt: '2026-01-10T08:00:00.000Z',
    updatedAt: '2026-01-12T16:00:00.000Z',
  },
];

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
  const [tours, setTours] = useState<TourFull[]>(initialTours);
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

  const handleImageChange = (index: number, file: File | null) => {
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview((prev) => {
        const newPreviews = [...prev];
        newPreviews[index] = url;
        return newPreviews;
      });
      // In real implementation, this would upload the file
      handleFormChange(`image${index + 1}`, url);
    }
  };

  const clearForm = () => {
    setFormData(emptyTour);
    setEditingTour(null);
    setImagePreview([null, null, null, null]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      if (editingTour) {
        // Update existing tour
        setTours((prev) =>
          prev.map((t) =>
            t._id === editingTour._id
              ? { ...t, ...formData, updatedAt: new Date().toISOString() }
              : t
          )
        );
      } else {
        // Add new tour
        const newTour: TourFull = {
          ...formData,
          _id: `tour-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setTours((prev) => [newTour, ...prev]);
      }
      clearForm();
      setIsLoading(false);
    }, 500);
  };

  const startEdit = (tour: TourFull) => {
    setEditingTour(tour);
    setFormData({ ...tour });
    setImagePreview([tour.image1, tour.image2, tour.image3, tour.image4]);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = () => {
    if (deleteModal) {
      setTours((prev) => prev.filter((t) => t._id !== deleteModal._id));
      setDeleteModal(null);
    }
  };

  const toggleActive = (tourId: string) => {
    setTours((prev) => prev.map((t) => (t._id === tourId ? { ...t, isActive: !t.isActive } : t)));
  };

  const handleSaleToggle = (tour: TourFull) => {
    if (tour.onSale) {
      // Turn off sale
      setTours((prev) =>
        prev.map((t) => (t._id === tour._id ? { ...t, onSale: false, discount: 0 } : t))
      );
    } else {
      // Open modal to set discount
      setSaleModal({ tour, discount: 10 });
    }
  };

  const confirmSale = () => {
    if (saleModal) {
      setTours((prev) =>
        prev.map((t) =>
          t._id === saleModal.tour._id ? { ...t, onSale: true, discount: saleModal.discount } : t
        )
      );
      setSaleModal(null);
    }
  };

  const handleTranslationSelect = (tourId: string) => {
    setTranslationTourId(tourId);
    if (tourId) {
      const tour = tours.find((t) => t._id === tourId);
      if (tour) {
        // Populate form with English data as reference
        setShowTranslationForm(true);
      }
    } else {
      setShowTranslationForm(false);
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
                <input
                  type="text"
                  className={formStyles.input}
                  value={formData.category}
                  onChange={(e) => handleFormChange('category', e.target.value)}
                  placeholder="e.g., Adventure, Cultural, Luxury"
                  maxLength={50}
                  required
                />
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
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Tour Title (German)</label>
                <input
                  type="text"
                  className={formStyles.input}
                  defaultValue={selectedTranslationTour.title_de}
                  placeholder="Tour-Titel auf Deutsch"
                />
              </div>
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Category (German)</label>
                <input
                  type="text"
                  className={formStyles.input}
                  defaultValue={selectedTranslationTour.category_de}
                  placeholder="Kategorie auf Deutsch"
                />
              </div>
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Duration (German) - Read Only</label>
                <input
                  type="text"
                  className={formStyles.input}
                  value={selectedTranslationTour.travelType}
                  readOnly
                  style={{ background: 'hsl(var(--muted))', cursor: 'not-allowed' }}
                />
              </div>
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Price (German) - Read Only</label>
                <input
                  type="text"
                  className={formStyles.input}
                  value={`$${selectedTranslationTour.price}`}
                  readOnly
                  style={{ background: 'hsl(var(--muted))', cursor: 'not-allowed' }}
                />
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Description (German)</label>
                <textarea
                  className={formStyles.textarea}
                  defaultValue={selectedTranslationTour.description_de}
                  placeholder="Beschreibung auf Deutsch..."
                />
              </div>
              <div className={formStyles.formGroup}>
                <label className={formStyles.label}>Transportation (German)</label>
                <textarea
                  className={formStyles.textarea}
                  defaultValue={selectedTranslationTour.transportation_de}
                  placeholder="Transport auf Deutsch"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
              <button type="button" className={styles.primaryButton}>
                <FaSave /> Save German Translation
              </button>
              <button
                type="button"
                className={styles.secondaryButton}
                onClick={() => setShowTranslationForm(false)}
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
