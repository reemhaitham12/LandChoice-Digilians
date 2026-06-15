import React, { useEffect, useState } from 'react';
// import Loading from "../Components/Loading.jsx";
import {
  Globe, DollarSign, MessageSquare, Mail, MapPin, Send
} from 'lucide-react';

export default function AboutPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    category: 'Visa Assistance Services',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  
  // State for validation errors
  const [errors, setErrors] = useState({});

  // Auto-hide success/error message after 5 seconds
  useEffect(() => {
    if (submitStatus === 'success' || submitStatus === 'error') {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 5000); // 5 seconds
      
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  // Validation function
  const validateForm = () => {
    const newErrors = {};

    // Validate name - letters only (Arabic or English) and spaces
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    } else {
      // Allow Arabic letters, English letters, spaces, and dots
      const nameRegex = /^[a-zA-Z\u0600-\u06FF\s.]+$/;
      if (!nameRegex.test(formData.name.trim())) {
        newErrors.name = 'Name must contain only letters (Arabic or English) and spaces';
      }
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else {
      const emailRegex = /^[^\s@]+@([^\s@]+\.)+[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = 'Please enter a valid email address (e.g., name@example.com)';
      }
    }

    // Validate message
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    } else if (formData.message.trim().length > 1000) {
      newErrors.message = 'Message must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Run validation before submitting
    if (!validateForm()) {
      // Scroll to first error
      const firstError = document.querySelector('.error-border');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('https://back-end-pro.vercel.app/ad-request/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          companyName: formData.company,  
          category: formData.category,
          message: formData.message
        })
      });

      if (response.ok) {
        setSubmitStatus('success');
        // Reset form
        setFormData({
          name: '',
          email: '',
          company: '',
          category: 'Visa Assistance Services',
          message: ''
        });
        setErrors({}); // Clear errors on success
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle name input - prevent numbers and special characters
  const handleNameChange = (value) => {
    // Allow only letters (Arabic/English), spaces, and dots
    const filteredValue = value.replace(/[^a-zA-Z\u0600-\u06FF\s.]/g, '');
    setFormData({ ...formData, name: filteredValue });
    
    // Clear error for name field when user types
    if (errors.name) {
      setErrors({ ...errors, name: '' });
    }
  };

  // Clear specific error when user starts typing
  const handleInputChange = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error for this field when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <div className="min-h-screen text-white font-sans">
      {/* Hero Section */}
      <section className="pt-16 pb-12 px-6 text-center pt-32">
        <span className="inline-block px-4 py-1.5 text-xs font-semibold tracking-wider text-blue-300 bg-blue-500/10 border border-blue-500/20 rounded-full mb-6">
          OUR MISSION
        </span>

        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          About{' '}
          <span className="bg-gradient-to-r from-[#6C8FD9] to-[#f29706] bg-clip-text text-transparent">
            LandChoice
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-gray-400 text-sm md:text-base leading-relaxed">
          Simplifying the relocation journey for digital nomads and remote workers. We combine
          real-time visa guidelines, smart comparison tools, and active community insights in one
          seamless platform.
        </p>
      </section>

      {/* Features Grid */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          <FeatureCard
            icon={<div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Globe className="w-5 h-5 text-blue-400" /></div>}
            title="Visa Tracking & Guides"
            description="Stay informed with updated visa rules, income requirements, and step-by-step documentation checklists for destinations globally."
          />
          <FeatureCard
            icon={<div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><DollarSign className="w-5 h-5 text-blue-400" /></div>}
            title="Salary Checker & Tools"
            description="Check if your current monthly income matches the criteria of top digital nomad visas instantly using our intelligent matchers."
          />
          <FeatureCard
            icon={<div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><MessageSquare className="w-5 h-5 text-blue-400" /></div>}
            title="Nomad Community"
            description="Learn directly from digital nomads. Read timeline approval posts, local cost guides, and network with remote employees worldwide."
          />
        </div>
      </section>

      {/* Advertise Section */}
      <section className="px-6 pb-20 max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left Side */}
          <div className="pt-8">
            <div className="w-12 h-12 rounded-xl bg-yellow-500/10 flex items-center justify-center mb-6">
              <span className="text-yellow-500 font-bold text-lg">Ad</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">Advertise With Us</h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-8 max-w-md">
              Reach thousands of active remote workers, digital nomads, and expats looking for housing, flights,
              coworking spaces, tax advisory, or visa assistance.
            </p>

            <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-6 max-w-sm">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
                Direct Contact Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <Mail className="w-4 h-4 text-blue-400" />
                  <span>support@landchoice.com</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-300">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span>Customer Service Office (Global Support)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-8">
            <h3 className="text-lg font-semibold mb-1">Request an Advertisement</h3>
            <p className="text-gray-400 text-xs mb-6 leading-relaxed">
              Fill out the form below to send your request to our team.
              We will review your offer and get back to you!
            </p>

            {/* Success/Error Messages */}
            {submitStatus === 'success' && (
              <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg text-green-400 text-sm animate-in fade-in duration-300">
                ✓ Your request has been sent successfully! Our team will review it and get back to you shortly.
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm animate-in fade-in duration-300">
                ✗ Failed to send request. Please try again.
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Your Name <span className="text-red-400">*</span></label>
                  <input
                    type="text"
                    placeholder="e.g. John Doe or أحمد محمد"
                    className={`w-full bg-[#1E293B] border rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition ${
                      errors.name ? 'border-red-500 focus:border-red-500 error-border' : 'border-white/10'
                    }`}
                    value={formData.name}
                    onChange={e => handleNameChange(e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                  {!errors.name && formData.name.length > 0 && (
                    <p className="text-gray-500 text-xs mt-1">✓ Only letters (Arabic or English) and spaces allowed</p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Your Email <span className="text-red-400">*</span></label>
                  <input
                    type="email"
                    placeholder="e.g. john@example.com"
                    className={`w-full bg-[#1E293B] border rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition ${
                      errors.email ? 'border-red-500 focus:border-red-500 error-border' : 'border-white/10'
                    }`}
                    value={formData.email}
                    onChange={e => handleInputChange('email', e.target.value)}
                    required
                    disabled={isSubmitting}
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Company Name (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Nomad Stay Ltd"
                    className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition"
                    value={formData.company}
                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                    disabled={isSubmitting}
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Ad Category</label>
                  <select
                    className="w-full bg-[#1E293B] border border-white/10 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500/50 transition appearance-none"
                    value={formData.category}
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    disabled={isSubmitting}
                  >
                    <option>Visa Assistance Services</option>
                    <option>Housing & Rentals</option>
                    <option>Coworking Spaces</option>
                    <option>Flights & Travel</option>
                    <option>Tax Advisory</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Message & Ad Requirements <span className="text-red-400">*</span></label>
                <textarea
                  rows={4}
                  placeholder="Describe what services you would like to advertise, duration, and budget requirements... (minimum 10 characters)"
                  className={`w-full bg-[#1E293B] border rounded-lg px-3 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-blue-500/50 transition resize-none ${
                    errors.message ? 'border-red-500 focus:border-red-500 error-border' : 'border-white/10'
                  }`}
                  value={formData.message}
                  onChange={e => handleInputChange('message', e.target.value)}
                  required
                  disabled={isSubmitting}
                />
                {errors.message && (
                  <p className="text-red-400 text-xs mt-1">{errors.message}</p>
                )}
                {formData.message.length > 0 && formData.message.length < 10 && !errors.message && (
                  <p className="text-yellow-500 text-xs mt-1">Tip: Please provide at least 10 characters for better details</p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-500/50 disabled:cursor-not-allowed text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition mt-2"
              >
                <Send className="w-4 h-4" />
                {isSubmitting ? 'Sending...' : 'Submit Request'}
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="bg-[#0F172A] border border-white/5 rounded-2xl p-6 hover:border-white/10 transition">
      <div className="mb-4">{icon}</div>
      <h3 className="text-base font-semibold mb-3">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}