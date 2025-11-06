// ContactList.jsx
import React, { useState, useMemo, useEffect } from 'react';
import { Search, Plus, User, Mail, Phone, X, Check, AlertCircle, Sparkles } from 'lucide-react';
import './ContactList.css';

const INITIAL_CONTACTS = [
  { id: 1, name: 'Aarav Sharma', email: 'aarav.sharma@email.com', phone: '+91 98765 43210', avatar: 'AS', color: 'from-purple-500 to-pink-500' },
  { id: 2, name: 'Diya Patel', email: 'diya.patel@email.com', phone: '+91 87654 32109', avatar: 'DP', color: 'from-blue-500 to-cyan-500' },
  { id: 3, name: 'Vivaan Kumar', email: 'vivaan.kumar@email.com', phone: '+91 76543 21098', avatar: 'VK', color: 'from-green-500 to-emerald-500' },
  { id: 4, name: 'Ananya Reddy', email: 'ananya.reddy@email.com', phone: '+91 65432 10987', avatar: 'AR', color: 'from-orange-500 to-red-500' },
  { id: 5, name: 'Arjun Desai', email: 'arjun.desai@email.com', phone: '+91 54321 09876', avatar: 'AD', color: 'from-indigo-500 to-purple-500' },
  { id: 6, name: 'Isha Iyer', email: 'isha.iyer@email.com', phone: '+91 43210 98765', avatar: 'II', color: 'from-pink-500 to-rose-500' },
  { id: 7, name: 'Kabir Mehta', email: 'kabir.mehta@email.com', phone: '+91 32109 87654', avatar: 'KM', color: 'from-teal-500 to-blue-500' },
  { id: 8, name: 'Saanvi Gupta', email: 'saanvi.gupta@email.com', phone: '+91 21098 76543', avatar: 'SG', color: 'from-yellow-500 to-orange-500' },
  { id: 9, name: 'Reyansh Singh', email: 'reyansh.singh@email.com', phone: '+91 10987 65432', avatar: 'RS', color: 'from-violet-500 to-fuchsia-500' },
  { id: 10, name: 'Aanya Nair', email: 'aanya.nair@email.com', phone: '+91 99876 54321', avatar: 'AN', color: 'from-cyan-500 to-blue-500' }
];

const ContactList = () => {
  const [contacts, setContacts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [notification, setNotification] = useState(null);
  const [isEditing, setIsEditing] =useState(false);
  const [currentContactId, setCurrentContactId]=useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    const fetchContacts = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setContacts(INITIAL_CONTACTS);
      setIsLoading(false);
    };
    
    fetchContacts();
  }, []);

  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    
    const query = searchQuery.toLowerCase();
    return contacts.filter(contact => 
      contact.name.toLowerCase().includes(query) ||
      contact.email.toLowerCase().includes(query)
    );
  }, [contacts, searchQuery]);

  // const handleDeleteContact= (id) => {
  //   setContacts(prevContacts => prevContacts.filter(contact =>contact.id !== id));
  //   showNotification('Contact deleted successfully','error');
  // }\

  const handleEditClick = (contact) => {
    setIsEditing(true);
    setCurrentContactId(contacts.id);
    setFormData({
      name: contact.name,
      email:contact.email,
      phone:contact.phone
    });
    setShowAddModal(true);
  };
   const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!formData.phone.trim()) {
      errors.phone = 'Phone is required';
    } else if (!/^[+]?[91]?[\s]?[6789]\d{9}$/.test(formData.phone.replace(/\s/g, ''))) {
      errors.phone = 'Phone number is invalid (use Indian format)';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Add new contact
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }


    if (isEditing) {
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API lag
    setContacts(prev => prev.map(contact => 
      contact.id === currentContactId 
        ? { ...contact, ...formData } // Update the contact
        : contact
    ));
    showNotification('Contact updated successfully! ✨');
  } else {

    const nameParts = formData.name.trim().split(' ');
    const avatar = nameParts.length > 1 
      ? `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase()
      : nameParts[0].substring(0, 2).toUpperCase();

    const colors = [
      'from-purple-500 to-pink-500',
      'from-blue-500 to-cyan-500',
      'from-green-500 to-emerald-500',
      'from-orange-500 to-red-500',
      'from-indigo-500 to-purple-500',
      'from-pink-500 to-rose-500'
    ];

    const newContact = {
      id: Date.now(),
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim(),
      avatar,
      color: colors[Math.floor(Math.random() * colors.length)]
    };

    await new Promise(resolve => setTimeout(resolve, 500));
    
    setContacts(prev => [newContact, ...prev]);
    setShowAddModal(false);
    setFormData({ name: '', email: '', phone: '' });
    setFormErrors({});
    showNotification('Contact added successfully! ✨'); }

    closeModal();
  };
  const closeModal = () => {
    setShowAddModal(false);
    setFormData({ name: '', email: '', phone: '' });
    setFormErrors({});
    setIsEditing(false);
    setCurrentContactId(null);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="contact-app">
      {/* Animated background gradients */}
      <div className="gradient-bg">
        <div className="gradient-orb orb-1"></div>
        <div className="gradient-orb orb-2"></div>
        <div className="gradient-orb orb-3"></div>
        <div className="gradient-orb orb-4"></div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`notification ${notification.type}`}>
          {notification.type === 'success' ? <Check size={20} /> : <AlertCircle size={20} />}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="app-header">
        <div className="header-container">
          <div className="header-content">
            <div className="header-left">
              <div className="header-icon">
                <Sparkles size={28} />
              </div>
              <div>
                <h1 className="header-title">My Contacts</h1>
                <p className="header-subtitle">
                  {contacts.length} {contacts.length === 1 ? 'contact' : 'contacts'} in your network
                </p>
              </div>
            </div>
            <button onClick={() => setShowAddModal(true)} className="btn-add">
              <Plus size={20} />
              <span>Add Contact</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {/* Search Bar */}
        <div className="search-container">
          <div className="search-wrapper">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="search-clear">
                <X size={18} />
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="loading-container">
            <div className="loader">
              <div className="loader-inner"></div>
            </div>
            <p className="loading-text">Loading your contacts...</p>
          </div>
        )}

        {/* Empty State - No Contacts */}
        {!isLoading && contacts.length === 0 && (
          <div className="empty-state glass-effect">
            <div className="empty-icon-wrapper">
              <User className="empty-icon" />
            </div>
            <h3 className="empty-title">No contacts yet</h3>
            <p className="empty-text">Start building your network by adding your first contact</p>
            <button onClick={() => setShowAddModal(true)} className="btn-add">
              <Plus size={20} />
              Add Your First Contact
            </button>
          </div>
        )}

        {/* Empty State - No Search Results */}
        {!isLoading && contacts.length > 0 && filteredContacts.length === 0 && (
          <div className="empty-state glass-effect">
            <div className="empty-icon-wrapper">
              <Search className="empty-icon" />
            </div>
            <h3 className="empty-title">No contacts found</h3>
            <p className="empty-text">Try searching with a different name or email</p>
            <button onClick={() => setSearchQuery('')} className="btn-secondary">
              Clear Search
            </button>
          </div>
        )}

        {/* Contact List */}
        {!isLoading && filteredContacts.length > 0 && (
          <div className="contact-grid">
            {filteredContacts.map((contact, index) => (
              <div 
                key={contact.id} 
                className="contact-card glass-effect"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
              {/* <button 
                className="btn-delete-contact" 
                onClick={() => handleDeleteContact(contact.id)}
                aria-label={`Delete ${contact.name}`}
              >
                <X size={18} />
              </button> */}
                <div className="contact-card-inner">
                  <div className="contact-header">
                    <div className={`contact-avatar bg-gradient-to-br ${contact.color}`}>
                      <span>{contact.avatar}</span>
                      <div className="avatar-shine"></div>
                    </div>
                  </div>
                  <div className="contact-body">
                    <h3 className="contact-name">{contact.name}</h3>
                    <div className="contact-details">
                      <div className="contact-detail">
                        <div className="detail-icon-wrapper">
                          <Mail className="contact-detail-icon" />
                        </div>
                        <span className="contact-detail-text">{contact.email}</span>
                      </div>
                      <div className="contact-detail">
                        <div className="detail-icon-wrapper">
                          <Phone className="contact-detail-icon" />
                        </div>
                        <span className="contact-detail-text">{contact.phone}</span>
                      </div>
                    </div>
                    <button 
                      className='btn-edit-contact'
                      onClick={() => handleEditClick(contact)}
                      > Edit </button>
                  </div>
                  <div className="card-glow"></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add Contact Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal glass-effect" onClick={(e) => e.stopPropagation()}>
            <div className="modal-shine"></div>
            <div className="modal-header">
              <div className="modal-header-content">
                <div className="modal-icon">
                  <User size={24} />
                </div>
                <h2 className="modal-title">
                {isEditing ? 'Edit Contact' : 'Add New Contact'}
              </h2>
                <button onClick={handleSubmit} className="btn btn-primary">
                <Plus size={18} />
                {isEditing ? 'Save Changes' : 'Add Contact'}
                </button>
              </div>
              <button onClick={closeModal} className="btn-close">
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="form-group">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={`form-input ${formErrors.name ? 'error' : ''}`}
                  placeholder="e.g., Arjun Sharma"
                />
                {formErrors.name && (
                  <p className="form-error">
                    <AlertCircle size={14} />
                    {formErrors.name}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={`form-input ${formErrors.email ? 'error' : ''}`}
                  placeholder="e.g., arjun.sharma@email.com"
                />
                {formErrors.email && (
                  <p className="form-error">
                    <AlertCircle size={14} />
                    {formErrors.email}
                  </p>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  className={`form-input ${formErrors.phone ? 'error' : ''}`}
                  placeholder="e.g., +91 98765 43210"
                />
                {formErrors.phone && (
                  <p className="form-error">
                    <AlertCircle size={14} />
                    {formErrors.phone}
                  </p>
                )}
              </div>

              <div className="form-actions">
                <button onClick={closeModal} className="btn btn-secondary">
                  Cancel
                </button>
                <button onClick={handleSubmit} className="btn btn-primary">
                  <Plus size={18} />
                  Add Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactList;
